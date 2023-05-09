import { Html } from '@react-three/drei'

export default function GameOver({ score, handleReset }) {

    return (
        <Html position={[0, 0, 0]} >
            <div className='gameover-overlay'>
                <div className="game-overlay-content">
                    <h1>3D Tetris</h1>
                    <p>Controls W - up, A - left, S - down, D - right + Space - drop</p>
                    <p>Difficulty</p>
                    <input type="radio" id="difficulty" name="difficulty_level" value="Easy"></input>
                    <input type="radio" id="difficulty" name="difficulty_level" value="Medium"></input>
                    <input type="radio" id="difficulty" name="difficulty_level" value="Hard"></input>
                    <label for="difficulty">JavaScript</label>
                    <button onClick={handleReset}>Start</button>
                </div>
            </div>
            
        </Html>

    )
}