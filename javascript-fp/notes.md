# La programmation fonctionnelle dans l'écosystème JavaScript

Cet article tentera de rappeler les principes et les avantages du paradigme fonctionnel puis apportera des éléments d'application de ce dernier à l'écosystème JavaScript.

Sauf indication contraire, **tout les exemples de code présentés seront rédigés en TypeScript.**

## I - Le paradigme fonctionnel

Le paradigme fonctionnel est un paradigme de programmation de type **déclaratif**. En programmation déclarative, les composants logiciels utilisés par un programme sont **indépendants les uns des autres**, ne comportent **aucun contexte interne**, et sont **purs**.

En programmation fonctionnelle, ces composants sont des **fonctions mathématiques**.

### I.1 - Les principes de la programmation fonctionnelle

La programmation fonctionnelle repose sur certaines règles:

- _Separation Of Concerns_: **les données et leurs structures doivent être séparées de la logique**. Une classe (ou un _type_ comme on préferera les utiliser en programmation fonctionnelle) ne doit servir uniquement qu'à la représentation d'une donnée. Les traitements réalisés sur de telles données sont réservés à des fonctions pures. En suivant la même logique, **une fonction doit être responsable d'une et une seule tâche**.
- _Pureté_: **une fonction doit être pure**: on dit qu'une fonction est pure si cette dernière est déterministe (sa valeur de retour sera toujours la même pour des mêmes arguments), et ne fait appel à aucun effet de bord (appels API, I/O, aléatoire, manipulation de DOM...). En toute logique, une telle fonction ne doit pas elle même utiliser des fonctions impures.
- _Immutabilité_: **une donnée ne doit pas être réassignée**. Une fonction ne doit donc en aucun cas effectuer de mutation un argument qui lui a été passé en paramètre. Quand c'est nécessaire, une telle fonction doit plutôt créer une nouvelle copie modifiée de cette donnée, ou utiliser la récursivité. Certains langages fonctionnels, dits **fonctionnels impurs**, autorisent les mutations locales au scope des fonctions.

La programmation fonctionnelle introduit et utilise aussi un certain nombres de principes et de design patterns (liste non exhaustive):

- _Fonctions d'Ordre Supérieur (HOC)_
- _Récursivité_
- _'Chaining' d'opérations_
- _Composition de fonctions_
- _Transparence Référentielle_
- _Curification_
- _Monades (😱)_
- ...

### I.2 - Les avantages de la programmation fonctionnelle

Du fait que la programmation fonctionnelle soit assez stricte et peu permissive, il découle un certain nombre de bienfaits pour celui qui l'utilise et pour le code qu'il produit:

- _Testabilité_: les fonctions étant pures, elles sont facilement testables unitairement et fonctionnellement
- _Découpage implicite du code_: la pureté des fonctions et les principe de récursivité, de currification et de transparence réferentielle (_et caetera_) crée un découpage implicite du code. Celui-ci peut donc facilement être répartit entre plusieurs fichiers
- _Réutilisabilité_: chaque fonction pure peut être facilement réutilisée partout au sein d'un même programme ou même partagé entre plusieurs programmes
- _Séparation of Concerns by Design_: la séparation des préoccupations est un des principes fondamentaux de conception informatique. En programmation fonctionnelle, le code est implicitement découpé et respecte donc ce principe
- _Facilité d'abstraction_: grâce aux principes de _Transparence Référentielle_, de _Curification_ et d'_Application partielle_, une fonction peut facilement être étendue ou détournée sans duplication de code

### I.3 - Gestions des effets de bord en programmation fonctionnelle

Malgrès ce qui peut être dicté par le paradigme fonctionnel, les programmes informatiques **ont besoin** d'utiliser des effets de bord, sans quoi leurs utilisations seraient très limitées. Il existe cependant des moyens de réduire la dépendance forte qui existe entre un programme et ses effets de bord, et de maintenir au maximum la pureté des fonctions qui le composent.

**Admettons par exemple** que nous souhaitons écrire un programme permettant de récupérer la température actuelle à Bordeaux via les services de OpenWeather, de convertir celle-ci en degrés Celsius, de multiplier la valeur obtenue par un nombre aléatoire, et enfin d'écrire cette toute dernière valeur dans un fichier texte présent sur notre disque.

