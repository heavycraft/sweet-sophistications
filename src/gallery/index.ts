import { RouterConfiguration, Router } from 'aurelia-router';

export class Gallery {
  routeTitle: string;

  activate(params, route) {
    this.routeTitle = route.title;
  }

  configureRouter(config: RouterConfiguration, router: Router) {

    config.map([
      { route: '',      moduleId: './list',     name: 'list',       nav: false,     title: 'Gallery' },
      { route: ':id',   moduleId: './detail',   name: 'details',    nav: false,     title: this.routeTitle },
    ]);
  }
}