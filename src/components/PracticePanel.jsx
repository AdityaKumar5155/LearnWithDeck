import Button from "./ui/Button";
import CardShell from "./ui/CardShell";
import LatexText from "./LatexText";

const SCORE_LABELS = [
  { score: 0, label: "Blackout" },
  { score: 1, label: "Incorrect" },
  { score: 2, label: "Hard" },
  { score: 3, label: "Good" },
  { score: 4, label: "Easy" },
  { score: 5, label: "Perfect Recall" },
];

const PracticePanel = ({
  selectedDeck,
  practiceLoading,
  activeCard,
  revealedAnswer,
  scoring,
  onReveal,
  onScore,
  onRefresh,
}) => {
  return (
    <CardShell
      title="Practice"
      subtitle={
        selectedDeck ? `Deck: “${selectedDeck.name}” — answer, reveal, score.` : "Pick a deck to start."
      }
    >
      {!selectedDeck ? (
        <div className="text-sm text-white/70">Waiting for a deck…</div>
      ) : practiceLoading ? (
        <div className="text-sm text-white/70">Fetching best next cards…</div>
      ) : !activeCard ? (
        <div className="flex flex-col gap-3">
          <div className="text-sm text-white/70">No due cards right now.</div>
          <Button variant="ghost" type="button" onClick={onRefresh}>
            Refresh
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-base font-medium text-white">{activeCard.content}</div>
            {revealedAnswer !== null ? (
              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs font-medium text-white/60">Answer</div>
                <LatexText
                  className="mt-2 text-sm text-white/90 whitespace-pre-wrap"
                  text={revealedAnswer || "(empty)"}
                />
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" onClick={onReveal} type="button">
              Reveal answer
            </Button>
            <div className="h-6 w-px bg-white/10" />
            <div className="text-sm text-white/70">Score recall:</div>
            {SCORE_LABELS.map(({ score: s, label }) => (
              <Button
                key={s}
                type="button"
                variant={s >= 4 ? "primary" : "ghost"}
                disabled={scoring}
                onClick={() => onScore(s)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </CardShell>
  );
};

export default PracticePanel;
