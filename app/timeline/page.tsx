import type { Metadata } from "next";

import { TimelineBoard } from "@/components/timeline-board";
import { phaseOrder, timelineTasks, userProfile } from "@/lib/data";

export const metadata: Metadata = {
  title: "타임라인",
  description: "입학 준비부터 100일 회고까지 현재 시점에 맞는 우선 작업을 확인하세요."
};

export default function TimelinePage() {
  return (
    <TimelineBoard phaseOrder={phaseOrder} profile={userProfile} tasks={timelineTasks} />
  );
}
