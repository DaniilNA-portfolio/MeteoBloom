export default function Thunder({ visible = false, pos = {}, drag }) {
  const animOn = visible && !drag.dragging;

  return (
    <div
      className="weather-abs thunder"
      style={{
        position: "absolute",
        top: pos.top ?? "20%",
        left: pos.left ?? "50%",
        width: pos.w ?? "34%",
        height: "auto",
        zIndex: 43,
        display: visible ? "block" : "none",

        // раздельные свойства анимации
        animationName: animOn ? "swayPendulum" : "none",
        animationDuration: "6.8s",
        animationTimingFunction: "cubic-bezier(0.45, 0.05, 0.55, 0.95)",
        animationIterationCount: "infinite",
        animationDelay: "0.8s",

        transformOrigin: "50% 0%",
        willChange: "transform",
      }}
    >
      <img
        src="/images/cloud.png"
        alt="cloud"
        draggable={false}
        style={{ width: "100%", height: "auto", ...drag.translateStyle }}
        {...drag.dragHandlers}
      />
    </div>
  );
}
