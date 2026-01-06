export interface TierPost {
  tier_number: string;
  tier_name: string;
  description: string;
}

export interface Tier {
  id: string;
  course_id: string;
  tier_number: number;
  tier_name: string;
  description: string;
  created_at: string;
}

export interface TierGet {
  courseId: string;
  total: number;
  tiers: Tier[];
}
