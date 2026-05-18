// ============================================================
// Location Store — Geofencing & Delivery State
// ============================================================

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DeliveryMode, TimeSlot, LocationState } from "@/types";

interface LocationActions {
  setPostalCode: (code: string) => void;
  setMode: (mode: DeliveryMode) => void;
  setTimeSlot: (slot: TimeSlot | null) => void;
  verify: () => void;
  reset: () => void;
}

type LocationStore = LocationState & LocationActions;

const initialState: LocationState = {
  isVerified: false,
  postalCode: "",
  mode: "delivery",
  selectedTimeSlot: null,
};

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      ...initialState,

      setPostalCode: (code) => set({ postalCode: code }),

      setMode: (mode) => set({ mode, selectedTimeSlot: null }),

      setTimeSlot: (slot) => set({ selectedTimeSlot: slot }),

      verify: () => {
        // Simulated verification — any 4+ char postal code accepted
        set((s) => ({
          isVerified: s.postalCode.length >= 4,
        }));
      },

      reset: () => set(initialState),
    }),
    {
      name: "acai-location",
    }
  )
);
