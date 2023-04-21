import { Canvas } from '@react-three/fiber'
import Box from './Box'
import { Stats, OrbitControls } from '@react-three/drei'
import useKeyboard from './usekeyboard'
import { useState } from 'react'
let count = 0

export default function App() {
  const keyMap = useKeyboard()
  const pos = [-1.5, 5.5, 0.5]
  const [posStore, setPosStore] = useState([])
  const [boxes, setBoxes] = useState([{ id: 0, position: [pos[0], pos[1], pos[2]] }])
  const [blockInPlay, setBlockInPlay] = useState(false)
  const [indexCount, setIndexCount] = useState(0)

  const checkValidMove = (newStateID, newState) => {
    const existingItem = posStore.find(item => item.id !== newStateID && item.x === newState.x && item.y === newState.y);
    if (existingItem) {
      console.log('Error: block already exists with the same x and y values');
      return false;
    } else return true;
  }
  const updatePosState = (newStateID, newState) => {

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

  const createNewBox = () => {
    const newBoxID = boxes.length
    const newBoxPosition = [pos[0] + newBoxID, pos[1], pos[2]]
    setBoxes([...boxes, { id: newBoxID, position: newBoxPosition }])
  }

  const updateBlockInPlay = (newState) => {
    console.log(newState)
    setBlockInPlay(newState)
    if (!blockInPlay) {
      console.log('create a new block')
      if (count < 1) {
        createNewBox()
        console.log(count)
      }
      count += 1
    }
  }

  return (
    <Canvas camera={{ position: [3, 6, 8] }} >
      {!blockInPlay && boxes.map(box => (
        <Box
          key={box.id}
          position={[pos[0] + indexCount, pos[1], pos[2]]}
          checkValidMove={checkValidMove}
          updatePosState={updatePosState}
          keyMap={keyMap}
          updateBlockInPlay={updateBlockInPlay} />
      ))}
      <OrbitControls maxPolarAngle={Math.PI / 2} />
      <axesHelper args={[5]} />
      <gridHelper />
      <Stats />

    </Canvas>
  )
}