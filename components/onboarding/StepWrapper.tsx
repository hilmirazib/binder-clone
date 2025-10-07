import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepWrapperProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  canGoBack?: boolean;
  onBack?: () => void;
  children: React.ReactNode;
}

export function StepWrapper({
  currentStep,
  totalSteps,
  canGoBack,
  onBack,
  children,
}: StepWrapperProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with back button and progress */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        {canGoBack ? (
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        ) : (
          <div className="w-9" />
        )}

        <div className="text-sm text-gray-500 font-medium">
          Step {currentStep} of {totalSteps}
        </div>

        <div className="w-9" />
      </div>

      {/* Progress bar */}
      <div className="px-4 py-3">
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div
            className="bg-blue-600 h-1 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
