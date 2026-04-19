"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Package, Truck, Smile } from "lucide-react";

type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

const statusSteps = [
  { status: "pending", label: "Processing", icon: Package },
  { status: "paid", label: "Confirmed", icon: CheckCircle2 },
  { status: "shipped", label: "Shipped", icon: Truck },
  { status: "delivered", label: "Delivered", icon: Smile },
];

export const StatusStepper = ({ currentStatus }: { currentStatus: string }) => {
  const currentIdx = statusSteps.findIndex((s) => s.status === currentStatus.toLowerCase());
  const effectiveIdx = currentIdx === -1 ? 0 : currentIdx;

  return (
    <div className="relative w-full py-12">
      {/* Progress Bar Background */}
      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-primary/5 -translate-y-1/2" />
      
      {/* Active Progress Bar */}
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${(effectiveIdx / (statusSteps.length - 1)) * 100}%` }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="absolute top-1/2 left-0 h-[2px] bg-primary -translate-y-1/2"
      />

      <div className="relative flex justify-between">
        {statusSteps.map((step, idx) => {
          const isActive = idx <= effectiveIdx;
          const isCurrent = idx === effectiveIdx;
          const Icon = step.icon;

          return (
            <div key={step.status} className="flex flex-col items-center gap-4 group">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.2 : 1,
                  backgroundColor: isActive ? "var(--primary)" : "var(--secondary)",
                  color: isActive ? "var(--primary-foreground)" : "var(--muted-foreground)",
                  borderColor: isActive ? "var(--primary)" : "var(--primary-5)",
                }}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 shadow-xl ${
                    isCurrent ? "shadow-primary/20" : "shadow-transparent"
                }`}
              >
                <Icon size={20} strokeWidth={1.5} />
              </motion.div>
              <div className="text-center">
                <p className={`text-[10px] uppercase tracking-[0.2em] font-bold transition-colors duration-500 ${
                  isActive ? "text-foreground" : "text-muted-foreground/40"
                }`}>
                  {step.label}
                </p>
                {isCurrent && (
                   <motion.div 
                    layoutId="currentStatus"
                    className="w-1 h-1 bg-primary rounded-full mx-auto mt-2" 
                   />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
