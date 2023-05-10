import { Canvas } from '@react-three/fiber'
import Box from './Box'
import DoubleBlock from './DoubleBlock'
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
  const [cameraPosition, setCameraPosition] = useState([3, 6, 8]);

  const orbitControlsRef = useRef()

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
        if (counterY[value] === 10) {
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
  let blockTypes = [
    {
      'name': 'single',
      'blockNum': 1,
      'positions': [{ x: pos[0], y: pos[1], z: pos[2] }]
    },
    {
      'name': 'double',
      'blockNum': 2,
      'positions': [
        { x: pos[0] - 1, y: pos[1], z: pos[2] },
        { x: pos[0], y: pos[1], z: pos[2] },
      ]
    },
    {
      'name': 'triple',
      'blockNum': 3,
      'positions': [
        { x: pos[0] - 1, y: pos[1], z: pos[2] },
        { x: pos[0], y: pos[1], z: pos[2] },
        { x: pos[0] + 1, y: pos[1], z: pos[2] }
      ]
    }
  ]

  function createNewBox() {
    let randomValue = blockTypes[Math.floor(Math.random() * blockTypes.length)];
    console.log('randomValue, ', randomValue)
    let newBoxes = randomValue.positions.map((pos, i) => ({
      id: i,
      uniqueID: null,
      x: pos.x,
      y: pos.y,
      z: pos.z,
      locked: false
    }));
    console.log('newBoxes', newBoxes)
    setBoxes([...boxes, ...newBoxes]);
  }

  const updateBlockInPlay = (newState) => {
    setBlockInPlay(newState)
    if (!blockInPlay && !completeLine && !gameOver) {
      if (!gameOver) {
        createNewBox()
        
      }
      setCount(count + 1)
    }
  }

  const handleReset = () => {
    updateBlockInPlay(false)
    setPosStore([])
    setBoxes([])
    setGameOver(false)
    setScoreCount(0)
    setCount(0)
    orbitControlsRef.current.reset()
  }

  return (
    <Canvas camera={{ position: cameraPosition }} >
      {/* Show the score */}
      {!gameOver && <Scoreboard score={scoreCount} />}
      {/* If game over show the score and replay option */}
      {gameOver && <GameOver score={scoreCount} handleReset={handleReset} />}
      {console.log('boxes', boxes)}
      {console.log('posStore', posStore)}
      {!blockInPlay && boxes.map((box, index) => (
        <Box
          key={box.id + index}
          uniqueID={count}
          position={[box.x, box.y, box.z]}
          checkValidMove={checkValidMove}
          updatePosState={updatePosState}
          keyMap={keyMap}
          updateBlockInPlay={updateBlockInPlay}
          updateLockedState={updateLockedState}
          posStore={posStore}
          reducedPosStoreLength={posStore.length < previousPosStoreLength} // add this prop
        />
      ))}
      <OrbitControls
        ref={orbitControlsRef}

        maxPolarAngle={Math.PI / 2}
      // autoRotate={gameOver ? true : false}
      />
      <axesHelper args={[5]} />
      <gridHelper position={[0, 5, 0]} color="hotpink" />
      <gridHelper />
      <Stats />

    </Canvas>
  )
}
