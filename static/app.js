/* global window, document */
(function () {
  const CONTINENTS = [
    "All",
    "Asia",
    "Europe",
    "North America",
    "South America",
    "Oceania",
    "Africa",
  ];

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function svgPlaceholderDataUrl({ title, subtitle }) {
    const safeTitle = escapeHtml(title);
    const safeSubtitle = escapeHtml(subtitle);
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e40af"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
    <radialGradient id="glow" cx="55%" cy="35%" r="70%">
      <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.35"/>
      <stop offset="60%" stop-color="#60a5fa" stop-opacity="0.0"/>
    </radialGradient>
    <pattern id="p" width="18" height="18" patternUnits="userSpaceOnUse">
      <circle cx="3" cy="3" r="1.2" fill="#93c5fd" opacity="0.22"/>
    </pattern>
  </defs>
  <rect width="1280" height="720" fill="url(#g)"/>
  <rect width="1280" height="720" fill="url(#glow)"/>
  <rect width="1280" height="720" fill="url(#p)" opacity="0.6"/>
  <g opacity="0.9">
    <text x="72" y="520" font-family="Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" font-size="64" font-weight="800" fill="#ffffff">${safeTitle}</text>
    <text x="72" y="585" font-family="Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" font-size="30" font-weight="600" fill="#dbeafe">${safeSubtitle}</text>
  </g>
</svg>`;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function createFilterButton(continent, isActive) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-btn";
    button.dataset.continent = continent;
    button.setAttribute("aria-pressed", String(isActive));
    button.textContent = continent;
    return button;
  }

  function renderSkeletons(gridEl, count = 8) {
    gridEl.setAttribute("aria-busy", "true");
    gridEl.replaceChildren();
    for (let i = 0; i < count; i += 1) {
      const sk = document.createElement("div");
      sk.className = "skeleton";
      sk.setAttribute("aria-hidden", "true");
      gridEl.appendChild(sk);
    }
  }

  function tagClass(tag) {
    const normalized = String(tag || "").toLowerCase();
    if (normalized === "popular") return "badge badge-popular";
    if (normalized === "rising") return "badge badge-rising";
    return "badge";
  }

  function formatScore(score) {
    const value = Number(score);
    if (!Number.isFinite(value)) return "—";
    return `${value.toFixed(1)}/5`;
  }

  function createCityCard(city) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "card";
    button.dataset.cityId = city.id;
    button.setAttribute("aria-label", `View details for ${city.name}, ${city.country}`);

    const media = document.createElement("div");
    media.className = "card-media";

    const img = document.createElement("img");
    img.loading = "lazy";
    img.alt = `${city.name} skyline`;
    img.src =
      city.image ||
      svgPlaceholderDataUrl({
        title: city.name,
        subtitle: `${city.country} · ${city.continent}`,
      });
    media.appendChild(img);

    const badgeRow = document.createElement("div");
    badgeRow.className = "badge-row";

    const continentBadge = document.createElement("span");
    continentBadge.className = "badge";
    continentBadge.textContent = city.continent;
    badgeRow.appendChild(continentBadge);

    if (Array.isArray(city.tags)) {
      for (const tag of city.tags) {
        const badge = document.createElement("span");
        badge.className = tagClass(tag);
        badge.textContent = tag;
        badgeRow.appendChild(badge);
      }
    }

    media.appendChild(badgeRow);
    button.appendChild(media);

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = city.name;

    const meta = document.createElement("p");
    meta.className = "card-meta";
    meta.textContent = city.country;

    const metrics = document.createElement("div");
    metrics.className = "metrics";

    const metricRows = [
      { left: "💵", label: "Cost", right: city.cost?.display ?? "—" },
      {
        left: "📡",
        label: "Internet",
        right:
          typeof city.internet?.speed === "number"
            ? `${city.internet.speed} ${city.internet.unit || "Mbps"}`
            : "—",
      },
      {
        left: "🌡️",
        label: "Temp",
        right:
          typeof city.temperature?.value === "number"
            ? `${city.temperature.value}°${city.temperature.unit || "C"}`
            : "—",
      },
      { left: "⭐", label: "Score", right: formatScore(city.score) },
    ];

    for (const row of metricRows) {
      const el = document.createElement("div");
      el.className = "metric";
      el.innerHTML = `<span>${escapeHtml(row.left)} <span class="label">${escapeHtml(
        row.label
      )}</span></span><span>${escapeHtml(row.right)}</span>`;
      metrics.appendChild(el);
    }

    body.appendChild(title);
    body.appendChild(meta);
    body.appendChild(metrics);
    button.appendChild(body);

    return button;
  }

  function renderCities(gridEl, cities) {
    gridEl.setAttribute("aria-busy", "false");
    gridEl.replaceChildren();
    for (const city of cities) gridEl.appendChild(createCityCard(city));
  }

  function setActiveFilter(filtersEl, activeContinent) {
    for (const button of filtersEl.querySelectorAll("button.filter-btn")) {
      const isActive = button.dataset.continent === activeContinent;
      button.setAttribute("aria-pressed", String(isActive));
    }
  }

  function getFilteredCities(cities, continent) {
    if (continent === "All") return cities;
    return cities.filter((c) => c.continent === continent);
  }

  function updateResultsCount(el, visibleCount, totalCount, activeContinent) {
    if (activeContinent === "All") {
      el.textContent = `${visibleCount} cities`;
      return;
    }
    el.textContent = `${visibleCount} cities in ${activeContinent} (of ${totalCount})`;
  }

  function openCityDialog(city) {
    const dialog = $("cityDialog");
    const title = $("dialogTitle");
    const body = $("dialogBody");

    title.textContent = `${city.name}, ${city.country}`;
    body.innerHTML = `
      <div class="kv" role="list">
        <div class="kv-item" role="listitem">
          <p class="k">Continent</p>
          <p class="v">${escapeHtml(city.continent)}</p>
        </div>
        <div class="kv-item" role="listitem">
          <p class="k">Nomad score</p>
          <p class="v">${escapeHtml(formatScore(city.score))}</p>
        </div>
        <div class="kv-item" role="listitem">
          <p class="k">Estimated monthly cost</p>
          <p class="v">${escapeHtml(city.cost?.display ?? "—")}</p>
        </div>
        <div class="kv-item" role="listitem">
          <p class="k">Internet speed</p>
          <p class="v">${escapeHtml(
            typeof city.internet?.speed === "number"
              ? `${city.internet.speed} ${city.internet.unit || "Mbps"}`
              : "—"
          )}</p>
        </div>
        <div class="kv-item" role="listitem">
          <p class="k">Average temperature</p>
          <p class="v">${escapeHtml(
            typeof city.temperature?.value === "number"
              ? `${city.temperature.value}°${city.temperature.unit || "C"}`
              : "—"
          )}</p>
        </div>
        <div class="kv-item" role="listitem">
          <p class="k">Coordinates</p>
          <p class="v">${escapeHtml(
            typeof city.coordinates?.lat === "number" && typeof city.coordinates?.lng === "number"
              ? `${city.coordinates.lat.toFixed(4)}, ${city.coordinates.lng.toFixed(4)}`
              : "—"
          )}</p>
        </div>
      </div>
    `;

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "true");
    }
  }

  function closeCityDialog() {
    const dialog = $("cityDialog");
    if (!dialog) return;
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  function init() {
    const cities = Array.isArray(window.NEWMARD_CITIES) ? window.NEWMARD_CITIES : [];

    const exploreBtn = $("exploreBtn");
    const filtersEl = $("continentFilters");
    const gridEl = $("cityGrid");
    const resultsCountEl = $("resultsCount");
    const dialogClose = $("dialogClose");
    const heroMap = document.querySelector(".hero-map");

    if (!filtersEl || !gridEl || !resultsCountEl) return;

    let activeContinent = "All";

    filtersEl.replaceChildren(
      ...CONTINENTS.map((c) => createFilterButton(c, c === activeContinent))
    );

    renderSkeletons(gridEl, 8);

    window.setTimeout(() => {
      const visible = getFilteredCities(cities, activeContinent);
      renderCities(gridEl, visible);
      updateResultsCount(resultsCountEl, visible.length, cities.length, activeContinent);
    }, 220);

    filtersEl.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.tagName !== "BUTTON") return;
      const continent = target.dataset.continent;
      if (!continent) return;

      activeContinent = continent;
      setActiveFilter(filtersEl, activeContinent);
      renderSkeletons(gridEl, 8);

      window.setTimeout(() => {
        const visible = getFilteredCities(cities, activeContinent);
        renderCities(gridEl, visible);
        updateResultsCount(resultsCountEl, visible.length, cities.length, activeContinent);
      }, 160);
    });

    gridEl.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const card = target.closest("button.card");
      if (!card) return;
      const id = card.dataset.cityId;
      if (!id) return;
      const city = cities.find((c) => c.id === id);
      if (!city) return;
      openCityDialog(city);
    });

    dialogClose?.addEventListener("click", closeCityDialog);
    $("cityDialog")?.addEventListener("click", (event) => {
      if (event.target === $("cityDialog")) closeCityDialog();
    });

    exploreBtn?.addEventListener("click", () => {
      const section = $("cities");
      if (!section) return;
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      filtersEl.querySelector("button.filter-btn")?.focus({ preventScroll: true });
    });

    if (heroMap && typeof window.matchMedia === "function") {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (!reduceMotion.matches) {
        let raf = 0;
        const onScroll = () => {
          if (raf) return;
          raf = window.requestAnimationFrame(() => {
            raf = 0;
            const offset = Math.min(36, Math.max(0, window.scrollY * 0.06));
            heroMap.style.transform = `translateY(${offset}px) scale(1.02)`;
          });
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
