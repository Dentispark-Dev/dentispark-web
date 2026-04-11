import { PaymentSetupForm } from "@/src/features/(dashboard)/payment-setup/components";

export const metadata = {
  title: "Payment Setup – DentiSpark",
  description: "Set up your premium payment method to unlock 1:1 mentorship and more.",
};

export default function PaymentSetupPage() {
  return <PaymentSetupForm />;
}
