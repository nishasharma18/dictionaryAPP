import { LightningElement, track, wire } from 'lwc';
import getDictionaryApiSettings from '@salesforce/apex/CustomSettingHandler.getDictionaryApiSettings';

export default class DictionaryApp extends LightningElement {
    meaningData = false;
    @track apiUrl;
    @track word;
    @track audioDiv;

    connectedCallback(){
        this.getDictionaryApiSettings;
    }

    @wire(getDictionaryApiSettings, {})
    getDictionaryApiSettings({ error, data }) {
        if (data) {
            console.log('data: '+ JSON.stringify(data));
            this.apiUrl = data.Url__c;
        } else if (error) {
            console.error(error);
        }
    }

    handleWord(event){
        this.word = event.target.value;
    }

    handleSearch(){
        const searchText = this.word;
        let url = this.apiUrl+searchText;
        fetch(url)
        .then(response => {
            if(response.ok) {
                this.meaningData = true;
                return response.json();
            } else {
                this.meaningData = false;
                let meaningDiv = 'Unable To Find The Meaning Of <b>"'+ searchText+ '"</b>. Please, Try To Search For Another Word.';
                this.template.querySelector('.elementHoldingHTMLContent').innerHTML = meaningDiv;
                let audioDiv = null;
                this.template.querySelector('.audioDiv').innerHTML = audioDiv;
                throw Error(response);
            }
        })
        .then(datas => {
            let audioDiv = '';
            let audioLink = '';
            console.log('datas: ' + JSON.stringify(datas));
            let meaningList = '';
            const meanings = datas[0].meanings[0].definitions;
            meanings.forEach((meaning, ind) => {
                meaningList += '<p>&#x2022; ' + meaning.definition + '</p>';
            });
            this.template.querySelector('.elementHoldingHTMLContent').innerHTML = meaningList;
            let phonetics = datas[0].phonetics;
            phonetics = JSON.stringify(phonetics);
            if(Object.keys(phonetics).length > 1){
                JSON.parse(phonetics).forEach(element => {
                    if(element['audio'] != '') {
                        audioLink = element['audio'];
                    }
                });
                audioDiv = '<audio src="' + audioLink +'" controls>';
            } else {
                audioDiv = '<audio src="' + datas[0].phonetics[0].audio +'" controls>';
            }
            
            this.template.querySelector('.audioDiv').innerHTML = audioDiv;
        })
        .catch(error => console.log(error))
    }
}
