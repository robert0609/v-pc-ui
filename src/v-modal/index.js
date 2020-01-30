import Vue from 'vue';
import vMessageBox from './v-modal.vue';
import zIndexManager from '../common/zIndexManager';

let vMessageBoxConstructor = Vue.extend(vMessageBox);

function show({
	message = '',
	onClosed = function () {},
	buttons = []
} = {}) {

	let instance = new vMessageBoxConstructor({
		el: document.createElement('div')
	});
	instance.message = message;
	instance.buttons = buttons;
	instance.$on('closed', () => {
    this.__vHostParent.removeChild(instance.$el);
    zIndexManager.remove(instance);
		onClosed();
	});

	this.__vHostParent.appendChild(instance.$el);
  instance.show();
  zIndexManager.push(instance);

}

export default {
	show
};
