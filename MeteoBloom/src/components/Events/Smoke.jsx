import { useEffect, useRef, useState } from "react";

const Smoke = ({ isActive }) => {
  const styleRef = useRef(null);
  const [delayedActive, setDelayedActive] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // создаём keyframes только один раз
    if (!document.getElementById("smoke-animation-style")) {
      const style = document.createElement("style");
      style.id = "smoke-animation-style";
      style.textContent = `
        @keyframes smokeRise {
          0% {
            transform: translateX(-50%) translateY(-10%) scale(1);
            opacity: 0.6;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            transform: translateX(-50%) translateY(-40px) scale(1.5);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
      styleRef.current = style;
    }
  }, []);

  // задержка перед активацией дыма
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (isActive) {
      timerRef.current = setTimeout(() => {
        setDelayedActive(true);
      }, 2000); // 🔥 1 секунда задержки
    } else {
      setDelayedActive(false); // сразу скрываем, если солнце ушло
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isActive]);

  return (
    <div
      className={`absolute bottom-[15px] left-[53%] transform -translate-x-1/2 transition-opacity duration-500 ${
        delayedActive ? "opacity-100" : "opacity-0"
      }`}
      style={{ zIndex: 45 }}
    >
      <div className="relative">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute bg-gray-200 rounded-full opacity-60"
            style={{
              width: `${1 + i * 5}px`,
              height: `${10 + i * 5}px`,
              bottom: `${i * 8}px`,
              left: "50%",
              transform: `translateX(-50%)`,
              animation: delayedActive
                ? `smokeRise ${1 + i * 0.3}s ease-in-out infinite`
                : "none",
              filter: "blur(2px)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Smoke;