On peut dors et déjà distinguer les opérations _pures_ des opérations dîtes _impures_:

- récupération de la température actuelle: implique un appel (asynchrone) à une API externe et est donc **impure**
- conversion en degrés Celsius: aucun effet de bord et donc **pure**
- multiplier la valeur obtenue par un nombre aléatoire: implique l'utilisation d'un générateur de nombres aléatoires, et est donc **impure**
- écrire cette toute dernière valeur dans un fichier: **impure**

Étant donné la faible complexité de notre programme, on pourrait être tentés d'écrire une seule et même fonction afin de réaliser ces 4 tâches. Cependant, **cette fonction produisant des effets de bord serait par définition elle même impure**, et deviendrais ainsi difficile à tester, et nous perdrions de plus tout l'intêret de la programmation fonctionelle.

Si l'on se résout donc au fait qu'une partie des opérations de notre programme sera innévitablement impure et que l'on tente d'appliquer les principes de la programmation fonctionnelle évoqués précedemment, **une bonne pratique serait de d'isoler les fonctions impures en découpant au maximum les opérations de notre programme en fonctions indépendantes**:

```typescript
const fetch = require("node-fetch");
const fs = require("fs");
const { compose } = require("lodash/fp");

/** Impure (effets de bord & asynchrone) */
const fetchBordeauxTemperatureFromOW = async (): number => {
  const response = await fetch(
    "api.openweathermap.org/data/2.5/weather?q=Bordeaux"
  );
  const data = await response.json();
  return data.main.temp;
};

/** Pure (deterministe et sans effets de bord) */
const convertFahrenheitToCelcius = (farTemp: number): number =>
  (farTemp - 32) / 1.8;

/** Impure (appel à fonction aléatoire) */
const multiplyByRandom = (n: number): number => n * Math.Random();

/** Impure (écriture de fichier) */
const writeToTextFile = (n: number): void => fs.writeFileSync("file.txt", n);

/**
 * https://lodash.com/docs/4.17.15#flowRight
 */
return compose(
  writeToTextFile,
  multiplyByRandom,
  convertFahrenheitToCelcius,
  fetchBordeauxTemperatureFromOW
)();
```

Grâce au découpage et à l'isolation effectués, les fonctions pures (comme `convertFahrenheitToCelcius`) peuvent être facilement testées car utilisables unitairement et indépendemment des fonctions impures.

De plus, en utilisant le principe de _Fonctions d'Ordre Supérieur_ ou _Higher-order Functions (HOC)_ évoqué précedemment, **une autre fonction, impure, peut être rendue testable tout en conservant son utilisation d'un effet de bord: `multiplyByRandom`. Il suffit pour celà de lui permettre d'accepter un deuxième paramètre optionnel qui serait la fonction de génération aléatoire qu'elle utilise**:

```typescript
const multiplyByRandom = (
  n: number,
  rand: () => number = Math.Random
): number => n * rand();
```

```typescript
// tests.ts

test("multiplyByRandom", () => {
  expect(multiplyByRandom(20, () => 0.5)).toBe(10);
});
```

Remarque: une modification similaire pourrait être effectuée sur la fonction `fetchBordeauxTemperatureFromOW` en lui permettant d'accepter un deuxième paramètre qui serait la fonction utilisée afin de récupérer les données de températures. Celà permettrai là aussi de rendre cette fonction testable en mockant l'appel HTTP.

> ℹ️ - Certains langages fonctionnels typés, comme Haskell, sont intransigeants avec les effets de bord, et proposent donc des structures spécifiques appelées **monades** afin d'en permettre l'utilisation. Cependant, les monades sont un principe assez vaste et complexe mathématiquement que nous ne traiterons pas ici.

---

## II - Application à JavaScript

