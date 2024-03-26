
let country_list = [];
let chart;

function init() {
    // Get the dropdown menu element
    let selector = d3.select("#selDataset");
    
    // Function to populate the dropdown menu
    d3.csv("UnionHappinessFile_clean.csv").then((data) => {
    for (i = 0; i < data.length; i++) {
        country_list.push(data[i].country);
        // year_list.push(data[i].Year);
        // ladder_score_list.push(data[i].ladder_score);
     }
    
    let country_list_sort = country_list.sort();
    const uniqueArray = country_list_sort.filter((value, index) => country_list_sort.indexOf(value) === index);
    samples = uniqueArray;
    samples.forEach((id) => {
        selector.append("option").text(id).property("value", id);
    });
    
      // Use the first sample from the list to build the initial plots
    let defaultSample = samples[0];
    hbarChart(defaultSample, 1);
    //   tableMetadata(defaultSample);
    //   gaugePlot(defaultSample);

    });
};

function renderChart(ladder_score_list2, year_list2) {
  //console.log("Selected Country: " + country_selected + ", Sorted Ladder Score: " + ladder_score_list2);  
  var options = {
    series: [{ data: ladder_score_list2 }],
    chart: {
      width: 800, 
      height: 600,
      type: 'line',
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      },
      toolbar: {
        show: false
      }
    },
    colors: ['#008631'],
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: 'smooth'
    },
    title: {
      text: 'Yearly Happiness Levels',
      align: 'center',
      style: {
          fontSize:  '25px',
          fontWeight:  'bold',
          fontFamily:  undefined,
      }
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#cefad0', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      },
    },
    markers: {
      size: 1
    },
    xaxis: {
      categories: year_list2,
      title: {
        text: 'Year',
        style: {
          fontSize:  '16px',
          fontWeight:  'bold',
          fontFamily:  undefined,
        },
      }
    },
    yaxis: {
      title: {
        text: 'Happiness Index',
        style: {
          fontSize:  '16px',
          fontWeight:  'bold',
          fontFamily:  undefined,
        },
      },
      labels: {
          formatter: function(val) {
              return val.toFixed(2);
          }
      },
      min: 0,
      max: 10
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      floating: true,
      offsetY: -25,
      offsetX: -5
    }
    };
    console.log("Chart data: " + options.series[0].data);
    let chart = new ApexCharts(document.querySelector("#line"), options);
    chart.render();
    return chart;
}

function refreshChart(chart, ladder_score_list2, year_list2) {
   chart.updateSeries([{ data:ladder_score_list2 }]);
   chart.updateOptions({
    xaxis: {
      categories: year_list2
    }
   });  
}

