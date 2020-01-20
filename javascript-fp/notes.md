# La programmation fonctionnelle en JavaScript

Cet article tentera de rappeler les principes et les avantages du paradigme fonctionnel puis apportera des éléments d'application de ce dernier à l'écosystème JavaScript. 

Sauf indication contraire, **tout les exemples de code présenté seront rédigés en TypeScript.**

## I - Le paradigme fonctionnel

Le paradigme fonctionnel est un paradigme de programmation de type **déclaratif**. En programmation déclarative, les composants logiciels utilisés par un programme sont **indépendants les uns des autres**, ne comportent **aucun contexte interne**, et sont **purs**.

En programmation fonctionnelle, ces composants sont des **fonctions mathématiques**.


### I.1 - Les principes de la programmation fonctionnelle

La programmation fonctionnelle impose certaines règles:

- _Separation Of Concerns_: **les données et leurs structures doivent être séparées de la logique**. Une classe (ou un _type_ comme on préferera les utiliser en PF) ne doit donc servir uniquement qu'à la représentation d'une donnée. Les traitements réalisés sur de telles données sont réservés à des fonctions pures. En suivant la même logique, **une fonction doit être responsable d'une et une seule tâche**.
- _Pureté_: **une fonction doit, si possible, être pure**: Pour des arguments donnés, une fonction pure doit toujours retourner la même valeur. Elle doit donc être déterministe et ne doit pas elle même utiliser des fonctions impures (appels API, I/O, aléatoire, sides-effects en général...). 
- _Immutabilité_: **une donnée ne doit pas être réassignée**. Une fonction ne doit donc en aucun cas muter un argument qui lui a été passé en paramètre. Quand c'est nécessaire, une telle fonction doit plutôt créer une nouvelle copie modifiée de cette donnée, ou utiliser la récursivité.


Et utilise certains principes:

- _Fonctions d'Ordre Supérieur (HOC)_
- _Récursivité_
- _'Chaining' d'opérations_
- _Composition de fonctions_
- _Transparence Référentielle_
- _'Currying'_
- _Monades (😱)_
- ...

### I.2 - Les avantages de la programmation fonctionnelle

Du fait que la programmation fonctionnelle soit assez stricte et peu permissive, il découle un certain nombre de bienfaits pour celui qui l'utilise et pour le code qu'il produit:

- _Testabilité_: les fonctions étant pures ou leur side effects pouvant être mockés, elles sont facilement testables unitairement et fonctionnellement
- _Découpage implicite du code_: la pureté des fonctions et le principe de récursivité crée un découpage implicite du code. Celui-ci peut donc facilement être répartit, par nature, entre plusieurs fichiers
- _Séparation of Concerns by Design_: la séparation des préoccupations est un des principes fondamentaux de conception informatique. En programmation fonctionnelle, le code est implicitement découpé et respecte donc plus facilement ce principe
- _Réutilisabilité_: toujours pour la même raison, chaque fonction pure peut etre facilement réutilisé partout au sein d'un même programme ou même partagé entre plusieurs programmes
- _Facilité d'abstraction_: grâce aux principes de _Transparence Référentielle_ et de _Currying_, une fonction peut facilement être étendue ou détournée sans duplication de code

### I.3 - Gestions des side effects en programmation fonctionnelle

Malgrès ce qui peut être dicté par le paradigme fonctionnel, les programmes informatiques **ont besoin** de side effects, sans quoi leurs utilisations seraient très limitées. Il existe cependant des moyens de réduire la dépendance forte qui existe entre un programme et ses side effects, et de maintenir au maximum la pureté des fonctions qui le composent.

#### _Exemple: OpenWeather2TextFile_ 

**Admettons par exemple** que nous souhaitons écrire un programme génialement baptisé _OpenWeather2TextFile_ permettant de récupérer la température actuelle à Bordeaux via les services de OpenWeather, de convertir celle-ci en degrés Celsius, de multiplier la valeur obtenue par un nombre aléatoire, et enfin d'écrire cette toute dernière valeur dans un fichier texte présent sur notre disque.

On peut dors et déjà distinguer les opérations _pures_ des opérations dîtes _impures_:
- récupération de la température actuelle: implique un appel (asynchrone 😱) à une API externe et est donc **impure**
- conversion en degrés Celsius: aucun effet de bord et donc **pure**
- multiplier la valeur obtenue par un nombre aléatoire: implique l'utilisation d'un générateur de nombres aléatoires, et est donc **impure**
- écrire cette toute dernière valeur dans un fichier: **impure**

Étant donné la faible complexité de notre programme, on pourrait être tentés d'écrire une seule et même fonction afin de réaliser ces 4 tâches. Cependant, **cette fonction produisant des side effects serait par définition elle même impure**, et deviendrais ainsi difficile à tester, et nous perdrions de plus tout l'intêret de la programmation fonctionelle.

Si l'on se résout donc au fait qu'une partie des opérations de notre programme sera innévitablement impure et que l'on tente d'appliquer les principes de la programmation fonctionnelle évoqués précedemment, **une bonne pratique serait de d'isoler les fonctions impures en découpant au maximum les opérations de notre programme en fonctions indépendantes**:

```typescript
const fetch = require("node-fetch");
const fs = require("fs");
const { compose } = require("lodash/fp");

/** Impure (side effect asynchrone) */
const fetchBordeauxTemperatureFromOW = async (): number => {
  const response = await fetch(
    "api.openweathermap.org/data/2.5/weather?q=Bordeaux"
  );
  const data = await response.json();
  return data.main.temp;
};

/** Pure (deterministe et sans side effects) */
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

De plus, en utilisant le principe de _Fonctions d'Ordre Supérieur_ ou _Higher-order Functions (HOC)_ évoqué précedemment, **une autre fonction, impure, peut être rendue testable tout en conservant son utilisation d'un side effect: `multiplyByRandom`. Il suffit pour celà de lui permettre d'accepter un deuxième paramètre optionnel qui serait la fonction de génération aléatoire qu'elle utilise**: 

```typescript
const multiplyByRandom = (
  n: number,
  rand: () => number = Math.Random
): number => n * rand();
```

```typescript
// tests.ts
test('multiplyByRandom', () => {
  expect(multiplyByRandom(20, () => 0.5)).toBe(10);
});
```

Remarque: une modification similaire pourrait être effectuée sur la fonction `fetchBordeauxTemperatureFromOW` en lui permettant d'accepter un deuxième paramètre qui serait la fonction utilisée afin de récupérer les données de températures. Celà permettrai la aussi de rendre cette fonction testable en mockant l'appel HTTP.

> ℹ️ - Certains langages fonctionnels typés, comme Haskell, sont intransigeants avec les side effects, et proposent donc des structures spécifiques appelées **monades** afin d'en permettre l'utilisation. Cependant, les monades sont un principe assez vaste et mathématiquement complexe que nous ne traiteront pas ici.