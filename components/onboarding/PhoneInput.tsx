"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

const countries = [
  { code: "+62", name: "Indonesia", flag: "🇮🇩" },
  { code: "+1", name: "United States", flag: "🇺🇸" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "+60", name: "Malaysia", flag: "🇲🇾" },
];

interface PhoneInputProps {
  countryCode: string;
  phoneNumber: string;
  onCountryCodeChange: (code: string) => void;
  onPhoneNumberChange: (phone: string) => void;
  placeholder?: string;
}

export function PhoneInput({
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
  placeholder = "8123456789",
}: PhoneInputProps) {
  const selected =
    countries.find((c) => c.code === countryCode) ?? countries[0];

  return (
    <div className="relative">
      <div
        className="group flex h-11 w-full items-center rounded-xl border border-slate-300 bg-white
                      focus-within:ring-2 focus-within:ring-slate-300 focus-within:border-slate-300"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="h-full rounded-none bg-transparent px-3 shadow-none hover:bg-transparent
                         focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <span className="mr-2">{selected.flag}</span>
              <span className="font-medium tabular-nums">{selected.code}</span>
              <ChevronDown className="ml-1 h-4 w-4 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            sideOffset={8}
            className="z-50 w-[var(--trigger-width,16rem)] max-w-[min(20rem,90vw)]
                       rounded-xl border border-slate-200 bg-white p-0 shadow-lg"
          >
            <ul className="max-h-64 overflow-y-auto py-1">
              {countries.map((c) => (
                <li key={c.code}>
                  <DropdownMenuItem
                    onClick={() => onCountryCodeChange(c.code)}
                    className="cursor-pointer gap-2 px-3 py-2 text-sm hover:bg-slate-50"
                  >
                    <span className="w-5">{c.flag}</span>
                    <span className="w-12 tabular-nums text-slate-700">
                      {c.code}
                    </span>
                    <span className="flex-1 text-slate-600">{c.name}</span>
                  </DropdownMenuItem>
                </li>
              ))}
            </ul>
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="mx-2 h-6 w-px bg-slate-200" aria-hidden />

        <Input
          type="tel"
          value={phoneNumber}
          onChange={(e) =>
            onPhoneNumberChange(e.target.value.replace(/\D/g, ""))
          }
          placeholder={placeholder}
          maxLength={15}
          className="h-full flex-1 border-0 bg-transparent px-0 text-sm
                     placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
    </div>
  );
}
