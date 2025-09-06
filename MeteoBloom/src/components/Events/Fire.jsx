import { useEffect, useRef } from "react";

export default function Fire({ flipDelay = 2000, jitterDelay = 400 }) {
  const styleRef = useRef(null);

  useEffect(() => {
    if (!document.getElementById("fire-animations-style")) {
      const style = document.createElement("style");
      style.id = "fire-animations-style";
      style.textContent = `
        @keyframes fireJitterSnap {
          0%   { transform: translate(0, 0) rotate(0deg); }
          20%  { transform: translate(2px, -1px) rotate(-1deg); }
          40%  { transform: translate(-2px, 1px) rotate(1deg); }
          60%  { transform: translate(1px, 2px) rotate(-0.5deg); }
          80%  { transform: translate(-1px, -2px) rotate(0.7deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }

        @keyframes fireFlipSnap {
          0%   { transform: scaleX(1); }
          50%  { transform: scaleX(1); }
          51%  { transform: scaleX(-1); }
          100% { transform: scaleX(-1); }
        }
      `;
      document.head.appendChild(style);
      styleRef.current = style;
    }
  }, []);

  return (
    <div
      className="relative mx-auto select-none pointer-events-none"
      style={{ zIndex: 46, width: "180px" }} // ← нужная ширина
    >
      <img
        src="/images/fire.png"
        alt="fire"
        className="block"
        draggable={false}
        style={{
          width: "100%",
          height: "auto",
          animation: `
          fireJitterSnap ${jitterDelay}ms steps(1, end) infinite,
          fireFlipSnap ${flipDelay}ms steps(1, end) infinite
        `,
          transformOrigin: "center",
        }}
      />
    </div>
  );
}
