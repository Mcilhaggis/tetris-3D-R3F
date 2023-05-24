import { Canvas } from '@react-three/fiber'
import Box from './Box'
import Scoreboard from './Scoreboard'
import GameOver from './GameOver'
import { Stats, OrbitControls } from '@react-three/drei'
import useKeyboard from './usekeyboard'
import { useEffect, useState, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid';


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


  const checkValidMove = (uniqueID, newState, groupID, locked) => {
    console.log(posStore)
    // If an item with not the same unique ID is found with the same x and y oordinates the block wants to move into return true for
    const existingItem = posStore.find(item => item.uniqueID !== uniqueID
      && item.x === newState.x
      && item.y === newState.y);
    if (existingItem) {
      console.log('Error: block already exists with the same x and y values');
      // setPosStore(prevPosStore => {
      //   const updatedPosStore = prevPosStore.map(item => {
      //     if (item.uniqueID === uniqueID || item.groupID === groupID) {
      //       console.log('lock', item.uniqueID)
      //       return { ...item, locked };
      //     }
      //     return item;
      //   });
      //   return updatedPosStore;
      // });
      return false;
    } else {
      return true;
    }
  }


  const handleLockChange = (uniqueID, groupID, locked) => {
    console.log('trying to lock', uniqueID, groupID, locked)

    setPosStore(prevPosStore => {
      const updatedPosStore = prevPosStore.map(item => {
        if (item.uniqueID === uniqueID || item.groupID === groupID) {
          return { ...item, locked };
        }
        return item;
      });
      return updatedPosStore;
    });
  };



  const updatePosState = (uniqueID, position, groupID, locked) => {
    // Use previous state to make sure multi box updates don't overwrite each other by being saved at the same time
    setPosStore(prevState => {
      const updateArr = prevState.map(item => {
        if (item.uniqueID === uniqueID) {
          return {
            ...item,
            uniqueID: uniqueID,
            x: position.x,
            y: position.y,
            // locked: locked,
            groupID: groupID
          }
        } else {
          return item;
        }
      })
      const newItem = {
        id: uniqueID,
        groupID: groupID,
        uniqueID: uniqueID,
        locked: false,
        x: position.x,
        y: position.y,
        z: position.z
      };
      if (!updateArr.some(item => item.uniqueID === uniqueID)) {
        updateArr.push(newItem);
      }
      return updateArr;
    });
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
      console.log('no block in play')
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
    // This index needs to be unique and not changed to the UUID later so that boxes can be identieifed from the start and not only after the uuid is assigned in the box component 
    let newBlocks = randomValue.positions.map((pos, i) => ({
      id: uuidv4(), // generate a unique ID for each new box
      groupID: randomValue.name + '-' + count,
      uniqueID: uuidv4(),
      x: pos.x,
      y: pos.y,
      z: pos.z,
      locked: false
    }));
    setBoxes([...boxes, ...newBlocks]);
    setPosStore([...posStore, ...newBlocks]);

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

      {!blockInPlay && posStore.map((box, index) => (
        <Box
          key={box.groupID + index}
          item={box}
          position={[box.x, box.y, box.z]}
          groupID={box.groupID}
          locked={box.locked}
          checkValidMove={checkValidMove}
          uniqueID={box.uniqueID}
          updatePosState={updatePosState}
          keyMap={keyMap}
          updateBlockInPlay={updateBlockInPlay}
          posStore={posStore}
          reducedPosStoreLength={posStore.length < previousPosStoreLength}
          onLockChange={handleLockChange}

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
