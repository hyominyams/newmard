import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

async function loadDotEnv(envPath = path.resolve(process.cwd(), ".env")) {
  try {
    const text = await fs.readFile(envPath, "utf8");
    for (const rawLine of text.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const equalsIndex = line.indexOf("=");
      if (equalsIndex === -1) continue;
      const key = line.slice(0, equalsIndex).trim();
      let value = line.slice(equalsIndex + 1).trim();
      if (!key) continue;
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = value;
    }
  } catch {
    // ignore missing/invalid .env
  }
}

function parseArgs(argv) {
  const options = {
    force: false,
    dryRun: false,
    size: "1600x900",
    delayMs: 350,
    writeCitiesData: false,
    sourceFallback: false,
    sourcesFile: null,
    initSourcesFile: null,
    requireAllSources: false,
    onlySources: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--force") options.force = true;
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--size") options.size = argv[++i] ?? options.size;
    else if (arg === "--delay-ms") options.delayMs = Number(argv[++i] ?? options.delayMs);
    else if (arg === "--write-cities-data") options.writeCitiesData = true;
    else if (arg === "--source-fallback") options.sourceFallback = true;
    else if (arg === "--sources-file") options.sourcesFile = argv[++i] ?? null;
    else if (arg === "--init-sources-file") options.initSourcesFile = argv[++i] ?? null;
    else if (arg === "--require-all-sources") options.requireAllSources = true;
    else if (arg === "--only-sources") options.onlySources = true;
    else if (arg === "--help" || arg === "-h") options.help = true;
    else throw new Error(`Unknown arg: ${arg}`);
  }

  if (!Number.isFinite(options.delayMs) || options.delayMs < 0) {
    throw new Error(`Invalid --delay-ms: ${options.delayMs}`);
  }

  if (options.sourcesFile !== null && options.sourcesFile.trim() === "") {
    throw new Error("Invalid --sources-file (empty path)");
  }

  if (options.initSourcesFile !== null && options.initSourcesFile.trim() === "") {
    throw new Error("Invalid --init-sources-file (empty path)");
  }

  if (!/^\d+x\d+$/.test(options.size)) {
    throw new Error(`Invalid --size (expected WxH like 1600x900): ${options.size}`);
  }

  return options;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function slugify(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function fetchWithRetry(url, init, { retries = 3 } = {}) {
  let lastError = null;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, init);
      if (response.status === 429 || response.status >= 500) {
        lastError = new Error(`HTTP ${response.status} for ${url}`);
        const retryAfter = Number(response.headers.get("retry-after") ?? "");
        const waitMs = Number.isFinite(retryAfter) ? retryAfter * 1000 : 500 * 2 ** attempt;
        await sleep(waitMs);
        continue;
      }
      return response;
    } catch (error) {
      lastError = error;
      await sleep(500 * 2 ** attempt);
    }
  }
  throw lastError ?? new Error(`Failed to fetch ${url}`);
}

async function unsplashSearchTopPhoto({ accessKey, query }) {
  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("content_filter", "high");
  url.searchParams.set("per_page", "1");

  const response = await fetchWithRetry(url, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
      "Accept-Version": "v1",
    },
  });

  if (!response.ok) {
    throw new Error(`Unsplash search failed: HTTP ${response.status}`);
  }

  const body = await response.json();
  const photo = Array.isArray(body?.results) ? body.results[0] : null;
  return photo ?? null;
}

async function unsplashSearchTopPhotoWithFallbacks({ accessKey, queries }) {
  for (const query of queries) {
    if (!query) continue;
    const photo = await unsplashSearchTopPhoto({ accessKey, query });
    if (photo) return { photo, queryUsed: query };
  }
  return { photo: null, queryUsed: null };
}

async function unsplashRegisterDownload({ accessKey, downloadLocation }) {
  if (!downloadLocation) return;
  const response = await fetchWithRetry(downloadLocation, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
      "Accept-Version": "v1",
    },
  });
  if (!response.ok) return;
  await response.arrayBuffer();
}

