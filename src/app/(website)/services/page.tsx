import { ServicesContent } from "@/src/features/(website)/services/components/services-content";

const mockServices = [
  {
    externalId: "1",
    mentorUsername: "dr_smith",
    title: "Comprehensive Personal Statement Review",
    slug: "comprehensive-personal-statement-review",
    description: "I will thoroughly review your dental school personal statement, providing detailed feedback on structure, content, and tone to ensure you stand out to admissions committees.",
    price: 150.0,
    currency: "USD",
    durationMinutes: 60,
    featuresJson: '["Line-by-line editing", "Structural feedback", "1-hour video consultation"]',
    serviceType: "Personal Statement Review",
    mentorName: "Dr. Sarah Smith",
    mentorRating: 4.9,
    reviews: 124
  },
  {
    externalId: "2",
    mentorUsername: "dr_jones",
    title: "MMI Mock Interview - Full Circuit",
    slug: "mmi-mock-interview-full-circuit",
    description: "Experience a full Multi-Mini Interview (MMI) circuit under timed, realistic conditions. Receive immediate personalized feedback on your performance for each station.",
    price: 200.0,
    currency: "USD",
    durationMinutes: 120,
    featuresJson: '["6 timed MMI stations", "Ethical scenarios", "Detailed performance scorecard"]',
    serviceType: "Mock Interview",
    mentorName: "Dr. James Jones",
    mentorRating: 5.0,
    reviews: 89
  },
  {
    externalId: "3",
    mentorUsername: "student_mentor_alex",
    title: "UCAT Strategy & Tutoring Session",
    slug: "ucat-strategy-tutoring",
    description: "Struggling with the UCAT? We will break down your weakest sections and implement proven strategies to boost your score efficiently.",
    price: 50.0,
    currency: "USD",
    durationMinutes: 45,
    featuresJson: '["Targeted practice questions", "Time management techniques", "Action plan"]',
    serviceType: "Tutoring",
    mentorName: "Alex R. (D4 Student)",
    mentorRating: 4.8,
    reviews: 42
  }
];

export const metadata = {
  title: "Mentor Services Marketplace | DentiSpark",
  description: "Browse and book expert services from top dental mentors to accelerate your career.",
};

export default function ServicesMarketplacePage() {
  return <ServicesContent services={mockServices} />;
}
