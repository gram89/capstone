//let cities =[]
async function getData() {
    let cities = []
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
    d3.csv("static/resources/clean_historical.csv", function(d) {
        return {
        city : d.City,
        month : d.Month,
        year : +d.Year,
        sold : +d.Sold_price_avg,
        days : +d.days_on_mar,
        
        //land_area : +d["land area"]
    };
 }).then(function(data){
     //console.log(data);
    for (var i = 0; i < data.length; i++) {
        cities[i] = data[i].city;
        
        
        //console.log(cities);
      };
      
 })
 un_cities = [...new Set(cities)];
 console.log(un_cities);
 }
// let cities_test = getData();
// console.log(cities_test)
//  async function unique_cities(){    
//      let city_text = getData();
//      console.log(Object.getOwnPropertyNames(city_text));
//      //console.log(Array.isArray(city_text));
//      console.log(typeof city_text);
//      //console.log(city_text[0]);
//      let un_cities=[...new Set(city_text)];
//      console.log(un_cities);
//  }

// unique_cities();
getData()
//console.log(cities)