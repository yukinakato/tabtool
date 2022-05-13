let altPressed = false;

function isScrollable(el) {
  if (el.scrollHeight <= el.clientHeight) {
    return false;
  }
  const scrollableAttr = ["auto", "overlay", "scroll"];
  const style = window.getComputedStyle(el);
  return (
    scrollableAttr.includes(style.getPropertyValue("overflow")) ||
    scrollableAttr.includes(style.getPropertyValue("overflow-y"))
  );
}

function findScrollTarget(el) {
  if (isScrollable(el)) {
    return el;
  }
  if (el.parentElement) {
    return findScrollTarget(el.parentElement);
  }
  return window;
}

window.addEventListener("keydown", (event) => {
  if (event.code === "AltLeft") {
    altPressed = true;
    event.preventDefault();
  }
});

window.addEventListener("keyup", (event) => {
  if (event.code === "AltLeft") {
    altPressed = false;
    event.preventDefault();
  }
});

window.addEventListener(
  "wheel",
  (event) => {
    if (!altPressed) return;
    event.preventDefault();
    findScrollTarget(event.target).scrollBy(0, event.deltaY * (altPressed ? 4 : 1));
  },
  { passive: false }
);
