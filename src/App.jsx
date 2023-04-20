import { Canvas } from '@react-three/fiber'
import Box from './Box'
import { Stats, OrbitControls } from '@react-three/drei'
import useKeyboard from './usekeyboard'

export default function App() {
  const keyMap = useKeyboard()

console.log(keyMap)
  return (
    <Canvas camera={{ position: [1, 6, 8] }} >
      <Box position={[-1.5, 5.5, 0.5]} keyMap={keyMap} />
      <Box position={[-0.5, 5.5, 0.5]} keyMap={keyMap} />
      <Box position={[0.5, 5.5, 0.5]} keyMap={keyMap} />
      <Box position={[1.5, 5.5, 0.5]} keyMap={keyMap} />
      <OrbitControls maxPolarAngle={Math.PI / 2} />
      <axesHelper args={[5]} />
      <gridHelper />
      <Stats />
    </Canvas>
  )
}