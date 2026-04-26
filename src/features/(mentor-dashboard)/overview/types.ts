export interface MentorOverviewStats {
  totalEarnings: number;
  guidedStudents: number;
  averageRating: string;
  totalHours: number;
  currency: string;
  isVerified: boolean;
  isStripeConnected: boolean;
}

export interface PayoutInfo {
  isConnected: boolean;
  isStripeConnected: boolean;
  bankAccountLast4?: string;
  nextPayoutDate?: string;
  pendingAmount?: number;
}

export interface MentorOverviewPageProps {
  className?: string;
}
