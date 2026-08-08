import { useState } from "react";

export interface QuestDraft {
  title: string;
  detail: string;
  slot: string;
  short: string;
  xp: number;
}

const DEFAULT_XP = 50;

interface Props {
  initial?: QuestDraft;
  submitLabel: string;
  onSubmit: (draft: QuestDraft) => void;
  onCancel: () => void;
}

export function QuestForm({ initial, submitLabel, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [detail, setDetail] = useState(initial?.detail ?? "");
  const [slot, setSlot] = useState(initial?.slot ?? "");
  const [short, setShort] = useState(initial?.short ?? "");
  const [xp, setXp] = useState(String(initial?.xp ?? DEFAULT_XP));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const parsedXp = Number.parseInt(xp, 10);
    onSubmit({
      title: title.trim(),
      detail: detail.trim(),
      slot: slot.trim(),
      short: short.trim(),
      xp: Number.isFinite(parsedXp) && parsedXp > 0 ? parsedXp : DEFAULT_XP,
    });
  }

  return (
    <form className="quest-form" onSubmit={submit}>
      <input
        className="quest-form-title"
        placeholder="Quest — e.g. Read one paper"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />
      <input
        className="quest-form-detail"
        placeholder="Why it matters / what counts as done (optional)"
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
      />
      <div className="quest-form-row">
        <label>
          <span>Time</span>
          <input placeholder="07:30" value={slot} onChange={(e) => setSlot(e.target.value)} />
        </label>
        <label>
          <span>Length</span>
          <input placeholder="30m" value={short} onChange={(e) => setShort(e.target.value)} />
        </label>
        <label>
          <span>XP</span>
          <input
            type="number"
            min={1}
            max={999}
            value={xp}
            onChange={(e) => setXp(e.target.value)}
          />
        </label>
        <div className="quest-form-actions">
          <button type="submit">{submitLabel}</button>
          <button type="button" className="quest-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
