import { FunctionComponent } from 'react';

import { Container, Typography } from '@mui/material';

import EditQuestionForm from './features/questions/EditQuestionForm';
import QuestionsList from './features/questions/QuestionsList';

const App: FunctionComponent = () => (
  <Container sx={{
    paddingY: {
      xs: 1,
      sm: 2,
    },
  }}>
    <Typography component="h1" variant="h3">Survey Wizard</Typography>
    <QuestionsList/>
    <EditQuestionForm />
  </Container>
);

export default App;
