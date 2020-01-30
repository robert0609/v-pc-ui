import bezierEasing from 'bezier-easing';
import $, { browser } from 'v-utility';

function getViewPort() {
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight
  };
}

function getRectangle(element, absolute = false) {
  return browser.page.getRectangle(element, absolute);
}

function getScrollTop() {
  return document.documentElement.scrollTop || document.body.scrollTop;
}

function getScrollBottom() {
  return getScrollTop() + document.documentElement.clientHeight;
}

function getScrollLeft() {
  return document.documentElement.scrollLeft || document.body.scrollLeft;
}

const requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  (function() {
    let last = new Date().getTime();
    return function(callback) {
      setTimeout(() => {
        let current = new Date().getTime();
        let timestamp = current - last;
        callback(timestamp);
      }, 1000 / 60);
    };
  })();

const cancelAnimationFrame =
  window.cancelAnimationFrame ||
  window.mozCancelAnimationFrame ||
  window.webkitCancelAnimationFrame ||
  window.msCancelAnimationFrame ||
  window.oCancelAnimationFrame ||
  window.clearTimeout;

const easing = bezierEasing(0.25, 0.1, 0.25, 1);

function scrollTo({ x = 0, duration = 500, onComplete = () => {} } = {}) {
  let scrollTop = getScrollTop();
  const typeOfx = $.checkType(x);
  switch (typeOfx) {
    case $.enumType.eNumber:
      break;
    case $.enumType.eElement:
      x = getRectangle(x, true).top;
      break;
    case $.enumType.eObject:
      if ($.checkType(x.$el) === $.enumType.eElement) {
        x = getRectangle(x.$el, true).top;
      } else {
        throw new Error(
          'Type of parameter x is error! It should be Number, HTMLElement or VueComponent'
        );
      }
      break;
    default:
      throw new Error(
        'Type of parameter x is error! It should be Number, HTMLElement or VueComponent'
      );
  }

  let distance = x - scrollTop;

  let lastTimeStamp = null;
  requestAnimationFrame(loop);

  function loop(timestamp) {
    if (!lastTimeStamp) {
      lastTimeStamp = timestamp;
    }
    let t = timestamp - lastTimeStamp;
    if (t < duration) {
      let targetTop =
        scrollTop + easing(t / duration) * distance;
      document.documentElement.scrollTop = targetTop;
      document.body.scrollTop = targetTop;
      requestAnimationFrame(loop);
    } else {
      document.documentElement.scrollTop = x;
      document.body.scrollTop = x;
      onComplete.call();
      return;
    }
  }
}

function scrollToPromise(x, duration) {
  return new Promise((resolve, reject) => {
    try {
      scrollTo({
        x,
        duration,
        onComplete() {
          resolve();
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

function loopAnimationFrame(callback) {
  let requestId = requestAnimationFrame(loop);

  function loop(timestamp) {
    callback(timestamp);
    requestId = requestAnimationFrame(loop);
  }

  return {
    cancel() {
      cancelAnimationFrame(requestId);
    }
  };
}

export default {
  getRectangle,
  get viewPort() {
    return getViewPort();
  },
  get scrollTop() {
    return getScrollTop();
  },
  get scrollBottom() {
    return getScrollBottom();
  },
  get scrollLeft() {
    return getScrollLeft();
  },
  scrollTo,
  scrollToPromise,
  loopAnimationFrame
};
