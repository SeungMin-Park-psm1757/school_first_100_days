import type { Metadata } from "next";

import { TimelineBoard } from "@/components/timeline-board";
import { phaseOrder, timelineTasks, userProfile } from "@/lib/data";

export const metadata: Metadata = {
  title: "타임라인",
  description: "현재 단계에서 볼 카드만 추려 보여줍니다."
};

export default function TimelinePage() {
  return (
    <TimelineBoard phaseOrder={phaseOrder} profile={userProfile} tasks={timelineTasks} />
  );
}