function hbarChart(selectedId, first) {
    d3.csv("UnionHappinessFile_clean.csv").then(function(data) {
        let country_selected = selectedId;
        let country_frame = [];
        let year_list = [];
        let ladder_score_list = [];
        let social_suport_list =[];
        let gdp_list = [];
        let generosity_list = [];
        let corruption_list = [];

        for (i = 0; i < data.length; i++) {
            if (data[i].country === country_selected) {
                country_frame.push(data[i].country);
                year_list.push(data[i].Year);
                ladder_score_list.push(Number(data[i].ladder_score));
                social_suport_list.push(Number(data[i].social_support));
                generosity_list.push(Number(data[i].generosity));
                gdp_list.push(Number(data[i].gdp_per_capita));
                corruption_list.push(Number(data[i].corruption));       
            };
        }

        meta_table(corruption_list, ladder_score_list, social_suport_list, gdp_list);

        //console.log(country_frame);
        //console.log(ladder_score_list);
        //console.log(year_list);
        // Sorting the list and getting the indices
        var sortedIndices = year_list.map(function(value, index) {
            return { value: value, index: index };
        }).sort(function(a, b) {
            return a.value - b.value;
        }).map(function(item) {
            return item.index;
        });
        // Using the sorted indices to reorder another list

        //console.log(sortedIndices);
        let ladder_score_list2 = sortedIndices.map(function(index) {
            return ladder_score_list[index];
        });
        let year_list2 = sortedIndices.map(function(index) {
            return year_list[index];
        });

        // let xArray = year_list2;
        // let yArray = ladder_score_list2;

        // // Define Data
        // let data2 = [{
        // x: xArray,
        // y: yArray,
        // mode: "lines",
        // type: "scatter"
        // }];

        // // Define Layout
        // let layout = {
        // xaxis: {title: "Year"},
        // yaxis: {range: [3, 8], title: "Happiness index"},
        // width: 800,
        // height: 600,
        // title: "Happiness index vs Year",
        // margin: { // Adjust margins to provide space for labels
        //     l: 80, // Left margin
        //     r: 80, // Right margin
        //     b: 80, // Bottom margin
        //     t: 80, // Top margin
        //     pad: 4 // Padding between axis and plot area
        // }
        // };

        // // Display using Plotly
        // Plotly.newPlot("line", data2, layout);
        if (first == 1) {
          chart = renderChart(ladder_score_list2, year_list2);
        } else {
          refreshChart(chart, ladder_score_list2, year_list2);
        }

        // Correlation chart for Social support
        let xArray2social = ladder_score_list;
        let yArray2social = social_suport_list;

        // Calculate Sums
        let xSum2=0, ySum2=0 , xxSum2=0, xySum2=0;
        let count_social = xArray2social.length;
        let yArray2social_count = yArray2social.length;

        for (let i = 0, len = count_social; i < count_social; i++) {
        xSum2 += xArray2social[i];
        ySum2 += yArray2social[i];
        xxSum2 += xArray2social[i] * xArray2social[i];
        xySum2 += xArray2social[i] * yArray2social[i];
        }

        // Calculate slope and intercept
        let slope_social = (count_social * xySum2 - xSum2 * ySum2) / (count_social * xxSum2 - xSum2 * xSum2);
        let intercept_social = (ySum2 - slope_social * xSum2) / count_social;
        // Generate values
        let xValues_social = [];
        let yValues_social = [];
        //xArray3social = xArray2social.sort((a,b) => a - b);
        //len = xArray3social.length-1;

        for (let x of xArray2social) {
            xValues_social.push(x);
            yValues_social.push(x * slope_social + intercept_social);
        }
        let data3social = [{
            x: ladder_score_list,
            y: social_suport_list,
            mode: "markers",
            type: "scatter",
            name: "Data Points"
            }, {
                x: xValues_social,
                y: yValues_social,
                mode: "lines",
                type: "scatter",
                name: "Regression Line"
            }];

        // Define Layout
        let layout2social = {
        xaxis: { title: "Happiness index "},
        yaxis: { title: "Social support"},
        showlegend: false,
        width: 400,
        height: 400
        };
    
        // Display using Plotly
        Plotly.newPlot("social_support", data3social, layout2social);
        

        // Correlation chart gdp per capita
        let xArray2gdp = ladder_score_list;
        let yArray2gdp = gdp_list;

        // Calculate Sums
        let xSum=0, ySum=0 , xxSum=0, xySum=0;
        let count_gdp = xArray2gdp.length;
        let yArray2gdp_count = yArray2gdp.length;

        for (let i = 0, len = count_gdp; i < count_gdp; i++) {
        xSum += xArray2gdp[i];
        ySum += yArray2gdp[i];
        xxSum += xArray2gdp[i] * xArray2gdp[i];
        xySum += xArray2gdp[i] * yArray2gdp[i];
        }

        // Calculate slope and intercept
        let slope_gdp = (count_gdp * xySum - xSum * ySum) / (count_gdp * xxSum - xSum * xSum);
        let intercept_gdp = (ySum - slope_gdp * xSum) / count_gdp;

        // Generate values
        let xValues_gdp = [];
        let yValues_gdp = [];
        //xArray3gdp = xArray2gdp.sort((a,b) => a - b);
        //len = xArray3gdp.length-1
        //console.log(len);

        for (let x of xArray2gdp) {
            xValues_gdp.push(x);
            yValues_gdp.push(x * slope_gdp + intercept_gdp);
        }

        let data3gdp = [{
            x: xArray2gdp,
            y: yArray2gdp,
            mode: "markers",
            type: "scatter",
            name: "Data Points"
            }, {
                x: xValues_gdp,
                y: yValues_gdp,
                mode: "lines",
                type: "scatter",
                name: "Regression Line"
            }];

        // Define Layout
        let layout2gdp = {
        xaxis: { title: "Happiness index "},
        yaxis: { title: "GDP per capita"},
        showlegend: false,
        width: 400,
        height: 400
        };
    
        // Display using Plotly
        Plotly.newPlot("gdp", data3gdp, layout2gdp); 

        // Correlation chart for corruption
        let xArray2 = ladder_score_list;
        let yArray2 = corruption_list;

        // Calculate Sums
        let xSum3=0, ySum3=0 , xxSum3=0, xySum3=0;
        let count = xArray2.length;
        let yArray2_count = yArray2.length;

        for (let i = 0, len = count; i < count; i++) {
          xSum3 += xArray2[i];
          ySum3 += yArray2[i];
          xxSum3 += xArray2[i] * xArray2[i];
          xySum3 += xArray2[i] * yArray2[i];
        }
        
        // Calculate slope and intercept
        let slope = (count * xySum3 - xSum3 * ySum3) / (count * xxSum3 - xSum3 * xSum3);
        let intercept = (ySum3 - slope * xSum3) / count;

        // Generate values
        let xValues = [];
        let yValues = [];
        //xArray3 = xArray2.sort((a,b) => a - b);
        //len = xArray3.length-1

        for (let x of xArray2) {
            xValues.push(x);
            yValues.push(x * slope + intercept);
        }

        let data3 = [{
            x: xArray2,
            y: yArray2,
            mode: "markers",
            type: "scatter",
            name: "Data Points"
            }, {
                x: xValues,
                y: yValues,
                mode: "lines",
                type: "scatter",
                name: "Regression Line"
            }];

        // Define Layout
        let layout2 = {
        xaxis: { title: "Happiness index "},
        yaxis: { title: "Corruption"},
        width: 500,
        height: 400
        };
    
        // Display using Plotly
        Plotly.newPlot("corruption", data3, layout2); 

})
}

