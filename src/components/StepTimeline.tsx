import type { Step } from "@/lib/types";
import { stepStatusColor, stepStatusIcon } from "@/lib/utils";

interface StepTimelineProps {
  steps: Step[];
}

export function StepTimeline({ steps }: StepTimelineProps) {
  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const color = stepStatusColor(step.status);
        const icon = stepStatusIcon(step.status);
        const isActive = step.status === "in_progress" || step.status === "awaiting_approval";

        return (
          <div key={step.id} className="flex gap-3 group">
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] shrink-0 ${color} ${
                  isActive
                    ? "border-status-amber/40 bg-status-amber/5"
                    : "border-border bg-transparent"
                }`}
              >
                {icon}
              </div>
              {i < steps.length - 1 && (
                <div className="w-px flex-1 bg-border min-h-[8px]" />
              )}
            </div>
            <div className="pb-4 pt-0.5 min-w-0">
              <p
                className={`text-[12px] leading-tight ${
                  isActive ? "text-foreground font-medium" : color
                }`}
              >
                {step.label}
              </p>
              {step.command && (
                <p className="text-[11px] font-mono text-muted mt-1 truncate">
                  {step.command.replace("{target}", "acme-staging")}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
