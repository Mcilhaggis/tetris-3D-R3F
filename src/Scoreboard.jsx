import { Html } from '@react-three/drei'

export default function Scoreboard({score}) {

    return (
        <>
            <Html position={[4, 5, -2]} >
                <div className='annotation'>
                    <h1>Score: {score}</h1>
                    {/* <p>Level: {props.level}</p> */}
                    </div>
            </Html>
        </>
    )
}