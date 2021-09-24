# Comment mon navigateur éxécute-t-il mon code JavaScript ?

// https://blog.axopen.com/2020/08/callback-queue-event-loop-javascript-asynchrone.gif
// http://latentflip.com/loupe/

- Le runtime v8 est composé principalement d'un **tas (heap)**, et d'une **callstack**
- v8 est monothreadé et possède donc une seule et unique callstack
- Comme son nom l'indique c'est une stack, et donc FILO
- Chaque tâche est donc **bloquante** et éxécutée par ordre de déclaration
- _Exemple simple du fonctionnement d'un programme en full synchrone_
- De ce fait, certaines tâches longues comme l'envoi de requêtes XHR par exemple ne peuvent pas être effectuées de manière synchrone, ce qui aurait pour effet de **bloquer complètement l'avancement du programme**
- _Exemple avec une boucle infinie pour simuler un `syncFetch`_
- Ces tâches doivent donc être réalisée de manière asynchrone, en utilisant des APIs fournies par le navigateur: les Web APIs. Ces APIs sont en réalité des bindings vers du code interne au navigateur (probablement C++), et leur appel déclenche leur éxécution sur leur propre thread
- Lorsqu'un callback est donné à l'une de ces APIs, comme `setTimeout` par exemple, le navigateur va attendre la valeur du timeout donné à `setTimeout` puis placera le callback sur une queue à part : la **callback queue**
- (Le timeout passé à `setTimeout` est donc un temps **minimum** d'attente et non pas un temps **garanti**)
- _Exemple avec des appels a des Web APIs_
- Le rôle de l'event loop sera de placer les tâches qui sont en attente sur la callback queue sur la callstack. Elle attendra que la callstack ne soit vide pour le faire
- Comme on est dans le cas d'un navigateur, à tout ceci doit aussi s'ajouter la gestion des rendus
- De manière simplifiée, on peut dire que le navigateur fait un rendu (à partir du DOM + CSSOM = Render Tree) à l'écran toutes 1/60ème de secondes
- Le rendu étant effectué sur le même thread, celui-ci ne peux pas être fait tant qu'il reste des tâches en cours sur la callstack (peu importe la durée des tâches en question)
- Pour simplifier, on peut dire que ces opérations de rendu sont elles aussi placées en attente sur la callback queue de manière périodique, mais avec une priorité trés élevée : en première place de la queue
- _Schéma avec les rendus placés dans la callback queue_
- Certaines Web APIs permettent de prioriser ou dé-prioriser certaines tâches par rapport au rendu : `requestAnimationFrame` qui demande au navigateur de prioriser une tâche avant le prochain rendu, et `requestIdleCallback` qui indique au navigateur qu'un tâche doit être éxécuté en basse priorité cad. après le rendu et seulement si il reste du temps avant la frame suivante
- En synthèse, à chaque frame (~60 fois par seconde), le navigateur :
  - Éxécute les tâches en attente sur la callstack
  - Demande à la callback queue de placer les tâches en attente sur la callback queue sur la callstack, en respectant un certain ordre de priorité (celà inclu le rendu)
- _Exemples et schémas complets avec `requestAnimationFrame` et `requestIdleCallback`_
- Le fonctionnement décrit est très simplifie ici : les navigateurs réalisent en réalité énormément de micro-optimisations lors de ce processus
