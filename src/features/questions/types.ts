import { nanoid } from '@reduxjs/toolkit';

export interface IQuestionOption {
  id: string;
  text: string;
}

export interface IQuestion {
  id: string;
  text: string;
  options: IQuestionOption[];
  parentQuestionId?: string;
  showWhenOptionChosen?: string;
  nestedQuestions: IQuestion[];
}

export class QuestionOption implements IQuestionOption {
  id = nanoid();
  text = '';
}

export class Question implements IQuestion {
  id = nanoid();
  text = '';
  options = [
    new QuestionOption(),
    new QuestionOption(),
  ];
  parentQuestionId = undefined;
  showWhenOptionChosen = undefined;
  nestedQuestions = [];
}
