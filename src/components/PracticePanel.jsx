import Button from "./ui/Button";
import CardShell from "./ui/CardShell";
import LatexText from "./LatexText";

const PracticePanel = ({
  selectedDeck,
  practiceLoading,
  cards,
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
            <div className="mb-2 text-xs text-white/60">
              card {cards.findIndex((c) => String(c.id) === String(activeCard.id)) + 1} of {cards.length}
            </div>
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
            {[0, 1, 2, 3, 4, 5].map((s) => (
              <Button
                key={s}
                type="button"
                variant={s >= 4 ? "primary" : "ghost"}
                disabled={scoring}
                onClick={() => onScore(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>
      )}
    </CardShell>
  );
};

export default PracticePanel;
