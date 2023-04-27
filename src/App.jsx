import { Canvas } from '@react-three/fiber'
import Box from './Box'
import { Stats, OrbitControls } from '@react-three/drei'
import useKeyboard from './usekeyboard'
import { useEffect, useState } from 'react'

// let count = 0

export default function App() {

  const keyMap = useKeyboard()
  const pos = [0.5, 5.5, 0.5]
  const [posStore, setPosStore] = useState([])
  const [boxes, setBoxes] = useState([])
  const [blockInPlay, setBlockInPlay] = useState(false)
  const [count, setCount] = useState(0)
  const [completeLine, setCompleteLine] = useState(false)
  const [completeLineYValue, setCompleteLineYValue] = useState(null)

  const checkValidMove = (newStateID, newState) => {
    const existingItem = posStore.find(item => item.id !== newStateID && item.x === newState.x && item.y === newState.y);
    if (existingItem) {
      console.log('Error: block already exists with the same x and y values');
      return false;
    } else return true;
  }

  const updatePosState = (newStateID, newState, passedID) => {
    const updateArr = posStore.map(item => {
      if (item.id === newStateID) {
        return {
          ...item,
          uniqueID: passedID,
          x: newState.x,
          y: newState.y,
          locked: newState.locked
        }
      } else {
        return item;
      }
    })
    const newItem = {
      id: newStateID,
      uniqueID: passedID,
      x: newState.x,
      y: newState.y,
      z: newState.z,
    };

    if (!updateArr.some(item => item.id === newStateID)) {
      updateArr.push(newItem);
    }
    setPosStore(updateArr)
    return true;
  }
  useEffect(() => {
    let counter;
    console.log('posStorebefore legnth checks', posStore)

    if (posStore.length > 0) {
      // Count how many repeated values there are 
      counter = posStore.reduce((acc, obj) => {
        const value = obj.y;
        acc[value] = (acc[value] || 0) + 1;
        return acc;
      }, {})
      console.log('posStore', posStore)
      console.log('boxes', boxes)
      // If there is more than 5 it a complete line
      for (const value in counter) {
        if (counter[value] === 5) {
          console.log(`${value} is repeated ${counter[value]} times. Removing the line.`);
          setCompleteLine(true)
          setCompleteLineYValue(value)
          counter[value] = 0
        }
      }
    } else {
      updateBlockInPlay(false)
    }
  }, [posStore])

  useEffect(() => {
    if (completeLine) {
      const lineRemovalPosStore = posStore.filter(obj => obj.y !== Number(completeLineYValue));
      
      const updatedPosStore = lineRemovalPosStore.map(item => ({
        ...item,
        y: item.y - 1
      }));
      setPosStore(updatedPosStore)
      
      const idsToRemove = posStore.filter(obj => obj.y === Number(completeLineYValue));
      const filteredBoxes = boxes.filter((item2) => {
        const foundItem1 = idsToRemove.find((item1) => item1.uniqueID -1 === item2.id);
        return !foundItem1; // only keep items that don't have the matching y value
      });

      if (JSON.stringify(filteredBoxes) !== JSON.stringify(boxes)) {
        setBoxes(filteredBoxes);
      }
      setCompleteLine(false)
    }
  }, [completeLine])


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
    setBoxes(
      [...boxes,
      { id: count, uniqueID: null, x: pos[0], y: pos[1], z: pos[2], locked: false }])
  }

  const updateBlockInPlay = (newState) => {
    setBlockInPlay(newState)
    if (!blockInPlay && !completeLine) {
      if (count < 8) {
        createNewBox()
      }
      setCount(count + 1)
    }
  }


  return (
    <Canvas camera={{ position: [3, 6, 8] }} >
      {!blockInPlay && boxes.map((box, index) => (
        <Box
          key={box.id}
          uniqueID={count}
          position={[pos[0], pos[1], pos[2]]}
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
