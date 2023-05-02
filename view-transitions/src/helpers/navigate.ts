import { goto } from "$app/navigation";

export function spaNavigate(to: string) {
  if (!document.startViewTransition) {
    console.warn("spaNavigate: document.startViewTransition is not defined");
    return;
  }

  // return document.startViewTransition(() => {
  return goto(to);
  // });
}
