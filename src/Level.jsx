import { useGLTF, Float, Text, SpotLight } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Mesh } from 'three';
import * as THREE from 'three'
import { Vector3 } from 'three'
import useGame from './stores/useGame';
import {useControls} from 'leva'



//as many box so use same geometry
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

const floor1Material = new THREE.MeshStandardMaterial({ color: 'limegreen' })
const floor2Material = new THREE.MeshStandardMaterial({ color: 'greenyellow' })
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 'orangered' })
const wallMaterial = new THREE.MeshStandardMaterial({ color: 'slategrey' })
const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 'slategrey' })





//floor
function BlockStart({ position = [0, 0, 0] }) {
    return <group position={position}>
        <Float floatIntensity={0.25} rotationIntensity={0.25}>
            <Text
                scale={0.5}
                font="./bebas-neue-v9-latin-regular.woff"
                maxWidth={0.25}
                lineHeight={0.75}
                textAlign='right'
                position={[0.75, 0.65, 0]}
                rotation-y={-0.25}>
                Marble Race
                <meshStandardMaterial toneMapped={false} />
            </Text>
        </Float>


        <mesh geometry={boxGeometry} material={floor1Material} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />
    </group>
}




//floor
function BlockEnd({ position = [0, 0, 0] }) {

    const hamburger = useGLTF('./hamburger.glb')
    hamburger.scene.children.forEach((mesh) => {
        mesh.castShadow = true
    })


    return <group position={position}>


        <Text
            scale={1}
            font="./bebas-neue-v9-latin-regular.woff"

            position={[0, 2.25, 2]}
        >
            Finish
            <meshBasicMaterial toneMapped={false} />
        </Text>


        <mesh geometry={boxGeometry} material={floor1Material} position={[0, 0, 0]} scale={[4, 0.2, 4]} receiveShadow />
        <RigidBody type='fixed' colliders="hull" position={[0, 0.25, 0]} restitution={0.2} friction={0}>
            <primitive object={hamburger.scene} scale={0.2} />
        </RigidBody>
    </group>
}






//spinerr
export function BlockSpinner({ position = [0, 0, 0] }) {

    const obstacle = useRef()

    const [speed] = useState(() => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1))
    const [bounceSound] = useState(() => { return new Audio('./bounce.mp3') })



    const collisionEnter = () => {
        bounceSound.currentTime = 0
        bounceSound.volume = 0.3
        bounceSound.play()
    }


    //for spinner
    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        const rotation = new THREE.Quaternion()
        rotation.setFromEuler(new THREE.Euler(0, time * speed, 0))
        obstacle.current.setNextKinematicRotation(rotation)

    })

    return <group position={position}>
        <mesh geometry={boxGeometry} material={floor2Material} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />
        <RigidBody ref={obstacle} type='kinematicPosition' position={[0, 0.3, 0]} restitution={0.2} friction={0} onCollisionEnter={collisionEnter} >
            <mesh geometry={boxGeometry} material={obstacleMaterial} scale={[3.5, 0.3, 0.3]} castShadow receiveShadow />
        </RigidBody>
    </group>
}



//block left
export function BlockLeft({ position = [0, 0, 0] }) {

    const obstacle = useRef()
    const [wallSound] = useState(() => { return new Audio('./punchwall.mp3') })



    const collisionEnter = () => {
        wallSound.currentTime = 0
        wallSound.volume = 0.2
        wallSound.play()
    }



    return <group position={position}>
        <mesh geometry={boxGeometry} material={floor2Material} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />
        <RigidBody ref={obstacle} type='kinematicPosition' position={[-1, 0.78, 0]} restitution={0.2} friction={0} onCollisionEnter={collisionEnter} >
            <mesh geometry={boxGeometry} material={obstacleMaterial} scale={[2, 1.5, 0.2]} castShadow receiveShadow />
        </RigidBody>
    </group>
}


