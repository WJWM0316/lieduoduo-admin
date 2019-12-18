<template>
	<div id="pc-banner">
    <div id="box" class="table-box">
      <table id="table" class="my_table"></table>
      <div class="action">
        <el-button type="primary">合并选中</el-button>
        <el-button type="warning">拆分选中</el-button>
      </div>
    </div>
	</div>
</template>
<script>
const render = (dom, boxwidth, boxHeight, row, column) => {
  let fragment = document.createDocumentFragment()
  for(let i = 0; i < row; i++) {
    let tr = document.createElement('tr')
    for(let j = 0; j < column; j++) {
      let td = document.createElement('td')
      td.innerHTML = `${i} --- ${j}`
      tr.appendChild(td)
    }
    fragment.appendChild(tr)
  }
  dom.appendChild(fragment)
}

const setDefault = () => {
  let dom = document.querySelector('#table')
  render(dom, 763, 414, 4, 3)
  let nodeLists = Array.from(dom.getElementsByTagName('td'))
  nodeLists.map(node => {
    let params = node.getBoundingClientRect()
    node.innerHTML = `${params.width}px -- ${params.height}px`
  })
}
/**
 * 合并单元格(如果结束行传0代表合并所有行)
 * @param table1    表格的ID
 * @param startRow  起始行
 * @param endRow    结束行
 * @param col   合并的列号，对第几列进行合并(从0开始)。第一行从0开始
 */
const mergeCell = (table1, startRow, endRow, col) => {
  var tb = document.getElementById(table1);
  if(!tb || !tb.rows || tb.rows.length <= 0) {
    return;
  }
  if(col >= tb.rows[0].cells.length || (startRow >= endRow && endRow != 0)) {
    return;
  }
  if(endRow == 0) {
    endRow = tb.rows.length - 1;
  }
  for(let i = startRow; i < endRow; i++) {
    if(tb.rows[startRow].cells[col].innerHTML == tb.rows[i + 1].cells[col].innerHTML) { //如果相等就合并单元格,合并之后跳过下一行
      tb.rows[i + 1].removeChild(tb.rows[i + 1].cells[col]);
      tb.rows[startRow].cells[col].rowSpan = (tb.rows[startRow].cells[col].rowSpan) + 1;
    } else {
      mergeCell(table1, i + 1, endRow, col);
      break;
    }
  }
}

export default {
	methods: {
		initTable() {
      setDefault()
      $('#table').selectable()
		}
	},
	mounted() {
		this.initTable()
	}
}
</script>
<style lang="less">
#pc-banner {
  .v-selected-box{
    position: absolute;
    border: dashed 1px rgba(0,0,0,.1);
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
    height: 414px;
    width:763px;
    text-align:center;
    border-collapse:collapse;
    border-spacing:0;
    margin-top: 20px;
    float: left;
  }
  .my_table td {
    border: unset;
    background: rgba(0,0,0,.1);
    word-break: break-all;
    word-wrap:break-word;
    border-right:3px solid white;
    border-bottom:3px solid white;
    box-sizing: border-box;
    transition: all ease .4s;
    color: #666666;
    /*font-style: italic;*/
  }
  .my_table td.ui-selecting { background: rgba(3, 179, 187,.5); color: rgba(255,255,255,.5) }
	.my_table td.ui-selected  { background: #03b3bb; color: rgba(255,255,255,1); }
	.my_table tr td:last-child {
		border-right-width:0px;
	}
	.my_table tr:last-child td{
		border-bottom-width:0px;
	}
	.ui-selectable-helper {
		position: absolute;
	}
  .action{
    margin: 20px;
    display: inline-block;
  }
}
.ui-selectable-helper{
  position: fixed;
}
</style>
