<template>
  <div class="animation-balls">
    <div class="demon-area">
      <div class="demon-body"><div class="demon-eye"></div></div>
    </div>
    <div class="balls-area">
      <div class="face">
        <div class="eye"></div>
        <div class="pop pop-2">+1</div>
        <div class="pop pop-5">+1</div>
        <div class="pop pop-7">+1</div>
      </div>
      <div class="balls-hidden">
        <div class="balls">
          <div class="balls-item"></div>
          <div class="balls-item"></div>
          <div class="balls-item"></div>
          <div class="balls-item"></div>
          <div class="balls-item"></div>
          <div class="balls-item"></div>
          <div class="balls-item"></div>
          <div class="balls-item"></div>
          <div class="balls-item"></div>
          <div class="balls-item"></div>
        </div>
      </div>
    </div>
    <div class="text">请稍候...</div>
  </div>
</template>

<style lang="scss" scoped>
@import "../static/style/fn.scss";
$ballsColor: #B0A174;
$ballsEyeColor: #292929;
$ballsWidth: 50px;
$gapTime: .6s;

.animation-balls{
  display: flex;
  width: 283px;
  margin: 0 auto;
  position: relative;
  .text{
    position: absolute;
    left: 158px;
    top: 40px;
    color: $colorPrimary;
    white-space: nowrap;
  }
}
// 扭曲的恶魔
.demon-area{
  margin: 30px 10px 0;
  .demon{
    &-body{
      width: 33px;
      height: 40px;
      background: url(./static/demon.png) no-repeat center center;
      background-size: 33px;
      animation: demonMove 1s infinite alternate linear;
      position: relative;
    }
    &-eye{
      position: absolute;
      top: 11px;
      left: 8px;
      width: 17px;
      height: 4px;
      background: url(./static/demon-eye.png) no-repeat center center;
      background-size: 17px;
      animation: demonEyeMove 1s 1s infinite alternate linear;
    }
  }
}


.balls-area{
  width: 250px;
  height: 40px;
  padding-top: 30px;
  // overflow: hidden;
  position: relative;
}
// 脸部
.face{
  position: absolute;
  top: 30px;
	width: 40px;
  height: 40px;
  left: 1px;
  background: transparent;
  .eye{
    width: 4px;
    height: 4px;
    background: #292929;
    position: absolute;
    top: 10px;
    left: 20px;
    border-radius: 4px;
    z-index: 1;
  }
  &::before,&::after{
    content: "";
    position: absolute;
    width: 0;
    height: 0;
	  border-radius: 50%;
    border: 20px solid $ballsColor;
    border-right-color:transparent;
  }
  &::before{
    animation: faceUp $gapTime .2s infinite;
  }
  &::after{
    animation: faceDown $gapTime .2s infinite;
  }
}

// 豆豆
.balls-hidden{
  height: 40px;
  width: 250px;
  position: absolute;
  top: 30px;
  left: 20px;
  overflow: hidden;
  // background: rgba(255,0,0,.7);
}
.balls{
  position: absolute;
  left: -10%*7;
  width: 100%;
  height: 100%;
  overflow: hidden;
  // background: rgba(0,0,0,.7);

  &-item{
    width: 10px;
    height: 10px;
    background-color: $ballsColor;
    position: absolute;
    top: 50%;
    // transform: translateY(-50%);
    margin-top: -5px;
    right: -20px;
    border-radius: 100%;
    animation: ballMove $gapTime*10 infinite linear;

    @for $i from 1 through 10 {
      &:nth-child(#{$i}){
        animation-delay: $gapTime*$i;
        // right: 0;
        // left: -10% + 10% * $i;
      }
    }

    &:nth-child(2){
      background: url(./static/reward1.png);
      background-size: 20px;
      width: 20px;
      height: 20px;
      margin-top: -10px;
      margin-right: -5px;
      border-radius: 0;
    }
    &:nth-child(5){
      background: url(./static/reward2.png);
      background-size: 20px;
      width: 20px;
      height: 20px;
      margin-top: -10px;
      margin-right: -5px;
      border-radius: 0;
    }
    &:nth-child(7){
      background: url(./static/reward3.png);
      background-size: 20px;
      width: 20px;
      height: 20px;
      margin-top: -10px;
      margin-right: -5px;
      border-radius: 0;
    }
  }
}

// 冒泡动画
.pop{
  position: absolute;
  left: 0;
  top: -10px;
  width: 100%;
  font-size: 12px;
  text-align: center;
  opacity: 0;
  animation: popUp $gapTime*10 $gapTime infinite ease-in;
  &-2{
    animation-delay: $gapTime*5;
  }
  &-5{
    animation-delay: $gapTime*8;
  }
  &-7{
    animation-delay: $gapTime*10;
  }
}


// 咬合动画
@keyframes faceUp {
  0% {
		transform: rotate(270deg);
	}
	50% {
		transform: rotate(360deg);
	}
	100% {
		transform: rotate(270deg);
	}
}
@keyframes faceDown {
  0% {
		transform: rotate(90deg);
	}
	50% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(90deg);
	}
}


/*豆豆滚动动画帧*/
@keyframes ballMove {
  25% {
    opacity: 1;
	}
  32% {
    opacity: 0.7;
	}
  33% {
    opacity: 0;
	}
	100% {
    opacity: 0;
		transform: translateX(-250px);
	}
}


/*得分*/
@keyframes popUp {
  0% {
    opacity: 1;
    transform: scale(.8)
	}
	10% {
    opacity: 0.2;
		transform: translateY(-15px) scale(1.1);
	}
  10.5% {
    opacity: 0;
		transform: translateY(-20px) scale(1.2);
	}
}


// 扭动的恶魔
@keyframes demonMove {
  0% {
    transform: translateX(5px);
	}
  100% {
		transform: translateX(-5px);
	}
}
@keyframes demonEyeMove {
  0% {
    transform: translateX(2px);
	}
  100% {
		transform: translateX(-2px);
	}
}
</style>
