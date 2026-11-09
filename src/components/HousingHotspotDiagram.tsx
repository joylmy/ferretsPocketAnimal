import React, { useState } from 'react';
import { HousingHotspot } from '../data/sections';

interface HousingHotspotDiagramProps {
  imageUrl: string;
  hotspots: HousingHotspot[];
}

export const HousingHotspotDiagram: React.FC<HousingHotspotDiagramProps> = ({
  imageUrl,
  hotspots,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [useFallbackUrl, setUseFallbackUrl] = useState<boolean>(false);

  const activeHotspot =
    hotspots.find((item) => item.id === activeId) ?? null;

  const handleToggleHotspot = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  const normalizedLocalUrl = `${import.meta.env.BASE_URL}${imageUrl.replace(/^\/+/, '')}`;
  const resolvedImgSrc = useFallbackUrl
    ? 'https://lh3.googleusercontent.com/d/1a_Ok92YhxWhkYYHyHJdoPXZwHOTc13cl=w1200'
    : retryCount > 0
      ? `${normalizedLocalUrl}?retry=${retryCount}`
      : normalizedLocalUrl;

  const handleImageError = () => {
    if (retryCount < 2) {
      setTimeout(() => {
        setRetryCount((prev) => prev + 1);
      }, 1200);
    } else if (!useFallbackUrl) {
      setUseFallbackUrl(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-stone-200 bg-stone-100 shadow-sm select-none">
        <img
          src={resolvedImgSrc}
          alt="Multilevel ferret enclosure interactive diagram"
          referrerPolicy="no-referrer"
          onError={handleImageError}
          className="w-full h-full object-cover block"
        />

        {/* Subtle backdrop click-away layer when a hotspot popover is open */}
        {activeHotspot && (
          <div
            onClick={() => setActiveId(null)}
            className="absolute inset-0 bg-stone-950/10 transition-opacity duration-200 cursor-pointer"
            aria-hidden="true"
          />
        )}

        {/* Ultra-Compact Blue-to-White Radial Gradient Hotspot Markers */}
        {hotspots.map((spot) => {
          const isSelected = spot.id === activeId;
          return (
            <button
              key={spot.id}
              type="button"
              aria-label={spot.point}
              aria-expanded={isSelected}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleHotspot(spot.id);
              }}
              style={{
                left: `${spot.x}%`,
                top: `${spot.y}%`,
              }}
              className="group absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-6 h-6 rounded-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              {!isSelected && (
                <span
                  aria-hidden="true"
                  className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-blue-400/55 animate-ping pointer-events-none absolute"
                />
              )}
              <span
                className={`relative z-10 block w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-radial from-blue-400 via-blue-200 to-white shadow-sm transition-transform duration-200 ${
                  isSelected
                    ? 'scale-150 ring-2 ring-white/90'
                    : 'group-hover:scale-125'
                }`}
              />
            </button>
          );
        })}

        {/* On-Image Popover Card when a Hotspot is Clicked */}
        {activeHotspot && (
          <div
            role="dialog"
            aria-live="polite"
            aria-label={activeHotspot.label}
            onClick={(e) => e.stopPropagation()}
            style={{
              left: `${Math.min(78, Math.max(22, activeHotspot.x))}%`,
              top:
                activeHotspot.y > 58
                  ? `${activeHotspot.y - 4}%`
                  : `${activeHotspot.y + 4}%`,
            }}
            className={`absolute z-40 -translate-x-1/2 ${
              activeHotspot.y > 58 ? '-translate-y-full' : 'translate-y-0'
            } w-[84%] sm:w-76 rounded-lg bg-white/95 backdrop-blur-sm border border-blue-200 p-3.5 shadow-xl text-left transition-all duration-200`}
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="inline-block w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0"
                />
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                  {activeHotspot.label}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveId(null)}
                aria-label="Close description"
                className="text-stone-400 hover:text-stone-700 text-xs leading-none px-1.5 py-0.5 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
              {activeHotspot.text}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