//block right
export function BlockRight({ position = [0, 0, 0] }) {

    const obstacle = useRef()

    const [wallSound] = useState(() => { return new Audio('./punchwall.mp3') })



    const collisionEnter = () => {
        wallSound.currentTime = 0
        wallSound.volume = 0.2
        wallSound.play()
    }

    return <group position={position}>
        <mesh geometry={boxGeometry} material={floor2Material} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />
        <RigidBody ref={obstacle} type='kinematicPosition' position={[1, 0.78, 0]} restitution={0.2} friction={0} onCollisionEnter={collisionEnter} >
            <mesh geometry={boxGeometry} material={obstacleMaterial} scale={[2, 1.5, 0.2]} castShadow receiveShadow />
        </RigidBody>
    </group>
}

//block down
export function BlockDown({ position = [0, 0, 0] }) {

    const obstacle = useRef()

    const [wallSound] = useState(() => { return new Audio('./punchwall.mp3') })



    const collisionEnter = () => {
        wallSound.currentTime = 0
        wallSound.volume = 0.2
        wallSound.play()
    }

    return <group position={position}>
        <mesh geometry={boxGeometry} material={floor2Material} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />
        <RigidBody ref={obstacle} type='kinematicPosition' position={[0, 0.35, 0]} restitution={0.2} friction={0} onCollisionEnter={collisionEnter} >
            <mesh geometry={boxGeometry} material={obstacleMaterial} scale={[4, 0.7, 0.2]} castShadow receiveShadow />
        </RigidBody>
    </group>
}




// spinner+movement
export function BlockSpinnerMove({ position = [0, 0, 0] }) {

    const obstacle = useRef()

    const [speed] = useState(() => (Math.random() + 0.7) * (Math.random() < 0.5 ? -1 : 1))
    const [bounceSound] = useState(() => { return new Audio('./bounce.mp3') })
    const [sideWallSound1] = useState(() => { return new Audio('./sidewall.mp3') })


    const collisionEnter1 = () => {

        sideWallSound1.currentTime = 0
        sideWallSound1.volume = 0.5
        sideWallSound1.play()
    }


    const collisionEnter = () => {
        bounceSound.currentTime = 0
        bounceSound.volume = 0.3
        bounceSound.play()
    }


    //for spinner
    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        const rotation = new THREE.Quaternion()
        rotation.setFromEuler(new THREE.Euler(0, time * speed, 0))
        obstacle.current.setNextKinematicRotation(rotation)



    })

    return <group position={position}>
        <mesh geometry={boxGeometry} material={floor2Material} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />
        <RigidBody ref={obstacle} type='kinematicPosition' position={[0, 0.3, 0]} restitution={0.2} friction={0} onCollisionEnter={collisionEnter} >
            <mesh geometry={boxGeometry} position={[0,0.7,0]} material={obstacleMaterial} scale={[2.6, 2, 0.1]} castShadow receiveShadow />
        </RigidBody>
        <RigidBody type='fixed' restitution={0.2} friction={0} onCollisionEnter={collisionEnter1}>
            <mesh geometry={boxGeometry} position={[0, 2, 0]} material={ceilingMaterial} scale={[4.6, 0.3, 4]} castShadow receiveShadow />
        </RigidBody>
    </group>
}





