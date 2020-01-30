import Vue from 'vue';

let stack = [];

function push(vueInstance) {
	stack.push(vueInstance);
	let currentZIndex = stack.length - 1;
	Vue.nextTick(() => {
		vueInstance.zIndex(currentZIndex);
  });
  // console.log(`push stack length: ${stack.length}`);
}

function remove(vueInstance) {
  let idx = stack.findIndex(elem => elem === vueInstance);
  if (idx > -1) {
    stack.splice(idx, 1);
    // console.log(`remove stack length: ${stack.length}`);
  }
}

export default {
  push,
  remove
};
