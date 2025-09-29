"use client";

import Link from "next/link";
import { ArrowLeft, Home, User, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* 404 Visual */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-gray-200 mb-2 select-none">
            404
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 leading-relaxed">
            The page you're looking for doesn't exist or may have been moved.
            Let's get you back to your groups and conversations.
          </p>
        </div>

        {/* Navigation Options */}
        <div className="space-y-3">
          <Button asChild className="w-full touch-target">
            <Link href="/space">
              <Home className="w-4 h-4 mr-2" />
              Go to Space
            </Link>
          </Button>

          <Button variant="outline" asChild className="w-full touch-target">
            <Link href="/you">
              <User className="w-4 h-4 mr-2" />
              View Profile
            </Link>
          </Button>

          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="w-full touch-target"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Helpful Suggestions */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Looking for something specific?
          </h3>
          <div className="text-sm text-blue-800 space-y-1">
            <div className="flex items-center gap-2">
              <Users className="w-3 h-3" />
              <span>Join or create groups in Space</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-3 h-3" />
              <span>Update your profile settings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
