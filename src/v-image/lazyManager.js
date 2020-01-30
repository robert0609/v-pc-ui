
let watchSet = new Set();

function handleScroll() {
	let scrollTop = getCurrentScrollTop();
	let windowHeight = document.documentElement.clientHeight;
	let scrollBottom = scrollTop + windowHeight;
	let viewportTop = scrollTop - windowHeight / 2;
	let viewportBottom = scrollBottom + windowHeight / 2;
	for (let loop of watchSet) {
		//判断是否该元素滚动到了可视范围之内
		if (viewportTop <= loop.bottom && viewportBottom >= loop.top) {
			loop.load();
		}
	}
}

function loadSingleImage(vImage) {
	let scrollTop = getCurrentScrollTop();
	let windowHeight = document.documentElement.clientHeight;
	let scrollBottom = scrollTop + windowHeight;
	let viewportTop = scrollTop - windowHeight / 2;
	let viewportBottom = scrollBottom + windowHeight / 2;
	//判断是否该元素滚动到了可视范围之内
	if (viewportTop <= vImage.bottom && viewportBottom >= vImage.top) {
		vImage.load();
	}
}

function getCurrentScrollTop() {
	let scrollTop = document.documentElement.scrollTop;
	if (scrollTop == 0) {
		scrollTop = document.body.scrollTop;
	}
	return scrollTop;
}

export default {
	watch(vImage) {
		if (watchSet.size === 0) {
			window.addEventListener('scroll', handleScroll);
		}
		watchSet.add(vImage);
		loadSingleImage(vImage);
	},
	unwatch(vImage) {
		if (watchSet.has(vImage)) {
			watchSet.delete(vImage);
		}
		if (watchSet.size === 0) {
			window.removeEventListener('scroll', handleScroll);
		}
	}
};
