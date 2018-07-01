const origin = 'https://free.currencyconverterapi.com/api/v5';

const dataService = {
    getConversionRate: async function(query){
        const url = `${origin}/convert?q=${query}&compact=ultra`;
        const response = await fetch(url);
        const jsonResponse = await response.json();
        //const val = jsonResponse[query];
        return jsonResponse;
    
     }, 
    getCurrencies: async function(){
       const response = await fetch(`${origin}/currencies`);
       const jsonResponse = await response.json();
       const currencies = jsonResponse['results'];
       return currencies;
    }, 
    getCountries: async function(){
        const response = await fetch(`${origin}/countries`);
        const jsonResponse = await response.json();
        const countries = jsonResponse['results'];
        return countries;
     }
};
