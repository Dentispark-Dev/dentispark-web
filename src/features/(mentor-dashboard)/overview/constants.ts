import { MentorOverviewStats, PayoutInfo } from "./types";

export const SAMPLE_MENTOR_STATS: MentorOverviewStats = {
  totalEarnings: 500,
  guidedStudents: 10,
  averageRating: "4.5",
  totalHours: 100,
  currency: "£",
  isVerified: true,
  isStripeConnected: true,
};

export const SAMPLE_PAYOUT_INFO: PayoutInfo = {
  isConnected: false,
  isStripeConnected: false,
  pendingAmount: 500,
};
