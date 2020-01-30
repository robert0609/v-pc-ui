/**
* 主模块文件
*/
import 'babel-polyfill';

import vAdsorb from './v-adsorb/v-adsorb.vue';
import vButton from './v-button/v-button.vue';
import vInput from './v-input/v-input.vue';
import vInputImageCode from './v-input-imagecode/v-input-imagecode.vue';
import vInputVerifyCode from './v-input-verifycode/v-input-verifycode.vue';
import vInputPassword from './v-input-password/v-input-password.vue';
import vInputNumber from './v-input-number/v-input-number.vue';
import vInputSelect from './v-input-select/v-input-select.vue';
import vImage from './v-image/v-image.vue';
import vPaging from './v-paging/v-paging.vue';
import vToast from './v-message';
import vMessageBox from './v-modal';
import vDialog from './v-dialog/v-dialog.vue';
import vPickerDatetime from './v-picker-datetime/v-picker-datetime.vue';
import vUploader from './v-input-image-uploader/v-input-image-uploader.vue';
import vFloat from './v-float/v-float.vue';
import vCalendar from './v-calendar/v-calendar.vue';
import vInputCalendar from './v-input-calendar/v-input-calendar.vue';

import mouseManager from './common/mouseManager';
import screenManager from './common/screenManager';
import loadingBalls from './v-loading-balls/v-loading-balls.vue';

export default {
  install(Vue) {
    Vue.component('v-adsorb', vAdsorb);
    Vue.component('v-button', vButton);
    Vue.component('v-input', vInput);
    Vue.component('v-input-imagecode', vInputImageCode);
    Vue.component('v-input-verifycode', vInputVerifyCode);
    Vue.component('v-input-password', vInputPassword);
    Vue.component('v-input-number', vInputNumber);
    Vue.component('v-input-select', vInputSelect);
    Vue.component('v-image', vImage);
    Vue.component('v-paging', vPaging);
    Vue.component('v-dialog', vDialog);
    Vue.component('v-picker-datetime', vPickerDatetime);
		Vue.component('v-input-image-uploader', vUploader);
    Vue.component('v-float', vFloat);
    Vue.component('v-calendar', vCalendar);
    Vue.component('v-input-calendar', vInputCalendar);
    Vue.component('v-loading-balls', loadingBalls);

		Vue.prototype.$vToast = vToast;
		// Vue.prototype.$vMessageBox = vMessageBox;
    Object.defineProperty(Vue.prototype, '$vMessageBox', {
      get: function () {
        vMessageBox.__vHostParent = this.$el;
        return vMessageBox;
      }
    });
  }
};

export { mouseManager, screenManager };
