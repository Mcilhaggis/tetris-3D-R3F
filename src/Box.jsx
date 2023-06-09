import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Box(props) {
  const ref = useRef()
  const [selected, setSelected] = useState()
  const [movingLeft, setMovingLeft] = useState(false)
  const [movingRight, setMovingRight] = useState(false)
  const [movingDown, setMovingDown] = useState(false)

  useFrame((_, delta) => {
    // If space bar pressed, send all the way down.
    if (props.keyMap['Space'] && selected) {
      ref.current.position.y = 0.5
    }
    if (props.keyMap['KeyA'] && selected && !movingLeft && ref.current.position.x > -4.5) {
      ref.current.position.x -= 1
      setMovingLeft(true)
    } else if (!props.keyMap['KeyA'] && movingLeft) {
      setMovingLeft(false)
    }
    if (props.keyMap['KeyD'] && selected && !movingRight && ref.current.position.x < 4.5) {
      ref.current.position.x += 1
      setMovingRight(true)
    } else if ((!props.keyMap['KeyD'] && movingRight)) {
      setMovingRight(false)
    }
    if (props.keyMap['KeyS'] && selected && !movingDown && ref.current.position.y > 0.5) {
      ref.current.position.y -= 1
      setMovingDown(true)
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