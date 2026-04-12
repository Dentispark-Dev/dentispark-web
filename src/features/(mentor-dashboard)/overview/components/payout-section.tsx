"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { useModal } from "@/src/hooks/use-modal";
import { toast } from "sonner";
import { PayoutInfo } from "../types";
import { BankInformationForm } from "./bank-information-form";

interface PayoutSectionProps {
  payoutInfo: PayoutInfo;
  className?: string;
  onConnectBankAccountAction: () => void;
  readonly borderColor?: string;
}

export function PayoutSection({
  className,
  payoutInfo,
  onConnectBankAccountAction,
}: PayoutSectionProps) {
  const { showModal, hideModal } = useModal();

  const handleConnectBankAccount = () => {
    showModal({
      type: "bank-information",
      modalTitle: "Payout Configuration",
      modalTitleClassName: "text-center font-jakarta font-bold",
      size: "md",
      isCustomContent: true,
      bodyContent: (
        <BankInformationForm onSubmit={handleBankSubmit} onCancel={hideModal} />
      ),
      action: () => {},
      actionTitle: "",
    });
  };

  const handleBankSubmit = (data: {
    sortCode: string;
    accountNumber: string;
  }) => {
    toast.success("Banking identity updated", { 
      description: `Strategy: Direct Payout to account ending in ...${data.accountNumber.slice(-4)}` 
    });
    hideModal();
    onConnectBankAccountAction();
  };

  return (
    <Card
      className={cn(
        "font-jakarta rounded-[2rem] border-slate-100 text-center shadow-xl shadow-slate-200/40 bg-white overflow-hidden group",
        className,
      )}
    >
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-slate-900 text-lg font-bold">Payout Infrastructure</h3>
            <p className="text-slate-500 text-xs font-medium">
              {payoutInfo.isStripeConnected 
                ? "Your professional earnings are directed to your linked account." 
                : "Link your verified bank account to enable secure withdrawals."}
            </p>
          </div>

          {payoutInfo.isStripeConnected && (
            <div className="py-3 px-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between group-hover:bg-emerald-100 transition-colors">
              <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest">Linked: •••• {payoutInfo.bankAccountLast4}</span>
              <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
          )}

          <Button
            onClick={handleConnectBankAccount}
            className={cn(
              "w-full h-14 rounded-2xl font-bold transition-all shadow-lg",
              payoutInfo.isStripeConnected 
                ? "bg-slate-900 hover:bg-black text-white" 
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20"
            )}
          >
            {payoutInfo.isStripeConnected ? "Update Banking Data" : "Connect Stripe Express"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
