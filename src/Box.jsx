import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color } from 'three'

export default function Box(props) {
  const ref = useRef()
  console.log(ref.current)
  const [selected, setSelected] = useState(true)
  const [movingLeft, setMovingLeft] = useState(false)
  const [movingRight, setMovingRight] = useState(false)
  const [movingDown, setMovingDown] = useState(false)
  const [locked, setIsLocked] = useState(false)
  const [count, setCount] = useState(0)
  const [color, setColor] = useState(new Color(Math.floor(Math.random() * 16777216)));
  // console.log(count, setColor, setSelected)

  useEffect(() => {
    if (props.reducedPosStoreLength) {
      for (var i = 0; i < props.posStore.length; i++) {
        if (props.posStore[i].id === ref.current.uuid) {
          ref.current.position.x = props.posStore[i].x
          ref.current.position.y = props.posStore[i].y
          ref.current.position.z = props.posStore[i].z
          props.updateBlockInPlay(false)
        }
      }
    }
  }, [props.reducedPosStoreLength]);


  const moveDown = () => {
    console.log('ref.current', ref.current, props.posState)
    if (ref.current.position.y > 0.5 && !locked) {
      let newPosition = { ...ref.current.position };
      newPosition.y -= 1
      if (!locked) {
        let validMove = props.checkValidMove(ref.current.uuid, newPosition);
        if (validMove) {
          ref.current.position.y -= 1;
          props.updatePosState(ref.current.uuid, ref.current.position, ref.current.uuid);
        } else {
          setIsLocked(true)
          props.updatePosState(ref.current.uuid, ref.current.position, ref.current.uuid);

          return
        }
        if (ref.current.position.y <= 0.5) {
          ref.current.position.y = 0.5;
          setIsLocked(true);
          props.updatePosState(ref.current.uuid, ref.current.position, ref.current.uuid);
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
      props.updatePosState(ref.current.uuid, ref.current.position, ref.current.uuid);

    }
    // Moving negatively on x-axis (left)
    if (props.keyMap['KeyA'] && selected && !movingLeft && ref.current.position.x > -4.5 && !locked) {
      let newPosition = { ...ref.current.position }; // create a new object based on the current position
      newPosition.x -= 1; // modify the new object's x property
      let validMove = props.checkValidMove(ref.current.uuid, newPosition); //to check if its moving to an empty space
      if (validMove) {
        ref.current.position.x -= 1
        props.updatePosState(ref.current.uuid, ref.current.position, ref.current.uuid);
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
        props.updatePosState(ref.current.uuid, ref.current.position, ref.current.uuid);
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
        props.updatePosState(ref.current.uuid, ref.current.position, ref.current.uuid);
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
      props.updateBlockInPlay(false)
      props.updateLockedState(ref.current.uuid, locked)
    }
  }, [locked])


  return (
    <mesh ref={ref} {...props}>
      <boxGeometry />
      <meshBasicMaterial color={color} wireframe={!locked} />
    </mesh>

  )
}

