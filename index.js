const fromCurrencySelectElm = document.getElementById('fromCurrency');
const toCurrencySelectElm = document.getElementById('toCurrency');
const amountElm = document.getElementById('amount');
const resultElm = document.getElementById('result');
const buttonElm = document.getElementById('getResult');
buttonElm.addEventListener('click', function(e){
    index.getOnlineConversionRate();
    e.preventDefault();
});
const IDBDatabase = new idbService();

const index = {
    init: function(){
        window.addEventListener('load', async function(){
            index.registerServiceWorker();
            await index.loadCurrencyList();
        });
    },
    registerServiceWorker: async function() {
        try {
            if (!navigator.serviceWorker) return;
            await navigator.serviceWorker.register('/wedeycurrencyconverter.github.io/sw.js');
            console.log('Registration worked!');
        } catch (error) {
            console.log('Registration failed!');
        }
    },
    loadCurrencyList: async function(){
        try{
            const currencyList = await dataService.getCurrencies();
            this.updateUIWithCurrenciesInfo(currencyList);
            IDBDatabase.addData('currencyList', currencyList);
        }
        catch(err){
            const currencyList = IDBDatabase.getAllData('currencyList');
            this.updateUIWithCurrenciesInfo(currencyList);
        }  
    },
    updateUIWithCurrenciesInfo: function(currencyList){
        let selectOptions = '<option value="0">Select Currency:</option>', currency;
        for(let i in currencyList){
           currency = currencyList[i];
           selectOptions += `<option value='${currency.id}'>${currency.currencyName}</option>`;
        }
        fromCurrencySelectElm.innerHTML = toCurrencySelectElm.innerHTML = selectOptions;
    },
    getOnlineConversionRate: function(){
        const fromCurrency = encodeURIComponent(fromCurrencySelectElm.value);
        const toCurrency = encodeURIComponent(toCurrencySelectElm.value);
        const amount = parseFloat(amountElm.value);
        // const msg = this.areInputsValid(fromCurrency, toCurrency, amount);
        // if (msg !== true){
        //     alert(msg);
        // }
        // else{
            const query = fromCurrency + '_' + toCurrency;
       
            dataService.getConversionRate(query).then(function(rate){
                const rateVal = rate[query];
                index.updateUIWithConvertedAmount(rateVal, amount);
                IDBDatabase.saveRate(rate, query);
            })
            .catch(async function(){
               index.getOfflineConversionRate(query, amount);
            }); 
        //}
          
        
    },
    getOfflineConversionRate: async function(query, amount){
        const rate = await IDBDatabase.getRate(query)
        if(rate){
           this.updateUIWithConvertedAmount(rate, amount);
        }
        else{
            alert('Please go online to check this rate');
        }
    },
    updateUIWithConvertedAmount: function(conversionRate, amount){
        const total = Math.round(amount * conversionRate * 100) / 100;
        resultElm.innerHTML = total;
    },
    areInputsValid: function(fromCurrency, toCurrency, amount){
        let message = "";
        if(amount == null || amount == undefined || typeof myVar === 'string' || myVar instanceof String){
            message = 'Please put a valid amount e.g 10, 100.00 etc';
            return message;
        }
        if(!fromCurrency || !toCurrency){
            message = 'Please select a currency';
            return message;
        }
        if(fromCurrency === toCurrency){
            message = 'The from currency can not be the same as the to currency';
            return message;
        }
        return true;
   }
};

index.init();