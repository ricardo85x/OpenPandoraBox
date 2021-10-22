import RNFS from "react-native-fs"

interface checkFileProps {
    file_path: string,
    valid_extensions: string[],
    minSizeKb: number
}

export const FileSystemHelper = () => {

    const checkFile = async ({ 
        file_path , valid_extensions = [], minSizeKb = 1 
    }: checkFileProps ) => {

        const minSize = minSizeKb * 1000; // 300 kb

        if (!! file_path) {

            let pass_extension = false

            if (valid_extensions.length === 0) {
                pass_extension = true
            } else {
                valid_extensions.forEach(ext => {
                    if (ext.length > 0 && file_path.toLowerCase().endsWith(ext.toLowerCase())) {
                        pass_extension = true;
                    }
                })
            }

            if (pass_extension && (await RNFS.exists(file_path))) {
                const fileStat = await RNFS.stat(file_path)
                if (fileStat.isFile() && Number(fileStat.size) > minSize) {
                    return true;
                }
            }
        }

        return false;

    }

    return {
        checkFile
    }

}