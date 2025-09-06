import { useEffect, useRef, useState } from "react";
import Smoke from "../Events/Smoke";
import Fire from "../Events/Fire";

export default function Sprout({ sunPosition, burnDelay = 7000 }) {
  const sproutRef = useRef(null);

  const [touching, setTouching] = useState(false);
  const [burned, setBurned] = useState(false);
  const burnTimerRef = useRef(null);

  const intersects = (r1, r2) => {
    return !(
      r2.left > r1.right ||
      r2.right < r1.left ||
      r2.top > r1.bottom ||
      r2.bottom < r1.top
    );
  };

  // определяем, есть ли контакт солнца с ростком
  useEffect(() => {
    if (!sproutRef.current || !sunPosition?.rect || burned) {
      setTouching(false);
      return;
    }
    const sproutRect = sproutRef.current.getBoundingClientRect();
    const sunRect = sunPosition.rect;
    setTouching(intersects(sproutRect, sunRect));
  }, [sunPosition, burned]);

  useEffect(() => {
    if (burnTimerRef.current) {
      clearTimeout(burnTimerRef.current);
      burnTimerRef.current = null;
    }

    // если есть касание и росток ещё не сгорел — запускаем таймер
    if (touching && !burned) {
      burnTimerRef.current = setTimeout(() => {
        setBurned(true); // 🔥 теперь огонь загорается
      }, burnDelay);
    }

    return () => {
      if (burnTimerRef.current) {
        clearTimeout(burnTimerRef.current);
        burnTimerRef.current = null;
      }
    };
  }, [touching, burned, burnDelay]);

  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
      {/* росток (скрыт, если сгорел) */}
      <img
        ref={sproutRef}
        src="/images/sprout.png"
        alt="sprout"
        className={`w-32 h-auto select-none pointer-events-none ${
          burned ? "hidden" : "block"
        }`}
        draggable={false}
      />

      {/* дым показываем только до пожара */}
      <div className={`${burned ? "hidden" : "block"}`}>
        <Smoke isActive={touching && !burned} />
      </div>

      {/* огонь появляется один раз и остаётся */}
      {burned && <Fire flipDelay={300} jitterDelay={400} />}
    </div>
  );
}
