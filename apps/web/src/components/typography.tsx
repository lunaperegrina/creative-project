export function TypographyH1({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h1 className={`scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl ${className}`}>{children}</h1>;
}

export function TypographyH2({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <h2 className={`scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 ${className}`}>{children}</h2>
  );
}

export function TypographyH3({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h3 className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className}`}>{children}</h3>;
}

export function TypographyH4({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h4 className={`"scroll-m-20 text-xl font-semibold tracking-tight" ${className}`}>{children}</h4>;
}

export function TypographyP({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={`leading-7 ${className}`}>{children}</p>;
}

export function TypographyLead({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={`text-xl text-muted-foreground ${className}`}>{children}</p>;
}
