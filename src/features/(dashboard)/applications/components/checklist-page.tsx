"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Breadcrumb } from "@/src/components/ui/breadcrumb";
import { Card } from "@/src/components/ui/card";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/src/lib/utils";

const CHECKLIST_ITEMS = [
  {
    id: "1",
    title: "Personal Statement",
    description: "Write and review your personal statement",
    status: "completed",
    dueDate: "completed",
  },
  {
    id: "2",
    title: "UCAT Preparation",
    description: "Complete at least 5 practice tests",
    status: "in-progress",
    dueDate: "July 15, 2025",
  },
  {
    id: "3",
    title: "Work Experience",
    description: "Log your shadowing hours",
    status: "pending",
    dueDate: "August 10, 2025",
  },
  {
    id: "4",
    title: "A-Level Results",
    description: "Upload your predicted grades",
    status: "pending",
    dueDate: "August 15, 2025",
  },
];

export function ChecklistPage() {
  const router = useRouter();

  const breadcrumbItems = [
    { label: "Application", href: "/applications" },
    { label: "Checklist", isActive: true },
  ];

  const handleCustomBack = () => {
    router.push("/applications");
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Breadcrumb items={breadcrumbItems} onBack={handleCustomBack} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-text-color mb-8 text-2xl font-semibold"
        >
          Application Checklist
        </motion.h1>

        <div className="space-y-4">
          {CHECKLIST_ITEMS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * (index + 2) }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {item.status === "completed" ? (
                      <CheckCircle2 className="text-secondary-500 h-6 w-6" />
                    ) : item.status === "in-progress" ? (
                      <Clock className="text-primary h-6 w-6" />
                    ) : (
                      <Circle className="text-greys-300 h-6 w-6" />
                    )}
                    <div>
                      <h3 className="font-sora text-lg font-semibold">{item.title}</h3>
                      <p className="text-black-400 text-sm">{item.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-black-400 text-xs uppercase tracking-wider">Due Date</p>
                    <p className={cn(
                      "font-semibold",
                      item.status === "completed" ? "text-secondary-500" : "text-black-800"
                    )}>
                      {item.dueDate}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
