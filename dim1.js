const Dim1 = (() => {
  let ctx = null;
  let animId = null;
  let fps = null;
  let nodes = [];
  let trails = [];
  let orbitGroup = null;
  let trailGroup = null;
  const TRAIL_LEN = 50;
  const NODE_COUNT = 8;
  const ORBIT_R = 2.4;

  function init() {
    ctx = AlgoViz.createScene('canvas-dim1');
    AlgoViz.addOrbitControls(ctx.camera, ctx.canvas);
    fps = AlgoViz.createFPSTracker();
    ctx.camera.position.set(0, 3, 7);
    ctx.camera.lookAt(0, 0, 0);

    // グリッド
    const gridGeo = new THREE.BufferGeometry();
    const gridPts = [];
    const gSize = 6, gDiv = 16;
    for (let i = 0; i <= gDiv; i++) {
      const t = (i / gDiv) * gSize - gSize / 2;
      gridPts.push(-gSize/2, 0, t, gSize/2, 0, t);
      gridPts.push(t, 0, -gSize/2, t, 0, gSize/2);
    }
    gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(gridPts, 3));
    ctx.scene.add(new THREE.LineSegments(gridGeo,
      new THREE.LineBasicMaterial({ color: 0x1a1a2e, transparent: true, opacity: 0.4 })));

    ctx.scene.add(AlgoViz.makeAxes(3));

    // 軌道リング
    orbitGroup = new THREE.Group();
    orbitGroup.rotation.x = Math.PI / 2;
    orbitGroup.add(AlgoViz.makeRing(ORBIT_R, 0x4169e1, 128));
    orbitGroup.add(AlgoViz.makeRing(ORBIT_R * 0.5, 0x4169e1, 64));
    ctx.scene.add(orbitGroup);

    // ノード
    trails = [];
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const sphere = AlgoViz.makeSphere(0.1, 0x4169e1);
      ctx.scene.add(sphere);
      nodes.push(sphere);
      trails.push([]);
    }

    // トレイル
    trailGroup = new THREE.Group();
    for (let i = 0; i < NODE_COUNT; i++) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TRAIL_LEN * 3), 3));
      geo.setDrawRange(0, 0);
      trailGroup.add(new THREE.Line(geo, AlgoViz.glowMaterial(0x4169e1, 0.3)));
    }
    ctx.scene.add(trailGroup);

    window.addEventListener('resize', ctx.resize);
  }

  function animate() {
    animId = requestAnimationFrame(animate);
    const t = performance.now() * 0.001;

    for (let i = 0; i < NODE_COUNT; i++) {
      // シンプルな円運動のみ・核心計算なし
      const angle = (2 * Math.PI * i / NODE_COUNT) + t * 0.6;
      const x = Math.cos(angle) * ORBIT_R;
      const y = Math.sin(t * 1.2 + i * 0.8) * 0.12;
      const z = Math.sin(angle) * ORBIT_R;

      nodes[i].position.set(x, y, z);

      trails[i].push({ x, y, z });
      if (trails[i].length > TRAIL_LEN) trails[i].shift();

      const tl = trailGroup.children[i];
      if (tl && trails[i].length > 1) {
        const pos = tl.geometry.attributes.position.array;
        trails[i].forEach((pt, k) => {
          pos[k*3] = pt.x; pos[k*3+1] = pt.y; pos[k*3+2] = pt.z;
        });
        tl.geometry.attributes.position.needsUpdate = true;
        tl.geometry.setDrawRange(0, trails[i].length);
      }
    }

    ctx.renderer.render(ctx.scene, ctx.camera);

    const fpsVal = fps.tick();
    const hud = document.getElementById('hud-dim1');
    if (hud) hud.innerHTML = `Proof of Work<br>N = ${NODE_COUNT}`;
    const hudr = document.getElementById('hud-dim1-r');
    if (hudr) hudr.innerHTML = `FPS ${fpsVal}`;
    document.getElementById('status-fps').textContent = `FPS: ${fpsVal}`;
  }

  function start() { if (!ctx) init(); if (!animId) animate(); }
  function stop()  { if (animId) { cancelAnimationFrame(animId); animId = null; } }
  function setAlgo() {}

  return { start, stop, setAlgo };
})();

