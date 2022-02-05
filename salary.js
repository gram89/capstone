// Create path for pulling data into js
const path = "Resources/Salaries_cleaned_ontario.csv";

function init(){
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of cities to populate the select option
    d3.csv(path).then((data) =>{
        var cityArray = data.map(a => a.ER_Name_Nom_RE);
        console.log(cityArray);
        var cityUnique = cityArray.filter((v, i, a) => a.indexOf(v) === i);
        console.log(cityUnique);
        //var cityList = cityUnique.toString();
        //console.log(cityList);
        var cityList = {cityUnique};
        console.log(cityList);

        cityList.forEach((city) =>{
            selector
              .append("option")
              .text(city)
              .property("value", city);
        });

    // Use the first sample from the list to build the initial graph
    var firstCity = cityList[0];
    buildCharts(firstCity);
    });
}

// Initialize the dashboard
init();

function optionChanged(newCity){
   // Fetch new data each time a new sample is selected
   buildCharts(newCity);
}

// Create the buildChart function - bar chart
function buildCharts(city) {
     console.log(city);
     // Use d3.csv to load and retrive the file
     d3.csv(path).then((data) => {
        // Create a variable that holds the titles array
        let CitiesArray =  data.map(a => a.ER_Name_Nom_RE);
        console.log(CitiesArray);
        
        data.forEach(function(d){
            d.Median_Wage_Salaire_Median = +d.Median_Wage_Salaire_Median;
            d.Low_Wage_Salaire_Minium = +d.Low_Wage_Salaire_Minium;
            d.High_Wage_Salaire_Maximal = +d.High_Wage_Salaire_Maximal;
        });

        // Create a variable that filters the Cities for the objet with the desired Title
        let sampleCity = data.filter(Obj => Obj.ER_Name_Nom_RE == city);
        console.log(sampleCity);

        // Create a variable that holds the first Title in the array.
        let fCity = sampleCity[0];
        console.log(fCity);
        
        // Sort data by median salary
        sampleCity.sort((a,b) => a.Median_Wage_Salaire_Median - b.Median_Wage_Salaire_Median)

        // Create variables that hold the variables
        let Title = sampleCity.map(a => a.NOC_Title);
        let Salary = sampleCity.map(a => a.Median_Wage_Salaire_Median);
        let City = sampleCity.map(a => a.ER_Name_Nom_RE);
        console.log(Title);
        console.log(Salary)
        console.log(City);

        // Create variables with top 50 and reversed order
        let TitleTop50 = Title.slice(0,50).reverse();
        let SalaryTop50 = Salary.slice(0,50).reverse();
        //let CityTop10 = City.slice(0,100).reverses();

        // Create the ytickds for the bar chart
        let yticks = TitleTop50.map(x => `Title: ${x}`);
        
        // Create the trace for the bar chart
        var barData = [{
            x: SalaryTop50,
            y: yticks,
            text: TitleTop50,
            type: "bar",
            barThickness: 150,
            orientation: "h",
        }];

        // Creat the layout for the bar chart
        var barLayout = {
            title: "Top 50 Median Salary by Title",
        };

        // Use Plotly to plot the data with the layout
        Plotly.newPlot("bar", barData, barLayout);
     });
    }





    // d3.csv(path).then((data) => console.log(data));

// var data3 = d3.csvParse(path);
// console.log(data3);

// d3.csv(path).then(function(d){
//     console.log(d[0]);
// });

// d3.csv(path).then(function(d){
//     let title=d.map(a => a.NOC_Title);
//     let geog=d.map(a => a.ER_Name_Nom_RE);
//     let salary=d.map(a => a.Median_Wage_Salaire_Median);
//     console.log({title,geog,salary});
// });

// d3.csv(path).then(function(data){
//     data.forEach(function(d){
//         d.Median_Wage_Salaire_Median = +d.Median_Wage_Salaire_Median;
//         d.Low_Wage_Salaire_Minium = +d.Low_Wage_Salaire_Minium;
//         d.High_Wage_Salaire_Maximal = +d.High_Wage_Salaire_Maximal;
//     });
//     console.log(data[0]);
// });
