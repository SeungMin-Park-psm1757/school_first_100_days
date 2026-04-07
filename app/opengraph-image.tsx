import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "linear-gradient(135deg, #f7fbff 0%, #eef5ff 38%, #dceafe 100%)",
          padding: "48px",
          color: "#12233f",
          fontFamily: "sans-serif"
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRadius: 36,
            border: "1px solid rgba(255,255,255,0.92)",
            background: "rgba(255,255,255,0.88)",
            boxShadow: "0 30px 80px -42px rgba(31,71,138,0.35)",
            padding: "44px"
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                borderRadius: 999,
                background: "rgba(47,111,228,0.08)",
                padding: "12px 18px",
                color: "#2f6fe4",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase"
              }}
            >
              Contest MVP
            </div>

            <div
              style={{
                width: 96,
                height: 96,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 28,
                background: "linear-gradient(135deg, #2f6fe4, #8db8ff)",
                color: "#ffffff",
                fontSize: 40,
                fontWeight: 800
              }}
            >
              100
            </div>
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              gap: 32
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 18
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10
                }}
              >
                <div style={{ fontSize: 70, fontWeight: 900, lineHeight: 1.02 }}>
                  First 100 Days
                </div>
                <div style={{ fontSize: 30, color: "#5b6d8a", lineHeight: 1.45 }}>
                  A decision-support navigator for parents during the first 100
                  days after elementary school enrollment.
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    borderRadius: 999,
                    background: "#ffffff",
                    padding: "12px 18px",
                    color: "#5b6d8a",
                    fontSize: 22,
                    fontWeight: 700
                  }}
                >
                  Official data first
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    borderRadius: 999,
                    background: "#ffffff",
                    padding: "12px 18px",
                    color: "#5b6d8a",
                    fontSize: 22,
                    fontWeight: 700
                  }}
                >
                  Parent tips separated
                </div>
              </div>
            </div>

            <div
              style={{
                width: 320,
                display: "flex",
                flexDirection: "column",
                gap: 18,
                borderRadius: 28,
                background:
                  "linear-gradient(180deg, rgba(47,111,228,0.12), rgba(255,255,255,0.96))",
                padding: 28
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#2f6fe4"
                }}
              >
                What matters now
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  fontSize: 34,
                  fontWeight: 800,
                  lineHeight: 1.18
                }}
              >
                <div>Do now</div>
                <div>Know why</div>
                <div>Choose next</div>
              </div>
              <div
                style={{
                  fontSize: 22,
                  lineHeight: 1.45,
                  color: "#5b6d8a"
                }}
              >
                Clear weekly actions, cautions, and next decisions for families.
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
