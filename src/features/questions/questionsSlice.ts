import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../../app/store';

import { IQuestion } from './types';

interface IQuestionsState {
  questions: IQuestion[];
}

const initialState: IQuestionsState = {
  questions: [],
};

export const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    addQuestion: (state, action: PayloadAction<IQuestion>) => {
      const question = action.payload;

      if (question.parentQuestionId) {
        const index =
          state.questions.findIndex(q => q.id === question.parentQuestionId);

        if (index >= 0) {
          state.questions.push(question);

          state.questions[index].nestedQuestions.push(question);
        } else {
          console.error(
            `Question with ID ${question.parentQuestionId} not found.`);
        }
      } else {
        state.questions.push(question);
      }
    },
    removeQuestion: (state, action: PayloadAction<IQuestion>) => {
      const removeQuestion = (question: IQuestion): void => {
        question.nestedQuestions.forEach((q) => {
          removeQuestion(q);
        });

        const index = state.questions.findIndex(q => q.id === question.id);

        if (index >= 0) {
          state.questions.splice(index, 1);
        } else {
          console.error(`Question with ID ${question.id} not found.`);
        }
      };

      removeQuestion(action.payload);
    },
  },
});

export const { addQuestion, removeQuestion } = questionsSlice.actions;

export const questionsSelector = (state: RootState) => state.questions.questions;

export default questionsSlice.reducer;
