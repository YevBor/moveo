import { useEffect, useRef, useState, useContext } from 'react';
import { AppContext } from '../App';
import Controls from './Controls';

import { Container, Button } from '@mui/material';

const Canvas = (props) => {
  const {
    selectedWord,
    setSelectedWord,
    timerStart,
    SetTimerStart,
    timer,
    setTimer,
    guessTheWord,
    setGuessTheWord,
    score,
    setScore,
  } = props;

  const { turn } = useContext(AppContext).user;

  const { roomNo, setTurn } = useContext(AppContext).user;
  const socket = useContext(AppContext).socket;
  const [isDrawing, setIsDrawing] = useState(false);
  const [position, setPosition] = useState({ x: undefined, y: undefined });
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    // initial setting for the context
    context.lineCap = 'round'; //round endings for the lines
    context.strokeStyle = 'black'; //initial color of the pen
    window.innerWidth > 425 ? (context.lineWidth = 6) : (context.lineWidth = 3); //pen width
    contextRef.current = context;
  });

  useEffect(() => {
    const { imgData } = guessTheWord;
    if (imgData !== '') {
      let myImage = new Image();
      myImage.src = imgData;
      myImage.onload = () => {
        contextRef.current.drawImage(myImage, 0, 0);
      };
      SetTimerStart(true);
    }
  }, [guessTheWord, SetTimerStart]);

  // mousedown || touchstart
  const startDrawing = (e) => {
    contextRef.current.beginPath();
    setIsDrawing(true);
  };
  // mouseup && mouseleave || touchend && touchcancel
  const finishDrawing = () => {
    contextRef.current.closePath();
    setPosition({ x: undefined, y: undefined });
    setIsDrawing(false);
  };
  // mousemove || touchmove
  const draw = (e) => {
    if (!isDrawing) {
      return;
    }
    //mobile
    if (e.nativeEvent.touches) {
      // e.preventDefault();
      const rect = e.target.getBoundingClientRect();
      const x = e.targetTouches[0].pageX - rect.left;
      const y = e.targetTouches[0].pageY - rect.top;
      setPosition({ x, y });
    }
    //desktop
    else {
      setPosition({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    }
    contextRef.current.lineTo(position.x, position.y);
    contextRef.current.stroke();
  };
  //clear canvas
  const clear = () => {
    contextRef.current.clearRect(
      0,
      0,
      contextRef.current.canvas.width,
      contextRef.current.canvas.height
    );
  };
  const send = () => {
    const dataURL = canvasRef.current.toDataURL();
    socket.emit('image', { dataURL, roomNo, selectedWord });
    SetTimerStart(false);
    setTimer('...');
    setSelectedWord({ word: '' });
    setTurn(2);
  };
  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        mt: 10,
        p: 2,
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        borderRadius: 5,
      }}
      elevation={3}
    >
      {console.log(turn)}
      <canvas
        width={400}
        height={300}
        className={'canvas' + (!timerStart ? ' deactivated' : '')}
        ref={canvasRef}
        onMouseDown={startDrawing}
        onTouchStart={startDrawing}
        onMouseUp={finishDrawing}
        onTouchEnd={finishDrawing}
        onMouseLeave={finishDrawing}
        onTouchCancel={finishDrawing}
        onMouseMove={draw}
        onTouchMove={draw}
      />

      {guessTheWord.word === '' ? (
        <Button id="send" onClick={send} sx={{ borderRadius: 5 }}>
          Send
        </Button>
      ) : (
        ''
      )}

      <Controls
        guessTheWord={guessTheWord}
        setGuessTheWord={setGuessTheWord}
        score={score}
        setScore={setScore}
        timerStart={timerStart}
        SetTimerStart={SetTimerStart}
        timer={timer}
        setTimer={setTimer}
      />
    </Container>
  );
};

export default Canvas;
