import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'


export default create(subscribeWithSelector(

    


    (set) => {
        //all the global information will be stored here
        return {
            blocksCount: 30,
            blocksSeed:0,
            ballPosition:[0,0,0],



            //Sounds
            game_sounds:[new Audio('./1.mp3'),new Audio('./2.mp3'),new Audio('./3.mp3')],
            restart_sound:new Audio('./restart.mp3'),
            end_sound:new Audio('./end.mp3'),
            choice:0,


            /* Time */
            startTime:0,
            endTime:0,


            //Phases

            phase: 'ready',


            //Funciton to set the ball position
            updateBallPosition:(pos)=>{
                set((state)=>{

                   
                    return {ballPosition:pos}
                })
            }
            ,


            //This function need to be called to change the phase properyt in store
            start: () => {

                set((state) => {

                    if (state.phase === 'ready'){
                        
                        state.end_sound.pause()
                        state.end_sound.current_time=0

                        state.restart_sound.pause()
                        state.restart_sound.current_time=0


                        var x=Math.floor(Math.random()*3)
                        state.game_sounds[x].play()
                        state.game_sounds[x].volume=0.1
                        return { phase: 'playing',startTime:Date.now(),choice:state.game_sounds[x]}
                    }

                    return {}
                })
            },

            restart: () => {

                set((state) => {

                    if (state.phase == 'playing' || state.phase === 'ended'){

                       
                        state.end_sound.pause()
                        state.end_sound.current_time=0

                        state.choice.pause()
                        state.choice.current_time=0
                        
                       state.restart_sound.play()

                       state.end_sound.pause()
                       state.end_sound.current_time=0
                        return { phase: 'ready' ,blocksSeed:Math.random()}
                    }

                    return {}
                })
            },

            end: (flag) => {
                set((state) => {

                    if (state.phase === 'playing'){
                       
                        console.log("end")
                        
                        state.choice.pause()
                        state.choice.current_time=0

                        if(flag)
                        state.end_sound.play()

                        return { phase: 'ended' ,endTime:Date.now()}
                    }

                    return {}
                })
            },

        }
    }
))