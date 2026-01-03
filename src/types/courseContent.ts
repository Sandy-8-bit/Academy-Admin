export type VideoContentItem = {
  id: string;
  module_type: "video";
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  duration: number;
  created_at: string;
  position: number;
};

export type TestContentItem = {
  id: string;
  module_type: "test";
  title: string;
  test_duration: number;
  quizzes: {
    id: string;
    question: string;
    choices: any;
    answer: any;
    isMultiChoice: boolean;
  }[];
  position: number;
};

export type CourseContentsTree = {
  [tierName: string]: {
    [weekKey: string]: {
      [dayKey: string]: CourseContentItem[];
    };
  };
};

export type CourseContentsResponse = {
  courseId: string;
  total: number;
  contents: CourseContentsTree;
};

export type CourseContentItem = VideoContentItem | TestContentItem;
