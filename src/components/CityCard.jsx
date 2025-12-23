import { cityImageSrc, formatScore, metricValue } from "../lib/cityFormat.js";
import { continentLabelKo, tagLabelKo } from "../lib/labels.js";

function Badge({ children, variant = "neutral" }) {
  const classes =
    variant === "popular"
      ? "border-amber-400/40"
      : variant === "rising"
        ? "border-emerald-400/40"
        : "border-slate-200/20";

  return (
    <span
      className={[
        "rounded-full border bg-slate-900/70 px-2.5 py-1 text-xs font-semibold text-slate-100",
        classes,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

export default function CityCard({ city, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full overflow-hidden rounded-card border border-slate-200 bg-white text-left shadow-card transition hover:scale-[1.03] hover:border-brand-blue/20 hover:shadow-card-hover focus:outline-none focus:ring-4 focus:ring-brand-blue/20 motion-reduce:hover:scale-100"
      aria-label={`${city.name}, ${city.country} 상세 보기`}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-brand-blue/10 to-brand-light/20">
        <img
          src={cityImageSrc(city)}
          alt={`${city.name} 전경`}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/55 to-transparent"
        />

        <div className="absolute bottom-3 left-3 z-10 flex flex-wrap gap-2">
          <Badge>{continentLabelKo(city.continent)}</Badge>
          {Array.isArray(city.tags) &&
            city.tags.map((tag) => (
              <Badge
                key={tag}
                variant={tag.toLowerCase() === "popular" ? "popular" : tag.toLowerCase()}
              >
                {tagLabelKo(tag)}
              </Badge>
            ))}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold tracking-tight">{city.name}</h3>
        <p className="mt-1 text-sm text-slate-600">{city.country}</p>

        <dl className="mt-4 grid gap-2 font-mono text-[13px] text-slate-900">
          <div className="flex items-baseline justify-between gap-3">
            <dt className="font-sans text-[13px] text-slate-600">💵 월 예상 비용</dt>
            <dd className="font-semibold">{metricValue(city.cost?.display)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="font-sans text-[13px] text-slate-600">📡 인터넷</dt>
            <dd className="font-semibold">
              {metricValue(
                typeof city.internet?.speed === "number"
                  ? `${city.internet.speed} ${city.internet.unit || "Mbps"}`
                  : null
              )}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="font-sans text-[13px] text-slate-600">🌡️ 평균 기온</dt>
            <dd className="font-semibold">
              {metricValue(
                typeof city.temperature?.value === "number"
                  ? `${city.temperature.value}°${city.temperature.unit || "C"}`
                  : null
              )}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="font-sans text-[13px] text-slate-600">⭐ 노마드 점수</dt>
            <dd className="font-semibold">{formatScore(city.score)}</dd>
          </div>
        </dl>
      </div>
    </button>
  );
}
