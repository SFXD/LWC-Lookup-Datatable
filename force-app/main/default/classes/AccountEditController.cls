/**
 * Created by Atlas on 24.10.2019.
 */

public with sharing class AccountEditController {

    @AuraEnabled(Cacheable=true)
    public static List<Account> getAccountEditList(List<String> Ids) {

        System.debug('IdsEDITTABLE' + Ids);
        System.debug('IdsEDITTABLESIZE' + Ids.size());
        List<String> newIds = Ids[0].split(',');

        //List<String> newIds = Ids.split(',');

        List<Account> accounts = [SELECT Name, Website, Acc_Custom_Date__c, Acc_Custom_Email__c FROM Account WHERE Id = :newIds];
        System.debug('ACCOUNTS' + accounts);
        return accounts;
    }

}