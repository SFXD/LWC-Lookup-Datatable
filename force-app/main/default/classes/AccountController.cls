public with sharing class AccountController {

    @AuraEnabled(Cacheable=true)
    public static List<Account> getSingleAccount() {
        return [SELECT Id, Name, Rating FROM Account];
    }

    @AuraEnabled(Cacheable=true)
    public static List<Account> getAccountList(List<String> Ids) {

        if(Ids.size() == 0) {
            return null;
        }

        System.debug('Ids' + Ids);
        List<Account> accounts = [SELECT Id, Name, Phone, Rating FROM Account WHERE Id=:Ids];
        System.debug('ACCOUNTS' + accounts);
        return accounts;
    }

    @AuraEnabled(Cacheable = true)
    public static List< Account > fetchAccounts( String searchKey ) {

        String strKey = '%' + searchKey + '%';
        return [ SELECT Id, Name, Industry FROM Account WHERE Name LIKE: strKey LIMIT 10 ];

    }

}