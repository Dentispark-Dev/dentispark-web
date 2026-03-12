"use client";

import { motion } from "framer-motion";

interface RadarData {
  ucat: number;
  mmi: number;
  personalStatement: number;
  clinicalKnowledge: number;
  academicGuidance: number;
}

interface MentorRadarChartProps {
  data: RadarData;
}

export function MentorRadarChart({ data }: MentorRadarChartProps) {
  const points = [
    { label: "UCAT", value: data.ucat || 0 },
    { label: "MMI", value: data.mmi || 0 },
    { label: "Personal Statement", value: data.personalStatement || 0 },
    { label: "Clinical Knowledge", value: data.clinicalKnowledge || 0 },
    { label: "Academic Guidance", value: data.academicGuidance || 0 },
  ];

  const size = 300;
  const center = size / 2;
  const radius = (size / 2) * 0.7;
  const angleStep = (Math.PI * 2) / points.length;

  const getCoordinates = (index: number, value: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 5) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const getLabelCoordinates = (index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = radius + 25;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const pathData = points
    .map((p, i) => {
      const { x, y } = getCoordinates(i, p.value);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ") + " Z";

  return (
    <div className="relative w-full aspect-square flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100 p-8 shadow-sm overflow-hidden">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Background webs */}
        {[1, 2, 3, 4, 5].map((level) => (
          <path
            key={level}
            d={points
              .map((_, i) => {
                const { x, y } = getCoordinates(i, level);
                return `${i === 0 ? "M" : "L"} ${x} ${y}`;
              })
              .join(" ") + " Z"}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {points.map((_, i) => {
          const { x, y } = getCoordinates(i, 5);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          d={pathData}
          fill="rgba(37, 99, 235, 0.2)"
          stroke="#2563eb"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Labels */}
        {points.map((p, i) => {
          const { x, y } = getLabelCoordinates(i);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              className="text-[10px] font-bold fill-gray-500 uppercase tracking-tighter"
              style={{ dominantBaseline: "middle" }}
            >
              {p.label}
            </text>
          );
        })}

        {/* Data points */}
        {points.map((p, i) => {
          const { x, y } = getCoordinates(i, p.value);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              className="fill-primary-600 stroke-white stroke-2"
            />
          );
        })}
      </svg>
      
      <div className="absolute top-4 left-4">
        <h4 className="text-sm font-bold text-gray-900">Expertise Profile</h4>
      </div>
    </div>
  );
}
