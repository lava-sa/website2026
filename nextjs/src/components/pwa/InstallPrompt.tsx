"use client";

import { useEffect, useState } from "react";
import { Download, X, Share, Plus } from "lucide-react";

/** Chrome/Edge fire this before showing their own mini-infobar. */
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt: () => Promise<void>;
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISS_KEY = "lava-pwa-install-dismissed";
const DISMISS_DAYS = 30;

function recentlyDismissed(): boolean {
  try {
    const ts = localStorage.getItem(DISMISS_KEY);
    if (!ts) return false;
    const days = (Date.now() - Number(ts)) / 86_400_000;
    return days < DISMISS_DAYS;
  } catch {
    return false;
  }
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIosSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua);
  const webkit = /WebKit/.test(ua);
  const notChrome = !/CriOS|FxiOS|EdgiOS/.test(ua);
  return iOS && webkit && notChrome;
}

/**
 * Installable-app prompt. On Chrome/Edge/Android we capture the native
 * `beforeinstallprompt` event and offer a branded install button. On iOS Safari
 * (which has no such event) we show manual "Add to Home Screen" instructions.
 * Dismissals are remembered for 30 days so it never nags.
 */
export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone() || recentlyDismissed()) return;

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    const onInstalled = () => {
      setVisible(false);
      setDeferred(null);
    };
    window.addEventListener("appinstalled", onInstalled);

    // iOS has no beforeinstallprompt — surface a manual hint after a short delay.
    let iosTimer: ReturnType<typeof setTimeout> | undefined;
    if (isIosSafari()) {
      iosTimer = setTimeout(() => {
        setShowIosHint(true);
        setVisible(true);
      }, 4000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
      if (iosTimer) clearTimeout(iosTimer);
    };
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === "accepted" || outcome === "dismissed") {
      setVisible(false);
      setDeferred(null);
      if (outcome === "dismissed") dismiss();
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[1100] max-w-[calc(100vw-2rem)] sm:max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white border border-border shadow-xl overflow-hidden">
        <div className="flex items-start gap-3 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/icon-192.png"
            alt="Lava-SA"
            className="h-12 w-12 shrink-0 rounded-md"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-primary text-sm leading-tight">
              Install the Lava-SA app
            </p>
            {showIosHint ? (
              <p className="text-xs text-copy-muted mt-1 leading-relaxed">
                Tap <Share className="inline h-3.5 w-3.5 -mt-0.5" /> then{" "}
                <span className="whitespace-nowrap font-semibold">
                  Add to Home Screen <Plus className="inline h-3.5 w-3.5 -mt-0.5" />
                </span>{" "}
                for one-tap access.
              </p>
            ) : (
              <p className="text-xs text-copy-muted mt-1 leading-relaxed">
                Add Lava-SA to your home screen for faster access and a full-screen
                shopping experience.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss install prompt"
            className="shrink-0 text-copy-muted hover:text-primary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!showIosHint && (
          <div className="flex border-t border-border">
            <button
              type="button"
              onClick={dismiss}
              className="flex-1 py-2.5 text-xs font-bold text-copy-muted hover:bg-surface transition-colors"
            >
              Not now
            </button>
            <button
              type="button"
              onClick={install}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary-dark transition-colors"
            >
              <Download className="h-3.5 w-3.5" /> Install
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