function find_average(x) {
    let average = 0;
    let average_tmp = 0;
    let count = x.length;
    let xSum = 0;
    for(let i = 0; i < count; i++){
        xSum = xSum + x[i];
    } 
    average_tmp = xSum / count;
    average = average_tmp.toFixed(2);
    return average;
}

function meta_table(corruption, happiness, social_support, gdp_per_capita){

    // d3.json(url).then(function(data) {
    //   console.log(data);
    //   let sample_metadata = data.metadata;
    //   let newArray = sample_metadata.filter(number => number.id == x)[0];
  
      let selector = d3.select("#sample-metadata");
      selector.html("");

      let average_values = [];
      let average_happiness = find_average(happiness);
      //console.log(average_happiness);
      let average_corruption = find_average(corruption);
      //console.log(average_corruption);
      let average_social_support = find_average(social_support);
      //console.log(average_social_support);
      let average_gdp = find_average(gdp_per_capita);
      //console.log(average_gdp);
      average_values.push("Avg Ladder Score: " + average_happiness);
      average_values.push("Avg Corruption: " + average_corruption);
      average_values.push("Avg Social Support: " + average_social_support);
      average_values.push("Avg GDP: " + average_gdp);
      //console.log(average_values);

      average_values.forEach((avg) => {
        selector
            .append("p")
            .text(avg)
      });
  }


function optionChanged(value) {
    hbarChart(value, 2);
}

init();

