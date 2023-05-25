import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color } from 'three'

export default function Box(props) {
  const ref = useRef()
  const [selected, setSelected] = useState(true)
  const [movingLeft, setMovingLeft] = useState(false)
  const [movingRight, setMovingRight] = useState(false)
  const [movingDown, setMovingDown] = useState(false)
  const [count, setCount] = useState(0)
  const [color, setColor] = useState(new Color(Math.floor(Math.random() * 16777216)));
  const { id, locked } = props.item;


  // Remove lined up blocks from the posStore
  useEffect(() => {
    if (props.reducedPosStoreLength) {
      for (var i = 0; i < props.posStore.length; i++) {
        if (props.posStore[i].id === ref.current.uuid) {
          ref.current.position.x = props.posStore[i].x
          ref.current.position.y = props.posStore[i].y
          ref.current.position.z = props.posStore[i].z
          props.updateBlockInPlay(false)
        }
      }
    }
  }, [props.reducedPosStoreLength]);

  const moveDown = () => {
    if (ref.current.position.y > 0.5 && !locked) {
      let newPosition = { ...ref.current.position };
      newPosition.y -= 1
      if (!locked) {
        let validMove = props.checkValidMove(props.uniqueID, newPosition, ref.current.groupID, props.posStore);
        if (validMove) {
          // If the partner piece is being locked for hitting the group pieces aren't updated fast enough untill the next move
          console.log('valid')
          props.updatePosState(props.uniqueID, ref.current.position, ref.current.groupID);
          ref.current.position.y -= 1;
        } else {

          props.updatePosState(props.uniqueID, ref.current.position, ref.current.groupID);
          props.onLockChange(id, ref.current.groupID, true);

          return
        }
        if (ref.current.position.y <= 0.5) {
          ref.current.position.y = 0.5;

          // Call the callback to update the locked state in the parent component
          props.onLockChange(id, ref.current.groupID, true);
          props.updatePosState(props.uniqueID, ref.current.position, ref.current.groupID);
        }
        setCount((count) => count + 1);
      }
    }
  }

  // Move the block down every second
  useEffect(() => {
    const timer = setInterval(() => {
      if (!locked) {
        moveDown();
      }
    }, 1000);
    return () => clearInterval(timer);

  }, [locked]);


  useFrame((_, delta) => {

    // if (ref.current.position.y <= 0.5) {
      // props.onLockChange(id, ref.current.groupID, true);

      // ref.current.position.y = 0.5;
    // }

    // If its sitting at the bottom of the board, restrict movement
    // if (ref.current.position.y === 0.5) {
      // props.onLockChange(id, ref.current.groupID, true);

    // }
    // If space bar pressed, send all the way down.
    if (props.keyMap['Space'] && selected) {
      ref.current.position.y = 0.5
      props.updatePosState(props.uniqueID, ref.current.position, ref.current.groupID);

    }
    // Moving negatively on x-axis (left)
    if (props.keyMap['KeyA'] && selected && !movingLeft && ref.current.position.x > -4.5 && !locked) {
      let newPosition = { ...ref.current.position }; // create a new object based on the current position
      newPosition.x -= 1; // modify the new object's x property
      let validMove = props.checkValidMove(props.uniqueID, newPosition, ref.current.groupID, props.posStore);
      //to check if its moving to an empty space
      if (validMove) {
        ref.current.position.x -= 1
        props.updatePosState(props.uniqueID, ref.current.position, ref.current.groupID);
        setMovingLeft(true)
      } else return

    } else if (!props.keyMap['KeyA'] && movingLeft) {
      setMovingLeft(false)
    }
    // Moving positively on x-axis (right)
    if (props.keyMap['KeyD'] && selected && !movingRight && ref.current.position.x < 4.5 && !locked) {
      let newPosition = { ...ref.current.position };
      newPosition.x += 1
      let validMove = props.checkValidMove(props.uniqueID, newPosition, ref.current.groupID, props.posStore);
      if (validMove) {
        ref.current.position.x += 1
        props.updatePosState(props.uniqueID, ref.current.position, ref.current.groupID);
        setMovingRight(true)
      } else return
    } else if ((!props.keyMap['KeyD'] && movingRight)) {
      setMovingRight(false)
    }
    // Moving negatively on y-axis (down)
    if (props.keyMap['KeyS'] && selected && !movingDown && ref.current.position.y > 0.5 && !locked) {
      let newPosition = { ...ref.current.position };
      newPosition.y -= 1
      let validMove = props.checkValidMove(props.uniqueID, newPosition, ref.current.groupID, props.posStore);
      if (validMove) {
        ref.current.position.y -= 1
        props.updatePosState(props.uniqueID, ref.current.position, ref.current.groupID);
        setMovingDown(true)
      } else {
        // setIsLocked(true)
        props.onLockChange(id, ref.current.groupID, true);

        return
      }
    } else if ((!props.keyMap['KeyS'] && movingDown)) {
      setMovingDown(false)
    }
  })

  useEffect(() => {
    if (props.locked) {
      props.updateBlockInPlay(false)
      // props.updateLockedState(props.uniqueID, locked, ref.current.groupID)
    }
  }, [props.locked])

  // If the another block in the group locks, lock the blocks its grouped with
  // const handleLockedStateChange = (newState) => {
  //   setIsLocked(newState);
  // };



  return (
    <mesh ref={ref} {...props}>
      <boxGeometry />
      <meshBasicMaterial color={color} wireframe={!props.locked} />
    </mesh>

  )
}

