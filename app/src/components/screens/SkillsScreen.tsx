import type { Skill } from "../../data/types";
import { SkillCard } from "../ui/SkillCard";

interface LinkFormValues {
  kind: string;
  label: string;
  url: string;
}

interface Props {
  skills: Skill[];
  onAddLink: (skillName: string, link: LinkFormValues) => void;
  onUpdateLink: (skillName: string, linkId: string, link: LinkFormValues) => void;
  onRemoveLink: (skillName: string, linkId: string) => void;
}

export function SkillsScreen({ skills, onAddLink, onUpdateLink, onRemoveLink }: Props) {
  return (
    <div className="skills-page">
      <div className="section-title-row">
        <h3 className="section-title" style={{ border: 0, padding: 0, margin: 0 }}>
          What you know, what's next, and exactly where to learn it
        </h3>
        <span className="section-meta">Docs · course · watch — add your own, no rabbit holes</span>
      </div>
      <div className="skills-grid">
        {skills.map((s) => (
          <SkillCard key={s.name} skill={s} onAddLink={onAddLink} onUpdateLink={onUpdateLink} onRemoveLink={onRemoveLink} />
        ))}
      </div>
    </div>
  );
}
