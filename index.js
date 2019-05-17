const _ = require('lodash');
const grossSalesSnapshot11 = require('./snapshots/grossSales11.json');
const grossSalesSnapshot12 = require('./snapshots/grossSales12.json');
const forecastVarianceSnapshot11 = require('./snapshots/forecastVariance11.json');
const forecastVarianceSnapshot12 = require('./snapshots/forecastVariance12.json');
const { getStoreHierarchy, getStoreSales, getStoreSalesForecasts } = require('./api');

async function getGrossSales(nodeId, date) {
    let storeHierarchy = await getStoreHierarchy();
    let storeSales = await getStoreSales();
    let result = { total: 0 };
    let grandTotal = 0;

    // Get the region
    for (let store of storeHierarchy.children) {
        if (store.id === nodeId) {
            [result,] = processStoreChildren(store, storeSales, date, {});
            result.name = store.name;
            result.total = grandTotal;
            break;
        }
    }

    return result;

    function processStoreChildren(storeHeirarchy, storeSales, date, result) {
        let subTotal = 0;

        // Get the totals for individual stores
        for (let theCurrentStore of storeHeirarchy.children) {
            if (theCurrentStore.isStore) {
                // Add up all gross sales for the current store on date
                let currentStoreSalesSubtotal = 0;
                for (let storeSale of storeSales) {
                    if (storeSale.storeId === theCurrentStore.id &&
                        storeSale.businessDay === date) {
                        currentStoreSalesSubtotal += storeSale.grossSales;
                    }
                }

                // create child node for results
                if (!result.children) result.children = [];
                result.children.push({ name: theCurrentStore.name, total: currentStoreSalesSubtotal });

                // compute the totals for the stores in this zone
                result.total = result.total ? result.total + currentStoreSalesSubtotal : currentStoreSalesSubtotal;
                subTotal = result.total;
                grandTotal += currentStoreSalesSubtotal;
            } else {
                // create output nodes & recurse
                if (!result.children) {
                    result.children = [];
                    result.total = 0;
                }
                result.children.push({ name: theCurrentStore.name });

                [, subTotal] = processStoreChildren(theCurrentStore, storeSales, date, result.children[result.children.length - 1]);
                result.total += subTotal;
            }
        }

        return [result, subTotal];

    }
}



async function getForecastVariance(nodeId, date) {
    let storeHierarchy = await getStoreHierarchy();
    let storeForecasts = await getStoreSalesForecasts();
    let storeSales = await getStoreSales();
    let result = { total: 0 };
    let grandTotalSales = 0;
    let grandTotalForecast = 0;

    // Get the region
    for (let store of storeHierarchy.children) {
        if (store.id === nodeId) {
            [result, ,] = processStoreForecastChildren(store, storeForecasts, storeSales, date, {});
            result.name = store.name;
            result.totalSales = grandTotalSales;
            result.totalForecast = grandTotalForecast;
            result.variance = (grandTotalSales / grandTotalForecast) / 100;
            break;
        }
    }

    return result;

    function processStoreForecastChildren(storeHeirarchy, storeForecasts, storeSales, date, result) {
        let subTotalSales = 0;
        let subTotalForecast = 0;

        // Get the totals for individual stores
        for (let theCurrentStore of storeHeirarchy.children) {
            if (theCurrentStore.isStore) {
                // Add up all gross forecast for the current store on date
                let currentStoreForecastSubtotal = 0;
                let currentStoreSalesSubtotal = 0;
                for (let storeForecast of storeForecasts) {
                    if (storeForecast.storeId === theCurrentStore.id &&
                        storeForecast.businessDay === date) {
                        currentStoreForecastSubtotal += storeForecast.forecastGrossSales;
                    }
                }

                // Add up all gross sales for the current store on date
                for (let storeSale of storeSales) {
                    if (storeSale.storeId === theCurrentStore.id &&
                        storeSale.businessDay === date) {
                        currentStoreSalesSubtotal += storeSale.grossSales;
                    }
                }


                // create child node for results
                if (!result.children) result.children = [];
                let variance = 0; // Protect against nulls
                if (currentStoreForecastSubtotal != 0) {
                    variance = (currentStoreSalesSubtotal / currentStoreForecastSubtotal) / 100;
                }
                result.children.push({
                    name: theCurrentStore.name,
                    totalSales: currentStoreSalesSubtotal,
                    totalForecast: currentStoreForecastSubtotal,
                    variance: variance
                });

                // compute the totals for the stores in this zone
                result.totalSales = result.totalSales ? result.totalSales + currentStoreSalesSubtotal : currentStoreSalesSubtotal;
                result.totalForecast = result.totalForecast ? result.totalForecast + currentStoreForecastSubtotal : currentStoreForecastSubtotal;
                result.variance = (result.totalSales / result.totalForecast) / 100;
                subTotalSales = result.totalSales;
                subTotalForecast = result.totalForecast;
                grandTotalSales += currentStoreSalesSubtotal;
                grandTotalForecast += currentStoreForecastSubtotal;
            } else {
                // create output nodes & recurse
                if (!result.children) {
                    result.children = [];
                    result.totalSales = 0;
                    result.totalForecast = 0;
                }
                result.children.push({ name: theCurrentStore.name });

                [, subTotalSales, subTotalForecast] = processStoreForecastChildren(theCurrentStore, storeForecasts, storeSales, date, result.children[result.children.length - 1]);
                result.totalSales += subTotalSales;
                result.totalForecast += subTotalForecast;
                result.variance = (result.totalSales / result.totalForecast) / 100;
            }
        }

        return [result, subTotalSales, subTotalForecast];

    }
}


// **************
// TEST FUNCTIONS
// --------------
// Expected Output:
// getGrossSales node 11 OK =true
// getGrossSales node 12 OK = true 
// getForecastVariance node 11 OK = true
// getForecastVariance node 12 OK = true
// **************************************

// getGrossSales(11, '2018-07-31').then(grossSales => {
//     ;
//     console.log("getGrossSales node 11 OK = " + _.isEqual(grossSales, grossSalesSnapshot11));
// });

// getGrossSales(12, '2018-08-01').then(grossSales => {
//     ;
//     console.log("getGrossSales node 12 OK = " + _.isEqual(grossSales, grossSalesSnapshot12));
// });

// getForecastVariance(11, '2018-07-31').then(forecastVariance => {
//     console.log("getForecastVariance node 11 OK = " + _.isEqual(forecastVariance, forecastVarianceSnapshot11));
// });

getForecastVariance(12, '2018-08-01').then(forecastVariance => {
    console.log("getForecastVariance node 12 OK = " + _.isEqual(forecastVariance, forecastVarianceSnapshot12));
});
