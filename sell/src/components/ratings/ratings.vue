<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect @select="selectRating" @toggle="toggleContent" :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="ratings"></ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li  v-show="needShow(rating.rateType,rating.text)" v-for="(rating,index) in ratings" :key="index" class="rating-item border-1px">
            <div class="avatar">
              <img width="28" height="28" :src="rating.avatar">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span v-show="rating.deliveryTime" class="delivery">{{rating.deliveryTime}}</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span class="item" v-for="(item,index) in rating.recommend" :key="index">{{item}}</span>
              </div>
              <div class="time">
                {{rating.rateTime | formatDate}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="test/ecmascript-6">
  import star from 'components/star/star';
  import split from 'components/split/split';
  import ratingselect from 'components/ratingselect/ratingselect';
  import BScroll from 'better-scroll';
  import {formatDate} from 'common/js/date';
  const ALL = 2;
  const ERR_OK = 0;
  export default{
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        ratings: [],
        selectType: ALL,
        onlyContent: true
      };
    },
    created() {
      this.$http.get('/api/ratings').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.ratings = response.data;
          this.$nextTick(() => {
            this.scroll = new BScroll(this.$refs.ratings, {
              click: true
            });
          });
        }
      });
    },
    methods: {
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
      star,
      ratingselect,
      split
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .ratings
    position: absolute
    top:174px
    bottom:0
    width:100%
    left:0
    overflow:hidden
    .overview
      display:flex
      padding:18px 0
      .overview-left
        flex:0 0 137px
        padding:6px 0
        border-left:1px solid rgba(7,17,27,0.1)
        text-align: center
        // 考虑到iphon5屏幕小的情况
        @media only screen and (max-width: 320px)
          flex:0 0 120px
          width:120px
        .score
          margin-bottom: 6px
          line-height:28px
          font-size:24px
          color:rgb(155,153,0)
        .title
          margin-bottom: 8px
          line-height:12px
          font-size:12px
          color:rgb(7,17,27)
        .rank
          line-height:10px
          font-size:10px
          color:rgb(147,153,159)
      .overview-right
        flex:1
        padding: 6px 0 6px 24px
        @media only screen and (max-width: 320px)
          padding-left: 6px
        .score-wrapper
          margin-bottom: 8px
          font-size:0
          .title
            display: inline-block
            line-height: 18px
            vertical-align: top
            font-size:12px
            color:rgb(7,17,27)
          .star
            display: inline-block
            margin:0 12px
            vertical-align: top
          .score
            display: inline-block
            line-height: 18px
            vertical-align: top
            font-size:12px
            color:rgb(255,153,0)
        .delivery-wrapper
          font-size:0
          // 这个地方没有让每一个元素都vertical-align设置为top对齐，是因为两块内容都是文字，默认垂直方向对齐
          .title
            line-height: 18px
            font-size:12px
            color:rgb(7,17,27)
          .delivery
            margin-left:12px
            font-size:12px
            color:rgb(147,153,159)
    .rating-wrapper
      padding:0 18px
      .rating-item
        display:flex
        padding:18px 0
        border-1px(rgba(7,17,27,0.1))
        .avatar
          flex:0 0 28px
          width:28px
          margin-right: 12px
          img
            border-radius:50%
        .content
          position: relative
          flex:1
          .name
            margin-bottom: 4px
            line-height:12px
            font-size:10px
            color:rgb(7,17,27)
          .star-wrapper
            margin-bottom: 6px
            font-size:0
            .star
              display: inline-block
              margin-right: 6px
              vertical-align: top
            .delivery
              display: inline-block
              vertical-align: top
              line-height:12px
              font-size:10px
              color:rgb(147,153,159)

          .text
            margin-bottom: 8px
            line-height:18px
            color:rgb(7,17,27)
            font-size:12px
          .recommend
            line-height:16px
            font-size:0
            .icon-thumb_up, .item
              display:inline-block
              margin:0 8px 4px 0
              font-size:9px
            .icon-thumb_up
              color:rgb(0,160,220)
            .item
              padding:0 6px
              border:1px solid rgba(7,17,27,0.1)
              border-radius:1px
              color:rgb(147,153,159)
              background: #fff
          .time
            position: absolute
            top:0
            right:18px
            line-height:12px
            font-size:10px
            color:rgb(147,153,159)
</style>
