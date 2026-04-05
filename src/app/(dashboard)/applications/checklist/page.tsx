import { Suspense } from "react";
import { ChecklistPage } from "@/src/features/(dashboard)/applications/components/checklist-page";
import { Loader2 } from "lucide-react";

export default function ApplicationChecklist() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
      </div>
    }>
      <ChecklistPage />
    </Suspense>
  );
}