JavaScript est un langage multi-paradigmes, faiblement et dynamiquement typé, majoritairement utilisé dans la création de sites et d'applications web. De par son utilisation principale au travers de navigateurs web, c'est un langage très fortement lié aux effets de bords (manipulation de DOM, appels HTTP, tâches asynchrones...). Cependant, malgrès qu'il soit très permissif et très peu strict comparé aux langages de paradigme fonctionnels classiques, **JavaScript EST, entre autres choses, un langage fonctionnel**. Un certain nombres d'outils et de règles peuvent être mises en place autour de celui-ci afin de suivre au mieux les principes de programmation fonctionnelle.

⚠️ - Il est important de rappeller qu'il peut être **compliqué et innutilement coûteux d'essayer de faire en sorte que votre code suive sans concessions le paradigme fonctionnel.** La programmation fonctionnelle peut s'avérer très utile dans le cadre du développement d'algorithmes nécessitant peu d'effets de bords, **mais peut ne pas être indispensable dans d'autres cas: elle n'est donc pas à utiliser aveuglément.**

> ℹ️ - Certains langages comme ReasonML ou ELM proposent une syntaxe similaire à celles de langages fonctionnels classiques (comme OCaml ou Haskell) et visent à être compilés en JavaScript. Nous n'aborderons pas ces solutions ici.

### II.1 - Quelques principes et règles

#### _Limiter les assignations et les mutations_

Afin d'éviter l'utilisation inutile de contexte interne aux fonctions, si c'est possible, les assignations de variables doivent être évitées. Si au cours du développement d'une fonction il vous apparait qu'une assignation intermédiaire de variable est nécessaire, **étudiez plutôt la possibilité de découper votre fonction en plusieurs fonctions indépendantes, et plus petites**.

> ℹ️ - **Bien sur, certains algorithmes nécessitent des variables intermédiaires, c'est inévitable**. Dans de tels cas, il faut essayer de limiter au maximum la portée (le _scope_) de telles variables. Une assignation ou une mutation locale au scope d'une fonction n'impacte pas sa réutilisabilité ou sa testabilité.

Prenons l'exemple trivial d'une fonction qui calcule une moyenne pour un tableau de notes (sur une échelle de 20) donné, et renvoie cette moyenne rapportée à une échelle de 10:

```typescript
const averageMarkOutOfTen = (marks: Array<number>): number => {
  const avg = marks.reduce((acc, cur) => acc + cur, 0) / marks.length;
  return (avg * 10) / 20;
};
```

> ℹ️ - On peut noter l'utilisation de Array.reduce, qui en plus d'éviter l'utilisation d'une boucle, évite une assignation.

Dans le précédent exemple, la variable intérmédiaire `avg` peut être éludée de différentes manières:

- soit en réduisant à une seule ligne la totalité des opérations (_ce qui rendrait le code peu lisible et difficilement réutilisable_):

```typescript
const averageMarkOutOfTen = (marks: Array<number>): number => {
  return ((marks.reduce((acc, cur) => acc + cur, 0) / marks.length) * 10) / 20;
};
```

- soit en découpant cette fonction en deux fonctions distinctes (_l'une qui calcule la moyenne, l'autre qui rapporte cette moyenne sur une échelle donnée_):

```typescript
// fonction de calcul de moyenne
const average = (array: Array<number>): number =>
  array.reduce((acc, cur) => acc + cur, 0) / array.length;

// fonction de produit en croix
const ratio = (n: number, actualScale: number, targetScale: number): number =>
  (n * targetScale) / actualScale;

const averageMarkOutOfTen = (marks: Array<number>): number =>
  ratio(average(marks));
```

Grâce à cette dernière solution, aucune variable intermédiaire n'est nécessaire, le code est devenu plus facilement testable unitairement, et surtout **plus facilement réutilisable**, comme nous le verrons par la suite, grâce à la _Curification_ et à l'_Application partielle_.

Afin de limiter la possibilité de créer des mutations, **l'utilisation du mot clé `const` s'avère très efficace**, même dans la création de fonctions, où la notation 'fat arrow' peut être priviliégiée par rapport au mot clé `function`.

#### _Privilégier la composition (ou le pipelining) et l'unarité_

Dans le but de préserver l'immutabilité et de limiter l'utilisation de variables intermédiaires, un bon principe et **d'utiliser la composition de fonctions ou le pipelining** (qui est le même principe, utilisé dans le sens inverse). Ce principe reviens à faire implicitement passer le résultat d'appel d'une fonction directement dans la fonction suivante, sans utiliser de variable de stockage intermédiaire:

