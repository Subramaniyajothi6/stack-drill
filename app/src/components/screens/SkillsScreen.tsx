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
  onAddNote: (skillName: string, title: string, body: string) => void;
  onUpdateNote: (skillName: string, noteId: string, title: string, body: string) => void;
  onRemoveNote: (skillName: string, noteId: string) => void;
}

export function SkillsScreen({
  skills,
  onAddLink,
  onUpdateLink,
  onRemoveLink,
  onAddNote,
  onUpdateNote,
  onRemoveNote,
}: Props) {
  const noteCount = skills.reduce((n, s) => n + (s.notes?.length ?? 0), 0);

  return (
    <div className="skills-page">
      <div className="section-title-row">
        <h3 className="section-title" style={{ border: 0, padding: 0, margin: 0 }}>
          What you know, what's next, and exactly where to learn it
        </h3>
        <span className="section-meta">
          {noteCount > 0
            ? `${noteCount} note${noteCount === 1 ? "" : "s"} written · your words beat the docs on a reread`
            : "Docs · course · watch — and write your own notes as things click"}
        </span>
      </div>
      <div className="skills-grid">
        {skills.map((s) => (
          <SkillCard
            key={s.name}
            skill={s}
            onAddLink={onAddLink}
            onUpdateLink={onUpdateLink}
            onRemoveLink={onRemoveLink}
            onAddNote={onAddNote}
            onUpdateNote={onUpdateNote}
            onRemoveNote={onRemoveNote}
          />
        ))}
      </div>
    </div>
  );
}
