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

```text {2|3-9|all}
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
  const data = await getDataSomehow();

  // return new Response(JSON.stringify(data), {
  //   headers: { "Content-Type": "application/json" } 
  // })
  return json(data);
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
  const data = await getDataSomehow();

  return {
    props: {
      tasks: data
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
  const data = await getDataSomehow();

  // return new Response(JSON.stringify(data), {
  //   headers: { "Content-Type": "application/json" } 
  // })
  return json(data);
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
layout: two-cols
class: first-of-type:mr-8
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
    <form method="post" action="/tasks/create">
      <label htmlFor="title">Title</label>
      <input id="title" name="title" type="text" />
      <button type="submit">Create task</button>
    </form>
  )
}
```

::right::

<br />
<br />
<br />

##### NextJS

```tsx {0|all}
// src/pages/api/tasks/create.ts
export default function handler(request, response) {
  const form = JSON.parse(request.body);
  const task = await saveTaskToDB(form);
  return response.redirect(`/tasks/${task.id}`);
}

```

```tsx {0|all}
// src/pages/tasks/create.tsx
export default function TasksCreation() {
  const [form, dispatch] = useReducer(formReducer);
  const submitForm = useCallback((e) => {
    fetch("/api/tasks/create", {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form);
    })
  }, [form])

  return (
    <form onSubmit={submitForm}>{/* ... */}</form>
  )
}
```


---
layout: two-cols
class: first-of-type:mr-8
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

::right::

<br />
<br />
<br />
<br />

<v-clicks>

- Comme `loader`, peut exister au niveau de chaque Route : `loader` traite les requêtes GET et `action` les requêtes POST
- Comme `loader`, retourne un objet `Response` standard

</v-clicks>

---
layout: two-cols
class: first-of-type:mr-8
---

# Error Handling

```tsx {0|1,3-13|1-22}
// app/routes/tasks/index.tsx
import { useCatch } from "@remix-run/react";

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

export const loader = () => { throw new Response() }
export function CatchBoundary() {
  const caught = useCatch();

  return (
      <p>Status code: {caught.status}</p>
  );
}

export default function TasksList() { /* ... */ }
```

::right::

<br />
<br />
<br />
<br />

<v-clicks>

- Comme `loader` et `action`, peuvent exister au niveau de chaque Route
- Interceptent toutes les erreurs qui sont throw pendant le rendu (client ou serveur), au sein d'un loader, ou au sein d'une action
- `CatchBoundary`, si définit, interceptera toutes les erreurs issues du loader ou de l'action
- `ErrorBoundary` interceptera toutes les autres
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

Tous les exemples de code Remix présentés jusqu'ici fonctionnent sans JavaScript.

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