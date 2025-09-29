export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

// Throttle function for scroll events and resize handlers
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Intersection Observer for lazy loading and infinite scroll
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {},
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: "50px",
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver(callback, defaultOptions);
}

// Virtual scrolling helper for large lists (messages, notes)
export function calculateVisibleItems({
  containerHeight,
  itemHeight,
  scrollTop,
  totalItems,
  overscan = 5,
}: {
  containerHeight: number;
  itemHeight: number;
  scrollTop: number;
  totalItems: number;
  overscan?: number;
}) {
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight),
    totalItems - 1,
  );

  const start = Math.max(0, visibleStart - overscan);
  const end = Math.min(totalItems - 1, visibleEnd + overscan);

  return {
    start,
    end,
    visibleStart,
    visibleEnd,
    offsetY: start * itemHeight,
  };
}

// Memory usage monitoring (development only)
export function logMemoryUsage(label: string) {
  if (process.env.NODE_ENV !== "development") return;

  if ("memory" in performance) {
    const memory = (performance as any).memory;
    console.log(`[${label}] Memory Usage:`, {
      used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)} MB`,
      total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)} MB`,
      limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)} MB`,
      percentage: `${Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)}%`,
    });
  }
}

// Performance monitoring for key user interactions
export function measurePerformance<T extends (...args: any[]) => any>(
  func: T,
  label: string,
): T {
  return ((...args: Parameters<T>) => {
    const start = performance.now();
    const result = func(...args);

    if (result instanceof Promise) {
      return result.finally(() => {
        const end = performance.now();
        console.log(`[${label}] Async operation took ${end - start} ms`);
      }) as ReturnType<T>;
    } else {
      const end = performance.now();
      console.log(`[${label}] Sync operation took ${end - start} ms`);
      return result;
    }
  }) as T;
}

// Image lazy loading with progressive enhancement
export function createImageLoader() {
  // Base64 placeholder for lazy loading
  const placeholder =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjYiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+";

  return {
    placeholder,

    load: (src: string, onLoad?: () => void, onError?: () => void) => {
      const img = new Image();
      img.onload = () => onLoad?.();
      img.onerror = () => onError?.();
      img.src = src;
      return img;
    },

    preload: (srcArray: string[]) => {
      srcArray.forEach((src) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = src;
        document.head.appendChild(link);
      });
    },
  };
}

// Bundle size analyzer (development)
export function analyzeBundleSize() {
  if (process.env.NODE_ENV !== "development") return;

  const scripts = document.querySelectorAll("script[src]");
  const styles = document.querySelectorAll('link[rel="stylesheet"]');

  console.log("Bundle Analysis:");
  console.log(`📦 Script files: ${scripts.length}`);
  console.log(`🎨 Style files: ${styles.length}`);

  // Log largest scripts
  Array.from(scripts).forEach((script, i) => {
    const src = script.getAttribute("src");
    if (src) {
      console.log(`   ${i + 1}. ${src}`);
    }
  });
}

// Resource loading optimization
export function optimizeResourceLoading() {
  // Preload critical resources
  const criticalResources = [
    "/fonts/inter-var.woff2",
    "/icons/icon-192x192.png",
  ];

  criticalResources.forEach((resource) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = resource;
    if (resource.includes(".woff")) {
      link.as = "font";
      link.type = "font/woff2";
      link.crossOrigin = "anonymous";
    } else if (resource.includes(".png")) {
      link.as = "image";
    }
    document.head.appendChild(link);
  });
}

// Service worker registration helper
export async function registerServiceWorker() {
  if (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    process.env.NODE_ENV === "production"
  ) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      console.log("Service Worker registered:", registration.scope);

      // Listen for updates
      registration.addEventListener("updatefound", () => {
        console.log("Service Worker update available");
        // Could show update notification to user
      });

      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  }
}
