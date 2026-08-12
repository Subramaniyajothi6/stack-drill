import { useState } from "react";
import type { QuestVM } from "../../state/derived";
import { BLOCKS, FALLBACKS } from "../../data/seed";
import type { Phase, QuestMode, WeakSpot } from "../../data/types";
import { QuestForm, type QuestDraft } from "../ui/QuestForm";
import { WeakSpots } from "../ui/WeakSpots";

interface Props {
  quests: QuestVM[];
  onToggleQuest: (id: string) => void;
  plannedHours: number;
  loggedHours: string;
  coachLine: string;
  currentPhase: Phase;
  questMode: QuestMode;
  fullModeUnlocked: boolean;
  onSetQuestMode: (mode: QuestMode) => void;
  onAddQuest: (draft: QuestDraft) => void;
  onUpdateQuest: (questId: string, draft: QuestDraft) => void;
  onRemoveQuest: (questId: string) => void;
  weakSpots: WeakSpot[];
  onUpsertWeakSpot: (spot: WeakSpot) => void;
  onRemoveWeakSpot: (id: string) => void;
}

export function TodayScreen({
  quests,
  onToggleQuest,
  plannedHours,
  loggedHours,
  coachLine,
  currentPhase,
  questMode,
  fullModeUnlocked,
  onSetQuestMode,
  onAddQuest,
  onUpdateQuest,
  onRemoveQuest,
  weakSpots,
  onUpsertWeakSpot,
  onRemoveWeakSpot,
}: Props) {
  const [addingQuest, setAddingQuest] = useState(false);
  const [editingQuestId, setEditingQuestId] = useState<string | null>(null);
  const [confirmingQuestId, setConfirmingQuestId] = useState<string | null>(null);

  return (
    <div className="today-grid">
      <section className="today-left">
        {questMode === "onehour" && fullModeUnlocked && (
          <div className="mode-banner">
            <span>7-day streak reached — the full daily block plan is unlocked.</span>
            <button className="btn btn-secondary" onClick={() => onSetQuestMode("full")}>
              Switch to full plan
            </button>
          </div>
        )}
        {questMode === "full" && (
          <div className="mode-banner">
            <span>Full daily plan is active.</span>
            <button className="btn btn-secondary" onClick={() => onSetQuestMode("onehour")}>
              Back to one hour a day
            </button>
          </div>
        )}

        <div className="section-title-row">
          <h3 className="section-title" style={{ border: 0, padding: 0, margin: 0 }}>
            Daily quest list
          </h3>
          <span className="section-meta">
            {plannedHours}h planned · {loggedHours}h logged
          </span>
        </div>

        <div className="quest-list">
          {quests.map((q) =>
            editingQuestId === q.id ? (
              <QuestForm
                key={q.id}
                initial={{ title: q.title, detail: q.detail, slot: q.slot, short: q.short, xp: q.xp }}
                submitLabel="Save"
                onCancel={() => setEditingQuestId(null)}
                onSubmit={(draft) => {
                  onUpdateQuest(q.id, draft);
                  setEditingQuestId(null);
                }}
              />
            ) : (
              <div className="quest-row-wrap" key={q.id}>
                <button className="quest-row" onClick={() => onToggleQuest(q.id)}>
                  <span className={"quest-check" + (q.on ? " done" : " pending")}>
                    {q.on ? "✓" : ""}
                  </span>
                  <span className="quest-body">
                    <span className={"quest-title" + (q.on ? " done" : "")}>{q.title}</span>
                    {q.detail && <span className="quest-detail">{q.detail}</span>}
                  </span>
                  <span className="quest-meta">
                    {q.slot && <span className="tag tag-outline">{q.slot}</span>}
                    <span className="quest-xp">+{q.xp} XP</span>
                  </span>
                </button>
                {q.custom && (
                  <div className="quest-own-actions">
                    <span className="quest-own-badge">yours</span>
                    <button onClick={() => setEditingQuestId(q.id)}>Edit</button>
                    {confirmingQuestId === q.id ? (
                      <>
                        <button
                          className="quest-confirm-remove"
                          onClick={() => {
                            onRemoveQuest(q.id);
                            setConfirmingQuestId(null);
                          }}
                        >
                          Really remove
                        </button>
                        <button onClick={() => setConfirmingQuestId(null)}>Keep</button>
                      </>
                    ) : (
                      <button onClick={() => setConfirmingQuestId(q.id)}>Remove</button>
                    )}
                  </div>
                )}
              </div>
            )
          )}
        </div>

        {addingQuest ? (
          <QuestForm
            submitLabel="Add quest"
            onCancel={() => setAddingQuest(false)}
            onSubmit={(draft) => {
              onAddQuest(draft);
              setAddingQuest(false);
            }}
          />
        ) : (
          <button className="add-quest-toggle" onClick={() => setAddingQuest(true)}>
            + Add your own quest
          </button>
        )}

        <div className="coach-box">
          <div className="kicker">Coach</div>
          <p>{coachLine}</p>
        </div>

        <h3 className="section-title" style={{ marginTop: 32 }}>
          Missed the target? Pick a smaller win
        </h3>
        <div className="fallback-grid">
          {FALLBACKS.map((f) => (
            <div className="fallback-card" key={f.title}>
              <div className="title">{f.title}</div>
              <div className="body">{f.body}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="today-right">
        <div className="phase-card">
          <h3 className="section-title" style={{ marginBottom: 8 }}>
            This week: {currentPhase.weeks}
          </h3>
          <div className="weeks-title">{currentPhase.title}</div>
          <p className="why">{currentPhase.why}</p>
          <div className="boss-box">
            <div className="boss-kicker">Boss fight</div>
            <div className="boss-title">{currentPhase.boss}</div>
          </div>
        </div>

        <WeakSpots spots={weakSpots} onUpsert={onUpsertWeakSpot} onRemove={onRemoveWeakSpot} />

        {questMode === "full" && (
          <div>
            <h3 className="section-title" style={{ marginBottom: 8 }}>
              Today's block plan · {plannedHours}h
            </h3>
            <div className="block-list">
              {BLOCKS.map((b) => (
                <div className="block-row" key={b.time}>
                  <span className="block-time">{b.time}</span>
                  <span className="block-what">{b.what}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
