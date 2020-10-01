function filterbyEU(item){
    if (item.eu == true) {
      return true
    }
  };
  function filterLabel(item) {
    if (item.population >1000000) {
      return true
      };
  };
  
  function sortHeight(a,b) {
    return b.height_ft- a.height_ft;
  };

  //scatterplot
d3.csv('cities.csv', d=>{
    return {
      ...d, // spread operator
      eu: d.eu==='true', // convert to boolean
      population: +d.population,
      x: +d.x,
      y: +d.y,
    }
  }).then(data=>{
      console.log('cities', data);
  })
  
  d3.csv('cities.csv', d3.autoType).then(data=>{
  
    filteredArray = data.filter(filterbyEU);
    filterPopArray = filteredArray.filter(filterLabel);
  
    d3.select('.city-count').text('Number of Cities: ' + filteredArray.length);
    const width = 700;
    const height = 550;
    const svg = d3.select('.population-plot')
            .append('svg')
        .attr('width', width)
        .attr('height', height);
  
    var text = svg.selectAll("text")
        .data(filterPopArray)
        .enter()
        .append("text");
  
    var textLabels = text.attr("x", d => d.x)
        .attr("y", d=> d.y - 10)
        .text(d=> d.country)
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "black")
        .attr("text-anchor", "middle");
  
    var circles = svg.selectAll('circle')
        .data(filteredArray)
        .enter()
        .append("circle")
        .attr('cx', function(d) {return d.x})
        .attr('cy', function(d) {return d.y})
        .attr('r', function(d) {
            if (d.population > 1000000){
                return 8
            }
            else {
                return 4
            }
        })
        .attr('fill', 'skyblue')
        .on("mouseover", function(event, d) {
        let xPosition =  parseFloat(d3.select(this).attr("cx"));
        let yPosition =  parseFloat(d3.select(this).attr("cy"));
  
  
  
        //Update the tooltip position and value
        d3.select("#tooltip")
          .style("left", xPosition+ 200 + "px")
          .style("top", yPosition + 75+ "px")
          .select("#value")
          .text(d.country +' , '+ d.population);
  
  
          //Show the tooltip
          d3.select("#tooltip").classed("hidden", false);
        })
        .on("mouseout", function(d) {
          //Hide the tooltip
          d3.select("#tooltip").classed("hidden", true);
        });
  });
  
  //barchart
  d3.csv('buildings.csv', d=>{
    return {
      ...d, // spread operator
      height_m: +d.height_m,
      height_ft: +d.height_ft,
      height_px: +d.height_px,
      floors: +d.floors,
      completed: +d.completed,
    }
  }).then(data=>{
      console.log('buildings', data);
  })

  d3.csv('buildings.csv', d3.autoType).then(buildings=>{
  
    let sortedArray = buildings.sort(sortHeight);
    console.log(sortedArray);
  
    let w = 500;
    let h = 500;
  
  
    let svg = d3.select('.building-graph')
               .append('svg')
          .attr('width', w)
          .attr('height', h)
          .attr("text-anchor", "end");
  
  
    let bar = svg.selectAll('rect')
        .data(sortedArray)
        .enter();
  
    bar.append("rect")
      .attr("x", function(d,i) {
        return 235;
      })
      .attr("y", function(d,i) {
        return i*30;
      })
      .attr("width", d=> d.height_px)
      .attr("height", 20)
      .attr("fill", "darksalmon")
      .on("click", function (d,i) {
  
        document.querySelector('#building_image').src= i['image'];
        document.querySelector('.building-name').innerHTML=i['building'];
        document.querySelector('.height').innerHTML=i['height_ft'] + ' ft';
        document.querySelector('.city').innerHTML=i['city'];
        document.querySelector('.floors').innerHTML=i['floors'];
        document.querySelector('.country').innerHTML=i['country'];
        document.querySelector('.completed').innerHTML=i['completed'];
  
  
  
      }
    );
  
  
  
    bar.append("text")
        .attr("class", "label")
        .attr("y", function(d,i) {
          return i*30+15;
          })
        .attr("x", d=>d.height_px + 225)
  
        .text(function (d) {
            return d.height_ft +'ft';
        })
        .attr("fill", "white");
  
      bar.append("text")
          .attr("class", "name")
          //y position of the label is halfway down the bar
          .attr("y",function(d,i) {
            return i*30+15;
            })
          .attr("x", 0)
  
          .text(function (d) {
              return d.building;
          })
          .attr("text-anchor", "start");
  
  
  });