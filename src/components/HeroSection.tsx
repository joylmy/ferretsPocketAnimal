import React, { useEffect, useRef, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { HeroContent } from '../data/sections';

interface HeroSectionProps {
  content: HeroContent;
}

/**
 * Removes the exterior white studio background from a portrait image using
 * edge-connected flood fill so interior white fur (muzzle/ears) remains intact,
 * and tightly crops away excess empty margin so the sticker renders at full scale.
 */
function createTransparentCutoutDataUrl(img: HTMLImageElement): string {
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return img.src;

  ctx.drawImage(img, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const visited = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;

  const isWhiteBg = (idx: number) => {
    const p = idx * 4;
    return data[p] >= 240 && data[p + 1] >= 240 && data[p + 2] >= 240;
  };

  const enqueueIfBg = (x: number, y: number) => {
    const idx = y * width + x;
    if (!visited[idx] && isWhiteBg(idx)) {
      visited[idx] = 1;
      queue[tail++] = idx;
    }
  };

  for (let x = 0; x < width; x++) {
    enqueueIfBg(x, 0);
    enqueueIfBg(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    enqueueIfBg(0, y);
    enqueueIfBg(width - 1, y);
  }

  while (head < tail) {
    const idx = queue[head++];
    data[idx * 4 + 3] = 0; // Make exterior background pixel transparent
    const x = idx % width;
    const y = (idx - x) / width;

    if (x > 0) enqueueIfBg(x - 1, y);
    if (x < width - 1) enqueueIfBg(x + 1, y);
    if (y > 0) enqueueIfBg(x, y - 1);
    if (y < height - 1) enqueueIfBg(x, y + 1);
  }

  // Soften 1px boundary pixels next to transparent background and find bounding box
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      if (!visited[idx]) {
        const p = idx * 4;
        const brightness = (data[p] + data[p + 1] + data[p + 2]) / 3;
        if (
          brightness > 225 &&
          (visited[idx - 1] ||
            visited[idx + 1] ||
            visited[idx - width] ||
            visited[idx + width])
        ) {
          data[p + 3] = 140;
        }
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);

  if (maxX <= minX || maxY <= minY) {
    return canvas.toDataURL('image/png');
  }

  // Leave 24px transparent margin around the tight bounding box for the SVG white sticker outline
  const pad = 24;
  const cropW = maxX - minX + 1 + pad * 2;
  const cropH = maxY - minY + 1 + pad * 2;
  const croppedCanvas = document.createElement('canvas');
  croppedCanvas.width = cropW;
  croppedCanvas.height = cropH;
  const croppedCtx = croppedCanvas.getContext('2d');
  if (!croppedCtx) return canvas.toDataURL('image/png');

  croppedCtx.drawImage(
    canvas,
    minX,
    minY,
    maxX - minX + 1,
    maxY - minY + 1,
    pad,
    pad,
    maxX - minX + 1,
    maxY - minY + 1
  );

  return croppedCanvas.toDataURL('image/png');
}

export const HeroSection: React.FC<HeroSectionProps> = ({ content }) => {
  const [cutoutUrl, setCutoutUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isHoveringFerret, setIsHoveringFerret] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const resolvedStickerSrc = `${import.meta.env.BASE_URL}${content.stickerImageUrl.replace(/^\/+/, '')}`;

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;
      try {
        const processed = createTransparentCutoutDataUrl(img);
        setCutoutUrl(processed);
      } catch {
        setCutoutUrl(resolvedStickerSrc);
      }
    };
    img.onerror = () => {
      if (!cancelled) {
        setCutoutUrl(resolvedStickerSrc);
      }
    };
    img.src = resolvedStickerSrc;
    return () => {
      cancelled = true;
    };
  }, [resolvedStickerSrc]);

  const handlePlaySound = () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio(content.soundUrl);
        audioRef.current.addEventListener('ended', () => {
          setIsPlaying(false);
        });
        audioRef.current.addEventListener('error', () => {
          setIsPlaying(false);
        });
      }
      audioRef.current.currentTime = 0;
      setIsPlaying(true);
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center mb-12">
      {/* Hidden SVG Filter that generates the contour-hugging white die-cut sticker outline + drop shadow */}
      <svg className="sr-only" aria-hidden="true">
        <defs>
          <filter
            id="ferret-die-cut-sticker"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feMorphology
              in="SourceAlpha"
              operator="dilate"
              radius="8"
              result="dilated"
            />
            <feGaussianBlur
              in="dilated"
              stdDeviation="1.6"
              result="smoothed"
            />
            <feComponentTransfer in="smoothed" result="solidOutlineMask">
              <feFuncA type="linear" slope="18" intercept="0" />
            </feComponentTransfer>
            <feFlood floodColor="#FFFFFF" floodOpacity="1" result="whiteFill" />
            <feComposite
              in="whiteFill"
              in2="solidOutlineMask"
              operator="in"
              result="whiteStickerBorder"
            />
            <feDropShadow
              in="whiteStickerBorder"
              dx="0"
              dy="6"
              stdDeviation="6"
              floodColor="#1c1917"
              floodOpacity="0.22"
              result="stickerShadow"
            />
            <feMerge>
              <feMergeNode in="stickerShadow" />
              <feMergeNode in="whiteStickerBorder" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Left Column: Heading & Intro */}
      <div className="lg:col-span-6">
        {content.eyebrow && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs uppercase tracking-widest text-stone-500 mb-4">
            <span>{content.eyebrow}</span>
          </div>
        )}

        <h1
          className="text-3xl sm:text-5xl font-serif font-medium text-stone-900 tracking-tight mb-5 leading-[1.12]"
          style={{ textWrap: 'balance' }}
        >
          {content.title}
        </h1>

        <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl">
          {content.intro}
        </p>
      </div>

      {/* Right Column: Enlarged Pocket Animal Profile Card + Die-Cut Ferret Sticker */}
      <div className="lg:col-span-6 w-full pt-10 sm:pt-14 lg:pt-12">
        <div className="relative mx-auto max-w-xl">
          {/* Enlarged Pocket Animal Profile Card */}
          <div className="relative rounded-2xl border border-stone-300/90 bg-[#F3EFE6] p-5 sm:p-8 shadow-md">
            {/* Washi Tape Scrapbook Accent at Top Left */}
            <div
              aria-hidden="true"
              className="hidden sm:block absolute -top-3 left-10 w-24 h-6 bg-[#E6DEC8]/85 border border-stone-300/60 -rotate-2 shadow-xs pointer-events-none"
            />

            {/* Top Row inside Card: Ferret & Speech Bubble above Title on Mobile/Tablet (< lg), Right of Title on Desktop (lg:) */}
            <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-4 lg:gap-5 mb-5 pb-5 border-b border-stone-300/80">
              {/* Profile Header Title (Below ferret on mobile/tablet, Left on desktop) */}
              <div className="text-center lg:text-left min-w-0 flex-1">
                <h2 className="text-xl sm:text-2xl font-serif font-semibold text-stone-900 tracking-tight leading-snug">
                  {content.profileCardTitle}
                </h2>
              </div>

              {/* Speech Bubble + Die-Cut Ferret Sticker (Above title on mobile/tablet, Right on desktop) */}
              <div className="relative shrink-0 flex flex-col items-end -mt-12 sm:-mt-16 mx-auto lg:mx-0 lg:-mr-6">
                {/* Interactive Speech Bubble shifted 5% further right & swaying together with ferret on hover */}
                <div className="translate-x-[5%] mb-2">
                  <div
                    className={`relative z-30 bg-white border border-stone-300 rounded-2xl px-3 sm:px-3.5 py-2 shadow-md flex items-center gap-2.5 transition-transform duration-300 ${
                      isHoveringFerret
                        ? 'ferret-sway-active'
                        : isPlaying
                          ? 'translate-x-2 rotate-3 scale-105'
                          : ''
                    }`}
                  >
                    <div>
                      <div className="text-xs sm:text-sm font-serif font-semibold text-stone-900 leading-tight">
                        {content.speechBubbleMain}
                      </div>
                      <div className="text-[10px] sm:text-xs text-stone-500 leading-tight mt-0.5">
                        {content.speechBubbleSub}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handlePlaySound}
                      aria-label="Play ferret sound"
                      title="Play ferret sound (Dook dook!)"
                      className={`inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border transition-all cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                        isPlaying
                          ? 'bg-blue-600 border-blue-600 text-white scale-110 ring-4 ring-blue-200'
                          : 'bg-stone-100 hover:bg-blue-50 border-stone-300 hover:border-blue-300 text-stone-800 hover:text-blue-700'
                      }`}
                    >
                      <Volume2
                        className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`}
                      />
                    </button>

                    {/* Speech Bubble Tail pointing down toward the ferret's head */}
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-1.5 left-10 w-3 h-3 bg-white border-b border-r border-stone-300 rotate-45"
                    />
                  </div>
                </div>

                {/* Die-Cut Ferret Sticker with Rightward Sway on Hover */}
                <div
                  onClick={handlePlaySound}
                  onMouseEnter={() => setIsHoveringFerret(true)}
                  onMouseLeave={() => setIsHoveringFerret(false)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handlePlaySound();
                    }
                  }}
                  aria-label="Click ferret sticker to play happy ferret sound"
                  className={`relative z-20 cursor-pointer select-none transition-transform duration-300 ${
                    isHoveringFerret
                      ? 'ferret-sway-active'
                      : isPlaying
                        ? 'translate-x-2 rotate-3 scale-105'
                        : ''
                  }`}
                >
                  <img
                    src={cutoutUrl || resolvedStickerSrc}
                    alt="Domestic ferret die-cut sticker"
                    style={{ filter: 'url(#ferret-die-cut-sticker)' }}
                    className="w-48 sm:w-56 md:w-60 h-auto object-contain block"
                  />
                </div>
              </div>
            </div>

            {/* 2x2 Spacious Profile Stats Grid */}
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {content.profileStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl bg-[#FAF8F3] border border-stone-200/90 px-4 py-3.5 shadow-2xs"
                >
                  <dt className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    {stat.label}
                  </dt>
                  <dd className="text-base sm:text-lg font-serif font-medium text-stone-900 mt-1">
                    {stat.value}
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
