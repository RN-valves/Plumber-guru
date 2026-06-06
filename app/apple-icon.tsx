import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #F97316 0%, #ea580c 100%)",
          borderRadius: 36,
        }}
      >
        <div
          style={{
            fontSize: 72,
            color: "white",
            fontWeight: 800,
            letterSpacing: -2,
          }}
        >
          PG
        </div>
        <div
          style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.9)",
            marginTop: 4,
            fontWeight: 600,
          }}
        >
          Plumber Guru
        </div>
      </div>
    ),
    { ...size }
  );
}
