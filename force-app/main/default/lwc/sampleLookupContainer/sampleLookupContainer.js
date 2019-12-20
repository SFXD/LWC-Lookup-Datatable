import { LightningElement, track, api } from 'lwc';

/* eslint-disable no-console */
/* eslint-disable no-alert */

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
/** SampleLookupController.search() Apex method */
import apexSearch from '@salesforce/apex/SampleLookupController.search';

export default class SampleLookupContainer extends LightningElement {

    // Use alerts instead of toast to notify user
    @api notifyViaAlerts = false;
    @api recordId;

    @track isMultiEntry = false;
    @track initialSelection = [];
    @track errors = [];

    handleLookupTypeChange(event) {
        this.initialSelection = [];
        this.errors = [];
        this.isMultiEntry = event.target.checked;
    }

    handleSearch(event) {
        apexSearch(event.detail)
            .then(results => {

                console.log('resultslength', results.length);
                console.log('results', results);
                console.log(JSON.stringify(results, null, '\t'));

                //const recordIds = this.records.map(record => record.id);

                this.template.querySelector('c-lookup').setSearchResults(results);

                //const recordIds = this.results.map(result => result.Id);
                //console.log('recordIds', recordIds); // => [ 'id1', 'id2', ... ]
            })
            .catch(error => {
                this.notifyUser('Lookup Error', 'An error occured while searching with the lookup field.', 'error');
                // eslint-disable-next-line no-console
                console.error('Lookup error', JSON.stringify(error));
                this.errors = [error];
            });
    }

    handleSelectionChange() {
        this.errors = [];
    }

    handleSubmit() {
        this.checkForErrors();
        if (this.errors.length === 0) {
            this.notifyUser('Success', 'The form was submitted.', 'success');
        }
    }

    checkForErrors() {
        const selection = this.template.querySelector('c-lookup').getSelection();
        if (selection.length === 0) {
            this.errors = [
                { message: 'You must make a selection before submitting!' },
                { message: 'Please make a selection and try again.' }
            ];
        } else {
            this.errors = [];
        }
    }

    notifyUser(title, message, variant) {
        if (this.notifyViaAlerts){
            // Notify via alert
            // eslint-disable-next-line no-alert
            alert(`${title}\n${message}`);
        } else {
            // Notify via toast
            const toastEvent = new ShowToastEvent({ title, message, variant });
            this.dispatchEvent(toastEvent);
        }
    }
}