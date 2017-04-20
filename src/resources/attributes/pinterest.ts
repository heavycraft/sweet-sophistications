import { autoinject, bindable } from 'aurelia-framework';

@autoinject()
export class PinterestSaveCustomAttribute {

  @bindable({primaryProperty: true}) type: string = 'hover';
  @bindable large: boolean;
  @bindable round: boolean;
  @bindable countPosition: string;
  @bindable imageUrl: string;

  scriptElement: any;

  constructor(private element: Element) { }

  attached() {
    if(!document.getElementById('pinterest-'+this.type+'-script')) {
      this.addPinterestScript();
    }
  }

  private addPinterestScript() {
    let pinterestURL = '//assets.pinterest.com/js/pinit.js';
    let pinterestScript = document.createElement('script');
    pinterestScript.src = pinterestURL;

    pinterestScript.setAttribute('id', 'pinterest-'+this.type+'-script');
    pinterestScript.setAttribute('data-pin-save', 'true');
    pinterestScript.async = true;
    pinterestScript.defer = true;
    
    if (this.type === 'hover') { pinterestScript.setAttribute('data-pin-hover', 'true') ; } 
    if (this.countPosition) { pinterestScript.setAttribute('data-pin-count', this.countPosition); }
    if (this.large) { pinterestScript.setAttribute('data-pin-tall', 'true'); }
    if (this.round) { pinterestScript.setAttribute('data-pin-round', 'true'); }
    
    pinterestScript.onload = () => { console.log('Loaded pinterest script') };
    this.scriptElement = document.querySelector('body').appendChild(pinterestScript);
  }

}

