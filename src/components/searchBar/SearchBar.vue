<template>
  <div class="search_wrap" :style="{ width: `${width}px` }" >
    <input type="search" class="control" ref="control" :placeholder="placeholder" v-model="keyword" @input="handleInput" @keypress.enter="handleSearch">
    <button type="button" class="search u-btn" @click="handleSearch"><i class="u-icon-search no-offset"></i></button>
  </div>
</template>

<script>
import SearchBar from './searchBar'
export default SearchBar
</script>

<style lang="less" scoped>
.search_wrap {
  display: block;
  width: 300px;
  font-size: 0;
  vertical-align: middle;
  border-radius: 50px;
  border: solid 1px rgba(220,220,220,1);
  position: relative;
  .control {
    flex: 1 1 auto;
    padding: 0 10px 0 0px;
    height: 38px;
    box-sizing: border-box;
    border-right: none;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
    font-size: 14px;
  }

  .search {
    flex: 0 0 auto;
    padding: 9px;
    background: rgba(220,220,220,1);
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
    font-size: 0;
    line-height: 1;
    position: absolute;
    right: 10px;
    top: 10px;

    &:hover {
      background-color: #ccc;
    }
  }
}
</style>
