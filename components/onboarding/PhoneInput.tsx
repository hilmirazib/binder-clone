import { useState } from "react";
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
  const selectedCountry =
    countries.find((c) => c.code === countryCode) || countries[0];

  return (
    <div className="flex">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="rounded-r-none border-r-0 px-3 min-w-[80px]"
          >
            <span className="mr-1">{selectedCountry.flag}</span>
            <span className="text-sm">{selectedCountry.code}</span>
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {countries.map((country) => (
            <DropdownMenuItem
              key={country.code}
              onClick={() => onCountryCodeChange(country.code)}
              className="cursor-pointer"
            >
              <span className="mr-2">{country.flag}</span>
              <span className="mr-2">{country.code}</span>
              <span className="text-sm text-gray-600">{country.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Input
        type="tel"
        value={phoneNumber}
        onChange={(e) => onPhoneNumberChange(e.target.value.replace(/\D/g, ""))}
        placeholder={placeholder}
        className="rounded-l-none flex-1"
        maxLength={15}
      />
    </div>
  );
}
