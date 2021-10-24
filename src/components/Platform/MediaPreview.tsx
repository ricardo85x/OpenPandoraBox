import React, { useRef, useEffect, useState } from 'react';

import { Image } from 'react-native';
import Video from 'react-native-video';

import { FileSystemHelper } from "../../utils/FileUtils"
import { IRomPlatform } from '../../utils/types';

interface MediaPreviewProps {
    selectedGame: IRomPlatform
    APP_HEIGHT: number
    onBackground: boolean

}

export const MediaPreview = ({ selectedGame, APP_HEIGHT, onBackground }: MediaPreviewProps) => {

    const timeoutRef = useRef<NodeJS.Timeout>(setTimeout(() => console.log('loading MediaPreview'), 0)  )
    const [loadVideo, setLoadVideo] = useState(false);
    const [loadImage, setLoadImage] = useState(false)


    const handleLoadVideo = async () => {

        const { checkFile } = FileSystemHelper()

        if (await checkFile({ 
            file_path: selectedGame?.video,
            minSizeKb: 300,
            valid_extensions: [".mp4"]

        })) {
            setLoadVideo(true)
        }

    }

    const handleLoadImage = async () => {

        const { checkFile } = FileSystemHelper()

        if (await checkFile({ 
            file_path: selectedGame?.image,
            minSizeKb: 20,
            valid_extensions: [".jpeg", "jpg", "png"]
        })) {
            setLoadImage(true)
        }

    }

    useEffect(() => {
        handleLoadImage()
    }, [])

    useEffect(() => {

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        setLoadVideo(false)
        timeoutRef.current = setTimeout(() => {

            handleLoadVideo()

        }, 2000)

        return () => { clearTimeout(timeoutRef.current) }

    }, [selectedGame])

    return (
        <>
            {
                loadVideo &&
                onBackground == false
                ? (

                    <Video
                        source={{ uri: `${selectedGame.video}` }}
                        repeat={true}
                        muted={true}
                        resizeMode={"contain"}

                        style={{
                            alignSelf: "center",
                            width: '100%',
                            height: APP_HEIGHT * 0.5
                        }}
                    />

                ) : loadImage && (
                    <Image
                        source={{ uri: `${selectedGame.image}` }}
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