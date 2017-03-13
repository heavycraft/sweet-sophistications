import { inject } from 'aurelia-framework';
import { SweetSophisticationsService } from '../ss.service';

@inject(SweetSophisticationsService)
export class Home {
    cakeStyles: any;
    testimonials: any;
    media: any;

    constructor(private ss: SweetSophisticationsService) {}

    activate() {
        
        this.ss.getCakeStyles().then(styles => {
            this.cakeStyles = styles.map(style => {
                return {
                    active: false,
                    title: style.name,
                    image: typeof style.photo === 'object' ? style.photo.url : false,
                    caption: style.description,
                    link: style.base_price > 0 ? {
                        role: 'button',
                        title: `Starting at $${(+style.base_price).toFixed(2)} / Person`,
                        route: 'menu'
                    } : false
                    
                }
            });
        });

        this.ss.getTestimonials().then(testimonials => {
            this.testimonials = testimonials.map( testimonial => {
                return { 
                    quote: testimonial.testimonial,
                    photo: testimonial.photo && typeof testimonial.photo === 'object' ? testimonial.photo.thumbnail_url : false,
                    name: testimonial.name,
                    source: testimonial.source,
                    source_url: testimonial.source_url
                }
            })
        });

        this.ss.getMedia().then(media => {
            this.media = media;
        })
    }
}