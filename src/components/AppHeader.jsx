import Button from "./ui/Button";

const AppHeader = ({ tokenPresent, onLogout }) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="text-2xl font-semibold tracking-tight">Learn With Deck</div>
        <div className="mt-1 text-sm text-white/70">
          Turn any text into practice-ready flashcards — then let spacing do the magic.
        </div>
      </div>

      <div className="flex items-center gap-2">
        {tokenPresent ? (
          <Button variant="ghost" onClick={onLogout} type="button">
            Logout
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default AppHeader;
