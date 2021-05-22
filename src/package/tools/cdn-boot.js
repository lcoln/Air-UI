(function () {
  /**
   *
   *
   * @param {"css":["//admin.cncoders.tech/admin/0.0.2/css/main.e7ceda238edfeebc3d4a.css"],"js":["//admin.cncoders.tech/admin/0.0.2/js/main.e7ceda238edfeebc3d4a.js"]} link
   */
  async function autoCompleteDoc (link) {
    let cssMap = createLink(link.css)
    let jsMap = createScript(link.js)
    cssMap.map(css => {
      document.head.appendChild(css);
    })
    await jsMap.map(async js => {
      await js()
    })
  }

  function createLink (urls) {
    //<link rel="stylesheet" href="/css/base.css">
    return urls.map(url => {
      let tag = document.createElement('link')
      tag.href = url
      return tag
    })
  }

  function createScript (url) {
    //<script async src="https://js-sec.indexww.com/ht/p/185901-159836282584097.js"></script>
    return urls.map(url => {
      return new Promise((yes, no) => {
        let tag = document.createElement('script')
        tag.src = url
        tag.async = true
        tag.onload = function () {
          yes()
        }
        tag.onreadystatechange = tag.onerror = function(){
          if(!this.readyState || ((this.readyState ==='loaded' || this.readyState === 'complete'))){
            no('File Loaded Error');
          }
        };
        return tag
      })
    })
  }

  window._AIRMODULE = {
    autoCompleteDoc
  }
})()