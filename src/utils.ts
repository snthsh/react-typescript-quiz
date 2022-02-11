// import _ from 'lodash';
// Types
// import { Question } from './types/Types';

// export const sortArray = (questions: Question[]): Question[] => {
//   return _.sortBy(questions, (question) => question.order);
// };

export const capitalize = (str: string): string => str.toUpperCase();

export const capitalCaseByWord = (word: string): string => {
  const firstLetter = word.toUpperCase().charAt(0);
  const restOfTheLetters = word.toLowerCase().slice(1);
  return firstLetter + restOfTheLetters;
};

export const capitalCaseByWords = (words: string[]): string | any => {
  const capitalCasedWords = words?.map((word) => capitalCaseByWord(word));
  return capitalCasedWords.join(' ');
};
