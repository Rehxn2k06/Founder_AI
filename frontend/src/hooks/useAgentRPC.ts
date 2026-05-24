import { useEffect, useCallback } from 'react';
import { useRoomContext } from '@livekit/components-react';
import type { RpcInvocationData } from 'livekit-client';
import type { VisualSlide, LeadData } from '../types';

interface Props {
  onSlide: (slide: VisualSlide) => void;
  onLeadField: (field: string, value: string) => void;
}

export function useAgentRPC({ onSlide, onLeadField }: Props) {
  const room = useRoomContext();

  // Each RPC method gets its own handler (method name comes from registration, not data)
  const makePayloadHandler = useCallback(
    (fn: (payload: Record<string, unknown>) => void) =>
      async (data: RpcInvocationData): Promise<string> => {
        try {
          const payload = data.payload ? JSON.parse(data.payload) : {};
          fn(payload);
        } catch (e) {
          console.error('RPC handler error:', e);
        }
        return 'ok';
      },
    []
  );

  useEffect(() => {
    if (!room) return;

    const handlers = {
      show_services_slide: makePayloadHandler(() => onSlide({ type: 'services' })),
      show_service_detail: makePayloadHandler((p) =>
        onSlide({ type: 'service_detail', service: (p.service as string) ?? '' })
      ),
      show_process_diagram: makePayloadHandler(() => onSlide({ type: 'process' })),
      show_pricing_slide: makePayloadHandler(() => onSlide({ type: 'pricing' })),
      show_case_study: makePayloadHandler((p) =>
        onSlide({ type: 'case_study', client: (p.client as string) ?? '' })
      ),
      update_lead_field: makePayloadHandler((p) =>
        onLeadField(p.field as string, p.value as string)
      ),
      call_ended: makePayloadHandler((p) =>
        onSlide({ type: 'call_ended', lead: p.lead as LeadData })
      ),
    };

    Object.entries(handlers).forEach(([method, handler]) => {
      room.localParticipant.registerRpcMethod(method, handler);
    });

    return () => {
      Object.keys(handlers).forEach((method) => {
        room.localParticipant.unregisterRpcMethod(method);
      });
    };
  }, [room, makePayloadHandler, onSlide, onLeadField]);
}
