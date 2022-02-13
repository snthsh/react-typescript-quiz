import React from 'react';
// Styles
import { Wrapper, ButtonWrapper } from './Questions.styles';
import { capitalize } from '../../utils';

type Props = {
  activity: string;
  number: number;
  question: any;
  // eslint-disable-next-line no-unused-vars
  callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
  buttonsArray: string[];
};

// eslint-disable-next-line
const Questions: React.FC<Props> = ({
  activity,
  number,
  question,
  callback,
  buttonsArray
}) => (
  <Wrapper key={activity}>
    <h3
      dangerouslySetInnerHTML={{
        __html: question.roundTitle
          ? `${capitalize(activity)} / ${capitalize(question.roundTitle)}`
          : capitalize(activity)
      }}
    />
    <h1>{`Q${number + 1}.`}</h1>
    <p dangerouslySetInnerHTML={{ __html: question?.stimulus }} />
    <ButtonWrapper>
      {buttonsArray.map((button) => (
        <button type="button" key={button} value={button} onClick={callback}>
          <span dangerouslySetInnerHTML={{ __html: button }} />
        </button>
      ))}
    </ButtonWrapper>
  </Wrapper>
);

export default Questions;
