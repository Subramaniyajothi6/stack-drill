import { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { TodayScreen } from "./components/screens/TodayScreen";
import { StreaksScreen } from "./components/screens/StreaksScreen";
import { RoadmapScreen } from "./components/screens/RoadmapScreen";
import { SkillsScreen } from "./components/screens/SkillsScreen";
import { useAppState } from "./state/useAppState";
import { useDerived } from "./state/derived";
import { SCREEN_ORDER } from "./data/seed";
import type { Screen } from "./data/types";

export default function App() {
  const [screen, setScreen] = useState<Screen>("today");
  const {
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
    addCustomQuest,
    updateCustomQuest,
    removeCustomQuest,
    toggleLinkDone,
    upsertWeakSpot,
    removeWeakSpot,
  } = useAppState();
  const d = useDerived(data, screen);

  useEffect(() => {
    if (d.fullModeUnlocked && !data.fullModeUnlocked) {
      unlockFullMode();
    }
  }, [d.fullModeUnlocked, data.fullModeUnlocked, unlockFullMode]);

  return (
    <div className="app-shell">
      <Sidebar
        screen={screen}
        screenOrder={SCREEN_ORDER}
        onNavigate={setScreen}
        level={d.level}
        levelTitle={d.levelTitle}
        xpDisplay={d.xpDisplay}
        levelPct={d.levelPct}
        xpToNext={d.xpToNext}
        nextLevel={d.nextLevel}
      />

      <main className="main">
        <Header
          kicker={d.kicker}
          title={d.title}
          streak={d.streak}
          doneCount={d.doneCount}
          questCount={d.questCount}
          freezes={d.freezes}
        />

        {screen === "today" && (
          <TodayScreen
            quests={d.quests}
            onToggleQuest={toggleQuest}
            plannedHours={d.plannedHours}
            loggedHours={d.loggedHours}
            coachLine={d.coachLine}
            currentPhase={d.currentPhase}
            questMode={d.questMode}
            fullModeUnlocked={d.fullModeUnlocked}
            onSetQuestMode={setQuestMode}
            onAddQuest={addCustomQuest}
            onUpdateQuest={updateCustomQuest}
            onRemoveQuest={removeCustomQuest}
            weakSpots={data.weakSpots}
            onUpsertWeakSpot={upsertWeakSpot}
            onRemoveWeakSpot={removeWeakSpot}
          />
        )}

        {screen === "streaks" && (
          <StreaksScreen heat={d.heat} streak={d.streak} longest={d.longest} badges={d.badges} />
        )}

        {screen === "roadmap" && (
          <RoadmapScreen
            cleared={data.cleared}
            clearedCount={d.clearedCount}
            hoursTotal={d.hoursTotal}
            onTogglePhase={togglePhase}
          />
        )}

        {screen === "skills" && (
          <SkillsScreen
            skills={data.skills}
            onAddLink={addSkillLink}
            onUpdateLink={updateSkillLink}
            onRemoveLink={removeSkillLink}
            onAddNote={addSkillNote}
            onUpdateNote={updateSkillNote}
            onRemoveNote={removeSkillNote}
            onToggleLinkDone={toggleLinkDone}
          />
        )}
      </main>
    </div>
  );
}
