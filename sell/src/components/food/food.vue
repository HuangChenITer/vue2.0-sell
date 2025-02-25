<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-wrapper">
        <div class="image-header">
          <img :src="food.image">
          <div class="back"  @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">¥{{food.price}}</span><span v-show="food.oldPrice" class="old"></span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food"></cartcontrol>
          </div>
          <transition name="fade">
            <div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count===0">加入购物车</div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect @select="selectRating" @toggle="toggleContent" :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType,rating.text)" v-for="(rating,index) in food.ratings" :key="index" class="rating-item border-1px">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up' :rating.rateType===0,'icon-thumb_down' :rating.rateType===1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="test/ecmascript-6">
  import BScroll from 'better-scroll';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import Vue from 'vue';
  import {formatDate} from 'common/js/date';
  import split from 'components/split/split';
  import ratingselect from 'components/ratingselect/ratingselect';
  const ALL = 2;
  const POSITION = 0;
  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        // 挂载一些ratingselect常量的跟踪
        selectType: POSITION,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    methods: {
      show() {
        this.showFlag = true;
        this.selectType = ALL;
        this.onlyContent = true;
        // scroll实现的方法，配合$nextTick
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      hide() {
        this.showFlag = false;
      },
      addFirst(event) {
        if (!event._constructed) {
          return;
        }
        this.$emit('add', event.target);
        Vue.set(this.food, 'count', 1);
      },
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false;
        }
        // 是否要显示内容，如果是要显示内容但是没有内容存在的就返回false
        if (this.selectType === ALL) {
          return true;
          // 如果选择类型是全部的内容
        } else {
          return type === this.selectType;
        }
      },
      selectRating(type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      toggleContent() {
        this.onlyContent = !this.onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
        // 必须要结合nextTick异步更新，在这个地方加scroll.refresh（）是为了避免滑动回弹有问题
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .food
    position: fixed
    left:0
    top:0
    bottom:48px
    z-index:30
    width:100%
    background:#fff
    transform:translate3d(0,0,0)
    &.move-enter-active,&.move-leave-active
      transition: all 0.2s linear
    &.move-enter,&.move-leave-active
      transform:translate3d(100%,0,0)
    .image-header
      position:relative
      width: 100%
      height:0
      padding-top: 100%
      // 相当于盒子的宽度是100%，保证了盒子宽高相等
      img
        position:absolute
        top:0
        left:0
        width: 100%
        height:100%
      .back
        position: absolute
        top:10px
        left:0
        .icon-arrow_lift
          // 使得点击区域变大
          display: block
          padding:10px
          font-size:20px
          color:#fff
    .content
      position: relative
      padding:18px
      .title
        line-height: 14px
        margin-bottom: 8px
        font-size:14px
        font-weight:700
        color:rgb(7,17,27)
      .detail
        margin-bottom: 18px
        line-height: 10px
        height:10px
        font-size:0
        // 下面两个元素是inline-block布局，所以设置父元素的font-size为0
        .sell-count,.rating
          font-size:10px
          color:rgb(240,20,20)
        .sell-count
          margin-right: 12px
      .price
        font-weight: 700
        line-height: 24px
        .now
          mragin-right: 8px
          font-size: 14px
          color: rgb(240, 20, 20)
        .old
          text-decoration: line-through
          font-size: 10px
          color: rgb(147, 153, 159)
      .cartcontrol-wrapper
        position: absolute
        right:12px
        bottom:12px
      .buy
        position: absolute
        bottom:18px
        right:18px
        z-index: 10
        // z-index设置为10，是为了盖住cartcontrol组件
        line-height:24px
        padding:0 12px
        box-sizing:border-box
        font-size:10px
        border-radius:12px
        font-size:10px
        color: #fff
        background:rgb(0,160,220)
        opacity:1
        &.fade-enter-active,&.fade-leave-active
          transition: all 0.2s
        &.fade-enter,&.fade-leave-active
          opacity:0
          z-index:-1
    .info
      padding:18px
      .title
        line-height: 14px
        margin-bottom: 6px
        font-size:14px
        color:rgb(7,17,27)
        font-weight:700
      .text
        padding:8px
        line-height:24px
        font-size:12px
        color:rgb(77,85,93)
    .rating
      padding-top: 18px
      .title
        line-height: 14px
        margin-left: 18px
        font-size:14px
        color:rgb(7,17,27)
        font-weight:700
      .rating-wrapper
        padding:0 18px
        .rating-item
          position: relative
          padding:16px 0
          border-1px(rgba(7,17,27,0.1))
          .user
            position: absolute
            right:0
            top:16px
            line-height: 12px
            font-size:0
            .name
              display: inline-block
              vertical-align: top
              font-size: 10px
              color: rgb(147,153,159)
              margin-right: 6px
            .avatar
              border-radius:50%
          .time
            margin-bottom: 6px
            line-height:12px
            font-size:10px
            color:rgb(147,153,159)
          .text
            line-height:16px
            font-size:12px
            color: rgb(7,17,27)
            .icon-thumb_up,.icon-thumb_down
              margin-right: 4px
              line-height:16px
              font-size:12px
            .icon-thumb_up
              color:rgb(0,160,220)
            .icon-thumb_down
              color:rgb(147,153,159)
        .no-rating
          padding:16px
          font-size:12px
          color:rgb(147,153,159)
</style>
