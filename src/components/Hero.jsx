import { ArrowDown, Sparkles } from "lucide-react";
import Floating, { FloatingElement } from "@/components/ui/parallax-floating";

const photoCardBase =
  "pointer-events-auto overflow-hidden border border-white/10 bg-white/5 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur";

function FloatingPhoto({ src, alt, className }) {
  return (
    <div className={className}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

const floatingPhotos = [
  {
    src: "/images/city/tokyo.jpg",
    alt: "Tokyo, Japan",
    depth: 0.6,
    wrapper: "top-[6%] left-[5%]",
    card: "h-28 w-28 md:h-32 md:w-32 -rotate-2 opacity-75 rounded-2xl",
  },
  {
    src: "/images/city/chiang-mai.jpg",
    alt: "Chiang Mai, Thailand",
    depth: 0.8,
    wrapper: "top-[18%] left-[16%] hidden xl:block",
    card: "h-20 w-28 md:h-24 md:w-36 rotate-2 opacity-55 rounded-2xl",
  },
  {
    src: "/images/city/lisbon.jpg",
    alt: "Lisbon, Portugal",
    depth: 1,
    wrapper: "top-[5%] left-[28%] hidden md:block",
    card: "h-32 w-32 md:h-40 md:w-40 rotate-1 opacity-90 rounded-2xl",
  },
  {
    src: "/images/city/hong-kong.jpg",
    alt: "Hong Kong",
    depth: 1.2,
    wrapper: "top-[14%] left-[40%] sm:top-[11%] sm:left-[52%]",
    card: "h-24 w-36 md:h-28 md:w-44 -rotate-1 opacity-70 rounded-2xl",
  },
  {
    src: "/images/city/bangkok.jpg",
    alt: "Bangkok, Thailand",
    depth: 2,
    wrapper: "top-[9%] left-[74%]",
    card: "h-28 w-24 sm:h-36 sm:w-28 md:h-44 md:w-36 rotate-2 opacity-95 rounded-2xl",
  },
  {
    src: "/images/city/seoul.jpg",
    alt: "Seoul, South Korea",
    depth: 1.1,
    wrapper: "top-[12%] left-[78%] sm:top-[26%] sm:left-[86%]",
    card: "h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 -rotate-1 opacity-75 rounded-2xl",
  },
  {
    src: "/images/city/budapest.jpg",
    alt: "Budapest, Hungary",
    depth: 1.4,
    wrapper: "top-[36%] left-[24%] hidden lg:block",
    card: "h-24 w-32 md:h-28 md:w-36 -rotate-2 opacity-75 rounded-2xl",
  },
  {
    src: "/images/city/melbourne.jpg",
    alt: "Melbourne, Australia",
    depth: 1.7,
    wrapper: "top-[42%] left-[58%] hidden md:block",
    card: "h-28 w-28 md:h-36 md:w-36 rotate-1 opacity-75 rounded-2xl",
  },
  {
    src: "/images/city/aveiro.jpg",
    alt: "Aveiro, Portugal",
    depth: 1.3,
    wrapper: "top-[30%] left-[70%] hidden xl:block",
    card: "h-20 w-28 md:h-24 md:w-36 -rotate-1 opacity-55 rounded-2xl",
  },
  {
    src: "/images/city/dallas.jpg",
    alt: "Dallas, USA",
    depth: 1.2,
    wrapper: "top-[48%] left-[78%] hidden lg:block",
    card: "h-24 w-24 md:h-28 md:w-28 -rotate-2 opacity-65 rounded-2xl",
  },
  {
    src: "/images/city/berlin.jpg",
    alt: "Berlin, Germany",
    depth: 1,
    wrapper: "top-[66%] left-[4%] sm:top-[62%] sm:left-[5%]",
    card: "h-28 w-28 md:h-36 md:w-36 rotate-1 opacity-75 rounded-2xl",
  },
  {
    src: "/images/city/azores.jpg",
    alt: "Azores, Portugal",
    depth: 1.6,
    wrapper: "top-[56%] left-[60%] hidden xl:block",
    card: "h-24 w-24 md:h-28 md:w-28 rotate-2 opacity-60 rounded-2xl",
  },
  {
    src: "/images/city/porto.jpg",
    alt: "Porto, Portugal",
    depth: 1.3,
    wrapper: "top-[60%] left-[44%] hidden lg:block",
    card: "h-24 w-36 md:h-28 md:w-44 rotate-2 opacity-70 rounded-2xl",
  },
  {
    src: "/images/city/cape-town.jpg",
    alt: "Cape Town, South Africa",
    depth: 2.2,
    wrapper: "top-[64%] left-[78%] hidden md:block",
    card: "h-28 w-28 md:h-40 md:w-40 -rotate-1 opacity-80 rounded-2xl",
  },
  {
    src: "/images/city/ploiesti.jpg",
    alt: "Ploiesti, Romania",
    depth: 1.1,
    wrapper: "top-[52%] left-[18%] hidden xl:block",
    card: "h-20 w-20 md:h-24 md:w-24 rotate-1 opacity-55 rounded-2xl",
  },
  {
    src: "/images/city/auckland.jpg",
    alt: "Auckland, New Zealand",
    depth: 1.1,
    wrapper: "top-[74%] left-[8%] hidden md:block",
    card: "h-20 w-28 md:h-24 md:w-36 rotate-1 opacity-65 rounded-2xl",
  },
  {
    src: "/images/city/timisoara.jpg",
    alt: "Timisoara, Romania",
    depth: 0.9,
    wrapper: "top-[80%] left-[74%] hidden xl:block",
    card: "h-20 w-28 md:h-24 md:w-36 -rotate-1 opacity-55 rounded-2xl",
  },
  {
    src: "/images/city/sydney.jpg",
    alt: "Sydney, Australia",
    depth: 1.2,
    wrapper: "top-[82%] left-[76%] sm:top-[78%] sm:left-[56%]",
    card: "h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 rotate-2 opacity-75 rounded-2xl",
  },
  {
    src: "/images/city/ericeira.jpg",
    alt: "Ericeira, Portugal",
    depth: 0.9,
    wrapper: "top-[22%] left-[44%] hidden 2xl:block",
    card: "h-20 w-20 md:h-24 md:w-24 -rotate-2 opacity-55 rounded-2xl",
  },
  {
    src: "/images/city/buenos-aires.jpg",
    alt: "Buenos Aires, Argentina",
    depth: 4,
    wrapper: "top-[72%] left-[22%]",
    card: "h-32 w-44 sm:h-40 sm:w-56 md:h-44 md:w-64 -rotate-1 opacity-95 rounded-3xl",
  },
];

export default function Hero({ onExplore }) {
  return (
    <section
      id="top"
      aria-label="Newmard hero"
      className="relative grid min-h-screen grid-rows-[auto_1fr] overflow-hidden bg-slate-950 text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-slate-950 via-slate-950 to-black"
      />

      <Floating
        sensitivity={-1}
        easingFactor={0.065}
        className="pointer-events-none z-[1] overflow-hidden"
        aria-hidden="true"
      >
        {floatingPhotos.map((photo) => (
          <FloatingElement
            key={photo.src}
            depth={photo.depth}
            className={photo.wrapper}
          >
            <FloatingPhoto
              src={photo.src}
              alt={photo.alt}
              className={[photoCardBase, photo.card].join(" ")}
            />
          </FloatingElement>
        ))}
      </Floating>

      <header className="relative z-10 flex w-full items-center px-4 py-6 sm:px-6 lg:px-8">
        <a
          href="#top"
          className="inline-flex items-center gap-2 rounded-xl px-2 py-1 text-lg font-extrabold tracking-tight focus:outline-none focus:ring-4 focus:ring-brand-light/40"
          aria-label="Newmard"
        >
          <Sparkles className="h-5 w-5 text-brand-light" aria-hidden="true" />
          Newmard
        </a>
      </header>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl content-center gap-5 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold tracking-wide text-slate-100 shadow-[0_12px_36px_rgba(0,0,0,0.25)] backdrop-blur">
            Remote-friendly cities, curated and compared
          </p>
          <h1 className="mt-5 text-balance text-4xl font-extrabold tracking-tight sm:text-6xl">
            Find your next remote base
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-base text-slate-200 sm:text-lg">
            Explore handpicked places for work and life: cost, connectivity,
            climate, and the vibe that matches your pace.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onExplore}
            className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-brand-blue px-4 py-3 font-semibold shadow-[0_10px_30px_rgba(37,99,235,0.25)] transition hover:-translate-y-0.5 hover:bg-brand-dark hover:shadow-[0_14px_34px_rgba(37,99,235,0.32)] focus:outline-none focus:ring-4 focus:ring-brand-light/40 active:translate-y-0"
          >
            Explore cities <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </button>
          <p className="text-sm text-slate-200/90">
            Tip: move your cursor to shift the photos
          </p>
        </div>
      </div>
    </section>
  );
}
