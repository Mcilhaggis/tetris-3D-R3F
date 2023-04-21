import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Box(props) {
  const ref = useRef()

  const [selected, setSelected] = useState()
  const [movingLeft, setMovingLeft] = useState(false)
  const [movingRight, setMovingRight] = useState(false)
  const [movingDown, setMovingDown] = useState(false)
  const [locked, setIsLocked] = useState(false)
  console.log(props)
  useFrame((_, delta) => {
    // If its sitting at the bottom of the board, restrict movement
    if (ref.current.position.y === 0.5) {
      setIsLocked(true)
    }
    // If space bar pressed, send all the way down.
    if (props.keyMap['Space'] && selected) {
      ref.current.position.y = 0.5
    }
    if (props.keyMap['KeyA'] && selected && !movingLeft && ref.current.position.x > -4.5 && !locked) {
      ref.current.position.x -= 1
      setMovingLeft(true)
      props.updateState(ref.current.position);

    } else if (!props.keyMap['KeyA'] && movingLeft) {
      setMovingLeft(false)
    }
    if (props.keyMap['KeyD'] && selected && !movingRight && ref.current.position.x < 4.5 && !locked) {
      ref.current.position.x += 1
      setMovingRight(true)
      props.updateState(ref.current.position);

    } else if ((!props.keyMap['KeyD'] && movingRight)) {
      setMovingRight(false)
    }
    if (props.keyMap['KeyS'] && selected && !movingDown && ref.current.position.y > 0.5 && !locked) {
      ref.current.position.y -= 1
      setMovingDown(true)
      props.updateState(ref.current.position);
      // props.updatePosStore(ref.current.position)
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