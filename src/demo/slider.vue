<template>
  <div>
    <section class="mod">
      <div class="mod-title">
        <em>slider demo</em>
      </div>
      <div id="main">
        <tiny-slider ref="sliderMain" :loop="true" :lazyload="true" :fixedWidth="700" :items="1" :gutter="10" :controls="false" :nav="false" @indexChanged="handleIndexChangedMain">
          <div v-for="(it, index) in imageList" :key="index" class="item-main">
            <div :data-src="it" class="tns-lazy-img" style="height: 525px; width: 700px;"></div>
          </div>
        </tiny-slider>
      </div>
      <div id="nav">
        <button class="button" @click="handleUp">UP</button>
        <div id="sliderDiv">
          <tiny-slider ref="slider" axis="vertical" :loop="true" :lazyload="true" :items="5" :gutter="10" :controls="false" :nav="false" @indexChanged="handleIndexChanged" @click.native="handleSwitchTo">
            <div v-for="(it, index) in imageList" :key="index" class="item">
              <div :data-src="it" class="item tns-lazy-img" :data-index="index"></div>
            </div>
          </tiny-slider>
        </div>
        <button class="button" @click="handleDown">DOWN</button>
      </div>
    </section>
  </div>
</template>

<script>
import tinySlider from 'v-tiny-slider';
import 'v-tiny-slider/dist/vSlider.min.css';

const imageListString = '["//pic.bvt.vashare.com/upload/default/day_170817/thumb/201708170154545605_700_525.jpg","//pic.bvt.vashare.com/upload/Resort/day_170812/thumb/201708120836336168_700_525.jpg","//pic.bvt.vashare.com/upload/Resort/day_170812/thumb/20170812083634213_700_525.jpg","//pic.bvt.vashare.com/upload/Resort/day_170812/thumb/201708120836375966_700_525.jpg","//pic.bvt.vashare.com/upload/Resort/day_170812/thumb/201708120836399055_700_525.jpg","//pic.bvt.vashare.com/upload/Resort/day_170812/thumb/201708120836412343_700_525.jpg","//pic.bvt.vashare.com/upload/Resort/day_170812/thumb/201708120836423595_700_525.jpg", "//image-cdn.didatravel.com/Image/CN/109211/HD/Featured Image/2691245_131_z.jpg"]';

// const imageListString = '["//pavo.elongstatic.com/ihotel_848_470_all/00079V3s.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079V3H.jpg","//pavo.elongstatic.com/ihotel_848_470_all/000aPqt9.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079V3w.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079XbA.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079XbQ.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079Xbz.jpg","//pavo.elongstatic.com/ihotel_848_470_all/000aPqt6.jpg","//pavo.elongstatic.com/ihotel_848_470_all/000aPqt7.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079V3x.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079XbZ.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079XbP.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079V3p.jpg","//pavo.elongstatic.com/ihotel_848_470_all/0003YJEA.jpg","//pavo.elongstatic.com/ihotel_848_470_all/000482yb.jpg","//pavo.elongstatic.com/ihotel_848_470_all/000479Eg.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079XbC.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079V3u.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079XbE.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079XbM.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079V3t.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079V3A.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079XbI.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079V3z.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079XbS.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079V3F.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079XbU.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079V3h.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079XbG.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079XbB.jpg","//pavo.elongstatic.com/ihotel_848_470_all/000aPpif.jpg","//pavo.elongstatic.com/ihotel_848_470_all/000aPqta.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079V3K.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079V3L.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079XbL.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079Xc0.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079XbR.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079V3O.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079V3C.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079XbY.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079V3r.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079V3j.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079V3G.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079Xcg.jpg","//pavo.elongstatic.com/ihotel_848_470_all/000aPqtd.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079XbO.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079XbK.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079V3i.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079Xc2.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079XbV.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079V3m.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079Xc3.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079XbX.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079V3D.jpg","//pavo.elongstatic.com/ihotel_848_470_all/00079XbW.jpg"]';

export default {
  name: 'slider',
  data() {
    return {
      imageList: JSON.parse(imageListString),
      currentHighLightIndex: 0,
      slideCount: 0
    };
  },
  components: {
    tinySlider
  },
  mounted() {
    let info = this.$refs.slider.getInfo();
    this.currentHighLightIndex = info.index;
    this.slideCount = info.slideCount;
    console.log(this.$refs.sliderMain.getInfo());
  },
  methods: {
    handleSwitchTo(e) {
      let clickImg = e.target;
      let imageListIndex = Number(clickImg.dataset.index);
      let idx = this.currentHighLightIndex % this.slideCount;
      let offset = imageListIndex - idx;
      if (offset < 0) {
        offset += this.slideCount;
      }
      let targetIndex = this.currentHighLightIndex + offset;
      this.$refs.slider.goTo(targetIndex);
      this.$refs.sliderMain.goTo(targetIndex);
    },
    handleIndexChanged(info) {
      // this.$refs.sliderMain.goTo(info.index);
      this.currentHighLightIndex = info.index;
    },
    handleIndexChangedMain(info) {
    },
    handleUp() {
      this.$refs.slider.goTo('prev');
      this.$refs.sliderMain.goTo('prev');
    },
    handleDown() {
      this.$refs.slider.goTo('next');
      this.$refs.sliderMain.goTo('next');
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
#main{
  position: absolute;
  width: 700px;
}
#nav{
  position: relative;
  left: 720px;
  width: 140px;
}
/* .item-main{
  width: 700px;
  height: 525px;
} */
.item{
  width: 140px;
  height: 105px;
}
#nav .tns-item.tns-slide-active{
  border-style: solid;
  border-color: yellow;
}
.button{
  margin: 10px;
}
/* .tns-nav {
  text-align: center;
  margin: 10px 0;
}
.tns-nav > [aria-controls] {
  width: 9px;
  height: 9px;
  padding: 0;
  margin: 0 5px;
  border-radius: 50%;
  background: #ddd;
  border: 0;
}
.tns-nav > [aria-selected="true"] { background: #999; } */
</style>
