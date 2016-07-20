var width = 900,
height = 800,
rad = 40;

var tri_veb_x = width/2
var tri_veb_y = 4/5*height
var tri_top_x = 3/8*width
var tri_top_y = 2/5*height
var hyp = Math.sqrt((tri_top_x - tri_veb_x)*(tri_top_x - tri_veb_x) + (tri_top_y - tri_veb_y)*(tri_top_y - tri_veb_y))
var angle_sin = (tri_veb_x - tri_top_x)/hyp
var theta = Math.asin(angle_sin)

d3.select("body").append("input")
    .attr("type", "range")
    .attr("min", rad)
    .attr("max", 170)
    .attr("value", rad)
    .on("change", function() { rad = this.value;});

//Triangle points
var triangle_points = [{"x": tri_veb_x, "y": tri_veb_y}, {"x": tri_top_x, "y": tri_top_y}, {"x": 5/8*width, "y": 2/5*height}, {"x": tri_veb_x, "y": tri_veb_y}];

//Accessor function
var lineFunction = d3.svg.line()
                    .x(function(d) { return d.x; })
                    .y(function(d) { return d.y; })
                    .interpolate("linear");

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// Append triangle and fill triangle with blue
 svg.append("path")
      .attr("d", lineFunction(triangle_points))
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("fill", "blue");
    
svg.append("circle")
    .attr("cx", width/2)
    .attr("cy", height/2)
    .attr("r", rad)
    .call(transition, rad, height/2);

function transition(element, radius, cy) {
    element.transition()
        // .duration(duration)
        .attr("r", rad)
        .attr("cy", function(){
            if(rad <= tri_veb_x - tri_top_x){
                return tri_veb_y - rad/angle_sin;
            }
            else{
                var y1 = hyp*Math.cos(theta) + Math.sqrt(hyp*hyp*Math.cos(theta)*Math.cos(theta) - hyp*hyp + rad*rad);
                // var y2 = hyp*Math.cos(theta) - Math.sqrt(hyp*hyp*Math.cos(theta)*Math.cos(theta) - hyp*hyp + rad*rad);
                return tri_veb_y - y1;

            }
        })
        .each("end", function() { d3.select(this).call(transition, rad, cy);});
}