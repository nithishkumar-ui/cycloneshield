import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../state/store';
import { PRESET_SCENARIOS } from '../data/scenarios';

export default function LandingPage() {
  const navigate = useNavigate();
  const { setCurrentScenario } = useStore();
  const globeRef = useRef<HTMLDivElement>(null);

  const handleSelect = (scenarioId: string) => {
    const scenario = PRESET_SCENARIOS.find((s) => s.id === scenarioId);
    if (scenario) {
      setCurrentScenario(scenario);
      navigate(`/command/${scenario.id}`);
    }
  };

  return (
    <div className="grid-bg scan-line" style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      position: 'relative',
    }}>
      {/* Main content grid - Mission control layout like Image 1 */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '300px 1fr 320px',
        gridTemplateRows: '1fr auto',
        gap: '2px',
        padding: '12px',
        maxHeight: 'calc(100vh - 56px)',
      }}>
        {/* ---- Left Column: Stats + Data Tables ---- */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          overflow: 'auto',
        }}>
          {/* Header Stats */}
          <div className="glass-panel" style={{ padding: '16px' }}>
            <div style={{
              fontSize: '0.6rem',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginBottom: '12px',
            }}>
              🌀 CYCLONESHIELD — AI IMPACT FORECASTER
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
            }}>
              <StatBox label="Active Tracks" value="3" icon="🌀" color="#22D3EE" />
              <StatBox label="Monitored Assets" value="847" icon="🏗" color="#FACC15" />
              <StatBox label="Coastal Zones" value="12" icon="🌊" color="#38BDF8" />
              <StatBox label="Alert Regions" value="5" icon="⚠️" color="#FB923C" />
            </div>
          </div>

          {/* Live data feed */}
          <div className="glass-panel" style={{ padding: '14px' }}>
            <SectionTitle title="RECENT CYCLONE ACTIVITY" subtitle="Indian Ocean Basin" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
              {[
                { name: 'Fani', year: 2019, cat: 'ESCS', wind: '130kt', status: 'archived' },
                { name: 'Amphan', year: 2020, cat: 'Super', wind: '140kt', status: 'archived' },
                { name: 'Michaung', year: 2023, cat: 'SCS', wind: '55kt', status: 'archived' },
              ].map((storm) => (
                <div key={storm.name} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px',
                  borderRadius: '6px',
                  background: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border-subtle)',
                }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: storm.cat === 'Super' ? '#EF4444' : storm.cat === 'ESCS' ? '#FB923C' : '#FACC15',
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{storm.name} ({storm.year})</div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>{storm.cat} · {storm.wind}</div>
                  </div>
                  <span style={{
                    fontSize: '0.55rem',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    background: 'rgba(52, 211, 153, 0.1)',
                    color: '#34D399',
                    border: '1px solid rgba(52, 211, 153, 0.2)',
                  }}>
                    {storm.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mini chart simulation */}
          <div className="glass-panel" style={{ padding: '14px' }}>
            <SectionTitle title="WIND SPEED DISTRIBUTION" subtitle="Historical cyclone data" />
            <div style={{ marginTop: '10px' }}>
              <MiniBarChart />
            </div>
          </div>

          {/* Data table */}
          <div className="glass-panel" style={{ padding: '14px' }}>
            <SectionTitle title="INFRASTRUCTURE STATUS" subtitle="Monitored assets by region" />
            <DataTable />
          </div>
        </div>

        {/* ---- Center: 3D Globe ---- */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          {/* Data stream overlay text */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            zIndex: 5,
            pointerEvents: 'none',
          }}>
            <DataStreamText lines={['<SYS.MONITOR:ACTIVE>', 'TRACK.DB: IBTrACS_v04', 'DEM: TERRARIUM_TILES', 'SAT: SENTINEL-2/S2_SR']} />
            <DataStreamText lines={['LAT: 13.05°N  LON: 80.25°E', 'GRID: 256×256  RES: 30m', 'STATUS: OPERATIONAL', 'UPLINK: ●●●●●○○']} align="right" />
          </div>

          {/* Globe container */}
          <div
            ref={globeRef}
            style={{
              width: '100%',
              maxWidth: '600px',
              aspectRatio: '1',
              position: 'relative',
            }}
          >
            <GlobeScene containerRef={globeRef} />
          </div>

          {/* Track markers */}
          <div style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            gap: '12px',
            zIndex: 5,
          }}>
            {PRESET_SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelect(s.id)}
                className="glass-panel glow-cyan"
                style={{
                  padding: '12px 20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  minWidth: '140px',
                  border: '1px solid var(--color-border-default)',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>🌀</span>
                <span style={{
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--color-cyan-accent)',
                }}>{s.name}</span>
                <span style={{
                  fontSize: '0.65rem',
                  color: 'var(--color-text-muted)',
                }}>{s.year} · {s.region.split(',')[0]}</span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--color-severity-warning)',
                }}>{s.peakWind} kt peak</span>
              </button>
            ))}
          </div>

          {/* Tagline */}
          <div style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-250%)',
            textAlign: 'center',
            zIndex: 5,
            pointerEvents: 'none',
          }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: '6px',
            }}>
              <span style={{ color: 'var(--color-cyan-accent)' }}>Cyclone</span>
              <span style={{ color: 'var(--color-text-primary)' }}>Shield</span>
            </h1>
            <p style={{
              fontSize: '0.85rem',
              color: 'var(--color-text-secondary)',
              maxWidth: '400px',
              lineHeight: 1.5,
            }}>
              Move disaster response from <span style={{ color: 'var(--color-severity-emergency)', fontWeight: 600 }}>post-landfall recovery</span> to{' '}
              <span style={{ color: 'var(--color-cyan-accent)', fontWeight: 600 }}>pre-landfall action</span>
            </p>
          </div>
        </div>

        {/* ---- Right Column: Additional widgets ---- */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          overflow: 'auto',
        }}>
          {/* Severity Overview */}
          <div className="glass-panel" style={{ padding: '14px' }}>
            <SectionTitle title="SEVERITY DISTRIBUTION" subtitle="Across monitored scenarios" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
              <SeverityBar label="Emergency" count={1} total={3} color="#EF4444" />
              <SeverityBar label="Warning" count={1} total={3} color="#FB923C" />
              <SeverityBar label="Watch" count={1} total={3} color="#FACC15" />
              <SeverityBar label="Advisory" count={0} total={3} color="#38BDF8" />
            </div>
          </div>

          {/* Peak surge chart */}
          <div className="glass-panel" style={{ padding: '14px' }}>
            <SectionTitle title="PEAK SURGE ESTIMATES" subtitle="Model approximation" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              {PRESET_SCENARIOS.map((s) => {
                const surge = s.peakWind > 120 ? 3.5 : s.peakWind > 80 ? 2.1 : 1.2;
                return (
                  <div key={s.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '3px' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>{s.name}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-cyan-accent)', fontWeight: 600 }}>
                        {surge.toFixed(1)}m
                      </span>
                    </div>
                    <div style={{
                      height: '4px',
                      borderRadius: '2px',
                      background: 'var(--color-bg-card)',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${(surge / 5) * 100}%`,
                        borderRadius: '2px',
                        background: surge > 3 ? 'linear-gradient(90deg, #FB923C, #EF4444)' :
                          surge > 2 ? 'linear-gradient(90deg, #FACC15, #FB923C)' :
                          'linear-gradient(90deg, #22D3EE, #38BDF8)',
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Line chart simulation */}
          <div className="glass-panel" style={{ padding: '14px' }}>
            <SectionTitle title="PRESSURE TREND" subtitle="Central pressure (hPa)" />
            <MiniLineChart />
          </div>

          {/* Technology stack */}
          <div className="glass-panel" style={{ padding: '14px' }}>
            <SectionTitle title="SYSTEM STATUS" subtitle="Platform components" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
              {[
                { label: 'Three.js 3D Engine', status: 'active' },
                { label: 'Gemini AI (Flash)', status: 'ready' },
                { label: 'Supabase DB', status: 'connected' },
                { label: 'Open-Meteo API', status: 'active' },
                { label: 'IBTrACS Data', status: 'loaded' },
                { label: 'Overpass/OSM', status: 'cached' },
              ].map((item) => (
                <div key={item.label} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 8px',
                  borderRadius: '4px',
                  background: 'var(--color-bg-card)',
                }}>
                  <div style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    background: '#34D399',
                    boxShadow: '0 0 4px rgba(52, 211, 153, 0.5)',
                  }} />
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)', flex: 1 }}>{item.label}</span>
                  <span style={{ fontSize: '0.58rem', color: '#34D399', fontFamily: 'var(--font-mono)' }}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar / schedule widget */}
          <div className="glass-panel" style={{ padding: '14px' }}>
            <SectionTitle title="CYCLONE SEASON" subtitle="North Indian Ocean" />
            <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', marginTop: '8px' }}>
              {['J','F','M','A','M','J','J','A','S','O','N','D'].map((month, idx) => {
                const isActive = idx >= 3 && idx <= 5 || idx >= 9 && idx <= 11;
                return (
                  <div key={idx} style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '4px',
                    background: isActive ? 'rgba(34, 211, 238, 0.15)' : 'var(--color-bg-card)',
                    border: `1px solid ${isActive ? 'rgba(34, 211, 238, 0.3)' : 'var(--color-border-subtle)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.55rem',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--color-cyan-accent)' : 'var(--color-text-muted)',
                  }}>
                    {month}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom data ticker */}
      <div style={{
        padding: '6px 20px',
        borderTop: '1px solid var(--color-border-default)',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        overflow: 'hidden',
        background: 'rgba(10, 15, 28, 0.9)',
      }}>
        {[
          { label: 'BOB', value: '48112', color: '#22D3EE' },
          { label: 'AS', value: '19454', color: '#38BDF8' },
          { label: 'NIO', value: '22991', color: '#FACC15' },
          { label: 'ESCS', value: '4.3K', color: '#FB923C' },
          { label: 'SCS', value: '8.4K', color: '#34D399' },
          { label: 'TRACKS', value: '51215', color: '#A78BFA' },
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: item.color }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: item.color, fontWeight: 600 }}>
              {item.value}
            </span>
            <span style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Sub Components ---- */

function GlobeScene({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const rendererRef = useRef<{ renderer: THREE.WebGLRenderer; animId: number } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const size = Math.min(container.clientWidth, container.clientHeight, 500);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '50%';
    renderer.domElement.style.left = '50%';
    renderer.domElement.style.transform = 'translate(-50%, -50%)';

    // Globe
    const globeGeo = new THREE.SphereGeometry(1.5, 64, 64);
    const globeMat = new THREE.MeshPhongMaterial({
      color: 0x0A1628,
      transparent: true,
      opacity: 0.9,
      wireframe: false,
      specular: 0x22D3EE,
      shininess: 15,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globe);

    // Wireframe overlay
    const wireGeo = new THREE.SphereGeometry(1.52, 32, 32);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x22D3EE,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    scene.add(new THREE.Mesh(wireGeo, wireMat));

    // Atmosphere glow
    const atmoGeo = new THREE.SphereGeometry(1.65, 64, 64);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x22D3EE,
      transparent: true,
      opacity: 0.04,
      side: THREE.BackSide,
    });
    scene.add(new THREE.Mesh(atmoGeo, atmoMat));

    // Points on globe (cities / storm locations)
    const dotGeo = new THREE.BufferGeometry();
    const dotCount = 200;
    const dotPositions = new Float32Array(dotCount * 3);
    const dotColors = new Float32Array(dotCount * 3);
    for (let i = 0; i < dotCount; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 1.53;
      dotPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      dotPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      dotPositions[i * 3 + 2] = r * Math.cos(phi);

      // Color: mostly cyan, some orange/red for storm areas
      const isCyclone = Math.random() > 0.85;
      if (isCyclone) {
        dotColors[i * 3] = 1.0;
        dotColors[i * 3 + 1] = 0.5 + Math.random() * 0.3;
        dotColors[i * 3 + 2] = 0.2;
      } else {
        dotColors[i * 3] = 0.13;
        dotColors[i * 3 + 1] = 0.75 + Math.random() * 0.25;
        dotColors[i * 3 + 2] = 0.85 + Math.random() * 0.15;
      }
    }
    dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3));
    dotGeo.setAttribute('color', new THREE.BufferAttribute(dotColors, 3));
    const dotMat = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Points(dotGeo, dotMat));

    // Storm track arcs on globe
    const arcColors = [0xFF4444, 0xFF6600, 0xFFAA00];
    for (let a = 0; a < 3; a++) {
      const arcPoints: THREE.Vector3[] = [];
      const startPhi = Math.PI * (0.3 + a * 0.15);
      const startTheta = Math.PI * (0.8 + a * 0.3);
      for (let i = 0; i <= 20; i++) {
        const t = i / 20;
        const phi = startPhi + t * 0.4;
        const theta = startTheta + t * 0.6;
        const r = 1.55;
        arcPoints.push(new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        ));
      }
      const arcCurve = new THREE.CatmullRomCurve3(arcPoints);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(arcCurve.getPoints(30));
      const arcMat = new THREE.LineBasicMaterial({
        color: arcColors[a],
        transparent: true,
        opacity: 0.5,
      });
      scene.add(new THREE.Line(arcGeo, arcMat));
    }

    // Lighting
    scene.add(new THREE.AmbientLight(0x334466, 0.5));
    const dLight = new THREE.DirectionalLight(0x88ccff, 0.6);
    dLight.position.set(3, 3, 3);
    scene.add(dLight);
    const pLight = new THREE.PointLight(0x22D3EE, 0.3, 10);
    pLight.position.set(-2, 2, 2);
    scene.add(pLight);

    // Animate
    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      globe.rotation.y += 0.002;
      renderer.render(scene, camera);
    };
    animate();

    rendererRef.current = { renderer, animId };

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [containerRef]);

  return null;
}

