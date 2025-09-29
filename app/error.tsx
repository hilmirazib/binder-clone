"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error boundary:", error);

    if (process.env.NODE_ENV === "production") {
      // analytics.track('global_error', {
      //   message: error.message,
      //   digest: error.digest
      // })
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Something went wrong!
        </h1>

        <p className="text-gray-600 mb-8 leading-relaxed">
          We encountered an unexpected error. Our team has been notified and
          we're working to fix it.
        </p>

        <div className="space-y-3">
          <Button onClick={reset} className="w-full touch-target">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>

          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="w-full touch-target"
          >
            Refresh Page
          </Button>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="flex-1 touch-target"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>

            <Button variant="ghost" asChild className="flex-1 touch-target">
              <Link href="/space">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
            </Button>
          </div>
        </div>

        {/* Error ID for support */}
        {error.digest && (
          <div className="mt-6 p-3 bg-gray-100 rounded-lg">
            <p className="text-xs text-gray-500">Error ID: {error.digest}</p>
            <p className="text-xs text-gray-500 mt-1">
              Reference this ID when contacting support
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
