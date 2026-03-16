import GuidanceHubMenu from "@/src/features/(dashboard)/guidance-hub/components/guidance-hub-menu";
import { AIGuidanceAssistant } from "@/src/features/(dashboard)/guidance-hub/components/ai-guidance-assistant";

export default function GuidanceHubScope() {
    return (
        <>
            <GuidanceHubMenu />
            <AIGuidanceAssistant />
        </>
    );
}
