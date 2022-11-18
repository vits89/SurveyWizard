import { memo, FunctionComponent } from 'react';

import { List, ListItem } from '@mui/material';

import Question from './Question';

import { useAppSelector } from '../../app/hooks';
import { questionsSelector } from '../../features/questions/questionsSlice';

import { IQuestion } from './types';

type QuestionsListComponentProps = {
  parentQuestionId?: string;
};

const QuestionsList: FunctionComponent<QuestionsListComponentProps> = ({
  parentQuestionId,
}) => {
  const questions = useAppSelector(questionsSelector);

  const predicate = parentQuestionId
    ? (q: IQuestion) => q.parentQuestionId === parentQuestionId
    : (q: IQuestion) => !q.parentQuestionId;

  const questionsFiltered = questions.filter(predicate);

  return (
    <List>
      {questionsFiltered.length > 0 &&
        questionsFiltered.map(q => (
          <ListItem
            sx={{
              display: 'list-item',
              paddingX: 0,
              width: 'unset',
            }}
            key={q.id}
          >
            <Question question={q} />
          </ListItem>
        ))
      }
    </List>
  );
};

export default memo(QuestionsList);
