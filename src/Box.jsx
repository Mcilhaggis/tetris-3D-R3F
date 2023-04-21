import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color } from 'three'

export default function Box(props) {
  const ref = useRef()

  const [selected, setSelected] = useState(true)
  const [movingLeft, setMovingLeft] = useState(false)
  const [movingRight, setMovingRight] = useState(false)
  const [movingDown, setMovingDown] = useState(false)
  const [locked, setIsLocked] = useState(false)
  const [count, setCount] = useState(0)
  const [color, setColor] = useState(new Color(Math.floor(Math.random() * 16777216)));

  

  const moveDown = () => {
    if (ref.current.position.y > 0.5 && !locked) {
      let newPosition = { ...ref.current.position };
      newPosition.y -= 1
      if (!locked) {
        let validMove = props.checkValidMove(ref.current.uuid, newPosition);
        if (validMove) {
          ref.current.position.y -= 1;
          props.updatePosState(ref.current.uuid, ref.current.position);
        } else {
          setIsLocked(true)
          return
        }
        if (ref.current.position.y <= 0.5) {
          ref.current.position.y = 0.5;
          setIsLocked(true);
          props.updatePosState(ref.current.uuid, ref.current.position);
        }
        setCount((count) => count + 1);
      }
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (!locked) {
        moveDown();
      }
    }, 1000);
    return () => clearInterval(timer);

  }, [locked]);


  useFrame((_, delta) => {

    if (ref.current.position.y <= 0.5) {
      setIsLocked(true)
      ref.current.position.y = 0.5;
    }

    // If its sitting at the bottom of the board, restrict movement
    if (ref.current.position.y === 0.5) {
      setIsLocked(true)
    }
    // If space bar pressed, send all the way down.
    if (props.keyMap['Space'] && selected) {
      ref.current.position.y = 0.5
      props.updatePosState(ref.current.uuid, ref.current.position);

    }
    // Moving negatively on x-axis (left)
    if (props.keyMap['KeyA'] && selected && !movingLeft && ref.current.position.x > -4.5 && !locked) {
      let newPosition = { ...ref.current.position }; // create a new object based on the current position
      newPosition.x -= 1; // modify the new object's x property
      let validMove = props.checkValidMove(ref.current.uuid, newPosition); //to check if its moving to an empty space
      if (validMove) {
        ref.current.position.x -= 1
        props.updatePosState(ref.current.uuid, ref.current.position);
        setMovingLeft(true)
      } else return

    } else if (!props.keyMap['KeyA'] && movingLeft) {
      setMovingLeft(false)
    }
    // Moving positively on x-axis (right)
    if (props.keyMap['KeyD'] && selected && !movingRight && ref.current.position.x < 4.5 && !locked) {
      let newPosition = { ...ref.current.position };
      newPosition.x += 1
      let validMove = props.checkValidMove(ref.current.uuid, newPosition);
      if (validMove) {
        ref.current.position.x += 1
        props.updatePosState(ref.current.uuid, ref.current.position);
        setMovingRight(true)
      } else return
    } else if ((!props.keyMap['KeyD'] && movingRight)) {
      setMovingRight(false)
    }
    // Moving negatively on y-axis (down)
    if (props.keyMap['KeyS'] && selected && !movingDown && ref.current.position.y > 0.5 && !locked) {
      let newPosition = { ...ref.current.position };
      newPosition.y -= 1
      let validMove = props.checkValidMove(ref.current.uuid, newPosition);
      if (validMove) {
        ref.current.position.y -= 1
        props.updatePosState(ref.current.uuid, ref.current.position);
        setMovingDown(true)
      } else {
        setIsLocked(true)
        return
      }
    } else if ((!props.keyMap['KeyS'] && movingDown)) {
      setMovingDown(false)
    }
  })

  useEffect(() => {
    if (locked) {
      console.log(locked)
      props.updateBlockInPlay(false)
    }
  }, [locked])

  return (
    <mesh ref={ref} {...props}>
      <boxGeometry />
      <meshBasicMaterial color={color} wireframe={!locked} />
    </mesh>

  )
}

