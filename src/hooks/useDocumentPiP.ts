import { useCallback, useEffect, useState } from "react";

interface DocumentPictureInPictureAPI {
  requestWindow(options?: { width?: number; height?: number }): Promise<Window>;
}

type WindowWithPiP = Window & { documentPictureInPicture?: DocumentPictureInPictureAPI };

export function useDocumentPiP() {
  const [pipWindow, setPipWindow] = useState<Window | null>(null);

  const isSupported = typeof window !== "undefined" && "documentPictureInPicture" in window;
  const isOpen = pipWindow != null;

  const openPiP = useCallback(
    async (width = 480, height = 520) => {
      if (!isSupported) return;
      const dpip = (window as WindowWithPiP).documentPictureInPicture;
      if (!dpip) return;
      try {
        const pip = await dpip.requestWindow({ width, height });

        // Tailwind CSS를 PiP 창에 복사
        for (const sheet of document.styleSheets) {
          try {
            const cssText = Array.from(sheet.cssRules)
              .map((r) => r.cssText)
              .join("");
            const style = pip.document.createElement("style");
            style.textContent = cssText;
            pip.document.head.appendChild(style);
          } catch {
            if (sheet.href) {
              const link = pip.document.createElement("link");
              link.rel = "stylesheet";
              link.href = sheet.href;
              pip.document.head.appendChild(link);
            }
          }
        }

        pip.document.body.style.cssText = "margin:0;padding:12px;background:#0f172a;box-sizing:border-box;";
        pip.addEventListener("pagehide", () => setPipWindow(null));
        setPipWindow(pip);
      } catch {
        // 사용자가 취소했거나 브라우저가 차단
      }
    },
    [isSupported],
  );

  const closePiP = useCallback(() => {
    pipWindow?.close();
    setPipWindow(null);
  }, [pipWindow]);

  // 컴포넌트 언마운트 시 PiP 창 닫기
  useEffect(() => {
    return () => {
      pipWindow?.close();
    };
  }, [pipWindow]);

  return { openPiP, closePiP, pipWindow, isOpen, isSupported };
}
