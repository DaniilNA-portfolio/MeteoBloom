export default function PendulumWrap({
  className = "",
  style,
  children,
  duration = "4.5s",
  delay = "0s",
  origin = "50% 0%",
}) {
  const localStyle = {
    animation: `swayPendulum ${duration} cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite`,
    animationDelay: delay,
    transformOrigin: origin,
    willChange: "transform",
    ...style,
  };

  return (
    <div className={`sway ${className}`} style={localStyle}>
      {children}
    </div>
  );
}
