"use client";

import { createContext, useContext, ReactNode } from "react";
import { useNetworkStatus } from "@/lib/hooks/useNetworkStatus";

interface NetworkStatusContextType {
  isOnline: boolean;
  wasOffline: boolean;
}

const NetworkStatusContext = createContext<
  NetworkStatusContextType | undefined
>(undefined);

export function NetworkStatusProvider({ children }: { children: ReactNode }) {
  const networkStatus = useNetworkStatus();

  return (
    <NetworkStatusContext.Provider value={networkStatus}>
      {children}

      {/* Offline indicator */}
      {!networkStatus.isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white px-4 py-2 text-center text-sm font-medium">
          You're offline. Some features may not work properly.
        </div>
      )}
    </NetworkStatusContext.Provider>
  );
}

export function useNetworkStatusContext() {
  const context = useContext(NetworkStatusContext);
  if (context === undefined) {
    throw new Error(
      "useNetworkStatusContext must be used within a NetworkStatusProvider",
    );
  }
  return context;
}
