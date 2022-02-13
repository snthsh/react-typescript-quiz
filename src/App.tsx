import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import axios from 'axios';
// Constants
import { BUTTONS_ARRAY } from './constants';
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
      .then(() => {
        // console.error('error--->', error);
      });
    setLoading(false);
  }, []);

  // restrict all handleClicks to be exclusively on HTMLButton elements
  const checkAnswer = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log('---------------->>>>--------->>>>', number);
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
      setUserAnswers((prev: any) => [...prev, answerObject]);
      console.log(
        `number-->${number + 1}---questions.length--->${questions.length}`
      );
      if ((number+1) < questions.length) {
        console.log(`setting-->${number + 1}`);
        setNumber(number + 1);
      }
      
      if ((number + 1) === questions.length) {
        console.log('setting-->0');
        setScreen('SCORE');
        setGameOver(true);
        setNumber(0);
      }
    }
  };

  const getQuestions = (activity: string) => {
    console.log(
      'here in activity-->' +
        activity +
        '--activityRef.current-->' +
        activityRef.current
    );
    if (activityRef.current === 'Activity One') {
      console.log('HERE!!!!!!!! - One');
      const activityArray = _.filter(quizData.activities, {
        activity_name: activityRef.current
      });
      return activityArray[0].questions;
    }
    if (activityRef.current === 'Activity Two') {
      console.log('HERE!!!!!!!! - Two');
      const activityArray = _.filter(quizData.activities, {
        activity_name: activityRef.current
      });

      const outerQuestions = activityArray[0].questions;
      const flattenedQuestions:any[] = [];
      _.map(outerQuestions, (outerQuestion) => {
        const roundTitle = outerQuestion.round_title;
        const order = outerQuestion.order;
        _.map(outerQuestion.questions, (question) => {
          flattenedQuestions.push({ ...question, roundTitle, order });
        });
      });

      console.log('flattenedQuestions--->');
      console.log(flattenedQuestions);
      return flattenedQuestions;
    }
    
    // return the filtered array's first element (as there're only two activity elements)
    // return sortArray(activityArray[0].questions);
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
        // console.log('selected questions-->', getQuestions());
        // console.log('length-->', getQuestions().length > 0);
        const singleQuestionElement = getQuestions(activity)[0];
        // console.log('single question element');
        // console.log(singleQuestionElement);
        // console.log('own property--->');
        // console.log(singleQuestionElement?.questions);

        // Flow-1
        if (singleQuestionElement?.questions === undefined) {
          console.log('this is flow -1');
          setQuestions(getQuestions(activity));
          setNumber(number);
          setScreen('QUESTION');
        }

        // Flow-2
        if (singleQuestionElement?.questions !== undefined) {
          console.log('this is flow -2');
          setQuestions(getQuestions(activity));
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
      {/* Flow-1 */}
      {/* eslint-disable-next-line */}
      {screen === 'QUESTION' && activity === 'Activity One' && (
          <>
            <div>santhosh1</div>
            <Questions
              activity={activity}
              number={number}
              question={questions[number]}
              callback={checkAnswer}
              buttonsArray={BUTTONS_ARRAY}
            />
          </>
        )}
      {/* Flow-2 */}
      {screen === 'QUESTION' && activity === 'Activity Two' && (
          <>
            <div>santhosh2</div>
            <Questions
              activity={activity}
              number={number}
              question={questions[number]}
              callback={checkAnswer}
              buttonsArray={BUTTONS_ARRAY}
            />
          </>
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
