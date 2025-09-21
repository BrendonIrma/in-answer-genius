import { toast as sonnerToast } from "sonner";

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

function toast(options: ToastOptions) {
  const { title, description, variant = "default" } = options;
  
  if (variant === "destructive") {
    sonnerToast.error(title, { description });
  } else {
    sonnerToast.success(title, { description });
  }
}

function useToast() {
  return {
    toast,
    toasts: [], // Для совместимости
    dismiss: () => {}, // Для совместимости
  };
}

export { useToast, toast };
