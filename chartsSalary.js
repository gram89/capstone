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
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  
}

// Create the buildCharts function - build bar chart
function buildCharts(city) {
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
      title: "Top 25 Median Salary by Job Title/Category",
    };

    // Use Plotly to plot the data with the layout
    Plotly.newPlot("bar", barData, barLayout);
  });
};
 