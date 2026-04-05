import { Suspense } from "react";
import Quiz from "@/src/features/(dashboard)/guidance-hub/components/quiz";
import { Loader2 } from "lucide-react";

export default function GuidanceHubQuizPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 text-primary-600 animate-spin" />
            </div>
        }>
            <Quiz />
        </Suspense>
    );
}
