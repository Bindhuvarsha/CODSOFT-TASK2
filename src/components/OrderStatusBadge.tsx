import React from 'react';
import { OrderStatus } from '@/lib/types';
import { getStatusBadge } from '@/lib/utils';

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const badge = getStatusBadge(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${badge.bg}`}
    >
      <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
      <span>{badge.label}</span>
    </span>
  );
}
