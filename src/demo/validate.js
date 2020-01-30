import Vue from 'vue';
import VeeValidate, { Validator } from 'vee-validate';
import zh_CN from 'vee-validate/dist/locale/zh_CN';

/**
 * vee-validate@2.0.0-rc.7
 */
// Validator.addLocale(zh_CN);

// //修改默认错误提示
// const dictionary = {
//   zh_CN: {
//     messages: {
//       confirmed: () => '密码输入不一致，请重试',
//       required: (field) => `请输入${field}`,
//       regex: (field) => `${field}格式无效`,
//       min: (field, [length]) => `${field}必须至少${length}个字符`,
//       max: (field, [length]) => `${field}至多只能${length}个字符`,
//       email: () => '请输入正确的邮箱地址'
//     },
//     custom: {
//       password: {
//         regex: '请输入格式为6-20位字母或数字的密码，请重试'
//       }
//     }
//   }
// };
// //updateDictionary必须在addLocale之后调用，否则修改默认错误提示不生效
// Validator.updateDictionary(dictionary);

// const config = {
//   locale: 'zh_CN'
// };

// Vue.use(VeeValidate, config);
/* end */

//修改默认错误提示
const dictionary = {
  zh_CN: {
    messages: {
      confirmed: () => '密码输入不一致，请重试',
			required: (field) => `请输入${field}`,
			regex: (field) => `${field}格式无效`,
			min: (field, [length]) => `${field}必须至少${length}个字符`,
			max: (field, [length]) => `${field}至多只能${length}个字符`,
			email: () => '请输入正确的邮箱地址'
		},
		custom: {
			password: {
				regex: '请输入6-20位字母或数字的密码'
			},
			originalPassword: {
				regex: '请输入6-20位字母或数字的原始密码'
      },
      totalOriginalPrice: {
        regex: '房费总价的小数部分最多可输入2位'
      },
      totalOriginalTaxFee: {
        regex: '税费/服务费的小数部分最多可输入2位'
      }
		}
  }
};
Validator.localize('zh_CN', zh_CN);
Validator.localize('zh_CN', dictionary.zh_CN);

Vue.use(VeeValidate);
