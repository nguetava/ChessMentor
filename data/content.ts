export type Locale = "fr" | "de" | "en";
export type TText = Record<Locale, string>;

type LessonPattern = {
  fen: string;
  solution: string;
  move: { san: string; from: string; to: string };
  note: string;
  quizQuestion: string;
  quizGood: string;
  quizBad: string;
};

type LessonSpec = {
  slug: string;
  title: string;
  objective: string;
  focus: string;
  commonMistake: string;
  pattern: keyof typeof patterns;
  xp?: number;
};

const tr = (text: string): TText => ({ fr: text, de: text, en: text });

export const levels = [
  { key: "NO_RULES", label: tr("Je ne connais pas les regles") },
  { key: "BEGINNER", label: tr("Debutant") },
  { key: "INTERMEDIATE", label: tr("Intermediaire") },
  { key: "ADVANCED", label: tr("Avance") }
];

const patterns = {
  board: {
    fen: "4k3/8/8/3p4/8/3R4/8/4K3 w - - 0 1",
    solution: "Rxd5",
    move: { san: "Rxd5", from: "d3", to: "d5" },
    note: "La tour suit la colonne sans sauter et capture la piece placee devant elle.",
    quizQuestion: "Quelle piece se deplace en ligne droite sur les colonnes et les rangees ?",
    quizGood: "La tour",
    quizBad: "Le cavalier"
  },
  knight: {
    fen: "4k3/8/8/8/8/2N5/8/4K3 w - - 0 1",
    solution: "Nd5",
    move: { san: "Nd5", from: "c3", to: "d5" },
    note: "Le cavalier rejoint d5 avec un saut en L et change de couleur de case.",
    quizQuestion: "Quelle piece peut sauter par-dessus les autres ?",
    quizGood: "Le cavalier",
    quizBad: "Le fou"
  },
  bishop: {
    fen: "4k3/8/5p2/8/8/2B5/8/4K3 w - - 0 1",
    solution: "Bxf6",
    move: { san: "Bxf6", from: "c3", to: "f6" },
    note: "Le fou suit la diagonale c3-d4-e5-f6 et capture.",
    quizQuestion: "Sur quelles lignes le fou agit-il ?",
    quizGood: "Les diagonales",
    quizBad: "Les colonnes seulement"
  },
  queenMate: {
    fen: "6k1/6pp/8/7Q/8/8/5PPP/6K1 w - - 0 1",
    solution: "Qe8#",
    move: { san: "Qe8#", from: "h5", to: "e8" },
    note: "La dame donne echec, coupe les cases de fuite et termine la partie.",
    quizQuestion: "Avant d'annoncer mat, que faut-il verifier ?",
    quizGood: "Echec, fuite, capture et interposition",
    quizBad: "Seulement la valeur des pieces"
  },
  opening: {
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    solution: "e4",
    move: { san: "e4", from: "e2", to: "e4" },
    note: "Le pion central controle des cases importantes et libere les pieces.",
    quizQuestion: "Quel principe aide a bien commencer ?",
    quizGood: "Controler le centre et developper",
    quizBad: "Bouger la meme piece sans raison"
  },
  center: {
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
    solution: "d4",
    move: { san: "d4", from: "d2", to: "d4" },
    note: "Le pion d conteste e5 et ouvre des lignes pour les pieces blanches.",
    quizQuestion: "Pourquoi pousser un pion central ?",
    quizGood: "Pour gagner de l'espace et ouvrir les lignes",
    quizBad: "Pour cacher le roi"
  },
  castle: {
    fen: "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
    solution: "O-O",
    move: { san: "O-O", from: "e1", to: "g1" },
    note: "Le roi quitte le centre et la tour rejoint une colonne plus active.",
    quizQuestion: "Quel est le role principal du roque ?",
    quizGood: "Mettre le roi en securite",
    quizBad: "Promouvoir un pion"
  },
  fork: {
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
    solution: "Nxe5",
    move: { san: "Nxe5", from: "f3", to: "e5" },
    note: "Le cavalier capture au centre et cree des menaces tactiques.",
    quizQuestion: "Pourquoi le cavalier cree-t-il souvent des surprises ?",
    quizGood: "Il saute et attaque des cases peu visibles",
    quizBad: "Il avance comme une tour"
  },
  pin: {
    fen: "rnbqk2r/ppppbppp/5n2/4p3/4P3/5N2/PPPPBPPP/RNBQK2R w KQkq - 4 4",
    solution: "Bb5",
    move: { san: "Bb5", from: "e2", to: "b5" },
    note: "Le fou cree une pression sur une piece qui protege une cible plus importante.",
    quizQuestion: "Qu'est-ce qu'un clouage ?",
    quizGood: "Une piece ne peut pas bouger sans exposer une cible",
    quizBad: "Une avance automatique de pion"
  },
  rookCheck: {
    fen: "4k3/8/8/8/8/8/8/4K2R w K - 0 1",
    solution: "Rh8+",
    move: { san: "Rh8+", from: "h1", to: "h8" },
    note: "La tour utilise la colonne ouverte pour donner echec au roi.",
    quizQuestion: "Pourquoi une colonne ouverte est-elle utile ?",
    quizGood: "Elle donne de l'activite aux tours",
    quizBad: "Elle bloque les tours"
  },
  discovery: {
    fen: "4k3/8/8/8/8/3B4/8/4K3 w - - 0 1",
    solution: "Bg6+",
    move: { san: "Bg6+", from: "d3", to: "g6" },
    note: "Le fou change de diagonale et cree un echec actif.",
    quizQuestion: "Que cherche-t-on dans une attaque a la decouverte ?",
    quizGood: "Liberer une ligne ou une menace cachee",
    quizBad: "Echanger sans calcul"
  },
  defender: {
    fen: "6k1/6pp/8/8/8/8/6PP/5RK1 w - - 0 1",
    solution: "Rf8+",
    move: { san: "Rf8+", from: "f1", to: "f8" },
    note: "La tour force le roi a reagir et reduit ses defenses.",
    quizQuestion: "Quel est le but d'eliminer un defenseur ?",
    quizGood: "Retirer la piece qui tient la position",
    quizBad: "Donner une case au roi adverse"
  },
  pawnEndgame: {
    fen: "8/8/8/8/4k3/8/4K3/7R w - - 0 1",
    solution: "Rh4+",
    move: { san: "Rh4+", from: "h1", to: "h4" },
    note: "L'echec force le roi a reculer et prepare un plan de finale.",
    quizQuestion: "En finale, que faut-il calculer avec soin ?",
    quizGood: "Les cases de roi et les tempos",
    quizBad: "Seulement les echecs spectaculaires"
  },
  blackDefense: {
    fen: "5Rk1/6pp/8/8/8/8/6PP/6K1 b - - 0 1",
    solution: "Kxf8",
    move: { san: "Kxf8", from: "g8", to: "f8" },
    note: "Le roi capture la tour quand la capture est legale et necessaire.",
    quizQuestion: "Comment defendre une position attaquee ?",
    quizGood: "Verifier captures, fuites et blocages",
    quizBad: "Jouer vite sans verifier l'echec"
  }
} satisfies Record<string, LessonPattern>;

