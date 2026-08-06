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
  depth?: string;
  xp?: number;
};

type TheoryCardSpec = {
  title: string;
  body: string;
  plan?: string[];
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

const card = (title: string, body: string, plan?: string[]): TheoryCardSpec => ({ title, body, plan });

const foundationCards: TheoryCardSpec[] = [
  card(
    "Observer avant de jouer",
    "Commence toujours par lire la position : qui a le trait, quels rois sont exposes, quelles pieces sont attaquees et quelles lignes sont ouvertes. Cette routine evite les coups joues au hasard.",
    ["Repere le trait.", "Regarde les deux rois.", "Nomme les pieces non protegees."]
  ),
  card(
    "Comprendre la regle utile",
    "Une regle d'echecs n'est pas seulement une interdiction. Elle sert a prevoir ce qui est legal, ce qui force une reponse et ce qui transforme une position en avantage concret.",
    ["Un coup legal respecte le roi.", "Une capture n'est pas obligatoire.", "Un echec doit etre pare immediatement."]
  ),
  card(
    "Passer de la regle au plan",
    "Quand tu connais le mouvement, demande-toi ce que la piece controle apres le coup. Une piece bien placee attaque, defend ou prive le roi adverse de cases importantes.",
    ["Controle des cases, pas seulement des pieces.", "Une piece protegee agit avec plus de liberte.", "Les lignes et diagonales donnent la direction du plan."]
  )
];

const theoryByPattern = {
  board: [
    ...foundationCards,
    card(
      "Lire l'echiquier",
      "L'echiquier est une carte de 64 cases. Les colonnes vont de a a h, les rangees de 1 a 8, et chaque case se nomme avec une lettre puis un chiffre. Cette notation permet de suivre une partie, un exercice et une correction sans ambiguite.",
      ["Les colonnes : a, b, c, d, e, f, g, h.", "Les rangees : 1 a 8.", "Une case se lit comme e4 ou h7."]
    )
  ],
  knight: [
    card(
      "Geometrie du cavalier",
      "Le cavalier saute en forme de L : deux cases dans une direction puis une case de cote. Il change toujours de couleur de case et peut agir meme quand des pieces bloquent les lignes.",
      ["Un saut ne peut pas etre bloque.", "Le cavalier attaque des cases parfois invisibles.", "Au bord, il perd beaucoup de mobilite."]
    ),
    card(
      "Case forte",
      "Un cavalier devient dangereux sur une case avancee ou stable, surtout si aucun pion adverse ne peut le chasser. Les PDF de strategie insistent sur ces points d'appui crees par la structure de pions.",
      ["Cherche une case centrale.", "Verifie si un pion adverse peut le chasser.", "Protege-le avec un pion ou une piece."]
    ),
    card(
      "Fourchette",
      "La tactique naturelle du cavalier est l'attaque double. Il peut viser roi, dame, tours ou pieces non protegees depuis une case ou l'adversaire ne l'attend pas.",
      ["Liste les cibles de grande valeur.", "Cherche les echecs de cavalier.", "Calcule la meilleure defense adverse."]
    )
  ],
  bishop: [
    card(
      "Diagonales",
      "Le fou reste toute la partie sur la meme couleur de cases. Sa force depend donc des diagonales ouvertes et de la maniere dont tes propres pions lui laissent respirer.",
      ["Trace la diagonale complete.", "Repere les pions qui bloquent le fou.", "Cherche une cible au bout de la diagonale."]
    ),
    card(
      "Bon fou, mauvais fou",
      "Un fou actif travaille hors de sa chaine de pions. Un fou enferme derriere ses propres pions peut valoir beaucoup moins que sa valeur theorique.",
      ["Compare la couleur des pions et du fou.", "Ouvre une diagonale si possible.", "Evite d'echanger ton fou actif sans raison."]
    ),
    card(
      "Coordination",
      "Deux fous ou un fou avec une dame peuvent couvrir de longues diagonales et enfermer le roi. L'idee n'est pas de donner des echecs au hasard, mais de retirer les cases de fuite.",
      ["Controle les cases autour du roi.", "Ajoute une piece avant de forcer.", "Verifie capture et interposition."]
    )
  ],
  queenMate: [
    card(
      "Verifier un mat",
      "Un mat existe seulement si le roi est en echec et n'a aucune reponse legale : pas de fuite, pas de capture de l'attaquant, pas de piece qui bloque la ligne.",
      ["Le roi est-il vraiment en echec ?", "Toutes les cases de fuite sont-elles controlees ?", "L'attaquant peut-il etre capture ou bloque ?"]
    ),
    card(
      "Dame et roi ensemble",
      "La dame reduit vite l'espace, mais elle a besoin du roi pour fermer les dernieres cases. Une methode mature consiste a repousser le roi adverse vers un bord, puis a rapprocher son roi.",
      ["Coupe une rangee ou une colonne.", "Garde la dame a distance de securite.", "Approche le roi avant le mat final."]
    ),
    card(
      "Eviter le pat",
      "Quand l'adversaire n'a presque plus de coups, le danger est de lui retirer toutes les cases sans lui donner echec. Avant un coup calme, verifie toujours si le camp adverse aura encore un coup legal.",
      ["Si ce n'est pas echec, verifie les coups adverses.", "Laisse une case jusqu'au moment final.", "Cherche le mat, pas seulement la domination."]
    )
  ],
  opening: [
    card(
      "Trois priorites",
      "Une ouverture saine poursuit trois buts simples : controler le centre, developper les pieces mineures et mettre le roi en securite. Ces idees reviennent dans les manuels de debutants comme dans les parties de maitres.",
      ["Centre.", "Developpement.", "Securite du roi."]
    ),
    card(
      "Gagner du temps",
      "Chaque coup doit ameliorer une piece ou creer une menace utile. Sortir la dame trop tot ou bouger plusieurs fois la meme piece donne souvent des tempos a l'adversaire.",
      ["Une piece mineure sortie vaut mieux qu'une dame chassee.", "Un coup de pion doit liberer ou controler.", "Un tempo perdu se paie quand le centre s'ouvre."]
    ),
    card(
      "Choisir un plan simple",
      "Apres les premiers coups, demande-toi de quel cote roquer, quelle colonne pourrait s'ouvrir et quelle piece est encore passive. C'est la transition naturelle vers le milieu de partie.",
      ["Quelle piece n'a pas encore joue ?", "Le roi peut-il roquer ?", "Quelle rupture centrale est possible ?"]
    )
  ],
  center: [
    card(
      "Petit centre",
      "Les cases d4, e4, d5 et e5 dirigent beaucoup de trajectoires. Les occuper ou les controler donne de l'espace et rend les pieces plus actives.",
      ["Compte les controles sur d4/e4/d5/e5.", "Un pion central ouvre aussi une diagonale.", "Contester le centre evite l'etouffement."]
    ),
    card(
      "Tenir, echanger ou pousser",
      "Face a une tension centrale, tu as trois familles de decisions : maintenir la pression, echanger pour ouvrir des lignes, ou pousser pour gagner de l'espace. Le bon choix depend des rois et des pieces.",
      ["Centre ouvert : securise ton roi.", "Centre ferme : prepare une rupture.", "Centre tendu : calcule les captures."]
    ),
    card(
      "Plan de milieu de partie",
      "Le centre indique souvent ou attaquer. Si l'adversaire attaque sur une aile, une reaction au centre peut etre la meilleure defense active.",
      ["Observe les ruptures de pions.", "Cherche la piece la moins active.", "Reponds a une attaque d'aile par le centre si possible."]
    )
  ],
  castle: [
    card(
      "Pourquoi roquer",
      "Le roque deplace le roi vers un abri et connecte une tour. Il n'est possible que si le roi et la tour n'ont pas bouge, si les cases sont libres et si le roi ne traverse aucune case controlee.",
      ["Le roi ne doit pas etre en echec.", "Les cases traversees ne sont pas attaquees.", "La tour rejoint plus vite le jeu."]
    ),
    card(
      "Bouclier de pions",
      "Apres le roque, les pions devant le roi forment un abri. Les pousser sans raison ouvre des lignes que l'adversaire peut utiliser pour attaquer.",
      ["Evite d'ouvrir ton roi gratuitement.", "Surveille les diagonales vers h7/h2 ou g7/g2.", "Une colonne ouverte pres du roi est une alerte."]
    ),
    card(
      "Roques opposes",
      "Quand les rois roquent de cotes opposes, la partie devient souvent une course. Les attaques de pions sur l'aile du roi adverse doivent etre rapides et calculees.",
      ["Ne perds pas de tempos.", "Ouvre des lignes contre le roi adverse.", "Garde ton centre assez stable."]
    )
  ],
  fork: [
    card(
      "Coups forcing",
      "Une combinaison commence par les coups qui obligent l'adversaire a repondre : echecs, captures et menaces directes. Cette discipline empeche de rever une attaque qui n'existe pas.",
      ["Echecs d'abord.", "Captures ensuite.", "Menaces claires en dernier."]
    ),
    card(
      "Attaque double",
      "Une fourchette ou attaque double vise deux cibles a la fois. Elle fonctionne mieux si l'une des deux cibles est le roi, car l'adversaire doit repondre a l'echec.",
      ["Cherche roi + dame.", "Cherche roi + tour.", "Verifie que la piece attaquante n'est pas perdue."]
    ),
    card(
      "Calculer la defense",
      "La bonne tactique survit a la meilleure defense adverse. Avant de jouer, demande-toi ce que l'adversaire ferait s'il voyait ton idee.",
      ["Quelle est sa reponse forcee ?", "Peut-il capturer ma piece ?", "Que reste-t-il apres les echanges ?"]
    )
  ],
  pin: [
    card(
      "Clouage",
      "Une piece est clouee lorsqu'elle ne peut pas bouger sans exposer une cible plus importante. Si la cible est le roi, le clouage est absolu : la piece n'a pas le droit de partir.",
      ["Identifie la piece clouee.", "Identifie la cible derriere.", "Ajoute de la pression avant de capturer."]
    ),
    card(
      "Transformer la pression",
      "Un clouage n'est pas toujours un gain immediat. Il peut servir a immobiliser une defense, gagner un tempo ou preparer une attaque sur le roi.",
      ["Maintiens la ligne ouverte.", "Attaque la piece clouee avec un pion si possible.", "Ne relache pas la pression trop vite."]
    ),
    card(
      "Sortir du clouage",
      "Pour se defendre, on peut bouger la cible, interposer une piece, chasser l'attaquant ou echanger. Connaitre les defenses rend tes attaques plus realistes.",
      ["Bouger la cible.", "Interposer.", "Chasser ou echanger l'attaquant."]
    )
  ],
  rookCheck: [
    card(
      "Colonnes ouvertes",
      "Une tour devient forte sur une colonne ouverte ou semi-ouverte. Elle peut attaquer les pions faibles, entrer sur la septieme rangee ou donner des echecs lateraux.",
      ["Cherche une colonne sans pion ami.", "Place la tour derriere les pions passes.", "La septieme rangee attaque souvent plusieurs cibles."]
    ),
    card(
      "Enfilade et ligne",
      "Sur une ligne ouverte, une piece de grande valeur peut etre forcee a partir et laisser une cible derriere elle. C'est le principe de l'enfilade.",
      ["Aligne roi, dame ou tour.", "Donne un echec si possible.", "Recupere la cible apres la fuite."]
    ),
    card(
      "Tour active en finale",
      "En finale, une tour passive defend peu et subit beaucoup. Les manuels de finales privilegient l'activite : echecs lateraux, attaque par l'arriere, pression sur les pions faibles.",
      ["Active avant de defendre passivement.", "Attaque les pions par l'arriere.", "Garde le roi adverse coupe."]
    )
  ],
  discovery: [
    card(
      "Ligne cachee",
      "Une attaque a la decouverte apparait quand une piece bouge et libere l'action d'une piece derriere elle. Si le coup donne echec ou menace une piece, l'effet peut etre decisif.",
      ["Quelle ligne est bloquee ?", "Quelle piece peut partir avec gain de temps ?", "La piece qui bouge cree-t-elle aussi une menace ?"]
    ),
    card(
      "Sacrifice utile",
      "Un sacrifice mature n'est pas spectaculaire par decoration. Il ouvre une ligne, attire une piece, detruit un bouclier ou gagne un tempo force.",
      ["Quelle ligne s'ouvre ?", "Quelle reponse est forcee ?", "Quel est le gain final ?"]
    ),
    card(
      "Initiative",
      "L'initiative signifie que l'adversaire repond a tes menaces au lieu d'executer son plan. Une combinaison reussie conserve cette initiative coup apres coup.",
      ["Menace plus forte que la sienne.", "Coups avec tempo.", "Pas de pause inutile dans l'attaque."]
    )
  ],
  defender: [
    card(
      "Defenseur cle",
      "Beaucoup de positions tiennent grace a une seule piece : celle qui garde une case de mat, protege une piece importante ou bloque une ligne.",
      ["Qui defend la cible ?", "Que se passe-t-il si ce defenseur part ?", "Peut-on le capturer, le devier ou l'attirer ?"]
    ),
    card(
      "Deviation",
      "La deviation force une piece a quitter sa mission. Souvent, on lui donne une capture tentante ou une menace plus urgente pour l'eloigner de la vraie cible.",
      ["Nomme la mission defensive.", "Force le defenseur a repondre.", "Joue le coup decisif apres son depart."]
    ),
    card(
      "Defendre activement",
      "Quand tu subis une attaque, ne cherche pas seulement a survivre. Liste captures, fuites, blocages et contre-menaces : une defense active peut retourner la partie.",
      ["Capture l'attaquant si legal.", "Fuis vers une case sure.", "Contre-attaque une cible plus forte."]
    )
  ],
  pawnEndgame: [
    card(
      "Roi actif",
      "En finale, le roi devient une piece d'attaque. Il doit approcher le centre, soutenir les pions et contester les cases importantes.",
      ["Centralise le roi.", "Ne pousse pas avant d'avoir le soutien.", "Coupe le roi adverse si possible."]
    ),
    card(
      "Opposition et cases cle",
      "L'opposition est une lutte de tempos entre rois. Celui qui force l'autre a ceder une case importante peut promouvoir un pion ou bloquer la promotion adverse.",
      ["Les rois se font face.", "Le trait compte enormement.", "Cherche la case cle avant de pousser."]
    ),
    card(
      "Pion passe",
      "Un pion passe n'a plus de pion adverse devant lui ni sur les colonnes voisines. Il attire les pieces ennemies et peut devenir une dame s'il est accompagne.",
      ["Verifie le carre du pion.", "Soutiens-le par le roi ou une tour.", "Pousse le pion libre au bon moment."]
    )
  ],
  blackDefense: [
    card(
      "Repondre a l'echec",
      "Quand ton roi est attaque, tu dois repondre tout de suite. Les trois familles de defense sont fuir, capturer l'attaquant ou interposer une piece sur la ligne d'attaque.",
      ["Fuite.", "Capture.", "Interposition."]
    ),
    card(
      "Pat et mat",
      "Un roi sans coup legal n'est pas toujours mat. S'il est en echec, c'est mat. S'il n'est pas en echec, c'est pat et la partie est nulle.",
      ["Roi en echec + aucune defense = mat.", "Pas d'echec + aucun coup legal = pat.", "Toujours verifier avant de conclure."]
    ),
    card(
      "Defense pratique",
      "Une defense robuste commence par les menaces adverses, puis cherche le coup qui resout le plus de problemes : securite du roi, piece attaquee et menace future.",
      ["Quelle est la menace directe ?", "Mon roi sera-t-il sur apres le coup ?", "Puis-je creer une contre-menace ?"]
    )
  ]
} satisfies Record<keyof typeof patterns, TheoryCardSpec[]>;

const theoryBySlug: Record<string, TheoryCardSpec[]> = {
  "echiquier-pieces": [
    card(
      "Le but du jeu",
      "Une partie oppose les Blancs et les Noirs. Le but n'est pas de capturer toutes les pieces : il faut attaquer le roi adverse de facon qu'aucune reponse legale ne le sauve. C'est l'echec et mat.",
      ["Le roi ne se capture pas en pratique.", "Un echec oblige une reponse immediate.", "Le mat termine la partie."]
    ),
    card(
      "L'echiquier",
      "Le plateau compte 64 cases, huit colonnes de a a h et huit rangees de 1 a 8. Savoir nommer e4, d5 ou h7 permet de comprendre les cours, les exercices et les parties commentees.",
      ["Colonnes : lettres.", "Rangees : chiffres.", "Case = lettre + chiffre."]
    ),
    card(
      "Les forces",
      "Chaque camp commence avec un roi, une dame, deux tours, deux fous, deux cavaliers et huit pions. Les valeurs aident a evaluer les echanges : dame 9, tour 5, fou et cavalier 3, pion 1.",
      ["Dame : mobilite maximale.", "Tours : lignes droites.", "Fous et cavaliers : pieces mineures.", "Pions : petits mais promoteurs."]
    ),
    card(
      "Role de chaque piece",
      "Le roi doit etre protege au debut puis devenir actif en finale. La dame et les tours exploitent les lignes ouvertes. Les fous et cavaliers controlent des cases cles. Les pions dessinent la structure durable de la partie.",
      ["Protege le roi.", "Active les pieces lourdes.", "Respecte la structure de pions."]
    )
  ],
  "mouvements-pieces": [
    card(
      "Pieces de ligne",
      "La tour va horizontalement ou verticalement. Le fou va en diagonale. La dame combine les deux. Ces pieces ne sautent pas : une piece placee sur leur ligne bloque le trajet.",
      ["Tour : colonnes et rangees.", "Fou : diagonales.", "Dame : lignes + diagonales."]
    ),
    card(
      "Pieces courtes",
      "Le roi se deplace d'une case et ne peut jamais aller sur une case attaquee. Le cavalier saute en L. Le pion avance droit, capture en diagonale et demande une attention speciale car il ne recule jamais.",
      ["Roi : une case sure.", "Cavalier : saut en L.", "Pion : avance droit, capture en diagonale."]
    ),
    card(
      "Deplacement et capture",
      "La plupart des pieces capturent comme elles se deplacent, sauf le pion. Une capture est possible seulement si la case d'arrivee contient une piece adverse et si ton roi reste en securite.",
      ["Le pion capture autrement.", "On ne capture pas ses pieces.", "Un coup illegal expose le roi."]
    ),
    card(
      "Exercice mental",
      "Avant de cliquer une piece, annonce toutes ses cases legales. Puis verifie sur l'echiquier si une piece bloque le trajet ou si le roi resterait en danger.",
      ["Nomme les cases.", "Verifie les blocages.", "Verifie la securite du roi."]
    )
  ],
  "regles-speciales": [
    card(
      "Le roque",
      "Le roque est le seul coup qui deplace deux pieces : le roi avance de deux cases vers la tour, puis la tour passe de l'autre cote. Il sert a mettre le roi a l'abri et a activer une tour.",
      ["Roi et tour jamais bouges.", "Aucune piece entre eux.", "Aucune case du roi sous controle."]
    ),
    card(
      "La promotion",
      "Un pion qui atteint la derniere rangee devient dame, tour, fou ou cavalier. La dame est souvent choisie, mais une sous-promotion en cavalier peut parfois donner une fourchette ou eviter le pat.",
      ["Dame par defaut.", "Cavalier pour une tactique.", "Attention au pat."]
    ),
    card(
      "La prise en passant",
      "Un pion peut capturer en passant juste apres qu'un pion adverse a avance de deux cases a cote de lui. Il le capture comme s'il n'avait avance que d'une case.",
      ["Seulement entre pions.", "Seulement au coup suivant.", "La capture arrive en diagonale."]
    ),
    card(
      "Quand les utiliser",
      "Ces regles ne sont pas des details : elles changent les plans. Le roque influence la securite, la promotion decide les finales, et la prise en passant modifie les structures de pions.",
      ["Roque : securite.", "Promotion : conversion.", "En passant : structure."]
    )
  ],
  "vie-du-roi": [
    card(
      "Le roi est unique",
      "Le roi vaut la partie. Il peut capturer et se deplacer, mais jamais entrer volontairement en echec. Deux rois ne peuvent donc jamais se toucher.",
      ["Le roi ne va pas sur une case controlee.", "Deux rois ne sont jamais adjacents.", "Un coup qui laisse le roi en echec est illegal."]
    ),
    card(
      "Trois defenses contre l'echec",
      "Quand le roi est en echec, il faut choisir une reponse legale : deplacer le roi, capturer la piece attaquante ou bloquer la ligne d'attaque si l'echec vient d'une piece de ligne.",
      ["Fuir.", "Capturer.", "Interposer."]
    ),
    card(
      "Du roi fragile au roi actif",
      "Au debut, le roi doit rester protege. En finale, avec moins de pieces dangereuses, il devient une force active qui aide les pions et chasse le roi adverse.",
      ["Ouverture : securite.", "Milieu : eviter les lignes ouvertes.", "Finale : centraliser."]
    )
  ],
  "schemas-mat": [
    card(
      "Familles de mats",
      "Les mats se repetent en formes reconnaissables : roi bloque par ses pieces, ligne ouverte pour une tour, diagonale controlee par un fou, cavalier qui retire les cases de fuite.",
      ["Roi bloque.", "Piece attaquante.", "Cases de fuite controlees."]
    ),
    card(
      "Construire le filet",
      "Un filet de mat se construit souvent avant l'echec final. On limite les cases, on chasse les defenseurs, puis on donne le coup force.",
      ["Limiter.", "Chasser le defenseur.", "Donner l'echec final."]
    ),
    card(
      "Ne pas se precipiter",
      "Si le mat n'est pas immediat, cherche le coup qui empeche le roi de s'echapper. Les echecs inutiles peuvent aider le roi adverse a fuir.",
      ["Calcule les fuites.", "Garde les pieces coordonnees.", "Choisis le coup le plus force."]
    )
  ],
  "fin-partie-resultats": [
    card(
      "Resultats possibles",
      "Une partie peut finir par mat, abandon, temps, accord de nulle, repetition, regle des cinquante coups, manque de materiel ou pat. Connaitre ces cas evite de transformer une victoire en nulle.",
      ["Mat : victoire.", "Pat : nulle.", "Repetition ou perpetuel : nulle."]
    ),
    card(
      "Pat contre mat",
      "La question decisive est simple : le roi est-il en echec ? S'il n'est pas en echec et n'a aucun coup legal, ce n'est pas une victoire mais une nulle par pat.",
      ["Verifier l'echec.", "Verifier les coups legaux.", "Garder une menace claire."]
    ),
    card(
      "Convertir sans donner de nulle",
      "Quand tu as l'avantage, simplifie avec soin, active ton roi et garde assez de materiel pour mater ou promouvoir. Ne chasse pas toutes les cases du roi adverse sans echec.",
      ["Simplifier si tu gagnes.", "Eviter le pat.", "Garder un plan de conversion."]
    )
  ],
  "structures-pions": [
    card(
      "La structure raconte le plan",
      "Les pions avancent lentement et ne reculent jamais. Leur forme indique les cases faibles, les colonnes ouvertes, les leviers possibles et les finales probables.",
      ["Pions lies : force durable.", "Pions faibles : cibles.", "Leviers : ouverture des lignes."]
    ),
    card(
      "Faiblesses durables",
      "Un pion isole, double ou arriere devient souvent une cible. L'objectif n'est pas seulement de gagner un pion, mais de forcer l'adversaire a defendre passivement.",
      ["Isole.", "Double.", "Arriere."]
    ),
    card(
      "Levier et rupture",
      "Un levier est le contact entre deux pions adverses. Bien prepare, il ouvre une colonne, attaque une chaine ou demolit un abri de roi.",
      ["Prepare avec des pieces.", "Ouvre du bon cote.", "Calcule les captures."]
    )
  ],
  "initiation-finales": [
    card(
      "Changer de priorites",
      "En finale, la valeur d'un tempo augmente. Le roi devient actif, les pions passes prennent de l'importance et chaque echange doit etre juge par le resultat final.",
      ["Roi actif.", "Pion passe.", "Calcul precis."]
    ),
    card(
      "Convertir un avantage",
      "Si tu as un pion de plus, echange souvent les pieces mais pas tous les pions. Si tu as un pion de moins, cherche l'activite, le contre-jeu et les ressources de nulle.",
      ["Avantage : simplifier les pieces.", "Defense : garder du contre-jeu.", "Toujours verifier le pat."]
    ),
    card(
      "Roi devant le pion",
      "Dans beaucoup de finales de pions, le roi doit preceder son pion. Pousser trop vite donne au roi adverse le temps de bloquer.",
      ["Roi devant.", "Pion soutenu.", "Case de promotion visualisee."]
    )
  ],
  "finales-tours": [
    card(
      "La tour veut etre active",
      "Les finales de tours sont les plus frequentes. La tour doit attaquer de loin, couper le roi adverse et se placer derriere les pions passes, les siens comme ceux de l'adversaire.",
      ["Tour derriere le pion.", "Echecs lateraux.", "Roi coupe."]
    ),
    card(
      "Defense passive ou active",
      "Defendre un pion en restant colle a lui rend souvent la tour inutile. Une defense active attaque les pions adverses ou donne des echecs au roi expose.",
      ["Attaque les pions faibles.", "Garde la distance.", "Ne bloque pas ton roi."]
    ),
    card(
      "Progression du pion",
      "Avant de pousser un pion passe, verifie si la tour soutient l'avance et si le roi adverse peut etre coupe. Le mauvais tempo peut retourner l'evaluation.",
      ["Soutien par derriere.", "Roi adverse coupe.", "Echecs adverses controles."]
    )
  ],
  "modele-serie-sacrifices": [
    card(
      "Sacrifices en chaine",
      "Dans une partie modele, plusieurs sacrifices ne sont pas des idees separees. Ils forment une route forcee : ouvrir, attirer, eliminer, puis conclure.",
      ["Ouvrir une ligne.", "Attirer le roi.", "Eliminer le defenseur.", "Conclure."]
    ),
    card(
      "Verifier la derniere defense",
      "Le sacrifice echoue souvent non pas au premier coup, mais a la derniere ressource adverse. Avant de jouer, calcule la meilleure defense jusqu'a une position claire.",
      ["Pas seulement le premier coup.", "Cherche l'interposition.", "Cherche le retour de materiel."]
    ),
    card(
      "Initiative contre materiel",
      "Le materiel donne une evaluation statique, l'initiative donne le temps. Un sacrifice est correct si le temps gagne produit mat, recuperation decisive ou avantage durable.",
      ["Mat.", "Gain force.", "Avantage positionnel durable."]
    )
  ],
  "modele-gambit-secret": [
    card(
      "Ce qu'achete un gambit",
      "Un gambit offre du materiel pour acheter autre chose : developpement, lignes ouvertes, roi adverse expose ou controle du centre.",
      ["Temps.", "Lignes.", "Cibles."]
    ),
    card(
      "Accepter ou refuser",
      "Accepter un gambit demande de finir son developpement rapidement. Refuser peut etre bon si tu gardes le centre et ne laisses pas l'adversaire obtenir l'initiative gratuitement.",
      ["Si tu prends, developpe-toi.", "Si tu refuses, garde le centre.", "Ne collectionne pas les pions."]
    ),
    card(
      "Plan avant variante",
      "Connaitre un gambit ne signifie pas memoriser des coups au hasard. Il faut connaitre les cases des pieces, les ruptures et les dangers typiques.",
      ["Cases naturelles.", "Ruptures centrales.", "Menaces sur le roi."]
    )
  ]
};

const checklistByPattern = {
  board: ["Ai-je repere le trait et les coordonnees utiles ?", "Quelle piece peut legalement agir ?", "Quelle ligne, colonne ou diagonale est ouverte ?", "Mon roi reste-t-il en securite ?", "Puis-je expliquer le coup avec une case de depart et une case d'arrivee ?"],
  knight: ["Le cavalier a-t-il une case centrale ?", "Attaque-t-il deux cibles ?", "Peut-il etre capture apres son saut ?", "La case d'arrivee est-elle protegee ?", "Est-il au bord sans necessite ?"],
  bishop: ["La diagonale est-elle libre ?", "Mes pions bloquent-ils mon fou ?", "Le fou attaque-t-il une cible concrete ?", "Le fou travaille-t-il avec une autre piece ?", "L'echange ameliore-t-il ma structure ?"],
  queenMate: ["Le roi adverse est-il en echec ?", "Toutes les fuites sont-elles controlees ?", "L'attaquant peut-il etre capture ?", "Une interposition est-elle possible ?", "Y a-t-il un risque de pat si je differe le mat ?"],
  opening: ["Ai-je controle le centre ?", "Ai-je developpe une piece mineure utile ?", "Mon roi peut-il roquer ?", "Ai-je evite de sortir la dame trop tot ?", "Le coup cree-t-il un plan pour la suite ?"],
  center: ["Qui controle d4, e4, d5 et e5 ?", "Le centre est-il ouvert, ferme ou tendu ?", "Quel pion peut servir de rupture ?", "Quel roi serait expose si le centre s'ouvre ?", "Quelle piece manque d'activite ?"],
  castle: ["Le roque est-il legal ?", "Les cases traversees par le roi sont-elles sures ?", "Le bouclier de pions est-il intact ?", "Une colonne s'ouvre-t-elle pres de mon roi ?", "Le roque choisi correspond-il au plan ?"],
  fork: ["Ai-je liste les echecs ?", "Ai-je liste les captures ?", "La tactique attaque-t-elle deux cibles ?", "Quelle est la meilleure defense adverse ?", "Le resultat final gagne-t-il quelque chose de concret ?"],
  pin: ["Quelle piece est clouee ?", "Quelle cible se trouve derriere ?", "Puis-je augmenter la pression ?", "L'adversaire peut-il casser le clouage ?", "Le clouage mene-t-il a un gain ou a une attaque ?"],
  rookCheck: ["Quelle colonne est ouverte ou semi-ouverte ?", "La tour peut-elle entrer dans le camp adverse ?", "Les echecs sont-ils utiles ou seulement repetitifs ?", "La tour est-elle derriere un pion passe ?", "Le roi adverse peut-il etre coupe ?"],
  discovery: ["Quelle ligne est cachee ?", "La piece qui bouge gagne-t-elle un tempo ?", "Le sacrifice ouvre-t-il une ligne ?", "La suite reste-t-elle forcee ?", "L'initiative continue-t-elle apres le coup ?"],
  defender: ["Quelle piece defend la cible ?", "Puis-je la capturer, devier ou attirer ?", "La cible devient-elle vulnerable ensuite ?", "Ai-je vu la meilleure defense adverse ?", "Mon propre roi reste-t-il protege ?"],
  pawnEndgame: ["Mon roi est-il actif ?", "Quel pion peut devenir passe ?", "Ai-je calcule le carre du pion ?", "Qui a l'opposition ?", "Dois-je pousser le pion ou ameliorer le roi ?"],
  blackDefense: ["Suis-je en echec ?", "Puis-je fuir, capturer ou interposer ?", "Le coup cree-t-il un pat ou un mat ?", "Quelle est la menace adverse principale ?", "Puis-je defendre avec une contre-menace ?"]
} satisfies Record<keyof typeof patterns, string[]>;

const masteryByPattern = {
  board: ["Je nomme rapidement les cases importantes.", "Je distingue ligne, colonne, diagonale et rangee.", "Je peux expliquer la valeur relative des pieces.", "Je joue uniquement des coups legaux qui respectent mon roi."],
  knight: ["Je visualise les sauts du cavalier sans indice.", "Je reconnais une fourchette potentielle.", "Je sais pourquoi le centre augmente sa force.", "Je peux evaluer si sa case est stable."],
  bishop: ["Je trace les diagonales completes.", "Je distingue un fou actif d'un fou enferme.", "Je coordonne fou et pieces lourdes.", "Je sais quand ouvrir une diagonale."],
  queenMate: ["Je verifie les quatre conditions du mat.", "Je reduis l'espace avec dame et roi.", "J'evite les pats dans les positions gagnees.", "Je conclus seulement quand le roi n'a plus de defense."],
  opening: ["Je developpe avec centre et roi en tete.", "Je comprends pourquoi un tempo compte.", "Je sais choisir une case naturelle pour chaque piece.", "Je passe de l'ouverture a un plan simple."],
  center: ["J'evalue le type de centre.", "Je choisis entre tenir, echanger ou pousser.", "Je sais quand reagir au centre.", "Je relie centre et securite du roi."],
  castle: ["Je connais les conditions du roque.", "Je protege mon bouclier de pions.", "Je detecte les lignes dangereuses vers mon roi.", "Je comprends les roques opposes."],
  fork: ["Je liste les coups forcing dans l'ordre.", "Je repere les attaques doubles.", "Je calcule la defense adverse.", "Je ne joue une combinaison que si le gain est clair."],
  pin: ["Je nomme la piece clouee et la cible.", "Je sais renforcer un clouage.", "Je connais les defenses contre le clouage.", "Je transforme la pression en gain ou en attaque."],
  rookCheck: ["Je place les tours sur les bonnes lignes.", "Je utilise les colonnes ouvertes.", "Je comprends les echecs lateraux.", "Je sais activer la tour en finale."],
  discovery: ["Je repere les lignes cachees.", "Je combine decouverte et tempo.", "Je sais evaluer un sacrifice.", "Je conserve l'initiative dans la variante."],
  defender: ["Je trouve le defenseur cle.", "Je choisis entre capture, deviation et attraction.", "Je sais defendre activement.", "Je verifie mon roi avant de forcer."],
  pawnEndgame: ["Je centralise le roi.", "Je comprends opposition et cases cles.", "Je calcule les courses de pions.", "Je convertis un pion passe avec methode."],
  blackDefense: ["Je distingue echec, mat et pat.", "Je trouve les defenses legales.", "Je sais creer une contre-menace.", "Je transforme une position defendue en plan jouable."]
} satisfies Record<keyof typeof patterns, string[]>;

function makeLesson(spec: LessonSpec) {
  const pattern = patterns[spec.pattern];
  const depth = spec.depth ?? "Passez de l'observation au calcul : reperez la cible, listez les coups forcing, puis choisissez le coup qui laisse le moins de ressources a l'adversaire.";
  const sourceTheoryCards = theoryBySlug[spec.slug] ?? theoryByPattern[spec.pattern];
  const mistakeLesson = `${spec.commonMistake} Pour la corriger, reviens a la position, nomme la menace adverse, puis applique la checklist avant de choisir ton coup.`;
  const theoryCards = [
    ...sourceTheoryCards,
    card("Application dans cette lecon", `${spec.focus} ${depth}`, ["Reformule l'objectif.", "Observe l'exemple sur l'echiquier.", "Joue ensuite le coup cle sans indice."]),
    card("Erreur a neutraliser", mistakeLesson, ["Ralentis si cette erreur apparait.", "Reviens aux coups forcing.", "Verifie la meilleure defense adverse."])
  ];
  const checklist = checklistByPattern[spec.pattern];
  const mastery = masteryByPattern[spec.pattern];

  return {
    slug: spec.slug,
    title: tr(spec.title),
    objective: tr(spec.objective),
    xpReward: spec.xp ?? 35,
    content: {
      startFen: pattern.fen,
      summary: tr(`${spec.focus} ${depth}`),
      mistake: tr(spec.commonMistake),
      method: tr(`Methode en quatre temps : 1. nommer le theme, 2. verifier la securite du roi, 3. calculer echecs, captures et menaces, 4. comparer le resultat final avec la position de depart.`),
      theoryCards: theoryCards.map((item) => ({
        title: tr(item.title),
        body: tr(item.body),
        plan: (item.plan ?? []).map(tr)
      })),
      checklist: checklist.map(tr),
      training: {
        prompt: tr(`Avant de jouer ${pattern.solution}, expliquez mentalement pourquoi les autres coups candidats sont moins precis.`),
        target: tr(`Objectif de maitrise : reconnaitre "${spec.title}" dans une vraie partie sans indice.`),
        repeat: tr("Recommencez la position jusqu'a pouvoir annoncer le theme, le coup et la menace suivante en moins de trente secondes.")
      },
      mastery: mastery.map(tr),
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
