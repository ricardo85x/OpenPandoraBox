import {decode} from 'html-entities';

import { Dimensions } from 'react-native';

export const Utils = () => {

    const decodeText = (text: string) => {

        if(text){
            return decode(text, {level: 'html5'})
        } else {
            return ""
        }
    }

    const APP_HEIGHT = Dimensions.get('window').height
    const APP_WIDTH = Dimensions.get('window').width

    return {
        decodeText,
        APP_HEIGHT,
        APP_WIDTH
    }
}