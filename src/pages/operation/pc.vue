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
        'https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js',
        'http://lib.sinaapp.com/js/jquery-ui/1.9.2/jquery-ui.min.js'
      ]

      let dom = document.querySelector('#table')

      let render = (dom, boxwidth, boxHeight, row, column) => {
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

      let setDefault = () => {
        let nodeLists = Array.from(dom.getElementsByTagName('td'))
        nodeLists.map(node => {
          let params = node.getBoundingClientRect()
          node.innerHTML = `${params.width}px -- ${params.height}px`
        })
      }

      for(let i = 0; i < tem.length; i++) {
        var head = document.getElementsByTagName('head')[0]
        var script = document.createElement('script')
        script.src = tem[i]
        head.appendChild(script)
      }

      render(dom, 763, 414, 4, 3)
      setDefault()

      window.onload = function() {
        // $('#table').selectable();
      }
    
		}
	},
	mounted() {
		this.$nextTick(function() {
      this.init()
    })
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
