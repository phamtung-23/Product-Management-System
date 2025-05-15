import { useState } from 'react';
import { Button, Container, Typography } from '@mui/material';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Hello Vite + React + MUI + TypeScript!
      </Typography>
      <Button variant="contained" onClick={() => setCount(count + 1)}>
        Count: {count}
      </Button>
    </Container>
  );
}

export default App;
