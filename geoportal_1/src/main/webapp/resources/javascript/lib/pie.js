
if (typeof OpenGeoportal === 'undefined') {
	OpenGeoportal = {};
} else if (typeof OpenGeoportal !== "object") {
	throw new Error("OpenGeoportal already exists and is not an object");
}

OpenGeoportal.FacetChart = function() {


	this.createChart = function(facetField, facetData){
		var elId = "chart";
		jQuery("body").append('<div id="' + elId + '"></div>');
		var that = this;
		
		var n = facetData.layers, // number of layers
	    layers = facetData.content,
	    xStackMax = 1;
		
		var stack = d3.layout.stack().offset("expand").values(function(d) { return d.values; })(layers);
		
	var margin = {top: 10, right: 10, bottom: 20, left: 10},
	    width = 960 - margin.left - margin.right,
	    height = 100 - margin.top - margin.bottom;

	var y = d3.scale.ordinal()
	    .domain([0, 1])
	    .range([0, 1]);

	var x = d3.scale.linear()
	    .domain([0, xStackMax])
	    .range([0, 1]);

	var color = d3.scale.linear()
	    .domain([0, n - 1])
	    .range(["#aad", "#556"]);

	var svg = d3.select("#chart").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var layer = svg.selectAll(".layer")
	    .data(stack)
	    .enter()
	    .append("rect")
	    .attr("class", "layer")
	    .style("fill", function(d, i) { return color(i); })
	    .attr("y", function(d) {return y(d.values[0].x);})
	    .attr("x", function(d) { console.log(d); return x(d.values[0].y0) * width; })
	    .attr("width",  function(d) { return x(d.values[0].y) * width;})
	    .attr("height", 75)
	    .on("click", function(d) {
             console.log(d);
             //select the rectangle, apply a filter
             //toggle
             var this$ = jQuery(this);
             if (!this$.data().selected){
            	 this$.attr("transform", "translate(0," + margin.top * -1 + ")").data({selected: true});
            	 that.applyFacet(facetField, d.name);
             } else {
            	 this$.removeAttr("transform").data({selected: false});
            	 that.removeFacet();
             }
	    });
	
	svg.selectAll("text")
	   .data(stack)
	   .enter()
	   .append("text")
	   .text(function(d) {
	        return d.name + ": " + d.values[0].y_original;
	   })
	   .attr("x", function(d, i) {
	        return x(d.values[0].y0) * width;
	   })
	   .attr("y", function(d) {
	        return height;
	   });
	   
	
	/*svg.selectAll("path")
		.data(stack)
		.enter().append("path")
		.attr("d", function(d) { return area(d.values); })
		.append("title")
		.text(function(d) { return d.name; });
		*/
	
	/*var rect = layer.selectAll("rect")
	    .data(stack)
	  .enter().append("rect");*/
	  
	    //.attr("y", function(d) { return y(d.y); })
	    //.attr("x", function(d) { return x(d.x0) * width; })
	    //.attr("width",  function(d) { return x(d.x) * width;})
	   // .attr("height", 75);


	/*rect.transition()
	    .delay(function(d, i) { return i * 10; })
	    .attr("x", function(d) { return x(d.y0 + d.y); })
	    .attr("width", function(d) { return x(d.y0) - x(d.y0 + d.y); });
	*/
	

	};

	this.processFacets = function(arrData){
		var data = {};
		var content = [];
		var total = 0;
		for (var j = 0; j < arrData.length; j+=2){
			total += arrData[j + 1];
		}
		//var xPrev = 0;
		for (var i = 0; i < arrData.length; i+=2){
			var obj = {};
			obj.name = arrData[i];
			var valObj = {};
			valObj.y = arrData[i + 1] /total;
			valObj.y_original = arrData[i + 1];
			valObj.x = 0;
			//valObj.x0 = xPrev;
			//xPrev = valObj.x;
			obj.values = [valObj];
			content.push(obj);
		}
		data.content = content;
		data.layers = arrData.length/2;
		
		return data;

	};
	
	this.runFacetQuery = function(facetField){
		var history = OpenGeoportal.ogp.appState.get("queryTerms").get("history");
		this.lastSearch = history[history.length - 1];
		var url = this.lastSearch.getFacetQuery(facetField);
		var that = this;
		var params = {
				url: url,
				dataType : 'jsonp',
				jsonp : 'json.wrf',
				success: function(data){
					var obj = data.facet_counts.facet_fields[facetField];
					console.log(obj);
					var content = that.processFacets(obj);
					//  ["polygon", 5608, "line", 2028, "point", 1632, "map", 1465, "paper", 1465, "raster", 924, "undefin", 1]
					console.log(content);
					
					that.createChart(facetField, content);
				}	
		};
		var promise = jQuery.ajax(params);
		return promise;
	};
	
	this.applyFacet = function(facetField, facetValue){
		var qt = OpenGeoportal.ogp.appState.get("queryTerms");

		qt.set({facets: true, facetField: facetField, facetValue: [facetValue]});
		
		OpenGeoportal.ogp.results.newSearch();
	};
	
	this.removeFacet = function(){
		var qt = OpenGeoportal.ogp.appState.get("queryTerms");
		qt.set({facets: false});
		
		OpenGeoportal.ogp.results.newSearch();
	};

};