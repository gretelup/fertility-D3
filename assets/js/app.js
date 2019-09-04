// Step 1: Set up chart

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Set initial parameters
var chosenXAxis = "UNMARRY";
var chosenYAxis = "POV";

// Import data from csv
d3.csv("/assets/data/fertility.csv").then(function(fertData) {
    
    // Parse data
    fertData.forEach(function(d) {
        d.UNMARRY = +d.UNMARRY;
        d.TEEN = +d.TEEN;
        d.HS = +d.HS;
        d.POV = +d.POV;
        d.EMPLOY = +d.EMPLOY;
        d.ASSIST = +d.ASSIST;
    });
    
    // Create x and y scale functions
    var xLinearScale = xScale(fertData, chosenXAxis);
    var yLinearScale = yScale(fertData, chosenYAxis);

    // Create initial axes functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append axes to chart group
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    // Append initial bubbles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(fertData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 20)
        .attr("fill", "purple")
        .attr("opacity", ".5");
    
    // Append initial labels for bubbles
    var textLabels = chartGroup.append("text")
      .selectAll("tspan")
      .data(fertData)
      .enter()
      .append("tspan")
      .attr("x", d => xLinearScale(d[chosenXAxis])-7)
      .attr("y", d => yLinearScale(d[chosenYAxis])+5)
      .text(d => d.ABBR)
      .attr("fill", "black")
      .attr("font-size", "12px");

    // Create group and labels for 3 x-axis labels
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
    var unmarryLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "UNMARRY")
        .classed("active", true)
        .text("% Women who are Unmarried");
    var teenLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "TEEN") // value to grab for event listener
        .classed("inactive", true) // NOT SURE WHAT THIS IS
        .text("% Women ages 15-19");
    var hsLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "HS")
        .classed("inactive", true) // NOT SURE WHAT THIS IS
        .text("% Women without High School Degree");
    
    // Create group and labels for 3 y-axis labels
    var ylabelsGroup = chartGroup.append("g")
    var povLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "POV") // value to grab for event listener
        .classed("active", true) // NOT SURE WHAT THIS IS
        .text("% Women in Poverty");
    var employLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 20 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "EMPLOY") // value to grab for event listener
        .classed("inactive", true) // NOT SURE WHAT THIS IS
        .text("% Women Unemployed");
    var assistLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 40 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "ASSIST") // value to grab for event listener
        .classed("inactive", true) // NOT SURE WHAT THIS IS
        .text("% Women Receiving Public Assistance");

    // Attach x axis labels event listener
    xlabelsGroup.selectAll("text")
        .on("click", function() {
          var value = d3.select(this).attr("value");
          // If new value is selected, replace appropriate parameters
          if (value !== chosenXAxis) {
            chosenXAxis = value;
            xLinearScale = xScale(fertData, chosenXAxis);
            xAxis = renderXAxes(xLinearScale, xAxis);
            circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);
            textLabels = renderXLabels(textLabels, xLinearScale, chosenXAxis);
            // changes classes to change bold text
            if (chosenXAxis === "UNMARRY") {
              unmarryLabel
                .classed("active", true)
                .classed("inactive", false);
              teenLabel
                .classed("active", false)
                .classed("inactive", true);
              hsLabel
                  .classed("active", false)
                  .classed("inactive", true);
            }
            else if (chosenXAxis == "TEEN") {
              unmarryLabel
                .classed("active", false)
                .classed("inactive", true);
              teenLabel
                .classed("active", true)
                .classed("inactive", false);
              hsLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else {
              unmarryLabel
                .classed("active", false)
                .classed("inactive", true);
              teenLabel
                .classed("active", false)
                .classed("inactive", true);
              hsLabel
                  .classed("active", true)
                  .classed("inactive", false);
            }
          }
    });     
    // Attach y axis labels event listener
    ylabelsGroup.selectAll("text")
      .on("click", function(){
        var value = d3.select(this).attr("value");

    // If new value is selected, replace appropriate parameters
        if (value !== chosenYAxis) {
            chosenYAxis = value;
            yLinearScale = yScale(fertData, chosenYAxis);
            yAxis = renderYAxes(yLinearScale, yAxis);
            circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);
            textLabels = renderYLabels(textLabels, yLinearScale, chosenYAxis);
            
            // changes classes to change bold text
            if (chosenYAxis === "POV") {
                povLabel
                  .classed("active", true)
                  .classed("inactive", false);
                employLabel
                  .classed("active", false)
                  .classed("inactive", true);
                assistLabel
                    .classed("active", false)
                    .classed("inactive", true);
              }
            else if (chosenYAxis === "EMPLOY") {
                povLabel
                  .classed("active", false)
                  .classed("inactive", true);
                employLabel
                  .classed("active", true)
                  .classed("inactive", false);
                assistLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                povLabel
                  .classed("active", false)
                  .classed("inactive", true);
                employLabel
                  .classed("active", false)
                  .classed("inactive", true);
                assistLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }
        }
      });
  // Attach tooltip function
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-8, 0])
    .html(function(d) {
      return (`<strong>${d.STATE}</strong><br>${d.UNMARRY} % Unmarried<br>${d.POV} % in Poverty`);
    });
  chartGroup.call(toolTip);

  // Create "mouseover" event listener to display tooltip
  circlesGroup.on("mouseover", function(d) {
    toolTip.show(d, this);
  })
  // Create "mouseout" event listener to hide tooltip
    .on("mouseout", function(d) {
      toolTip.hide(d);
    });
});

// function used for updating x-scale var upon click on axis label
function xScale(fertData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(fertData, d => d[chosenXAxis]) / 1.5, d3.max(fertData, d => d[chosenXAxis])])
      .range([0, width]);
    return xLinearScale;
  }

// function used for updating Y-scale var upon click on axis label
function yScale(fertData, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(fertData, d => d[chosenYAxis]) / 1.5, d3.max(fertData, d => d[chosenYAxis])])
      .range([height, 0]);
    return yLinearScale;
  }

// Function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
}

// Function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  return yAxis;
}
// Function used for updating circles group when new X axis is selected
function renderXCircles(circlesGroup, newXScale, chosenXaxis) {
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
    return circlesGroup;
  }

// Function used for updating circles group when new Y axis is selected
function renderYCircles(circlesGroup, newYScale, chosenYaxis) {
    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis]));
  return circlesGroup;
}

// Function used for updating bubble labels when new X axis is selected
function renderXLabels(textLabels, xLinearScale, chosenXAxis) {
  textLabels.transition()
    .duration(1000)
    .attr("x", d => xLinearScale(d[chosenXAxis])-7);
  return textLabels;
}

// Function used for updating bubble labels when new Y axis is selected
function renderYLabels(textLabels, yLinearScale, chosenYAxis) {
  textLabels.transition()
    .duration(1000)
    .attr("y", d => yLinearScale(d[chosenYAxis])+5);
  return textLabels;
}
