import React, { useRef, useEffect, useState } from 'react';
import { Image } from 'react-native';
import Video from 'react-native-video';

export const MediaPreview = ({ selectedGame, APP_HEIGHT, APP_WIDTH, onBackground }) => {

    const timeoutRef = useRef()
    const [loadVideo, setLoadVideo] = useState(false);

    useEffect(() => {

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        setLoadVideo(false)
        timeoutRef.current = setTimeout(() => {
            setLoadVideo(true)
        }, 2000)

        return () => { clearTimeout(timeoutRef.current) }

    }, [selectedGame])

    return (
        <>
            {
                loadVideo && 
                !! selectedGame?.video &&
                selectedGame.video.length > "file:///".length &&
                onBackground == false
                
                ? (

                    <Video
                        source={{ uri: `${selectedGame?.video}` }}
                        repeat={true}
                        muted={true}
                        resizeMode={"contain"}

                        style={{
                            alignSelf: "center",
                            width: '100%',
                            height: APP_HEIGHT * 0.5
                        }}
                    />

                ) : (
                    <Image
                        source={{ uri: `${selectedGame?.image}` }}
                        style={{
                            alignSelf: "center",
                            width: '100%',
                            height: APP_HEIGHT * 0.5
                        }}
                        resizeMode={'center'}
                    />
                )
            }
        </>
    )
}