import { useEffect } from "react";

export default function CityChoise({ onChange }) {
  useEffect(() => {
    // Если в браузере нет геолокации → fallback по IP
    if (!navigator.geolocation) {
      fetch(
        "https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en"
      )
        .then((r) => r.json())
        .then((d) => {
          onChange?.({
            lat: undefined,
            lon: undefined,
            city: d?.city || d?.locality || "Неизвестно",
          });
        })
        .catch(() => {
          onChange?.({
            lat: undefined,
            lon: undefined,
            city: "Не удалось определить",
          });
        });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const lat = coords.latitude;
        const lon = coords.longitude;

        try {
          const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
          const res = await fetch(url, {
            headers: { Accept: "application/json" },
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();

          onChange?.({
            lat,
            lon,
            city: data?.city || data?.locality || "Неизвестно",
          });
        } catch {
          onChange?.({ lat, lon, city: "Не удалось определить" });
        }
      },
      // Ошибка: пользователь отклонил доступ к геолокации → fallback по IP
      () => {
        fetch(
          "https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en"
        )
          .then((r) => r.json())
          .then((d) => {
            onChange?.({
              lat: undefined,
              lon: undefined,
              city: d?.city || d?.locality || "Неизвестно",
            });
          })
          .catch(() => {
            onChange?.({
              lat: undefined,
              lon: undefined,
              city: "Не удалось определить",
            });
          });
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  }, [onChange]);

  return null; // компонент логический — UI не рендерит
}
