import { inject } from 'aurelia-framework';
import { SweetSophisticationsService } from '../ss.service';

@inject(SweetSophisticationsService)
export class About {
    routeTitle: string;
    media: any;

    constructor(private ss: SweetSophisticationsService) { }
    
    activate(params, route) {
       this.routeTitle = route.title;
       this.ss.getMedia().then(media => this.media = media);
    }
}