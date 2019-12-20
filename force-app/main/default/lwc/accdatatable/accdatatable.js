/**
 * Created by Atlas on 11.10.2019.
 */

import {LightningElement, track, wire, api} from 'lwc';
/* eslint-disable no-console */
/* eslint-disable no-alert */
import getAccountList from '@salesforce/apex/AccountController.getAccountList';
import {refreshApex} from '@salesforce/apex';


export default class DatatableWithInlineEdit extends LightningElement {

    @track columns = [
        {label: 'Id', fieldName: 'Id', type: 'text'},
        {label: 'Name', fieldName: 'Name', type: 'text'},
        {label: 'Phone', fieldName: 'Phone', type: 'phone'},
        {label: 'Rating', fieldName: 'Rating', type: 'text'},
    ];

    handleClickNext() {

        if(this.totalAccounts.length > 0) {
            this.moveToNextPage = true;
        }

        const lookupHideEvent = new CustomEvent('hidelookup', {
        });
        // 3. Fire the custom event
        this.dispatchEvent(lookupHideEvent);
    }

    handleClickPrevious() {
        this.moveToNextPage = false;

        const lookupShowEvent = new CustomEvent('showlookup', {
        });
        // 3. Fire the custom event
        this.dispatchEvent(lookupShowEvent);
    }

    @track moveToNextPage = false;
    @track selectedIds = [];
    @api buttonState = 'neutral';
    @track selectedRows = [];
    @track selectedIdsRow = [];
    @track totalAccounts = [];
    @track error;
    @api accounts;
    @api searchResults = [];
    @track tableClass = 'slds-hide';

    @api
    controlTableOn() {
        this.tableClass = 'slds-show';
    }

    @api
    controlTableOff() {
        this.tableClass = 'slds-hide';
    }

    @wire(getAccountList, {Ids: '$searchResults'})
    wiredAccount({data, error}) {
        if (data) {
            this.accounts = data;

            let idsList = this.totalAccounts.concat(this.selectedIdsRow);
            this.totalAccounts = [...new Set(idsList)];
            console.log('totalaccountsaftersearchwireservice', this.totalAccounts);

        }
    }

    emptySelectedRows() {
        this.selectedRows = [];
    }

    handleClickAdd() {

        let el = this.template.querySelector('lightning-datatable');
        let selected = el.getSelectedRows();
        let objectList = [];

        for (let i = 0; i < selected.length; i++) {
            objectList.push(selected[i]);
        }


        this.selectedIdsRow = objectList;
        let newObjectList = this.totalAccounts.concat(this.selectedIdsRow);
        this.totalAccounts = [...new Set(newObjectList)];
        console.log('SELECTEDROWS2019', this.totalAccounts);

        let ids = this.totalAccounts.map(object => object.Id);
        this.selectedIds = ids.join();



        /*let ids2 = this.totalAccounts.reduce((acc, val) => (acc.Id + ',' + val.Id));
        console.log('idsreduce', ids2);
         */

        if (this.totalAccounts.length > 0) {
            this.buttonState = 'success'
        }

        this.emptySelectedRows();

        //this.totalAccounts.forEach((account)=>console.log(account.id));

    }

    handleClickRemove() {
        this.emptySelectedRows();
        this.buttonState = 'neutral';
        this.selectedIdsRow = [];
        this.totalAccounts = [];
    }


}