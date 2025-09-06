// src/components/Background.jsx
import { useEffect, useMemo, useState } from "react";

const KEYS = [
  { name: "night", hour: 0 },
  { name: "morning", hour: 5 },
  { name: "day", hour: 9 },
  { name: "evening", hour: 17 },
  { name: "night", hour: 21 },
  { name: "night", hour: 24 },
];

const PALETTE = {
  night: ["#0c0c2d", "#1a1a4a"],
  morning: ["#ff9a8b", "#ff6a88", "#ff99ac"],
  day: ["#89f7fe", "#66a6ff"],
  evening: ["#fa709a", "#fee140"],
};

function lerpColor(hex1, hex2, t) {
  const a = hex1.replace("#", "");
  const b = hex2.replace("#", "");
  const r1 = parseInt(a.slice(0, 2), 16);
  const g1 = parseInt(a.slice(2, 4), 16);
  const bl1 = parseInt(a.slice(4, 6), 16);
  const r2 = parseInt(b.slice(0, 2), 16);
  const g2 = parseInt(b.slice(2, 4), 16);
  const bl2 = parseInt(b.slice(4, 6), 16);
  const r = Math.round(r1 + (r2 - r1) * t)
    .toString(16)
    .padStart(2, "0");
  const g = Math.round(g1 + (g2 - g1) * t)
    .toString(16)
    .padStart(2, "0");
  const bl = Math.round(bl1 + (bl2 - bl1) * t)
    .toString(16)
    .padStart(2, "0");
  return `#${r}${g}${bl}`;
}

function getPhase() {
  const now = new Date();
  const h = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;

  let i = KEYS.findIndex((k, idx) => h >= k.hour && h < KEYS[idx + 1].hour);
  if (i === -1) i = KEYS.length - 2;

  const start = KEYS[i];
  const end = KEYS[i + 1];
  const span = end.hour - start.hour || 24;
  const t = (h - start.hour) / span;
  return { from: start.name, to: end.name, t };
}

export default function Background() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((x) => x + 1), 5000);
    return () => clearInterval(id);
  }, []);

  const { top, bottom } = useMemo(() => {
    const { from, to, t } = getPhase();
    const [fromTop, fromBot] = PALETTE[from];
    const [toTop, toBot] = PALETTE[to];
    return {
      top: lerpColor(fromTop, toTop, t),
      bottom: lerpColor(fromBot, toBot, t),
    };
  }, [tick]);

  // градиенты под новые примеры
  const g1 = `radial-gradient(circle at 10% 20%, rgba(255,255,255,0.05) 0%, transparent 25%)`;
  const g2 = `radial-gradient(circle at 90% 80%, rgba(255,255,255,0.05) 0%, transparent 25%)`;

  // основной фон в зависимости от фазы (день/вечер/ночь)
  const g3 = `linear-gradient(135deg, ${top} 0%, ${bottom} 100%)`;

  // лёгкий вертикальный градиент-затемнение сверху вниз
  const g4 = `linear-gradient(180deg, rgba(0,0,0,0.04) 0%, transparent 60%, rgba(0,0,0,0.08) 100%)`;

  // картинка в /public
  const img = `url("/images/grayscale-sky.png")`;

  return (
    <div
      className="fixed inset-0 -z-10 transition-[background] duration-[1500ms] ease-out"
      style={{
        backgroundImage: `${g1}, ${g2}, ${g3}, ${g4}, ${img}`,
        backgroundBlendMode: "multiply, darken, multiply, darken, normal",
        backgroundSize: "auto, auto, auto, auto, cover",
        backgroundRepeat:
          "no-repeat, no-repeat, no-repeat, no-repeat, no-repeat",
        backgroundPosition: "center, center, center, center, center",
        filter: "saturate(0.85) brightness(0.9)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
      }}
    />
  );
}
