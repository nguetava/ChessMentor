"use client";

import { useState } from "react";
import { levels } from "@/data/content";

export function AuthPanel() {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [message, setMessage] = useState("");

  async function submit(formData: FormData) {
    setMessage("Chargement...");
    const body = Object.fromEntries(formData.entries());
    const res = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Erreur");
      return;
    }
    window.location.href = "/dashboard";
  }

  return (
    <section className="rounded border border-black/10 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-white/5">
      <div className="mb-4 flex rounded bg-black/5 p-1 dark:bg-white/10">
        {(["register", "login"] as const).map((item) => (
          <button key={item} onClick={() => setMode(item)} className={`flex-1 rounded px-3 py-2 text-sm ${mode === item ? "bg-white shadow dark:bg-night" : ""}`}>
            {item === "register" ? "Inscription" : "Connexion"}
          </button>
        ))}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit(new FormData(event.currentTarget));
        }}
        className="grid gap-3"
      >
        {mode === "register" && (
          <>
            <label className="grid gap-1 text-sm">Pseudo<input name="displayName" required className="rounded border p-3 text-ink" /></label>
            <label className="grid gap-1 text-sm">Langue
              <select name="locale" className="rounded border p-3 text-ink"><option value="fr">Francais</option><option value="de">Deutsch</option><option value="en">English</option></select>
            </label>
            <label className="grid gap-1 text-sm">Niveau
              <select name="chessLevel" className="rounded border p-3 text-ink">
                {levels.map((level) => <option key={level.key} value={level.key}>{level.label.fr}</option>)}
              </select>
            </label>
          </>
        )}
        <label className="grid gap-1 text-sm">Email<input name="email" type="email" required defaultValue={mode === "login" ? "demo@chessmentor.local" : ""} className="rounded border p-3 text-ink" /></label>
        <label className="grid gap-1 text-sm">Mot de passe<input name="password" type="password" required defaultValue={mode === "login" ? "ChessMentor123!" : ""} className="rounded border p-3 text-ink" /></label>
        <button className="rounded bg-ink px-4 py-3 font-medium text-white dark:bg-coral">{mode === "register" ? "Creer mon compte" : "Me connecter"}</button>
        <button type="button" className="rounded border border-black/10 px-4 py-3 text-sm dark:border-white/10" onClick={() => setMessage("OAuth Google est prepare via .env, a connecter dans le fournisseur de production.")}>Continuer avec Google</button>
        <button type="button" className="text-sm underline" onClick={() => setMessage("Un lien de recuperation serait envoye apres configuration SMTP.")}>Mot de passe oublie ?</button>
        {message && <p role="status" className="text-sm text-coral">{message}</p>}
      </form>
    </section>
  );
}
