import { Canvas } from '@react-three/fiber'
import Box from './Box'
import Scoreboard from './Scoreboard'
import GameOver from './GameOver'
import { Stats, OrbitControls } from '@react-three/drei'
import useKeyboard from './usekeyboard'
import { useEffect, useState, useRef } from 'react'
// let count = 0

export default function App() {

  const keyMap = useKeyboard()
  const pos = [0.5, 5.5, 0.5]
  const [posStore, setPosStore] = useState([])
  const [boxes, setBoxes] = useState([])
  const [blockInPlay, setBlockInPlay] = useState(false)
  const [count, setCount] = useState(0)
  const [scoreCount, setScoreCount] = useState(0)
  const [completeLine, setCompleteLine] = useState(false)
  const [completeLineYValue, setCompleteLineYValue] = useState(null)
  const [gameOver, setGameOver] = useState(false)
  const previousPosStoreLengthRef = useRef(posStore.length);
  useEffect(() => {
    previousPosStoreLengthRef.current = posStore.length;
  }, [posStore.length]);

  const previousPosStoreLength = previousPosStoreLengthRef.current;


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

  // Check for a complete line being made
  useEffect(() => {
    let counterY;
    if (posStore.length > 0) {
      // Count how many repeated values there are 
      counterY = posStore.reduce((acc, obj) => {
        const value = obj.y;
        acc[value] = (acc[value] || 0) + 1;
        return acc;
      }, {})
      // If there is more than 5 it a complete line
      for (const value in counterY) {
        if (counterY[value] === 5) {
          console.log(`${value} is repeated ${counterY[value]} times. Removing the line.`);
          setCompleteLine(true)
          setCompleteLineYValue(value)
          counterY[value] = 0
        }
      }
    } else {
      updateBlockInPlay(false)
    }
  }, [posStore])

  // Check for the build getting too tall and causing game to be over
  useEffect(() => {
    let counterX;
    if (posStore.length > 0) {
      // Count how many repeated values there are 
      counterX = posStore.reduce((acc, obj) => {
        const value = obj.x;
        acc[value] = (acc[value] || 0) + 1;
        return acc;
      }, {})
      // If there is more than 5 it a complete line
      for (const value in counterX) {
        if (counterX[value] === 5) {
          console.log(`${value} is repeated ${counterX[value]} times. GAME OVER.`);
          setGameOver(true)
          counterX[value] = 0
        }
      }
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
        const foundItem1 = idsToRemove.find((item1) => item1.uniqueID - 1 === item2.id);
        return !foundItem1; // only keep items that don't have the matching y value
      });

      if (JSON.stringify(filteredBoxes) !== JSON.stringify(boxes)) {
        setBoxes(filteredBoxes);
      }
      setScoreCount(scoreCount + 1)
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
    setBoxes(
      [...boxes,
      { id: count, uniqueID: null, x: pos[0], y: pos[1], z: pos[2], locked: false }])
  }

  const updateBlockInPlay = (newState) => {
    setBlockInPlay(newState)
    if (!blockInPlay && !completeLine && !gameOver) {
      if (count < 15) {
        createNewBox()
      }
      setCount(count + 1)
    }
  }

  const handleReset = () => {
    console.log('hit')
    updateBlockInPlay(false)
    setPosStore([])
    setBoxes([])
    setGameOver(false)
    setScoreCount(0)
  }

  return (
    <Canvas camera={{ position: [3, 6, 8] }} >
      {!gameOver && <Scoreboard
        score={scoreCount}
      />
      }
      {gameOver && <GameOver score={scoreCount}         handleReset={handleReset}
/>}
      
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
          posStore={posStore}
          reducedPosStoreLength={posStore.length < previousPosStoreLength} // add this prop

        />
      ))}
      <OrbitControls maxPolarAngle={Math.PI / 2} />
      <axesHelper args={[5]} />
      <gridHelper position={[0, 5, 0]} color={'#ff0000'} opacity={0.5} />
      <gridHelper />
      <Stats />

    </Canvas>
  )
}
