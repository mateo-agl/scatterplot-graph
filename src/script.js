const h = 560;
const w = 920;
const p = 80;

const svg = d3.select('#container')
  .append('svg')
    .attr('width', w)
    .attr('height', h)
    .attr("viewBox", [0, 0, w, h])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then((obj) => {
  const data = obj;
  
  const x = d3.scaleTime()
    .domain([
      d3.min(data, d => new Date(d.Year - 1, 0, 0)), 
      d3.max(data, d => new Date(d.Year, 0, 0))
    ])
    .range([p, w - 25]);
  
  const y = d3.scaleTime()
    .domain([
      d3.max(data, d => new Date(0, 0, 0, 0, Math.ceil((d.Seconds / 60)))), 
      d3.min(data, d => new Date(0, 0, 0, 0, Math.floor((d.Seconds / 60))))
    ])
    .range([h - 25, 8]);
  
  const xAxis = d3.axisBottom(x);
  
  const yAxis = d3.axisLeft(y)
  .ticks(5, '%M:%S');
  
  svg.append('g')
    .attr('id', 'x-axis')
    .attr('transform', 'translate(0, ' + (h - 25) + ')')
    .call(xAxis);
  
  svg.append('g')
    .attr('id', 'y-axis')
    .attr('transform', 'translate(' + p + ', 0)')
    .call(yAxis);
  
  svg.append('text')
    .style('font-size', '18px')
    .attr('transform', 'rotate(-90)')
    .attr('x', -(h / 2))
    .attr('y', 20)
    .text('Time in %M:%S Format')
  
  const tooltip = d3.select('body')
    .append("div")
    .attr('id', 'tooltip')
  
  svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .style('fill', d => {
      if(d.Doping === "") {
        return '#43aa8b';
      } else {
        return '#f3722c';
      }
    })
    .attr('data-xvalue', d => new Date(d.Year, 0, 0))
    .attr('data-yvalue', d => new Date(d.Year, 0, 0, 0, 0, d.Seconds)) 
    .attr('cx', d => x(new Date(d.Year, 0, 0)))
    .attr('cy', d => y(new Date(0, 0, 0, 0, 0, d.Seconds)))
    .attr('r', '8px')
    .on('mouseover', (e, d) => {
      const left = e.pageX;
      const top = e.pageY;
      
      tooltip.attr('data-year', new Date(d.Year, 0, 0))
        .transition()
        .duration(100)
        .style('opacity', 1);

      let dopingText = '';
      if(d.Doping !== "") {
        dopingText = '<br>' + d.Doping;
      }
    
      tooltip
        .html('Name: ' + d.Name + '<br>' + 'Time: ' + d.Time + '<br>' + 'Place: ' + d.Place + '<br>' + 'Nationality: ' + d.Nationality + dopingText)
        .style('left', (left + 30) + 'px')		
        .style('top', (top - 100) + 'px');
    })
    .on('mouseout', () => {
      tooltip.transition()
        .duration(200)
        .style('opacity', 0)
    })
    .on('click', (event, d) => {
      if(d.URL !== "") {
        window.open(d.URL) 
      }
    })
  
  const legend = svg.append('g')
    .attr('id', 'legend')
  
  const doping = legend.append('g')
    .attr('transform', 'translate(0, 340)')
  
  doping.append('circle')
    .attr('cx', '683')
    .attr('cy', '-8')
    .attr('r', '8px')
    .style('fill', '#f3722c')
  
  doping.append('text')
    .attr('x', '693')
    .attr('y', '-1')
    .style('font-size', '15px')
    .text('Riders with doping allegations')
  
  const noDoping = legend.append('g')
    .attr('transform', 'translate(0, 360)')
  
  noDoping.append('circle')
    .attr('cx', '683')
    .attr('cy', '-8')
    .attr('r', '8px')
    .style('fill', '#43aa8b')
  
  noDoping.append('text')
    .attr('x', '693')
    .attr('y', '-1')
    .style('font-size', '15px')
    .text('Riders with no doping allegations')
})