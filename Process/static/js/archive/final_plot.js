const xlabels =[];
const ylabels =[];
const cities = [];
//const city_filter = [...new Set(cities)];
//console.log(city_filter);
chart()
async function chart() {
  await getData();
const ctx = document.getElementById('myChart').getContext('2d');
//const xlabels =[];
//const ylabels =[];
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: xlabels,
        datasets: [{
            label: 'Sold Price ($)',
            data: ylabels,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
}

async function filterData(){
  await getData();
const city_filter = [...new Set(cities)];
console.log(city_filter);
}

function favTutorial() {  
  var mylist = document.getElementById("myList");  
  document.getElementById("favourite").value = mylist.options[mylist.selectedIndex].text;  
  }  

getData()
async function getData() {
  const response = await fetch("static/resources/clean_historical.csv");
  const data = await response.text();
  //console.log(data);
  const table = data.split('\r\n');
  //console.log(rows);
  table.forEach(row =>{
    let columns = row.split(',');
    let city = columns[2];
    cities.push(city);
    let year = columns[3];
    xlabels.push(year);
    let month = columns[4];
    let sold = columns [7];
    ylabels.push(parseFloat(sold));
    //console.log(city,year,month,sold);
    //console.log(cities);
  });
}

filterData();

