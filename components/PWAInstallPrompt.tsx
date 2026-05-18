"use client";

import { useEffect, useState } from "react";
import { X, Download } from "lucide-react";

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event globally so it can be triggered later.
      (window as any).deferredPrompt = e;
      
      // Show the custom prompt after 10 seconds
      setTimeout(() => {
        // Check if they haven't already dismissed it this session
        if (!sessionStorage.getItem('pwa_prompt_dismissed')) {
          setShowPrompt(true);
        }
      }, 10000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    const deferredPrompt = (window as any).deferredPrompt;
    if (!deferredPrompt) return;
    setShowPrompt(false);
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      (window as any).deferredPrompt = null;
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white border-2 border-pg-rose rounded-2xl shadow-2xl p-4 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="w-12 h-12 bg-pg-rose text-white rounded-xl flex items-center justify-center shrink-0 shadow-inner">
            <Download size={24} />
          </div>
          <div>
            <h3 className="font-bold text-pg-gray-900 leading-tight">Install PurpleGirl App</h3>
            <p className="text-xs text-pg-gray-600 mt-1">Get fast, offline access to all our guides. No app store required!</p>
          </div>
        </div>
        <button onClick={handleDismiss} className="text-pg-gray-400 hover:text-pg-gray-700 bg-pg-cream rounded-full p-1 transition-colors">
          <X size={16} />
        </button>
      </div>
      <button 
        onClick={handleInstallClick}
        className="w-full mt-4 bg-pg-rose text-white font-bold py-2.5 rounded-xl hover:bg-pg-plum transition-colors shadow-md hover:shadow-lg"
      >
        Install Now
      </button>
    </div>
  );
}

export function InstallFooterButton() {
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    // Check if deferredPrompt was already captured globally
    if (typeof window !== 'undefined' && (window as any).deferredPrompt) {
      setCanInstall(true);
    }

    const checkInterval = setInterval(() => {
      if (typeof window !== 'undefined' && (window as any).deferredPrompt) {
        setCanInstall(true);
        clearInterval(checkInterval);
      }
    }, 1000);

    return () => clearInterval(checkInterval);
  }, []);

  const handleInstallClick = async () => {
    const deferredPrompt = (window as any).deferredPrompt;
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      (window as any).deferredPrompt = null;
      setCanInstall(false);
    }
  };

  if (!canInstall) return null;

  return (
    <button 
      onClick={handleInstallClick}
      className="flex items-center justify-center gap-2 bg-white/10 text-white hover:bg-pg-rose hover:text-white px-4 py-2.5 rounded-xl font-bold transition-all text-sm mt-6 border border-white/20 w-full"
    >
      <Download size={16} /> Install App
    </button>
  );
}