Ainsi, si on souhaite écrire un programme permettant de vérifier que la racine carrée du double d'un chiffre donné est paire, au lieu d'écrire quelque chose de la sorte...

```typescript
const double = (n: number): number => n * 2;

const sqrt = (n: number): number => Math.sqrt(n);

const isPair = (n: number): boolean => n % 2 === 0;

// cet appel est peu lisible
return isPair(sqrt(double(8)));
```

...on pourrait utiliser les fonctions `_.compose` ou `_.pipe` de la libraire **lodash/fp**, qui permettent d'effectuer l'appel de la dernière ligne comme suit:

```typescript
const { compose, pipe } = require("lodash/fp");

// en utilisant _.compose, qui se lit de gauche à droite, mais est éxécuté de droite à gauche
return compose(isPair, sqrt, double)(8);

// en utilisant _.pipe, qui se lit de droite à gauche, mais est éxécuté de gauche à droite
return pipe(double, sqrt, isPair)(8);
```

Cependant, une fonction ne retournant qu'une seule et unique valeur en JavaScript (comme dans les langages fonctionnels classiques), la composition ou le pipelining ne peuvent être utilisés que sur des fonctions **unaires** (n'acceptant qu'un unique argument). Ainsi, afin de pouvoir utiliser au mieux la composition de fonctions, **il convient d'essayer de maintenir au maximum une faible arité sur les fonctions**.

Néanmoins, certaines fonctions sont inévitablement d'arité supérieure à 1. La programmation fonctionnelle propose plusieurs outils afin de pouvoir réutiliser de telles fonctions et de pouvoir les utiliser dans des contextes ou l'unarité est nécessaire. Ces outils sont la **Curification** et l'**Application partielle**.

**Si on reprends l'exemple de calcul et de rapport de moyenne vu précedemment**, la fonction `ratio`, non unaire, peut bénéficier de ces outils:

Avec la **Currification**:

```typescript
const _ = require("lodash/fp");

// fonction non unaire de calcul de produit en croix (voir calcul de moyenne précedemment)
const ratio = (n: number, actualScale: number, targetScale: number): number =>
  (n * targetScale) / actualScale;

// fonction unaire permettant de rapporter la note de 15/20 sur une échelle différente
// (l'utilité de cette fonction est discutable, mais permet de démontrer l'intêret de la Currification)
const ratioOf15OutOf20 = _.curry(ratio)(15, 20);

// la note 15/20 sur une échelle 30, puis sur une échelle 42
return ratioOf15OutOf20(30); // --> 22.5
return ratioOf15OutOf20(42); // --> 31.5
```

Avec l'**Application partielle** ('`_`' se comporte ici comme un 'placeholder'):

```typescript
// fonction unaire permettant de rapporter n'importe quelle note sur une échelle de 20, à la note correspondante sur une échelle de 10
const ratioOutOf20ToOutOf10 = _.partial(ratio, _, 20, 10);

// les notes 13/20 et 17.5/20 rapportées sur 10
return ratioOutOf20ToOutOf10(13); // --> 6.5
return ratioOutOf20ToOutOf10(17.5); // --> 8.75
```

> ℹ️ - `curry` et `partial` utilisent en interne le principe de **[thunk](https://en.wikipedia.org/wiki/Thunk)**, qui permet d'encapsuler une expression afin d'en retarder l'évaluation: ici en encapsulant la fonction qui leur est donnée ainsi que certains de ses paramètres.

#### _Privilégier la récursivité ou les Array functions aux boucles_

En programmation fonctionnelle, l'utilisation de boucles (`for` ou `while`) est délaissée au profit d'autres patterns. En JavaScript par exemple, un nombre important de **fonctions d'ordre supérieur** comme `map`, `filter`, `find` ou `reduce` (et d'autres) sont mises à disposition afin de permettre **la manipulation chainée de tableaux**. Ces fonctions, étant d'ordre supérieur, ont l'avantage d'accepter une fonction comme paramètre et de **ne pas effectuer de mutation sur le tableau sur lequel elles sont appelées**.

