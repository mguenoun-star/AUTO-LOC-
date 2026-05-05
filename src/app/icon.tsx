import { ImageResponse } from 'next/og';
import { CarFront } from 'lucide-react';

export const runtime = 'edge';
export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
          borderRadius: '16px',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.64 5H8.4a2 2 0 0 0-1.9 1.3L5 10 3 8" />
          <path d="M7 14h.01" />
          <path d="M17 14h.01" />
          <rect width="18" height="8" x="3" y="10" rx="2" />
          <path d="M5 18v2" />
          <path d="M19 18v2" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
