"use client";

import { useState, useCallback } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  icon?: React.ReactNode;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  icon,
}: ConfirmDialogProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsConfirming(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Confirmation action failed:", error);
      // Error will be handled by the calling component
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-3">
            {icon ||
              (variant === "destructive" && (
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
              ))}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isConfirming}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isConfirming}
            className={
              variant === "destructive" ? "bg-red-600 hover:bg-red-700" : ""
            }
          >
            {isConfirming ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Hook for easy confirmation dialogs
export function useConfirmDialog() {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => Promise<void> | void;
    confirmLabel?: string;
    variant?: "default" | "destructive";
  } | null>(null);

  const confirm = useCallback(
    (options: {
      title: string;
      description: string;
      onConfirm: () => Promise<void> | void;
      confirmLabel?: string;
      variant?: "default" | "destructive";
    }) => {
      return new Promise<boolean>((resolve) => {
        setDialogState({
          ...options,
          isOpen: true,
          onConfirm: async () => {
            await options.onConfirm();
            resolve(true);
          },
        });
      });
    },
    [],
  );

  const closeDialog = useCallback(() => {
    setDialogState(null);
  }, []);

  const ConfirmDialogComponent = dialogState ? (
    <ConfirmDialog
      isOpen={dialogState.isOpen}
      onClose={closeDialog}
      onConfirm={dialogState.onConfirm}
      title={dialogState.title}
      description={dialogState.description}
      confirmLabel={dialogState.confirmLabel}
      variant={dialogState.variant}
    />
  ) : null;

  return {
    confirm,
    ConfirmDialogComponent,
  };
}
