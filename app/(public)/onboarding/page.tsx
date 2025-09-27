"use client";

import { useOnboardingStore } from "@/lib/onboarding-store";
import { StepWrapper } from "@/components/onboarding/StepWrapper";
import WelcomeStep from "./steps/welcome";
import VerificationStep from "./steps/verification";
import OTPStep from "./steps/otp";
import ProfileStep from "./steps/profile";
import AvatarStep from "./steps/avatar";
import ConfirmationStep from "./steps/confirmation";

export default function OnboardingPage() {
  const { currentStep, setCurrentStep } = useOnboardingStore();

  const steps = [
    { component: WelcomeStep, title: "Welcome to Binder!", showProgress: true },
    {
      component: VerificationStep,
      title: "Choose a verification method",
      showProgress: true,
    },
    { component: OTPStep, title: "Enter the code", showProgress: true },
    {
      component: ProfileStep,
      title: "Let's get you set up!",
      showProgress: true,
    },
    { component: AvatarStep, title: "Add a profile image", showProgress: true },
    {
      component: ConfirmationStep,
      title: "Looking good!",
      showProgress: false,
    },
  ];

  const CurrentStepComponent = steps[currentStep]?.component || WelcomeStep;
  const currentStepData = steps[currentStep];

  if (!currentStepData?.showProgress) {
    return <CurrentStepComponent />;
  }

  return (
    <StepWrapper
      currentStep={currentStep + 1}
      totalSteps={5}
      title={currentStepData.title}
      canGoBack={currentStep > 0}
      onBack={() => setCurrentStep(currentStep - 1)}
    >
      <CurrentStepComponent />
    </StepWrapper>
  );
}
