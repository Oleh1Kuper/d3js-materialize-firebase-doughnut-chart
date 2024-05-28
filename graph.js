import { collection, onSnapshot, query, db, deleteDoc, doc } from './db.js';

const dims = { height: 300, width: 300, radius: 150 };
const cent = { x: dims.width / 2 + 5, y: dims.height / 2 + 5 };

const svg = d3.select('.canvas')
  .append('svg')
  .attr('width', dims.width + 150)
  .attr('height', dims.height + 150);

const graph = svg.append('g')
  .attr('transform', `translate(${cent.x}, ${cent.y})`);

const pie = d3.pie()
  .sort(null)
  .value(d => d.cost);

const arcPath = d3.arc()
  .outerRadius(dims.radius)
  .innerRadius(dims.radius / 2);

const color = d3.scaleOrdinal(d3['schemeSet3']);
const legendGroup = svg.append('g')
  .attr('transform', `translate(${dims.width + 40}, 10)`);

const legend = d3.legendColor().shape('circle').shapePadding(10).scale(color);
const tip = d3.tip().attr('class', 'tip card').html(d => {
  const content = `
    <div class="name">${d.data.name}</div>
    <div class="cost">$${d.data.cost}</div>
    <div class="delete">Click slice to delete</div>
  `;
  return content;
});

graph.call(tip);

const update = (data) => {
  color.domain(data.map(d => d.name));
  legendGroup.call(legend);
  legendGroup.selectAll('text').attr('fill', '#fff');

  const paths = graph.selectAll('path')
    .data(pie(data));

  paths.exit()
    .transition().duration(500)
    .attrTween('d', arcTweenExit).remove();

  paths.attr('d', arcPath)
    .transition().duration(500)
    .attrTween('d', arcTweenUpdate);

  paths.enter()
    .append('path')
      .attr('class', 'arc')
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .attr('fill', d => color(d.data.name))
      .each(function(d){ this._current = d })
      .transition().duration(500)
        .attrTween('d', arcTweenEnter);

  graph.selectAll('path')
    .on('mouseover', function(e, d) {
      tip.show(d, this);
      handleMouseOver(e);
    })
    .on('mouseout', (e, d) => {
      handleMouseOut(e, d);
      tip.hide();
    })
    .on('click', handleClick);
};

let data = [];
const q = query(collection(db, 'expenses'));

onSnapshot(q, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    const doc = {...change.doc.data(), id: change.doc.id};
    
    if (change.type === 'added') {
      data.push(doc);
    }

    if (change.type === 'modified') {
      const index = data.findIndex(item => item.id == doc.id);
      data[index] = doc;
    }

    if (change.type === 'removed') {
      data = data.filter(item => item.id !== doc.id);
    }
  });

  update(data)
});

const arcTweenEnter = (d) => {
  const i = d3.interpolate(d.endAngle, d.startAngle);

  return (t) => {
    d.startAngle = i(t);

    return arcPath(d);
  };
};

const arcTweenExit = (d) => {
  const i = d3.interpolate(d.startAngle, d.endAngle);

  return (t) => {
    d.startAngle = i(t);

    return arcPath(d);
  };
};

function arcTweenUpdate(d) {
  const i = d3.interpolate(this._current, d);

  this._current = d;

  return (t) => arcPath(i(t));
}

const handleMouseOver = (e) => {
  d3.select(e.currentTarget).transition('changeSliceFill').duration(300)
    .attr('fill', '#fff')
};

const handleMouseOut = (e, d) => {
  d3.select(e.currentTarget).transition('changeSliceFill').duration(300)
    .attr('fill', color(d.data.name));
};

const handleClick = async (e, d) => {
  console.log(d);
  await deleteDoc(doc(db, 'expenses', d.data.id));
};
