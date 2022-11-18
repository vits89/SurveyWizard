import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

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
  },
});

export const { addQuestion } = questionsSlice.actions;

export const questionsSelector = (state: RootState) => state.questions.questions;

export default questionsSlice.reducer;
