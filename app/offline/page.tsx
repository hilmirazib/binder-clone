import Link from "next/link";
import { Wifi, RefreshCw, Home, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Offline Icon */}
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Wifi className="w-10 h-10 text-gray-400" />
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          You're Offline
        </h1>

        <p className="text-gray-600 mb-8 leading-relaxed">
          It looks like you're not connected to the internet. Some features may
          not be available until you reconnect.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={() => window.location.reload()}
            className="w-full touch-target"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" asChild className="flex-1 touch-target">
              <Link href="/space">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
            </Button>

            <Button variant="outline" asChild className="flex-1 touch-target">
              <Link href="/you">
                <Users className="w-4 h-4 mr-2" />
                Profile
              </Link>
            </Button>
          </div>
        </div>

        {/* Offline Tips */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 text-left">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            💡 While you're offline:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Previously loaded content may still be available</li>
            <li>• New messages and notes won't sync until reconnected</li>
            <li>• Your drafts are saved locally and won't be lost</li>
          </ul>
        </div>

        {/* Connection Status */}
        <div className="mt-6">
          <p className="text-xs text-gray-500">
            Connection will be restored automatically when available
          </p>
        </div>
      </div>
    </div>
  );
}
