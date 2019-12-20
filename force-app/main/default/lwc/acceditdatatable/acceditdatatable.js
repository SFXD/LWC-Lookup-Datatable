/**
 * Created by Atlas on 22.10.2019.
 */

import {LightningElement, api, track, wire} from 'lwc';
import getAccountEditList from '@salesforce/apex/AccountEditController.getAccountEditList';
import {updateRecord} from 'lightning/uiRecordApi';
import {refreshApex} from '@salesforce/apex';

export default class Acceditdatatable extends LightningElement {

    @api accountIdList = [];
    @api saveDraftValues = [];
    @api accountEditList = [];
    @track draftValues = [];

    @track columns = [
        {label: 'Name', fieldName: 'Name', type: 'text', editable: true},
        {label: 'Website', fieldName: 'Website', type: 'text', editable: true},
        {label: 'Date', fieldName: 'Acc_Custom_Date__c', type: 'date', editable: true},
        {label: 'Email', fieldName: 'Acc_Custom_Email__c', type: 'email', editable: true},
    ];

    @wire(getAccountEditList, {Ids: '$accountIdList'})
    wiredAccount(data, error) {
        if (data) {
            this.accountEditList = data;
            console.log('totalaccountsaftersearchwireservice', this.accountEditList);
        }
    }

    handleSave(event) {

        let draftValues = event.detail.draftValues;
        console.log(draftValues);
        console.log(JSON.stringify(draftValues));
        debugger;

        const recordInputs = event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return {fields};
        });

        console.log('RECORDINPUTS', JSON.stringify(recordInputs));

        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(() => {
            // Clear all draft values
            this.saveDraftValues = [];

            // Display fresh data in the datatable
            return refreshApex(this.accountEditList);
            //this.clearDraft();
        }).catch(error => {
            // Handle error
        });
    }
}