//laser-horizontal
export function BlockLaserHorizontal({ position = [0, 0, 0], vec = new Vector3() }) {


    const obstacle = useRef()
    const light = useRef()
    const [lightSpeed] = useState(() => Math.random() * (0.017 - 0.007) + 0.007)
    var [direction] = useState(() => Math.floor(Math.random() * 2))
    const end = useGame((state) => state.end)
    const [LaserSound] = useState(() => { return new Audio('./laser.mp3') })
    var [inside] = useState(0)

    const checkLaserCollision = (pos) => {


        const laserPosition = light.current.position

        //for sound fo laser
        if ((((position[2] + 2) > pos[2]) && (position[2] - 2)) < pos[2] && !inside) {
            LaserSound.currentTime = 0
            LaserSound.volume = 0.3
            LaserSound.play()

            inside = 1
        }

        if (((position[2] - 2) > pos[2] || ((position[2] + 2) < pos[2])) && inside) {
            LaserSound.pause()

            inside = 0
        }



        //laser out
        if (((laserPosition.z + position[2] + 0.17) > pos[2] && (laserPosition.z + position[2] - 0.5) < pos[2]) && laserPosition.y < pos[1] && laserPosition.y >= (pos[1] - 0.6)) {
            end(0)
        }
    }


    useEffect(() => {
        const unsubscribePosition = useGame.subscribe(
            (state) => state.ballPosition,
            (value) => {
                checkLaserCollision(value)
            }
        )


        return () => {
            unsubscribePosition()
        }
    }, [])






    useFrame((state) => {


        if (light.current.position.y > 1.6) {
            direction = 0;
        }
        else if (light.current.position.y < -0.2) {
            direction = 1;
        }

        if (direction) {
            light.current.position.y += lightSpeed
        }
        else {
            light.current.position.y -= lightSpeed
        }


        light.current.target.position.lerp(vec.set(position[0], position[1] + light.current.position.y + 0.3, position[2]), 1)
        light.current.target.updateMatrixWorld()
    })



    return <group position={position}>
        <mesh geometry={boxGeometry} material={floor2Material} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />


        <RigidBody ref={obstacle} type='kinematicPosition' position={[0, 0.35, 0]} >
            <SpotLight
                ref={light}
                intensity={2}
                distance={4}
                color={'#8B0000'}
                position={[-2, (Math.random() * (1.6 - (-0.2)) + (-0.2)), 0]}
                angle={0.02}
                attenuation={5}
                anglePower={20} />
        </RigidBody>
    </group>
}



//laser-vertical
export function BlockLaserVertical({ position = [0, 0, 0], vec = new Vector3() }) {


    const obstacle = useRef()
    const light = useRef()
    const [lightSpeed] = useState(() => Math.random() * (0.017 - 0.007) + 0.007)
    var [direction] = useState(() => Math.floor(Math.random() * 2))
    const end = useGame((state) => state.end)
    var inside = useState(0)
    const [LaserSound] = useState(() => { return new Audio('./laser.mp3') })


    const checkLaserCollision = (pos) => {


        const laserPosition = light.current.position

        if ((((position[2] + 2) > pos[2]) && (position[2] - 2)) < pos[2] && !inside) {
            LaserSound.currentTime = 0
            LaserSound.volume = 0.3
            LaserSound.play()

            inside = 1
        }

        if (((position[2] - 2) > pos[2] || ((position[2] + 2) < pos[2])) && inside) {
            LaserSound.pause()
            inside = 0
        }

        if ((laserPosition.x <= (pos[0] + 0.3) && laserPosition.x >= (pos[0] - 0.3)) && ((laserPosition.z + position[2] + 0.17) > pos[2] && (laserPosition.z + position[2] - 0.5) < pos[2])) {
            end(0)
        }

    }


    useEffect(() => {
        const unsubscribePosition = useGame.subscribe(
            (state) => state.ballPosition,
            (value) => {
                checkLaserCollision(value)
            }
        )


        return () => {
            unsubscribePosition()
        }
    }, [])


    useFrame((state) => {

        if (light.current.position.x > 1.9) {
            direction = 0;
        }
        else if (light.current.position.x < -1.9) {
            direction = 1;
        }

        if (direction) {
            light.current.position.x += lightSpeed
        }
        else {
            light.current.position.x -= lightSpeed
        }


        light.current.target.position.lerp(vec.set(position[0] + light.current.position.x, position[1], position[2]), 1)
        light.current.target.updateMatrixWorld()
    })



    return <group position={position}>
        <mesh geometry={boxGeometry} material={floor2Material} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />


        <RigidBody ref={obstacle} type='kinematicPosition' position={[0, 0.35, 0]} >
            <SpotLight
                ref={light}
                intensity={2}
                distance={2}
                color={'#8B0000'}
                position={[(Math.random() * (2 - (-2)) + (-2)), 1.5, 0]}
                angle={0.02}
                attenuation={5}
                anglePower={20} />
        </RigidBody>
    </group>
}



