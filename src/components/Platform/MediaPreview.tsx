import React, { useRef, useEffect, useState } from 'react';

import { Image, Text } from 'react-native';
import Video from 'react-native-video';

import { FileSystemHelper } from "../../utils/FileUtils"
import { IRomPlatform } from '../../utils/types';

import { useDbContext } from "../../hooks/useDb"
import { useSettingsContext } from "../../hooks/useSettings"

interface MediaPreviewProps {
    selectedGame: IRomPlatform
    APP_HEIGHT: number
    onBackground: boolean

}

export const MediaPreview = ({ selectedGame, APP_HEIGHT, onBackground }: MediaPreviewProps) => {

    const {db} = useDbContext();

    const {APP_WIDTH} = useSettingsContext();


    const timeoutRef = useRef<NodeJS.Timeout>(setTimeout(() => true, 0)  )
    const timeoutRefImage = useRef<NodeJS.Timeout>(setTimeout(() => true, 0)  )
    const [loadVideo, setLoadVideo] = useState(false);
    const [loadImage, setLoadImage] = useState(false)
    const [loadDescription, setLoadDescription] = useState(false)
    const [desc, setDesc] = useState("")


    const handleLoadVideo = async () => {

        const { checkFile } = FileSystemHelper()

        if(selectedGame?.video){
            if (await checkFile({ 
                file_path: selectedGame.video,
                minSizeKb: 300,
                valid_extensions: [".mp4"]
    
            })) {
                setLoadVideo(true)
            }
        }


        

    }

    const handleLoadDescription = async () => {

        if(db && selectedGame?.id){

            const _desc = await db.getDescription(selectedGame.id)

            setDesc(_desc)

            if(!! _desc){
                setLoadDescription(true)
            }
        }
        
    }

    const handleLoadImage = async () => {

        const { checkFile } = FileSystemHelper()

        if(selectedGame?.image){
            if (await checkFile({ 
                file_path: selectedGame.image,
                minSizeKb: 20,
                valid_extensions: [".jpeg", "jpg", "png"]
            })) {
                setLoadImage(true)
            }
        }

        handleLoadDescription()


       

    }

    useEffect(() => {

        if (timeoutRefImage.current) {
            clearTimeout(timeoutRefImage.current)
        }
        setLoadImage(false)
        setLoadDescription(false)
        timeoutRefImage.current = setTimeout(() => {
            handleLoadImage()
            
        }, 100)

        return () => { clearTimeout(timeoutRefImage.current) }

    }, [selectedGame])

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

            { loadDescription && !! desc && (
                <Text style={{
                    width: (APP_WIDTH * 0.65) - 20,
                    alignSelf: "center",
                    color: '#E2E8F0',
                    overflow: "hidden",
                    paddingTop: 5,
                    textAlign: "center"
                }} >
                    {desc}
                </Text>
            )}


        </>
    )
}