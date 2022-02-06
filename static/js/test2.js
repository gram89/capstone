async function getData() {
    
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
    d3.csv("static/resources/clean_historical.csv").then(function(data){
        let cities = data.map(a => a.City);
        let month = data.map(a =>a.Month);
        let year = data.map(a =>a.Year);
        let sold = data.map(a =>a.Sold_price_avg);
        let list = data.map(a =>a.List_price_avg);
        let days = data.map(a =>a.days_on_mar);
        let filteredCities = cities.filter((v, i, a) => a.indexOf(v) === i);
        console.log(filteredCities);
        filteredCities.forEach((sample) => {
            selector
              .append("option")
              .text(sample)
              .property("value", sample);
          });
      
          // Use the first sample from the list to build the initial plots
          var firstCity = filteredCities[0];
          buildCharts(firstCity);
          buildMetadata(firstCity);
          buildListings(firstCity)
        });
      }

getData();

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
    buildListings(newSample);
    
  }

  function buildMetadata(city) {
    d3.csv("static/resources/clean_historical.csv").then(function(data){
        // 3. Create a variable that holds the samples array. 
        let filteredData = data.filter(a => a.City == city);
      // Filter the data for the object with the desired sample number
      //var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = filteredData[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }

  function buildCharts(city) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.csv("static/resources/clean_historical.csv").then(function(data){
      // 3. Create a variable that holds the samples array. 
      let filteredData = data.filter(a => a.City == city);
      let filter2021 = filteredData.filter(a => a.Year == "2021");
      let filter2020 = filteredData.filter(a => a.Year == "2020");
      let filter2019 = filteredData.filter(a => a.Year == "2019");
      let filter2018 = filteredData.filter(a => a.Year == "2018");
      let filter2017 = filteredData.filter(a => a.Year == "2017");
      
      let month2021 = filter2021.map(a =>a.Month);
      let sold2021 = filter2021.map(a =>parseFloat(a.Sold_price_avg));
      //let list2021 = filter2021.map(a =>parseFloat(a.List_price_avg));
      let listVsSold2021 = filter2021.map(a =>(parseFloat(a.Sold_price_avg)-parseFloat(a.List_price_avg)));
      console.log(month2021.reverse());

      //console.log(monthArray);
      var lineData2021 = {
        x: month2021.reverse(),
        y: sold2021.reverse(),
        //text: labels.slice(0,10).reverse(),
        type: "scatter",
        name: "2021"
        //orientation: "h"
      };
      
      var barData2021 ={
          x: month2021.reverse(),
          y: listVsSold2021.reverse(),
          type: "bar",

      }
      
      let month2020 = filter2020.map(a =>a.Month);
      let sold2020 = filter2020.map(a =>parseFloat(a.Sold_price_avg));
      //let list2020 = filter2020.map(a =>parseFloat(a.List_price_avg));
      let listVsSold2020 = filter2020.map(a =>(parseFloat(a.Sold_price_avg)-parseFloat(a.List_price_avg)));

      //console.log(monthArray);
      var lineData2020 = {
        x: month2020.reverse(),
        y: sold2020.reverse(),
        //text: labels.slice(0,10).reverse(),
        type: "scatter",
        name: "2020"
        //orientation: "h"
      }
        
      ;

      let month2019 = filter2019.map(a =>a.Month);
      let sold2019 = filter2019.map(a =>parseFloat(a.Sold_price_avg));

      //console.log(monthArray);
      var lineData2019 = {
        x: month2019.reverse(),
        y: sold2019.reverse(),
        //text: labels.slice(0,10).reverse(),
        type: "scatter",
        name: "2019"
        //orientation: "h"
      };
      let month2018 = filter2018.map(a =>a.Month);
      let sold2018 = filter2018.map(a =>parseFloat(a.Sold_price_avg));

      //console.log(monthArray);
      var lineData2018 = {
        x: month2018.reverse(),
        y: sold2018.reverse(),
        //text: labels.slice(0,10).reverse(),
        type: "scatter",
        name: "2018"
        //orientation: "h"
      };
      let month2017 = filter2017.map(a =>a.Month);
      let sold2017 = filter2017.map(a =>parseFloat(a.Sold_price_avg));

      //console.log(monthArray);
      var lineData2017 = {
        x: month2017.reverse(),
        y: sold2017.reverse(),
        //text: labels.slice(0,10).reverse(),
        type: "scatter",
        name: "2017"
        //orientation: "h"
      };

      var dataSoldPrice = [ lineData2021, lineData2020, lineData2019, lineData2018, lineData2017]
      // 9. Create the layout for the bar chart. 
      var lineLayout = {
        title: "Sold Price Past 5 years"
             
      };
      var barLayout = {
        title: "How high are are people bidding"
             
      };
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar",dataSoldPrice,lineLayout)

      Plotly.newPlot("gauge",[barData2021],barLayout)
      //let listArray = data.map(a =>a.List_price_avg);
      //let soldListDiff = parseFloat(data.map(a =>a.Sold_price_avg)) - parseFloat(data.map(a =>a.List_price_avg));
      //let daysArray = data.map(a =>a.days_on_mar);

    //   // 4. Create a variable that filters the samples for the object with the desired sample number.
    //       let filteredMonth = month.filter(d => d.City == sample);
    //       let filteredYear = year.filter(d => d.City == sample);
    //       let filteredSold = sold.filter(d => d.City == sample);
    //       let filteredList = list.filter(d => d.City == sample);
    //       let filteredDays = days.filter(d => d.City == sample);

    //       console.log(filteredMonth[0]);
    })
}

function buildListings(city) {
  d3.csv("static/resources/clustered_listings.csv").then(function(data){
      // 3. Create a variable that holds the samples array. 
      let filteredData = data.filter(a => a.City.toUpperCase() == city.toUpperCase());
    // Filter the data for the object with the desired sample number
    //var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = filteredData[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#listings");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}