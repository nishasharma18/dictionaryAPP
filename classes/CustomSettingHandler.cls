public class CustomSettingHandler {
    @AuraEnabled (cacheable=true)
    public static Github_API__c getGithubApiSettings(){
        system.debug('api:' + Github_API__c.getOrgDefaults());
        return Github_API__c.getOrgDefaults();
    }

    @AuraEnabled (cacheable=true)
    public static Joke_API__c getJokeApiSettings(){
        system.debug('api:' + Joke_API__c.getOrgDefaults());
        return Joke_API__c.getOrgDefaults();
    }  

    @AuraEnabled (cacheable=true)
    public static Dictionary_API__c getDictionaryApiSettings(){
        system.debug('api:' + Dictionary_API__c.getOrgDefaults());
        return Dictionary_API__c.getOrgDefaults();
    } 
 }