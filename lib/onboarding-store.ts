import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OnboardingState {
  currentStep: number;

  // Form data
  phoneNumber: string;
  countryCode: string;
  verificationMethod: "sms" | "whatsapp" | null;
  otpCode: string;
  name: string;
  username: string;
  email: string;
  avatar: {
    type: "emoji" | "photo";
    emoji?: string;
    color?: string;
    photo?: string;
  };

  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentStep: (step: number) => void;
  setPhoneNumber: (phone: string) => void;
  setCountryCode: (code: string) => void;
  setVerificationMethod: (method: "sms" | "whatsapp") => void;
  setOTPCode: (code: string) => void;
  setProfileData: (data: {
    name: string;
    username: string;
    email: string;
  }) => void;
  setAvatar: (avatar: OnboardingState["avatar"]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetOnboarding: () => void;
  nextStep: () => void;
  previousStep: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      currentStep: 0,
      phoneNumber: "",
      countryCode: "+62",
      verificationMethod: null,
      otpCode: "",
      name: "",
      username: "",
      email: "",
      avatar: { type: "emoji", emoji: "😊", color: "#6366F1" },
      isLoading: false,
      error: null,

      setCurrentStep: (step) => set({ currentStep: step }),
      setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
      setCountryCode: (countryCode) => set({ countryCode }),
      setVerificationMethod: (verificationMethod) =>
        set({ verificationMethod }),
      setOTPCode: (otpCode) => set({ otpCode }),
      setProfileData: (data) =>
        set({
          name: data.name,
          username: data.username,
          email: data.email,
        }),
      setAvatar: (avatar) => set({ avatar }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      resetOnboarding: () =>
        set({
          currentStep: 0,
          phoneNumber: "",
          countryCode: "+62",
          verificationMethod: null,
          otpCode: "",
          name: "",
          username: "",
          email: "",
          avatar: { type: "emoji", emoji: "😊", color: "#6366F1" },
          isLoading: false,
          error: null,
        }),
      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 6),
        })),
      previousStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 0),
        })),
    }),
    {
      name: "binder-onboarding",
    },
  ),
);
