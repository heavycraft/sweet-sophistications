import { inject } from 'aurelia-framework';
import { RouterConfiguration, Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';
import { SweetSophisticationsService } from './ss.service';

@inject(EventAggregator, SweetSophisticationsService)
export class App {

  router: any;
  collapseNav: boolean = true;
  loading: boolean;
  business: any;
  social: any = [];
  year = new Date().getFullYear();

  constructor(private ea: EventAggregator, private ss: SweetSophisticationsService) {
    this.ea.subscribe('http:loading', response => {
      this.loading = response;
      if (this.loading) {
        document.getElementsByTagName('body')[0].classList.add('loading');
      } else {
        document.getElementsByTagName('body')[0].classList.remove('loading');
      }
    });
    this.ea.subscribe('router:navigation:processing', response => this.collapseNav = true);
  }

  activate() {
    this.ss.getBusiness().then(business => {
      this.business = business;
      this.social = business.social_media
      this.social.forEach(social => {
        this.ss.getSocialPlatform(social.platform).then( (platform: any) => {
          social.platform = platform;
          social.url = platform.url + '/' + social.user_id;
        })
      })
    });
  }

  configureRouter(config: RouterConfiguration, router: Router) {
    this.router = router;
    config.title = 'Sweet Sophistications';
    config.options.pushState = true;
    config.options.root = '/';
    config.addPipelineStep('postcomplete', PostCompleteStep);
    config.map([
      { route: ['', 'home'],          name: 'home',           moduleId: 'home/index',      nav: true,     title: 'Home' },
      { route: 'about',               name: 'about',          moduleId: 'about/index',     nav: true,     title: 'About Us' },
      { route: 'gallery',             name: 'gallery',        moduleId: 'gallery/index',   nav: true,     title: 'Gallery' },
      { route: 'menu',                name: 'menu',           moduleId: 'pricing/index',   nav: true,     title: 'Menu' },
      { route: 'contact',             name: 'contact',        moduleId: 'contact/index',   nav: true,     title: 'Contact' },
    ]);
  }

}

class PostCompleteStep {
  run(routingContext, next) {
    window.scrollTo(0, 0);
    return next();
  }
}