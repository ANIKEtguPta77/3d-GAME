
import { useFrame } from '@react-three/fiber'
import { BallCollider, RigidBody, useRapier } from '@react-three/rapier'
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'
import useGame from './stores/useGame'

const Player = () => {

    //check for key pressed
    const body = useRef()
    const [subscribedKeys, getKeys] = useKeyboardControls()

    const { rapier, world } = useRapier()
    const rapierWorld = world


    //for lerping that is camera is going to be bit closer to where it need to be for smooth camera movement
    const [smoothedCameraPosition] = useState(() => new THREE.Vector3(10, 10, 10))
    const [smoothedCameraTarget] = useState(() => new THREE.Vector3())



    //for start game
    const start = useGame((state) => state.start)
    const end = useGame((state) => state.end)
    const restart = useGame((state) => state.restart)
    const blocksCount = useGame((state) => state.blocksCount)
   
    const updateBallPosition=useGame((state)=>state.updateBallPosition)



    const jump = () => {

        //to avoid double jump
        const origin = body.current.translation()
        origin.y -= 0.31

        const direction = { x: 0, y: -1, z: 0 }

        //casting a array
        const ray = new rapier.Ray(origin, direction)


        //cacthing the ray and calcultaint g time of impact
        const hit = rapierWorld.castRay(ray, 10, true)

        if (hit.toi < 0.15) {
            body.current.applyImpulse({ x: 0, y: 0.55, z: 0 })
        }
    }



    /* for ball to reset */

    const reset=()=>
    {
        body.current.setTranslation({x:0,y:0,z:0})
        body.current.setLinvel({x:0,y:0,z:0})
        body.current.setAngvel({x:0,y:0,z:0})

    }

    useEffect(() => {


        //for game subsribe

        const unsubsrcibeReset=useGame.subscribe(
            (state)=>state.phase,//this is for state of phase change calls a funciton if changed
            (value)=>
            {
                if(value==='ready')
                reset()
            }
        )


        //when jump key is pressed
        const unsubsrcibeJump = subscribedKeys(
            (state) => {
                return state.jump
            },
            (value) => {
                if (value)
                    jump()
            }
        )


        //when any key is pressed
        const unsubsrcibeAny = subscribedKeys(
            () => {
                //this is function in creategame to start the game
                start()
            }
        )

        //called when function destroys
        return () => {
            unsubsrcibeReset()
            unsubsrcibeJump()
            unsubsrcibeAny()
        }
    }, [])



    useFrame((state, delta) => {

        /* //Controls */
       

        const { forward, backward, leftward, rightward } = getKeys()

        const impulse = { x: 0, y: 0, z: 0 }
        const torque = { x: 0, y: 0, z: 0 }

        const impluseStrength = 0.3 * delta
        const torqueStrength = 0.2 * delta

        if (forward) {
            impulse.z -= impluseStrength
            torque.x -= torqueStrength
        }

        if (backward) {
            impulse.z += impluseStrength
            torque.x += torqueStrength
        }

        if (rightward) {
            impulse.x += impluseStrength
            torque.z -= torqueStrength
        }

        if (leftward) {
            impulse.x -= impluseStrength
            torque.z += torqueStrength
        }

        body.current.applyImpulse(impulse)
        body.current.applyTorqueImpulse(torque)



        /* //Camera */


        //we need to know the bodypositon to follow
        const bodyPosition = body.current.translation()

        updateBallPosition([bodyPosition.x,bodyPosition.y,bodyPosition.z])
        const cameraPosition = new THREE.Vector3()
        cameraPosition.copy(bodyPosition)
        cameraPosition.z += 2.25
        cameraPosition.y += 0.65
        

        const cameraTarget = new THREE.Vector3()
        cameraTarget.copy(bodyPosition)
        cameraTarget.y += 0.25
        


        //updating for smmoth camera movement goung 1/10th closer to it 
        smoothedCameraPosition.lerp(cameraPosition, 10 * delta)
        smoothedCameraTarget.lerp(cameraTarget, 10 * delta)


        //camera already in state

        state.camera.position.copy(smoothedCameraPosition)
        state.camera.lookAt(smoothedCameraTarget)




        /* 
          phases
         */
          console.log(bodyPosition.z,-((blocksCount+1)*4-2))
        if (bodyPosition.z < -((blocksCount+1) * 4 - 2)) {
           
            end(1)
        }


        if (bodyPosition.y < 0) {
            restart()
        }

    })





    return <>

        {/* To avoid the body to sleep to make the arrowskey move */}
        dampling stops the rotation and translation after some time
        <RigidBody
            ref={body}
            canSleep={false}
            colliders="ball"
            restitution={0.2}
            friction={0}
            position={[0, 1, 0]}
            linearDamping={0.3}
            angularDamping={0.3}>
            <mesh castShadow>
                <icosahedronGeometry args={[0.3, 1]} />
                <meshStandardMaterial flatShading color="mediumpurple" />
            </mesh>
        </RigidBody>

    </>
}

export default Player