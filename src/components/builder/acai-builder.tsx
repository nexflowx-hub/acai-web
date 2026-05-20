'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useBuilderStore } from '@/store/builder-store';
import { StepSize } from './step-size';
import { StepCreams } from './step-creams';
import { StepToppings } from './step-toppings';
import { StepSauces } from './step-sauces';
import { BuilderFooter } from './builder-footer';
import { cn } from '@/lib/utils';
import type { BuilderStep } from '@/types';

const STEP_TITLES: Record<BuilderStep, string> = {
  1: 'Tamanho',
  2: 'Cremes / Bases',
  3: 'Toppings',
  4: 'Coberturas',
};

const STEP_KEYS: BuilderStep[] = [1, 2, 3, 4];

export function AcaiBuilder() {
  const isOpen = useBuilderStore((s) => s.isOpen);
  const close = useBuilderStore((s) => s.close);
  const currentStep = useBuilderStore((s) => s.currentStep);
  const nextStep = useBuilderStore((s) => s.nextStep);
  const prevStep = useBuilderStore((s) => s.prevStep);
  const selections = useBuilderStore((s) => s.selections);

  const canProceed = currentStep === 1 ? selections.step1_size !== null : true;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepSize />;
      case 2:
        return <StepCreams />;
      case 3:
        return <StepToppings />;
      case 4:
        return <StepSauces />;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 bg-card p-0 sm:max-w-lg"
      >
        {/* Header */}
        <SheetHeader className="border-b border-border/60 px-4 pb-4 pt-5">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-bold text-foreground">
              🫐 Crie o Seu Açaí
            </SheetTitle>
            <span className="text-xs text-muted-foreground">
              Passo {currentStep}/4
            </span>
          </div>

          {/* Step indicator dots */}
          <div className="flex items-center gap-3 pt-1">
            {STEP_KEYS.map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => {
                  if (step <= currentStep) {
                    useBuilderStore.getState().setStep(step);
                  }
                }}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={cn(
                    'size-2.5 rounded-full transition-all duration-300',
                    step === currentStep
                      ? 'bg-acai scale-125'
                      : step < currentStep
                        ? 'bg-acai/40'
                        : 'bg-muted-foreground/20'
                  )}
                />
                <span
                  className={cn(
                    'text-[10px] font-medium transition-colors',
                    step === currentStep
                      ? 'text-acai'
                      : 'text-muted-foreground/50'
                  )}
                >
                  {STEP_TITLES[step]}
                </span>
              </button>
            ))}
          </div>
        </SheetHeader>

        {/* Step content — scrollable */}
        <div className="flex-1 overflow-y-auto py-6 scrollbar-hide">
          <h3 className="mb-4 px-4 text-xl font-bold text-foreground">
            {STEP_TITLES[currentStep]}
          </h3>
          {renderStep()}
        </div>

        {/* Navigation + Footer */}
        <div className="flex flex-col gap-0 border-t border-border/60">
          {/* Step navigation */}
          <div className="flex items-center justify-between px-4 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={cn(
                'gap-1 text-sm',
                currentStep === 1
                  ? 'text-muted-foreground/30'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <ChevronLeft className="size-4" />
              Anterior
            </Button>

            <div className="flex items-center gap-1.5">
              {STEP_KEYS.map((step) => (
                <div
                  key={step}
                  className={cn(
                    'h-1 rounded-full transition-all duration-300',
                    step === currentStep
                      ? 'w-6 bg-acai'
                      : step < currentStep
                        ? 'w-3 bg-acai/30'
                        : 'w-3 bg-muted-foreground/20'
                  )}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={nextStep}
              disabled={currentStep === 4 || !canProceed}
              className={cn(
                'gap-1 text-sm',
                currentStep === 4 || !canProceed
                  ? 'text-muted-foreground/30'
                  : 'text-acai hover:text-acai/80'
              )}
            >
              Seguinte
              <ChevronRight className="size-4" />
            </Button>
          </div>

          {/* Price + Add to Cart footer */}
          <BuilderFooter />
        </div>
      </SheetContent>
    </Sheet>
  );
}
