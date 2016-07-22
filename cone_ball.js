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
	.attr("class", "slider-width100")
    .attr("type", "range")
    .attr("min", rad)
    .attr("max", 170)
    .attr("value", rad)
    .attr("style", "width: 300px")
    .on("change", function() { rad = this.value;});

//Triangle points
var triangle_points = [{"x": tri_top_x, "y": tri_top_y}, {"x": tri_veb_x, "y": tri_veb_y},  {"x": 5/8*width, "y": 2/5*height}];

//Cup points
var cup_points = [{"x": 8/9*width, "y": tri_top_y}, {"x": 8/9*width, "y": tri_veb_y}, {"x": 8/9*width + width/10, "y": tri_veb_y},  {"x": 8/9*width + width/10, "y": tri_top_y}];

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

//Append cup border
 svg.append("path")
      .attr("d", lineFunction(cup_points))
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("fill", "none");
    
svg.append("circle")
    .attr("cx", width/2)
    .attr("cy", height/2)
    .attr("r", rad)
    .call(transition)

svg.append("rect")
    .attr("x", 8/9*width)
    .attr("y", tri_veb_y-Math.PI*rad*rad/(width/10))
    .attr("width", width/10)
    .attr("height", Math.PI*rad*rad/(width/10))
    .attr("fill", "blue")
    .datum(0)
    .call(cup_transition);

function transition(element) {
    element.transition()
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
        .each("end", function() { d3.select(this).call(transition);});
}

function cup_transition(element) {
	r = d3.select("circle").attr("r")
	cy_c = d3.select("circle").attr("cy")
	h = d3.select("circle").attr("cy") - tri_top_y
    element.transition()
        .attr("height", function(){
            if(cy_c - r > tri_top_y){
                return Math.PI*r*r/(width/10)
            }
            else if(r <= tri_veb_x - tri_top_x){
                ang = 2*Math.acos(h/r);
                return (Math.PI*r*r - 1/2*r*r*(ang - Math.sin(ang)))/(width/10);
            }
            else{
                ang = Math.asin((5/8*width - 3/8*width)*(1/2)*(1/r))*2
                return Math.abs(1/2*r*r*(ang - Math.sin(ang))/(width/10));

            }
        })
        .attr("y", function(){
            if(cy_c - r > tri_top_y){
                return tri_veb_y - Math.PI*r*r/(width/10)
            }
            else if(r <= tri_veb_x - tri_top_x){
                ang = 2*Math.acos(h/r);
                return tri_veb_y - (Math.PI*r*r - 1/2*r*r*(ang - Math.sin(ang)))/(width/10);
            }
            else{
                ang = Math.asin((5/8*width - 3/8*width)*(1/2)*(1/r))*2
                return Math.abs(tri_veb_y - 1/2*r*r*(ang - Math.sin(ang))/(width/10));

            }
        })
        .each("end", function() { d3.select(this).call(cup_transition);});
}