import cx from "../lib/cx";
import CardShell from "./ui/CardShell";

const DecksPanel = ({ selectedCollection, decksLoading, decks, selectedDeck, onSelectDeck }) => {
  return (
    <CardShell
      title="Decks"
      subtitle={
        selectedCollection
          ? `Inside “${selectedCollection.name}” — pick a deck to practice.`
          : "Select a collection to see decks."
      }
    >
      {selectedCollection ? (
        <div className="space-y-2">
          {decksLoading ? (
            <div className="text-sm text-white/70">Loading decks…</div>
          ) : decks.length === 0 ? (
            <div className="text-sm text-white/70">No decks found.</div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {decks.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={cx(
                    "rounded-xl border border-white/10 bg-white/5 p-4 text-left hover:bg-white/10",
                    String(selectedDeck?.id) === String(d.id) ? "ring-1 ring-white/20" : ""
                  )}
                  onClick={() => onSelectDeck(d)}
                >
                  <div className="font-medium text-white">{d.name}</div>
                  <div className="mt-1 text-xs text-white/70">reviews: {d.number_of_reviews ?? 0}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-sm text-white/70">No collection selected.</div>
      )}
    </CardShell>
  );
};

export default DecksPanel;
