import React, { useEffect, useState } from 'react';

const FERRET_QUOTES = [
  {
    sound: 'Dook dook!',
    note: 'The joyful chuckling sound ferrets make when excited and playing.',
  },
  {
    sound: 'Weasel War Dance!',
    note: 'Hopping sideways with an arched back and puffed tail means "Let’s play!"',
  },
  {
    sound: 'Zzz... 14–18 hrs!',
    note: 'Ferrets are deep sleepers and love dark hammocks and cozy tunnels.',
  },
  {
    sound: 'Strict Carnivore!',
    note: 'High animal protein and fat only—no fruits, grains, or sugary treats.',
  },
];

const PROFILE_STATS = [
  { label: 'Lifespan', value: '5–10 Years' },
  { label: 'Daily Sleep', value: '12–18 Hours' },
  { label: 'Diet Type', value: 'Obligate Carnivore' },
  { label: 'Social Need', value: 'Pairs or Small Groups' },
];

interface FerretHeroCardProps {
  imageSrc?: string;
}

/**
 * Flood-fills outer white background from the 4 image corners into transparency
 * while preserving interior white fur on the ferret's face.
 */
function createCutoutDataUrl(img: HTMLImageElement): string {
  const maxDim = 520;
  const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return img.src;

  ctx.drawImage(img, 0, 0, w, h);
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  const visited = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  let head = 0;
  let tail = 0;

  const isBgWhite = (idx: number) => {
    const p = idx * 4;
    return data[p] > 236 && data[p + 1] > 236 && data[p + 2] > 234;
  };

  const enqueueIfBg = (x: number, y: number) => {
    const idx = y * w + x;
    if (!visited[idx] && isBgWhite(idx)) {
      visited[idx] = 1;
      queue[tail++] = idx;
    }
  };

  for (let x = 0; x < w; x++) {
    enqueueIfBg(x, 0);
    enqueueIfBg(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    enqueueIfBg(0, y);
    enqueueIfBg(w - 1, y);
  }

  while (head < tail) {
    const curr = queue[head++];
    const cx = curr % w;
    const cy = (curr / w) | 0;

    if (cx > 0) enqueueIfBg(cx - 1, cy);
    if (cx < w - 1) enqueueIfBg(cx + 1, cy);
    if (cy > 0) enqueueIfBg(cx, cy - 1);
    if (cy < h - 1) enqueueIfBg(cx, cy + 1);
  }

  for (let i = 0; i < w * h; i++) {
    if (visited[i]) {
      data[i * 4 + 3] = 0;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}

export const FerretHeroCard: React.FC<FerretHeroCardProps> = ({
  imageSrc = `${import.meta.env.BASE_URL}ferret-hero.jpg`,
}) => {
  const [cutoutUrl, setCutoutUrl] = useState<string | null>(null);
  const [quoteIdx, setQuoteIdx] = useState<number>(0);
  const [isBouncing, setIsBouncing] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;
      try {
        const result = createCutoutDataUrl(img);
        setCutoutUrl(result);
      } catch {
        setCutoutUrl(imageSrc);
      }
    };
    img.onerror = () => {
      if (!cancelled) setCutoutUrl(imageSrc);
    };
    img.src = imageSrc;
    return () => {
      cancelled = true;
    };
  }, [imageSrc]);

  const handleStickerClick = () => {
    setIsBouncing(true);
    setQuoteIdx((prev) => (prev + 1) % FERRET_QUOTES.length);
    setTimeout(() => setIsBouncing(false), 360);
  };

  const currentQuote = FERRET_QUOTES[quoteIdx];

  return (
    <div className="relative pt-6 sm:pt-8">
      {/* Hidden SVG filter that produces a smooth, thick white die-cut sticker outline + paper shadow */}
      <svg className="sr-only" aria-hidden="true">
        <defs>
          <filter
            id="ferret-diecut-sticker"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feMorphology
              in="SourceAlpha"
               result="dilated"
              operator="dilate"
              radius="7"
            />
            <feGaussianBlur in="dilated" stdDeviation="1.2" result="smoothed" />
            <feComponentTransfer in="smoothed" result="solidOutline">
              <feFuncA type="table" tableValues="0 1 1 1 1" />
            </feComponentTransfer>
            <feFlood floodColor="#FFFFFF" floodOpacity="1" result="whiteFill" />
            <feComposite
              in="whiteFill"
              in2="solidOutline"
              operator="in"
              result="whiteStickerBorder"
            />
            <feDropShadow
              in="whiteStickerBorder"
              dx="0"
              dy="4"
              stdDeviation="4"
              floodColor="#1C1917"
              floodOpacity="0.18"
              result="stickerWithShadow"
            />
            <feMerge>
              <feMergeNode in="stickerWithShadow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Interactive Speech Bubble */}
      <div className="relative z-30 mb-3 sm:mb-0 sm:absolute sm:-top-2 sm:right-2 max-w-[240px] ml-auto">
        <button
          type="button"
          onClick={handleStickerClick}
          className="w-full text-left rounded-2xl bg-white border-2 border-stone-800 px-3.5 py-2.5 shadow-[3px_3px_0px_#292524] hover:translate-y-[-1px] transition-transform cursor-pointer"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-serif font-semibold text-sm text-stone-900">
              “{currentQuote.sound}”
            </span>
            <span className="text-[10px] uppercase tracking-wider text-stone-400">
              Tap ferret ↻
            </span>
          </div>
          <p className="text-xs text-stone-600 leading-snug mt-0.5">
            {currentQuote.note}
          </p>
        </button>
      </div>

      {/* Pocket Animal Profile ID Card */}
      <div className="relative rounded-xl border border-stone-300/90 bg-[#F4F0E6] p-4 sm:p-5 shadow-sm">
        {/* Decorative Washi Tape at top-left corner */}
        <div
          aria-hidden="true"
          className="absolute -top-2.5 left-8 w-20 h-5 bg-amber-200/70 border border-amber-300/60 -rotate-3 rounded-[2px] shadow-2xs pointer-events-none"
        />

        <div className="grid grid-cols-12 gap-3 sm:gap-4 items-center">
          {/* Left Side: Die-Cut White-Bordered Ferret Sticker overlapping card top */}
          <div className="col-span-5 flex flex-col items-center justify-center relative">
            <button
              type="button"
              onClick={handleStickerClick}
              aria-label="Click ferret sticker for fun ferret facts"
              className={`group relative -mt-8 sm:-mt-12 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-stone-900 transition-transform duration-300 ${
                isBouncing
                  ? '-translate-y-2.5 rotate-2 scale-105'
                  : '-rotate-2 hover:rotate-0 hover:scale-105'
              }`}
            >
              {cutoutUrl ? (
                <img
                  src={cutoutUrl}
                  alt="Domestic sable ferret cutout sticker"
                  style={{ filter: 'url(#ferret-diecut-sticker)' }}
                  className="w-36 sm:w-44 h-auto object-contain select-none pointer-events-none"
                />
              ) : (
                <div className="w-36 sm:w-44 aspect-square rounded-lg bg-stone-200/50 animate-pulse" />
              )}
            </button>
          </div>

          {/* Right Side: Pocket Animal Profile Stats */}
          <div className="col-span-7 bg-white/85 rounded-lg border border-stone-200/90 p-3 sm:p-4">
            <div className="border-b border-stone-200 pb-2 mb-2.5">
              <div className="text-[10px] uppercase tracking-widest text-stone-500">
                Pocket Animal Profile
              </div>
              <div className="text-sm sm:text-base font-serif font-medium text-stone-900">
                Domestic Ferret
              </div>
            </div>

            <dl className="divide-y divide-stone-200/70 text-xs">
              {PROFILE_STATS.map((item) => (
                <div
                  key={item.label}
                  className="py-1.5 flex items-center justify-between gap-2"
                >
                  <dt className="text-stone-500 font-medium">{item.label}</dt>
                  <dd className="text-stone-900 font-semibold text-right">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};
