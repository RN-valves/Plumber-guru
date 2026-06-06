import { ImageResponse } from "next/og";
import { SITE } from "@/lib/seo-defaults";

export const runtime = "edge";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "linear-gradient(135deg, #F97316 0%, #ea580c 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            PG
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 36, fontWeight: 800 }}>{SITE.name}</div>
            <div style={{ fontSize: 22, color: "#F97316", fontWeight: 600 }}>
              {SITE.tagline}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.2, maxWidth: 900 }}>
            Training · Jobs · Tools · Find Plumbers
          </div>
          <div style={{ fontSize: 26, color: "#94a3b8", maxWidth: 820 }}>
            {SITE.taglineHi} — Built for plumbers across India
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 22,
            color: "#cbd5e1",
          }}
        >
          <span>plumber-guru.com</span>
          <span>50,000+ Plumbers · 500+ Cities</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
