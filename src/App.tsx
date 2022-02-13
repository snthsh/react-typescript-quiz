import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import axios from 'axios';
// Constants
import { BUTTONS_ARRAY, TOTAL_QUESTIONS } from './constants';
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
      .then(() => {
        // console.error('error--->', error);
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
      setUserAnswers((prev:any) => [...prev, answerObject]);
      setNumber(number + 1);
    }
  };

  const getQuestions = () => {
    const activityArray = _.filter(quizData.activities, {
      activity_name: activityRef.current,
    });
    // return the filtered array's first element (as there're only two activity elements)
    // return sortArray(activityArray[0].questions);
    return activityArray[0].questions;
  };

  const selectActivity = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (event.currentTarget.textContent !== null) {
      const activityWordsInArray = event.currentTarget.textContent.split(' ');
      if (activityWordsInArray.length > 0) {
          const selectedActivity = capitalCaseByWords(activityWordsInArray);
          console.log(`selected--->${selectedActivity}<---`);
          console.log(`default--->${activityRef.current}<---`);
          // setActivity(selectedActivity);
          setActivity(selectedActivity);
          console.log(`after setting--->${activityRef.current}<---`);

          // const questions = getQuestions();
          console.log('selected questions-->', getQuestions());
          console.log('length-->', getQuestions().length > 0);
          const singleQuestionElement = getQuestions()[0];
          console.log('single question element');
          console.log(singleQuestionElement);
          console.log('own property--->');
          console.log(singleQuestionElement?.questions);

        // Flow-1
        if (singleQuestionElement?.questions === undefined) {
          console.log('this is flow -1');
          setQuestions(getQuestions());
          setNumber(number);
          setScreen('QUESTION');
        }

        // Flow-2
        if (singleQuestionElement?.questions !== undefined) {
          console.log('this is flow -2');
        }
        // setQuestions(getQuestions());
        // setNumber(number);
        // setScreen('QUESTION');
      }
    }
  };

  // eslint-disable-next-line
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

      {screen === 'HOME' && <Home heading={heading} activities={activities} selectActivity={selectActivity} />}

      {/* Flow-1 */}
      {screen === 'QUESTION' && questions?.questions === undefined && (
        <Questions
          activity={activity}
          number={number}
          question={questions[number]}
          callback={checkAnswer}
          buttonsArray={BUTTONS_ARRAY}
        />
      )}

      {/* Flow-2 */}
      {screen === 'QUESTION' && questions?.questions !== undefined && (
        <div>
          <h3>{questions[number].round_title}</h3>
          <Questions
            activity={activity}
            number={number}
            question={questions.questions[number]}
            callback={checkAnswer}
            buttonsArray={BUTTONS_ARRAY}
          />
        </div>
      )}

      {screen === 'SCORE' && <Score activity={activity} userAnswers={userAnswers} startOver={startOver} />}
    </>
  );
}

export default App;
