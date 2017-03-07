import * as moment from 'moment';

export class TimeFormatValueConverter {
  toView(value) {
    return moment(value).fromNow();
  }
}

