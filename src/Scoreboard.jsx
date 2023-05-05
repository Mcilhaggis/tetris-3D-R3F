import { Html } from '@react-three/drei'

export default function Scoreboard({score}) {

    return (
        <>
            <Html position={[4, 5, -2]} >
                <div className='annotation'>
                    <h1>3D TETRIS</h1>
                    <p>Score: {score}</p>
                    {/* <p>Level: {props.level}</p> */}
                    </div>
            </Html>
        </>
    )
}