//Multiple random laser
export function BlockCrossLaser({ position = [0, 0, 0], vec = new Vector3() }) {



    const light = useRef()
    const light1 = useRef()
    const [lightSpeed] = useState(() => Math.random() * (0.017 - 0.007) + 0.007)
    var [direction] = useState(() => Math.floor(Math.random() * 2))
    const end = useGame((state) => state.end)
    const [LaserSound] = useState(() => { return new Audio('./laser.mp3') })
    var [inside] = useState(0)
    const [sideWallSound1] = useState(() => { return new Audio('./sidewall.mp3') })


    const collisionEnter = () => {

        sideWallSound1.currentTime = 0
        sideWallSound1.volume = 0.5
        sideWallSound1.play()
    }

    const checkLaserCollision = (pos) => {


        const laserPosition = light.current.position
        const laserPosition1 = light1.current.position

        //for sound fo laser
        if ((((position[2] + 2) > pos[2]) && (position[2] - 2)) < pos[2] && !inside) {
            LaserSound.currentTime = 0
            LaserSound.volume = 0.3
            LaserSound.play()

            inside = 1
        }

        if (((position[2] - 2) > pos[2] || ((position[2] + 2) < pos[2])) && inside) {
            LaserSound.pause()

            inside = 0
        }



        //laser out horizontal

        if (((laserPosition.z + position[2] + 0.17) > pos[2] && (laserPosition.z + position[2] - 0.5) < pos[2]) && laserPosition.y < pos[1] && laserPosition.y >= (pos[1] - 0.6)) {
            end(0)
        }

        //laser out vertical
        if ((laserPosition1.x <= (pos[0] + 0.3) && laserPosition1.x >= (pos[0] - 0.3)) && ((laserPosition1.z + position[2] + 0.17) > pos[2] && (laserPosition1.z + position[2] - 0.5) < pos[2])) {
            end(0)
        }

    }


    useEffect(() => {
        const unsubscribePosition = useGame.subscribe(
            (state) => state.ballPosition,
            (value) => {
                checkLaserCollision(value)
            }
        )


        return () => {
            unsubscribePosition()
        }
    }, [])






    useFrame((state) => {

        //for horizontal        
        if (light.current.position.y > 1.6) {
            direction = 0;
        }
        else if (light.current.position.y < -0.2) {
            direction = 1;
        }

        if (direction) {
            light.current.position.y += lightSpeed
        }
        else {
            light.current.position.y -= lightSpeed
        }


        light.current.target.position.lerp(vec.set(position[0], position[1] + light.current.position.y + 0.3, position[2]), 1)
        light.current.target.updateMatrixWorld()


        //for veritcal laser
        if (light1.current.position.x > 1.9) {
            direction = 0;
        }
        else if (light1.current.position.x < -1.9) {
            direction = 1;
        }

        if (direction) {
            light1.current.position.x += lightSpeed
        }
        else {
            light1.current.position.x -= lightSpeed
        }


        light1.current.target.position.lerp(vec.set(position[0] + light1.current.position.x, position[1], position[2]), 1)
        light1.current.target.updateMatrixWorld()
    })



    return <group position={position}>
        <mesh geometry={boxGeometry} material={floor2Material} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />


        <RigidBody type='kinematicPosition' position={[0, 0.35, 0]} >
            <SpotLight
                ref={light}
                intensity={2}
                distance={4}
                color={'#8B0000'}
                position={[-2, (Math.random() * (1.6 - (-0.2)) + (-0.2)), 0.3]}
                angle={0.02}
                attenuation={5}
                anglePower={20} />
        </RigidBody>
        <RigidBody type='kinematicPosition' position={[0, 0.35, 0]} >
            <SpotLight
                ref={light1}
                intensity={2}
                distance={2}
                color={'#8B0000'}
                position={[(Math.random() * (2 - (-2)) + (-2)), 1.5, -0.3]}
                angle={0.02}
                attenuation={5}
                anglePower={20} />
        </RigidBody>
        <RigidBody type='fixed' restitution={0.2} friction={0} onCollisionEnter={collisionEnter}>
            <mesh geometry={boxGeometry} position={[0, 2, 0]} material={ceilingMaterial} scale={[4.6, 0.3, 4]} castShadow receiveShadow />
        </RigidBody>

    </group>
}




