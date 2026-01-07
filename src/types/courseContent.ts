export interface Quiz {
  id: string;
  question: string;
  choices: string[];
  answer: string[];
  isMultiChoice: boolean;
}

export interface VideoContent {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  duration: number;
  created_at: string;
}

export interface TestContent {
  id: string;
  title: string;
  test_duration: number;
  quiz_count: number;
  quizzes: Quiz[];
}

export type TierContentItem =
  | {
      id: string;
      module_type: "video";
      position: number;
      video: VideoContent;
    }
  | {
      id: string;
      module_type: "test";
      position: number;
      test: TestContent;
    };

export interface TierWeeks {
  [week: string]: {
    [day: string]: TierContentItem[];
  };
}

export interface TierContentsResponse {
  tierId: string;
  total: number;
  weeks: TierWeeks;
}
