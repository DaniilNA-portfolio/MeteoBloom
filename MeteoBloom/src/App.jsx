import { useState, useCallback } from "react";
import CityChoise from "./components/Header/CityChoise";
import WeatherInfo from "./components/Weather/WeatherInfo";
import WeatherNow from "./components/Weather/WeatherNow";
import Sprout from "./components/Sprout/Sprout";
import Background from "./components/Background";

// ====== НАСТРОЙКИ ДЛЯ ТЕСТА ======
const USE_MANUAL = true;
const TEST_WEATHER = {
  code: 1,
  isNight: false,
  temp: 24,
};
// =================================

export default function App() {
  const [loc, setLoc] = useState({ lat: undefined, lon: undefined, city: "" });
  const [sunPosition, setSunPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = useCallback((next) => setLoc(next), []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start py-12">
      <CityChoise onChange={handleChange} />
      {/* <Background /> */}

      {/* ← Блок с городом и погодой */}
      <WeatherInfo
        city={loc.city}
        lat={loc.lat}
        lon={loc.lon}
        mode={USE_MANUAL ? "manual" : "auto"}
        test={TEST_WEATHER}
      />

      <WeatherNow
        lat={loc.lat}
        lon={loc.lon}
        mode={USE_MANUAL ? "manual" : "auto"}
        test={TEST_WEATHER}
        onSunPositionChange={setSunPosition}
        onDragStateChange={setIsDragging}
      />

      <Sprout sunPosition={sunPosition} isDragging={isDragging} />
    </div>
  );
}
