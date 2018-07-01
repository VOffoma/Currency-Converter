function idbService(){
    this.dbPromise = this._setupDB()
}

idbService.prototype._setupDB = function(){
    return idb.open('currencyConverter', 1, function(upgradeDb){
        const currencyListStore = upgradeDb.createObjectStore('currencyList', {
            keyPath: 'id',
        });
        currencyListStore.createIndex('id', 'id');

        const ratesStore = upgradeDb.createObjectStore('rates');
        // currencyListStore.createIndex('id', 'id');
    });
};

idbService.prototype.addData = function(dbStore, data){
    return this.dbPromise.then(function(db){
        const tx = db.transaction(dbStore, 'readwrite');
        const store = tx.objectStore(dbStore);
        for(let i in data){
            store.put(data[i]);
        }
        return tx.complete;
    });
};

idbService.prototype.saveRate = function(data, key){
    return this.dbPromise.then(function(db){
        const tx = db.transaction('rates', 'readwrite');
        const store = tx.objectStore('rates');
        store.put(data[key], key);
        return tx.complete;
    });
};

idbService.prototype.getRate = function(key){
    return this.dbPromise.then(function(db) {
        const tx = db.transaction('rates', 'readwrite');
        const store = tx.objectStore('rates');
        const rate = store.get(key);
        return rate;
    })
};

idbService.prototype.getAllData = function(dbStore) { 
    return this._dbPromise.then( function(db) {
        const tx = db.transaction(dbStore);
        const store = tx.objectStore(dbStore);
        return store.getAll();
    });
};
