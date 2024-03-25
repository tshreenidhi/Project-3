
let country_list = [];

function init() {
    // Get the dropdown menu element
    let selector = d3.select("#selDataset");
    
    // Function to populate the dropdown menu
    d3.csv("UnionHappinessFile.csv").then((data) => {
    console.log(data);
    for ( i =0; i<data.length; i++) {
        country_list.push(data[i].country);
        // year_list.push(data[i].Year);
        // ladder_score_list.push(data[i].ladder_score);
     }
        samples = country_list;
        samples.forEach((id) => {
            selector.append("option").text(id).property("value", id);
        });
    
      // Use the first sample from the list to build the initial plots
      let defaultSample = samples[0];
      hbarChart(defaultSample);
    //   tableMetadata(defaultSample);
    //   gaugePlot(defaultSample);

    });  
};

function hbarChart(selectedId) {
    d3.csv("../data/UnionHappinessFile.csv").then(function (data){
        let country_selected = selectedId;
        console.log(country_selected);
        let country_frame = [];
        let year_list = [];
        let ladder_score_list = [];
        let social_suport_list =[];
        let gdp_list = [];
        let generosity_list = [];
        let corruption_list = [];

        for ( i =0; i<data.length; i++) {
            if (data[i].country == country_selected) {
                country_frame.push(data[i].country);
                year_list.push(data[i].Year);
                ladder_score_list.push(Number(data[i].ladder_score));
                social_suport_list.push(Number(data[i].social_support));
                generosity_list.push(Number(data[i].generosity));
                gdp_list.push(Number(data[i].gdp_per_capita));
                corruption_list.push(Number(data[i].corruption));          
            };
        }
        console.log(country_frame);
        console.log(ladder_score_list);
        console.log(year_list);
        // Sorting the list and getting the indices
        var sortedIndices = year_list.map(function(value, index) {
            return { value: value, index: index };
        }).sort(function(a, b) {
            return a.value - b.value;
        }).map(function(item) {
            return item.index;
        });
        // Using the sorted indices to reorder another list

        console.log(sortedIndices);
        let ladder_score_list2 = sortedIndices.map(function(index) {
            return ladder_score_list[index];
        });

        let year_list2 = sortedIndices.map(function(index) {
            return year_list[index];
        });

        let xArray = year_list2;
        let yArray = ladder_score_list2;

        // Define Data
        let data2 = [{
        x: xArray,
        y: yArray,
        mode: "lines",
        type: "scatter"
        }];

        // Define Layout
        let layout = {
        xaxis: {title: "Year"},
        yaxis: {range: [3, 8], title: "Happyness index"},
        width: 800,
        height: 600,
        title: "Happyness index vs Year",
        margin: { // Adjust margins to provide space for labels
            l: 80, // Left margin
            r: 80, // Right margin
            b: 80, // Bottom margin
            t: 80, // Top margin
            pad: 4 // Padding between axis and plot area
        }
        };

        // Display using Plotly
        Plotly.newPlot("line", data2, layout);



        // Correlation chart for Social support
        let xArray2social = ladder_score_list;
        let yArray2social = social_suport_list;

        // Calculate Sums
        let xSum2=0, ySum2=0 , xxSum2=0, xySum2=0;
        let count_social = xArray2social.length;
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
        xArray3social = xArray2social.sort((a,b) => a - b);
        len = xArray3social.length-1;

        for (let x of xArray3social) {
            xValues_social.push(x);
            yValues_social.push(x * slope_social + intercept_social);
        }
        let data3social = [{
            x: xArray2social,
            y: yArray2social,
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
        xaxis: { title: "Happyness index "},
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
        xArray3gdp = xArray2gdp.sort((a,b) => a - b);
        len = xArray3gdp.length-1
        console.log(len);

        for (let x of xArray3gdp) {
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
        xaxis: { title: "Happyness index "},
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
        xArray3 = xArray2.sort((a,b) => a - b);
        len = xArray3.length-1

        for (let x of xArray3) {
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
        xaxis: { title: "Happyness index "},
        yaxis: { title: "Corruption"},
        width: 500,
        height: 400
        };
    
        // Display using Plotly
        Plotly.newPlot("corruption", data3, layout2); 

})
}

function optionChanged(value) {
    hbarChart(value);

}

init();

