const path = "static/resources/Salaries_cleaned_ontario.csv";
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
      async function getData2() {
        var selector2 = d3.select("#selDataset2");
        d3.csv(path).then((data) => {
        var cityArray = data.map(a => a.ER_Name_Nom_RE);
        var sampleNames = cityArray.filter((v, i, a) => a.indexOf(v) === i);
        
        sampleNames.forEach((sample) => {
          selector2.append("option")
            .text(sample)
            .property("value", sample);
        });
    
        // Use the first sample from the list to build the initial plots
        var firstSample = sampleNames[0];
        console.log(firstSample);
        buildCharts2(firstSample);
        buildMetadata2(firstSample);
      });
    }

getData();
getData2();

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
    buildListings(newSample);
    
  }
  function optionChanged2(newSample) {
    // Fetch new data each time a new sample is selected
    
    buildCharts2(newSample);
    buildMetadata2(newSample);
    
  }

  function buildMetadata(city) {
    d3.csv("static/resources/clean_historical.csv").then(function(data){
        // 3. Create a variable that holds the filtered array
        let filteredData = data.filter(a => a.City == city);
        var filteredColumns = filteredData.map(function(d) {
          return {
            "Average Sold Price($)": d.Sold_price_avg,
            "Average List Price($)": d.List_price_avg,
            "Days on the Market": d.days_on_mar,

          }
        });
        
      var result = filteredColumns[0];
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h4").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }

  function buildMetadata2(city) {

    d3.csv(path).then((data) => {
      // Create a variable that filters the Cities for the objet with the desired Title
      let sampleCity = data.filter(Obj => Obj.ER_Name_Nom_RE == city);
      
      // Convert salaries in data to numbers
      var filteredColumns = sampleCity.map(function(d){
        return {
        JobTitle : d.NOC_Title,
        MedianSalary : +d.Median_Wage_Salaire_Median,
        MinimumSalary : +d.Low_Wage_Salaire_Minium,
        MaximumSalary : +d.High_Wage_Salaire_Maximal,

        }
        
      });
      let result1 = filteredColumns.sort((b,a) => a.MedianSalary - b.MedianSalary);
      var result = result1[0];
      console.log(result);
      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata2");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h4").text(`${key.toUpperCase()}: ${value}`);
      });
  
    });
  }

  function buildCharts(city) {
    // 2. Use d3.json to load and retrieve the data
    d3.csv("static/resources/clean_historical.csv").then(function(data){
      // 3. Create a variable that holds the samples array. 
      let filteredData = data.filter(a => a.City == city);
      let filter2021 = filteredData.filter(a => a.Year == "2021");
      let filter2020 = filteredData.filter(a => a.Year == "2020");
      let filter2019 = filteredData.filter(a => a.Year == "2019");
      let filter2018 = filteredData.filter(a => a.Year == "2018");
      let filter2017 = filteredData.filter(a => a.Year == "2017");
      
      let month2021 = filter2021.map(a =>a.Month).reverse();
      let sold2021 = filter2021.map(a =>parseFloat(a.Sold_price_avg));
      //let list2021 = filter2021.map(a =>parseFloat(a.List_price_avg));
      let listVsSold2021 = filter2021.map(a =>(parseFloat(a.Sold_price_avg)-parseFloat(a.List_price_avg)));
      let listVsSold2020 = filter2020.map(a =>(parseFloat(a.Sold_price_avg)-parseFloat(a.List_price_avg)));
      let listVsSold2019 = filter2019.map(a =>(parseFloat(a.Sold_price_avg)-parseFloat(a.List_price_avg)));
      let listVsSold2018 = filter2018.map(a =>(parseFloat(a.Sold_price_avg)-parseFloat(a.List_price_avg)));
      let listVsSold2017 = filter2017.map(a =>(parseFloat(a.Sold_price_avg)-parseFloat(a.List_price_avg)));
      let days2021 = filter2021.map(a =>parseFloat(a.days_on_mar));
      let days2020 = filter2020.map(a =>parseFloat(a.days_on_mar));
      let days2019 = filter2019.map(a =>parseFloat(a.days_on_mar));
      console.log(month2021.reverse());
      //console.log(monthArray);
      var lineData2021 = {
        x: month2021.reverse(),
        y: sold2021.reverse(),
        //text: labels.slice(0,10).reverse(),
        type: "scatter",
        name: "2021"
        //orientation: "h"
      }
      
      var barData2021 ={
          x: month2021.reverse(),
          y: listVsSold2021.reverse(),
          type: "bar",
          name: "2021"

      }

      var daysonMar2021 ={
        x: month2021.reverse(),
        y: days2021.reverse(),
        type: "scatter",
        name: "2021"

    }
      
      let month2020 = filter2020.map(a =>a.Month);
      let sold2020 = filter2020.map(a =>parseFloat(a.Sold_price_avg));
      //let list2020 = filter2020.map(a =>parseFloat(a.List_price_avg));
      //let listVsSold2020 = filter2020.map(a =>(parseFloat(a.Sold_price_avg)-parseFloat(a.List_price_avg)));

      //console.log(monthArray);
      var lineData2020 = {
        x: month2020.reverse(),
        y: sold2020.reverse(),
        //text: labels.slice(0,10).reverse(),
        type: "scatter",
        name: "2020"
        //orientation: "h"
      }

      var barData2020 ={
        x: month2020.reverse(),
        y: listVsSold2020.reverse(),
        type: "bar",
        name: "2020"

    }
    var daysonMar2020 ={
      x: month2020.reverse(),
      y: days2020.reverse(),
      type: "scatter",
      name: "2020"

    }
    
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
      }

      var barData2019 ={
        x: month2019.reverse(),
        y: listVsSold2019.reverse(),
        type: "bar",
        name: "2019"

    }
    var daysonMar2019 ={
      x: month2019.reverse(),
      y: days2019.reverse(),
      type: "scatter",
      name: "2019"

  }
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
      }

      var barData2018 ={
        x: month2018.reverse(),
        y: listVsSold2018.reverse(),
        type: "bar",
        name: "2018"

    }
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
      }

      var barData2017 ={
        x: month2017.reverse(),
        y: listVsSold2017.reverse(),
        type: "bar",
        name: "2017"

    }

      var dataSoldPrice = [ lineData2021, lineData2020, lineData2019, lineData2018, lineData2017];
      var soldVsList = [barData2021, barData2020, barData2019];
      var daysOnMar = [daysonMar2021, daysonMar2020, daysonMar2019];
      // 9. Create the layout for the bar chart. 
      var lineLayout = {
        title: "Sold Price Past 5 years"
             
      };
      var barLayout = {
        title: "How high are are people bidding over the list price?",
        subtitle: "Difference between Sold and List Prices"
             
      };

      var soldDays = {
        title: "How long does a home stay on the market before selling?",
        subtitle: "Difference between Sold and List Prices"
             
      };

      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar",dataSoldPrice,lineLayout)

      Plotly.newPlot("gauge",soldVsList,barLayout)

      Plotly.newPlot("bibble1", daysOnMar, soldDays)
    
    })
}

