export default function () {
  if (typeof window !== 'undefined') {
    window.HTMLElement = (function (OriginalHTMLElement) {
      function BabelHTMLElement() {
        if (typeof Reflect === 'undefined' || typeof Reflect.construct !== 'function' || typeof customElements === 'undefined') {
          // Use your favorite polyfill.
        }
        const newTarget = this.__proto__.constructor;
        return Reflect.construct(OriginalHTMLElement, [], newTarget);
      }
      Object.setPrototypeOf(BabelHTMLElement, OriginalHTMLElement);
      Object.setPrototypeOf(BabelHTMLElement.prototype, OriginalHTMLElement.prototype);
      return BabelHTMLElement;
    }(window.HTMLElement));
  }
}