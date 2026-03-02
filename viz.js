(function(global) {
  'use strict';

  function createScene(canvasId) {
    const canvas = document.getElementById(canvasId);
    const parent = canvas.parentElement;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x050508, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.01, 1000);
    camera.position.set(0, 0, 5);

    function resize() {
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();

    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const pt = new THREE.PointLight(0x00ffe1, 1.5, 20);
    pt.position.set(3, 3, 3);
    scene.add(pt);

    return { renderer, scene, camera, canvas, resize };
  }

  function clearScene(scene) {
    while (scene.children.length > 0) {
      const obj = scene.children[0];
      scene.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    }
  }

  function glowMaterial(color, opacity) {
    return new THREE.LineBasicMaterial({
      color: color || 0x00ffe1,
      transparent: true,
      opacity: opacity != null ? opacity : 0.8,
    });
  }

  function pointMaterial(color, size) {
    return new THREE.PointsMaterial({
      color: color || 0xffffff,
      size: size || 0.05,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });
  }

  function makeRing(radius, color, segments) {
    const N = segments || 128;
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * Math.PI * 2;
      pts.push(Math.cos(t) * radius, Math.sin(t) * radius, 0);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return new THREE.Line(geo, glowMaterial(color || 0x1a1a2e, 0.4));
  }

  function makeSphere(radius, color, emissive) {
    const geo = new THREE.SphereGeometry(radius || 0.08, 12, 12);
    const mat = new THREE.MeshStandardMaterial({
      color: color || 0x00ffe1,
      emissive: emissive || color || 0x00ffe1,
      emissiveIntensity: 0.6,
    });
    return new THREE.Mesh(geo, mat);
  }

  function makeAxes(size) {
    const group = new THREE.Group();
    [
      { dir: [1,0,0], color: 0xff4444 },
      { dir: [0,1,0], color: 0x44ff44 },
      { dir: [0,0,1], color: 0x4444ff },
    ].forEach(({ dir, color }) => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(
        [0,0,0,...dir.map(v=>v*size)], 3
      ));
      group.add(new THREE.Line(geo,
        new THREE.LineBasicMaterial({ color, opacity: 0.4, transparent: true })
      ));
    });
    return group;
  }

  function createFPSTracker() {
    let lastTime = performance.now();
    let frames = 0;
    let fps = 0;
    return {
      tick() {
        frames++;
        const now = performance.now();
        if (now - lastTime >= 500) {
          fps = Math.round(frames * 1000 / (now - lastTime));
          frames = 0;
          lastTime = now;
        }
        return fps;
      },
      get value() { return fps; }
    };
  }

  function addOrbitControls(camera, canvas) {
    let isDragging = false;
    let prevX = 0, prevY = 0;
    let phi = Math.PI / 4, theta = Math.PI / 4;
    let radius = camera.position.length();

    function update() {
      camera.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
      camera.lookAt(0, 0, 0);
    }

    canvas.addEventListener('mousedown', e => {
      isDragging = true; prevX = e.clientX; prevY = e.clientY;
    });
    window.addEventListener('mouseup', () => { isDragging = false; });
    canvas.addEventListener('mousemove', e => {
      if (!isDragging) return;
      theta -= (e.clientX - prevX) * 0.005;
      phi = Math.max(0.1, Math.min(Math.PI - 0.1, phi + (e.clientY - prevY) * 0.005));
      prevX = e.clientX; prevY = e.clientY;
      update();
    });
    canvas.addEventListener('wheel', e => {
      radius = Math.max(1, Math.min(20, radius + e.deltaY * 0.005));
      update();
      e.preventDefault();
    }, { passive: false });

    // タッチ対応
    let lastTouchDist = 0;
    canvas.addEventListener('touchstart', e => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevX = e.touches[0].clientX;
        prevY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        lastTouchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    });
    canvas.addEventListener('touchmove', e => {
      if (e.touches.length === 1 && isDragging) {
        theta -= (e.touches[0].clientX - prevX) * 0.005;
        phi = Math.max(0.1, Math.min(Math.PI-0.1, phi + (e.touches[0].clientY - prevY) * 0.005));
        prevX = e.touches[0].clientX;
        prevY = e.touches[0].clientY;
        update();
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        radius = Math.max(1, Math.min(20, radius - (dist - lastTouchDist) * 0.01));
        lastTouchDist = dist;
        update();
      }
      e.preventDefault();
    }, { passive: false });
    canvas.addEventListener('touchend', () => { isDragging = false; });

    update();
  }

  global.AlgoViz = {
    createScene,
    clearScene,
    glowMaterial,
    pointMaterial,
    makeRing,
    makeSphere,
    makeAxes,
    createFPSTracker,
    addOrbitControls,
  };

})(window);
