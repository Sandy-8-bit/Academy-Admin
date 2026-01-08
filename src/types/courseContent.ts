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

export interface BaseModuleRequest {
  week: number;
  day: number;
  position: number;
}

export interface VideoModuleRequest extends BaseModuleRequest {
  module_type: "video";
  video: {
    title: string;
    description: string;
    video_url: string;
    thumbnail_url: string;
    duration: number;
  };
}

export interface QuizRequest {
  question: string;
  choices: string[];
  answer: string[];
  isMultiChoice: boolean;
}

export interface TestModuleRequest extends BaseModuleRequest {
  module_type: "test";
  test: {
    title: string;
    test_duration: number;
    quizzes: QuizRequest[];
  };
}

export type CreateTierContentPayload = VideoModuleRequest | TestModuleRequest;
