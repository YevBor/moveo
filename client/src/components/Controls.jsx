import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { notifySuccess, notifySorry } from '../utilities/toastNotifyFunc';

import { Button, Box, TextField } from '@mui/material';

const Controls = (props) => {
  const {
    guessTheWord,
    setGuessTheWord,
    score,
    setScore,
    timerStart,
    SetTimerStart,
    timer,
    setTimer,
  } = props;
  const { socket } = useContext(AppContext);
  const { roomNo, username, setUsername, setRoomNo, setTurn } =
    useContext(AppContext).user;
  const [input, changeInput] = useState('');

  useEffect(() => {
    if (timerStart && guessTheWord.word !== '') {
      let seconds = 30;
      setTimer(seconds);
      const interval = setInterval(() => {
        if (seconds === 1) {
          clearInterval(interval);
          SetTimerStart(false);
          setGuessTheWord({ word: '' });
        }
        seconds--;
        setTimer(seconds);
      }, 1000);
      return () => {
        clearInterval(interval);
        SetTimerStart(false);
        setGuessTheWord({ word: '' });
      };
    }
  }, [timerStart, setTimer, SetTimerStart, guessTheWord.word, setGuessTheWord]);

  useEffect(() => {
    if (timer === 0) {
      setTimer('...');
    }
  }, [timer, setTimer]);

  // send the score to the server each time it updates so the oppponent will know
  useEffect(() => {
    socket.emit('updateScore', { score, roomNo });
    return () => {
      socket.removeListener('updateScore');
    };
  }, [score, roomNo, socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // when guessed right update the score, send it to server, update state
    if (guessTheWord.word === input.toLowerCase()) {
      notifySuccess('Good job!');
      setScore((s) => Number(score) + Number(guessTheWord.points));
      setGuessTheWord({ word: '' });
      SetTimerStart(false);
      setTimer('...');
    } else {
      changeInput('');
      notifySorry('Sorry, wrong answer');
    }
  };
  const leaveGame = () => {
    // notify the other player when leaving
    socket.emit('leaveGame', { username, roomNo });
    // reset state
    setUsername(undefined);
    setRoomNo(undefined);
    setTurn(undefined);
    setGuessTheWord({ word: '', imgData: '' });
    // remove all socket io listeners to prevent memory leak when components unmount
    socket.removeAllListeners();
    window.location.reload(false);
  };
  return (
    <Box>
      <Box component="form" onSubmit={handleSubmit}>
        {guessTheWord.word === '' ? (
          ''
        ) : (
          <Box>
            <TextField
              size="small"
              value={input}
              onChange={(e) => changeInput(e.target.value)}
              placeholder="guess the word"
            />
            <Button onClick={handleSubmit} variant="contained">
              Enter
            </Button>
          </Box>
        )}
      </Box>
      <Button onClick={leaveGame}>exit</Button>
    </Box>
  );
};

export default Controls;
