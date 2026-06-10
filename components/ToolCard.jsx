export default function ToolCard({ name, description, link }) {
  return (
    <a href={link} style={{ textDecoration: 'none' }}>
      <div className="card tool-card">
        <div className="tool-name">{name}</div>
        <div className="tool-description">{description}</div>
      </div>
    </a>
  );
}
