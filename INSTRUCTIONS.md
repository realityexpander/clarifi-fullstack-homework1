At HotSchedules we have large customers with thousands of restaurants across the country. Those customer restaurants are represented in hierarchies, like so:

Big Restaurant Co.
 - East Coast
   - Restaurant 1
   - Restaurant 2
 - West Coast
   - California
     - Southern California
       - Restaurant 3
     - Northern California
       - Restaurant 4
   - Washington
     - Restaurant 5
     - Restaurant 6

A node in the hierarchy can represent a restaurant or a group of restaurants. We'll refer to restaurants as "stores" and groups as "groups". Everything in the hierarchy above that starts with "Restaurant" is a store. Everything else is a group. Groups are made up of stores and/or other groups.

We process a lot of data from each restaurant. Some of this data we get from the Point of Sale (POS) systems at the stores. We get incremental updates and end of day summaries for items sold at each restaurant. Some of this data we generate, such as sales forecast data for each restaurant.

For this fictional problem, we will provide you with some mock data, that includes:

1. A store hierarchy
2. Gross sales for stores in the hierarchy
3. Sales forecasts for stores in the hierarchy

Using this data we would like you to implement the following:

# Function 1

The first function we would like you to write takes a node ID for a store or group in the hierarchy and a date. We would like you to return each node in the hierarchy and the total gross sales for that node on that date. For groups the total gross sales should be the sum of the gross sales for all groups and stores below it. You can find an example of the output we are expecting in snapshots/grossSales11.json. It looks like this:

```
{
  "name": "East Coast",
  "children": [
    {
      "name": "Boston Restaurant",
      "total": 12540.12
    },
    {
      "name": "New York Restaurant",
      "total": 4641.23
    }
  ],
  "total": 17181.35
}
```

We have stubbed out this function for you in index.js as so:

```
async function getGrossSales(nodeId, date) {
    // TODO:
    return {}
}
```

You have to fill in the details.

Available to you in index.js is a function called getStoreHierarchy to retrieve the hierarchy and getStoreSales to retrieve the sales. The data is defined in json files in the data folder.

We have provided two examples that when run should match the output in the snapshots folder:

```
getGrossSales(11, '2018-07-31').then(grossSales => {;
    console.log("getGrossSales node 11 OK = " + _.isEqual(grossSales,grossSalesSnapshot11));
});

getGrossSales(12, '2018-08-01').then(grossSales => {;
    console.log("getGrossSales node 12 OK = " + _.isEqual(grossSales,grossSalesSnapshot12));
});
```

# Function 2

The second function we would like you to write also takes a node ID and a date. This time we not only want you to return the total sales for each node, but also the variance between the sales and the forecast sales (we have provided a function called getSalesForecast). The variance is defined as:

`(totalSales/totalForecast) / 100`

The output looks like so:

```
{
  "name": "East Coast",
  "children": [
    {
      "name": "Boston Restaurant",
      "totalSales": 12540.12,
      "totalForecast": 12140.12,
      "variance": 0.010329486034734419
    },
    {
      "name": "New York Restaurant",
      "totalSales": 4641.23,
      "totalForecast": 1641.23,
      "variance": 0.02827897369655685
    }
  ],
  "totalSales": 17181.35,
  "totalForecast": 13781.35,
  "variance": 0.012467102279529942
}
```

# Getting Started

```
npm install
npm start
```

Good luck!