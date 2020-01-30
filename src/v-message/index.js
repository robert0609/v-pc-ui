import Vue from 'vue';
import vToast from './v-message.vue';
import zIndexManager from '../common/zIndexManager';

let isShow = false;
let toastStack = [];
let vToastConstructor = Vue.extend(vToast);

function show({
	message = '',
  duration = 3000,
  onClosed = function () { }
} = {}) {
  let instance = new vToastConstructor({
    el: document.createElement('div')
  });
  instance.message = message;
  instance.duration = duration;
  instance.$on('hidden', () => {
    isShow = false;
		document.body.removeChild(instance.$el);
    zIndexManager.remove(instance);
    onClosed();
    dequeue();
  });

  isShow = true;
	document.body.appendChild(instance.$el);
  instance.display();
  zIndexManager.push(instance);
}

function enqueue(option) {
  if (isShow) {
    toastStack.push(option);
  }
  else {
    show(option);
  }
}

function dequeue() {
  if (toastStack.length > 0) {
    let option = toastStack.splice(0, 1)[0];
    show(option);
  }
}

export default {
  show: enqueue
};
