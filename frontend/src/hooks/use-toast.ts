import { useState } from "react";

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);

  return {
    message,
    show(messageText: string) {
      setMessage(messageText);
      window.setTimeout(() => setMessage(null), 3500);
    }
  };
}

