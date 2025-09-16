import React from "react";

interface CargoTrustLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const CargoTrustLogo: React.FC<CargoTrustLogoProps> = ({
  size = "md",
  showText = true,
}) => {
  const getSize = () => {
    switch (size) {
      case "sm":
        return { width: 32, height: 32, fontSize: "12px" };
      case "lg":
        return { width: 80, height: 80, fontSize: "24px" };
      default:
        return { width: 48, height: 48, fontSize: "16px" };
    }
  };

  const { width, height, fontSize } = getSize();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Logo Image */}
      <img
        src="/images/delivery-truck.png"
        alt="Cargo Trust Logo"
        width={width}
        height={height}
        style={{
          flexShrink: 0,
          objectFit: "contain",
        }}
      />

      {/* Texto do logo */}
      {showText && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            lineHeight: "1.1",
          }}
        >
          <div
            style={{
              fontSize: fontSize,
              fontWeight: "bold",
              color: "#3B82F6",
              letterSpacing: "0.5px",
            }}
          >
            CARGO
          </div>
          <div
            style={{
              fontSize: fontSize,
              fontWeight: "bold",
              color: "#3B82F6",
              letterSpacing: "0.5px",
              transform: "skewX(-5deg)",
            }}
          >
            TRUST
          </div>
        </div>
      )}
    </div>
  );
};

export default CargoTrustLogo;