Admettons que nous souhaitons écrire une fonction permettant de récupérer les adresses e-mail de tout les utilisateurs dont le compte à expiré dans une liste donnée:

```typescript
type User = {
  username: string;
  password: string;
  email: string;
  expirationDate: Date;
};

// si on écrit cette fonction impérativement
const getExpiredUsers = (
  list: Array<User>,
  now: Date = new Date()
): Array<string> => {
  const expiredEmails = [];
  // on aurait aussi pu utiliser la notation `for of` ici
  for (let i = 0; i < list.length; i++) {
    if (list[i].expirationDate <= now) {
      expiredEmails.push(list[i].email);
    }
  }
  return expiredEmails;
};
```

On peut écrire la même fonction grâce à aux Array functions (ce qui la rendra beaucoup plus lisible et éliminera toute mutation: **c'est l'implémentation à privilégier dans cet exemple**)...

```typescript
const getExpiredUsers = (
  list: Array<User>,
  now: Date = new Date()
): Array<string> => list.filter(u => u.expirationDate <= now).map(u => u.email);
```

Ou grâce à la récursivité (qui élimine aussi toute mutation, et respecte le mieux les implémentations fonctionnelles habituelles, tout en ayant l'avantage d'être une habitude d'écriture qui **limite fortement l'oubli de cas particuliers**):

```typescript
const getExpiredUsers = (
  list: Array<User>,
  index: number = 0,
  expiredEmails: Array<string> = [],
  now: Date = new Date()
): Array<string> => {
  if (index === list.length) return expiredEmails;
  return getExpiredUsers(
    list,
    index + 1,
    list[index].expirationDate <= now
      ? [...expiredEmails, list[index].email]
      : expiredEmails,
    now
  );
};
```

### II.2 - Quelques outils

#### _TypeScript_

Comme je l'ai évoqué précedemment, JavaScript est un langage typé faiblement et dynamiquement, contrairement à la plupart des langages fonctionnels classiques comme Haskell ou OCaml qui sont statiquement typés. Dans l'écosystème JavaScript, **il est possible d'utiliser TypeScript**, qui permet de pallier ce manque en ajoutant (entre autres) du typage statique à JavaScript.

> ℹ️ - TypeScript étant un langage destiné à être compilé en JavaScript, le typage statique qu'il introduit relève du **duck typing** (ou _[typage canard](https://fr.wikipedia.org/wiki/Duck_typing)_), qui définit le type d'un objet à partir de ses attributs et de ses méthodes.

Afin de permettre l'utilisation de TypeScript avec ESLint (dont on verra les avantages par la suite), il convient d'installer les dépendances `@typescript-eslint/eslint-plugin` et `@typescript-eslint/parser`.

```shell
yarn add @typescript-eslint/eslint-plugin @typescript-eslint/parser -D
```

#### _ESLint & eslint-plugin-fp_