function StatBox({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div style={{
      padding: '10px',
      borderRadius: '6px',
      background: `${color}08`,
      border: `1px solid ${color}15`,
    }}>
      <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>{icon} {label}</div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '1.3rem',
        fontWeight: 700,
        color: color,
      }}>{value}</div>
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <div style={{
        fontSize: '0.65rem',
        fontWeight: 700,
        color: 'var(--color-text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        {title}
        <div style={{ flex: 1, height: '1px', background: 'var(--color-border-subtle)' }} />
      </div>
      <div style={{ fontSize: '0.58rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>{subtitle}</div>
    </div>
  );
}

function SeverityBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)', minWidth: '70px' }}>{label}</span>
      <div style={{
        flex: 1,
        height: '6px',
        borderRadius: '3px',
        background: 'var(--color-bg-card)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${(count / total) * 100}%`,
          borderRadius: '3px',
          background: color,
          boxShadow: `0 0 6px ${color}40`,
        }} />
      </div>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.7rem',
        color: color,
        fontWeight: 600,
        minWidth: '16px',
      }}>{count}</span>
    </div>
  );
}

function MiniBarChart() {
  const bars = [35, 55, 72, 90, 45, 60, 80, 50, 65, 40, 30, 85];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '60px' }}>
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${h}%`,
            borderRadius: '2px 2px 0 0',
            background: `linear-gradient(to top, var(--color-cyan-dim), var(--color-cyan-accent))`,
            opacity: 0.5 + (h / 200),
            transition: 'height 0.5s ease',
          }}
        />
      ))}
    </div>
  );
}

function MiniLineChart() {
  const points = [980, 975, 960, 940, 932, 940, 955, 970, 985, 995];
  const min = Math.min(...points);
  const max = Math.max(...points);
  const height = 60;
  const width = 260;

  const pathD = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - ((p - min) / (max - min)) * height;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div style={{ marginTop: '10px' }}>
      <svg width="100%" height={height + 10} viewBox={`0 0 ${width} ${height + 10}`} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="50%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
        <path d={pathD} fill="none" stroke="url(#lineGrad)" strokeWidth="2" />
        {points.map((p, i) => {
          const x = (i / (points.length - 1)) * width;
          const y = height - ((p - min) / (max - min)) * height;
          return (
            <circle key={i} cx={x} cy={y} r={2} fill={p < 950 ? '#EF4444' : '#22D3EE'} />
          );
        })}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', color: 'var(--color-text-muted)' }}>
        <span>T-72h</span>
        <span>Landfall</span>
        <span>T+24h</span>
      </div>
    </div>
  );
}

function DataTable() {
  const data = [
    { region: 'Odisha', substations: 12, roads: 45, hospitals: 8, risk: 'high' },
    { region: 'W. Bengal', substations: 18, roads: 62, hospitals: 15, risk: 'critical' },
    { region: 'Chennai', substations: 9, roads: 38, hospitals: 12, risk: 'medium' },
  ];
  const riskColors: Record<string, string> = { low: '#34D399', medium: '#FACC15', high: '#FB923C', critical: '#EF4444' };

  return (
    <table style={{ width: '100%', fontSize: '0.68rem', marginTop: '8px', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
          {['Region', 'Sub.', 'Roads', 'Hosp.', 'Risk'].map((h) => (
            <th key={h} style={{
              textAlign: 'left',
              padding: '4px 6px',
              color: 'var(--color-text-muted)',
              fontWeight: 600,
              fontSize: '0.6rem',
              textTransform: 'uppercase',
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.region} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
            <td style={{ padding: '5px 6px', color: 'var(--color-text-primary)' }}>{row.region}</td>
            <td style={{ padding: '5px 6px', fontFamily: 'var(--font-mono)', color: 'var(--color-cyan-accent)' }}>{row.substations}</td>
            <td style={{ padding: '5px 6px', fontFamily: 'var(--font-mono)', color: 'var(--color-cyan-accent)' }}>{row.roads}</td>
            <td style={{ padding: '5px 6px', fontFamily: 'var(--font-mono)', color: 'var(--color-cyan-accent)' }}>{row.hospitals}</td>
            <td style={{ padding: '5px 6px' }}>
              <span style={{
                padding: '1px 6px',
                borderRadius: '8px',
                fontSize: '0.6rem',
                fontWeight: 600,
                background: `${riskColors[row.risk]}15`,
                color: riskColors[row.risk],
                border: `1px solid ${riskColors[row.risk]}30`,
              }}>{row.risk}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DataStreamText({ lines, align = 'left' }: { lines: string[]; align?: 'left' | 'right' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
      textAlign: align,
    }}>
      {lines.map((line, i) => (
        <div key={i} style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.58rem',
          color: 'var(--color-cyan-dim)',
          opacity: 0.6,
        }}>
          {line}
        </div>
      ))}
    </div>
  );
}
