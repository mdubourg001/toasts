---
theme: default
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://images.unsplash.com/photo-1619597361832-a568b1e0555f
# apply any windi css classes to the current slide
class: "text-center"
# https://sli.dev/custom/highlighters.html
highlighter: shiki
# show line numbers in code blocks
lineNumbers: false
drawings:
  persist: false
---

# Introduction à Remix.run

---

# 💿 Remix : qu'est ce que c'est ?

[voir: https://remix.run](https://remix.run/)

<br />

<v-clicks>

- Framework web **full-stack**
- Par les créateurs de React Router, Reach, UNPKG...
- Comparable à NextJS
- Ne permettant **que le fonctionnement en mode "SSR"**
- Prônant **l'amélioration progressive** & l'utilisation d'**APIs web standardisées**

</v-clicks>


---

# Routing

Défini par la hiérarchie du dossier `app/routes`

```text {all|2|3-9|all}
📂 app
  ├── root.tsx
  └── 📂 routes
      ├── index.tsx
      ├── tasks.tsx
      └── 📂 tasks
          ├── index.tsx
          ├── create.tsx
          └── $taskId.tsx
```

<br />

|                              |               |
| ---------------------------- | ------------- |
| app/routes/index.tsx         | /             |
| app/routes/tasks/index.tsx   | /tasks        |
| app/routes/tasks/create.tsx  | /tasks/create |
| app/routes/tasks/$taskId.tsx | /tasks/42     |

<!-- https://sli.dev/guide/animations.html#click-animations -->

<!-- <img
  v-click
  class="absolute -bottom-9 -left-7 w-80 opacity-50"
  src="https://sli.dev/assets/arrow-bottom-left.svg"
/> -->

<!-- <p v-after class="absolute bottom-23 left-45 opacity-30 transform -rotate-10">Here!</p> -->

---

# Routing

Permet le nesting des routes via `<Outlet />`

```text {all|5}
📂 app
  ├── root.tsx
  └── 📂 routes
      ├── index.tsx
      ├── tasks.tsx
      └── 📂 tasks
          ├── index.tsx
          ├── create.tsx
          └── $taskId.tsx
```

<v-click>

```tsx {all|1,8}
import { Outlet } from "@remix-run/react";

export default function Tasks() {
  return (
    <div>
      <h1>Tasks</h1>
      <TasksNav />
      <Outlet />
    </div>
  );
}
```

</v-click>


---
layout: iframe
url: https://remix.run/_docs/routing
class: w-full px-1/8 mx-auto bg-black
---

---
layout: two-cols
class: first-of-type:mr-8
---

# Data fetching

##### Remix

```tsx {0|1-3,6-13|all}
// app/routes/tasks/index.tsx

import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async () => {
  const tasks = await getTasksSomehow();

  // return new Response(JSON.stringify(tasks), {
  //   headers: { "Content-Type": "application/json" } 
  // })
  return json(tasks);
};

export default function TasksList() {
  const tasks = useLoaderData();

  // ...
}
```

::right::

<br />
<br />
<br />

##### NextJS

```tsx {0|1,4-19}
// src/pages/tasks/index.tsx

export async function getStaticProps () {}

export async function getServerSideProps () {
  const tasks = await getTasksSomehow();

  return {
    props: {
      tasks: tasks
    }
  };
}

export default function TasksList({ tasks }) {
  // ...
}
```

---
layout: two-cols
class: first-of-type:mr-8
---

# Data fetching

##### Remix

```tsx
// app/routes/tasks/index.tsx

import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async () => {
  const tasks = await getTasksSomehow();

  // return new Response(JSON.stringify(tasks), {
  //   headers: { "Content-Type": "application/json" } 
  // })
  return json(tasks);
};

export default function TasksList() {
  const tasks = useLoaderData();

  // ...
}
```

::right::

<br />
<br />
<br />
<br />

<v-clicks>

- Peut exister au niveau de chaque Route
- Chaque zone de la page peut fetcher/revalider ses données grâce à `<Outlet />`
- Limite le prop drilling
- Retourne un objet `Response` standard
- (_[Mécanisme similaire de "Layouts"](https://nextjs.org/blog/layouts-rfc?utm_source=next-site&utm_medium=banner&utm_campaign=next-website) en RFC sur NextJS_)


</v-clicks>

---

# Mutations

##### Remix

```tsx {0|1-13|all}
// app/routes/tasks/create.tsx
import { redirect } from "@remix-run/node"

export const action = async ({ request }) => {
  const formData = await request.formData();
  const task = await saveTaskToDB(formData);

  // return new Response({
  //   status: 302,
  //   headers: { "Location": `/tasks/${task.id}` } 
  // })
  return redirect(`/tasks/${task.id}`);
};

export default function TasksCreation() {
  return (
    <form method="post">
      <label htmlFor="title">Title</label>
      <input id="title" name="title" type="text" />
      <button type="submit">Create task</button>
    </form>
  )
}
```

::right::

<!-- <br />
<br />
<br />

##### NextJS

```tsx {0|all}
// src/pages/api/tasks/create.ts
export default function handler(request, response) {
  const form = request.body;
  const task = await saveTaskToDB(form);

  return response.redirect(`/tasks/${task.id}`);
}

```

```tsx {0|all}
// src/pages/tasks/create.tsx
export default function TasksCreation() {
  return (
    <form method="post" method="/api/tasks/create">
      <label htmlFor="title">Title</label>
      <input id="title" name="title" type="text" />
      <button type="submit">Create task</button>
    </form>
  )
}
``` -->

---

# Mutations <span class="text-gray-400">- Validation</span>

##### Remix

```tsx {0|1-7,12-13|1-13|all}
// app/routes/tasks/create.tsx
import { redirect, json } from "@remix-run/node"
import { useActionData } from "@remix-run/react";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const [error, task] = await saveTaskToDB(formData);

  if (error) {
    return json({ error });
  }
  return redirect(`/tasks/${task.id}`);
};

export default function TasksCreation() {
  const actionData = useActionData();

  if (actionData?.error) {
    return <p>{actionData.error}</p>
  }
  return <form method="post">{/* ... */}</form>
}
```
---

# Mutations <span class="text-gray-400">- Optimistic UI (nécessite JS)</span>

##### Remix

```tsx {1-2|1-2,8-9,16|1-2,8-16}
// app/routes/tasks/create.tsx
import { useTransition } from "@remix-run/react";

export const action = async ({ request }) => {
  // ...
};

export default function TasksCreation() {
  const transition = useTransition();

  if (transition.state === "submitting") {
    return <TaskView task={transition.submission.formData}>
  } else {
    return <form method="post">{...}</form>
  }
}
```

--- 
layout: two-cols
class: first-of-type:mr-8
---

# Mutations

<v-clicks>

- Comme `loader`, peut exister au niveau de chaque Route : `loader` traite les requêtes GET et `action` les requêtes POST
- Comme `loader`, retourne un objet `Response` standard
- Facilite l'optimistic UI et l'error handling
- Permet la revalidation automatique de la donnée de la route concernée

</v-clicks>

::right::

<br />
<br />
<br />

```tsx
// app/routes/tasks/create.tsx
import { redirect } from "@remix-run/node"
import { useActionData, useTransition } from "@remix-run/react"

export const action = async ({ request }) => {
  const formData = await request.formData();
  const [error, task] = await saveTaskToDB(formData);

  if (error) {
    return json({ error });
  }
  return redirect(`/tasks/${task.id}`);
};

export default function TasksCreation() {
  const actionData = useActionData()
  const transition = useTransition();
  return (
    <form method="post">
      <label htmlFor="title">Title</label>
      <input id="title" name="title" type="text" />
      <button type="submit">Create task</button>
    </form>
  )
}
```

---
layout: two-cols
class: first-of-type:mr-8
---

# Error Handling

```tsx {0|1,3-13|1-22}
// app/routes/tasks/index.tsx

export function ErrorBoundary({ error }) {
  return (
    <html>
      <head><title>Oh snap!</title></head>
      <body>
        <p>{error.message}</p>
      </body>
    </html>
  );
}

export const loader = () => { 
  throw "🚨" 
}
export const action = () => { 
  throw "🚨" 
}

export default function TasksList() { /* ... */ }
```

::right::

<br />
<br />
<br />
<br />

<v-clicks>

- `ErrorBoundary` interceptera toutes les erreurs issues du `loader`, de l'`action`, ou du rendu (serveur ou client)
- Comme `loader` et `action`, peut exister au niveau de chaque Route
- Si une Route ne définit pas d'`ErrorBoundary`, c'est l`ErrorBoundary` de la Route parente qui l'interceptera
- (_Sera aussi possible sur NextJS avec les Layouts_)

</v-clicks>

---
layout: center
class: text-center
---


<img class="w-[600px]" src="/error-handling.png" />

---
layout: center
---

<h1 class="text-center">Amélioration progressive</h1>

<v-click>

Tous les exemples de code Remix présentés jusqu'ici fonctionnent sans JavaScript côté client.

</v-click>
<v-click>

```tsx {3-5,7-9|all}
import { Scripts } from "@remix-run/react";

export default function MyRoute() {
  return (
    {/* ... */}
    <Scripts />
    {/* ... */}
  )
}
```

</v-click>

---
layout: two-cols
class: first-of-type:mr-8
---

# Conclusion

<v-clicks>

- Framework "opinionated" qui oblige un bon découpage du code et des responsabilités
- Simple d'apprentissage
- Prône l'amélioration continue et l'utilisation de standards du web
- Qu'il s'installe durablement ou non : amène des concepts très intéressants

</v-clicks>

::right::


<v-click>

<Tweet id="1465702417513680897" scale="0.85" />

</v-click>

---
layout: center
class: text-center
---

# Merci pour votre écoute

Des questions ?