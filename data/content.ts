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
          },
          {
            slug: "cavalier",
            title: { fr: "Le cavalier saute", de: "Der Springer springt", en: "The knight jumps" },
            objective: { fr: "Comprendre le saut en L et reperer les cases d'arrivee.", de: "Den L-Sprung verstehen und Zielfelder erkennen.", en: "Understand the L-shaped jump and target squares." },
            xpReward: 25,
            content: {
              startFen: "4k3/8/8/8/8/2N5/8/4K3 w - - 0 1",
              summary: {
                fr: "Le cavalier avance en forme de L et peut sauter par-dessus les pieces.",
                de: "Der Springer zieht in L-Form und kann uber Figuren springen.",
                en: "The knight moves in an L shape and can jump over pieces."
              },
              mistake: {
                fr: "Erreur frequente : chercher une ligne droite alors que le cavalier change de couleur de case a chaque saut.",
                de: "Haufiger Fehler: eine gerade Linie suchen, obwohl der Springer die Feldfarbe wechselt.",
                en: "Common mistake: looking for a straight line while the knight changes square color every jump."
              },
              moves: [
                { san: "Nd5", from: "c3", to: "d5", note: { fr: "De c3, le cavalier rejoint d5 en un saut en L.", de: "Von c3 springt der Springer nach d5.", en: "From c3, the knight reaches d5 with an L jump." } }
              ],
              quiz: {
                question: { fr: "Le cavalier peut-il sauter une piece ?", de: "Kann der Springer uber eine Figur springen?", en: "Can the knight jump over a piece?" },
                answers: [
                  { text: { fr: "Oui", de: "Ja", en: "Yes" }, correct: true },
                  { text: { fr: "Non", de: "Nein", en: "No" }, correct: false }
                ]
              },
              exercise: { fen: "4k3/8/8/8/8/2N5/8/4K3 w - - 0 1", solution: ["Nd5"] }
            }
          },
          {
            slug: "fou",
            title: { fr: "Le fou et les diagonales", de: "Der Laufer und Diagonalen", en: "The bishop and diagonals" },
            objective: { fr: "Voir comment le fou attaque sur une diagonale longue.", de: "Sehen, wie der Laufer auf langen Diagonalen angreift.", en: "See how the bishop attacks along long diagonals." },
            xpReward: 25,
            content: {
              startFen: "4k3/8/5p2/8/8/2B5/8/4K3 w - - 0 1",
              summary: {
                fr: "Le fou reste toujours sur la meme couleur et controle les diagonales.",
                de: "Der Laufer bleibt immer auf derselben Farbe und kontrolliert Diagonalen.",
                en: "The bishop stays on the same color and controls diagonals."
              },
              mistake: {
                fr: "Erreur frequente : oublier qu'une piece placee sur la diagonale bloque le fou.",
                de: "Haufiger Fehler: vergessen, dass eine Figur auf der Diagonale den Laufer blockiert.",
                en: "Common mistake: forgetting that a piece on the diagonal blocks the bishop."
              },
              moves: [
                { san: "Bxf6", from: "c3", to: "f6", note: { fr: "Le fou suit la diagonale c3-d4-e5-f6 et capture.", de: "Der Laufer folgt der Diagonale c3-d4-e5-f6 und schlagt.", en: "The bishop follows c3-d4-e5-f6 and captures." } }
              ],
              quiz: {
                question: { fr: "Le fou change-t-il de couleur de case ?", de: "Wechselt der Laufer die Feldfarbe?", en: "Does the bishop change square color?" },
                answers: [
                  { text: { fr: "Non", de: "Nein", en: "No" }, correct: true },
                  { text: { fr: "Oui", de: "Ja", en: "Yes" }, correct: false }
                ]
              },
              exercise: { fen: "4k3/8/5p2/8/8/2B5/8/4K3 w - - 0 1", solution: ["Bxf6"] }
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
          },
          {
            slug: "roquer",
            title: { fr: "Roquer pour mettre le roi en securite", de: "Rochieren fur Konigssicherheit", en: "Castle to keep the king safe" },
            objective: { fr: "Reconnaitre le moment ou le petit roque devient possible.", de: "Erkennen, wann die kurze Rochade moglich ist.", en: "Recognize when kingside castling is possible." },
            xpReward: 45,
            content: {
              startFen: "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
              summary: {
                fr: "Apres avoir sorti le cavalier et le fou, le roi peut souvent roquer pour quitter le centre.",
                de: "Nach Springer- und Lauferentwicklung kann der Konig oft rochieren.",
                en: "After developing the knight and bishop, the king can often castle away from the center."
              },
              mistake: {
                fr: "Erreur frequente : laisser le roi au centre alors que les lignes vont s'ouvrir.",
                de: "Haufiger Fehler: den Konig im Zentrum lassen, wenn Linien geoffnet werden.",
                en: "Common mistake: leaving the king in the center as lines open."
              },
              moves: [
                { san: "O-O", from: "e1", to: "g1", note: { fr: "Le roi va en g1 et la tour vient en f1 en un seul coup.", de: "Der Konig geht nach g1 und der Turm nach f1.", en: "The king goes to g1 and the rook moves to f1 in one move." } }
              ],
              quiz: {
                question: { fr: "Pourquoi roquer tot est-il utile ?", de: "Warum ist fruhe Rochade nutzlich?", en: "Why is early castling useful?" },
                answers: [
                  { text: { fr: "Pour proteger le roi et connecter les tours", de: "Um den Konig zu sichern und Turme zu verbinden", en: "To protect the king and connect rooks" }, correct: true },
                  { text: { fr: "Pour gagner une dame immediatement", de: "Um sofort eine Dame zu gewinnen", en: "To win a queen immediately" }, correct: false }
                ]
              },
              exercise: { fen: "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4", solution: ["O-O"] }
            }
          },
          {
            slug: "rupture-centre",
            title: { fr: "Ouvrir le centre au bon moment", de: "Das Zentrum im richtigen Moment offnen", en: "Open the center at the right moment" },
            objective: { fr: "Utiliser un pion central pour contester l'espace adverse.", de: "Mit einem Zentralbauern gegnerischen Raum angreifen.", en: "Use a central pawn to challenge enemy space." },
            xpReward: 45,
            content: {
              startFen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
              summary: {
                fr: "Quand les pieces sont pretes, pousser un pion central peut ouvrir les lignes pour attaquer.",
                de: "Wenn die Figuren bereit sind, kann ein Zentralbauer Linien offnen.",
                en: "When pieces are ready, a central pawn push can open lines."
              },
              mistake: {
                fr: "Erreur frequente : ouvrir le centre sans avoir developpe ses pieces.",
                de: "Haufiger Fehler: das Zentrum offnen, bevor die Figuren entwickelt sind.",
                en: "Common mistake: opening the center before developing pieces."
              },
              moves: [
                { san: "d4", from: "d2", to: "d4", note: { fr: "Le pion d attaque e5 et ouvre des lignes pour les pieces blanches.", de: "Der d-Bauer greift e5 an und offnet Linien.", en: "The d-pawn attacks e5 and opens lines." } }
              ],
              quiz: {
                question: { fr: "Quel est le but de d4 ici ?", de: "Was ist das Ziel von d4?", en: "What is the goal of d4 here?" },
                answers: [
                  { text: { fr: "Contester le centre", de: "Das Zentrum angreifen", en: "Challenge the center" }, correct: true },
                  { text: { fr: "Cacher le roi", de: "Den Konig verstecken", en: "Hide the king" }, correct: false }
                ]
              },
              exercise: { fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3", solution: ["d4"] }
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
          },
          {
            slug: "clouage",
            title: { fr: "Le clouage du cavalier", de: "Die Fesselung des Springers", en: "Pinning the knight" },
            objective: { fr: "Utiliser un fou pour immobiliser une piece devant le roi.", de: "Mit dem Laufer eine Figur vor dem Konig fesseln.", en: "Use a bishop to pin a piece in front of the king." },
            xpReward: 50,
            content: {
              startFen: "rnbqk2r/ppppbppp/5n2/4p3/4P3/5N2/PPPPBPPP/RNBQK2R w KQkq - 4 4",
              summary: {
                fr: "Une piece clouee ne peut pas bouger sans exposer une piece plus importante.",
                de: "Eine gefesselte Figur kann nicht ziehen, ohne etwas Wichtigeres aufzudecken.",
                en: "A pinned piece cannot move without exposing something more valuable."
              },
              mistake: {
                fr: "Erreur frequente : capturer vite au lieu d'augmenter la pression sur la piece clouee.",
                de: "Haufiger Fehler: zu schnell schlagen statt den Druck zu erhohen.",
                en: "Common mistake: capturing too soon instead of increasing pressure."
              },
              moves: [
                { san: "Bb5", from: "e2", to: "b5", note: { fr: "Le fou vise le cavalier f6 indirectement par la pression sur le roi.", de: "Der Laufer erzeugt Druck entlang der Diagonale.", en: "The bishop creates pressure along the diagonal." } }
              ],
              quiz: {
                question: { fr: "Qu'est-ce qu'un clouage ?", de: "Was ist eine Fesselung?", en: "What is a pin?" },
                answers: [
                  { text: { fr: "Une piece ne peut pas bouger sans exposer une cible", de: "Eine Figur kann nicht ziehen, ohne ein Ziel aufzudecken", en: "A piece cannot move without exposing a target" }, correct: true },
                  { text: { fr: "Un pion qui va en promotion", de: "Ein Bauer, der umwandelt", en: "A pawn that promotes" }, correct: false }
                ]
              },
              exercise: { fen: "rnbqk2r/ppppbppp/5n2/4p3/4P3/5N2/PPPPBPPP/RNBQK2R w KQkq - 4 4", solution: ["Bb5"] }
            }
          },
          {
            slug: "mat-en-un",
            title: { fr: "Forcer le mat en un coup", de: "Matt in einem Zug erzwingen", en: "Force mate in one" },
            objective: { fr: "Chercher d'abord les echecs quand le roi adverse manque de cases.", de: "Zuerst Schachs suchen, wenn der Konig keine Felder hat.", en: "Look for checks first when the enemy king has no squares." },
            xpReward: 55,
            content: {
              startFen: "6k1/6pp/8/7Q/8/8/5PPP/6K1 w - - 0 1",
              summary: {
                fr: "Un mat court se trouve souvent en listant les echecs puis en verifiant les cases de fuite.",
                de: "Kurze Matts findet man oft, indem man zuerst alle Schachs pruft.",
                en: "Short mates are often found by listing checks and checking escape squares."
              },
              mistake: {
                fr: "Erreur frequente : regarder les captures avant les echecs decisifs.",
                de: "Haufiger Fehler: Schlagzuge vor entscheidenden Schachs betrachten.",
                en: "Common mistake: checking captures before decisive checks."
              },
              moves: [
                { san: "Qe8#", from: "h5", to: "e8", note: { fr: "La dame donne echec et le roi noir n'a plus de defense.", de: "Die Dame gibt Schach und Schwarz hat keine Verteidigung.", en: "The queen gives check and Black has no defense." } }
              ],
              quiz: {
                question: { fr: "Quel type de coup faut-il verifier en premier ?", de: "Welche Zuge pruft man zuerst?", en: "Which moves should you check first?" },
                answers: [
                  { text: { fr: "Les echecs", de: "Schachs", en: "Checks" }, correct: true },
                  { text: { fr: "Les coups de bord", de: "Randzuge", en: "Edge moves" }, correct: false }
                ]
              },
              exercise: { fen: "6k1/6pp/8/7Q/8/8/5PPP/6K1 w - - 0 1", solution: ["Qe8#"] }
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
