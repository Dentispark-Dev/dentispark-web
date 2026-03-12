export type ProfileFactor = "low-ses" | "early-bird" | "returning-user" | "standard";

export interface PricingPlan {
  id: string;
  name: string;
  basePrice: number;
  features: string[];
  isPremium?: boolean;
}

export const PLANS: PricingPlan[] = [
  {
    id: "essential",
    name: "Essential",
    basePrice: 0,
    features: ["AI Personal Statement Review", "Community Access", "Standard Tracking"],
  },
  {
    id: "pro",
    name: "DentiSpark Pro",
    basePrice: 49,
    isPremium: true,
    features: [
      "Unlimited AI Reviews",
      "Full Interview Prep Bot",
      "Mentor Matching Algorithm",
      "Priority Support",
      "Adaptive Goal Tracking"
    ],
  },
  {
    id: "elite",
    name: "Full Cycle Elite",
    basePrice: 199,
    isPremium: true,
    features: [
      "Everything in Pro",
      "Guaranteed Mentor Response",
      "Live MMI Mock Session",
      "University Strategy 1-on-1"
    ],
  }
];

export function calculateAdaptivePrice(basePrice: number, factors: ProfileFactor[]) {
  let discount = 0;
  
  if (factors.includes("low-ses")) discount += 0.30;
  if (factors.includes("early-bird")) discount += 0.15;
  if (factors.includes("returning-user")) discount += 0.10;

  const finalPrice = basePrice * (1 - discount);
  return {
    originalPrice: basePrice,
    discountedPrice: Math.round(finalPrice),
    discountPercentage: Math.round(discount * 100)
  };
}
