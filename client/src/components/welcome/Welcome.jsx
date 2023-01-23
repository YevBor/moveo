import { useState, useContext } from 'react';
import { AppContext } from '../../App';
import { notifySorry } from '../../utilities/toastNotifyFunc';
import { TextField, Box, Container, Card, Button, Typography } from '@mui/material';
// import './welcome.scss';


const Welcome = () => {
    const { setUsername, setTurn, setRoomNo } = useContext(AppContext).user;
    const { socket } = useContext(AppContext);
    // const { setTurn } = useContext(AppContext).room;
    const [input, changeInput] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        // send event to the server
        if (input === '') return;
        socket?.emit('newPlayer', { username: input, socketId: socket.id });
        // get event from the server
        socket.on('notifyPlayer', data => {
            if (!data.msg.status) {
                // error, may not enter - username taken
                notifySorry(data.msg.text);
                // setUsername('');
            } else {
                // success, may enter - username does not exist
                setUsername(input);
                setRoomNo(data.roomNo);
                setTurn(data.turn);
                console.log(input, 'roomNo:', data.roomNo, 'turn:', data.turn);
            }
        });
    }
    return (
        <Container component="main" maxWidth="xs" sx={{mt:10,p:3, boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',borderRadius: 5 }} elevation={3}>
            <Typography component="h1" variant="h3" align="center">
                Draw & Guess
            </Typography>
            <Box component="form" onClick={handleSubmit} align="center" m={2}>
                <TextField type='text'
                    placeholder='Enter your name'
                    name='name'
                    fullWidth
                    size="small"
                    onChange={e => changeInput(e.target.value)} />
                <Button  variant="contained" fullWidth sx={{mt:2}}>Enter</Button>
            </Box>
        </Container>
    )
}

export default Welcome;