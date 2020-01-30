
function urlCanNotBeEmpty() {
	throw new Error('url is empty!');
}

export default {
  load({
    url = urlCanNotBeEmpty(),
    onLoad = function () {},
    onError = function () {}
  }) {
    let img = document.createElement('img');
    img.onload = onLoad;
    img.onerror = onError;
    img.src = url;
  },
  loadPromise(url) {
    return new Promise((resolve, reject) => {
      this.load({
        url,
        onLoad() {
          resolve();
        },
        onError() {
          reject();
        }
      });
    });
  }
};
