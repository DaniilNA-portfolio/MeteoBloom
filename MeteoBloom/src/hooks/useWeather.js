// src/hooks/useWeather.js
import { useEffect, useState } from "react";

/**
 * Получает текущую погоду с Open-Meteo.
 * ВАЖНО: включаем is_day, чтобы знать день/ночь.
 */
export function useWeather(lat, lon) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof lat !== "number" || typeof lon !== "number") return;

    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,weather_code,wind_speed_10m,is_day`;

    setLoading(true);
    setError(null);
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e?.message || "Ошибка загрузки"))
      .finally(() => setLoading(false));
  }, [lat, lon]);

  return { data, loading, error };
}
