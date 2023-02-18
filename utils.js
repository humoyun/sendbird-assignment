function addClass(el, className) {
  if (el) {
    const classes = Array.isArray(className) ? className : [className];
    classes.forEach((cl) => {
      el.classList.add(cl);
    });
  }
}

function removeClass(el, className) {
  if (el) el.classList.remove(className);
}

function addStyle(el, k, v) {
  if (el) el.style[k] = v;
}

function setAttribute(el, attr, val) {
  if (el) el.setAttribute(attr, val);
}

function setBoundingBox(sourceEl, targetEl) {
  if (sourceEl) {
    const offsets = sourceEl.getBoundingClientRect();

    targetEl.style.top = offsets.top + window.scrollY + "px";
    targetEl.style.left = offsets.left + window.scrollX + "px";
    targetEl.style.width = `${offsets.width}px`;
    targetEl.style.height = `${offsets.height}px`;
  }
}
