var parser = require('fast-xml-parser');
import RNFS from "react-native-fs"
import { IGameList } from "./types";

interface GameListJsonDataProps {
    gameList: {
        game: IGameList[]
    }
}

export const ParseGameList = () => {

    const getJsonData = async (gameListPath = "")  => {

        try {
            if (await RNFS.exists(gameListPath)){
                const xmlData = await RNFS.readFile(gameListPath, 'utf8');

                if( parser.validate(xmlData) === true) { //optional (it'll return an object in case it's not valid)
                    var jsonObj : GameListJsonDataProps = parser.parse(xmlData,{});

                    return jsonObj;
                } else {
                    console.log("INVALID XML DATA",xmlData)
                }
            } 
        } catch (e) {
            console.log("Error PARSE", e)
        }
        return { gameList : { game: []}}
    }

    return {
        getJsonData
    }
}