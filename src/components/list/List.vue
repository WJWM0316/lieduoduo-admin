<template>
  <div class="m-list">
    <slot name="list-top"></slot>
    <div class="list-main">
      <!-- 可默认插入整个表格内容，也可单独指定columns插槽插入自定义列表内容 -->
      <slot>
        <el-table
          ref="table"
          border
          :height="height || undefined"
          :data="list"
          :empty-text="emptyText"
          :default-sort="defaultSort"
          :row-class-name="tableRowClassName"
          tooltip-effect="dark"
          @sort-change="handleSortChange"
          @filter-change="handleFilterChange"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="49" align="center" v-if="selectable"></el-table-column>
          <el-table-column
            :key="field.prop"
            :prop="field.prop"
            :column-key="field.prop"
            :label="field.label"
            :align="field.align || 'center'"
            :width="field.width"
            :min-width="field.minWidth"
            :fixed="field.fixed"
            :sortable="field.sortable"
            :filters="field.filters && field.filters.length > 0 ? field.filters : undefined"
            :filter-multiple="field.filterMiltiple || false"
            :show-overflow-tooltip="field.singleLine || undefined"
            v-for="field in fields"
          >
            <template slot-scope="scope">
              <slot name="columns" :scope="scope">{{scope.row[scope.column.property]}}</slot>
            </template>
          </el-table-column>
        </el-table>
      </slot>
    </div>
    <slot name="list-bottom">
      <footer class="list-footer" v-if="hasPagination" v-show="total > 0">
        <el-pagination
          :layout="paginationLayout"
          :current-page="page"
          :page-size="pageSize"
          :total="total"
          @current-change="handlePageChange"
        >
          <span class="total">共 {{pageCount}} 页，{{total}} 条记录</span>
        </el-pagination>
      </footer>
    </slot>

    <slot name="extend"></slot>
  </div>
</template>

<script>
import List from './list'
export default List
</script>

<style lang="less" scoped>

.el-table .warning-row {
  background: oldlace;
}
.m-list {
  position: relative;
  padding: 20px 0px 80px 0px;
  /*width: 100%;*/
  max-width: 100%;
  min-height: 100%;

  .list-footer {
    text-align: center;
    box-sizing: border-box;
    z-index: 200;
    position: fixed;
    left: 200px;
    bottom: 0;
    padding-left: 200px;
    padding: 8px;
    padding-left: 52px;
    width: 100%;
    background-color: #ffffff;
    box-shadow: 0px -1px 0px 0px rgba(232, 233, 235, 1);
    border: 1px solid #e8e9eb;
  }
}
</style>
