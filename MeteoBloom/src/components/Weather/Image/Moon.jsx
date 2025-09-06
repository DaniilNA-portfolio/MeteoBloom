export default function Moon({ visible = false, pos = {}, drag }) {
  return (
    <div
      className="weather-abs moon"
      style={{
        position: "absolute",
        top: pos.top ?? "-8%",
        left: pos.left ?? "8%",
        width: pos.w ?? "14%",
        height: "auto",
        zIndex: 41,
        display: visible ? "block" : "none",
        animation: drag.dragging
          ? "none"
          : "swayPendulum 5s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite",
        transformOrigin: "50% 0%",
        willChange: "transform",
      }}
    >
      <img
        src="/images/month.png"
        alt="moon"
        draggable={false}
        style={{ width: "100%", height: "auto", ...drag.translateStyle }}
        {...drag.dragHandlers}
      />
    </div>
  );
}
