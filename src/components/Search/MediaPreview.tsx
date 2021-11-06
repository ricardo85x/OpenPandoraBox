import React, { useRef, useEffect, useState } from 'react';

import { Image, View } from 'react-native';
import Video from 'react-native-video';

import { FileSystemHelper } from "../../utils/FileUtils"

import { useKeyboardContext } from "../../hooks/keyboardHook"
import { IRomSearch } from '../../utils/types';

interface MediaPreviewProps {
    selectedGame: IRomSearch | undefined
    APP_HEIGHT: number;
    onBackground: boolean;
}

export const MediaPreview = ({ selectedGame, APP_HEIGHT, onBackground } : MediaPreviewProps) => {

    const timeoutRef = useRef(setTimeout(() => true, 0))
    const [loadVideo, setLoadVideo] = useState(false);
    const [loadImage, setLoadImage] = useState(false)
    const { keyBoardHeight } = useKeyboardContext()

    const handleLoadVideo = async () => {

        const { checkFile } = FileSystemHelper()

        if (await checkFile({ 
            file_path: selectedGame?.video ?? "",
            minSizeKb: 300,
            valid_extensions: [".mp4"]

        })) {
            setLoadVideo(true)
        } else {
            setLoadVideo(false)
        }

    }

    const handleLoadImage = async () => {

        const { checkFile } = FileSystemHelper()

        if (await checkFile({ 
            file_path: selectedGame?.image ?? "",
            minSizeKb: 20,
            valid_extensions: [".jpeg", "jpg", "png"]
        })) {
            setLoadImage(true)
        } else {
            setLoadImage(false)

        }

    }

  

    useEffect(() => {

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        setLoadVideo(false)
        setLoadImage(false)

        handleLoadImage()


        timeoutRef.current = setTimeout(() => {

            handleLoadVideo()

        }, 2000)

        return () => { clearTimeout(timeoutRef.current) }

    }, [selectedGame])

    return (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            
            {
                loadVideo &&
                onBackground == false && selectedGame?.video
                ? (

                    <Video
                        source={{ uri: `${selectedGame.video}` }}
                        repeat={true}
                        muted={true}
                        resizeMode={"contain"}

                        style={{
                            alignSelf: "center",
                            width: '100%',
                            height: APP_HEIGHT - 50 - 50 - keyBoardHeight - 20
                           
                        }}
                    />

                ) : loadImage && selectedGame?.image && (
                    <Image
                        source={{ uri: `${selectedGame.image}` }}
                        style={{
                            alignSelf: "center",
                            width: '100%',
                            height: APP_HEIGHT - 50 - 50 - keyBoardHeight - 20
                        }}
                        resizeMode={'contain'}
                    />
                ) 
            }
        </View>
    )
}