interface SectionTitleProps {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
  center?: boolean;
}

export default function SectionTitle({
  children,
  subtitle,
  className = "",
  center = false,
}: SectionTitleProps) {
  return (
    <div className={`mb-12 ${center ? "text-center" : ""} ${className}`}>
      <h2 className="font-serif text-3xl sm:text-4xl text-terre">{children}</h2>
      {subtitle && (
        <p className="mt-2 text-terre-light text-lg">{subtitle}</p>
      )}
      <div
        className={`mt-4 w-12 h-0.5 bg-or ${center ? "mx-auto" : ""}`}
        style={{ borderRadius: "1px" }}
      />
    </div>
  );
}
