export type Locale = "fr" | "de" | "en";
export type TText = Record<Locale, string>;

export const levels = [
  { key: "NO_RULES", label: { fr: "Je ne connais pas les regles", de: "Ich kenne die Regeln nicht", en: "I do not know the rules" } },
  { key: "BEGINNER", label: { fr: "Debutant", de: "Anfanger", en: "Beginner" } },
  { key: "INTERMEDIATE", label: { fr: "Intermediaire", de: "Fortgeschritten", en: "Intermediate" } },
  { key: "ADVANCED", label: { fr: "Avance", de: "Sehr erfahren", en: "Advanced" } }
];

export const courses = [
  {
    slug: "decouverte",
    level: 1,
    title: { fr: "Decouverte des echecs", de: "Schach entdecken", en: "Discover chess" },
    description: { fr: "Cases, pieces, echecs, mats et regles speciales.", de: "Felder, Figuren, Schach, Matt und Sonderregeln.", en: "Squares, pieces, checks, mates and special rules." },
    modules: [
      {
        title: { fr: "Premiers coups", de: "Erste Zuge", en: "First moves" },
        lessons: [
          {
            slug: "tour",
            title: { fr: "Comment se deplace la tour ?", de: "Wie zieht der Turm?", en: "How does the rook move?" },
            objective: { fr: "Comprendre les lignes droites et les captures de la tour.", de: "Gerade Linien und Schlage des Turms verstehen.", en: "Understand rook lines and captures." },
            xpReward: 25,
            content: {
              startFen: "4k3/8/8/3p4/8/3R4/8/4K3 w - - 0 1",
              summary: {
                fr: "La tour se deplace horizontalement ou verticalement, sans sauter par-dessus une piece.",
                de: "Der Turm zieht waagerecht oder senkrecht und springt nicht uber Figuren.",
                en: "The rook moves horizontally or vertically and cannot jump over pieces."
              },
              mistake: {
                fr: "Erreur frequente : essayer de jouer en diagonale avec la tour.",
                de: "Haufiger Fehler: den Turm diagonal ziehen.",
                en: "Common mistake: trying to move the rook diagonally."
              },
              moves: [
                { san: "Rxd5", from: "d3", to: "d5", note: { fr: "La tour monte sur la meme colonne et capture.", de: "Der Turm zieht auf derselben Linie und schlagt.", en: "The rook goes up the file and captures." } }
              ],
              quiz: {
                question: { fr: "La tour peut-elle sauter une piece ?", de: "Kann der Turm uber eine Figur springen?", en: "Can the rook jump over a piece?" },
                answers: [
                  { text: { fr: "Non", de: "Nein", en: "No" }, correct: true },
                  { text: { fr: "Oui", de: "Ja", en: "Yes" }, correct: false }
                ]
              },
              exercise: { fen: "4k3/8/8/3p4/8/3R4/8/4K3 w - - 0 1", solution: ["Rxd5"] }
            }
          },
          {
            slug: "mat",
            title: { fr: "Comment reconnaitre un echec et mat ?", de: "Wie erkennt man Schachmatt?", en: "How to recognize checkmate?" },
            objective: { fr: "Verifier l'echec, les cases de fuite, les captures et les interpositions.", de: "Schach, Fluchtfelder, Schlagen und Blocken prufen.", en: "Check for check, escapes, captures and blocks." },
            xpReward: 35,
            content: {
              startFen: "6k1/5ppp/8/8/8/8/5PPP/6KQ w - - 0 1",
              summary: {
                fr: "Il y a mat si le roi est en echec et n'a aucune defense legale.",
                de: "Matt ist Schach ohne legale Verteidigung.",
                en: "Checkmate is check with no legal defense."
              },
              mistake: {
                fr: "Erreur frequente : crier mat sans verifier si le roi peut capturer ou fuir.",
                de: "Haufiger Fehler: Matt sagen, ohne Flucht oder Schlag zu prufen.",
                en: "Common mistake: calling mate before checking captures or escapes."
              },
              moves: [
                { san: "Qh7#", from: "h1", to: "h7", note: { fr: "La dame attaque le roi, protegee par le roi blanc.", de: "Die Dame gibt Schach und ist geschutzt.", en: "The queen checks and is protected." } }
              ],
              quiz: {
                question: { fr: "Pour etre mat, le roi doit-il etre en echec ?", de: "Muss der Konig im Schach stehen?", en: "Must the king be in check for mate?" },
                answers: [
                  { text: { fr: "Oui", de: "Ja", en: "Yes" }, correct: true },
                  { text: { fr: "Non", de: "Nein", en: "No" }, correct: false }
                ]
              },
              exercise: { fen: "6k1/5ppp/8/8/8/8/5PPP/6KQ w - - 0 1", solution: ["Qh7#"] }
            }
          }
        ]
      }
    ]
  }
];

export const exercises = [
  ["mate-1", "mat en un coup", 1, "6k1/5ppp/8/8/8/8/5PPP/6KQ w - - 0 1", "w", ["Qh7#"]],
  ["fork-1", "fourchette", 2, "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3", "w", ["Nxe5"]],
  ["pin-1", "clouage", 2, "rnbqk2r/ppppbppp/5n2/4p3/4P3/5N2/PPPPBPPP/RNBQK2R w KQkq - 4 4", "w", ["Bb5"]],
  ["skewer-1", "enfilade", 3, "4k3/8/8/8/8/8/4r3/4K2R w K - 0 1", "w", ["Rh8+"]],
  ["discovery-1", "attaque a la decouverte", 3, "4k3/8/8/4r3/8/3B4/8/4K3 w - - 0 1", "w", ["Bg6+"]],
  ["defender-1", "elimination du defenseur", 3, "6k1/5ppp/8/8/8/8/5PPP/5RK1 w - - 0 1", "w", ["Rf8+"]],
  ["material-1", "gain de materiel", 1, "4k3/8/8/3q4/8/3N4/8/4K3 w - - 0 1", "w", ["Nf4"]],
  ["defense-1", "defense", 2, "6k1/5ppp/8/8/8/8/5PPP/5RK1 b - - 0 1", "b", ["Kxf8"]],
  ["best-1", "meilleur coup", 2, "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1", "b", ["d5"]],
  ["endgame-1", "finales", 2, "8/8/8/8/4k3/8/4K3/7R w - - 0 1", "w", ["Rh4+"]]
].map(([slug, theme, difficulty, fen, sideToMove, solution]) => ({
  slug: String(slug),
  theme: String(theme),
  difficulty: Number(difficulty),
  fen: String(fen),
  sideToMove: String(sideToMove),
  solution: solution as string[],
  explanation: {
    fr: `Le motif "${theme}" fonctionne ici parce que le coup force ameliore la position immediatement.`,
    de: `Das Motiv "${theme}" funktioniert, weil der Zug sofort zwingt.`,
    en: `The "${theme}" motif works because the forcing move improves the position immediately.`
  }
}));

export const badges = [
  ["first_lesson", "Premiere lecon terminee", "Tu as lance ton parcours."],
  ["first_win", "Premiere victoire", "Une partie gagnee contre l'ordinateur."],
  ["ten_exercises", "Dix exercices reussis", "La tactique commence a rentrer."],
  ["rook_master", "Specialiste de la tour", "La tour file droit."],
  ["mate_spotter", "Maitre des mats en un coup", "Tu reperes les rois sans defense."]
].map(([code, title, description], i) => ({
  code,
  xp: [25, 60, 80, 30, 45][i],
  title: { fr: title, de: title, en: title },
  description: { fr: description, de: description, en: description }
}));
