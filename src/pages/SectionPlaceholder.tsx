interface SectionPlaceholderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionPlaceholder({ eyebrow, title, description }: SectionPlaceholderProps) {
  return (
    <section className="placeholder-page">
      <div className="eyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      <p>{description}</p>
      <span className="placeholder-status">Módulo en preparación</span>
    </section>
  );
}