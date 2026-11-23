import { useEffect } from "react";

/**
 * Hook para ejecutar un callback al presionar la tecla Escape cuando una condición (isOpen) es verdadera.
 */
export const useEscapeKey = (onEscape: () => void, isOpen: boolean = true) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onEscape();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onEscape, isOpen]);
};

export default useEscapeKey;
