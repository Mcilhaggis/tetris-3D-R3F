import { Html } from '@react-three/drei'

export default function GameOver({ score, handleReset }) {



    return (

        <Html position={[0, 0, 0]} >
            <div className='gameover-overlay'>
                <div className="game-overlay-content">
                    <h1>GAME OVER</h1>
                    <p>Score: {score}</p>
                    <button onClick={handleReset}>Restart</button>
                </div>
            </div>
        </Html>

    )
}