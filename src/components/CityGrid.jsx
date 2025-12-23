import CityCard from "./CityCard.jsx";

function SkeletonCard() {
  return (
    <div
      aria-hidden="true"
      className="h-[320px] rounded-card border border-slate-200 bg-white shadow-card"
    >
      <div className="h-full animate-pulse">
        <div className="aspect-video w-full rounded-t-card bg-slate-100" />
        <div className="p-4">
          <div className="h-5 w-2/3 rounded bg-slate-100" />
          <div className="mt-2 h-4 w-1/3 rounded bg-slate-100" />
          <div className="mt-5 grid gap-2">
            <div className="h-4 w-full rounded bg-slate-100" />
            <div className="h-4 w-5/6 rounded bg-slate-100" />
            <div className="h-4 w-4/5 rounded bg-slate-100" />
            <div className="h-4 w-2/3 rounded bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CityGrid({ cities, loading, onSelect }) {
  return (
    <div
      className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      aria-busy={loading}
      aria-live="polite"
    >
      {loading
        ? Array.from({ length: 8 }).map((_, idx) => <SkeletonCard key={idx} />)
        : cities.map((city) => (
            <CityCard key={city.id} city={city} onClick={() => onSelect(city)} />
          ))}
    </div>
  );
}

