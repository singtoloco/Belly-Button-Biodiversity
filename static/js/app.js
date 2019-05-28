function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`;

  d3.json(url).then(function(data) {    
    
    // Use d3 to select the panel with id of `#sample-metadata`
    var metadataPanel = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    metadataPanel.html("");

    // Use `Object.entries` to add each key and value pair to the panel    
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    console.log(Object.entries(data)); //Checking out data
        
    Object.entries(data).forEach(([key, value]) => {

      if (key != 'WFREQ') {
        metadataPanel.append("h6").text(`${key}: ${value}`);
      }
           
    });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    // Enter a speed between 0 and 180
    var level = data.WFREQ * 180/9;
    // console.log(`WREQ: ${data.WFREQ}`);
    // console.log(`level(180): ${level}`);

    // Trig to calc meter point
    var degrees = 180 - level,
        radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
        pathX = String(x),
        space = ' ',
        pathY = String(y),
        pathEnd = ' Z';
    var path = mainPath.concat(pathX,space,pathY,pathEnd);

    var data = [{ type: 'scatter',
      x: [0], y:[0],
        marker: {size: 28, color:'850000'},
        showlegend: false,
        name: 'WFREQ',
        text: data.WFREQ,
        hoverinfo: 'text+name'},
      { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      textinfo: 'text',
      textposition:'inside',
      marker: {colors:['#006400','#11740c','#27841f','#3a9431','#4fa446','#66b45d','#7ec276','#9ad093','#d3d3d3','rgba(255, 255, 255, 0)']},
      labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];

    var layout = {
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }],
      title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
      height: 500,
      width: 500,
      xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
    };

    Plotly.newPlot('gauge', data, layout);
  })
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `samples/${sample}`;

  d3.json(url).then(function(response) { 
    
    console.log(response); //Checking out response    

    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: response.otu_ids,
      y: response.sample_values,
      text: response.otu_labels,
      mode: 'markers',
      marker: {
        color: response.otu_ids,
        size: response.sample_values,
        //colorscale ref: https://plot.ly/javascript/colorscales/
        colorscale: [
          ['0.0', 'rgb(165,0,38)'],
          ['0.111111111111', 'rgb(215,48,39)'],
          ['0.222222222222', 'rgb(244,109,67)'],
          ['0.333333333333', 'rgb(253,174,97)'],
          ['0.444444444444', 'rgb(254,224,144)'],
          ['0.555555555556', 'rgb(224,243,248)'],
          ['0.666666666667', 'rgb(171,217,233)'],
          ['0.777777777778', 'rgb(116,173,209)'],
          ['0.888888888889', 'rgb(69,117,180)'],
          ['1.0', 'rgb(49,54,149)']
        ]
      }
    };
    
    var data = [trace1];
    
    var layout = {
      // title: 'Bubble Chart Hover Text',
      showlegend: false,
      // height: 600,
      // width: 600
      xaxis: {title: 'OTU ID'}
    };
    
    Plotly.newPlot('bubble', data, layout);


    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    //an array of sampleValuesSorted objects, where each object contains two properties:
    //index and sample_values
    var sampleValuesSorted = [];
    response.sample_values.forEach((d,i) => {
      sampleValuesSorted.push({ 'index': i, 'value': d})
    })
    // console.log(sampleValuesSorted);

    //Sort *Desc* by **sample_values**
    sampleValuesSorted.sort((first, second) => second.value - first.value);

    // console.log(sampleValuesSorted);

    //Get only sorted index
    var SortedIndex = sampleValuesSorted.map(obj => obj.index);

    // console.log(SortedIndex);

    //Get only sorted sample values
    var sample_valuesSorted = sampleValuesSorted.map(obj => obj.value);

    // console.log(sample_valuesSorted);

    //Create empty arrays for containing sorted ids and lables (Desc by sample_values)
    var otu_idsSorted = [];
    var otu_labelsSorted = [];

    SortedIndex.forEach(i => {
      otu_idsSorted.push(response.otu_ids[i]);
      otu_labelsSorted.push(response.otu_labels[i]);
    })

    // console.log(otu_idsSorted);
    // console.log(otu_labelsSorted);

    //Start plotting pie chart *Only top 10!

    var data = [{
      values: sample_valuesSorted.slice(0, 10),
      labels: otu_idsSorted.slice(0, 10),
      hovertext: otu_labelsSorted.slice(0, 10),
      type: 'pie'
    }];
    
    var layout = {
      height: 500,
      width: 500
    };
    
    Plotly.newPlot('pie', data, layout);

  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
