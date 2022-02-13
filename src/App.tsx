import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import axios from 'axios';
// Constants
import { ACTIVITY, BUTTONS_ARRAY } from './constants';
// Styles
import GlobalStyle from './App.styles';
// Components
import Questions from './components/screens/Questions';
import Home from './components/screens/Home';
import Score from './components/screens/Score';
// Utils
// import { sortArray, capitalCaseByWords } from './utils';
import { capitalCaseByWords } from './utils';
// Types
import {
  QuizData,
  // Question,
  QuestionTypeOne,
  QuestionTypeTwo,
  ActivityObject,
  AnswerObject,
  Screen,
} from './types/Types';

type Activity = 'Activity One' | 'Activity Two';

function App() {
  const [screen, setScreen] = useState<Screen>('HOME');
  const [loading, setLoading] = useState<boolean>(false);
  const [quizData, setQuizData] = useState<QuizData | any>({});
  const [heading, setHeading] = useState<string>('');
  const [activities, setActivities] = useState<ActivityObject | any>();
  const [activity, _setActivity] = useState<Activity | any>('');
  const [questions, setQuestions] = useState<
    QuestionTypeOne[] | QuestionTypeTwo[] | any
    >([]);
  //const [totalQuestions, setTotalQuestions] = useState<number>();
  const [number, setNumber] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[] | any>([]);
  const [gameOver, setGameOver] = useState<boolean>(true);

  const activityRef = useRef(activity);
  const setActivity = (x: any) => {
    activityRef.current = x;
    _setActivity(x);
  };

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
      .catch((error) => {
        if (error.response) {
          console.error('error:' + error.response.data);
        } else {
          console.error('error:' + error.message);
        }
        console.log(error.config);
      });
    setLoading(false);
  }, []);

  // useEffect(() => {
  //   console.log('userAnswers----->', userAnswers);
  // }, [userAnswers]);

  // restrict all handleClicks to be exclusively on HTMLButton elements
  const checkAnswer = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      // user answer
      const answer = event.currentTarget.value === 'CORRECT';
      // check answer with correct answer
      const correct = questions[number].is_correct === answer;
      const round_title = questions[number]?.round_title
        ? questions[number].round_title
        : '';
      const answerObject = {
        number: number + 1,
        question: questions[number].stimulus,
        answer,
        correct,
        correct_answer: questions[number].feedback,
        round_title: round_title
      };
      // save answer in the array for user user answers
      setUserAnswers((prev: any) => [...prev, answerObject]);

      // Add 1 to number to view the next question
      if (number + 1 < questions.length) {
        setNumber(number + 1);
      }
      // if there's no question to display in next step, move to score screen and
      // reset page number to 0
      if (number + 1 === questions.length) {
        setScreen('SCORE');
        setGameOver(true);
        setNumber(0);
      }
    }
  };

  const getQuestions = () => {
    //Get questions if 'Activity One'
    if (activityRef.current == ACTIVITY.ONE) {
      const activityArray = _.filter(quizData.activities, {
        activity_name: activityRef.current
      });
      return activityArray[0].questions;
      // return sortArray(activityArray[0].questions);
    }

    //Get questions if 'Activity Two'
    if (activityRef.current == ACTIVITY.TWO) {
      const activityArray = _.filter(quizData.activities, {
        activity_name: activityRef.current
      });
      const outerQuestions = activityArray[0].questions;
      const flattenedQuestions: any[] = [];

      _.map(outerQuestions, (outerQuestion) => {
        const round_title = outerQuestion.round_title;
        const order = outerQuestion.order;
        _.map(outerQuestion.questions, (question) => {
          flattenedQuestions.push({ ...question, round_title, order });
        });
      });

      return flattenedQuestions;
    }
  };

  const selectActivity = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (event.currentTarget.textContent !== null) {
      const activityWordsInArray = event.currentTarget.textContent.split(' ');
      if (activityWordsInArray.length > 0) {
        const selectedActivity = capitalCaseByWords(activityWordsInArray);
        setActivity(selectedActivity);

        //Determine the flow based on existence of 'questions' property
        const singleQuestionElement = getQuestions()[0];

        // Flow-1
        if (singleQuestionElement?.questions === undefined) {
          setQuestions(getQuestions());
          setNumber(number);
          setScreen('QUESTION');
        }

        // Flow-2
        if (singleQuestionElement?.questions !== undefined) {
          setQuestions(getQuestions());
          setNumber(number);
          setScreen('QUESTION');
        }
      }
    }
  };

  // eslint-disable-next-line
  const startOver = (event: React.MouseEvent<HTMLButtonElement>) => {
    setScreen('HOME');
    setGameOver(false);
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
      {/* Flow-1 */}
      {/* eslint-disable-next-line */}
      {screen === 'QUESTION' && activity === ACTIVITY.ONE && (
        <Questions
          activity={activity}
          number={number}
          question={questions[number]}
          callback={checkAnswer}
          buttonsArray={BUTTONS_ARRAY}
        />
      )}
      {/* Flow-2 */}
      {screen === 'QUESTION' && activity === ACTIVITY.TWO && (
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
}

export default App;
