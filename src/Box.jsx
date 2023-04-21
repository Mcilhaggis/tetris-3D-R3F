import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Box(props) {
  const ref = useRef()

  const [selected, setSelected] = useState()
  const [movingLeft, setMovingLeft] = useState(false)
  const [movingRight, setMovingRight] = useState(false)
  const [movingDown, setMovingDown] = useState(false)
  const [locked, setIsLocked] = useState(false)


  // console.log('ref', ref.current)
  useFrame((_, delta) => {
    // If its sitting at the bottom of the board, restrict movement
    if (ref.current.position.y === 0.5) {
      setIsLocked(true)
    }
    // If space bar pressed, send all the way down.
    if (props.keyMap['Space'] && selected) {
      ref.current.position.y = 0.5
      props.updateState(ref.current.uuid, ref.current.position);

    }
    if (props.keyMap['KeyA'] && selected && !movingLeft && ref.current.position.x > -4.5 && !locked) {
      let newPosition = { ...ref.current.position }; // create a new object based on the current position
      newPosition.x -= 1; // modify the new object's x property
      let validMove = props.checkValidMove(ref.current.uuid, newPosition); //to check if its moving to an empty space
      if (validMove) {
        ref.current.position.x -= 1
        props.updateState(ref.current.uuid, ref.current.position);
        setMovingLeft(true)
      } else return

    } else if (!props.keyMap['KeyA'] && movingLeft) {
      setMovingLeft(false)
    }
    if (props.keyMap['KeyD'] && selected && !movingRight && ref.current.position.x < 4.5 && !locked) {
      let newPosition = { ...ref.current.position };
      newPosition.x += 1
      let validMove = props.checkValidMove(ref.current.uuid, newPosition);
      if (validMove) {
        ref.current.position.x += 1
        props.updateState(ref.current.uuid, ref.current.position);
        setMovingRight(true)
      } else return
    } else if ((!props.keyMap['KeyD'] && movingRight)) {
      setMovingRight(false)
    }
    if (props.keyMap['KeyS'] && selected && !movingDown && ref.current.position.y > 0.5 && !locked) {
      let newPosition = { ...ref.current.position };
      newPosition.y -= 1
      let validMove = props.checkValidMove(ref.current.uuid, newPosition);
      if (validMove) {
        ref.current.position.y -= 1
        props.updateState(ref.current.uuid, ref.current.position);
        setMovingDown(true)
      } else {
        setIsLocked(true)
        return
      }
    } else if ((!props.keyMap['KeyS'] && movingDown)) {
      setMovingDown(false)
    }

  })
  return (
    <mesh ref={ref} {...props} onPointerDown={() => setSelected(!selected)}>
      <boxGeometry />
      <meshBasicMaterial color={0x00ff00} wireframe={!selected} />
    </mesh>

  )
}