function buildListings(city) {
  d3.csv("static/resources/clustered_listings.csv").then(function(data){
    // 3. Create a variable that holds the filtered array
    let filteredData = data.filter(a => a.City.toUpperCase() == city.toUpperCase());
    var filteredColumns = filteredData.map(function(d) {
      return {
        "Listing Address": d.Address,
        "Postal Code": d.Postal_Code,
        "Beds": d.Beds,
        "Baths": d.Baths,
        "List Price": d.Price

      }
    });
    
      // 3. Create a variable that holds the samples array. 
    //  let filteredColumns = data.filter(a => a.City.toUpperCase() == city.toUpperCase());
    // Filter the data for the object with the desired sample number
    //var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result1 = filteredColumns[0];
    var result2 = filteredColumns[1];
    var result3=filteredColumns[2];
    var result4 = filteredColumns[3];
    var result5 = filteredColumns[4];
    var result6 = filteredColumns[5];
    console.log(filteredData[0]);
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#listing1");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result1).forEach(([key, value]) => {
      PANEL.append("h4").text(`${key.toUpperCase()}: ${value}`);
    });

    var PANEL = d3.select("#listing2");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result2).forEach(([key, value]) => {
      PANEL.append("h4").text(`${key.toUpperCase()}: ${value}`);
    });

    var PANEL = d3.select("#listing3");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result3).forEach(([key, value]) => {
      PANEL.append("h4").text(`${key.toUpperCase()}: ${value}`);
    });
    var PANEL = d3.select("#listing4");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result4).forEach(([key, value]) => {
      PANEL.append("h4").text(`${key.toUpperCase()}: ${value}`);
    });
    var PANEL = d3.select("#listing5");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result5).forEach(([key, value]) => {
      PANEL.append("h4").text(`${key.toUpperCase()}: ${value}`);
    });
    var PANEL = d3.select("#listing6");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result6).forEach(([key, value]) => {
      PANEL.append("h4").text(`${key.toUpperCase()}: ${value}`);
    });


  });
}

function buildCharts2(city) {
  // Use d3.csv to load and retrieve the samples.json file 
  d3.csv(path).then((data) => {
    // Create a variable that filters the Cities for the objet with the desired Title
    let sampleCity = data.filter(Obj => Obj.ER_Name_Nom_RE == city);
    
    // Convert salaries in data to numbers
    data.forEach(function(d){
      d.Median_Wage_Salaire_Median = +d.Median_Wage_Salaire_Median;
      d.Low_Wage_Salaire_Minium = +d.Low_Wage_Salaire_Minium;
      d.High_Wage_Salaire_Maximal = +d.High_Wage_Salaire_Maximal;
    });

    // Sort data by median salary
    let sortedSampleCity=sampleCity.sort((b,a) => a.Median_Wage_Salaire_Median - b.Median_Wage_Salaire_Median);

    // Create variables that hold the variables
        let Title = sortedSampleCity.map(a => a.NOC_Title);
        let Salary = sortedSampleCity.map(a => a.Median_Wage_Salaire_Median);
       
    // Create variables with top 25
    let TitleTop = Title.slice(0,10);
    let SalaryTop = Salary.slice(0,10);

    // Create the ytickds for the bar chart
    //let yticks = TitleTop.map(x => `Title: ${x}`);
    let yticksRev = TitleTop.map(x => x.substring(0,15));
        
    // Create the trace for the bar chart
    var barData = [{
      y: SalaryTop,
      x: yticksRev,
      //text: TitleTop,
      type: "bar",
      //barThickness: 500,
      //orientation: "h",
    }];

    // Create the layout for the bar chart
    var barLayout = {
      title: "Top 10 Median Salary by Job Title/Category",
      
    };

    // Use Plotly to plot the data with the layout
    Plotly.newPlot("bar2", barData, barLayout);
  });
};