// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }

  interface Window {
    __seed?: number;
  }

  interface Document {
    startViewTransition: (Function) => void;
  }

  interface Element {
    style: {
      viewTransitionName: string;
    };
  }
}

export {};
