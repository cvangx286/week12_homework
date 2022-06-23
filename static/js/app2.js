// Bar and Bubble charts
// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    

    // Deliverable 1 Step 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: otu_id.slice(0, 10).reverse(),
      y: sample_values.slice(0, 10).reverse(),
      hovertext: otu_labels.slice(0,10).reverse(),
      mode: 'markers',
      marker: {
         color: ['red'],
         markersize: otu_id
      }
    };
   
    var data = [bubbleData];  

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {title: 'Top 10 Bacteria',
    showlegend: false,
    height: 600,
    width: 600
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('myDiv', data, bubbleLayout); 
  });
}
