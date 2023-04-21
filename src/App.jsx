import { Canvas } from '@react-three/fiber'
import Box from './Box'
import { Stats, OrbitControls } from '@react-three/drei'
import useKeyboard from './usekeyboard'
import { useState } from 'react'

export default function App() {
  const keyMap = useKeyboard()
  const pos = [-1.5, 5.5, 0.5]
  const [posStore, setPosStore] = useState([])

  const removePreviousPos = (newStateID) => {
    let updatedArray = posStore.filter((item) => item.id !== newStateID)
    setPosStore(updatedArray)
    }
  


  function checkExistance(newPosition) {
    console.log(posStore)
    if (posStore.find(item => item.x === newPosition.x && item.y === newPosition.y && item.y === newPosition.y)) {
      console.log('match found')
      return true;
    }
  }

  const updateState = (newStateID, newState) => {
    let objPos = { id: newStateID, x: newState.x, y: newState.y, z: newState.z };
    removePreviousPos(newStateID)
    if (checkExistance(objPos)) {d
      console.log('stop movement')
    } else {
      console.log('store it')
      setPosStore((prevState) => [...prevState, objPos]);
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