L'application de toutes les règles évoquées précedemment n'est pas forcée par JavaScript ou TypeScript nativement. **L'utilisation d'ESLint et du plugin `eslint-plugin-fp` permet de forcer le développeur à respecter ces règles** en indiquant au sein de son IDE toutes les opérations allant à leur encontre ([voir la liste](https://github.com/jfmengels/eslint-plugin-fp#rules) des règles introduites par ce plugin).

Installation:

```shell
yarn add eslint eslint-plugin-fp -D
```

Configuration (avec `@typescript-eslint`):

```javascript
// .eslintrc.js, à la racine de votre projet

module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "fp"],
  extends: ["plugin:fp/recommended"]
};
```

> ℹ️ - À noter qu'ESLint est un linter et qu'**il n'influe donc en aucun cas sur la compilation et l'interprétation de votre code**. De plus, ses règles peuvent être facilement désactivées.

#### _ImmerJS / ImmutableJS_

Grâce au mot clé `const`, forcer l'immutabilité en Javascript peut se faire facilement pour tout les types primitifs. Cependant, quand il s'agit de tableaux, de structure de collections comme `Map` ou `Set` , ou d'objets en général, rien ne garanti l'immutabilité au runtime (le plugin `eslint-plugin-fp` présenté précedemment permet de la limiter durant le développement).

Les librairies **ImmerJS** et **ImmutableJS** permettent de pallier ce manque en mettant à disposition **des structures de données nativement immutables, et/ou des fonctions permettant de les manipuler**.

- ImmerJS permet, entre autres, de contrôler l'êtat d'un objet grâce à la fonction `produce` qui accepte deux paramètres: l'êtat actuel de l'objet à modifier, et une fonction décrivant les modification a effectuer:

```typescript
import produce from "immer";

const state = { foo: "bar", baz: [1, 2, 3] };

// 'updatedState' est immutable par défaut
// 'state' reste inchangé pendant et après cette opération
const updatedState = produce(state, draft => {
  draft.foo = "bar2";
  draft.baz.length = 0;
}); // { foo: "bar2", baz: [] };
```

> ℹ️ - ImmerJS permet aussi l'utilisation du principe de Curryfication en [acceptant une fonction](https://immerjs.github.io/immer/docs/curried-produce) décrivant des modifications comme premier argument de la fonction `produce`. La fonction résultante n'acceptera ainsi qu'un state comme premier argument, auquel elle appliquera la fonction de modification précedemment fournie.

- ImmutableJS, elle, propose directement des structures de données immutables (`Map`, `Set`, `List`, `Stack`, `OrderedSet`, `OrderedMap` et `Record`). Dans le cas de `Map`, `Set` et `List`, les méthodes de ces structures sont assez similaires à celles des API natives de JavaScript (respectivement `Map`, `Set` et `Array`). Une des structures intéressantes de ImmutableJS est `Record`, qui est similaire à un `Object` JavaScript classique mais force l'immutabilité et permet l'utilisation de valeurs par défaut:

```typescript
const { Record } = require("immutable");

const Car = Record({ wheelsCount: 4, seatsCount: 5, hasTrunk: true });

// here, formulaOne.wheelsCount will be 4 by default
const formulaOne = new Car({ seatsCount: 1, hasTrunk: false });
```

`immutable` et `immer` peuvent tout les deux être installés via `yarn`.

#### _Lodash - lodash/fp - eslint-plugin-lodash-fp_

**Lodash** est une librairie JavaScript qui fourni un grand nombre de fonctions utilitaires importables et réutilisable. **Elle fourni aussi un module [lodash/fp](https://github.com/lodash/lodash/wiki/FP-Guide)** qui embarque une version de Lodash dont les méthodes appliquent les principes propres à la programmation fonctionnelle, tout en aidant à les respecter.

> ℹ️ - Certaines de ces méthodes, comme `compose`, `pipe`, `curry` ou `partial`, ont été utilisées et expliquées dans les exemples de code précédent.

`lodash` peut être installé via `yarn`, et importé / utilisé comme suit:

```typescript
// using require notation
const _ = require("lodash/fp");

// or using CommonJS / JS Modules
import _ from "lodash/fp";
```

Il existe aussi un plugin ESLint dédié à l'utilisation de `lodash/fp`: [eslint-plugin-lodash-fp](https://github.com/jfmengels/eslint-plugin-lodash-fp).

---

## Conclusion

JavaScript est un langage conçu autour du web, majoritairement dans le but de répondre aux besoins de celui-ci. Bien que JavaScript et son écosystème dispose de solutions et d'outils permettant d'utiliser le paradigme fonctionnel, il reste un langage très utilisé dans le développement d'applicatifs fortement liés aux effets de bord. C'est pourquoi **il peut être difficile (voir impossible ou inutile) d'écrire la totalité d'une application destinée à être utilisée sur le web en suivant le paradigme fonctionnel**.

Le paradigme fonctionnel propose des principes et des règles de développement pouvant paraître stricte ou trop contraignantes au premier abord, mais dont les avantages peuvent s'avérer non négligeable dans la qualité et dans la prospérité d'une application. **Ce type de programmation n'est donc pas à utiliser sans réfléchir et dans toutes les situations en JavaScript, mais essayer d'appliquer ses principes dès que possible pourra s'avérer extremement bénéfique.**
