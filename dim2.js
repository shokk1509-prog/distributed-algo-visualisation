const Dim2 = (() => {
  let initialised = false;
  let svg = null;
  let path1 = null, path2 = null, tradeArea = null;
  let W = 0, H = 0;

  // 核心計算なし・独自ランダム曲線
  function _randomCurve() {
    const pts = [];
    let y = 0;
    for (let x = -5; x <= 5; x += 0.2) {
      y += (Math.random() - 0.48) * 40;
      y *= 0.92;
      pts.push({ x, y: Math.max(-400, Math.min(400, y)) });
    }
    return pts;
  }

  let curve1 = _randomCurve();
  let curve2 = _randomCurve();

  function init() {
    const container = document.getElementById('panel-2');
    const svgEl = document.getElementById('dim2-svg');
    W = container.clientWidth;
    H = container.clientHeight;
    const m = { top:30, right:20, bottom:40, left:50 };

    svg = d3.select(svgEl).attr('width', W).attr('height', H);
    svg.selectAll('*').remove();
    svg.append('rect').attr('width', W).attr('height', H).attr('fill', '#050508');

    const chartG = svg.append('g').attr('transform', `translate(${m.left},${m.top})`);
    const cW = W - m.left - m.right;
    const cH = H - m.top - m.bottom;

    const xScale = d3.scaleLinear().domain([-5, 5]).range([0, cW]);
    const yScale = d3.scaleLinear().domain([-400, 400]).range([cH, 0]);

    // グリッド
    const grid = chartG.append('g').style('opacity', 0.12);
    xScale.ticks(8).forEach(t => {
      grid.append('line').attr('x1',xScale(t)).attr('x2',xScale(t))
        .attr('y1',0).attr('y2',cH).attr('stroke','#1a1a2e');
    });
    yScale.ticks(6).forEach(t => {
      grid.append('line').attr('x1',0).attr('x2',cW)
        .attr('y1',yScale(t)).attr('y2',yScale(t)).attr('stroke','#1a1a2e');
    });

    // 軸
    chartG.append('g').attr('transform',`translate(0,${cH/2})`)
      .call(d3.axisBottom(xScale).ticks(6))
      .selectAll('text').style('fill','#555570').style('font-family','Space Mono').style('font-size','9px');
    chartG.append('g').attr('transform',`translate(${cW/2},0)`)
      .call(d3.axisLeft(yScale).ticks(6))
      .selectAll('text').style('fill','#555570').style('font-family','Space Mono').style('font-size','9px');
    chartG.selectAll('.domain,.tick line').attr('stroke','#1a1a2e');

    const line = d3.line().x(d => xScale(d.x)).y(d => yScale(d.y)).curve(d3.curveCatmullRom);
    const area = d3.area()
      .x(d => xScale(d.x))
      .y0((d, i) => yScale(curve1[i]?.y || 0))
      .y1(d => yScale(d.y))
      .curve(d3.curveCatmullRom);

    tradeArea = chartG.append('path').datum(curve2)
      .attr('fill', '#4169e1').attr('opacity', 0.06).attr('d', area);
    path1 = chartG.append('path').datum(curve1)
      .attr('fill','none').attr('stroke','#4169e1').attr('stroke-width',2).attr('d', line);
    path2 = chartG.append('path').datum(curve2)
      .attr('fill','none').attr('stroke','#ff1493').attr('stroke-width',2).attr('d', line);

    const hud = document.getElementById('hud-dim2');
    if (hud) hud.innerHTML = `TRADE-OFF<br>Proof of Work`;

    initialised = true;
  }

  function start() { if (!initialised) init(); }
  function stop()  {}
  function setAlgo() {}
  function randomise() {
    curve1 = _randomCurve();
    curve2 = _randomCurve();
    if (initialised) init();
  }

  return { start, stop, setAlgo, randomise };
})();
