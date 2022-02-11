import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import axios from 'axios';
// Constants
import { BUTTONS_ARRAY, TOTAL_QUESTIONS } from './constants';
// Styles
import { GlobalStyle } from './App.styles';
// Components
import Questions from './components/screens/Questions';
import Home from './components/screens/Home';
import Score from './components/screens/Score';
// Utils
import { sortArray, capitalCaseByWords } from './utils';
// Types
import {
  QuizData,
  Question,
  Activity,
  AnswerObject,
  Screen,
} from './types/Types';

const App = () => {
  const [isActivitySelected, setIsActivitySelected] = useState<boolean>(false);
  const [screen, setScreen] = useState<Screen>('HOME');
  const [loading, setLoading] = useState<boolean>(false);
  const [quizData, setQuizData] = useState<QuizData | any>({});
  const [heading, setHeading] = useState<string>('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activity, setActivity] = useState<string | any>('Activity One');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [number, setNumber] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[] | any>([]);
  const [gameOver, setGameOver] = useState<boolean>(true);
  const [name, setName] = useState<string>('');

  // start by fetching quiz data
  useEffect(() => {
    setLoading(true);
    setGameOver(false);

    axios({
      method: 'get',
      url: 'https://react-typescript-quiz.free.beeceptor.com/api/quiz',
      headers: {
        'access-control-allow-origin': '*',
        'content-type': 'application/json',
      },
    })
      .then((response) => {
        const { data } = response;
        setQuizData(data);
        setHeading(data.name);
        setActivities(data.activities);
      })
      .then((error) => {
        console.log('error--->', error);
      });
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!gameOver && userAnswers.length === TOTAL_QUESTIONS) {
      setScreen('SCORE');
      setGameOver(true);
    }
  }, [userAnswers, gameOver]);

  // restrict all handleClicks to be exclusively on HTMLButton elements
  const checkAnswer = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      // user answer
      const answer = event.currentTarget.value === 'CORRECT';
      // check answer with correct answer
      const correct = questions[number].is_correct === answer;
      const answerObject = {
        number: number + 1,
        question: questions[number].stimulus,
        answer,
        correct,
        correct_answer: questions[number].feedback,
      };
      // save answer in the array for user user answers
      // @ts-ignore
      setUserAnswers((prev) => {
        return [...prev, answerObject];
      });
      setNumber(number + 1);
    }
  };

  const getQuestions = () => {
    const activityArray = _.filter(quizData.activities, {
      activity_name: activity,
    });
    // return the filtered array's first element (as there're only two activity elements)
    const { questions } = activityArray[0];
    return sortArray(questions);
  };

  const selectActivity = async (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (event.currentTarget.textContent !== null) {
      const activityWordsInArray = event.currentTarget.textContent.split(' ');
      if (activityWordsInArray.length > 0) {
        const selectedActivity = capitalCaseByWords(activityWordsInArray);
        if (!gameOver) {
          setActivity(selectedActivity);
          const questions = getQuestions();
          setQuestions(questions);
          setNumber(number);
          setScreen('QUESTION');
        }
      }
    }
  };

  const startOver = (event: React.MouseEvent<HTMLButtonElement>) => {
    setScreen('HOME');
    setGameOver(false);
    setNumber(0);
    setQuestions([]);
    setUserAnswers([]);
  };

  return (
    <>
      <p>
        name is----
        {name}
        ---
      </p>
      <GlobalStyle />
      {loading && <span>Loading...</span>}

      {screen === 'HOME' && (
        <Home
          heading={heading}
          activities={activities}
          selectActivity={selectActivity}
          // selectActivity={() => setName('santhosh')}
        />
      )}

      {screen === 'QUESTION' && (
        <Questions
          activity={activity}
          number={number}
          question={questions[number]}
          callback={checkAnswer}
          buttonsArray={BUTTONS_ARRAY}
        />
      )}

      {screen === 'SCORE' && (
        <Score
          activity={activity}
          userAnswers={userAnswers}
          startOver={startOver}
        />
      )}
    </>
  );
};

export default App;
