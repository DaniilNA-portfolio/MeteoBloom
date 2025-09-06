import { useEffect, useLayoutEffect, useRef, useCallback } from "react";

export default function Sun({
  visible = false,
  pos = {},
  drag,
  onPositionChange,
}) {
  const imgRef = useRef(null);
  const rafRef = useRef(null);
  const lastXY = useRef({ x: null, y: null });

  const reportCenter = useCallback(() => {
    if (!imgRef.current || !onPositionChange || !visible) return;
    const r = imgRef.current.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;

    // всегда передаём и центр, и границы
    const rect = {
      left: r.left,
      right: r.right,
      top: r.top,
      bottom: r.bottom,
      width: r.width,
      height: r.height,
    };

    // чтобы не спамить, сравниваем только центр
    if (x !== lastXY.current.x || y !== lastXY.current.y) {
      lastXY.current = { x, y };
      onPositionChange({ x, y, rect });
    }
  }, [onPositionChange, visible]);

  // при смене пресета/видимости — один раз
  useLayoutEffect(() => {
    reportCenter();
  }, [reportCenter, pos.top, pos.left, pos.w, visible]);

  // во время drag — по кадрам, без зависимости от объекта стиля
  useEffect(() => {
    if (!drag?.dragging) return;
    const tick = () => {
      reportCenter();
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(rafRef.current);
  }, [drag?.dragging, reportCenter]);

  // дополнительно: после окончания drag тоже обновляем позицию
  useEffect(() => {
    if (!drag?.dragging) {
      // небольшой таймаут, чтобы дождаться snapBack анимации
      const id = setTimeout(() => reportCenter(), 50);
      return () => clearTimeout(id);
    }
  }, [drag?.dragging, reportCenter]);

  return (
    <div
      className="weather-abs sun"
      style={{
        position: "absolute",
        top: pos.top ?? "-8%",
        left: pos.left ?? "8%",
        width: pos.w ?? "14%",
        height: "auto",
        zIndex: 40,
        display: visible ? "block" : "none",
        animation: drag?.dragging
          ? "none"
          : "swayPendulum 5s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite",
        transformOrigin: "50% 0%",
        willChange: "transform",
      }}
    >
      <img
        ref={imgRef}
        src="/images/sun.png"
        alt="sun"
        draggable={false}
        style={{ width: "100%", height: "auto", ...drag?.translateStyle }}
        {...drag?.dragHandlers}
        onLoad={reportCenter}
      />
    </div>
  );
}
