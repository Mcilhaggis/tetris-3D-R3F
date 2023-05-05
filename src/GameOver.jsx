import { Html } from '@react-three/drei'

export default function GameOver({ score, handleReset }) {



    return (

        <Html position={[0, 0, 0]} >
            <div className='gameover-overlay'>
                <h1>GAME OVER</h1>
                <p>Score: {score}</p>
                <button onClick={handleReset}>Restart</button>
            </div>
        </Html>

    )
}