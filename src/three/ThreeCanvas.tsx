import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useStore } from '../state/store';

export default function ThreeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    terrain: THREE.Mesh;
    surge: THREE.Mesh;
    trackLine: THREE.Line;
    stormMarker: THREE.Group;
    particles: THREE.Points;
    flowParticles: THREE.Points;
    assetMarkers: THREE.Group;
    animationId: number;
    clock: THREE.Clock;
  } | null>(null);

  const {
    currentScenario,
    timelinePosition,
    whatIf,
    layers,
    verticalExaggeration,
  } = useStore();

  useEffect(() => {
    if (!containerRef.current || !currentScenario) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // ---- Scene setup ----
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0A0F1C);
    scene.fog = new THREE.FogExp2(0x0A0F1C, 0.015);

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(15, 18, 15);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.minDistance = 5;
    controls.maxDistance = 50;

    // ---- Lighting ----
    const ambientLight = new THREE.AmbientLight(0x1a2a4a, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x88ccff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x22D3EE, 0.5, 50);
    pointLight.position.set(0, 10, 0);
    scene.add(pointLight);

    // ---- Grid ----
    const gridHelper = new THREE.GridHelper(40, 40, 0x1a3a5a, 0x0d1f3a);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // ---- Terrain ----
    const terrainGeo = new THREE.PlaneGeometry(20, 20, 128, 128);
    terrainGeo.rotateX(-Math.PI / 2);

    // Generate procedural terrain (simulating DEM data)
    const positions = terrainGeo.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);
      // Coastal elevation profile: higher inland (positive X), lower near coast (negative X)
      let y = 0;
      // Base elevation gradient
      y += Math.max(0, (x + 10) * 0.15);
      // Hills
      y += Math.sin(x * 0.5) * Math.cos(z * 0.3) * 0.8;
      y += Math.sin(x * 1.2 + z * 0.7) * 0.3;
      // River channel
      const riverDist = Math.abs(z - Math.sin(x * 0.3) * 2);
      y -= Math.max(0, 0.5 - riverDist * 0.3);
      // Coastal dip
      if (x < -6) y = Math.max(y * 0.3 - 0.2, -0.3);

      positions.setY(i, y * verticalExaggeration * 0.5);
    }
    terrainGeo.computeVertexNormals();

    // Color by elevation
    const terrainColors = new Float32Array(positions.count * 3);
    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i);
      const normalized = Math.max(0, Math.min(1, (y + 1) / 5));
      // Deep blue -> green -> brown -> white
      if (normalized < 0.1) {
        terrainColors[i * 3] = 0.05;
        terrainColors[i * 3 + 1] = 0.1 + normalized * 2;
        terrainColors[i * 3 + 2] = 0.2 + normalized * 3;
      } else if (normalized < 0.4) {
        terrainColors[i * 3] = 0.1 + normalized * 0.3;
        terrainColors[i * 3 + 1] = 0.3 + normalized * 0.5;
        terrainColors[i * 3 + 2] = 0.15;
      } else if (normalized < 0.7) {
        terrainColors[i * 3] = 0.3 + normalized * 0.3;
        terrainColors[i * 3 + 1] = 0.25 + normalized * 0.2;
        terrainColors[i * 3 + 2] = 0.1;
      } else {
        terrainColors[i * 3] = 0.5 + normalized * 0.3;
        terrainColors[i * 3 + 1] = 0.5 + normalized * 0.3;
        terrainColors[i * 3 + 2] = 0.5 + normalized * 0.3;
      }
    }
    terrainGeo.setAttribute('color', new THREE.BufferAttribute(terrainColors, 3));

    const terrainMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.85,
      metalness: 0.05,
      flatShading: false,
      wireframe: false,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.receiveShadow = true;
    scene.add(terrain);

    // ---- Surge plane ----
    const surgeGeo = new THREE.PlaneGeometry(20, 20, 64, 64);
    surgeGeo.rotateX(-Math.PI / 2);
    const surgeMat = new THREE.MeshStandardMaterial({
      color: 0x22D3EE,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.3,
      side: THREE.DoubleSide,
    });
    const surge = new THREE.Mesh(surgeGeo, surgeMat);
    surge.position.y = 0.5;
    surge.visible = layers.surge;
    scene.add(surge);

    // ---- Storm track ----
    const trackPoints: THREE.Vector3[] = [];
    const track = currentScenario.track;
    const totalTrackLen = track.length;
    for (let i = 0; i < totalTrackLen; i++) {
      const frac = i / (totalTrackLen - 1);
      const x = -10 + frac * 20 + Math.sin(frac * Math.PI) * 3;
      const z = 10 - frac * 20;
      trackPoints.push(new THREE.Vector3(x, 3, z));
    }

    const trackCurve = new THREE.CatmullRomCurve3(trackPoints);
    const trackGeo = new THREE.BufferGeometry().setFromPoints(trackCurve.getPoints(100));
    const trackMat = new THREE.LineBasicMaterial({
      color: 0xFF4444,
      transparent: true,
      opacity: 0.6,
      linewidth: 1,
    });
    const trackLine = new THREE.Line(trackGeo, trackMat);
    scene.add(trackLine);

    // ---- Storm marker (cyclone) ----
    const stormMarker = new THREE.Group();

    // Eye
    const eyeGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xFF4444 });
    const eye = new THREE.Mesh(eyeGeo, eyeMat);
    stormMarker.add(eye);

    // Spiral arms
    const spiralGeo = new THREE.TorusGeometry(0.8, 0.05, 8, 32);
    const spiralMat = new THREE.MeshBasicMaterial({
      color: 0xFF6B6B,
      transparent: true,
      opacity: 0.6,
    });
    for (let i = 0; i < 3; i++) {
      const spiral = new THREE.Mesh(spiralGeo, spiralMat);
      spiral.rotation.x = Math.PI / 2;
      spiral.rotation.z = (i * Math.PI * 2) / 3;
      stormMarker.add(spiral);
    }

    // Glow sphere
    const glowGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xFF4444,
      transparent: true,
      opacity: 0.08,
    });
    stormMarker.add(new THREE.Mesh(glowGeo, glowMat));

    scene.add(stormMarker);

    // ---- Particles (storm/wind) ----
    const particleCount = 2000;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 30;
      particlePositions[i * 3 + 1] = Math.random() * 8 + 1;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      particleSpeeds[i] = Math.random() * 0.02 + 0.005;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x22D3EE,
      size: 0.08,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ---- Flow particles (rain paths) ----
    const flowCount = 500;
    const flowGeo = new THREE.BufferGeometry();
    const flowPositions = new Float32Array(flowCount * 3);
    for (let i = 0; i < flowCount; i++) {
      flowPositions[i * 3] = (Math.random() - 0.5) * 20;
      flowPositions[i * 3 + 1] = Math.random() * 3;
      flowPositions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    flowGeo.setAttribute('position', new THREE.BufferAttribute(flowPositions, 3));
    const flowMat = new THREE.PointsMaterial({
      color: 0x38BDF8,
      size: 0.06,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const flowParticles = new THREE.Points(flowGeo, flowMat);
    flowParticles.visible = layers.rainPaths;
    scene.add(flowParticles);

    // ---- Asset markers ----
    const assetMarkers = new THREE.Group();
    const assetData = [
      { pos: [3, 0, -2], type: 'substation', color: 0xFACC15 },
      { pos: [-5, 0, 1], type: 'substation', color: 0xEF4444 },
      { pos: [1, 0, 4], type: 'hospital', color: 0xFB923C },
      { pos: [-2, 0, -5], type: 'hospital', color: 0xFACC15 },
      { pos: [6, 0, 3], type: 'shelter', color: 0x34D399 },
      { pos: [-4, 0, -3], type: 'shelter', color: 0xFB923C },
      { pos: [0, 0, 0], type: 'shelter', color: 0xEF4444 },
      { pos: [-7, 0, 5], type: 'road', color: 0xFB923C },
    ];

    assetData.forEach((asset) => {
      const markerGeo = new THREE.CylinderGeometry(0, 0.2, 0.5, 6);
      const markerMat = new THREE.MeshBasicMaterial({
        color: asset.color,
        transparent: true,
        opacity: 0.9,
      });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.set(asset.pos[0], asset.pos[1] + 1.5, asset.pos[2]);

      // Glow ring
      const ringGeo = new THREE.RingGeometry(0.15, 0.25, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: asset.color,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(asset.pos[0], asset.pos[1] + 1.0, asset.pos[2]);
      ring.rotation.x = -Math.PI / 2;

      assetMarkers.add(marker);
      assetMarkers.add(ring);
    });
    scene.add(assetMarkers);

    // ---- Road lines ----
    const roadPoints = [
      new THREE.Vector3(-10, 0.1, 0),
      new THREE.Vector3(-5, 0.1, 1),
      new THREE.Vector3(0, 0.1, 0.5),
      new THREE.Vector3(5, 0.1, -1),
      new THREE.Vector3(10, 0.1, 0),
    ];
    const roadCurve = new THREE.CatmullRomCurve3(roadPoints);
    const roadGeo = new THREE.BufferGeometry().setFromPoints(roadCurve.getPoints(50));
    const roadMat = new THREE.LineBasicMaterial({
      color: 0xFB923C,
      transparent: true,
      opacity: 0.4,
    });
    const roadLine = new THREE.Line(roadGeo, roadMat);
    roadLine.visible = layers.roads;
    scene.add(roadLine);

    // ---- Power lines ----
    const powerPoints = [
      new THREE.Vector3(-8, 0.3, -3),
      new THREE.Vector3(-3, 0.3, -2),
      new THREE.Vector3(3, 0.3, -2),
      new THREE.Vector3(6, 0.3, -1),
    ];
    const powerGeo = new THREE.BufferGeometry().setFromPoints(powerPoints);
    const powerMat = new THREE.LineBasicMaterial({
      color: 0xFACC15,
      transparent: true,
      opacity: 0.4,
    });
    const powerLine = new THREE.Line(powerGeo, powerMat);
    powerLine.visible = layers.power;
    scene.add(powerLine);

    // ---- Clock ----
    const clock = new THREE.Clock();

    // Store refs
    sceneRef.current = {
      scene,
      camera,
      renderer,
      controls,
      terrain,
      surge,
      trackLine,
      stormMarker,
      particles,
      flowParticles,
      assetMarkers,
      animationId: 0,
      clock,
    };

    // ---- Animation loop ----
    const animate = () => {
      const id = requestAnimationFrame(animate);
      if (sceneRef.current) sceneRef.current.animationId = id;

      const elapsed = clock.getElapsedTime();

      // Animate storm marker along track
      const t = ((timelinePosition + 72) / 96); // 0 to 1
      const point = trackCurve.getPoint(Math.max(0, Math.min(1, t)));
      stormMarker.position.copy(point);

      // Rotate storm
      stormMarker.children.forEach((child, idx) => {
        if (idx > 0 && idx < 4) {
          child.rotation.z += 0.02;
        }
      });

      // Animate surge level based on timeline
      const surgeBase = whatIf.maxWind / 130 * 1.5;
      const timelineFactor = 1 - Math.abs(timelinePosition) / 72;
      surge.position.y = surgeBase * timelineFactor;

      // Wave animation on surge plane
      const surgePositions = surgeGeo.attributes.position;
      for (let i = 0; i < surgePositions.count; i++) {
        const x = surgePositions.getX(i);
        const z = surgePositions.getZ(i);
        const waveY = surge.position.y + Math.sin(x * 0.5 + elapsed * 2) * 0.05 + Math.cos(z * 0.3 + elapsed * 1.5) * 0.03;
        surgePositions.setY(i, waveY);
      }
      surgePositions.needsUpdate = true;

      // Animate particles (wind)
      const pPositions = particleGeo.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        let x = pPositions.getX(i);
        let z = pPositions.getZ(i);
        // Spiral towards storm center
        const dx = stormMarker.position.x - x;
        const dz = stormMarker.position.z - z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        const speed = particleSpeeds[i];
        if (dist > 0.5) {
          x += (dx / dist) * speed + Math.cos(elapsed + i) * speed * 2;
          z += (dz / dist) * speed + Math.sin(elapsed + i) * speed * 2;
        } else {
          x = (Math.random() - 0.5) * 30;
          z = (Math.random() - 0.5) * 30;
        }
        pPositions.setX(i, x);
        pPositions.setZ(i, z);
      }
      pPositions.needsUpdate = true;

      // Animate flow particles (downhill)
      const fPositions = flowGeo.attributes.position;
      for (let i = 0; i < flowCount; i++) {
        let x = fPositions.getX(i);
        let y = fPositions.getY(i);
        let z = fPositions.getZ(i);
        // Simple downhill flow
        x -= 0.01;
        y = Math.max(0.05, y - 0.005);
        z += Math.sin(elapsed + i * 0.1) * 0.01;
        if (x < -10 || y < 0.1) {
          x = (Math.random()) * 10;
          y = Math.random() * 3 + 0.5;
          z = (Math.random() - 0.5) * 20;
        }
        fPositions.setX(i, x);
        fPositions.setY(i, y);
        fPositions.setZ(i, z);
      }
      fPositions.needsUpdate = true;

      // Pulse asset markers
      assetMarkers.children.forEach((child, idx) => {
        if (child instanceof THREE.Mesh) {
          const scale = 1 + Math.sin(elapsed * 2 + idx * 0.5) * 0.15;
          child.scale.set(scale, scale, scale);
        }
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // ---- Resize ----
    const handleResize = () => {
      if (!containerRef.current || !sceneRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      sceneRef.current.camera.aspect = w / h;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ---- Cleanup ----
    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        sceneRef.current.renderer.dispose();
        sceneRef.current.controls.dispose();
      }
      container.innerHTML = '';
      sceneRef.current = null;
    };
  }, [currentScenario]);

  // Update visibility based on layers
  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.surge.visible = layers.surge;
    sceneRef.current.flowParticles.visible = layers.rainPaths;
  }, [layers]);

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '0',
      }}
    >
      {/* Overlay info */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        pointerEvents: 'none',
      }}>
        <div className="glass-panel-sm" style={{
          padding: '6px 12px',
          fontSize: '0.68rem',
          color: 'var(--color-text-muted)',
          pointerEvents: 'auto',
        }}>
          🌀 STORM COMMAND — 3D View
        </div>
      </div>

      {/* Top-down toggle */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        display: 'flex',
        gap: '6px',
        pointerEvents: 'auto',
      }}>
        <button
          className="glass-panel-sm"
          onClick={() => {
            if (sceneRef.current) {
              sceneRef.current.camera.position.set(0, 30, 0.01);
              sceneRef.current.camera.lookAt(0, 0, 0);
            }
          }}
          style={{
            padding: '6px 10px',
            cursor: 'pointer',
            fontSize: '0.68rem',
            color: 'var(--color-text-secondary)',
            border: '1px solid var(--color-border-default)',
            background: 'var(--color-bg-glass)',
          }}
        >
          ⬇ Top Down
        </button>
        <button
          className="glass-panel-sm"
          onClick={() => {
            if (sceneRef.current) {
              sceneRef.current.camera.position.set(15, 18, 15);
              sceneRef.current.camera.lookAt(0, 0, 0);
            }
          }}
          style={{
            padding: '6px 10px',
            cursor: 'pointer',
            fontSize: '0.68rem',
            color: 'var(--color-text-secondary)',
            border: '1px solid var(--color-border-default)',
            background: 'var(--color-bg-glass)',
          }}
        >
          🎥 Perspective
        </button>
      </div>

      {/* Empty state */}
      {!currentScenario && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '12px',
        }}>
          <div style={{ fontSize: '3rem', opacity: 0.3 }}>🌀</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            Select a scenario to load the 3D view
          </div>
        </div>
      )}
    </div>
  );
}
