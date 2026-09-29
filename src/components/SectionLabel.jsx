import './SectionLabel.css';

/** Editorial kicker: "01 / LOCAL SKILLS" */
export default function SectionLabel({ index, children, className = '' }) {
  return (
    <p className={`section-label${className ? ' ' + className : ''}`}>
      {index && <span className="section-label-index">{index}</span>}
      {index && <span className="section-label-sep" aria-hidden="true">/</span>}
      <span>{children}</span>
    </p>
  );
}
