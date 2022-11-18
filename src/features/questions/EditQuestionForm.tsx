import { memo, useState, FunctionComponent } from 'react';
import { Field, FieldArray, Form, Formik, FormikProps } from 'formik';
import { TextField } from 'formik-mui';

import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  addQuestion,
  questionsSelector
} from '../../features/questions/questionsSlice';

import { IQuestion, IQuestionOption, Question, QuestionOption } from './types';

type EditQuestionFormComponentProps = {
  questionId?: string;
  parentQuestionId?: string;
};

const EditQuestionForm: FunctionComponent<EditQuestionFormComponentProps> = ({
  questionId,
  parentQuestionId,
}) => {
  let parentQuestionOptionsFiltered: IQuestionOption[] = [];

  const [formShown, showForm] = useState(false);

  const dispatch = useAppDispatch();
  const questions = useAppSelector(questionsSelector);

  const question =
    (questionId && questions.find(q => q.id === questionId)) || new Question();

  if (parentQuestionId) {
    const parentQuestion = questions.find(q => q.id === parentQuestionId);

    if (parentQuestion) {
      const questionOptionsChosen = questions.map(q => q.showWhenOptionChosen);

      parentQuestionOptionsFiltered = parentQuestion.options
        .filter(o => !questionOptionsChosen.includes(o.id));

      question.parentQuestionId = parentQuestionId;
      question.showWhenOptionChosen = parentQuestionOptionsFiltered.length > 0
        ? parentQuestionOptionsFiltered[0].id
        : '';
    }
  }

  return formShown ? (
    <Formik
      initialValues={question}
      onSubmit={(values) => {
        showForm(false);
        dispatch(addQuestion(values));
      }}
    >
      {({ values, isSubmitting }: FormikProps<IQuestion>) => (
        <Form>
          <Box sx={{
            border: 1,
            borderColor: 'grey.300',
            marginBottom: 1,
            padding: 1,
          }}>
            <Field type="hidden" name="parentQuestionId" />
            {parentQuestionOptionsFiltered.length > 0 && (
              <>
                <Field
                  component={TextField}
                  name="showWhenOptionChosen"
                  label="Show when:"
                  margin="dense"
                  size="small"
                  select
                  fullWidth
                >
                  {parentQuestionOptionsFiltered.map(o => (
                    <MenuItem value={o.id} key={o.id}>{o.text}</MenuItem>
                  ))}
                </Field>
                <Divider />
              </>
            )}
            <Box sx={{
              marginBottom: 0.5,
              marginTop: 1,
              width: 1,
            }}>
              <Field
                as="textarea"
                name="text"
                placeholder="Enter question here."
                rows="4"
                style={{ width: '100%' }}
              />
            </Box>
            <Divider />
            <FieldArray name="options">
              {({ push, remove }) => (
                <>
                  <List component="ol" sx={{ listStyleType: 'decimal' }}>
                    {values.options.map((o, i) => (
                      <ListItem sx={{
                          display: 'list-item',
                          marginLeft: 2.5,
                          padding: 0,
                          width: 'unset',
                        }}
                        key={o.id}
                      >
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ alignItems: 'center' }}
                        >
                          <Field
                            component={TextField}
                            name={`options[${i}].text`}
                            margin="dense"
                            size="small"
                            placeholder="Enter option details here."
                          />
                          <IconButton onClick={() => remove(i)}>
                            <CloseIcon />
                          </IconButton>
                        </Stack>
                      </ListItem>
                    ))}
                  </List>
                  <Box>
                    <Button onClick={() => push(new QuestionOption())}>
                      + Add
                    </Button>
                  </Box>
                </>
              )}
            </FieldArray>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={() => showForm(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              color="error"
              variant="contained"
              disabled={isSubmitting}
              disableElevation
            >
              Save
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  ) : (!parentQuestionId || parentQuestionOptionsFiltered.length > 0) ? (
    <Button onClick={() => showForm(true)}>
      {`+ Add${!!parentQuestionId ? ' nested' : ''}`}
    </Button>
  ) : null;
};

export default memo(EditQuestionForm);
