import { networkInterfaces } from 'os';
import * as net from 'net';
import { inject, NewInstance } from 'aurelia-framework';
import { ValidationController, ValidationRules} from "aurelia-validation";
import { FormRenderer } from './form-renderer';
import { MailService, IMailBody } from '../mail.service';
import { SweetSophisticationsService } from '../ss.service';

interface IContact {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    location: string;
    date: string;
    guests: number;
    message: string;
}

enum FormState { Incomplete, Sent, Error = -1 }

@inject(NewInstance.of(ValidationController), MailService, SweetSophisticationsService)
export class Contact {
    routeTitle: string;

    contact: IContact = {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        location: '',
        date: '',
        guests: 0,
        message: ''
    };

    formState = FormState.Incomplete;

    validationRules: ValidationRules;

    constructor(private validation: ValidationController, private mail: MailService, private ss: SweetSophisticationsService) {
        this.validation.addRenderer(new FormRenderer());
        this.validationRules = ValidationRules
            .ensure('first_name')
                .displayName('First Name')
                .required()
            .ensure('last_name')
                .displayName('Last Name')
                .required()
            .ensure('email')
                .displayName('Email')
                .required()
                .email()
            .ensure('phone')
                .satisfies( val => {
                    let phone = val.toString().replace(/[^0-9]/g, '');
                    return !val || phone.length > 9;
                })
                .withMessage('Enter a valid phone number.')
            .ensure('date')
                .satisfies( val => {
                    let date = val.toString().split(/[^0-9]/g);
                    let year = +date[0] > 12 ? +date[0] : +date[2];
                    let month = +date[0] > 12 ? +date[1] : +date[0];
                    let day = +date[0] > 12 ? +date[2] : +date[1];
                    let now = new Date().getFullYear();
                    return !val || ((month >= 1 && month <= 12) && (day >= 1 && day <= 30) && (year >= now && year <= now+10));
                })
                .withMessage('Enter a valid date in the near future.')
            .ensure('guests')
                .matches(/^[0-9]+$/)
                .withMessage('Guest count should be a positive number.')
            .ensure('message')
                .required()
            .rules;
        this.validation.addObject(this.contact, this.validationRules)
    }

    activate(params, route) {
       this.routeTitle = route.title;
    }

    submit() {
        this.validation.validate().then( valid => {
            this.mail.send({
                to: 'roy@sweetsophistications.com',
                from: 'Heavy Craft Notifications <notifications@heavycraft.io>',
                subject: 'Sweet Sophistications Contact Form',
                text: `
                    FROM:

                    ${this.contact.first_name} ${this.contact.last_name}
                    e. ${this.contact.email}
                    p. ${this.contact.phone ? this.contact.phone : 'Not Available'}

                    EVENT INFORMATION:

                    Location: ${this.contact.location ? this.contact.location : 'Not Available'}
                    Date: ${this.contact.date ? this.contact.date : 'Not Available'}
                    Guest Count: ${this.contact.guests ? this.contact.guests : 'Not Available'}
                    Message: ${this.contact.message ? this.contact.message : 'Not Available'}

                    More information may be available at http://admin.sweetsophistications.com/tables/contacts

                `,
                html: `
<table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable"  style="font-family: sans-serif;">
    <tr>
        <td align="center" valign="top">
            <table border="0" cellpadding="20" cellspacing="0" width="600" id="emailContainer"  style="border: 1px solid #F44B2B;">
                <tr>
                    <td align="center" valign="top" bgcolor="#F44B2B" style="color:white;">
                        <img src="http://assets.heavycraft-data.info/heavycraft/img/logo-white_279.png" alt="Heavy Craft">
                    </td>
                </tr>
                <tr>
                	<td valign="top" align="center">
                		<h1 style="color:#393939">New Contact Form Submission</h1>
                		<table border="0" cellpadding="7" cellspacing="0" width="80%" bgcolor="#f9f9f9" style="border: 1px solid #e0e0e0;">
                			<tr>
                				<th colspan="2" bgcolor="#e0e0e0" >From</th>
                			</tr>
                			<tr>
                				<th align="right" width="25%">Name</th>
                				<td>${this.contact.first_name} ${this.contact.last_name}</td>
                			</tr>
                			<tr>
                				<th align="right" width="25%">Email</th>
                				<td><a href="mailto:${this.contact.email}">${this.contact.email}</a></td>
                			</tr>
                			<tr>
                				<th align="right" width="25%">Phone</th>
                				<td>${this.contact.phone ? this.contact.phone : 'Not Available'}</td>
                			</tr>
                			<tr>
                				<th colspan="2" bgcolor="#e0e0e0">Event Information</th>
                			</tr>
                			<tr>
                				<th align="right" width="25%">Location</th>
                				<td>${this.contact.location ? this.contact.location : 'Not Available'}</td>
                			</tr>
                			<tr>
                				<th align="right" width="25%">Date</th>
                				<td>${this.contact.date ? this.contact.date : 'Not Available'}</td>
                			</tr>
                			<tr>
                				<th align="right" width="25%">Guests</th>
                				<td>${this.contact.guests ? this.contact.guests : 'Not Available'}</td>
                			</tr>
                			<tr>
                				<th valign="top" align="right" width="25%">Message</th>
                				<td>${this.contact.message}</td>
                			</tr>
                		</table>
                		<p style="font-weight:bold;"><br>
                			More information is available at <a href="http://admin.sweetsophistications.com/tables/contacts">http://admin.sweetsophistications.com/tables/contacts</a><br><br>
                		</p>
                		
                	</td>
                </tr>
                <tr>
                    <td align="center" valign="top" bgcolor="#F44B2B" style="color:white;">
                        <a href="https://www.heavycraft.io" style="color: white; font-weight:bold; text-decoration: none; font-family: sans-serif;">HEAVYCRAFT.IO</a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
                `
            }).then( response => {
                this.ss.submitContactForm(this.contact).then( data => {
                    this.formState = response.isSuccess ? FormState.Sent : FormState.Error;
                }).catch( e => {
                    this.formState = FormState.Error;
                })
                
            }).catch( e => {
                this.formState = FormState.Error;
            })
        })
    }
}