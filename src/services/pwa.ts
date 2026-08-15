// Progressive Web App (PWA) Manager & Installation Service

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

type PWAEventListener = () => void;

class PWAManager {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private isStandalone: boolean = false;
  private isInstalled: boolean = false;
  private isOnline: boolean = navigator.onLine;
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
  private updateAvailable: boolean = false;
  private listeners: Set<PWAEventListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.checkStandalone();
      this.setupListeners();
    }
  }

  private checkStandalone() {
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://');

    this.isStandalone = isStandaloneMode;
    this.isInstalled = isStandaloneMode;
  }

  private setupListeners() {
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      // Prevent browser default mini-infobar on mobile
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.notify();
    });

    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.deferredPrompt = null;
      this.notify();
    });

    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notify();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notify();
    });
  }

  public registerServiceWorker() {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          this.serviceWorkerRegistration = reg;

          // Check for worker updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  this.updateAvailable = true;
                  this.notify();
                }
              });
            }
          });
        })
        .catch((_err) => {
          // In iframe or sandboxed environments SW might not register, fallback gracefully
        });
    });
  }

  public async promptInstall(): Promise<'accepted' | 'dismissed' | 'unsupported'> {
    if (!this.deferredPrompt) {
      return 'unsupported';
    }

    try {
      await this.deferredPrompt.prompt();
      const choiceResult = await this.deferredPrompt.userChoice;
      this.deferredPrompt = null;
      this.notify();
      return choiceResult.outcome;
    } catch (_err) {
      return 'unsupported';
    }
  }

  public applyUpdate() {
    if (this.serviceWorkerRegistration?.waiting) {
      this.serviceWorkerRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }

  public isInstallable(): boolean {
    return !!this.deferredPrompt && !this.isStandalone;
  }

  public getIsStandalone(): boolean {
    return this.isStandalone;
  }

  public getIsInstalled(): boolean {
    return this.isInstalled;
  }

  public getIsOnline(): boolean {
    return this.isOnline;
  }

  public getUpdateAvailable(): boolean {
    return this.updateAvailable;
  }

  public isIOS(): boolean {
    if (typeof window === 'undefined') return false;
    const ua = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(ua);
  }

  public subscribe(listener: PWAEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }
}

export const pwaManager = new PWAManager();
