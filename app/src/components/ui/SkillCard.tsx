import { useState } from "react";
import type { Skill, SkillLevel, SkillLink } from "../../data/types";

function tagClassFor(level: SkillLevel) {
  if (level === "Solid") return "tag tag-neutral";
  if (level === "Weak spot") return "tag tag-accent";
  return "tag tag-outline";
}

interface LinkFormValues {
  kind: string;
  label: string;
  url: string;
}

const KIND_OPTIONS = ["Docs", "Course", "Watch", "Practice", "Book", "Guide", "Reference", "Deep dive"];

function LinkForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial: LinkFormValues;
  submitLabel: string;
  onSubmit: (values: LinkFormValues) => void;
  onCancel?: () => void;
}) {
  const [kind, setKind] = useState(initial.kind);
  const [label, setLabel] = useState(initial.label);
  const [url, setUrl] = useState(initial.url);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim() || !url.trim()) return;
    onSubmit({ kind, label: label.trim(), url: url.trim() });
  }

  return (
    <form className="add-link-form" onSubmit={submit}>
      <select value={kind} onChange={(e) => setKind(e.target.value)}>
        {KIND_OPTIONS.map((k) => (
          <option key={k}>{k}</option>
        ))}
      </select>
      <input placeholder="Label" value={label} onChange={(e) => setLabel(e.target.value)} />
      <input placeholder="https://…" value={url} onChange={(e) => setUrl(e.target.value)} />
      <span style={{ display: "flex", gap: 6 }}>
        <button type="submit">{submitLabel}</button>
        {onCancel && (
          <button type="button" className="link-cancel" onClick={onCancel}>
            Cancel
          </button>
        )}
      </span>
    </form>
  );
}

interface Props {
  skill: Skill;
  onAddLink: (skillName: string, link: LinkFormValues) => void;
  onUpdateLink: (skillName: string, linkId: string, link: LinkFormValues) => void;
  onRemoveLink: (skillName: string, linkId: string) => void;
}

export function SkillCard({ skill, onAddLink, onUpdateLink, onRemoveLink }: Props) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="skill-card">
      <div className="head">
        <span className="name">{skill.name}</span>
        <span className={tagClassFor(skill.level)}>{skill.level}</span>
      </div>
      <div className="note">{skill.note}</div>
      <div className="skill-links">
        {skill.links.map((l: SkillLink) =>
          editingId === l.id ? (
            <div key={l.id} style={{ padding: "7px 0", borderTop: "1px solid var(--color-neutral-300)" }}>
              <LinkForm
                initial={{ kind: l.kind, label: l.label, url: l.url }}
                submitLabel="Save"
                onCancel={() => setEditingId(null)}
                onSubmit={(values) => {
                  onUpdateLink(skill.name, l.id, values);
                  setEditingId(null);
                }}
              />
            </div>
          ) : (
            <div className="skill-link" key={l.id}>
              <span className="kind">{l.kind}</span>
              <a href={l.url} target="_blank" rel="noopener noreferrer">
                {l.label}
              </a>
              <span style={{ display: "flex", gap: 4 }}>
                <button className="remove-link" onClick={() => setEditingId(l.id)} title="Edit link">
                  Edit
                </button>
                <button
                  className="remove-link"
                  onClick={() => onRemoveLink(skill.name, l.id)}
                  aria-label={`Remove ${l.label}`}
                  title="Remove link"
                >
                  ✕
                </button>
              </span>
            </div>
          )
        )}
      </div>

      {adding ? (
        <LinkForm
          initial={{ kind: "Docs", label: "", url: "" }}
          submitLabel="Add"
          onCancel={() => setAdding(false)}
          onSubmit={(values) => {
            onAddLink(skill.name, values);
            setAdding(false);
          }}
        />
      ) : (
        <button className="add-link-toggle" onClick={() => setAdding(true)}>
          + Add resource link
        </button>
      )}
    </div>
  );
}
