// Create path for pulling data into js
const path = "Resources/Salaries_cleaned_ontario.csv";

d3.json("/getdata").then((data) => {
  console.log(data)
})

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  var select = d3.select("#selTitle");

  // Use the list of sample names to populate the select options
  d3.csv(path).then((data) => {
    var cityArray = data.map(a => a.ER_Name_Nom_RE);
    var sampleNames = cityArray.filter((v, i, a) => a.indexOf(v) === i);
    
    sampleNames.forEach((sample) => {
      selector.append("option")
        .text(sample)
        .property("value", sample);
    });

    // Create a variable that filters the titles for the objet with the desired City
    let sampleTitle = data.filter(Obj => Obj.ER_Name_Nom_RE == sampleNames[0]);
    // Convert salaries in data to numbers
    sampleTitle.forEach(function(d){
      d.Median_Wage_Salaire_Median = +d.Median_Wage_Salaire_Median});
    var titleL = sampleTitle.filter(a => a.Median_Wage_Salaire_Median > 0);
    var titleOnly = titleL.map(a => a.NOC_Title);
    var titleU = titleOnly.filter((v, i, a) => a.indexOf(v) === i);
    
    titleU.forEach((tList) => {
      select.append("option")
        .text(tList)
        .property("value", tList);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    var titleList = titleU[0];
    buildCharts(firstSample);
    buildSalaryRange(firstSample,titleList);
  });
}

// Initialize the dashboard
init();


function optionChanged() {
  // Fetch new data each time a new sample is selected
  buildSalaryRange();
  buildCharts();
}


function optionChanged2() {
  // Fetch new data each time a new sample is selected
  buildSalaryRange();
}


// Create the buildCharts function - build bar chart
function buildCharts(city) {
  // Use D3 to select the dropdown menu for City and assign to a variable
  var dropdownCity = d3.select("#selDataset");
  var dataCity = dropdownCity.property("value");

  // Use D3 to select the dropdown for Title and assign to a variable
  var dropdownTitle = d3.select("#selTitle");
  var dataTitle = dropdownTitle.property("value");

  // Use d3.json to load and retrieve the csv file 
  d3.csv(path).then((data) => {
    // Create a variable that filters the Cities for the objet with the desired Title
    let sampleCity = data.filter(Obj => Obj.ER_Name_Nom_RE == dataCity);

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
      title: `Top 25 Median Salary by Title for ${city}`,
    };

    // Use Plotly to plot the data with the layout
    Plotly.newPlot("bar", barData, barLayout);
  });
};


// Create the buildSalaryRange function - build bar chart
function buildSalaryRange() {
  // Use D3 to select the dropdown menu for City and assign to a variable
  var dropdownCity = d3.select("#selDataset");
  var dataCity = dropdownCity.property("value");
     
  // Use D3 to select the dropdown for Title and assign to a variable
  var dropdownTitle = d3.select("#selTitle");
  var dataTitle = dropdownTitle.property("value");
  
  // Use d3.csv to load and retrieve the  file 
  d3.csv(path).then((data) => {

    // Create a variable that filters the Title and Cities for the objet with the desired Title
    let range1 = data.filter(Obj => Obj.NOC_Title == dataTitle);
    let range = range1.filter(Obj => Obj.NOC_Title == dataTitle);
    console.log(range);    

    // Convert salaries in data to numbers
    range.forEach(function(d){
      d.Median_Wage_Salaire_Median = +d.Median_Wage_Salaire_Median;
      d.Low_Wage_Salaire_Minium = +d.Low_Wage_Salaire_Minium;
      d.High_Wage_Salaire_Maximal = +d.High_Wage_Salaire_Maximal;
    });

    // Create variables that hold the range of salaries
    let mid = range.map(a => a.Median_Wage_Salaire_Median);
    let min = range.map(a => a.Low_Wage_Salaire_Minium);
    let max = range.map(a => a.High_Wage_Salaire_Maximal);
    let salaryRange = [...min, ...mid, ...max];
    console.log(salaryRange);

    // Create the trace for the bar chart
    var barData = [{
      x: salaryRange,
      y: salaryRange,
      //text: salaryRange,
      type: "bar",
      barThickness: 100,
      orientation: "v",
    }];

    // Create the layout for the bar chart
    var barLayout = {
      title: `Salary Range for ${dataTitle} in ${dataCity}`,
    };

    // Use Plotly to plot the data with the layout
    Plotly.newPlot("range", barData, barLayout);
  });
};


function uniq(a) {
  return a.sort().filter(function(item, pos, ary) {
      return !pos || item != ary[pos - 1];
  });
}





