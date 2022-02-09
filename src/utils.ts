import _ from 'lodash';
//Types
import { Question } from './types/Types';

export const sortArray = (questions: Question[]): Question[] => {
  return _.sortBy(questions, (question) => question.order);
};

export const capitalize = (str: string): string => {
  return str.toUpperCase();
};

export const capitalCaseByWord = (word: string): string => {
  return word.toUpperCase().charAt(0) + word.toLowerCase().slice(1);
};

export const capitalCaseByWords = (words: string[]): string | any => {
  if (words.length > 0) {
    const capitalCasedWords = words.map((word) => capitalCaseByWord(word));
    return capitalCasedWords.join(' ');
  }
  return;
};
