import { Canvas } from '@react-three/fiber'
import Box from './Box'
import { Stats, OrbitControls } from '@react-three/drei'
import useKeyboard from './usekeyboard'
import Scoring from './Scoring'
import { useState } from 'react'

let count = 0

export default function App() {

  const keyMap = useKeyboard()
  const pos = [0.5, 5.5, 0.5]
  const [posStore, setPosStore] = useState([])
  const [boxes, setBoxes] = useState([{ id: 0, position: [pos[0], pos[1], pos[2]], locked: false }])
  const [blockInPlay, setBlockInPlay] = useState(false)
  const [indexCount, setIndexCount] = useState(0)
  const [completeLine, setCompleteLine] = useState(false)

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
          y: newState.y,
          locked: newState.locked
        }
      } else {
        return item;
      }
    })
    const newItem = { id: newStateID, x: newState.x, y: newState.y, z: newState.z, locked: newState.locked };
    if (!updateArr.some(item => item.id === newStateID)) {
      updateArr.push(newItem);
    }
    setPosStore(updateArr)

    // Count how many repeated values there are 
    let counter = updateArr.reduce((acc, obj) => {
      const value = obj.y;
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {})

    // If there is more than 5 it a complete line
    for (const value in counter) {
      if (counter[value] >= 5) {
        console.log(`${value} is repeated ${counter[value]} times.`);
        setCompleteLine(true)
      }
    }

    return true;
  }

  const updateLockedState = (objID, locked) => {
    const updateArr = posStore.map(item => {
      if (item.id === objID) {
        return {
          ...item,
          locked: locked
        }
      } else {
        return item;
      }
    })
    return setPosStore(updateArr)
  }



  const createNewBox = () => {
    const newBoxID = boxes.length
    const newBoxPosition = [pos[0] + newBoxID, pos[1], pos[2]]
    setBoxes([...boxes, { id: newBoxID, position: newBoxPosition, locked: false }])
  }

  const updateBlockInPlay = (newState) => {
    setBlockInPlay(newState)
    if (!blockInPlay) {
      if (count < 4) {
        createNewBox()
      }
      count += 1
    }
  }



  return (
    <Canvas camera={{ position: [3, 6, 8] }} >
      {/* {console.log(boxes.array)} */}
      {!blockInPlay && boxes.map(box => (
        <Box
          key={box.id}
          position={[pos[0] + indexCount, pos[1], pos[2]]}
          checkValidMove={checkValidMove}
          updatePosState={updatePosState}
          keyMap={keyMap}
          updateBlockInPlay={updateBlockInPlay}
          updateLockedState={updateLockedState}
        />
      ))}
      <OrbitControls maxPolarAngle={Math.PI / 2} />
      <axesHelper args={[5]} />
      <gridHelper />
      <Stats />

    </Canvas>
  )
}