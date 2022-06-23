function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/data/samples.json").then((data) => {
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
  d3.json("static/data/samples.json").then((data) => {
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
  d3.json("static/data/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    var metadata = data.metadata;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sample_data = samples.filter(x => x.id == sample);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata_data = metadata.filter(a => a.id == sample);

      //  5. Create a variable that holds the first sample in the array.
    var sample1 = sample_data[0];

    metadata_data = metadata_data[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_id = sample1.otu_ids;
    var otu_labels = sample1.otu_labels;
    var sample_values = sample1.sample_values;

    // 3. Create a variable that holds the washing frequency.
    
    var wfreq = metadata_data.wfreq;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_id.slice(0,10).map(otuID => `OTU ${otuID}`);

  //   // 8. Create the trace for the bar chart. 
    
    var trace1 = {
      x: sample_values.slice(0, 10).reverse(),
      y: yticks.slice(0, 10).reverse(),
      hovertext: otu_labels.slice(0,10).reverse(),
      name: 'Top 10 Bacteria',
      orientation: "h",
      type: 'bar'
    };

    var barData = [trace1];

    // 9. Create the layout for the bar chart. 
    var barLayout = { title: "Top 10 Bacteria Cultures Found" };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);
 

    // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: otu_id,
      y: sample_values,
      mode: 'markers', 
      marker: {
        color: otu_id,
        size: sample_values,
        colorscale: 'Reds',
        hovertext: otu_labels     
      }
    };
  
    var bubbledata = [bubbleData];  

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {title: "Bacteria Cultures Per Sample",
    xaxis: {title: "Bacteria ID"},
    yaxis: {title: "Count of Bacteria"},
    showlegend: false,
    height: 600,
    width: 1000
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbledata, bubbleLayout);
    

    var gaugeData = {
      domain: { x: [0, 1], y: [0, 1] },
      value: wfreq,
      title: { text: "Belly Button Washing Frequency" },
      type: "indicator",
      mode: "gauge+number"
    }
   
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600, height: 500, margin: { t: 0, b: 0 } 
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
};

