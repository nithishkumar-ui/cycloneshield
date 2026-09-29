export default function AboutPage() {
  return (
    <div className="grid-bg" style={{
      flex: 1,
      overflow: 'auto',
      padding: '24px 40px',
      maxWidth: '900px',
      margin: '0 auto',
    }}>
      <div className="animate-fade-in">
        <h1 style={{
          fontSize: '1.8rem',
          fontWeight: 800,
          marginBottom: '8px',
        }}>
          <span style={{ color: 'var(--color-cyan-accent)' }}>About</span> CycloneShield
        </h1>
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--color-text-secondary)',
          marginBottom: '28px',
          lineHeight: 1.6,
        }}>
          AI Cyclone Impact & Infrastructure Vulnerability Forecaster<br />
          BRICS Hackathon — Track 5: Climate Risk & Disaster Response
        </p>

        <Section title="Methodology">
          <p>CycloneShield uses a combination of <b>deterministic physical models</b> and <b>AI-powered advisory generation</b>:</p>
          <ul>
            <li><b>Storm Surge:</b> Simplified "bathtub-plus" model computing inverse barometer effect, wind setup, wave setup, and tide offset. Flood-fill from ocean-connected cells with inland attenuation.</li>
            <li><b>Rainfall Risk:</b> D8 flow direction and accumulation on DEM, combined with precipitation data and land-cover imperviousness.</li>
            <li><b>Exposure Scoring:</b> Weighted combination of surge depth, rain risk, and elevation, scored 0-100.</li>
            <li><b>Road Connectivity:</b> Graph analysis on arterial road network, marking segments below surge as cut and checking reachability to hospitals/shelters.</li>
            <li><b>Advisories:</b> Gemini AI generates structured per-authority advisories using only the deterministic model outputs — never fabricating numbers.</li>
          </ul>
        </Section>

        <Section title="Honest Limitations">
          <div style={{
            padding: '12px 16px',
            borderRadius: '8px',
            background: 'rgba(250, 204, 21, 0.08)',
            border: '1px solid rgba(250, 204, 21, 0.2)',
            marginBottom: '12px',
          }}>
            <p style={{ color: '#FACC15', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
              ⚠️ This is a demonstration prototype, not an operational forecasting system.
            </p>
            <ul style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              <li>The surge model is a <b>simplified approximation</b>. Real surge depends on complex bathymetry, land use friction, and riverine interaction not captured here.</li>
              <li>Surge values are calibrated to give plausible ranges for historical storms but should not be used for actual evacuation decisions.</li>
              <li>Dispatch channels are <b>simulated</b> unless real Telegram/email credentials are configured.</li>
              <li>OSM infrastructure data may be incomplete for rural areas.</li>
              <li>ERA5 reanalysis underestimates peak cyclone winds; track files are used for intensity.</li>
              <li>GEE satellite data is pre-processed offline, not live.</li>
            </ul>
          </div>
        </Section>

        <Section title="Data Sources">
          <table style={{ width: '100%', fontSize: '0.78rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border-default)' }}>
                <th style={{ textAlign: 'left', padding: '8px', color: 'var(--color-text-muted)' }}>Need</th>
                <th style={{ textAlign: 'left', padding: '8px', color: 'var(--color-text-muted)' }}>Source</th>
                <th style={{ textAlign: 'left', padding: '8px', color: 'var(--color-text-muted)' }}>Cost</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Elevation', 'AWS Terrain Tiles (Terrarium)', 'Free'],
                ['Forecast Weather', 'Open-Meteo Forecast API', 'Free'],
                ['Historical Weather', 'Open-Meteo ERA5 Archive', 'Free'],
                ['Waves', 'Open-Meteo Marine API', 'Free'],
                ['Cyclone Tracks', 'IBTrACS (NOAA/NCEI)', 'Free'],
                ['Infrastructure', 'OpenStreetMap / Overpass', 'Free'],
                ['Satellite / Land Cover', 'Google Earth Engine (offline)', 'Free'],
                ['AI Advisories', 'Gemini API (Flash)', 'Free tier'],
                ['Database / Auth', 'Supabase', 'Free tier'],
              ].map(([need, source, cost]) => (
                <tr key={need} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '8px', color: 'var(--color-text-primary)' }}>{need}</td>
                  <td style={{ padding: '8px', color: 'var(--color-cyan-accent)' }}>{source}</td>
                  <td style={{ padding: '8px' }}>
                    <span className="badge badge-safe">{cost}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title="Technology Stack">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['React', 'TypeScript', 'Vite', 'Three.js', 'Zustand', 'Tailwind CSS', 'Supabase', 'Gemini AI', 'Web Workers', 'Vitest'].map((tech) => (
              <span key={tech} style={{
                padding: '4px 12px',
                borderRadius: '20px',
                background: 'var(--color-bg-card)',
                border: '1px solid var(--color-border-default)',
                fontSize: '0.75rem',
                color: 'var(--color-cyan-accent)',
              }}>
                {tech}
              </span>
            ))}
          </div>
        </Section>

        <Section title="Calibration Notes">
          <p>The surge model parameters were tuned so that:</p>
          <ul>
            <li><b>Cyclone Fani (2019):</b> peak surge ≈ 1.5–2.5m at Puri (observed ~1.5–2m)</li>
            <li><b>Cyclone Amphan (2020):</b> peak surge ≈ 3–5m in Sundarbans (observed ~3–5m)</li>
            <li><b>Cyclone Michaung (2023):</b> minimal surge, but extreme rainfall flooding</li>
          </ul>
          <p style={{ marginTop: '8px', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
            The wind_setup coefficient (k_w) and fetch_factor were adjusted iteratively to match these ranges.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '28px' }}>
      <h2 style={{
        fontSize: '1.1rem',
        fontWeight: 700,
        color: 'var(--color-text-primary)',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        {title}
        <div style={{
          flex: 1,
          height: '1px',
          background: 'var(--color-border-default)',
        }} />
      </h2>
      <div style={{
        fontSize: '0.82rem',
        color: 'var(--color-text-secondary)',
        lineHeight: 1.7,
      }}>
        {children}
      </div>
      <style>{`
        section ul {
          padding-left: 20px;
          margin: 8px 0;
        }
        section li {
          margin-bottom: 4px;
        }
      `}</style>
    </section>
  );
}
