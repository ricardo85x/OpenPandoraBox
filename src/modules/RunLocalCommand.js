import { NativeModules } from 'react-native';

export const RunLocalCommand = () => {
    const { RunLocalCommandModule } = NativeModules;    
    return RunLocalCommandModule;
};

