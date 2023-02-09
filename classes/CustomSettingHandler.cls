public class CustomSettingHandler {
    @AuraEnabled (cacheable=true)
    public static Dictionary_API__c getDictionaryApiSettings(){
        system.debug('api:' + Dictionary_API__c.getOrgDefaults());
        return Dictionary_API__c.getOrgDefaults();
    } 
 }
