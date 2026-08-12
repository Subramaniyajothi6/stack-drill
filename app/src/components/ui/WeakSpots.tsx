import { useState } from "react";
import type { WeakSpot } from "../../data/types";

let weakIdSeq = 1;
function nextWeakId() {
  return `weak-${Date.now()}-${weakIdSeq++}`;
}

function SpotForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: WeakSpot;
  submitLabel: string;
  onSubmit: (spot: WeakSpot) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [pct, setPct] = useState(String(initial?.pct ?? 50));
  const [note, setNote] = useState(initial?.note ?? "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const parsed = Number.parseInt(pct, 10);
    onSubmit({
      id: initial?.id ?? nextWeakId(),
      name: name.trim(),
      pct: Number.isFinite(parsed) ? Math.min(100, Math.max(0, parsed)) : 0,
      note: note.trim(),
    });
  }

  return (
    <form className="weak-form" onSubmit={submit}>
      <input
        placeholder="Topic — e.g. SQL joins"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />
      <input
        placeholder="Score or note — e.g. 35/100"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <div className="weak-form-row">
        <label>
          <span>%</span>
          <input type="number" min={0} max={100} value={pct} onChange={(e) => setPct(e.target.value)} />
        </label>
        <div className="weak-form-actions">
          <button type="submit">{submitLabel}</button>
          <button type="button" className="weak-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}

interface Props {
  spots: WeakSpot[];
  onUpsert: (spot: WeakSpot) => void;
  onRemove: (id: string) => void;
}

export function WeakSpots({ spots, onUpsert, onRemove }: Props) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div>
      <div className="section-title-row">
        <h3 className="section-title" style={{ border: 0, padding: 0, margin: 0 }}>
          Weak spots
        </h3>
        {!adding && (
          <button className="weak-add" onClick={() => setAdding(true)}>
            + Add
          </button>
        )}
      </div>

      <div className="weak-spots">
        {adding && (
          <SpotForm
            submitLabel="Add"
            onCancel={() => setAdding(false)}
            onSubmit={(spot) => {
              onUpsert(spot);
              setAdding(false);
            }}
          />
        )}

        {spots.length === 0 && !adding && (
          <p className="weak-empty">
            Nothing tracked yet. Add the topics you keep getting wrong — a real score beats a vague
            feeling.
          </p>
        )}

        {spots.map((w) =>
          editingId === w.id ? (
            <SpotForm
              key={w.id}
              initial={w}
              submitLabel="Save"
              onCancel={() => setEditingId(null)}
              onSubmit={(spot) => {
                onUpsert(spot);
                setEditingId(null);
              }}
            />
          ) : (
            <div key={w.id} className="weak-spot">
              <div className="weak-spot-row">
                <span className="weak-spot-name">{w.name}</span>
                <span className="weak-spot-note">{w.note}</span>
              </div>
              <div className="weak-bar-track">
                <div className="weak-bar-fill" style={{ width: `${w.pct}%` }} />
              </div>
              <div className="weak-spot-actions">
                <button onClick={() => setEditingId(w.id)}>Edit</button>
                <button onClick={() => onRemove(w.id)}>Remove</button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
