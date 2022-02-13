import React, { FC } from 'react';
import _ from 'lodash';
// Types
import { AnswerObject } from '../../types/Types';
// Styles
import Wrapper from './Score.styles';
//Constants
//import { ROUND } from '../../constants';

type Props = {
  activity: string;
  userAnswers: AnswerObject[];
  // eslint-disable-next-line no-unused-vars
  startOver: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const Score: FC<Props> = ({ activity, userAnswers, startOver }) => {
  const groupArrayByRounds = _.groupBy(
    userAnswers,
    (answer) => answer.round_title === 'Round 1'
  );
  console.log('groupArrayByRounds', groupArrayByRounds);
  return (
    <Wrapper>
      <h3 dangerouslySetInnerHTML={{ __html: activity }} />
      <h1>Results</h1>
      <ul>
        {userAnswers?.[0].round_title && <li key="ROUND 1">ROUND 1</li>}
        {_.map(groupArrayByRounds.true, (answer: any, index: number) => (
          <li key={answer.question}>
            <span>{`Q${index + 1}`}</span>
            <span>{answer.correct ? 'true' : 'false'}</span>
          </li>
        ))}
        {userAnswers?.[1].round_title && <li key="ROUND 2">ROUND 2</li>}
        {_.map(groupArrayByRounds.false, (answer: any, index: number) => (
          <li key={answer.question}>
            <span>{`Q${index + 1}`}</span>
            <span>{answer.correct ? 'true' : 'false'}</span>
          </li>
        ))}
      </ul>
      <button type="button" onClick={startOver}>
        Home
      </button>
    </Wrapper>
  );
};

export default Score;
