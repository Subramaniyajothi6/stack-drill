import { useCallback, useEffect, useState } from "react";
import { load, save, type StoredData } from "../lib/storage";
import { todayKey } from "../lib/date";
import type { QuestMode, SkillLink } from "../data/types";

let linkIdSeq = 1;
function nextLinkId() {
  return `link-${Date.now()}-${linkIdSeq++}`;
}

let noteIdSeq = 1;
function nextNoteId() {
  return `note-${Date.now()}-${noteIdSeq++}`;
}

/** Owns the persisted data and every mutation to it. Nothing outside this
 * hook and lib/storage.ts touches localStorage directly. */
export function useAppState() {
  const [data, setData] = useState<StoredData>(load);

  useEffect(() => {
    save(data);
  }, [data]);

  const toggleQuest = useCallback((id: string) => {
    const key = todayKey();
    setData((d) => {
      const dayList = d.history[key] ?? [];
      const nextList = dayList.includes(id) ? dayList.filter((x) => x !== id) : [...dayList, id];
      return { ...d, history: { ...d.history, [key]: nextList } };
    });
  }, []);

  const togglePhase = useCallback((n: string) => {
    setData((d) => ({ ...d, cleared: { ...d.cleared, [n]: !d.cleared[n] } }));
  }, []);

  const setQuestMode = useCallback((mode: QuestMode) => {
    setData((d) => ({ ...d, questMode: mode }));
  }, []);

  const unlockFullMode = useCallback(() => {
    setData((d) => (d.fullModeUnlocked ? d : { ...d, fullModeUnlocked: true }));
  }, []);

  const addSkillLink = useCallback((skillName: string, link: Omit<SkillLink, "id">) => {
    setData((d) => ({
      ...d,
      skills: d.skills.map((sk) =>
        sk.name === skillName ? { ...sk, links: [...sk.links, { ...link, id: nextLinkId() }] } : sk
      ),
    }));
  }, []);

  const updateSkillLink = useCallback((skillName: string, linkId: string, patch: Omit<SkillLink, "id">) => {
    setData((d) => ({
      ...d,
      skills: d.skills.map((sk) =>
        sk.name === skillName
          ? { ...sk, links: sk.links.map((l) => (l.id === linkId ? { ...l, ...patch } : l)) }
          : sk
      ),
    }));
  }, []);

  const removeSkillLink = useCallback((skillName: string, linkId: string) => {
    setData((d) => ({
      ...d,
      skills: d.skills.map((sk) =>
        sk.name === skillName ? { ...sk, links: sk.links.filter((l) => l.id !== linkId) } : sk
      ),
    }));
  }, []);

  const addSkillNote = useCallback((skillName: string, title: string, body: string) => {
    const today = todayKey();
    setData((d) => ({
      ...d,
      skills: d.skills.map((sk) =>
        sk.name === skillName
          ? {
              ...sk,
              // Newest first — the thing you just learned is what you reread.
              notes: [
                { id: nextNoteId(), title, body, created: today, updated: today },
                ...(sk.notes ?? []),
              ],
            }
          : sk
      ),
    }));
  }, []);

  const updateSkillNote = useCallback(
    (skillName: string, noteId: string, title: string, body: string) => {
      const today = todayKey();
      setData((d) => ({
        ...d,
        skills: d.skills.map((sk) =>
          sk.name === skillName
            ? {
                ...sk,
                notes: (sk.notes ?? []).map((n) =>
                  n.id === noteId ? { ...n, title, body, updated: today } : n
                ),
              }
            : sk
        ),
      }));
    },
    []
  );

  const removeSkillNote = useCallback((skillName: string, noteId: string) => {
    setData((d) => ({
      ...d,
      skills: d.skills.map((sk) =>
        sk.name === skillName ? { ...sk, notes: (sk.notes ?? []).filter((n) => n.id !== noteId) } : sk
      ),
    }));
  }, []);

  return {
    data,
    toggleQuest,
    togglePhase,
    setQuestMode,
    unlockFullMode,
    addSkillLink,
    updateSkillLink,
    removeSkillLink,
    addSkillNote,
    updateSkillNote,
    removeSkillNote,
  };
}
