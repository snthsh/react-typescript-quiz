import React from 'react';
import { capitalize } from '../../utils';
// Styles
import Wrapper from './Home.styles';
// Types
import { ActivityObject } from '../../types/Types';

type Props = {
  heading: string;
  activities: ActivityObject[];
  // eslint-disable-next-line no-unused-vars
  selectActivity: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

// eslint-disable-next-line
const HomeScreen: React.FC<Props> = ({
  heading,
  activities,
  selectActivity,
}) => (
  <Wrapper>
    <h1>{heading}</h1>
    <ul>
      {activities
        && activities.map((activity: ActivityObject) => (
          <li key={activity.activity_name}>
            {
              // eslint-disable-next-line
            }
            <button
              type="button"
              aria-label={activity.activity_name}
              onClick={selectActivity}
              dangerouslySetInnerHTML={{
                __html: capitalize(activity.activity_name),
              }}
            />
          </li>
        ))}
    </ul>
  </Wrapper>
);

export default HomeScreen;
