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
    // TODO:
    return {};
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

getGrossSales(11, '2018-07-31').then(grossSales => {
    ;
    console.log("getGrossSales node 11 OK = " + _.isEqual(grossSales, grossSalesSnapshot11));
});

getGrossSales(12, '2018-08-01').then(grossSales => {
    ;
    console.log("getGrossSales node 12 OK = " + _.isEqual(grossSales, grossSalesSnapshot12));
});

// getForecastVariance(11, '2018-07-31').then(forecastVariance => {
//     console.log("getForecastVariance node 11 OK = " + _.isEqual(forecastVariance, forecastVarianceSnapshot11));
// });

// getForecastVariance(12, '2018-08-01').then(forecastVariance => {
//     console.log("getForecastVariance node 12 OK = " + _.isEqual(forecastVariance, forecastVarianceSnapshot12));
// });
