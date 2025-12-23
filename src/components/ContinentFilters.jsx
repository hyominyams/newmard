export default function ContinentFilters({
  continents,
  active,
  onChange,
  firstButtonRef,
  labelForContinent,
}) {
  return (
    <div
      role="toolbar"
      aria-label="대륙별 도시 필터"
      className="flex gap-2 overflow-x-auto py-2 pb-3 [scrollbar-width:thin] lg:flex-wrap lg:justify-center lg:overflow-x-visible"
    >
      {continents.map((c, idx) => {
        const isActive = c === active;
        const label = typeof labelForContinent === "function" ? labelForContinent(c) : c;
        return (
          <button
            key={c}
            ref={idx === 0 ? firstButtonRef : undefined}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(c)}
            className={[
              "shrink-0 whitespace-nowrap rounded-lg border px-3 py-2 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-brand-blue/20",
              isActive
                ? "border-brand-blue/20 bg-brand-blue text-white"
                : "border-slate-200 bg-white text-slate-900 hover:-translate-y-0.5 hover:border-brand-blue/30",
            ].join(" ")}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
