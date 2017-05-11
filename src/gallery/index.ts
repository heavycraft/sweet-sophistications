import { RouterConfiguration, Router } from 'aurelia-router';

export class Gallery {

  configureRouter(config: RouterConfiguration, router: Router) {

    config.map([
      { route: '',      moduleId: './list',     name: 'list',       nav: false },
      { route: ':id',   moduleId: './detail',   name: 'details',    nav: false,     title: 'Photo Detail' },
    ]);
  }
}