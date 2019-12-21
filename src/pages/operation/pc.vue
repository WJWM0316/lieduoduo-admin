<template>
	<div id="pc-banner">
    <div class="table-box">
      <table id="table" class="my_table">
        <tr
          v-for="(trNode, trNodeIndex) in table"
          :key="trNodeIndex"
          class="ui-selectee">
          <td
            v-for="(tdNode, tdNodeIndex) in trNode"
            :key="tdNodeIndex"
            class="ui-selectee"
            :class="{'ui-selected': tdNode.selected}">
            {{tdNode.iwidth}}px-{{tdNode.iheight}}px
          </td>
        </tr>
      </table>
      <div class="mask" v-show="type">
        <span @click="merge" v-show="type === 1" class="btn-action">合并</span>
        <span v-show="type === 2" class="btn-action" @click="split">拆分</span>
      </div>
    </div>
	</div>
</template>
<script>
export default {
  data() {
    return {
      dom: '',
      table: [],
      showMergeBtn: false,
      showSplitBtn: false,
      type: 0
    }
  },
	methods: {
    create(row, column) {
      let table = []
      for(let i = 0; i < row; i++) {
        let tr = []
        for(let j = 0; j < column; j++) {
          let td = {iwidth: 0, iheight: 0, colspan: 1, rowspan: 1, selected: false, row: i, column: j}
          tr.push(td)
        }
        table.push(tr)
      }
      this.table = table
    },
    setSelectable() {
      $('#table').selectable({
        stop: (event, ui) => {
          let trNodeLists = Array.from(this.dom.getElementsByTagName('tr'))
          trNodeLists.map((trNode, trNodeIndex) => {
            let tdNodeLists = Array.from(trNode.getElementsByTagName('td'))
            tdNodeLists.map((tdNode, tdNodeIndex, tdArr) => {
              if($(tdNode).hasClass('ui-selected')) this.table[trNodeIndex][tdNodeIndex].selected = true
            })
          })
          this.type = this.dom.querySelectorAll('td.ui-selected').length > 1 ? 1: 2
        }
      })
    },
		initTable() {
      this.dom = document.querySelector('#table')
      this.setSelectable()
      this.create(4, 3)
      setTimeout(() => this.initText(), 16.7)
		},
    initText() {
      let trNodeLists = Array.from(this.dom.getElementsByTagName('tr'))
      trNodeLists.map((trNode, trNodeIndex) => {
        let tdNodeLists = Array.from(trNode.getElementsByTagName('td'))
        tdNodeLists.map((tdNode, tdNodeIndex) => {
          let params = tdNode.getBoundingClientRect()
          this.table[trNodeIndex][tdNodeIndex].iwidth = params.width
          this.table[trNodeIndex][tdNodeIndex].iheight = params.height
        })
      })
      // this.table.map(v => v.map(v => v.selected = false))
    },
    merge() {
      let table = this.table
      let rowMaxIndex = table.length - 1
      this.type = 0
      table.forEach((row, rowIndex, rowArr) => {
        row.forEach((column, columnIndex, columnArr) => {
          // 列操作
          let rowStartIndex = columnArr.findIndex(v => v.selected)
          let rowSelectedNum = columnArr.filter(v => v.selected).length
          let rowLastIndex = rowStartIndex + rowSelectedNum - 1
          if(columnIndex === rowStartIndex) {
            column.colspan = rowSelectedNum
          } else if(columnIndex < rowStartIndex) {
            column.colspan = 1
          } else if(columnIndex > rowStartIndex && columnIndex <= rowLastIndex) {
            column.colspan = 0
          } else {
            column.colspan = 1
          }
          // 行操作
          let callback = () => {
            if(table[rowMaxIndex - rowIndex][columnIndex].selected) {
              // if(table[rowMaxIndex - rowIndex - 1][columnIndex].selected) {
              //   table[rowMaxIndex - rowIndex][columnIndex].rowspan = table[rowMaxIndex - rowIndex - 1][columnIndex].rowspan + table[rowMaxIndex - rowIndex][columnIndex].rowspan
              // } else {
              //   table[rowMaxIndex - rowIndex][columnIndex].rowspan = 0
              // }
            } else {
              table[rowMaxIndex - rowIndex][columnIndex].rowspan = 1
            }
          }
          callback()
        })
      })
      this.table = table
      console.log(table)
      setTimeout(() => this.initText(), 16.7)
    },
    split() {
      this.type = 0
    }
	},
	mounted() {
		this.initTable()
	}
}
</script>
<style lang="less">
#pc-banner {
  .mask{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: rgba(0,0,0,.3);
    text-align: center;
  }
  .btn-action{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: white;
    text-align: center;
    line-height: 60px;
  }
  .table-box{
    text-align: center;
    position: relative;
    border: unset;
    border-collapse:collapse;
    border-spacing:0;
    user-select:none;
    table-layout: fixed;
    height: 414px;
    width:763px;
    text-align:center;
    border-collapse:collapse;
    border-spacing:0;
    margin-top: 20px;
  }
	.my_table {
    text-align: center;
    position: relative;
    border: unset;
    text-align:center;
    border-collapse:collapse;
    border-spacing:0;
    user-select:none;
    table-layout: fixed;
    position: relative;
    height: 100%;
    width:100%;
    text-align:center;
    border-collapse:collapse;
    border-spacing:0;
    td {
      border: unset;
      background: rgba(0,0,0,.05);
      word-break: break-all;
      word-wrap:break-word;
      border-right:3px solid white;
      border-bottom:3px solid white;
      box-sizing: border-box;
      transition: all ease .4s;
      color: #666666;
      &.ui-selecting {
        background: rgba(3, 179, 187,.5);
        color: rgba(255,255,255,.5)
      }
      &.ui-selected {
        background: #03b3bb;
        color: rgba(255,255,255,1);
      }
    }
    tr td:last-child {
      border-right-width:0px;
    }
    tr:last-child td{
      border-bottom-width:0px;
    }
  }
}
.ui-selectable-helper{
  position: fixed;
}
</style>
