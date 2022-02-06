// Create path for pulling data into js
const path = "Resources/Salaries_cleaned_ontario.csv";

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.csv(path).then((data) => {
    var cityArray = data.map(a => a.ER_Name_Nom_RE);
    var sampleNames = cityArray.filter((v, i, a) => a.indexOf(v) === i);
    
    sampleNames.forEach((sample) => {
      selector.append("option")
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
    console.log(data);
    var metadata = data.metadata;
    console.log(metadata);
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

// Create the buildCharts function - build bar chart
function buildCharts(city) {
  // Use d3.json to load and retrieve the samples.json file 
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
    sampleCity.sort((a,b) => a.Median_Wage_Salaire_Median - b.Median_Wage_Salaire_Median);

    // Create variables that hold the variables
        let Title = sampleCity.map(a => a.NOC_Title);
        let Salary = sampleCity.map(a => a.Median_Wage_Salaire_Median);
       
    // Create variables with top 25
    let TitleTop = Title.slice(0,50);
    let SalaryTop = Salary.slice(0,50);

    // Create the ytickds for the bar chart
    let yticks = TitleTop.map(x => `Title: ${x}`);
        
    // Create the trace for the bar chart
    var barData = [{
      x: SalaryTop,
      y: yticks,
      text: TitleTop,
      type: "bar",
      barThickness: 500,
      orientation: "h",
    }];

    // Create the layout for the bar chart
    var barLayout = {
      title: "Top 25 Median Salary by Title",
    };

    // Use Plotly to plot the data with the layout
    Plotly.newPlot("bar", barData, barLayout);
  });
};
   
//         // 1. Create the trace for the bubble chart.
//     var bubbleData = [{
//       x: otuIds,
//       y: otuValues,
//       text: otuLabels,
//       mode: "markers",
//       text: otuLabels,
//       marker: {
//         color: otuIds,
//         colorscale: "Rainbow",
//         size:otuValues
//       }, 
//     }];

//     // 2. Create the layout for the bubble chart.
//     var bubbleLayout = {
//       title: 'Bacteria Cultures Per Sample',
//       xaxis: {
//         title: { 
//         text:"OTU ID"}, 
//         }
//     };

//     // 3. Use Plotly to plot the data with the layout.
//     Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

//     // 1. Create a variable that filters the metadata array for the object with the desired sample number.
//     let metaArray = data.metadata;

//     // 2. Create a variable that holds the first sample in the metadata array.
//     let fMeta = metaArray.filter(sampleObj => sampleObj.id == sample)[0];

//       // 3. Create a variable that holds the washing frequency.
//     let freq = parseFloat(fMeta.wfreq);
    
//     // 4. Create the trace for the gauge chart.
//     let gaugeData = [{
//       value: freq,
//       title: {text: "Scrubs per Week"},
//       type: "indicator",
//       mode: "gauge+number",
//       gauge:  {
//         bar: { color: "black" },
//         axis: { range: [0, 10] },
//         steps: [
//           { range: [0, 2], color: "red" },
//           { range: [2, 4], color: "orange"},
//           { range: [4, 6], color: "yellow" },
//           { range: [6, 8], color: "limegreen" },
//           { range: [8, 10], color: "darkgreen"}
//         ]
//       }
//     }];
    
//     // 5. Create the layout for the gauge chart.
//     let gaugeLayout = { 
//     //  another way just below to add title above the scrubs per week... but this way still in chart - using HTML puts outside chart (what I did)
//     //  title: { text: "Belly Button Washing Frequency", font: { size: 24 }},
//     //  changed the height from 500 to 300 so it looks a little better with different background color
//         width: 500, height: 300, margin: { t: 0, b: 0 }
//       };

//     // 6. Use Plotly to plot the gauge data and layout.
//     Plotly.newPlot("gauge", gaugeData, gaugeLayout);
//   });
// }