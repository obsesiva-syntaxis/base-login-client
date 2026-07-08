import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/authStore";

const DEFAULT_TIMEOUT_MS = 15 * 60 * 1000;

export const useSessionTimeout = (timeoutMs: number = DEFAULT_TIMEOUT_MS): void => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const clearTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };

    const resetTimer = () => {
      clearTimer();
      timerRef.current = setTimeout(() => {
        useAuthStore.getState().clearUser();
      }, timeoutMs);
    };

    const handleUserClick = () => {
      resetTimer();
    };

    resetTimer();

    document.addEventListener("click", handleUserClick);

    return () => {
      clearTimer();
      document.removeEventListener("click", handleUserClick);
    };
  }, [timeoutMs]);
};
