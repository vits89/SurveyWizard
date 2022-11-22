import { memo, useState, FunctionComponent } from 'react';
import {
  ErrorMessage,
  Field,
  FieldArray,
  Form,
  Formik,
  getIn,
  FormikProps,
} from 'formik';
import { TextField } from 'formik-mui';
import * as Yup from 'yup';

import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  addQuestion,
  questionsSelector,
} from '../../features/questions/questionsSlice';

import { IQuestion, IQuestionOption, Question, QuestionOption } from './types';

type EditQuestionFormComponentProps = {
  questionId?: string;
  parentQuestionId?: string;
};

const questionOptionValidationSchema = Yup
  .object()
  .shape<Record<keyof IQuestionOption, Yup.AnySchema>>({
    id: Yup.string().trim().required(),
    text: Yup.string().trim().required(),
  });

const questionValidationSchema = Yup
  .object()
  .shape<Record<keyof IQuestion, Yup.AnySchema>>({
    id: Yup.string().trim().required(),
    text: Yup.string().trim().required(),
    options: Yup.array(questionOptionValidationSchema).min(2),
    parentQuestionId: Yup.string().optional(),
    parentQuestionOptionId: Yup
      .string()
      .when('parentQuestionId', {
        is: (value: string) => !value,
        then: schema => schema.trim().required(),
        otherwise: schema => schema.optional(),
      }),
    nestedQuestions: Yup.array<IQuestion>(),
  });

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
      const chosenQuestionOptionIds =
        questions.map(q => q.parentQuestionOptionId);

      parentQuestionOptionsFiltered = parentQuestion.options
        .filter(o => !chosenQuestionOptionIds.includes(o.id));

      question.parentQuestionId = parentQuestion.id;
      question.parentQuestionOptionId =
        parentQuestionOptionsFiltered.length > 0
          ? parentQuestionOptionsFiltered[0].id
          : undefined;
    }
  }

  return formShown ? (
    <Formik
      initialValues={question}
      validationSchema={questionValidationSchema}
      onSubmit={(values) => {
        showForm(false);
        dispatch(addQuestion(values));
      }}
    >
      {({ values, errors, touched, isSubmitting }: FormikProps<IQuestion>) => (
        <Box sx={{ maxWidth: { sm: 'sm' } }}>
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
                    name="parentQuestionOptionId"
                    label="Show when:"
                    margin="dense"
                    size="small"
                    error={
                      touched.parentQuestionOptionId
                        && errors.parentQuestionOptionId
                    }
                    helperText={
                      touched.parentQuestionOptionId
                        && errors.parentQuestionOptionId
                    }
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
              <Field
                component={TextField}
                name="text"
                margin="dense"
                placeholder="Enter question here."
                rows={4}
                error={touched.text && errors.text}
                helperText={touched.text && errors.text}
                multiline
                fullWidth
              />
              <Divider />
              <FieldArray name="options">
                {({ push, remove }) => (
                  <>
                    <List component="ol" sx={{ listStyleType: 'decimal' }}>
                      {values.options.map((o, i) => {
                        const fieldName = `options[${i}].text`,
                          fieldTouched: boolean =
                            getIn(touched, fieldName, false),
                          errorText: string = getIn(errors, fieldName, '');

                        return (
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
                                name={fieldName}
                                margin="dense"
                                size="small"
                                placeholder="Enter option details here."
                                error={fieldTouched && errorText}
                                helperText={fieldTouched && errorText}
                                fullWidth
                              />
                              <IconButton onClick={() => remove(i)}>
                                <CloseIcon />
                              </IconButton>
                            </Stack>
                          </ListItem>
                        );
                      })}
                    </List>
                    {typeof errors.options === 'string' && errors.options && (
                      <Typography
                        component="span"
                        sx={{ color: 'error.main' }}
                      >
                        <ErrorMessage name="options" />
                      </Typography>
                    )}
                    <Box>
                      <Button onClick={() => push(new QuestionOption())}>
                        <AddIcon fontSize="small" /> Add
                      </Button>
                    </Box>
                  </>
                )}
              </FieldArray>
            </Box>
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
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
        </Box>
      )}
    </Formik>
  ) : (!parentQuestionId || parentQuestionOptionsFiltered.length > 0) ? (
    <Button onClick={() => showForm(true)}>
      <AddIcon fontSize="small" /> {`Add${!!parentQuestionId ? ' nested' : ''}`}
    </Button>
  ) : null;
};

export default memo(EditQuestionForm);
