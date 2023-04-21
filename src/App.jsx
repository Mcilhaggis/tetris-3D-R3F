import { Canvas } from '@react-three/fiber'
import Box from './Box'
import { Stats, OrbitControls } from '@react-three/drei'
import useKeyboard from './usekeyboard'
import { useState } from 'react'

export default function App() {
  const keyMap = useKeyboard()
  const pos = [-1.5, 5.5, 0.5]
  const [posStore, setPostStore] = useState([])

  function checkExistance(newPosition) {
    if (posStore.find(item => item.x === newPosition.x && item.y === newPosition.y && item.y === newPosition.y)) {
      console.log('match found')
      return true;
    }
  }

  const updateState = (newState) => {
    let objPos = { x: newState.x, y: newState.y, z: newState.z };

    console.log(newState)
    if (checkExistance(objPos)) {
      console.log('stop movement')
    } else {
      console.log('store it')
      setPostStore((prevState) => [...prevState, objPos]);
    }
  };

  return (
    <Canvas camera={{ position: [3, 6, 8] }} >
      {[...Array(4)].map((x, index) => (
        <Box position={[pos[0] + index, pos[1], pos[2]]} updateState={updateState} key={index} keyMap={keyMap} />
      ))}
      <OrbitControls maxPolarAngle={Math.PI / 2} />
      <axesHelper args={[5]} />
      <gridHelper />
      <Stats />

    </Canvas>
  )
}