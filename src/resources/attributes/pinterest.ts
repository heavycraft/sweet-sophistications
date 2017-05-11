import { autoinject, bindable } from 'aurelia-framework';
declare const PinUtils: any;

@autoinject()
export class PinterestSaveCustomAttribute {

  scriptElement: any;

  constructor(private element: Element) { }

  attached() {
    if(!document.getElementById('pinterest-script')) {
      this.addPinterestScript();
    }
    this.element.addEventListener('click', this.savePin.bind(this));
  }

  private savePin() {
    PinUtils.pinOne({ 
      url: this.element.getAttribute('data-pin-url'), 
      media: this.element.getAttribute('data-pin-media'),
      description: this.element.getAttribute('data-pin-description')
    });
  }

  private addPinterestScript() {
    let pinterestURL = '//assets.pinterest.com/js/pinit.js';
    let pinterestScript = document.createElement('script');
    pinterestScript.src = pinterestURL;

    pinterestScript.setAttribute('id', 'pinterest-script');
    pinterestScript.async = true;
    pinterestScript.defer = true;
    
    pinterestScript.onload = () => { console.log('Loaded pinterest script') };
    this.scriptElement = document.querySelector('body').appendChild(pinterestScript);
  }

}

