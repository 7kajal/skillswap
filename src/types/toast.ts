export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
}

export interface ToastContextValue {
  showToast: (toast: Omit<ToastItem, "id">) => void;
}

export { type ChildrenProps as ToastProviderProps } from "@/types/common";