async function downloadToFile({ url, outPath, dryRun }) {
  if (dryRun) return { finalUrl: url, contentType: null, bytes: 0 };

  const response = await fetchWithRetry(url, { redirect: "follow" });
  if (!response.ok) {
    throw new Error(`Download failed: HTTP ${response.status} (${url})`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && !contentType.startsWith("image/")) {
    throw new Error(`Expected image but got ${contentType} (${url})`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(outPath, buffer);
  return { finalUrl: response.url, contentType, bytes: buffer.byteLength };
}

function printHelp() {
  console.log(`Download city images from Unsplash into public/images/city/

Usage:
  node scripts/download-city-images.mjs [--force] [--size 1600x900] [--delay-ms 350] [--dry-run] [--write-cities-data]
  node scripts/download-city-images.mjs --init-sources-file scripts/city-image-sources.json
  node scripts/download-city-images.mjs --sources-file scripts/city-image-sources.json [--only-sources] [--require-all-sources] [--force] [--delay-ms 2000] [--write-cities-data]

Env:
  UNSPLASH_ACCESS_KEY  Optional. If set, uses the official Unsplash API (better results + attribution).

Notes:
  - Without UNSPLASH_ACCESS_KEY, the script can optionally try source.unsplash.com via --source-fallback.
  - If Unsplash blocks automated requests in your environment, use --sources-file with direct image URLs copied from your browser.
`);
}

const options = parseArgs(process.argv.slice(2));
if (options.help) {
  printHelp();
  process.exit(0);
}

await loadDotEnv();

const rootDir = process.cwd();
const citiesModulePath = path.resolve(rootDir, "src/data/cities.js");
const publicCityDir = path.resolve(rootDir, "public/images/city");
const attributionPath = path.join(publicCityDir, "unsplash-attribution.json");

await fs.mkdir(publicCityDir, { recursive: true });

const citiesModule = await import(pathToFileURL(citiesModulePath).href);
const cities = citiesModule?.cities;
if (!Array.isArray(cities)) {
  throw new Error(`Expected an exported array named "cities" in ${citiesModulePath}`);
}

const accessKey = process.env.UNSPLASH_ACCESS_KEY?.trim() || null;
const timestamp = new Date().toISOString();

let attribution = [];
try {
  const existing = JSON.parse(await fs.readFile(attributionPath, "utf8"));
  if (Array.isArray(existing)) attribution = existing;
} catch {
}

const failures = [];
const downloadedOrExisting = [];

function defaultFileNameForCity(city) {
  const existingImagePath =
    typeof city?.image === "string" && city.image.startsWith("/images/city/") ? city.image : null;
  return existingImagePath ? path.basename(existingImagePath) : `${slugify(city?.name ?? city?.id ?? "city")}.jpg`;
}

let sourcesByCityId = new Map();
if (options.sourcesFile) {
  const sourcesPath = path.resolve(rootDir, options.sourcesFile);
  const raw = JSON.parse(await fs.readFile(sourcesPath, "utf8"));
  const list = Array.isArray(raw)
    ? raw
    : raw && typeof raw === "object"
      ? Object.entries(raw).map(([cityId, value]) => ({ cityId, ...(typeof value === "string" ? { url: value } : value) }))
      : [];

  sourcesByCityId = new Map(
    list
      .filter((item) => item && typeof item === "object")
      .map((item) => [item.cityId, item])
      .filter(([cityId, item]) => typeof cityId === "string" && cityId && typeof item.url === "string" && item.url)
  );
}

if (options.initSourcesFile) {
  const initPath = path.resolve(rootDir, options.initSourcesFile);
  const exists = await fileExists(initPath);
  if (exists && !options.force) {
    throw new Error(`Refusing to overwrite existing file (use --force): ${options.initSourcesFile}`);
  }

  const template = cities
    .map((city) => ({
      cityId: city?.id ?? null,
      fileName: defaultFileNameForCity(city),
      url: "",
      photoUrl: "",
      photographerName: "",
      photographerUrl: "",
    }))
    .filter((item) => typeof item.cityId === "string" && item.cityId);

  if (!options.dryRun) {
    await fs.mkdir(path.dirname(initPath), { recursive: true });
    await fs.writeFile(initPath, `${JSON.stringify(template, null, 2)}\n`, "utf8");
  }

  console.log(`${options.dryRun ? "dry  " : "wrote"} ${path.relative(rootDir, initPath)}`);
  process.exit(0);
}

if (!options.sourcesFile && !accessKey && !options.sourceFallback) {
  throw new Error(
    "UNSPLASH_ACCESS_KEY is not set. Create an Unsplash API key and run again, or pass --source-fallback to try source.unsplash.com."
  );
}

for (const city of cities) {
  const sourceOverride = sourcesByCityId.get(city?.id);
  if (options.onlySources && options.sourcesFile && !sourceOverride?.url) {
    console.log(`skip  ${city?.id ?? "unknown"} (not in sources-file)`);
    continue;
  }

  const existingImagePath =
    typeof city?.image === "string" && city.image.startsWith("/images/city/") ? city.image : null;

  const fileName = existingImagePath
    ? path.basename(existingImagePath)
    : typeof sourceOverride?.fileName === "string" && sourceOverride.fileName.trim()
      ? sourceOverride.fileName.trim()
      : `${slugify(city?.name ?? city?.id ?? "city")}.jpg`;

  if (path.basename(fileName) !== fileName) {
    throw new Error(`Invalid fileName for ${city?.id ?? "unknown"}: ${fileName}`);
  }

  const outPath = path.join(publicCityDir, fileName);
  const alreadyExists = await fileExists(outPath);

  if (alreadyExists && !options.force) {
    console.log(`skip  ${fileName} (already exists)`);
    downloadedOrExisting.push({ cityId: city?.id ?? null, fileName, outPath });
    continue;
  }

  const queryParts = [city?.name, city?.country, "city", "skyline"].filter(Boolean);
  const query = queryParts.join(" ");

  try {
    if (options.sourcesFile && !sourceOverride?.url && options.requireAllSources) {
      throw new Error(`No URL in --sources-file for cityId="${city?.id}"`);
    }

    if (options.sourcesFile && !sourceOverride?.url && !accessKey && !options.sourceFallback) {
      console.log(`skip  ${fileName} (missing url in sources-file)`);
      continue;
    }

    let record = {
      cityId: city?.id ?? null,
      cityName: city?.name ?? null,
      query,
      file: `/images/city/${fileName}`,
      source: sourceOverride?.url
        ? "manual-url"
        : accessKey
          ? "unsplash-api"
          : "unsplash-source",
      downloadedAt: timestamp,
    };

    if (sourceOverride?.url) {
      const download = await downloadToFile({ url: sourceOverride.url, outPath, dryRun: options.dryRun });
      record = {
        ...record,
        finalUrl: download.finalUrl,
        bytes: download.bytes,
        provided: {
          url: sourceOverride.url,
          photoUrl: sourceOverride.photoUrl ?? null,
          photographerName: sourceOverride.photographerName ?? null,
          photographerUrl: sourceOverride.photographerUrl ?? null,
        },
      };
    } else if (accessKey) {
      const queryFallbacks = [
        query,
        [city?.name, city?.country, "city"].filter(Boolean).join(" "),
        [city?.name, city?.country].filter(Boolean).join(" "),
        [city?.name, "city skyline"].filter(Boolean).join(" "),
      ];

      const { photo, queryUsed } = await unsplashSearchTopPhotoWithFallbacks({
        accessKey,
        queries: queryFallbacks,
      });

      if (!photo) throw new Error(`No Unsplash results for "${query}"`);

      await unsplashRegisterDownload({
        accessKey,
        downloadLocation: photo?.links?.download_location,
      });

      const imageUrl = new URL(photo.urls.raw);
      imageUrl.searchParams.set("w", options.size.split("x")[0]);
      imageUrl.searchParams.set("h", options.size.split("x")[1]);
      imageUrl.searchParams.set("fit", "crop");
      imageUrl.searchParams.set("crop", "entropy");
      imageUrl.searchParams.set("auto", "format");
      imageUrl.searchParams.set("fm", "jpg");
      imageUrl.searchParams.set("q", "80");

      const download = await downloadToFile({ url: imageUrl.toString(), outPath, dryRun: options.dryRun });

      record = {
        ...record,
        finalUrl: download.finalUrl,
        bytes: download.bytes,
        queryUsed: queryUsed ?? query,
        unsplash: {
          photoId: photo?.id ?? null,
          photoUrl: photo?.links?.html ?? null,
          photographerName: photo?.user?.name ?? null,
          photographerUrl: photo?.user?.links?.html ?? null,
        },
      };
    } else {
      const sourceUrl = `https://source.unsplash.com/${options.size}/?${encodeURIComponent(query)}`;
      const download = await downloadToFile({ url: sourceUrl, outPath, dryRun: options.dryRun });

      record = {
        ...record,
        finalUrl: download.finalUrl,
        bytes: download.bytes,
        note:
          "For proper attribution (photographer + photo URL), set UNSPLASH_ACCESS_KEY to use the official API.",
      };
    }

    attribution = attribution.filter((item) => item?.cityId !== record.cityId);
    attribution.push(record);
    attribution.sort((a, b) => String(a.cityId).localeCompare(String(b.cityId)));

    console.log(`${options.dryRun ? "dry  " : "saved"} ${fileName}`);
    downloadedOrExisting.push({ cityId: city?.id ?? null, fileName, outPath });
  } catch (error) {
    failures.push({ cityId: city?.id ?? null, fileName, error: String(error?.message ?? error) });
    console.error(`fail  ${fileName}: ${String(error?.message ?? error)}`);
  }

  if (options.delayMs) await sleep(options.delayMs);
}

if (!options.dryRun) {
  await fs.writeFile(attributionPath, `${JSON.stringify(attribution, null, 2)}\n`, "utf8");
}

if (options.writeCitiesData) {
  const citiesFileText = await fs.readFile(citiesModulePath, "utf8");
  let updatedText = citiesFileText;
  let updateCount = 0;

  for (const city of cities) {
    const id = city?.id;
    if (!id) continue;

    const match = downloadedOrExisting.find((entry) => entry.cityId === id);
    if (!match) continue;
    if (!(await fileExists(match.outPath))) continue;

    const imagePath = `/images/city/${match.fileName}`;
    const cityBlock = new RegExp(
      `(id:\\s*\\"${escapeRegExp(id)}\\"[\\s\\S]*?\\n\\s*image:\\s*)(null|\\"[^\\"]*\\"|\\'[^\\']*\\')(?=\\s*,)`,
      "m"
    );

    const before = updatedText;
    updatedText = updatedText.replace(cityBlock, `$1"${imagePath}"`);
    if (updatedText !== before) updateCount += 1;
  }

  if (!options.dryRun && updatedText !== citiesFileText) {
    await fs.writeFile(citiesModulePath, updatedText, "utf8");
    console.log(`updated src/data/cities.js (${updateCount} city image field(s))`);
  } else if (options.dryRun && updatedText !== citiesFileText) {
    console.log(`dry-run: would update src/data/cities.js (${updateCount} city image field(s))`);
  } else {
    console.log("no src/data/cities.js updates needed");
  }
}

if (failures.length) {
  throw new Error(`Failed to download ${failures.length} image(s).`);
}
