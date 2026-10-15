import { ImageResponse } from "next/og";

export const alt = "Ricardo Vital — Full-Stack Web Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0a0a0a",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        {/* Acento */}
        <div style={{ display: "flex", width: 72, height: 6, backgroundColor: "#ff6b35" }} />

        <div style={{ display: "flex", fontSize: 96, fontWeight: 700, letterSpacing: "-0.03em", marginTop: 40 }}>
          Ricardo Vital
        </div>

        <div style={{ display: "flex", fontSize: 34, color: "#ff6b35", marginTop: 24, letterSpacing: "0.25em", textTransform: "uppercase" }}>
          Full-Stack Web Developer
        </div>

        <div style={{ display: "flex", fontSize: 26, color: "#a3a3a3", marginTop: 56 }}>
          Complete web applications — APIs, databases, security, testing, deployment.
        </div>

        <div style={{ display: "flex", fontSize: 22, color: "#6b6b6b", marginTop: 16, letterSpacing: "0.15em", textTransform: "uppercase" }}>
          Irapuato, GTO · MX — Remote / On-site
        </div>
      </div>
    ),
    { ...size }
  );
}
