<template>
  <div>

    <section class="mod">
      <div class="mod-title">
        <em>inputtingChinese</em>
      </div>
      <input type="text" placeholder="输入汉字" :value="chineseText" @input="handleChineseInput" @compositionstart="handleChineseInputStart" @compositionend="handleChineseInputEnd">
    </section>

    <section class="mod">
      <div class="mod-title">
        <em>v-loading-balls</em>
      </div>
      <v-loading-balls></v-loading-balls>
    </section>

    <section class="mod">
      <div class="mod-title">
        <em>v-flaot</em>
      </div>
      <v-float class="modFloat" fixedDirection="left">
        <h1 class="innerAnchor">Mouse on me!</h1>
        <div slot="float" class="innerFloat">
          <p>Show float content</p>
          <p>Look at me!</p>
        </div>
      </v-float>
    </section>


    <v-adsorb>
        <div>sticky 粘性布局</div>
    </v-adsorb>

    <section class="mod">
      <div class="mod-title">
        <em>v-button</em>
      </div>
      <div class=""></div>
      <v-button :disable="false" @click="handleButtonClick(...arguments, 77)">click me please!</v-button>
      <br />
      <v-button @click="handleScrollTo">test scroll</v-button>
      <br />
      <v-button>v-button</v-button>
      <br />
      <v-button typeStyle="primary">v-button typeStyle="primary"</v-button>
      <br />
      <v-button typeStyle="default">v-button typeStyle="default"</v-button>
      <br />
      <v-button typeStyle="primary" :disable="true">v-button typeStyle="primary" :disable="true"</v-button>
      <br />
      <v-button typeStyle="default" :disable="true">v-button typeStyle="default" :disable="true"</v-button>
      <br/>
      <v-button typeStyle="primary" :mini="true">v-button typeStyle="primary"</v-button>
      <br />
      <v-button typeStyle="default" :mini="true">v-button typeStyle="default"</v-button>
      <br />
    </section>

    <section class="mod" ref="secInputNumber">
      <div class="mod-title">
        <em>v-input-number</em>
      </div>
      <v-input-number v-model="personCount" ref="inputPersonCount"></v-input-number>
    </section>

    <section class="mod">
      <div class="mod-title">
        <em>v-input-calendar</em>
      </div>
      <button @click="handleChangeCheckInOut">change checkInOut</button>
      <v-input-calendar v-model="checkInOut" @dateSelected="handleCheckInOutSelected" @clear="handleCheckInOutClear" :rule="calendarRule"></v-input-calendar>
    </section>

    <section class="mod">
      <div class="mod-title">
        <em>v-picker-datetime</em>
        <span></span>
      </div>
      <v-picker-datetime ref="selectBirth" v-model="birth" :range="range" :require="true" :readonly="false"></v-picker-datetime>
      <button @click="birth = new Date(2017, 2, 2)">change birth</button>
    </section>

    <section class="mod">
      <div class="mod-title">
        <em>v-input</em>
        <span></span>
      </div>
      <v-input ref="inputMobile" v-model="mobile" :rule="'required|regex:^[1-9][0-9]{10}$'" name="手机号" placeholder="国内手机号" @invalid="handleInvalid"></v-input>
      <v-input ref="inputMobile" v-model="mobile" :rule="'required|regex:^[1-9][0-9]{10}$'" name="手机号" placeholder="国内手机号" @invalid="handleInvalid" :readonly="true" :disabled="true"></v-input>
    </section>

    <section class="mod">
      <div class="mod-title">
        <em>v-input-imagecode</em>
      </div>
      <v-input-imagecode ref="inputImageCode" v-model="imagecodeValue" imageUrl="//www.vashare.com/webapi/home/GetVerificationImage" @invalid="handleInvalid"></v-input-imagecode>
    </section>


    <section class="mod">
      <div class="mod-title">
        <em>v-input-verifycode</em>
        <span></span>
      </div>
      <v-input-verifycode ref="inputVerifycode" v-model="verifycodeValue" @sendVerifyCode="handleSendVerifyCode" @invalid="handleInvalid"></v-input-verifycode>
    </section>

    <section class="mod">
      <div class="mod-title">
        <em>v-input-password</em>
      </div>
      <div @click="handleSwitchConfirmPassword">switch confirm password</div>
      <v-input-password ref="inputPassword" v-model="password" :enableConfirmCheck="enableConfirmCheck" @invalid="handleInvalid">
        <div slot="title-password">输入密码</div>
        <div slot="title-confirm">再次输入</div>
      </v-input-password>
    </section>

    <section class="mod">
      <div class="mod-title">
        <em>v-input-select</em>
        <span></span>
      </div>
      <v-input-select ref="selectID" v-model="selectOption" name="证件类型" :enableInput="true" :rule="'required'" @invalid="handleInvalid" :options="selectOptions" placeholder="请选择证件类型"></v-input-select>
    </section>

    <section class="mod">
      <div class="mod-title">
        <em>v-paging</em>
        <span></span>
      </div>
      <v-paging ref="vPaging" @loadPage="handleLoadPage" :pageIndex="pageIndex" :totalPageCount="pagingTotalCount"></v-paging>
      <button @click="pageIndex = 0">change page index</button>
      <button @click="pagingTotalCount = 10">change page total count</button>
      <button @click="handleInitPaging">init paging control</button>
    </section>

    <section class="mod">
      <div class="mod-title">
        <em>message</em>
        <span></span>
      </div>
      <button @click="handleShowMessageBox">show message box</button>
      <button @click="showDialog = true">show dialog</button>
      <v-dialog :show="showDialog" @close="showDialog = false">
        <div slot="title">dialog title</div>
        <div style="width: 800px; height: 300px;">
          <button @click="showDialog1 = true">show dialog1</button>
        </div>
      </v-dialog>
      <v-dialog :show="showDialog1" @close="showDialog1 = false">
        <div slot="title">dialog1 title</div>
        <div style="width: 600px; height: 250px;">
          <button @click="handleShowMessageBox1">show message box1</button>
        </div>
      </v-dialog>
    </section>


    <section class="mod">
      <div class="mod-title">
        <em>toast</em>
        <span></span>
      </div>
      <div  @click="handleShowMessageBox1">asdasas</div>
    </section>

    <button @click="handleSubmit">submit</button>

    <!-- <v-paging @loadPage="handleLoadPage"></v-paging> -->



    <section class="mod">
      <div class="sticky-area">
        <v-adsorb>
          <div class="">sticky 粘性布局</div>
        </v-adsorb>
        <div class="sticky">sticky 粘性布局</div>
        <div class="scroll-block">A</div>
        <div class="scroll-block">B</div>
      </div>
      <div class="scroll-block">C</div>
    </section>
  </div>

