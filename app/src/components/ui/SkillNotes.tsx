import { useState } from "react";
import type { SkillNote } from "../../data/types";
import { keyToDate } from "../../lib/date";

function formatDate(key: string) {
  return keyToDate(key).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface NoteFormValues {
  title: string;
  body: string;
}

function NoteForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial: NoteFormValues;
  submitLabel: string;
  onSubmit: (values: NoteFormValues) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial.title);
  const [body, setBody] = useState(initial.body);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    onSubmit({ title: title.trim(), body: body.trim() });
  }

  return (
    <form className="note-form" onSubmit={submit}>
      <input
        className="note-title-input"
        placeholder="What clicked? e.g. Generics"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />
      <textarea
        className="note-body-input"
        placeholder={"In your own words. Code is fine — indent a line with 2 spaces to format it as a block."}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={6}
      />
      <div className="note-form-actions">
        <button type="submit">{submitLabel}</button>
        <button type="button" className="note-cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

/** Renders a note body, treating runs of indented lines as code blocks so
 * pasted snippets stay readable without pulling in a markdown dependency. */
function NoteBody({ body }: { body: string }) {
  const blocks: { code: boolean; lines: string[] }[] = [];
  for (const line of body.split("\n")) {
    const isCode = /^(\s{2,}|\t)/.test(line);
    const last = blocks[blocks.length - 1];
    if (last && last.code === isCode) last.lines.push(line);
    else blocks.push({ code: isCode, lines: [line] });
  }

  return (
    <div className="note-body">
      {blocks
        // Drop the blank lines that sit either side of a code block — the
        // block's own margin already provides that separation.
        .map((b) => ({ ...b, text: b.code ? b.lines.join("\n") : b.lines.join("\n").trim() }))
        .filter((b) => b.text !== "")
        .map((b, i) =>
          b.code ? (
            <pre key={i} className="note-code">
              {b.text.replace(/^\s{2}/gm, "")}
            </pre>
          ) : (
            <p key={i}>{b.text}</p>
          )
        )}
    </div>
  );
}

interface Props {
  skillName: string;
  notes: SkillNote[];
  onAddNote: (skillName: string, title: string, body: string) => void;
  onUpdateNote: (skillName: string, noteId: string, title: string, body: string) => void;
  onRemoveNote: (skillName: string, noteId: string) => void;
}

export function SkillNotes({ skillName, notes, onAddNote, onUpdateNote, onRemoveNote }: Props) {
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  return (
    <div className="skill-notes">
      <div className="notes-header">
        <button
          className="notes-toggle"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          <span className="notes-caret">{open ? "▼" : "▶"}</span>
          My notes ({notes.length})
        </button>
        {open && !adding && (
          <button
            className="notes-add"
            onClick={() => {
              setAdding(true);
              setEditingId(null);
            }}
          >
            + Add note
          </button>
        )}
      </div>

      {open && (
        <div className="notes-list">
          {adding && (
            <NoteForm
              initial={{ title: "", body: "" }}
              submitLabel="Save note"
              onCancel={() => setAdding(false)}
              onSubmit={({ title, body }) => {
                onAddNote(skillName, title, body);
                setAdding(false);
              }}
            />
          )}

          {notes.length === 0 && !adding && (
            <p className="notes-empty">
              Nothing yet. When something finally clicks, write your version of it here — future
              you reads this instead of the docs.
            </p>
          )}

          {notes.map((n) =>
            editingId === n.id ? (
              <NoteForm
                key={n.id}
                initial={{ title: n.title, body: n.body }}
                submitLabel="Save changes"
                onCancel={() => setEditingId(null)}
                onSubmit={({ title, body }) => {
                  onUpdateNote(skillName, n.id, title, body);
                  setEditingId(null);
                }}
              />
            ) : (
              <article className="note" key={n.id}>
                <div className="note-head">
                  <h4 className="note-title">{n.title}</h4>
                  <span className="note-date">
                    {formatDate(n.created)}
                    {n.updated !== n.created && " · edited"}
                  </span>
                </div>
                <NoteBody body={n.body} />
                <div className="note-actions">
                  <button onClick={() => setEditingId(n.id)}>Edit</button>
                  {confirmingId === n.id ? (
                    <>
                      {/* Two-step delete — these are hand-written notes, so a
                          stray click shouldn't be able to destroy one. */}
                      <button
                        className="note-confirm-delete"
                        onClick={() => {
                          onRemoveNote(skillName, n.id);
                          setConfirmingId(null);
                        }}
                      >
                        Really delete
                      </button>
                      <button onClick={() => setConfirmingId(null)}>Keep</button>
                    </>
                  ) : (
                    <button onClick={() => setConfirmingId(n.id)}>Delete</button>
                  )}
                </div>
              </article>
            )
          )}
        </div>
      )}
    </div>
  );
}
