import { useState } from "react";
import { apiFetch } from "../lib/api";
import CardShell from "../components/ui/CardShell";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const AuthPage = ({ onAuthed, showError, showInfo }) => {
  const [authMode, setAuthMode] = useState("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [busyAuth, setBusyAuth] = useState(false);

  const onAuthSubmit = async (e) => {
    e.preventDefault();
    setBusyAuth(true);
    try {
      if (authMode === "register") {
        const payload = {
          first_name: firstName,
          middle_name: middleName || null,
          last_name: lastName || null,
          email: authEmail,
          password: authPassword,
        };
        const res = await apiFetch(`/auth/register`, { method: "POST", body: payload });
        const t = res?.data?.token;
        if (!t) throw new Error("No token returned");
        onAuthed(t);
        showInfo("Welcome! Your first deck is one upload away.");
        return;
      }

      const res = await apiFetch(`/auth/login`, {
        method: "POST",
        body: { email: authEmail, password: authPassword },
      });
      const t = res?.data?.token;
      if (!t) throw new Error("No token returned");
      onAuthed(t);
      showInfo("Back for more practice. Love it.");
    } catch (err) {
      showError(err);
    } finally {
      setBusyAuth(false);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <CardShell
        title={authMode === "login" ? "Login" : "Create account"}
        subtitle="Your progress lives on the server; your token lives on your device."
      >
        <form className="space-y-3" onSubmit={onAuthSubmit}>
          {authMode === "register" ? (
            <div className="grid gap-3 sm:grid-cols-3">
              <Input
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <Input
                placeholder="Middle (optional)"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
              />
              <Input
                placeholder="Last (optional)"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          ) : null}

          <Input
            placeholder="Email"
            value={authEmail}
            onChange={(e) => setAuthEmail(e.target.value)}
            type="email"
            required
          />
          <Input
            placeholder="Password"
            value={authPassword}
            onChange={(e) => setAuthPassword(e.target.value)}
            type="password"
            required
          />

          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit" disabled={busyAuth}>
              {busyAuth ? "Working…" : authMode === "login" ? "Login" : "Register"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
            >
              {authMode === "login" ? "Need an account?" : "Already have an account?"}
            </Button>
          </div>
        </form>
      </CardShell>

      <CardShell title="How it works" subtitle="A tiny loop with big compounding returns.">
        <ol className="space-y-3 text-sm text-white/80">
          <li>
            <span className="font-medium text-white">1) Ingest</span> text → your server generates
            decks by topic.
          </li>
          <li>
            <span className="font-medium text-white">2) Practice</span> the next best cards
            (FSRS-ish scheduling).
          </li>
          <li>
            <span className="font-medium text-white">3) Score</span> recall honestly — the schedule
            adapts.
          </li>
        </ol>
      </CardShell>
    </div>
  );
};

export default AuthPage;
