// src/components/Weather/WeatherNow.jsx
import { useMemo } from "react";
import { useWeather } from "../../hooks/useWeather";
import useDragTranslate from "../../hooks/useDragTranslate";
import useSlidePresence from "../../hooks/useSlidePresence";

import Sun from "./Image/Sun";
import Moon from "./Image/Moon";
import Cloud from "./Image/Cloud";
import Thunder from "./Image/Thunder";

export default function WeatherNow({
  lat,
  lon,
  mode = "manual",
  test = { code: 0, isNight: false, temp: 20 },
  onSunPositionChange,
  onDragStateChange,
}) {
  // --- хуки всегда, без ранних return ---
  const { data, loading, error } = useWeather(lat, lon);
  const isAuto = mode === "auto";

  // источники данных
  const code = isAuto ? data?.current?.weather_code : test.code;
  const isNight = isAuto ? data?.current?.is_day === 0 : !!test.isNight;

  // drag-хуки
  const sunDrag = useDragTranslate({
    onDragStart: () => onDragStateChange?.(true),
    onDragEnd: () => onDragStateChange?.(false),
  });

  const moonDrag = useDragTranslate();
  const cloudDrag = useDragTranslate();
  const thunderDrag = useDragTranslate();

  // группы кодов по ТЗ
  const ONLY_SUN = new Set([0, 1]);
  const SUN_AND_CLOUD = new Set([2]);
  const ONLY_CLOUD = new Set([
    3, 45, 48, 51, 53, 55, 61, 63, 65, 71, 73, 75, 80, 81, 82,
  ]);
  const ONLY_STORM = new Set([95, 96, 99]);

  const numCode = Number(code ?? 0);

  // пресеты (проценты от .weather-wrap)
  const PRESETS = {
    sun: { top: "-360%", left: "5%", w: "90%" },
    moon: { top: "-320%", left: "5%", w: "90%" },
    cloud: { top: "-320%", left: "15%", w: "70%" },

    "2_day_sun": { top: "-280%", left: "30%", w: "70%" },
    "2_day_cloud": { top: "-260%", left: "10%", w: "60%" },

    "2_night_moon": { top: "-250%", left: "30%", w: "70%" },
    "2_night_cloud": { top: "-260%", left: "15%", w: "60%" },

    "2_night_sun": { top: "-270%", left: "22%", w: "50%" },

    overcast: { top: "-320%", left: "15%", w: "70%" },
    storm: { top: "-310%", left: "5%", w: "90%" },
  };

  // спецификация видимости и позиций
  const spec = useMemo(() => {
    const isStorm = ONLY_STORM.has(numCode);

    // гроза — только storm.png
    if (isStorm) {
      return {
        showSun: false,
        showMoon: false,
        showCloud: false,
        showStorm: true,
        sunPos: PRESETS.sun,
        moonPos: PRESETS.moon,
        cloudPos: PRESETS.cloud,
        stormPos: PRESETS.storm,
      };
    }

    // переменная облачность (2)
    if (SUN_AND_CLOUD.has(numCode)) {
      if (!isNight) {
        return {
          showSun: true,
          showMoon: false,
          showCloud: true,
          showStorm: false,
          sunPos: PRESETS["2_day_sun"],
          moonPos: PRESETS.moon,
          cloudPos: PRESETS["2_day_cloud"],
          stormPos: PRESETS.storm,
        };
      }
      // Ночь: луна + облако (солнца нет)
      return {
        showSun: false,
        showMoon: true,
        showCloud: true,
        showStorm: false,
        sunPos: PRESETS["2_night_sun"], // не используется, но пусть будет
        moonPos: PRESETS["2_night_moon"],
        cloudPos: PRESETS["2_night_cloud"],
        stormPos: PRESETS.storm,
      };
    }

    // только светило (0,1)
    if (ONLY_SUN.has(numCode)) {
      if (!isNight) {
        return {
          showSun: true,
          showMoon: false,
          showCloud: false,
          showStorm: false,
          sunPos: PRESETS.sun,
          moonPos: PRESETS.moon,
          cloudPos: PRESETS.cloud,
          stormPos: PRESETS.storm,
        };
      }
      return {
        showSun: false,
        showMoon: true,
        showCloud: false,
        showStorm: false,
        sunPos: PRESETS.sun,
        moonPos: PRESETS.moon,
        cloudPos: PRESETS.cloud,
        stormPos: PRESETS.storm,
      };
    }

    // только облако (группа ONLY_CLOUD)
    if (ONLY_CLOUD.has(numCode)) {
      if (isNight) {
        // ночью: луна + облако (без солнца)
        return {
          showSun: false,
          showMoon: true,
          showCloud: true,
          showStorm: false,
          sunPos: PRESETS.sun,
          moonPos: PRESETS.moon,
          cloudPos: PRESETS.overcast,
          stormPos: PRESETS.storm,
        };
      }
      // днём: только облако
      return {
        showSun: false,
        showMoon: false,
        showCloud: true,
        showStorm: false,
        sunPos: PRESETS.sun,
        moonPos: PRESETS.moon,
        cloudPos: PRESETS.overcast,
        stormPos: PRESETS.storm,
      };
    }

    // дефолт
    return {
      showSun: !isNight,
      showMoon: !!isNight,
      showCloud: false,
      showStorm: false,
      sunPos: PRESETS.sun,
      moonPos: PRESETS.moon,
      cloudPos: PRESETS.cloud,
      stormPos: PRESETS.storm,
    };
  }, [numCode, isNight]);

  // статусный текст (всегда один и тот же DOM-узел)
  const statusText =
    isAuto && (typeof lat !== "number" || typeof lon !== "number")
      ? "Разрешите доступ к геолокации."
      : isAuto && loading
      ? "Загрузка…"
      : isAuto && error
      ? `Ошибка: ${error}`
      : "";

  // ---- твой слайд-блок: видимость -> анимация ----
  // флаги
  const showSun = !!spec.showSun;
  const showMoon = !!spec.showMoon;
  const showCloud = !!spec.showCloud;
  const showStorm = !!spec.showStorm;

  // слайды
  const sunSlide = useSlidePresence(showSun, { duration: 450 });
  const moonSlide = useSlidePresence(showMoon, { duration: 450 });
  const cloudSlide = useSlidePresence(showCloud, { duration: 450 });
  const stormSlide = useSlidePresence(showStorm, { duration: 450 });

  return (
    <div className="weather-wrap relative w-full h-[320px]">
      {/* статус */}
      <div
        className="absolute inset-x-0 top-2 text-center pointer-events-none"
        style={{ display: statusText ? "block" : "none" }}
      >
        <span>{statusText}</span>
      </div>

      {/* ВАЖНО: делаем wrapper абсолютным и на весь контейнер */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 40,
          ...sunSlide.slideStyle,
        }}
      >
        <Sun
          visible={true}
          pos={spec.sunPos}
          onPositionChange={onSunPositionChange}
          drag={sunDrag}
        />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 41,
          ...moonSlide.slideStyle,
        }}
      >
        <Moon visible={true} pos={spec.moonPos} drag={moonDrag} />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 42,
          ...cloudSlide.slideStyle,
        }}
      >
        <Cloud visible={true} pos={spec.cloudPos} drag={cloudDrag} />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 43,
          ...stormSlide.slideStyle,
        }}
      >
        <Thunder visible={true} pos={spec.stormPos} drag={thunderDrag} />
      </div>
    </div>
  );
}
