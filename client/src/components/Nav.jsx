import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App';
import { notifyError } from '../utilities/toastNotifyFunc';
import { Typography, AppBar, Toolbar, Grid } from '@mui/material';

const Nav = (props) => {
  const { selectedWord, timer, score, opponentScore, setOpponentScore } = props;
  const { username, setUsername } = useContext(AppContext).user;
  const [opponent, setOpponent] = useState('...');
  const socket = useContext(AppContext).socket;

  useEffect(() => {
    // get opponent
    socket.on('opponentInfo', (opponent) => {
      setOpponent(opponent);
    });
    socket.on('opponentScore', (opponentScore) => {
      setOpponentScore(opponentScore);
    });
    return () => {
      socket.removeListener('opponentInfo');
      socket.removeListener('opponentScore');
    };
  }, [socket, setOpponentScore]);

  useEffect(() => {
    // notify other player when leaving
    socket.on('leavingPlayer', (leavingPlayer) => {
      notifyError(`${leavingPlayer} has left`);
      setUsername(undefined);
      // end game logic
    });
    return () => {
      socket.removeAllListeners();
    };
  }, [socket, setUsername]);

  return (
    <AppBar position="static" size="sm" sx={{ mb: 10, borderRadius: 7 }}>
      <Toolbar>
        <Grid container alignItems="center">
          <Grid item xs={3}>
            <Typography variant="h5" align="right">
              {username}
            </Typography>
            <Typography variant="h6" align="right">
              {score}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" align="center">
              Time left: {timer}
            </Typography>
            <Typography variant="h6" align="center">
              You word is{' '}
              {selectedWord.word === '' ? ' ...' : selectedWord.word}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h5" align="left">
              {opponent}
            </Typography>
            <Typography variant="h6" align="left">
              {opponentScore}
            </Typography>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Nav;
