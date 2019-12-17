<template>
	<div id="pc-banner">
    <div id="box" class="table-box">
      <table id="table" class="my_table"></table>
    </div>
	</div>
</template>
<script>
export default {
	methods: {
		init() {
			let tem = [
        'http://lib.sinaapp.com/js/jquery/1.9.1/jquery-1.9.1.min.js',
        'http://lib.sinaapp.com/js/jquery-ui/1.9.2/jquery-ui.min.js'
      ]
      for(let i = 0; i < tem.length; i++) {
        console.log(i)
      }
		}
	},
	mounted() {
		this.init()
	}
}
</script>
<style lang="less">
#pc-banner {
  .v-selected-box{
    position: absolute;
    border: dashed 1px rgba(0,0,0,.1);
  }
  .table-box{
    position: relative;
    height: 414px;
    width:763px;
    text-align:center;
    border-collapse:collapse;
    border-spacing:0;
    margin: 30px 10px;
  }
	.my_table {
    text-align: center;
    position: relative;
    height: 100%;
    border: unset;
    width:100%;
    text-align:center;
    border-collapse:collapse;
    border-spacing:0;
    user-select:none;
    table-layout: fixed;
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
}
</style>