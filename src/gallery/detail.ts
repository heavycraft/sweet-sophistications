import { bindable, inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { SweetSophisticationsService } from '../ss.service';

@inject(Router, SweetSophisticationsService)
export class GalleryDetail {

    photo: any;

    constructor(private router: Router, private ss: SweetSophisticationsService) {}

    activate(params: any) {
        let styles = this.ss.getSelectedStyles();
        this.ss.getGalleryPhoto(params.id).then( photo => {
            this.photo = photo;
            if(!styles) { this.ss.setSelectedStyles([photo.style.toLowerCase()]); }
        });
    }

    closeImage(id: number) {
        this.router.navigateToRoute('list')
    }
}