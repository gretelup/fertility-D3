// Step 1: Set up chart

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.

// Step 2 a: Set initial parameters (chosen x and y axes)
// var chosenXAxis = "hair_length";
// var chosenYAxis = "whatever"

// Step 3: Import data from csv

// Step 4: Parse Data

// Step 5: Create Scales --> separate xLinearScale and yLinearScale functions

// Step 6: Create initial Axes functions

// Step 7: Append axes to chart group

// Step 8: Append initial circles 

// Step 9: Create group for multiple x axis labels; ditto y axis

// Step 10: Create x axis labels event listener; ditto y; --> w/in is separate renderCircles function
// Consider making these separate functions ???
// Step 11: Add tooltips (separate function) --> see tooltip function

// SEPARATE FUNCTIONS TO WRITE:

// Step 5: 2 scale functions

// Step 10: 2 event listener functions

// Step 10: render circles function

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


