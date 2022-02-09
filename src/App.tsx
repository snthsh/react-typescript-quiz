import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import axios from 'axios';
//Constants
import { BUTTONS_ARRAY, TOTAL_QUESTIONS } from './constants';
//Styles
import { GlobalStyle } from './App.styles';
//Components
import Questions from './components/screens/Questions';
import Home from './components/screens/Home';
import Score from './components/screens/Score';
//Utils
import { sortArray, capitalCaseByWords } from './utils';
//Types
import {
  QuizData,
  Question,
  Activity,
  AnswerObject,
  Screen,
} from './types/Types';

const App = () => {
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

  //start by fetching quiz data
  useEffect(() => {
    setLoading(true);
    setGameOver(false);

    axios({
      method: 'get',
      //baseURL: 'https://s3.eu-west-2.amazonaws.com',
      //url: 'https://s3.eu-west-2.amazonaws.com/interview.mock.data/payload.json',
      url: 'https://react-typescript-quiz.free.beeceptor.com/api/quiz',
      headers: {
        'access-control-allow-origin': '*',
        'content-type': 'application/json',
      },
    })
      .then((response) => {
        //console.log('response--->', response);
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
    // console.log('number--->', number);
    // console.log('userAnswers.length--->', userAnswers.length);
    if (!gameOver && userAnswers.length === TOTAL_QUESTIONS) {
      setScreen('SCORE');
      setGameOver(true);
    }
  }, [userAnswers, gameOver]);
  //console.log('screen--->', screen);

  //restrict all handleClicks to be exclusively on HTMLButton elements
  const checkAnswer = (event: React.MouseEvent<HTMLButtonElement>) => {
    // console.log('event.currentTarget.value--->');
    // console.log(event.currentTarget.value);
    console.log('checking answernow-->');
    if (!gameOver) {
      //user answer
      const answer = event.currentTarget.value === 'CORRECT' ? true : false;
      //check answer with correct answer
      const correct = questions[number].is_correct === answer;
      const answerObject = {
        number: number + 1,
        question: questions[number].stimulus,
        answer,
        correct,
        correct_answer: questions[number].feedback,
      };
      console.log('answerObject--->');
      console.log({ ...answerObject });
      //save answer in the array for user user answers
      //@ts-ignore
      setUserAnswers((prev) => {
        console.log('setUserAnswers--->');
        console.log(prev.concat([answerObject]));
        return [...prev, answerObject];
      });
      setNumber(number + 1);
    }
  };

  const getQuestions = () => {
    console.log('quizData--->', quizData);
    console.log('activity--->preobelm--->', activity);
    const activityArray = _.filter(quizData.activities, {
      activity_name: activity,
    });
    console.log('activityArray--->', activityArray);
    //return the filtered array's first element (as there're only two activity elements)
    const questions = activityArray[0].questions;
    console.log('questions--->', questions);
    return sortArray(questions);
  };

  const selectActivity = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    console.log('event.selectActivity--->');
    console.log(event.currentTarget.textContent);
    if (event.currentTarget.textContent !== null) {
      const activityWordsInArray = event.currentTarget.textContent.split(' ');
      if (activityWordsInArray.length > 0) {
        const selectedActivity = capitalCaseByWords(activityWordsInArray);
        if (!gameOver) {
          console.log('selectedActivity--->after-capitalcase-->');
          console.log(selectedActivity);
          setActivity(selectedActivity);
          const questions = getQuestions();
          setQuestions(questions);
          setNumber(number);
          setScreen('QUESTION');
          console.log('selected activity questions --->');
          console.log(getQuestions());
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
      <GlobalStyle />
      {loading && <span>Loading...</span>}

      {screen === 'HOME' && (
        <Home
          heading={heading}
          activities={activities}
          selectActivity={selectActivity}
        />
      )}
      {/* {console.log('selectedActivity-->', activity)} */}

      {screen === 'QUESTION' && (
        <Questions
          activity={activity}
          number={number}
          question={questions[number]}
          callback={checkAnswer}
          buttonsArray={BUTTONS_ARRAY}
        />
      )}

      {/* {console.log('userAnswers--->', userAnswers)} */}
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
