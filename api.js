const storeHierarchy = require('./data/storeHierarchy');
const storeSales = require('./data/storeSales');
const storeSalesForecasts = require('./data/storeSalesForecasts');

const getStoreHierarchy = () => {
    return new Promise((resolve) => {
        setTimeout(resolve(storeHierarchy), 100);
    });
}

const getStoreSales = () => {
    return new Promise((resolve) => {
        setTimeout(resolve(storeSales), 100);
    });
}

const getStoreSalesForecasts = () => {
    return new Promise((resolve) => {
        setTimeout(resolve(storeSalesForecasts), 100);
    });
}

module.exports = {
    getStoreHierarchy: getStoreHierarchy,
    getStoreSales: getStoreSales,
    getStoreSalesForecasts: getStoreSalesForecasts
}