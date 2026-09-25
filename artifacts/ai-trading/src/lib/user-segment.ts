import type { UserWithStatsSegment } from "@workspace/api-client-react";

// Shared styling for the cost/revenue/profit accounting segment (see the
// backend's lib/user-segment.ts for the free/paid/dev precedence rule) —
// used everywhere a segment badge/tile renders (admin-users.tsx's per-row
// badge + filter chips, admin.tsx's dashboard segment card and token-usage
// breakdown) so the colors stay consistent across the admin surface.
export const SEGMENT_BADGE_CLASS: Record<UserWithStatsSegment, string> = {
  free: "bg-muted text-muted-foreground border-transparent",
  paid: "bg-primary/10 text-primary border-primary/30",
  dev: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30",
};