//limbo
export function BlockLimbo({ position = [0, 0, 0] }) {

    const obstacle = useRef()


    const [timeOffset] = useState(() => Math.random() * Math.PI * 2)

    const [bounceSound] = useState(() => { return new Audio('./bounce.mp3') })



    const collisionEnter = () => {
        bounceSound.currentTime = 0
        bounceSound.volume = 0.3
        bounceSound.play()
    }




    //for spinner
    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        const y = Math.sin(time * timeOffset) + 1.20
        obstacle.current.setNextKinematicTranslation({ x: position[0], y: position[1] + y, z: position[2] })

    })

    return <group position={position}>
        <mesh geometry={boxGeometry} material={floor2Material} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />
        <RigidBody ref={obstacle} type='kinematicPosition' position={[0, 0.3, 0]} restitution={0.2} friction={0} onCollisionEnter={collisionEnter} >
            <mesh geometry={boxGeometry} material={obstacleMaterial} scale={[3.5, 0.3, 0.3]} castShadow receiveShadow />
        </RigidBody>
    </group>
}





//Axe
export function BlockAxe({ position = [0, 0, 0] }) {

    const obstacle = useRef()


    const [timeOffset] = useState(() => Math.random() * Math.PI * 2)

    const [bounceSound] = useState(() => { return new Audio('./bounce.mp3') })



    const collisionEnter = () => {
        bounceSound.currentTime = 0
        bounceSound.volume = 0.3
        bounceSound.play()
    }




    //for spinner
    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        const x = Math.sin(time * timeOffset) * 1.25
        obstacle.current.setNextKinematicTranslation({ x: position[0] + x, y: position[1] + 0.75, z: position[2] })


    })

    return <group position={position}>
        <mesh geometry={boxGeometry} material={floor2Material} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />
        <RigidBody ref={obstacle} type='kinematicPosition' position={[0, 0.3, 0]} restitution={0.2} friction={0} onCollisionEnter={collisionEnter} >
            <mesh geometry={boxGeometry} material={obstacleMaterial} scale={[1.5, 1.5, 0.3]} castShadow receiveShadow />
        </RigidBody>
    </group>
}





//walls
function Bounds({ length = 1 }) {

    const [sideWallSound1] = useState(() => { return new Audio('./sidewall.mp3') })


    const collisionEnter = () => {

        sideWallSound1.currentTime = 0
        sideWallSound1.volume = 0.5
        sideWallSound1.play()
    }



    return <>
        <RigidBody type='fixed' restitution={0.2} friction={0} onCollisionEnter={collisionEnter}>
            <mesh geometry={boxGeometry} position={[2.15, 1, -(length * 2) + 2]} material={wallMaterial} scale={[0.3, 2, 4 * length]} castShadow />
        </RigidBody>
        <RigidBody type='fixed' restitution={0.2} friction={0} onCollisionEnter={collisionEnter}>
            <mesh geometry={boxGeometry} position={[-2.15, 1, -(length * 2) + 2]} material={wallMaterial} scale={[0.3, 2, 4 * length]} castShadow receiveShadow />
        </RigidBody>
        <RigidBody type='fixed' restitution={0.2} friction={0} >
            <mesh geometry={boxGeometry} position={[0, 1, -(length * 4) + 2]} material={wallMaterial} scale={[4, 2, 0.3]} castShadow receiveShadow />
            <CuboidCollider restitution={0.2} friction={1} args={[2, 0.1, 2 * length]} position={[0, -0.1, -(length * 2) + 2]} />
        </RigidBody>
    </>
}



export function Level({ count = 1, types = [BlockAxe,BlockDown,BlockCrossLaser,BlockLimbo,BlockSpinnerMove,BlockLaserHorizontal,BlockRight,BlockLeft,BlockLaserVertical,BlockSpinner] }, seed = 0) {



   


    //if any of count and types changes if calls same on renderer
    const blocks = useMemo(() => {
        const blocks = []

        for (let i = 0; i < count; i++) {
            const type = types[Math.floor(Math.random() * types.length)]
            blocks.push(type)
        }

        
        return blocks
    }, [count, types, seed])

    
    



    return <>


        <BlockStart position={[0, 0, 0]} />
        {blocks.map((Block, index) => <Block key={index} position={[0, 0, -(index + 1) * 4]} />)}
        <BlockEnd position={[0, 0, -(count + 1) * 4]} />
        <Bounds length={count + 2} />



    </>
}

