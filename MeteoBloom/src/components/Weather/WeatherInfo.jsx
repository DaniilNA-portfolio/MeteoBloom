// src/components/Weather/WeatherInfo.jsx
import { useWeather } from "../../hooks/useWeather";

const WMAP = {
  0: "Ясно",
  1: "Преимущественно ясно",
  2: "Переменная облачность",
  3: "Пасмурно",
  45: "Туман",
  48: "Туман с изморозью",
  51: "Лёгкая морось",
  53: "Умеренная морось",
  55: "Сильная морось",
  61: "Слабый дождь",
  63: "Дождь",
  65: "Ливень",
  71: "Слабый снег",
  73: "Снег",
  75: "Сильный снег",
  80: "Кратковременные дожди",
  81: "Сильные кратковременные дожди",
  82: "Очень сильные кратковременные дожди",
  95: "Гроза",
  96: "Гроза с градом",
  99: "Сильная гроза с градом",
};

export default function WeatherInfo({
  city = "",
  lat,
  lon,
  mode = "manual",
  test = { code: 0, temp: 0 },
}) {
  const { data, loading, error } = useWeather(lat, lon);
  const isAuto = mode === "auto";

  const code = isAuto ? data?.current?.weather_code : test.code;
  const temp = isAuto ? data?.current?.temperature_2m : test.temp;
  const desc = typeof code === "number" ? WMAP[code] : "";

  const noCoords =
    isAuto && (typeof lat !== "number" || typeof lon !== "number");

  const statusText = noCoords
    ? "Разрешите доступ к геолокации."
    : isAuto && loading
    ? "Загрузка…"
    : isAuto && error
    ? `Ошибка: ${error}`
    : "";

  return (
    <div
      className="absolute top-4 left-1/2 -translate-x-1/2 text-center"
      style={{ zIndex: 100 }} // поверх всего
    >
      <h1 className="text-xl font-semibold text-white drop-shadow">
        {city || "Ваш город"}
      </h1>

      {/* Статус */}
      <div
        style={{ display: statusText ? "block" : "none" }}
        className="text-white/80 text-sm"
      >
        {statusText}
      </div>

      {/* Погода */}
      <div
        style={{ display: statusText ? "none" : "block" }}
        className="text-white/90 text-sm"
      >
        {typeof temp === "number" && typeof code === "number"
          ? `${desc || "Погода"} · ${Math.round(temp)}°C`
          : "—"}
      </div>
    </div>
  );
}
