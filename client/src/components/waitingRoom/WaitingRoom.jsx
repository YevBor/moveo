import { useContext, useEffect } from 'react';
import { AppContext } from '../../App';
import { Paper,Container, Typography,LinearProgress} from '@mui/material';

const WaitingRoom = ({ startGame, setGuessTheWord }) => {

    const { setTurn } = useContext(AppContext).user;
    const socket = useContext(AppContext).socket;

    useEffect(() => {
        // get the image to start guessing
        socket.on('guessTheWord', ({ dataURL, selectedWord }) => {
            setGuessTheWord({ imgData: dataURL, word: selectedWord.word, points: selectedWord.points });
            setTurn(1);
        });
        return () => {
            socket.removeListener('guessTheWord');
        }
    }, [socket, setTurn, setGuessTheWord]);
    let message = '';
    if (!startGame) {
        message = 'Waiting for other player'
    } else {
        message = 'Your turn starts soon';
    }
    return (
        <Container 
        maxWidth="xs"
        sx={{
          mt: 10,
          p: 2,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          borderRadius: 5,
        }}
        elevation={3} className='waiting-room'>
            <Typography component="h2" variant="h4" align='center'>{message}</Typography>
            <LinearProgress />
        </Container>
    )
}

export default WaitingRoom;