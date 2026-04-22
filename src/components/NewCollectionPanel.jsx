import CardShell from "./ui/CardShell";
import Button from "./ui/Button";
import Input from "./ui/Input";

const NewCollectionPanel = ({
  newTitle,
  setNewTitle,
  newPdf,
  setNewPdf,
  creatingCollection,
  pdfProgress,
  onCreateCollection,
}) => {
  return (
    <CardShell
      title="New collection"
      subtitle="Upload a PDF. Text is extracted in your browser and sent to the backend."
    >
      <form className="space-y-3" onSubmit={onCreateCollection}>
        <Input
          placeholder="Title (be specific)"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
        />
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="mb-2 text-xs font-medium text-white/60">PDF file</div>
          <input
            className="block w-full cursor-pointer text-sm text-white/80 file:mr-4 file:rounded-xl file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-900 hover:file:bg-white/90"
            type="file"
            accept="application/pdf"
            onChange={(e) => setNewPdf(e.target.files?.[0] || null)}
            required
          />
          {newPdf ? <div className="mt-2 text-xs text-white/70">Selected: {newPdf.name}</div> : null}
          {creatingCollection && pdfProgress ? (
            <div className="mt-2 text-xs text-white/70">
              Extracting page {pdfProgress.pageNumber} / {pdfProgress.numPages}…
            </div>
          ) : null}
          <div className="mt-2 text-xs text-white/50">
            If your PDF is scanned images, text extraction may fail.
          </div>
        </div>
        <Button type="submit" disabled={creatingCollection}>
          {creatingCollection ? "Extracting + generating…" : "Create"}
        </Button>
      </form>
    </CardShell>
  );
};

export default NewCollectionPanel;
