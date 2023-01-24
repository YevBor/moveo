import { useEffect, 
    useContext 
} from 'react';
import { AppContext 
} from '../../App';
import Canvas from '../canvas/Canvas';
import { categories, 
    generateWord 
} from '../../utilities/generateWords';
import {
  Container,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

const ChooseAndDraw = (props) => {
  const { turn } = useContext(AppContext).user;
  const {
    words,
    setWords,
    selectedWord,
    setSelectedWord,
    timer,
    setTimer,
    timerStart,
    SetTimerStart,
    guessTheWord,
    setGuessTheWord,
    score,
    setScore,
  } = props;
  const list = Object.entries(words);

  useEffect(() => {
    if (timerStart) {
      let seconds = 30;
      setTimer(seconds);
      const interval = setInterval(() => {
        if (seconds === 1) {
          clearInterval(interval);
          SetTimerStart(false);
        }
        seconds--;
        setTimer(seconds);
      }, 1000);
      return () => {
        clearInterval(interval);
        SetTimerStart(false);
      };
    }
  }, [timerStart, setTimer, SetTimerStart]);

  useEffect(() => {
    if (timer === 0) {
      setTimer('...');
    }
  }, [timer, setTimer]);

  useEffect(() => {
    setWords({
      easy: generateWord(categories.easy),
      medium: generateWord(categories.medium),
      hard: generateWord(categories.easy),
    });
  }, [setWords]);

  const startDraw = (e) => {
    setSelectedWord({
      word: e.target.innerText.toLowerCase(),
      points: e.target.dataset.points,
    });
    console.log(e.target.innerText.toLowerCase());
    console.log(e.target.dataset.points);
    SetTimerStart(true);
  };
  return (
    <>
      {turn === 1 && selectedWord.word === '' && guessTheWord.word === '' ? (
        <Container component="main" maxWidth="xs">
          <Typography component="h1" variant="4" align="center">
            Select you word
          </Typography>
          <List>
            {list.map((level) => (
              <ListItem key={level[0]}>
                <ListItemText sx={{ flex: 1 }} align="left">
                  {level[0]}
                </ListItemText>
                <Button
                  variant="contained"
                  data-points={level[1].points}
                  onClick={startDraw}
                  sx={{ borderRadius: 5 }}
                >
                  {level[1].word}
                </Button>
                <ListItemText align="right" sx={{ flex: 1 }}>
                  {level[1].points} points
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </Container>
      ) : (
        <Canvas
          selectedWord={selectedWord}
          setSelectedWord={setSelectedWord}
          timerStart={timerStart}
          SetTimerStart={SetTimerStart}
          timer={timer}
          setTimer={setTimer}
          guessTheWord={guessTheWord}
          setGuessTheWord={setGuessTheWord}
          score={score}
          setScore={setScore}
        />
      )}
    </>
  );
};

export default ChooseAndDraw;
