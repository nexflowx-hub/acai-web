'use client';

import { useState, useCallback } from 'react';
import { Truck, Store, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useLocationStore } from '@/store/location-store';
import { timeSlots } from '@/data/mockData';
import type { DeliveryMode, TimeSlot } from '@/types';

interface GeofencingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GeofencingModal({ open, onOpenChange }: GeofencingModalProps) {
  const {
    isVerified,
    postalCode,
    mode,
    selectedTimeSlot,
    setPostalCode,
    setMode,
    setTimeSlot,
    verify,
  } = useLocationStore();

  // Track whether the user has attempted verification during this session
  const [verificationAttempted, setVerificationAttempted] = useState(false);
  // Track if the input has been modified since last verify
  const [isDirty, setIsDirty] = useState(false);

  const handlePostalCodeChange = useCallback(
    (value: string) => {
      setPostalCode(value);
      setIsDirty(true);
      setVerificationAttempted(false);
    },
    [setPostalCode]
  );

  const handleVerify = useCallback(() => {
    verify();
    setVerificationAttempted(true);
    setIsDirty(false);
  }, [verify]);

  const handleModeToggle = useCallback(
    (checked: boolean) => {
      const newMode: DeliveryMode = checked ? 'pickup' : 'delivery';
      setMode(newMode);
    },
    [setMode]
  );

  const handleTimeSlotChange = useCallback(
    (value: string) => {
      const slot = timeSlots.find((ts) => ts.id === value) ?? null;
      setTimeSlot(slot);
    },
    [setTimeSlot]
  );

  const canConfirm =
    isVerified &&
    !isDirty &&
    (mode === 'pickup' || (mode === 'delivery' && selectedTimeSlot !== null));

  const handleConfirm = useCallback(() => {
    if (canConfirm) {
      onOpenChange(false);
    }
  }, [canConfirm, onOpenChange]);

  // Show verification failure only after explicit attempt
  const verificationFailed =
    verificationAttempted && !isVerified && postalCode.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={
          'glass-strong border-acai/20 max-h-[90vh] overflow-y-auto ' +
          'bg-surface sm:max-w-md'
        }
      >
        <DialogHeader>
          <DialogTitle
            className={
              'text-glow-acai text-center text-xl font-bold text-acai sm:text-left sm:text-2xl'
            }
          >
            Onde quer receber o seu Açaí?
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground sm:text-left">
            Introduza o seu código postal para verificar a disponibilidade.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 pt-2">
          {/* ── Postal Code Input ──────────────────────────────── */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="cep-input" className="text-muted-foreground">
              Código Postal
            </Label>
            <div className="flex gap-2">
              <Input
                id="cep-input"
                type="text"
                inputMode="numeric"
                placeholder="0000-000"
                value={postalCode}
                onChange={(e) => handlePostalCodeChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleVerify();
                }}
                className={
                  'font-mono text-base tracking-wider ' +
                  (verificationFailed
                    ? 'border-neon-pink focus-visible:border-neon-pink'
                    : isVerified && !isDirty
                      ? 'border-neon-mint focus-visible:border-neon-mint'
                      : '')
                }
                maxLength={8}
              />
              <Button
                type="button"
                onClick={handleVerify}
                variant="outline"
                className="shrink-0 border-acai/40 text-acai hover:bg-acai/10 hover:text-acai"
              >
                Verificar
              </Button>
            </div>

            {/* Verification feedback */}
            {isVerified && !isDirty && (
              <p className="flex items-center gap-1.5 text-xs text-neon-mint">
                <span className="inline-block size-1.5 rounded-full bg-neon-mint" />
                Código postal verificado — entregas disponíveis
              </p>
            )}
            {verificationFailed && (
              <p className="flex items-center gap-1.5 text-xs text-neon-pink">
                <span className="inline-block size-1.5 rounded-full bg-neon-pink" />
                Código postal inválido — mínimo 4 caracteres
              </p>
            )}
          </div>

          {/* ── Delivery / Pickup Toggle ───────────────────────── */}
          <div
            className={
              'flex items-center justify-between rounded-lg border border-border ' +
              'bg-surface-light px-4 py-3'
            }
          >
            <div className="flex items-center gap-2">
              {mode === 'delivery' ? (
                <Truck className="size-4 text-acai" />
              ) : (
                <Store className="size-4 text-neon-mint" />
              )}
              <span className="text-sm font-medium">
                {mode === 'delivery'
                  ? 'Entrega ao Domicílio'
                  : 'Levantamento na Loja'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Entrega</span>
              <Switch
                checked={mode === 'pickup'}
                onCheckedChange={handleModeToggle}
                aria-label="Alternar entre entrega e levantamento"
              />
              <span className="text-xs text-muted-foreground">Loja</span>
            </div>
          </div>

          {/* ── Time Slot Selection (delivery only) ────────────── */}
          {mode === 'delivery' && (
            <div className="flex flex-col gap-2">
              <Label className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="size-3.5" />
                Horário de Entrega
              </Label>
              <Select
                value={selectedTimeSlot?.id ?? ''}
                onValueChange={handleTimeSlotChange}
                disabled={!isVerified || isDirty}
              >
                <SelectTrigger
                  className={
                    'w-full font-mono ' +
                    (!isVerified || isDirty ? 'opacity-50' : '')
                  }
                >
                  <SelectValue
                    placeholder={
                      isVerified && !isDirty
                        ? 'Selecionar horário'
                        : 'Verifique o CEP primeiro'
                    }
                  />
                </SelectTrigger>
                <SelectContent className="border-acai/20 bg-surface-light">
                  {timeSlots.map((slot: TimeSlot) => (
                    <SelectItem
                      key={slot.id}
                      value={slot.id}
                      className="font-mono focus:bg-acai/10 focus:text-acai"
                    >
                      <span className="flex items-center gap-2">
                        {slot.label}
                        {slot.estimated_minutes && (
                          <span className="text-xs text-neon-mint">
                            ≈ {slot.estimated_minutes}
                          </span>
                        )}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {isVerified && !isDirty && !selectedTimeSlot && (
                <p className="text-xs text-muted-foreground">
                  Selecione um horário de entrega para continuar.
                </p>
              )}
            </div>
          )}

          {/* ── Confirm Button ─────────────────────────────────── */}
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={
              'w-full py-3 text-base font-semibold transition-all ' +
              (canConfirm
                ? 'bg-acai text-primary-foreground shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:bg-acai/90'
                : 'bg-surface-light text-muted-foreground')
            }
          >
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
