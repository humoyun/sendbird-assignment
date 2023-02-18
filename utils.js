function addClass(el, className) {
  if (el) {
    const classes = Array.isArray(className) ? className : [className];
    classes.forEach((cl) => {
      el.classList.add(cl);
    });
  }
}

function removeClass(el, className) {
  if (el) {
    const classes = Array.isArray(className) ? className : [className];
    classes.forEach((cl) => {
      el.classList.remove(cl);
    });
  }
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

function animate(elem, source, destination, duration) {
  let pos = 0;
  clearInterval(elem.animId);
  // elem.style.marginLeft = source + 'px';
  elem.animId = setInterval(frame, duration / 100);
  const step = (destination - source) / 100;
  function frame() {
    if (pos >= 100) {
      clearInterval(elem.animId);
    } else {
      pos++;
      elem.style.marginLeft = source + pos * step + "px";
    }
  }
}

function createElement(tag) {
  if (tag) {
    return document.createElement(tag);
  } else {
    throw new Error("tag name should be provided");
  }
}
