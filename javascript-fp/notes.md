# La programmation fonctionnelle en JavaScript

## I - Le paradigme fonctionnel

Le paradigme fonctionnel est un paradigme de programmation de type **déclaratif**. En programmation déclarative, les composants logiciels utilisés par un programme sont **indépendants les uns des autres**, ne comportent **aucun contexte interne**, et sont **purs**.

En programmation fonctionnelle, ces composants sont des **fonctions mathématiques**.


### I.1 - Les principes de la programmation fonctionnelle

La programmation fonctionnelle impose certaines règles:

- _Separation Of Concerns_: **les données et leurs structures doivent être séparées de la logique**. Une classe (ou un _type_ comme on préferera les utiliser en PF) ne doit donc servir uniquement qu'à la représentation d'une donnée. Les traitements réalisés sur de telles données sont réservés à des fonctions pures. En suivant la même logique, **une fonction doit être responsable d'une et une seule tâche**.
- _Pureté_: **une fonction doit, si possible, être pure**: Pour des arguments donnés, une fonction pure doit toujours retourner la même valeur. Elle doit donc être déterministe et ne doit pas elle même utiliser des fonctions impures (appels API, I/O, aléatoire, sides-effects en général...). 
- _Immutabilité_: **une donnée ne doit pas être réassignée**. Une fonction ne doit donc en aucun cas muter un argument qui lui a été passé en paramètre. Quand c'est nécessaire, une telle fonction doit plutôt créer une nouvelle copie modifiée de cette donnée, ou utiliser la récursivité.


Elle utilise aussi d'autres principes:

- _Fonctions Supérieures (HOC)_
- _Récursivité_
- _'Chaining' d'opérations_
- _Composition de fonctions_
- _'Currying'_
- _Monades (😱)_
- ...

### I.2 - Les avantages de la programmation fonctionnelle

### I.3 - Gestions des side effects en programmation fonctionnelle

Malgrès ce qui peut être dicté par le paradigme fonctionnel, les programmes informatiques **ont besoin** de side effects, sans quoi leurs utilisations seraient très limitées. Il existe cependant des moyens de réduire la dépendance forte qui existe entre un programme et ses side effects, et de maintenir au maximum la pureté des fonctions qui le composent.

#### _Exemple: OpenWeather2TextFile_ 

**Admettons par exemple** que nous souhaitons écrire un programme génialement baptisé _OpenWeather2TextFile_ permettant de récupérer la température actuelle à Bordeaux via les services de OpenWeather, de convertir celle-ci en degrés Celsius, de multiplier la valeur obtenue par un nombre aléatoire, et enfin d'écrire cette toute dernière valeur dans un fichier texte présent sur votre disque.

On peut dors et déjà distinguer les opérations _pures_ des opérations dîtes _impures_:
- récupération de la température actuelle: implique un appel (asynchrone 😱) à une API externe et est donc **impure**
- conversion en degrés Celsius: aucun effet de bord et donc **pure**
- multiplier la valeur obtenue par un nombre aléatoire: implique l'utilisation d'un générateur de nombres aléatoires, et est donc **impure**
- écrire cette toute dernière valeur dans un fichier: **impure**

Étant donné la faible complexité de notre programme, on pourrait être tentés d'écrire une seule et même fonction afin de réaliser ces 4 tâches. Cependant, **cette fonction produisant des side effects serait par définition elle même impure**, et deviendrais ainsi difficile à tester, et nous perdrions de plus tout l'intêret de la programmation fonctionelle.

Si l'on se résout donc au fait qu'une partie des opérations de notre programme sera innévitablement impure et que l'on tente d'appliquer les principes de la programmation fonctionnelle évoqués précedemment, **une bonne pratique serait de découper au maximum les tâches de notre programme en fonctions indépendantes**, ce qui aurait en plus pour effet d'**isoler les fonctions impures**:

```typescript
const fetch = require('node-fetch');
const fs = require('fs');
const { compose } = require('lodash/fp');

/** Impure (side effect asynchrone) */
const fetchBordeauxTemperatureFromOW = async (): number => {
  const response = await fetch(
    'api.openweathermap.org/data/2.5/weather?q=Bordeaux'
  );
  const data = await response.json();
  return data.main.temp;
};

/** Pure (deterministe et sans side effects) */
const convertFahrenheitToCelcius = (farTemp: number): number => (farTemp - 32) / 1.8;

/** Impure (appel à fonction aléatoire) */
const multiplyByRandom = (n: number): number => n * Math.Random();

/** Impure (écriture de fichier) */
const writeToTextFile = (n: number): void => fs.writeFileSync('file.txt', n);

/** 
 * Utilisation de _.compose
 * https://lodash.com/docs/4.17.15#flowRight
 */
return compose(
  writeToTextFile,
  multiplyByRandom,
  convertFahrenheitToCelcius,
  fetchBordeauxTemperatureFromOW
)();
```