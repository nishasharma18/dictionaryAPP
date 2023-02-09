public with sharing class newsController {
    @AuraEnabled
    public static Map<String, Object> retriveNews(string searchKey,string country,string category){
        News_API__c news_api = News_API__c.getOrgDefaults();
        system.debug(news_api.Endpoint__c);
        system.debug(news_api.Key__c);
        String SEARCH_URL = news_api.Endpoint__c;
        String API_KEY = news_api.Key__c; //Put your API_KEY here 
        searchKey = searchKey == null ? '' : searchKey;
        country = country == 'all' ? 'us' : country;
        system.debug('country: '+ country);
        category = category == 'all' ? '' : category;

        String url = SEARCH_URL+'/top-headlines?country='+country+'&category='+category+'&q='+searchKey+'&apiKey='+API_KEY;
        system.debug('url: '+ url);

        HttpRequest httpRequest = new HttpRequest();
        httpRequest.setEndpoint(url);
        httpRequest.setMethod('GET');

        Map<String, Object> newsJsonData = new Map<String, Object>();
        String strResponse = null;

        try{
            Http http = new Http();
            HttpResponse httpResponse = http.send(httpRequest);
            if(httpResponse.getStatusCode() == 200){
                strResponse = httpResponse.getBody();
            } else {
                throw new CalloutException(httpResponse.getBody());
            }

        } catch(Exception ex){
            throw ex;
        }

        if(!String.isBlank(strResponse)){
            newsJsonData = (Map<String, Object>)JSON.deserializeUntyped(strResponse);
        }
        if(!newsJsonData.isEmpty()){
            return newsJsonData;
        } else {
            return null;
        }
    }
}
