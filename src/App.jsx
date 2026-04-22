
import { useEffect, useState } from "react";
import { clearToken, loadToken, saveToken } from "./lib/authStorage";
import AppHeader from "./components/AppHeader";
import Toast from "./components/ui/Toast";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";

const App = () => {
  const [token, setToken] = useState(() => loadToken());

  // Feedback
  const [toast, setToast] = useState({ kind: "info", message: "" });
  const showError = (err) => {
    const msg = err?.message || "Something went wrong";
    setToast({ kind: "error", message: msg });
  };
  const showInfo = (message) => setToast({ kind: "info", message });

  useEffect(() => {
    saveToken(token);
  }, [token]);

  const onLogout = () => {
    clearToken();
    setToken("");
    showInfo("Logged out");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <AppHeader tokenPresent={Boolean(token)} onLogout={onLogout} />

        <div className="mb-6">
          <Toast
            kind={toast.kind}
            message={toast.message}
            onClose={() => setToast({ kind: "info", message: "" })}
          />
        </div>

        {!token ? (
          <AuthPage onAuthed={setToken} showError={showError} showInfo={showInfo} />
        ) : (
          <DashboardPage token={token} showError={showError} showInfo={showInfo} />
        )}

        <div className="mt-8 text-xs text-white/50">
          Tip: set `VITE_API_BASE_URL` if your backend isn’t on `http://localhost:5000`.
        </div>
      </div>
    </div>
  );
};

export default App;
