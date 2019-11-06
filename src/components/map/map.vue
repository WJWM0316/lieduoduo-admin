<template>
  <!--地图选择-->
    <div class="pop">
      <div class="addAdressBox">
        <div id="map" style="width:500px; height:400px"></div>
        <div class="searchBox">
          <input class="textbox searchMap" placeholder="请输入包含市名的地址" type="textbox" v-model="keyword"  @keyup.enter="searchKeyword">
          <input class="btn" type="button" value="搜索" @click="searchKeyword">
          <div style='width: 380px; height: 180px' id="infoDiv" @click.stop="clickAdress"></div>
        </div>
        <div class="nowPosi">
          <div class="address"><span>地址：</span>{{nowPosiInfo.address}}</div>
          <div class="btnBox">
            <el-button @click.stop="popCancel">取消</el-button>
            <el-button @click.stop="addAdress" style="background-color: #652791; color: #FFFFFF;" v-if="nowPosiInfo.address">保存</el-button>
            <el-button disabled  type="info" v-else>保存</el-button>
          </div>
          <div class="doorplate"><span>门牌号：</span><input class="textbox" type="textbox" v-model="doorplate"></div>
        </div>
      </div>
    </div>
</template>

<script>
import mapSearch from './map'
export default mapSearch
</script>

<style lang="less" scoped="scoped">
.pop {
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.8);
  width: 100%;
  height: 100%;
  z-index: 10000;
  .addAdressBox{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 30px;
    border-radius: 10px;
    width: 900px;
    height: 500px;
    background-color: #FFFFFF;
    #map{
      float: left;
      margin-right: 10px;
      margin-bottom: 20px;
    }
    .searchBox {
      float: left;
      input {
        border: 1px solid #CCCCCC;
        border-radius: 5px;
        margin-right: 10px;
        padding: 5px;
      }
      .searchMap{
        width: 300px;
      }
      #infoDiv{
        text-align: left;
      }
    }
    .nowPosi {
      padding: 20px 0;
      clear: both;
      width: 100%;
      border-top: 1px solid #CCCCCC;
      .address {
        color: #652791;
        width: 400px;
        text-align: left;
        float: left;
        span{
          color: #929292;
        }
      }
      .doorplate {
        margin-right: 20px;
        float: right;
        input {
          border: 1px solid #CCCCCC;
          border-radius: 5px;
          margin-right: 10px;
          padding: 5px;
        }
      }
      .btnBox {
        float: right;
      }
    }
  }
}
</style>
