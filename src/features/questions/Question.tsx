import { FunctionComponent } from 'react';

import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  Paper,
  Typography,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

import EditQuestionForm from './EditQuestionForm';
import QuestionsList from './QuestionsList';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  removeQuestion,
  questionsSelector,
} from '../../features/questions/questionsSlice';

import { IQuestion, IQuestionOption } from './types';

type QuestionComponentProps = {
  question: IQuestion;
};

const Question: FunctionComponent<QuestionComponentProps> = ({
  question,
}) => {
  let showWhenOptionChosen: IQuestionOption | undefined;

  const dispatch = useAppDispatch();
  const questions = useAppSelector(questionsSelector);

  if (question.parentQuestionId) {
    const parentQuestion =
      questions.find(q => q.id === question.parentQuestionId);

    if (parentQuestion) {
      showWhenOptionChosen = parentQuestion.options
        .find(o => o.id === question.showWhenOptionChosen);
    }
  }

  return (
    <Box>
      <Paper variant="outlined" square>
        {showWhenOptionChosen && (
          <Box sx={{
            backgroundColor: 'info.light',
            borderBottom: 1,
            borderColor: 'grey.300',
            color: 'info.contrastText',
            padding: 1,
          }}>
            <Typography>{showWhenOptionChosen.text}</Typography>
          </Box>
        )}
        <Box sx={{ padding: 1 }}>
          <Typography>{question.text}</Typography>
          <Divider />
          <List component="ol" sx={{ listStyleType: 'decimal' }}>
            {question.options.map(o => (
              <ListItem
                sx={{
                  display: 'list-item',
                  marginLeft: 2.5,
                  paddingX: 0,
                  width: 'unset',
                }}
                key={o.id}
              >
                {o.text}
              </ListItem>
            ))}
          </List>
          <Box sx={{ textAlign: 'end' }}>
            <Button
              color="error"
              onClick={() => dispatch(removeQuestion(question))}
            >
              <CloseIcon fontSize="small" /> Delete
            </Button>
          </Box>
        </Box>
      </Paper>
      <Box sx={{
        marginLeft: 4,
        marginTop: 1,
      }}>
        <EditQuestionForm parentQuestionId={question.id} />
        {question.nestedQuestions.length > 0 && (
          <QuestionsList parentQuestionId={question.id} />
        )}
      </Box>
    </Box>
  );
};

export default Question;
