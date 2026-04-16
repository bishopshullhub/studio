import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Bishops Hull Hub — Community Hub & Village Hall';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: '64px',
          background: 'linear-gradient(135deg, #1a7a6e 0%, #0d5c52 40%, #082e2a 100%)',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-120px',
            left: '400px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(74,222,128,0.08)',
          }}
        />

        {/* Charity tag */}
        <div
          style={{
            position: 'absolute',
            top: '56px',
            right: '64px',
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '9999px',
            padding: '8px 20px',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '18px',
          }}
        >
          Registered Charity · England &amp; Wales
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '800px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(74,222,128,0.2)',
              borderRadius: '9999px',
              padding: '8px 20px',
              width: 'fit-content',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#4ade80',
              }}
            />
            <span style={{ color: '#4ade80', fontSize: '18px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Bishops Hull · Taunton
            </span>
          </div>

          <h1
            style={{
              fontSize: '72px',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.1,
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            Bishops Hull Hub
          </h1>

          <p
            style={{
              fontSize: '28px',
              color: 'rgba(255,255,255,0.75)',
              margin: 0,
              fontWeight: 400,
            }}
          >
            The heart of our village community.
          </p>

          {/* Tags row */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
            {['Hire the Hub', "What's On", 'Community Events', 'Youth Hub'].map((tag) => (
              <div
                key={tag}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '9999px',
                  padding: '8px 18px',
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '18px',
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '64px',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '18px',
          }}
        >
          bhhub.co.uk
        </div>
      </div>
    ),
    { ...size }
  );
}
