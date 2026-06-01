"use client";

/* Shared visual pieces for the DonutNV Instagram graphics, matching the
   Canva designs: vertical blue stripes, scalloped awning top & bottom, and
   optional decorative photos that auto-hide until the PNG files are added. */

export function StripedBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "repeating-linear-gradient(90deg, #1e63b8 0 70px, #0b3f86 70px 140px)",
      }}
    />
  );
}

export function AwningTop({ height = 70 }: { height?: number }) {
  return (
    <div className="relative flex w-full" style={{ height }}>
      {Array.from({ length: 13 }).map((_, i) => (
        <div
          key={i}
          className="h-full flex-1"
          style={{
            backgroundColor: i % 2 === 0 ? "#e11b22" : "#8f1418",
            borderBottomLeftRadius: "50% 85%",
            borderBottomRightRadius: "50% 85%",
          }}
        />
      ))}
    </div>
  );
}

export function AwningBottom({ height = 70 }: { height?: number }) {
  return (
    <div className="relative flex w-full" style={{ height }}>
      {Array.from({ length: 13 }).map((_, i) => (
        <div
          key={i}
          className="h-full flex-1"
          style={{
            backgroundColor: i % 2 === 0 ? "#e11b22" : "#8f1418",
            borderTopLeftRadius: "50% 85%",
            borderTopRightRadius: "50% 85%",
          }}
        />
      ))}
    </div>
  );
}

/* A decorative photo that simply disappears if the file isn't present yet,
   so the layout looks clean before the brand PNGs are uploaded. */
export function Deco({
  src,
  alt,
  className,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.display = "none";
      }}
    />
  );
}
