var parser = require('fast-xml-parser');
import RNFS from "react-native-fs"

export const ParseGameList = () => {

    const getJsonData = async (gamelistPath = "") => {

        try {
            if (await RNFS.exists(gamelistPath)){
                const xmlData = await RNFS.readFile(gamelistPath, 'utf8');

                if( parser.validate(xmlData) === true) { //optional (it'll return an object in case it's not valid)
                    var jsonObj = parser.parse(xmlData,{});

                    return jsonObj;
                } else {
                    console.log("INVALID XML DATA",xmlData)
                }

            } 
        } catch (e) {
            console.log("Error PARSE", e)
        }

        return []
        // return { error: "Error processing"}
    }

    return {
        getJsonData
    }
}