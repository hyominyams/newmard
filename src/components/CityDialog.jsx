import { useEffect, useRef } from "react";
import { formatScore, metricValue } from "../lib/cityFormat.js";
import { continentLabelKo } from "../lib/labels.js";

export default function CityDialog({ city, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!city) {
      if (dialog.open) dialog.close();
      return;
    }

    if (typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute("open", "true");
    }
  }, [city]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onCancel = (event) => {
      event.preventDefault();
      onClose();
    };
    dialog.addEventListener("cancel", onCancel);
    return () => dialog.removeEventListener("cancel", onCancel);
  }, [onClose]);

  const handleBackdropClick = (event) => {
    if (event.target === dialogRef.current) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      aria-label="도시 상세 정보"
      className="w-[min(720px,calc(100%-28px))] rounded-2xl border border-slate-200 p-0 shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white p-4">
        <p className="text-base font-extrabold tracking-tight">
          {city ? `${city.name}, ${city.country}` : ""}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 font-bold hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-brand-blue/20"
          aria-label="닫기"
        >
          ×
        </button>
      </div>

      {city && (
        <div className="grid gap-3 bg-white p-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
              <p className="text-xs text-slate-600">대륙</p>
              <p className="mt-1 font-bold">{metricValue(continentLabelKo(city.continent))}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
              <p className="text-xs text-slate-600">노마드 점수</p>
              <p className="mt-1 font-bold">{formatScore(city.score)}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
              <p className="text-xs text-slate-600">월 예상 비용</p>
              <p className="mt-1 font-bold">{metricValue(city.cost?.display)}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
              <p className="text-xs text-slate-600">인터넷 속도</p>
              <p className="mt-1 font-bold">
                {metricValue(
                  typeof city.internet?.speed === "number"
                    ? `${city.internet.speed} ${city.internet.unit || "Mbps"}`
                    : null
                )}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
              <p className="text-xs text-slate-600">평균 기온</p>
              <p className="mt-1 font-bold">
                {metricValue(
                  typeof city.temperature?.value === "number"
                    ? `${city.temperature.value}°${city.temperature.unit || "C"}`
                    : null
                )}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
              <p className="text-xs text-slate-600">좌표</p>
              <p className="mt-1 font-bold">
                {metricValue(
                  typeof city.coordinates?.lat === "number" &&
                    typeof city.coordinates?.lng === "number"
                    ? `${city.coordinates.lat.toFixed(4)}, ${city.coordinates.lng.toFixed(4)}`
                    : null
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
