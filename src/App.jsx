import { useEffect, useMemo, useRef, useState } from "react";
import Hero from "./components/Hero.jsx";
import ContinentFilters from "./components/ContinentFilters.jsx";
import CityGrid from "./components/CityGrid.jsx";
import CityDialog from "./components/CityDialog.jsx";
import Footer from "./components/Footer.jsx";
import { cities as seededCities } from "./data/cities.js";
import { continentLabelKo } from "./lib/labels.js";

const CONTINENTS = [
  "All",
  "Asia",
  "Europe",
  "North America",
  "South America",
  "Oceania",
  "Africa",
];

function filterCities(cities, continent) {
  if (continent === "All") return cities;
  return cities.filter((c) => c.continent === continent);
}

export default function App() {
  const [activeContinent, setActiveContinent] = useState("All");
  const [isFiltering, setIsFiltering] = useState(true);
  const [selectedCity, setSelectedCity] = useState(null);

  const citiesSectionRef = useRef(null);
  const firstFilterButtonRef = useRef(null);
  const filterTimeoutRef = useRef(0);

  const filteredCities = useMemo(
    () => filterCities(seededCities, activeContinent),
    [activeContinent]
  );

  const activeContinentLabel = continentLabelKo(activeContinent);
  const resultsText =
    activeContinent === "All"
      ? `총 ${filteredCities.length}개 도시`
      : `${activeContinentLabel} · ${filteredCities.length}개 도시 (전체 ${seededCities.length}개)`;

  const handleExplore = () => {
    const el = citiesSectionRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      firstFilterButtonRef.current?.focus({ preventScroll: true });
    }, 250);
  };

  useEffect(() => {
    const t = window.setTimeout(() => setIsFiltering(false), 220);
    return () => window.clearTimeout(t);
  }, []);

  const handleFilterChange = (continent) => {
    window.clearTimeout(filterTimeoutRef.current);
    setActiveContinent(continent);
    setIsFiltering(true);
    filterTimeoutRef.current = window.setTimeout(() => setIsFiltering(false), 180);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <a
        className="absolute left-4 top-4 z-50 -translate-y-40 rounded-lg border border-white/35 bg-slate-900/90 px-3 py-2 text-white transition-transform focus:translate-y-0 focus:outline-none focus:ring-4 focus:ring-brand-light/40"
        href="#cities"
      >
        도시 목록으로 건너뛰기
      </a>

      <Hero onExplore={handleExplore} />

      <main>
        <section
          id="cities"
          ref={citiesSectionRef}
          aria-label="도시 탐색"
          className="py-20 sm:py-24"
        >
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <header className="mb-5 grid gap-2">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                대륙별 필터
              </h2>
              <p className="text-slate-600">
                비용, 인터넷, 기후, 노마드 점수로 다음 거점을 찾아보세요.
              </p>
            </header>

            <ContinentFilters
              continents={CONTINENTS}
              active={activeContinent}
              onChange={handleFilterChange}
              firstButtonRef={firstFilterButtonRef}
              labelForContinent={continentLabelKo}
            />

            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
              <p className="font-semibold">{resultsText}</p>
              <p className="text-sm text-slate-600">
                팁: 도시 카드를 클릭하면 상세 정보를 볼 수 있어요.
              </p>
            </div>

            <CityGrid
              cities={filteredCities}
              loading={isFiltering}
              onSelect={(city) => setSelectedCity(city)}
            />
          </div>
        </section>
      </main>

      <Footer />

      <CityDialog city={selectedCity} onClose={() => setSelectedCity(null)} />
    </div>
  );
}
