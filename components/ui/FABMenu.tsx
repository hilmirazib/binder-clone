"use client";

import { useState } from "react";
import { Plus, X, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FABOption {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  primary?: boolean;
}

interface FABMenuProps {
  options: FABOption[];
}

export function FABMenu({ options }: FABMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: FABOption) => {
    option.onClick();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-24 right-4 z-50">
      {/* Menu Options */}
      {isOpen && (
        <div className="space-y-2 mb-3">
          {options.map((option, index) => (
            <div
              key={index}
              className="flex items-center gap-3 animate-in slide-in-from-bottom duration-200"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: "backwards",
              }}
            >
              <div className="bg-white px-3 py-2 rounded-lg shadow-lg">
                <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                  {option.label}
                </span>
              </div>
              <Button
                onClick={() => handleOptionClick(option)}
                size="sm"
                className={`rounded-full w-12 h-12 shadow-lg ${
                  option.primary
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-600 hover:bg-gray-700"
                }`}
              >
                <option.icon className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <Button
        onClick={toggleMenu}
        className={`rounded-full w-14 h-14 shadow-lg transition-all duration-200 ${
          isOpen
            ? "bg-gray-600 hover:bg-gray-700 rotate-45"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </Button>

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 -z-10" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
