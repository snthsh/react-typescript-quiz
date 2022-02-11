export type Screen = 'HOME' | 'QUESTION' | 'SCORE';

export type QuizData = {
  activities: ActivityObject[];
  heading: string;
  name: string;
};

export type Question = {
  is_correct: boolean;
  stimulus: string;
  order: number;
  user_answers: string[];
  feedback: string;
};

export type QuestionTypeOne = {
  is_correct: boolean;
  stimulus: string;
  order: number;
  user_answers: string[];
  feedback: string;
};

export type QuestionTypeTwo = {
  round_title: string;
  order: number;
  questions: QuestionTypeOne[];
};

export type ActivityObject = {
  activity_name: string;
  order: number;
  questions: Question[];
};

export type AnswerObject = {
  number: number;
  question: string;
  answer: string;
  correct: boolean;
  correct_answer: string;
};
