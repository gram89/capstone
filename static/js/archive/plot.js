function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.csv("clean_historical.csv", function(d) {
        return {
          city : d.City,
          month : d.Month,
          year : +d.Year,
          sold : +d.Sold_price_avg,
          days : +d.days_on_mar
          //land_area : +d["land area"]
        };
     }).then(function(data){}) {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Initialize the dashboard
  init();
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
    
  }
  
  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
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
  
  // 1. Create the buildCharts function.
  function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      // 3. Create a variable that holds the samples array. 
          let otuData = data.samples;
          let metadata = data.metadata;
      // 4. Create a variable that filters the samples for the object with the desired sample number.
          let filteredOtuData = otuData.filter(sampleObj => sampleObj.id == sample);
          let filteredMetaData = metadata.filter(sampleObj => sampleObj.id == sample);
          console.log(filteredMetaData);
      //  5. Create a variable that holds the first sample in the array.
          let result = filteredOtuData[0];
          let resultMeta = filteredMetaData[0];
      console.log(result);
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
          let otuId = result.otu_ids;
          let labels = result.otu_labels;
          let sampleValues = result.sample_values;
          let wfreq = parseFloat(resultMeta.wfreq);
      console.log(otuId.slice(0,10).reverse());
      console.log(labels.slice(0,10).reverse());
      console.log(sampleValues.slice(0,10).reverse());
      console.log(wfreq);
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
  
      var yticks = otuId.slice(0,10).map(otuId => "OTU "+ otuId).reverse();
      console.log(yticks);
  
      // 8. Create the trace for the bar chart. 
      var barData = [{
        x: sampleValues.slice(0,10).reverse(),
        y: yticks,
        text: labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"
      }
        
      ];
      // 9. Create the layout for the bar chart. 
      var barLayout = {
        title: "Top 10 Bacteria Cultures"
             
      };
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar",barData,barLayout)
  
      // 11. Bubble Chart
      let bubbleChart = {
        title: "Bacteria Cultures",
      };
      let bubbleData =[{
        x: otuId,
        y: sampleValues,
        text: labels,
        mode:"markers",
        marker: {
          size: sampleValues,
          color: otuId,
          colorscale: "Earth"
        }
  
      }];
      Plotly.newPlot("bubble",bubbleData,bubbleChart);
      // creating the gauge chart
      let gaugeData = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: wfreq,
          title: { text: "Scrubs per week" },
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: {range: [0,10],tickwidth: 1, tickcolor: "black"},
            steps:[
              {range:[0,2], color:"red"},
              {range:[2,4], color:"orange"},
              {range:[4,6], color:"yellow"},
              {range:[6,8], color:"lightgreen"},
              {range:[8,10], color:"green"},
            ],
            bar: {color: "black"}
          }
        }
      ];
      
      var gaugeLayout = { title: "Belly Button Washing Frequency" };
      Plotly.newPlot('gauge', gaugeData, gaugeLayout);
    });
  }
  