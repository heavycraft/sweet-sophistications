import {bindable} from 'aurelia-framework';

export class PageHeader {
  @bindable title;
  @bindable body;

  valueChanged(newValue, oldValue) { }
}

