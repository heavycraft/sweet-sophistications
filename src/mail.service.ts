import { inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
import { EventAggregator } from 'aurelia-event-aggregator';
import ENV_VARS from './ENV_VARS';

const BASE_URL = ENV_VARS.MAIL_BASE_URL;

export interface IMailBody {
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
}

@inject(EventAggregator)
export class MailService {
    httpClient = new HttpClient();
    loading: Array<any> = [];

    constructor(private ea: EventAggregator) {
        this.httpClient.configure( x => {
            x.withBaseUrl(BASE_URL);
        });
    }

    send(mail: IMailBody): Promise<any> {
        return new Promise((resolve, reject) => {
            this.sendMail('mail', mail, (data): any => data)
                .then( data => { resolve(data); })
                .catch(e => { reject(e)});
        });
    }

    private sendMail(endpoint: string, body: IMailBody, parseFunction: Function): Promise<any> {
        this.loading.push(endpoint);
        this.ea.publish('http:loading', true);
        return new Promise((resolve, reject) => {
            this.httpClient
                .post(endpoint, body)
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