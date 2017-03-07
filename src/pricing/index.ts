import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { SweetSophisticationsService } from '../ss.service';

@inject(SweetSophisticationsService, Router)
export class Pricing {
    routeTitle: string;
    menu: any;

    constructor(private ss: SweetSophisticationsService, private  router: Router) { }

    activate(params, route) {
        this.routeTitle = route.title;
        this.ss.getMenu().then(menu => {
            this.menu = menu;
            menu.styles.forEach( style => {
                if(typeof style.photo === 'number'){
                    this.ss.getFile(+style.photo).then( photo => style.photo = photo)
                }
            });
        });
    }

    galleryShow(style: string) {
        this.router.navigateToRoute('gallery', {styles: [style.toLowerCase()]})
    }
}