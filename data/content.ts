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
              startFen: "6k1/6pp/8/7Q/8/8/5PPP/6K1 w - - 0 1",
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
                { san: "Qe8#", from: "h5", to: "e8", note: { fr: "La dame attaque le roi sur la huitieme rangee et coupe les cases de fuite.", de: "Die Dame greift den Konig auf der achten Reihe an und nimmt Fluchtfelder.", en: "The queen checks on the eighth rank and cuts off escapes." } }
              ],
              quiz: {
                question: { fr: "Pour etre mat, le roi doit-il etre en echec ?", de: "Muss der Konig im Schach stehen?", en: "Must the king be in check for mate?" },
                answers: [
                  { text: { fr: "Oui", de: "Ja", en: "Yes" }, correct: true },
                  { text: { fr: "Non", de: "Nein", en: "No" }, correct: false }
                ]
              },
              exercise: { fen: "6k1/6pp/8/7Q/8/8/5PPP/6K1 w - - 0 1", solution: ["Qe8#"] }
            }
          }
        ]
      }
    ]
  },
  {
    slug: "strategie-base",
    level: 2,
    title: { fr: "Strategie de base", de: "Grundstrategie", en: "Basic strategy" },
    description: { fr: "Centre, developpement, roque et plans simples pour sortir de l'ouverture.", de: "Zentrum, Entwicklung, Rochade und einfache Plane.", en: "Center, development, castling and simple opening plans." },
    modules: [
      {
        title: { fr: "Bien commencer la partie", de: "Gut eroffnen", en: "Start the game well" },
        lessons: [
          {
            slug: "centre-developpement",
            title: { fr: "Occuper le centre et developper", de: "Zentrum besetzen und entwickeln", en: "Occupy the center and develop" },
            objective: { fr: "Jouer des coups qui controlent le centre tout en sortant les pieces.", de: "Zuge finden, die Zentrum und Entwicklung verbinden.", en: "Play moves that control the center while developing pieces." },
            xpReward: 40,
            content: {
              startFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
              summary: {
                fr: "Les bons debuts de partie gagnent du temps : un pion central, puis les cavaliers et les fous vers des cases actives.",
                de: "Gute Eroffnungen gewinnen Zeit: Zentralbauer, dann Springer und Laufer aktiv entwickeln.",
                en: "Good openings gain time: a central pawn, then knights and bishops to active squares."
              },
              mistake: {
                fr: "Erreur frequente : bouger trop vite la dame et laisser les pieces mineures dormir.",
                de: "Haufiger Fehler: die Dame zu fruh ziehen und Leichtfiguren stehen lassen.",
                en: "Common mistake: moving the queen too early while minor pieces stay home."
              },
              moves: [
                { san: "e4", from: "e2", to: "e4", note: { fr: "Le pion e controle d5 et f5, et libere le fou.", de: "Der e-Bauer kontrolliert d5 und f5 und offnet den Laufer.", en: "The e-pawn controls d5 and f5 and opens the bishop." } },
                { san: "e5", from: "e7", to: "e5", note: { fr: "Les Noirs repondent aussi au centre.", de: "Schwarz antwortet ebenfalls im Zentrum.", en: "Black also answers in the center." } },
                { san: "Nf3", from: "g1", to: "f3", note: { fr: "Le cavalier attaque e5 et se rapproche du roque.", de: "Der Springer greift e5 an und bereitet die Rochade vor.", en: "The knight attacks e5 and helps prepare castling." } }
              ],
              quiz: {
                question: { fr: "Quel principe est prioritaire dans l'ouverture ?", de: "Welches Prinzip ist in der Eroffnung wichtig?", en: "Which opening principle matters most?" },
                answers: [
                  { text: { fr: "Developper les pieces vers le centre", de: "Figuren zum Zentrum entwickeln", en: "Develop pieces toward the center" }, correct: true },
                  { text: { fr: "Sortir la dame a chaque coup", de: "Die Dame in jedem Zug ziehen", en: "Move the queen every turn" }, correct: false }
                ]
              },
              exercise: { fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1", solution: ["e5"] }
            }
          }
        ]
      }
    ]
  },
  {
    slug: "tactique-guidee",
    level: 3,
    title: { fr: "Tactiques guidees", de: "Gefuhrte Taktik", en: "Guided tactics" },
    description: { fr: "Echecs, captures, menaces, fourchettes et mats courts avec indices progressifs.", de: "Schachs, Schlagzuge, Drohungen, Gabeln und kurze Matts.", en: "Checks, captures, threats, forks and short mates with progressive hints." },
    modules: [
      {
        title: { fr: "Coups forcants", de: "Forcierende Zuge", en: "Forcing moves" },
        lessons: [
          {
            slug: "fourchette-cavalier",
            title: { fr: "La fourchette du cavalier", de: "Die Springergabel", en: "The knight fork" },
            objective: { fr: "Reperer un coup de cavalier qui attaque deux cibles.", de: "Einen Springerzug finden, der zwei Ziele angreift.", en: "Find a knight move that attacks two targets." },
            xpReward: 50,
            content: {
              startFen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
              summary: {
                fr: "Le cavalier est dangereux parce qu'il saute et peut attaquer roi, dame ou pieces non protegees en meme temps.",
                de: "Der Springer ist gefahrlich, weil er springt und mehrere Ziele zugleich angreifen kann.",
                en: "The knight is dangerous because it jumps and can attack several targets at once."
              },
              mistake: {
                fr: "Erreur frequente : ne regarder que les captures de la dame et oublier les sauts du cavalier.",
                de: "Haufiger Fehler: nur Damenzuge sehen und Springersprunge vergessen.",
                en: "Common mistake: only checking queen captures and missing knight jumps."
              },
              moves: [
                { san: "Nxe5", from: "f3", to: "e5", note: { fr: "Le cavalier capture au centre et cree des menaces tactiques.", de: "Der Springer schlagt im Zentrum und erzeugt taktische Drohungen.", en: "The knight captures in the center and creates tactical threats." } }
              ],
              quiz: {
                question: { fr: "Pourquoi le cavalier surprend-il souvent ?", de: "Warum uberrascht der Springer oft?", en: "Why does the knight often surprise?" },
                answers: [
                  { text: { fr: "Il saute par-dessus les pieces", de: "Er springt uber Figuren", en: "It jumps over pieces" }, correct: true },
                  { text: { fr: "Il se deplace comme une tour", de: "Er zieht wie ein Turm", en: "It moves like a rook" }, correct: false }
                ]
              },
              exercise: { fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3", solution: ["Nxe5"] }
            }
          }
        ]
      }
    ]
  }
];

export const exercises = [
  ["mate-1", "mat en un coup", 1, "6k1/6pp/8/7Q/8/8/5PPP/6K1 w - - 0 1", "w", ["Qe8#"]],
  ["fork-1", "fourchette", 2, "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3", "w", ["Nxe5"]],
  ["pin-1", "clouage", 2, "rnbqk2r/ppppbppp/5n2/4p3/4P3/5N2/PPPPBPPP/RNBQK2R w KQkq - 4 4", "w", ["Bb5"]],
  ["skewer-1", "enfilade", 3, "4k3/8/8/8/8/8/8/4K2R w K - 0 1", "w", ["Rh8+"]],
  ["discovery-1", "attaque a la decouverte", 3, "4k3/8/8/8/8/3B4/8/4K3 w - - 0 1", "w", ["Bg6+"]],
  ["defender-1", "elimination du defenseur", 3, "6k1/6pp/8/8/8/8/6PP/5RK1 w - - 0 1", "w", ["Rf8+"]],
  ["material-1", "gain de materiel", 1, "4k3/8/8/3q4/8/3N4/8/4K3 w - - 0 1", "w", ["Nf4"]],
  ["defense-1", "defense", 2, "5Rk1/6pp/8/8/8/8/6PP/6K1 b - - 0 1", "b", ["Kxf8"]],
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