</template>

<script>
import { screenManager } from '../index';

export default {
  name: 'demo',
  data() {
    return {
      chineseText: '',
      inputtingChinese: false,
      personCount: 0,
      checkInOut: {
        startDate: null,
        endDate: null
      },
      birth: new Date(2010, 0, 1),
      range: {
        start: new Date(2000, 5, 5),
        end: new Date(2020, 4, 25)
      },
      mobile: '',
      password: '',
      imagecodeValue: '',
      verifycodeValue: '',
      enableConfirmCheck: false,
      pageIndex: 4,
      pagingTotalCount: 100,
      showDialog: false,
      showDialog1: false,
      msgBoxIndex: 1,
      selectOption: null,
      selectOptions: [
        {
          value: 1,
          text: '身份证'
        },
        {
          value: 2,
          text: '护照'
        },
        {
          value: 4,
          text: '港澳通行证'
        },
        {
          value: 6,
          text: '军官证'
        }
      ],
      loopManager: null,
      calendarRule: {
        max(s, e) {
          let span = e - s;
          if (span / 86400000 > 30) {
            this.$vToast.show({
              message: '选择日期不能超过30天'
            });
            return false;
          }
        }
      }
    };
  },
  mounted() {
    //添加自定义的校验
    this.$refs.inputMobile.addValidateCallback(() => {
      return new Promise((resolve, reject) => {
        if (this.mobile === '18610567085') {
          resolve();
        }
        else {
          reject(new Error('不是我本人的手机'));
        }
      });
    });
  },
  methods: {
    handleButtonClick(e, x, y) {
      console.log(arguments);
      console.log(e);
      console.log(x);
      console.log(y);
    },
    handleChangeCheckInOut() {
      this.checkInOut = {
        startDate: new Date(2017, 12, 1),
        endDate: new Date(2017, 12, 15)
      };
    },
    handleCheckInOutSelected(e) {
      console.log(e);
    },
    handleCheckInOutClear() {
      console.log('clear');
    },
    handleInitPaging() {
      this.pagingTotalCount = 20;
      this.pageIndex = 3;
      this.$vToast.show({
        message: 'handleInitPaging',
        onClosed() {
          console.log('handleInitPaging message close');
        }
      });
    },
    handleShowMessageBox() {
      this.$vMessageBox.show({
        message: 'test message',
        buttons: [
          {
            caption: '确认',
            type: 'ss',
            onClick() {
              console.log('click OK');
            }
          },
          {
            caption: '取消',
            type: 'cc',
            onClick() {
              console.log('click Cancel');
            }
          }
        ],
        onClosed() {
          console.log('message box close');
        }
      });
    },
    handleShowMessageBox1() {
      this.msgBoxIndex += 1;
      this.$vMessageBox.show({
        message: `test message ${this.msgBoxIndex}`,
        buttons: [
          {
            caption: 'continue',
            onClick: () => {
              this.handleShowMessageBox1();
              return false;
            }
          },
          {
            caption: 'toast',
            onClick: () => {
              this.handleToast();
              // this.handleToast();
              // this.handleToast();
              // this.handleToast();
              return false;
            }
          }
        ],
        onClosed: () => {
          this.msgBoxIndex -= 1;
        }
      });
    },
    handleToast() {
      this.$vToast.show({
        message: 'loop toast'
      });
    },
    handleInvalid(e) {
      e.cancelDefault();
      this.$vToast.show({
        message: e.message
      });
    },
    handleSwitchConfirmPassword() {
      this.enableConfirmCheck = !this.enableConfirmCheck;
    },
    handleSendVerifyCode(e) {
      console.log('handleSendVerifyCode');
      e.returnResult();
    },
    handleSubmit() {
      this.checkInput().then(() => {
        console.log('success');
      }).catch(error => {
        console.log(error);
      });
    },
    async checkInput() {
      // await this.$refs.inputMobile.getValidResult();
      // await this.$refs.inputImageCode.getValidResult();
      // await this.$refs.inputPassword.getValidResult();
      // await this.$refs.inputVerifycode.getValidResult();
      // await this.$refs.selectID.getValidResult();
      await this.$refs.selectBirth.getValidResult();
    },
    handleLoadPage(pageIndex) {
      console.log(`load page ${pageIndex}`);
    },
    handleScrollTo(e) {
      // screenManager.scrollTo({ x: this.$refs.inputPersonCount });
      // or:
      screenManager.scrollToPromise(this.$refs.inputPersonCount).then(() => {
        console.log('scroll complete!');
      }).catch(error => {
        console.log(error);
      });
      // if (this.loopManager) {
      //   this.loopManager.cancel();
      //   this.loopManager = null;
      // }
      // else {
      //   this.loopManager = screenManager.loopAnimationFrame(timestamp => {
      //     console.log(timestamp);
      //   });
      // }
      e.hideLoading();
    },
    handleChineseInput(e) {
      this.$nextTick(() => {
        if (!this.inputtingChinese) {
          let text = e.target.value;
          console.log(text);
          alert(text);
        }
      });
    },
    handleChineseInputStart() {
      this.inputtingChinese = true;
    },
    handleChineseInputEnd() {
      this.inputtingChinese = false;
    }
  }
};
</script>



<style lang="scss">
@import "../static/style/_resetMobileBrowser.scss";
html{
  background: #eee;
}
.mod{
  margin: 15px auto;
  padding: 20px 30px;
  background: #fff;
  max-width: 960px;
  &-title{
    margin-bottom: 15px;
    font-size: 14px;
    color: #666;
    user-select: all;
    em{
      font-size: 24px;
      margin-right: 40px;
    }
  }
}
</style>

<style>
.modFloat {
  top: 800px;
  left: 590px;
  width: 150px;
}
.innerFloat {
  width: 300px;
  height: 300px;
}
.sticky{
  position: sticky;
  top: 0;
  left: 0;
  background: #292929;
  line-height: 60px;
  color: #fff;
}
.scroll-block{
  height: 1500px;
  margin-bottom: 30px;
  background: #f7f7f7;
}
</style>
