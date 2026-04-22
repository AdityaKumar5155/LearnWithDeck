import cx from "../lib/cx";
import CardShell from "./ui/CardShell";
import Button from "./ui/Button";
import Input from "./ui/Input";

const CollectionsPanel = ({
  collections,
  collectionsLoading,
  collectionFilter,
  setCollectionFilter,
  selectedCollection,
  onSearch,
  onSelectCollection,
  onDeleteCollection,
}) => {
  return (
    <CardShell title="Collections" subtitle="Search, create, delete — keep it tidy.">
      <div className="mb-3 flex gap-2">
        <Input
          placeholder="Search by name…"
          value={collectionFilter}
          onChange={(e) => setCollectionFilter(e.target.value)}
        />
        <Button variant="ghost" onClick={onSearch} disabled={collectionsLoading} type="button">
          {collectionsLoading ? "…" : "Go"}
        </Button>
      </div>

      <div className="max-h-[320px] space-y-2 overflow-auto pr-1">
        {collections.length === 0 ? (
          <div className="text-sm text-white/60">No collections yet.</div>
        ) : (
          collections.map((c) => (
            <div
              key={c.id}
              className={cx(
                "rounded-xl border border-white/10 p-3",
                String(selectedCollection?.id) === String(c.id) ? "bg-white/10" : "bg-white/5"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <button type="button" className="text-left" onClick={() => onSelectCollection(c)}>
                  <div className="font-medium text-white">{c.name}</div>
                  <div className="mt-1 text-xs text-white/70">
                    decks: {c.deck_count ?? 0} • reviews: {c.total_reviews ?? 0}
                  </div>
                </button>

                <Button
                  variant="danger"
                  className="px-2 py-1 text-xs"
                  type="button"
                  onClick={() => onDeleteCollection(c.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </CardShell>
  );
};

export default CollectionsPanel;
