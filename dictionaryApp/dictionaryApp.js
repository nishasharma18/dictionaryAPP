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
            console.log('apiUrl ' + this.apiUrl);
        } else if (error) {
            console.error(error);
        }
    }

    handleWord(event){
        this.word = event.target.value;
    }

    handleSearch(){
        const searchText = this.word;
        //let url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + searchText;
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
            console.log('meanings: ' + JSON.stringify(datas[0].meanings));
            meanings.forEach((meaning, ind) => {
                meaningList += '<p>&#x2022; ' + meaning.definition + '</p>';
            });
            this.template.querySelector('.elementHoldingHTMLContent').innerHTML = meaningList;
            console.log('length: ' + Object.keys(datas[0].phonetics).length);
            let phonetics = datas[0].phonetics;
            console.log('phonetics: ' + JSON.stringify(phonetics));
            phonetics = JSON.stringify(phonetics);
            if(Object.keys(phonetics).length > 1){
                /*  var values = [];
                JSON.parse(phonetics, function (key, value) {
                    if(key == 'audio') {
                        if (value != "") {
                            alert(value);
                        }  
                    }
                }); */
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
            console.log('audioDiv: ' + audioDiv);
        })
        .catch(error => console.log(error))
    }
}