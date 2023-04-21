import { Canvas } from '@react-three/fiber'
import Box from './Box'
import { Stats, OrbitControls } from '@react-three/drei'
import useKeyboard from './usekeyboard'
import { useState } from 'react'

export default function App() {
  const keyMap = useKeyboard()
  const pos = [-1.5, 5.5, 0.5]
  const [posStore, setPosStore] = useState([])

  const checkValidMove = (newStateID, newState) => {
    const existingItem = posStore.find(item => item.id !== newStateID && item.x === newState.x && item.y === newState.y);
    if (existingItem) {
      console.log('Error: block already exists with the same x and y values');
      return false;
    } else return true;
  }
  const updateState = (newStateID, newState) => {

    const updateArr = posStore.map(item => {
      if (item.id === newStateID) {
        return {
          ...item,
          x: newState.x,
          y: newState.y
        }
      } else {
        return item;
      }
    })
    const newItem = { id: newStateID, x: newState.x, y: newState.y, z: newState.z };
    if (!updateArr.some(item => item.id === newStateID)) {
      updateArr.push(newItem);
    }
    setPosStore(updateArr)
    return true;
  }
  return (
    <Canvas camera={{ position: [3, 6, 8] }} >
      {[...Array(1)].map((x, index) => (
        <Box position={[pos[0] + index, pos[1], pos[2]]} checkValidMove={checkValidMove} updateState={updateState} key={index} keyMap={keyMap} />
      ))}
      <OrbitControls maxPolarAngle={Math.PI / 2} />
      <axesHelper args={[5]} />
      <gridHelper />
      <Stats />

    </Canvas>
  )
}