function makeLesson(spec: LessonSpec) {
  const pattern = patterns[spec.pattern];

  return {
    slug: spec.slug,
    title: tr(spec.title),
    objective: tr(spec.objective),
    xpReward: spec.xp ?? 35,
    content: {
      startFen: pattern.fen,
      summary: tr(`${spec.focus} Cette lecon montre une idee pratique avec un exemple jouable sur l'echiquier.`),
      mistake: tr(spec.commonMistake),
      moves: [
        {
          san: pattern.move.san,
          from: pattern.move.from,
          to: pattern.move.to,
          note: tr(pattern.note)
        }
      ],
      quiz: {
        question: tr(pattern.quizQuestion),
        answers: [
          { text: tr(pattern.quizGood), correct: true },
          { text: tr(pattern.quizBad), correct: false }
        ]
      },
      exercise: { fen: pattern.fen, solution: [pattern.solution] }
    }
  };
}

function makeModule(title: string, lessons: LessonSpec[]) {
  return { title: tr(title), lessons: lessons.map(makeLesson) };
}

export const courses = [
  {
    slug: "niveau-fondations",
    level: 1,
    title: tr("Niveau 1 - Bases et premiers mats"),
    description: tr("Un parcours pour comprendre l'echiquier, les pieces, les regles speciales, les mats simples et les premiers principes de partie."),
    modules: [
      makeModule("Bases du jeu", [
        {
          slug: "echiquier-pieces",
          title: "L'echiquier et les forces en presence",
          objective: "Identifier les cases, les coordonnees et le role de chaque piece.",
          focus: "Avant de calculer, il faut savoir lire l'echiquier et nommer les forces.",
          commonMistake: "Erreur frequente : regarder les pieces sans reperer les coordonnees et les lignes.",
          pattern: "board",
          xp: 20
        },
        {
          slug: "mouvements-pieces",
          title: "Trajets des pieces et captures",
          objective: "Comparer les mouvements de la tour, du fou, du cavalier, de la dame et du roi.",
          focus: "Chaque piece a une geometrie differente : ligne, diagonale, saut ou courte distance.",
          commonMistake: "Erreur frequente : confondre deplacement et capture, surtout avec les pions.",
          pattern: "knight",
          xp: 25
        },
        {
          slug: "regles-speciales",
          title: "Roque, promotion et prise particuliere",
          objective: "Comprendre les coups qui changent les regles habituelles de deplacement.",
          focus: "Les coups speciaux sont rares mais essentiels pour jouer une vraie partie.",
          commonMistake: "Erreur frequente : roquer alors que le roi traverse une case controlee.",
          pattern: "castle",
          xp: 30
        },
        {
          slug: "vie-du-roi",
          title: "Le roi attaque, fuit et se protege",
          objective: "Apprendre ce qu'un roi peut faire, et quand il devient vulnerable.",
          focus: "Le roi est une piece active, mais sa securite reste prioritaire.",
          commonMistake: "Erreur frequente : avancer le roi trop tot sans calculer les echecs adverses.",
          pattern: "blackDefense",
          xp: 30
        }
      ]),
      makeModule("Mats elementaires", [
        {
          slug: "mat-en-un-base",
          title: "Trouver un mat immediat",
          objective: "Lister les echecs et verifier que le roi n'a aucune defense.",
          focus: "Un mat en un coup se trouve avec une methode : echecs, cases de fuite, captures, blocages.",
          commonMistake: "Erreur frequente : annoncer mat sans verifier si une piece peut capturer l'attaquant.",
          pattern: "queenMate",
          xp: 35
        },
        {
          slug: "mat-dame-roi",
          title: "Dame et roi contre roi seul",
          objective: "Comprendre comment la dame reduit l'espace du roi adverse.",
          focus: "La dame controle beaucoup de cases, mais elle doit etre coordonnee avec le roi.",
          commonMistake: "Erreur frequente : donner des echecs sans rapprocher son roi.",
          pattern: "queenMate",
          xp: 35
        },
        {
          slug: "mat-tour-roi",
          title: "Tour et roi : enfermer le roi",
          objective: "Utiliser la tour pour couper une rangee ou une colonne.",
          focus: "La tour gagne en finale quand elle limite le roi et l'oblige a reculer.",
          commonMistake: "Erreur frequente : approcher la tour trop pres du roi adverse.",
          pattern: "rookCheck",
          xp: 35
        },
        {
          slug: "mat-deux-fous",
          title: "Deux fous et roi : couvrir les diagonales",
          objective: "Voir comment deux fous peuvent controler les deux couleurs de cases.",
          focus: "Les fous travaillent ensemble pour fermer les diagonales et pousser le roi.",
          commonMistake: "Erreur frequente : separer les fous au lieu de les coordonner.",
          pattern: "bishop",
          xp: 35
        },
        {
          slug: "schemas-mat",
          title: "Modeles de mat a reconnaitre",
          objective: "Memoriser des formes simples de mat et les retrouver en partie.",
          focus: "Les schemas de mat reviennent souvent : roi bloque, piece lourde active, cases controlees.",
          commonMistake: "Erreur frequente : chercher une capture alors qu'un echec force termine la partie.",
          pattern: "queenMate",
          xp: 40
        }
      ]),
      makeModule("Premieres parties", [
        {
          slug: "premieres-ouvertures",
          title: "Premiers choix d'ouverture",
          objective: "Jouer des coups utiles des le debut : centre, developpement, roi.",
          focus: "Une ouverture saine donne de l'espace aux pieces et evite les pertes de temps.",
          commonMistake: "Erreur frequente : sortir la dame trop tot et perdre des tempos.",
          pattern: "opening",
          xp: 35
        },
        {
          slug: "premier-milieu",
          title: "Entrer dans le milieu de partie",
          objective: "Transformer le developpement en plan simple.",
          focus: "Le milieu de partie commence quand les pieces sont sorties et cherchent des cibles.",
          commonMistake: "Erreur frequente : attaquer sans regarder les pieces non protegees.",
          pattern: "center",
          xp: 35
        },
        {
          slug: "fin-partie-resultats",
          title: "Victoire, nulle ou defaite",
          objective: "Comprendre les facons legales de terminer une partie.",
          focus: "Une partie peut finir par mat, abandon, pat, repetition, manque de materiel ou temps.",
          commonMistake: "Erreur frequente : confondre pat et mat.",
          pattern: "blackDefense",
          xp: 30
        },
        {
          slug: "test-final-debutant",
          title: "Bilan du premier niveau",
          objective: "Revoir les idees essentielles avant de passer a la tactique.",
          focus: "Ce bilan rassemble pieces, roi, mats simples, ouverture et fin de partie.",
          commonMistake: "Erreur frequente : jouer vite sans appliquer la checklist des coups legaux.",
          pattern: "queenMate",
          xp: 50
        }
      ])
    ]
  },
  {
    slug: "niveau-strategie-tactique",
    level: 2,
    title: tr("Niveau 2 - Plans, tactiques et structures"),
    description: tr("Un niveau pour apprendre a construire une position, reconnaitre les motifs tactiques et comprendre les familles d'ouvertures."),
    modules: [
      makeModule("Combinaisons et motifs", [
        {
          slug: "bases-combinaisons",
          title: "Assembler une combinaison",
          objective: "Relier echecs, captures et menaces dans une suite forcee.",
          focus: "Une combinaison commence par les coups forcing et se termine par un gain concret.",
          commonMistake: "Erreur frequente : calculer seulement son idee sans chercher la meilleure defense adverse.",
          pattern: "fork",
          xp: 45
        },
        {
          slug: "sacrifice-calcul",
          title: "Donner du materiel pour gagner plus",
          objective: "Evaluer quand un sacrifice est justifie par une attaque ou un gain force.",
          focus: "Un sacrifice n'est pas un cadeau : il doit ouvrir une ligne, attirer le roi ou gagner du temps.",
          commonMistake: "Erreur frequente : sacrifier pour faire joli sans variante concrete.",
          pattern: "discovery",
          xp: 45
        },
        {
          slug: "deviation-defenseur",
          title: "Detourner une piece cle",
          objective: "Forcer une piece adverse a abandonner sa mission defensive.",
          focus: "La deviation retire le defenseur d'une case, d'une ligne ou d'une piece importante.",
          commonMistake: "Erreur frequente : capturer le defenseur avant d'identifier ce qu'il protege.",
          pattern: "defender",
          xp: 45
        },
        {
          slug: "attraction-roi",
          title: "Attirer une cible sur la mauvaise case",
          objective: "Comprendre comment une piece adverse peut etre forcee vers une case vulnerable.",
          focus: "L'attraction oblige une cible a se placer la ou la tactique fonctionne.",
          commonMistake: "Erreur frequente : attirer une piece sans avoir le coup suivant.",
          pattern: "queenMate",
          xp: 45
        },
        {
          slug: "clouage-pression",
          title: "Exploiter une piece clouee",
          objective: "Transformer un clouage en pression durable ou en gain de materiel.",
          focus: "Une piece clouee devient une cible si on ajoute des attaquants.",
          commonMistake: "Erreur frequente : relacher le clouage trop vite.",
          pattern: "pin",
          xp: 45
        },
        {
          slug: "combinaisons-frequentes-1",
          title: "Motifs tactiques recurrents I",
          objective: "Reconnaitre les fourchettes, clouages et attaques doubles.",
          focus: "Les tactiques reviennent sous des formes proches : il faut apprendre a les nommer.",
          commonMistake: "Erreur frequente : regarder seulement les coups de dame.",
          pattern: "fork",
          xp: 45
        },
        {
          slug: "combinaisons-frequentes-2",
          title: "Motifs tactiques recurrents II",
          objective: "Approfondir les enfilades, decouvertes et eliminations de defense.",
          focus: "Plusieurs motifs peuvent se combiner dans une meme variante.",
          commonMistake: "Erreur frequente : s'arreter au premier bon coup au lieu de chercher le plus fort.",
          pattern: "rookCheck",
          xp: 45
        }
      ]),
      makeModule("Plans de milieu de partie", [
        {
          slug: "developpement-actif",
          title: "Developper avec une idee",
          objective: "Amener les pieces vers des cases utiles, pas seulement les sortir.",
          focus: "Un bon developpement prepare le centre, le roque et les futures menaces.",
          commonMistake: "Erreur frequente : developper une piece vers une case passive.",
          pattern: "opening",
          xp: 40
        },
        {
          slug: "roi-en-securite",
          title: "Proteger son roi avant l'attaque",
          objective: "Evaluer le roque, les pions du roi et les lignes ouvertes.",
          focus: "Une attaque echoue souvent si son propre roi est plus expose.",
          commonMistake: "Erreur frequente : ouvrir des lignes devant son roi sans compensation.",
          pattern: "castle",
          xp: 40
        },
        {
          slug: "centre-actif",
          title: "Occuper et contester le centre",
          objective: "Choisir entre tenir, echanger ou pousser les pions centraux.",
          focus: "Le centre decide la mobilite des pieces et le cote ou attaquer.",
          commonMistake: "Erreur frequente : laisser l'adversaire installer ses pions sans reaction.",
          pattern: "center",
          xp: 40
        },
        {
          slug: "activite-pieces",
          title: "Activer les pieces dormantes",
          objective: "Comparer une piece active et une piece seulement developpee.",
          focus: "Une piece active attaque, defend ou controle des cases importantes.",
          commonMistake: "Erreur frequente : garder une tour ou un fou sans perspective.",
          pattern: "bishop",
          xp: 40
        },
        {
          slug: "structures-pions",
          title: "Lire une structure de pions",
          objective: "Comprendre les chaines, pions isoles, pions doubles et cases faibles.",
          focus: "La structure de pions indique les plans durables de la position.",
          commonMistake: "Erreur frequente : pousser les pions sans voir les cases faibles creees.",
          pattern: "center",
          xp: 40
        }
      ]),
      makeModule("Familles d'ouvertures", [
        {
          slug: "positions-ouvertes",
          title: "Positions ouvertes : lignes et initiative",
          objective: "Comprendre pourquoi les pieces rapides dominent quand le centre s'ouvre.",
          focus: "Les positions ouvertes favorisent developpement rapide, roque et tactiques.",
          commonMistake: "Erreur frequente : laisser son roi au centre dans une position ouverte.",
          pattern: "opening",
          xp: 40
        },
        {
          slug: "positions-fermees",
          title: "Positions fermees : manoeuvres et patience",
          objective: "Apprendre a ameliorer les pieces quand les lignes sont bloquees.",
          focus: "Dans une position fermee, on prepare les ruptures et les bonnes cases.",
          commonMistake: "Erreur frequente : ouvrir le jeu du mauvais cote.",
          pattern: "knight",
          xp: 40
        },
        {
          slug: "positions-semi-ouvertes",
          title: "Positions semi-ouvertes : desequilibres",
          objective: "Comprendre les positions ou un camp possede une colonne ou un pion different.",
          focus: "Les structures semi-ouvertes demandent de jouer contre les faiblesses.",
          commonMistake: "Erreur frequente : echanger les pieces actives qui attaquent la faiblesse.",
          pattern: "rookCheck",
          xp: 40
        },
        {
          slug: "gambits-principes",
          title: "Gambits : temps contre materiel",
          objective: "Savoir quand accepter ou refuser un pion offert.",
          focus: "Un gambit donne du materiel pour accelerer le developpement ou ouvrir des lignes.",
          commonMistake: "Erreur frequente : prendre tout le materiel sans finir son developpement.",
          pattern: "discovery",
          xp: 45
        }
      ])
    ]
  },
  {
    slug: "niveau-finales-maitres",
    level: 3,
    title: tr("Niveau 3 - Finales et inspirations de maitres"),
    description: tr("Un niveau avance pour convertir les avantages, etudier les finales essentielles et s'inspirer de parties modeles."),
    modules: [
      makeModule("Finales essentielles", [
        {
          slug: "initiation-finales",
          title: "Entrer en finale avec un plan",
          objective: "Identifier l'activite du roi, les pions passes et les pieces restantes.",
          focus: "La finale transforme les petits avantages en resultats concrets.",
          commonMistake: "Erreur frequente : garder son roi passif.",
          pattern: "pawnEndgame",
          xp: 45
        },
        {
          slug: "finales-pions-1",
          title: "Finales de pions : opposition",
          objective: "Comprendre comment les rois se contestent les cases cle.",
          focus: "L'opposition permet de gagner un tempo ou de bloquer le roi adverse.",
          commonMistake: "Erreur frequente : pousser le pion avant de placer le roi.",
          pattern: "pawnEndgame",
          xp: 45
        },
        {
          slug: "finales-pions-2",
          title: "Finales de pions : promotion",
          objective: "Calculer les courses de pions et les carres de promotion.",
          focus: "Un pion passe devient dangereux si son roi l'accompagne.",
          commonMistake: "Erreur frequente : oublier le carre du pion.",
          pattern: "pawnEndgame",
          xp: 45
        },
        {
          slug: "finales-tours",
          title: "Finales de tours : activite d'abord",
          objective: "Placer la tour derriere les pions et activer le roi.",
          focus: "Les finales de tours recompensent les pieces actives et les echecs lateraux.",
          commonMistake: "Erreur frequente : defendre passivement un pion faible.",
          pattern: "rookCheck",
          xp: 45
        },
        {
          slug: "finales-cavaliers",
          title: "Finales de cavaliers : cases fortes",
          objective: "Chercher les avant-postes et les fourchettes possibles.",
          focus: "Le cavalier est puissant quand il trouve une case stable pres des pions.",
          commonMistake: "Erreur frequente : placer le cavalier au bord sans cible.",
          pattern: "knight",
          xp: 45
        },
        {
          slug: "finales-fous",
          title: "Finales de fous : couleur et diagonales",
          objective: "Comprendre les bons et mauvais fous selon les pions.",
          focus: "Un fou actif attaque les deux ailes si les diagonales restent ouvertes.",
          commonMistake: "Erreur frequente : enfermer son fou derriere ses propres pions.",
          pattern: "bishop",
          xp: 45
        },
        {
          slug: "finales-dames",
          title: "Finales de dames : echecs et roi expose",
          objective: "Gerer les echecs perpetuels, la securite du roi et les pions passes.",
          focus: "Les finales de dames demandent precision et vigilance contre les echecs continus.",
          commonMistake: "Erreur frequente : pousser un pion en laissant un perpetuel.",
          pattern: "queenMate",
          xp: 45
        }
      ]),
      makeModule("Lecons inspirees de grands maitres", [
        {
          slug: "modele-mat-sept-coups",
          title: "Miniature brillante : attaque rapide",
          objective: "Voir comment une erreur de developpement peut mener a une attaque decisive.",
          focus: "Les parties courtes montrent l'importance de la securite du roi.",
          commonMistake: "Erreur frequente : ignorer une menace parce que la partie vient de commencer.",
          pattern: "queenMate",
          xp: 50
        },
        {
          slug: "modele-serie-sacrifices",
          title: "Suite de sacrifices calcules",
          objective: "Distinguer sacrifice intuitif et sacrifice calcule.",
          focus: "Un sacrifice fort force des reponses et garde l'initiative.",
          commonMistake: "Erreur frequente : sacrifier sans verifier la derniere defense.",
          pattern: "discovery",
          xp: 50
        },
        {
          slug: "modele-tactique-finale",
          title: "Ressource tactique en finale",
          objective: "Trouver une tactique meme quand il reste peu de materiel.",
          focus: "Les finales contiennent aussi fourchettes, clouages et echecs intermediaires.",
          commonMistake: "Erreur frequente : croire que la tactique disparait en finale.",
          pattern: "fork",
          xp: 50
        },
        {
          slug: "modele-artillerie-lourde",
          title: "Tours et dame en batterie",
          objective: "Coordonner les pieces lourdes sur une colonne ou une rangee.",
          focus: "Les pieces lourdes deviennent redoutables quand elles attaquent la meme cible.",
          commonMistake: "Erreur frequente : aligner les pieces sans point d'attaque.",
          pattern: "rookCheck",
          xp: 50
        },
        {
          slug: "modele-pression-fil",
          title: "Tenir la tension sur une ligne",
          objective: "Maintenir une menace sans precipiter l'echange.",
          focus: "Parfois le meilleur coup garde la pression au lieu de capturer.",
          commonMistake: "Erreur frequente : echanger et supprimer sa propre initiative.",
          pattern: "pin",
          xp: 50
        },
        {
          slug: "modele-contre-attaque",
          title: "Repondre a l'attaque par l'initiative",
          objective: "Chercher un coup actif quand l'adversaire menace.",
          focus: "Une contre-attaque reussie cree une menace plus forte que celle subie.",
          commonMistake: "Erreur frequente : defendre passivement alors qu'un coup forcing existe.",
          pattern: "defender",
          xp: 50
        },
        {
          slug: "modele-mat-rapide-celebre",
          title: "Partie celebre, conclusion rapide",
          objective: "Comprendre comment le developpement decide une miniature.",
          focus: "Les miniatures punissent les retards de developpement et les faiblesses du roi.",
          commonMistake: "Erreur frequente : prendre du materiel pendant que le roi reste expose.",
          pattern: "queenMate",
          xp: 50
        },
        {
          slug: "modele-appat",
          title: "L'appat qui detourne la defense",
          objective: "Utiliser une menace apparente pour forcer une piece sur une mauvaise case.",
          focus: "Un appat tactique attire la reponse adverse vers la variante voulue.",
          commonMistake: "Erreur frequente : jouer l'appat sans calculer l'acceptation.",
          pattern: "defender",
          xp: 50
        },
        {
          slug: "modele-cavaliers-assaut",
          title: "Cavaliers au coeur de l'attaque",
          objective: "Placer les cavaliers sur des cases avancees pour attaquer le roi.",
          focus: "Les cavaliers deviennent terribles pres du roi adverse.",
          commonMistake: "Erreur frequente : echanger le cavalier actif contre une piece passive.",
          pattern: "fork",
          xp: 50
        },
        {
          slug: "modele-gambit-secret",
          title: "Idees cachees dans un gambit",
          objective: "Analyser le lien entre pion offert, developpement et initiative.",
          focus: "Un bon gambit donne des lignes, du temps et des cibles.",
          commonMistake: "Erreur frequente : jouer un gambit sans connaitre les plans.",
          pattern: "opening",
          xp: 50
        }
      ])
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
  explanation: tr(`Le motif "${theme}" fonctionne ici parce que le coup force ameliore la position immediatement.`)
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
  title: tr(title),
  description: tr(description)
}));
