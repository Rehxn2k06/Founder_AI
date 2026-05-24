import { useState, useCallback } from 'react';
import type { LeadData } from '../types';

export function useLeadState() {
  const [lead, setLead] = useState<LeadData>({});

  const updateField = useCallback((field: keyof LeadData, value: string) => {
    setLead((prev: LeadData) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => setLead({}), []);

  const filledCount = Object.values(lead).filter(Boolean).length;
  const totalFields = 9;

  return { lead, updateField, reset, filledCount, totalFields };
}
