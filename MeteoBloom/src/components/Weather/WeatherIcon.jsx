import { useMemo } from "react";

export default function WeatherIcon({
  code,
  isNight = false,
  className = "h-44 mx-auto",
}) {
  const kind = useMemo(() => {
    if ([95, 96, 99].includes(code)) return "storm";
    if ([61, 63, 65, 80, 81, 82, 51, 53, 55].includes(code)) return "cloud";
    if ([2, 3].includes(code)) return "cloud";
    return isNight ? "month" : "sun"; // month.png — луна
  }, [code, isNight]);

  return (
    <img
      src={`/images/${kind}.png`}
      alt={kind}
      className={`${className} select-none pointer-events-none`}
      draggable={false}
    />
  );
}
