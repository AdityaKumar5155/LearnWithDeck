import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../lib/api";
import { extractPdfText } from "../lib/pdfText";
import CollectionsPanel from "../components/CollectionsPanel";
import NewCollectionPanel from "../components/NewCollectionPanel";
import DecksPanel from "../components/DecksPanel";
import PracticePanel from "../components/PracticePanel";

const DashboardPage = ({ token, showError, showInfo }) => {
  const [collections, setCollections] = useState([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [collectionFilter, setCollectionFilter] = useState("");
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [decks, setDecks] = useState([]);
  const [decksLoading, setDecksLoading] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState(null);

  // Create collection
  const [newTitle, setNewTitle] = useState("");
  const [newPdf, setNewPdf] = useState(null);
  const [creatingCollection, setCreatingCollection] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(null);

  // Practice
  const [cards, setCards] = useState([]);
  const [practiceLoading, setPracticeLoading] = useState(false);
  const [activeCardId, setActiveCardId] = useState(null);
  const [revealedAnswer, setRevealedAnswer] = useState(null);
  const [scoring, setScoring] = useState(false);

  const activeCard = useMemo(
    () => cards.find((c) => String(c.id) === String(activeCardId)) || null,
    [cards, activeCardId]
  );

  const loadCollections = async () => {
    if (!token) return;
    setCollectionsLoading(true);
    try {
      const q = collectionFilter.trim();
      const path = q ? `/collections?name=${encodeURIComponent(q)}` : `/collections`;
      const res = await apiFetch(path, { token });
      setCollections(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      showError(err);
    } finally {
      setCollectionsLoading(false);
    }
  };

  const loadDecks = async (collectionId) => {
    if (!token || !collectionId) return;
    setDecksLoading(true);
    try {
      const res = await apiFetch(`/collections/${collectionId}/decks`, { token });
      setDecks(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      showError(err);
    } finally {
      setDecksLoading(false);
    }
  };

  const loadDeckCards = async (deckId) => {
    if (!token || !deckId) return;
    setPracticeLoading(true);
    setRevealedAnswer(null);
    try {
      const res = await apiFetch(`/decks/${deckId}/cards`, { token });
      const list = Array.isArray(res?.data) ? res.data : [];
      setCards(list);
      setActiveCardId(list[0]?.id ?? null);
    } catch (err) {
      showError(err);
    } finally {
      setPracticeLoading(false);
    }
  };

  const onCreateCollection = async (e) => {
    e.preventDefault();
    if (!token) return;
    setCreatingCollection(true);
    setPdfProgress(null);
    try {
      if (!newPdf) throw new Error("Please choose a PDF file");

      const { text, numPages } = await extractPdfText(newPdf, {
        onProgress: ({ pageNumber, numPages: total }) => setPdfProgress({ pageNumber, numPages: total }),
      });

      await apiFetch(`/collections`, {
        token,
        method: "POST",
        body: { title: newTitle, text },
      });

      setNewTitle("");
      setNewPdf(null);
      setPdfProgress(null);
      showInfo(`Uploaded ${numPages} page(s). Decks are cooking…`);
      await loadCollections();
    } catch (err) {
      showError(err);
    } finally {
      setCreatingCollection(false);
    }
  };

  const onDeleteCollection = async (collectionId) => {
    if (!token || !collectionId) return;
    try {
      await apiFetch(`/collections/${collectionId}`, { token, method: "DELETE" });
      if (String(selectedCollection?.id) === String(collectionId)) {
        setSelectedCollection(null);
        setDecks([]);
        setSelectedDeck(null);
        setCards([]);
        setActiveCardId(null);
        setRevealedAnswer(null);
      }
      showInfo("Collection deleted.");
      await loadCollections();
    } catch (err) {
      showError(err);
    }
  };

  const onReveal = async () => {
    if (!token || !activeCardId) return;
    try {
      const res = await apiFetch(`/cards/${activeCardId}/answer`, { token });
      setRevealedAnswer(res?.data?.answer ?? null);
    } catch (err) {
      showError(err);
    }
  };

  const onScore = async (score) => {
    if (!token || !activeCardId) return;
    setScoring(true);
    try {
      await apiFetch(`/cards/${activeCardId}/score`, {
        token,
        method: "POST",
        body: { score },
      });

      const remaining = cards.filter((c) => String(c.id) !== String(activeCardId));
      setCards(remaining);
      setRevealedAnswer(null);
      setActiveCardId(remaining[0]?.id ?? null);

      if (remaining.length === 0 && selectedDeck?.id) {
        await loadDeckCards(selectedDeck.id);
      }
    } catch (err) {
      showError(err);
    } finally {
      setScoring(false);
    }
  };

  useEffect(() => {
    if (token) loadCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-1">
        <CollectionsPanel
          collections={collections}
          collectionsLoading={collectionsLoading}
          collectionFilter={collectionFilter}
          setCollectionFilter={setCollectionFilter}
          selectedCollection={selectedCollection}
          onSearch={loadCollections}
          onSelectCollection={async (c) => {
            setSelectedCollection(c);
            setSelectedDeck(null);
            setCards([]);
            setActiveCardId(null);
            setRevealedAnswer(null);
            await loadDecks(c.id);
          }}
          onDeleteCollection={onDeleteCollection}
        />

        <NewCollectionPanel
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          newPdf={newPdf}
          setNewPdf={setNewPdf}
          creatingCollection={creatingCollection}
          pdfProgress={pdfProgress}
          onCreateCollection={onCreateCollection}
        />
      </div>

      <div className="space-y-4 lg:col-span-2">
        <DecksPanel
          selectedCollection={selectedCollection}
          decksLoading={decksLoading}
          decks={decks}
          selectedDeck={selectedDeck}
          onSelectDeck={async (d) => {
            setSelectedDeck(d);
            await loadDeckCards(d.id);
          }}
        />

        <PracticePanel
          selectedDeck={selectedDeck}
          practiceLoading={practiceLoading}
          cards={cards}
          activeCard={activeCard}
          revealedAnswer={revealedAnswer}
          scoring={scoring}
          onReveal={onReveal}
          onScore={onScore}
          onRefresh={() => loadDeckCards(selectedDeck.id)}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
