"use client";

import React from "react";
import { motion } from "framer-motion";

interface RadarPoint {
  subject: string;
  A: number;
  fullMark: number;
}

interface ApplicationRadarProps {
  data: RadarPoint[];
}

export function ApplicationRadar({ data }: ApplicationRadarProps) {
  const size = 300;
  const center = size / 2;
  const radius = center - 40;
  const angleStep = (Math.PI * 2) / data.length;

  const getCoordinates = (index: number, value: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    };
  };

  const points = data.map((d, i) => {
    const coords = getCoordinates(i, d.A);
    return `${coords.x},${coords.y}`;
  }).join(" ");

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1];

  return (
    <div className="relative w-full flex justify-center items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Background Grids */}
        {gridLevels.map((level, i) => (
          <polygon
            key={i}
            points={data.map((_, idx) => {
              const coords = getCoordinates(idx, level * 100);
              return `${coords.x},${coords.y}`;
            }).join(" ")}
            className="fill-none stroke-greys-100 stroke-[0.5]"
          />
        ))}

        {/* Axis Lines */}
        {data.map((_, i) => {
          const coords = getCoordinates(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={coords.x}
              y2={coords.y}
              className="stroke-greys-100 stroke-[0.5]"
            />
          );
        })}

        {/* Data Shape */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          points={points}
          className="fill-primary-500/20 stroke-primary-500 stroke-2"
        />

        {/* Labels */}
        {data.map((d, i) => {
          const coords = getCoordinates(i, 120);
          return (
            <text
              key={i}
              x={coords.x}
              y={coords.y}
              textAnchor="middle"
              className="text-[10px] font-black uppercase tracking-widest fill-black-400"
            >
              {d.subject}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
