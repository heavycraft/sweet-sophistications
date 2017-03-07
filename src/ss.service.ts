import { EEXIST } from 'constants';
import { inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import ENV_VARS from './ENV_VARS';

const BASE_URL = ENV_VARS.SS_BASE_URL;

interface IFile {
    id: number;
    name: string;
    width?: number;
    height?: number;
    thumbnail_url: string;
    url: string;
    date_uploaded: string;
    title: string;
    location: string;
    caption: string;
    tags: string;
    size: number;
    type: string;
}

interface IGalleryPhoto {
    id: number;
    title: string;
    image: IFile;
    description: string;
    style: string;
    tags: Array<string>;

}

interface ICakeStyle {
    id: number;
    name: string;
    photo: IFile | number;
    description: string;
    base_price: number;
}

interface IFlavor {
    id: number;
    name: string;
    description?: string;
}

interface IMenu {
    id: number;
    description: string;
    minimum: number;
    flavors: Array<IFlavor>;
    styles: Array<ICakeStyle>;
}

interface ITestimonial {
    id: number;
    photo: IFile | number;
    name: string;
    testimonial: string;
}

interface ILocation {
    latitude?: number;
    longitude?: number;
    street_number: string;
    street: string;
    city: string;
    state: string;
    zip_code: string;

}

interface ISocialMedia {
    id: number;
    platform: string;
    user: string;
}

interface IPerson {
    name: string;
    title: string;
    photo: IFile;
}

interface IBusiness {
    id: number;
    name: string;
    tag_line: string;
    description: string;
    description_continued?: string;
    email: string;
    phone: string;
    social_media: Array<any>;
    location: ILocation | string;
    owner: IPerson;
}

interface IMedia {
    id: number;
    publication: string;
    logo: IFile;
    url: string;
    is_feature: boolean;
}

interface ISocialPlatform {
    id: number;
    name: string;
    icon: string;
    url: string;
}

@inject(EventAggregator)
export class SweetSophisticationsService {
    httpClient = new HttpClient();
    loading: Array<any> = [];

    gallery: Array<IGalleryPhoto>;
    styles: Array<ICakeStyle>;
    menu: IMenu;
    business: IBusiness;
    file: Array<number> = [];
    media: Array<IMedia>;
    testimonials: Array<ITestimonial>;
    socialPlatforms: Array<ISocialPlatform>;
    selectedStyles: Array<any>;

    constructor(private ea: EventAggregator) {
        this.httpClient.configure( x => {
            x.withBaseUrl(BASE_URL + '/api/1/');
            x.withParams({
                access_token: ENV_VARS.SS_ACCESS_TOKEN,
                status: 1
            })
        });
    }

    /* About */

    getBusiness(): Promise<IBusiness> {
        if(this.business){  return new Promise(resolve => resolve(this.business)); }
        let business = (data): IBusiness => {
            return this.business = {
                    id: data.content.id,
                    name: data.content.name,
                    tag_line: data.content.tag_line,
                    description: data.content.description,
                    description_continued: data.content.description_continued,
                    email: data.content.email,
                    phone: data.content.phone,
                    social_media: data.content.social_media.rows.map( platform => {
                        return {
                            id: platform.data.id,
                            platform: platform.data.platform,
                            user_id: platform.data.user_id
                        }
                    }),
                    location: {
                        latitude: data.content.location.split(',')[0],
                        longitude: data.content.location.split(',')[1],
                        street_number: data.content.street_number,
                        street: data.content.street,
                        city: data.content.city,
                        state: data.content.state,
                        zip_code: data.content.zip_code
                    },
                    owner: {
                        name: data.content.owner_name,
                        title: data.content.owner_title,
                        photo: data.content.owner_photo
                    }

                };
        };
        return this.getData('tables/business_info/rows/1', business.bind(this))
    }

    /* Media publications */

    getMedia(): Promise<IMedia> {
        if(this.media){ return new Promise(resolve => resolve(this.media)); }
        let media = (data): Array<IMedia> => this.media = data.content.rows.map(media => {
            return {
                publication: media.publication,
                logo: media.logo,
                is_feature: media.logo ? true : false,
                url: media.url
            }
        });
        return this.getData('tables/media/rows', media.bind(this));
    }

    /* Menu / Pricing */

    getMenu(): Promise<IMenu> {
        if(this.menu){ return new Promise(resolve => resolve(this.menu)); }

        let menu = (data): IMenu => this.menu = {
            id: data.content.id,
            description:  data.content.description,
            minimum:  data.content.minimum,
            flavors:  data.content.flavors.rows.map( flavor => flavor.data ),
            styles:  data.content.styles.rows.map( style => style.data )
        };

        return this.getData('tables/wedding_cakes/rows/1', menu.bind(this))
    }

    /* Cake Styles */

    getSelectedStyles() {
        return this.selectedStyles;
    }

    setSelectedStyles(styles) {
        this.selectedStyles = styles; 
    }

    getCakeStyles(): Promise<Array<ICakeStyle>> {
        if(this.styles){ return new Promise(resolve => resolve(this.styles)); }
        let styles = (data): Array<ICakeStyle> =>  this.styles = data.content.rows;
        return this.getData('tables/cake_styles/rows', styles.bind(this))
    }

    /* Photo Gallery */

    getGallery(): Promise<Array<IGalleryPhoto>> {
        if(this.gallery){ return new Promise(resolve => resolve(this.gallery));}
        let gallery = (data): Array<IGalleryPhoto> => {
            return this.gallery = data.content.rows.map( photo => {
                return {
                    id: photo.id,
                    title: photo.title,
                    image: photo.image,
                    description: photo.description,
                    style: photo.style.name,
                    tags: photo.tags.split(',')
                }
            });
        }
        return this.getData('tables/gallery/rows', gallery.bind(this));
    }

    getGalleryPhoto(id: number): Promise<IGalleryPhoto> {
        return new Promise( (resolve, reject) => 
            this.getGallery().then( gallery => resolve(gallery.filter( photo => photo.id === +id)[0]) ).catch(e => reject(e))
        );
    }

    /* Testimonials */

    getTestimonials(): Promise<Array<ITestimonial>> {
        if(this.testimonials){ return new Promise(resolve => resolve(this.testimonials)); }
        let testimonials = (data): Array<ITestimonial> =>  this.testimonials = data.content.rows;
        return this.getData('tables/testimonials/rows', testimonials.bind(this));
    }

    /* Files */

    getFile(id: number): Promise<IFile> {
        if(this.file && this.file[id]){ return new Promise(resolve => resolve(this.file[id])); }
        let file = (data): IFile => this.file[id] = data.content;
        return this.getData(`files/${id}`, file.bind(this));
    }

    /* Social Platforms */

    getSocialPlatforms(): Promise<Array<ISocialPlatform>> {
        if(this.socialPlatforms) { return new Promise(resolve => resolve(this.socialPlatforms))}
        let social = (data): Array<ISocialPlatform> => this.socialPlatforms = data.content.rows;
        return this.getData('tables/social_platform/rows', social.bind(this));
    }

    getSocialPlatform(id: number) {
        return new Promise( (resolve, reject) => 
            this.getSocialPlatforms().then( platforms => resolve(platforms.filter( platform => platform.id === +id)[0]) ).catch(e => reject(e))
        );
    }

    submitContactForm(form): Promise<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        //let options = new RequestOptions({ headers: headers, search: this.params });
        let endpoint = '/tables/contacts/rows';
        //form requires active
        form.active = 1;
        return this.httpClient.post(endpoint, form)
    }

    /* Util */

    private getData(endpoint: string, parseFunction: Function) {
        this.loading.push(endpoint);
        this.ea.publish('http:loading', true);
        return new Promise((resolve, reject) => {
            this.httpClient
                .get(endpoint)
                .then(data => {
                    this.loading.splice(this.loading.indexOf(endpoint), 1);
                    this.ea.publish('http:loading', this.loading.length);
                    resolve(parseFunction(data));
                })
                .catch(e => {
                    this.loading.splice(this.loading.indexOf(endpoint), 1);
                    this.ea.publish('http:loading', this.loading.length);
                    reject(e);
                });
        });
    }
}