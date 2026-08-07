import { useCallback, useEffect, useState } from "react";
import { load, save, type StoredData } from "../lib/storage";
import { todayKey } from "../lib/date";
import type { QuestMode, SkillLink } from "../data/types";

let linkIdSeq = 1;
function nextLinkId() {
  return `link-${Date.now()}-${linkIdSeq++}`;
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

  return {
    data,
    toggleQuest,
    togglePhase,
    setQuestMode,
    unlockFullMode,
    addSkillLink,
    updateSkillLink,
    removeSkillLink,
  };
}
