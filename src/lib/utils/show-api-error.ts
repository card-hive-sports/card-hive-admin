'use client';

import { AxiosError } from "axios";
import { toast } from "sonner";

export const showApiError = (action: string, error: AxiosError, fallbackMessage?: string) => {
  console.error(`Failed to ${action}:`, error);
  const errorMessage = (error.response?.data as Record<string, unknown>)?.['message'];
  const message = Array.isArray(errorMessage) ? errorMessage[0] : errorMessage;
  toast.error(message ? `Failed to ${action}. ${message}` : fallbackMessage);
};
