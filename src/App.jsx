import { Canvas } from '@react-three/fiber'
import Box from './Box'
import { Stats, OrbitControls } from '@react-three/drei'
import useKeyboard from './usekeyboard'

export default function App() {
  const keyMap = useKeyboard()
  const pos = [-1.5, 5.5, 0.5]
  return (
    <Canvas camera={{ position: [1, 6, 8] }} >
      {[...Array(4)].map((x, index) => (
        <Box position={[pos[0] + index, pos[1], pos[2]]} key={index} keyMap={keyMap} />
      ))}
      <OrbitControls maxPolarAngle={Math.PI / 2} />
      <axesHelper args={[5]} />
      <gridHelper />
      <Stats />
    </Canvas>
  )
}