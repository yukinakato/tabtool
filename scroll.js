function isScrollable(el) {
  if (el.tagName === 'HTML' || el.tagName === 'BODY') {
    return false
  }
  if (el.scrollHeight <= el.clientHeight) {
    return false
  }
  const scrollableAttrs = ['auto', 'overlay', 'scroll']
  const style = window.getComputedStyle(el)
  return scrollableAttrs.includes(style.getPropertyValue('overflow')) || scrollableAttrs.includes(style.getPropertyValue('overflow-y'))
}

function findScrollTarget(el) {
  if (isScrollable(el)) {
    return el
  }
  if (el.parentElement) {
    return findScrollTarget(el.parentElement)
  }
  return window
}

window.addEventListener('wheel', (event) => {
  if (event.altKey) {
    findScrollTarget(event.target).scrollBy(0, event.deltaY * 4)
  }
})
