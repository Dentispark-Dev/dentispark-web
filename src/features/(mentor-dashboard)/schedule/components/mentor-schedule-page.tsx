import { useEffect, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { useModal } from "@/src/hooks/use-modal";
import { useAuth } from "@/src/providers/auth-provider";
import { toast } from "sonner";
import { ScheduleTimeSlot } from "./schedule-time-slot";
import { ScheduleForm } from "./schedule-form";
import { ScheduleSlot, ScheduleFormData, SchedulePageProps } from "../types";
import { SESSION_TYPES } from "../constants";
import { scheduleApi } from "../services/api";

export function MentorSchedulePage({ className }: SchedulePageProps) {
  const { user } = useAuth();
  const [scheduleSlots, setScheduleSlots] = useState<ScheduleSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, startTransition] = useTransition();
  const [editingSlot, setEditingSlot] = useState<ScheduleSlot | null>(null);
  const { showModal, hideModal } = useModal();

  // Load availability on mount
  useEffect(() => {
    if (user?.id) {
      loadAvailability();
    }
  }, [user?.id]);

  const loadAvailability = async () => {
    try {
      setIsLoading(true);
      const response = await scheduleApi.getAvailability(user!.id);
      if (response.responseCode === "00" && response.data?.availability) {
        setScheduleSlots(response.data.availability);
      }
    } catch (error) {
      toast.error("Failed to load schedule. Using offline mode.");
    } finally {
      setIsLoading(false);
    }
  };

  const persistChange = async (newSlots: ScheduleSlot[]) => {
    if (!user?.id) return;
    
    startTransition(async () => {
      try {
        const response = await scheduleApi.updateAvailability(user.id, newSlots);
        if (response.responseCode === "00") {
          toast.success("Schedule updated successfully");
        } else {
          throw new Error("Persistence failed");
        }
      } catch (error) {
        toast.error("Failed to sync schedule with server.");
      }
    });
  };

  const handleCreateSchedule = () => {
    setEditingSlot(null);
    showModal({
      modalTitle: "Create a schedule",
      bodyContent: (
        <ScheduleForm onSubmit={handleFormSubmit} onCancel={hideModal} />
      ),
      action: () => {},
      actionTitle: "",
      className: "rounded-2xl",
      secondaryAction: hideModal,
      secondaryActionTitle: "Cancel",
      type: "create-schedule",
      size: "2xl",
      isCustomContent: true,
    });
  };

  const handleEditSlot = (slot: ScheduleSlot) => {
    setEditingSlot(slot);
    showModal({
      modalTitle: "Edit schedule",
      bodyContent: (
        <ScheduleForm
          onSubmit={handleFormSubmit}
          onCancel={hideModal}
          initialData={{
            date: slot.date,
            startTime: slot.startTime,
            endTime: slot.endTime,
            sessionType: slot.sessionType.id,
            timezone: "GMT+1",
          }}
        />
      ),
      action: () => {},
      actionTitle: "",
      className: "rounded-lg",
      secondaryAction: hideModal,
      secondaryActionTitle: "Cancel",
      type: "edit-schedule",
      size: "2xl",
      isCustomContent: true,
    });
  };

  const handleDeleteSlot = (slotId: string) => {
    const updated = scheduleSlots.filter((slot) => slot.id !== slotId);
    setScheduleSlots(updated);
    persistChange(updated);
  };

  const handleFormSubmit = (data: ScheduleFormData) => {
    let updatedSlots: ScheduleSlot[] = [];
    
    if (editingSlot) {
      // Update existing slot
      updatedSlots = scheduleSlots.map((slot) =>
        slot.id === editingSlot.id
          ? {
              ...slot,
              date: data.date,
              startTime: data.startTime,
              endTime: data.endTime,
              sessionType:
                SESSION_TYPES.find((type) => type.id === data.sessionType) ||
                SESSION_TYPES[0],
            }
          : slot,
      );
    } else {
      // Create new slot
      const newSlot: ScheduleSlot = {
        id: Date.now().toString(),
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        sessionType:
          SESSION_TYPES.find((type) => type.id === data.sessionType) ||
          SESSION_TYPES[0],
        isAvailable: true,
      };
      updatedSlots = [...scheduleSlots, newSlot];
    }

    setScheduleSlots(updatedSlots);
    persistChange(updatedSlots);
    hideModal();
    setEditingSlot(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing Schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("space-y-8 py-6", className)}
    >
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold font-jakarta text-slate-900 tracking-tight">
            Schedule
          </h1>
          {isSaving && (
             <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" /> Saving changes...
             </div>
          )}
        </div>
        <Button
          onClick={handleCreateSchedule}
          className="h-11 gap-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10 px-6 font-bold"
        >
          <Plus className="h-4 w-4" />
          Add Availability
        </Button>
      </div>

      {/* Schedule Grid */}
      {scheduleSlots.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {scheduleSlots.map((slot) => (
            <ScheduleTimeSlot
              key={slot.id}
              slot={slot}
              onEdit={handleEditSlot}
              onDelete={handleDeleteSlot}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[500px] flex-col items-center justify-center rounded-[3rem] bg-white border-2 border-dashed border-slate-100 p-12 text-center">
            <div className="size-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-6">
                <Plus className="size-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No availability set</h3>
            <p className="text-slate-500 font-medium max-w-sm mx-auto mb-8">
               Clients can&apos;t book you until you set your working hours. Start by adding your first session slot.
            </p>
            <Button onClick={handleCreateSchedule} size="lg" className="rounded-2xl gap-2 font-bold px-8 h-14 bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20">
              <Plus className="h-5 w-5" />
              Set Availability
            </Button>
        </div>
      )}
    </motion.div>
  );
}
