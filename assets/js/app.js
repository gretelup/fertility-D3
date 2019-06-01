// Step 1: Set up chart

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select(".chart")
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
    var yLinearScale = yScale(fertData, chosenXAxis);

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
        .attr("transform", `translate(0, ${width})`)
        .call(leftAxis);

    // GRETEL - FUTZ AROUND WITH ATTRIBUTES; ALSO APPEND STATE NAMES
    // Append initial bubbles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(hairData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 20)
        .attr("fill", "purple")
        .attr("opacity", ".5");
    // GRETEL - FUTZ AROUND W/ NUMBERS
    // Create group for  3 x-axis labels
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
    
    var unmarryLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "UNMARRY") // value to grab for event listener
        .classed("active", true) // NOT SURE WHAT THIS IS
        .text("% Women in Poverty");

    var teenLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "TEEN") // value to grab for event listener
        .classed("inactive", true) // NOT SURE WHAT THIS IS
        .text("% Women ages 15-19");
    
    var hsLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "HS") // value to grab for event listener
        .classed("inactive", true) // NOT SURE WHAT THIS IS
        .text("% Women without High School Degree");
    
    // GRETEL CHECK THE TRANSLATE MATH
    // Create group for  3 y-axis labels
    var ylabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width - 20}, ${height / 20})`);

    var povLabel = ylabelsGroup.append("text")
        .attr("x", -20)
        .attr("y", 0)
        .attr("value", "POV") // value to grab for event listener
        .classed("active", true) // NOT SURE WHAT THIS IS
        .text("% Women in Poverty");
    
    var employLabel = ylabelsGroup.append("text")
        .attr("x", -40)
        .attr("y", 0)
        .attr("value", "EMPLOY") // value to grab for event listener
        .classed("inactive", true) // NOT SURE WHAT THIS IS
        .text("% Women Unemployed");

    var assistLabel = ylabelsGroup.append("text")
        .attr("x", -60)
        .attr("y", 0)
        .attr("value", "ASSIST") // value to grab for event listener
        .classed("inactive", true) // NOT SURE WHAT THIS IS
        .text("% Women Receiving Public Assistance");

    // Attach x axis labels event listener
    xlabelsGroup.selectAll("text")
        .on("click", xSelect);
    
    // Attach y axis labels event listene
    ylabelsGroup.selectAll("text")
        .on("click", ySelect);
});

// Step 11: Add tooltips (separate function) --> see tooltip function


// function used for updating x-scale var upon click on axis label
function xScale(fertData, chosenXAxis) {
    // create scales
    // GRETEL - UPDATE THE NUMBERS AS IS APPROPRIATE
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(hairData, d => d[chosenXAxis]) * 0.8,
        d3.max(hairData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
    return xLinearScale;
  }

// function used for updating Y-scale var upon click on axis label
function YScale(fertData, chosenYAxis) {
    // create scales
    // GRETEL - UPDATE THE NUMBERS AS IS APPROPRIATE
    var YLinearScale = d3.scaleLinear()
      .domain([d3.min(hairData, d => d[chosenYAxis]) * 0.8,
        d3.max(hairData, d => d[chosenYAxis]) * 1.2
      ])
      .range([height, 0]);
    return xLinearScale;
  }

// Event listener function for change in selected X axis
function xSelect() {
    // Get value of selection
    var value = d3.select(this).attr("value");

    // If new value is selected, replace appropriate parameters
    if (value !== chosenXAxis) {
        chosenXAxis = value;
        xLinearScale = xScale(fertData, chosenXAxis);
        xAxis = renderXAxes(xLinearScale, xAxis);
        circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);
        
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
}

// Event listener function for change in selected Y axis
function ySelect() {
    // Get value of selection
    var value = d3.select(this).attr("value");

    // If new value is selected, replace appropriate parameters
    if (value !== chosenYAxis) {
        chosenYAxis = value;
        yLinearScale = xScale(fertData, chosenYAxis);
        yAxis = renderAxes(yLinearScale, yAxis);
        circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);
        
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


// Step 11: Tooltip function
// ToolTip function --> part of this needs to be in master code
// Need to change hair code to take yaxis into account too, but I don't think we need 
// separate funtions for x and y circles

// Step 1: Initialize Tooltip
// var toolTip = d3.tip()
// .attr("class", "tooltip")
// .offset([80, -60])
// .html(function(d) {
//   return (`<strong>${d.date}<strong><hr>${d.morning} level craving`);
// });

// Step 2: Create the tooltip in chartGroup.
// chartGroup.call(toolTip);

// Step 3: Create "mouseover" event listener to display tooltip
// circlesGroup.on("mouseover", function(d) {
//   toolTip.show(d, this);
// })
// Step 4: Create "mouseout" event listener to hide tooltip
//   .on("mouseout", function(d) {
//     toolTip.hide(d);
//   });