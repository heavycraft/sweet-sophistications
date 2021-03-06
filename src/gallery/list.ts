import { bindable, inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { SweetSophisticationsService } from '../ss.service';

@inject(Router, SweetSophisticationsService)
export class GalleryList {
    styles = [];
    @bindable selectedStyles: string[] = [];
    gallery = [];
    params: any;

    constructor(private router: Router, private ss: SweetSophisticationsService) { }
    
    activate(params, route) {
       this.params = params;
       this.ss.getGallery().then( gallery => this.gallery = gallery);
       this.ss.getCakeStyles().then( styles => {
           this.styles = styles.map(style => style.name.toLowerCase());
           this.selectedStyles = params.styles ? params.styles : this.ss.getSelectedStyles() ? this.ss.getSelectedStyles() :  [];
           this.ss.setSelectedStyles(this.selectedStyles);
        });
       
    }

    attached() {
        if(this.params.from) {
            let fromElement = document.getElementById('galleryImage'+this.params.from)
            if(fromElement) { fromElement.scrollIntoView(); }       
       }
    }

    selectAllStyles() {
        this.selectedStyles = this.styles.slice();
    }

    updateGallery() {
        this.gallery.splice(0, 0); //force to recheck
    }

    openImage(id: number) {
        this.router.navigateToRoute('details', {id: id})
    }

    selectedStylesChanged(styles) {
        this.ss.setSelectedStyles(styles);
    }
    
}