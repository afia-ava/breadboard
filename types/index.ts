export interface Component {
  name: string;
  price_min: number;
  price_max: number;
  purpose: string;
  notes?: string;
}

export interface Tier {
  tier: 'budget' | 'mid' | 'premium';
  label: string;
  total_price_min: number;
  total_price_max: number;
  components: Component[];
  tradeoffs: string;
  gotchas?: string[];
}

export interface RecommendationResult {
  project_title: string;
  project_summary: string;
  tiers: Tier[];
}
