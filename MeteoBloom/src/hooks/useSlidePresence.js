import { useEffect, useRef, useState } from "react";

/**
 * Анимация видимости:
 * - при появлении: старт справа (translateX(+120%)) -> 0
 * - при скрытии: уходит влево (translateX(-120%))
 * НИЧЕГО не размонтирует.
 */
export default function useSlidePresence(
  visible,
  {
    duration = 450, // мс
    distance = "120%",
    easing = "cubic-bezier(0.45, 0.05, 0.55, 0.95)",
  } = {}
) {
  const first = useRef(true);
  const rafRef = useRef(0);
  const [style, setStyle] = useState(() => {
    return visible
      ? {
          transform: "translateX(0%)",
          opacity: 1,
          transition: "none",
          pointerEvents: "auto",
        }
      : {
          transform: `translateX(-${distance})`, // спрятан слева
          opacity: 0,
          transition: "none",
          pointerEvents: "none",
        };
  });

  useEffect(() => {
    // на первом рендере не анимируем
    if (first.current) {
      first.current = false;
      return;
    }

    // очистка RAF
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    if (visible) {
      // вход справа
      setStyle({
        transform: `translateX(${distance})`,
        opacity: 0,
        transition: "none",
        pointerEvents: "none",
      });
      rafRef.current = requestAnimationFrame(() => {
        setStyle({
          transform: "translateX(0%)",
          opacity: 1,
          transition: `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`,
          pointerEvents: "auto",
        });
      });
    } else {
      // выход влево
      setStyle((prev) => ({
        ...prev,
        transform: `translateX(-${distance})`,
        opacity: 0,
        transition: `transform ${duration}ms ${easing}, opacity ${duration}ms ${easing}`,
        pointerEvents: "none",
      }));
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [visible, duration, distance, easing]);

  return { slideStyle: style };
}
