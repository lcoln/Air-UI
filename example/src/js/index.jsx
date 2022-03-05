/*
 * @Description: 
 * @Version: 0.0.1
 * @Autor: linteng
 * @Date: 2022-03-04 16:01:15
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-03-04 16:01:16
 */
export default App = () => {
  return [
    <section class="mod-nav-top">
      <div class="logo">
        <span>Air-UI</span>
        <span>v0.0.1</span>
      </div>
      <div class="nav">
        {/* <input type="text" placeholder="search" class="nav-margin nav-search"> */}
        <icon-wc type="github" class="nav-margin air-ui-inline"></icon-wc>
      </div>
    </section>,
    <section class="mod-nav-left">
      <tree-wc data={JSON.stringify(tree)} tree_wc_select={select} color="#b7b7b7"></tree-wc>
    </section>
  ]
  {/* <section class="mod-content">{{msg}}</section> */}
}
