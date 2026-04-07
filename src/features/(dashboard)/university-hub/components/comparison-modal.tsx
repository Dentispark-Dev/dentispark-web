"use client";

import { University } from "../types";
import { Check, X } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ComparisonModalProps {
  universities: University[];
  onClose: () => void;
}

export function ComparisonModal({ universities, onClose }: ComparisonModalProps) {
  const metrics = [
    { label: "Entry Requirements", key: "entryRequirements" },
    { label: "UCAS Points", key: "ucasPoints" },
    { label: "Student Satisfaction", key: "studentSatisfaction", suffix: "%" },
    { label: "Graduate Prospects", key: "graduateProspects", suffix: "%" },
    { label: "Course Duration", key: "courseDuration" },
    { label: "Admission Status", key: "admissionStatus" },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border-b border-greys-200 p-4 text-left font-jakarta text-sm font-semibold text-black-800">
              Metric
            </th>
            {universities.map((uni) => (
              <th
                key={uni.id}
                className="border-b border-greys-200 p-4 text-center font-jakarta text-sm font-semibold text-black-800"
              >
                {uni.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric) => (
            <tr key={metric.key} className="hover:bg-greys-50 transition-colors">
              <td className="border-b border-greys-100 p-4 text-left font-jakarta text-sm text-black-600">
                {metric.label}
              </td>
              {universities.map((uni) => {
                const value = uni[metric.key as keyof University];
                const isBoolean = typeof value === "boolean";
                const isStatus = metric.key === "admissionStatus";

                return (
                  <td
                    key={uni.id}
                    className="border-b border-greys-100 p-4 text-center font-jakarta text-sm text-black-800"
                  >
                    {isStatus ? (
                      <span
                        className={cn(
                          "inline-block rounded-full px-2 py-1 text-xs font-medium",
                          value === "open"
                            ? "bg-secondary-50 text-secondary-600"
                            : "bg-greys-100 text-greys-600"
                        )}
                      >
                        {value === "open" ? "Open" : "Closed"}
                      </span>
                    ) : isBoolean ? (
                      value ? (
                        <Check className="mx-auto h-4 w-4 text-secondary-500" />
                      ) : (
                        <X className="mx-auto h-4 w-4 text-error-500" />
                      )
                    ) : (
                      <span>
                        {value ?? "-"}
                        {value !== undefined && metric.suffix}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
