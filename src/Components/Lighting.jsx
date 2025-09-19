// Lighting.jsx
import React from "react";

const Lighting = () => {
  return (
    <div className="relative w-full bg-[#800000] py-6 overflow-hidden pb-0">
      {/* Curved string */}
      <svg
        viewBox="0 0 100 20"
        className="w-full h-16 text-yellow-400"
        preserveAspectRatio="none"
      >
        <path
          d="M0,10 Q25,0 50,10 T100,10"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="transparent"
          strokeDasharray="2 2"
        />
      </svg>

      {/* Bulbs hanging down */}
      <div className="absolute top-4 left-0 w-full flex justify-between px-6">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            {/* bulb */}
            <div
              className="w-3 h-3 rounded-full bg-yellow-300 shadow-[0_0_12px_4px_rgba(255,223,0,0.9)] animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            ></div>
            {/* hanging line */}
            <div className="w-[1px] h-6 bg-yellow-400"></div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default Lighting;
