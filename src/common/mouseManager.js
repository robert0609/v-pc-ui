let lostFocusHandlers = [];
let lastClickElement = null;

function bodyClick(e) {
  setTimeout(() => {
    trigger(e.target);
  }, 0);
}

function onLostFocus(elements, handler) {
  if (lostFocusHandlers.length === 0) {
    document.addEventListener('mousedown', bodyClick);
  }
  lostFocusHandlers.push({
    elements,
    handler
  });
}

function removeLostFocus(elements, handler) {
  let index = lostFocusHandlers.findIndex(item => arrayEqual(item.elements, elements) && item.handler === handler);
  if (index > -1) {
    lostFocusHandlers.splice(index, 1);
    if (lostFocusHandlers.length === 0) {
      document.removeEventListener('mousedown', bodyClick);
    }
  }
}

function triggerLostFocus() {
  trigger(document.body);
}

function trigger(clickElement) {
  lostFocusHandlers.forEach(item => {
    if ((item.elements.indexOf(clickElement) < 0 && item.elements.every(elem => {
      return !contains(elem, clickElement);
    })) && lastClickElement && (item.elements.indexOf(lastClickElement) > -1 || item.elements.some(elem => {
      return contains(elem, lastClickElement);
    }))) {
      let fn = item.handler;
      fn.call();
    }
  });
  lastClickElement = clickElement;
}

function arrayEqual(arr1, arr2) {
  let result = true;
  if (arr1.length === arr2.length) {
    for (let i = 0; i < arr1.length; ++i) {
      if (arr1[i] !== arr2[i]) {
        result = false;
        break;
      }
    }
  }
  else {
    result = false;
  }
  return result;
}

function contains(parent, child) {
  let r = parent.compareDocumentPosition(child);
  return (r & 16) === 16;//这里运算符优先级是个坑
}

export default {
  onLostFocus,
  removeLostFocus,
  triggerLostFocus
};
