import { create } from 'zustand';

/* ---- Types ---- */
export type TideState = 'low' | 'mean' | 'high';
export type SeverityLevel = 'advisory' | 'watch' | 'warning' | 'emergency';
export type AssetType = 'substation' | 'power_line' | 'road' | 'hospital' | 'shelter';
export type TabId = 'summary' | 'assets' | 'advisories' | 'dispatch' | 'insurance' | 'ask';

export interface Scenario {
  id: string;
  name: string;
  description: string;
  year: number;
  region: string;
  aoi: { center: [number, number]; bbox: [number, number, number, number] };
  track: TrackPoint[];
  peakWind: number;
  peakCategory: string;
  casualties: string;
  damage: string;
}

export interface TrackPoint {
  t: string;
  lat: number;
  lon: number;
  wind_kt: number;
  pressure_hpa: number;
}

export interface WhatsIfParams {
  maxWind: number;
  pressureDrop: number;
  landfallShift: number;
  tideState: TideState;
}

export interface Asset {
  id: string;
  scenario_id: string;
  osm_id?: number;
  type: AssetType;
  name: string;
  geom: Record<string, unknown>;
  meta: Record<string, unknown>;
  surge_depth_m?: number;
  rain_risk?: number;
  exposure_score?: number;
  cut_off?: boolean;
  severity?: SeverityLevel;
}

export interface MetricsData {
  peakSurge: { low: number; mid: number; high: number };
  peopleExposed: number;
  assetsExposed: number;
  roadsCut: number;
  sheltersCutOff: number;
  hospitalsAtRisk: number;
}

export interface LayerVisibility {
  surge: boolean;
  rainPaths: boolean;
  power: boolean;
  roads: boolean;
  health: boolean;
  shelters: boolean;
}

/* ---- Store ---- */
interface CycloneStore {
  // Scenario
  currentScenario: Scenario | null;
  scenarios: Scenario[];
  setCurrentScenario: (s: Scenario | null) => void;
  setScenarios: (s: Scenario[]) => void;

  // What-if parameters
  whatIf: WhatsIfParams;
  setWhatIf: (params: Partial<WhatsIfParams>) => void;

  // Timeline
  timelinePosition: number; // -72 to +24 hours around landfall
  setTimelinePosition: (t: number) => void;
  isPlaying: boolean;
  setIsPlaying: (p: boolean) => void;

  // Layers
  layers: LayerVisibility;
  toggleLayer: (layer: keyof LayerVisibility) => void;

  // Active tab
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;

  // Selected asset
  selectedAsset: Asset | null;
  setSelectedAsset: (a: Asset | null) => void;

  // Assets
  assets: Asset[];
  setAssets: (a: Asset[]) => void;

  // Metrics
  metrics: MetricsData;
  setMetrics: (m: MetricsData) => void;

  // UI
  language: string;
  setLanguage: (l: string) => void;
  isGenerating: boolean;
  setIsGenerating: (g: boolean) => void;
  geminiStatus: 'ready' | 'thinking' | 'cooling_down' | 'error';
  setGeminiStatus: (s: 'ready' | 'thinking' | 'cooling_down' | 'error') => void;
  verticalExaggeration: number;
  setVerticalExaggeration: (v: number) => void;
  qualityMode: 'low' | 'medium' | 'high';
  setQualityMode: (q: 'low' | 'medium' | 'high') => void;
}

export const useStore = create<CycloneStore>((set) => ({
  // Scenario
  currentScenario: null,
  scenarios: [],
  setCurrentScenario: (s) => set({ currentScenario: s }),
  setScenarios: (s) => set({ scenarios: s }),

  // What-if
  whatIf: {
    maxWind: 130,
    pressureDrop: 60,
    landfallShift: 0,
    tideState: 'mean',
  },
  setWhatIf: (params) =>
    set((state) => ({ whatIf: { ...state.whatIf, ...params } })),

  // Timeline
  timelinePosition: -24,
  setTimelinePosition: (t) => set({ timelinePosition: t }),
  isPlaying: false,
  setIsPlaying: (p) => set({ isPlaying: p }),

  // Layers
  layers: {
    surge: true,
    rainPaths: true,
    power: true,
    roads: true,
    health: true,
    shelters: true,
  },
  toggleLayer: (layer) =>
    set((state) => ({
      layers: { ...state.layers, [layer]: !state.layers[layer] },
    })),

  // Tab
  activeTab: 'summary',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Asset
  selectedAsset: null,
  setSelectedAsset: (a) => set({ selectedAsset: a }),

  // Assets
  assets: [],
  setAssets: (a) => set({ assets: a }),

  // Metrics
  metrics: {
    peakSurge: { low: 1.8, mid: 2.7, high: 3.6 },
    peopleExposed: 245000,
    assetsExposed: 47,
    roadsCut: 12,
    sheltersCutOff: 5,
    hospitalsAtRisk: 3,
  },
  setMetrics: (m) => set({ metrics: m }),

  // UI
  language: 'en',
  setLanguage: (l) => set({ language: l }),
  isGenerating: false,
  setIsGenerating: (g) => set({ isGenerating: g }),
  geminiStatus: 'ready',
  setGeminiStatus: (s) => set({ geminiStatus: s }),
  verticalExaggeration: 2.0,
  setVerticalExaggeration: (v) => set({ verticalExaggeration: v }),
  qualityMode: 'medium',
  setQualityMode: (q) => set({ qualityMode: q }),
}));
