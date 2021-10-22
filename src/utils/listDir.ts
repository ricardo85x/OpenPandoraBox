import RNFS from "react-native-fs"

interface listDirProps {
    directory: string,
    showFiles: boolean,
    showDir: boolean,
    regexFilter?: string
}

export const listDir = async ({ 
        directory, showFiles = true, showDir = true, regexFilter = undefined 
    } : listDirProps ) => {
    try {

        if (!! directory && (await RNFS.exists(directory))) {

            let data = []

            const listOfFiles = await RNFS.readDir(directory);

            if (listOfFiles.length) {
                for (let i = 0; i < listOfFiles.length; i++) {
                    const file = listOfFiles[i];

                    const is_directory = file.isDirectory();
                    
                    if(!showFiles && !is_directory) {
                        continue;
                    }
                    if(!showDir && is_directory) {
                        continue;
                    }

                    if(regexFilter){
                        if (!file.name.match(regexFilter)){
                            continue;
                        }
                    }
                    
                    data.push({ 
                        value: file.name, 
                        type: file.isDirectory() ? "dir" : "file",
                        dir: directory
                    })
                }
            }
            return {
                status: "success",
                data
            }
        } else {


            return {
                status: "error",
                data: [],
                message: `Directory not found: ${directory}`
            }
        }


    } catch (e: any) {
        console.log("Error on listDir", e.message)

        return {
            status: "error",
            data: [],
            message: `Error: ${e.message}`
        }
    }  
  }