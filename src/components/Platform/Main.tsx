import React from 'react';
import { View } from 'react-native';

import { useSettingsContext } from "../../hooks/useSettings";

import { Body } from "./Body"
import { Header } from "./Header"
import { Footer } from "../Footer/index"
import { IRomPlatform } from '../../utils/types';
import { usePlatformContext } from './PlatformContext';

interface MainProps {
    title: string;
    selectedGame: IRomPlatform | undefined;
    onBackground: boolean;
    buttonAction: (...args: any[]) => void;
}

export const Main = ({title, selectedGame, onBackground, buttonAction}: MainProps) => {

    const { APP_WIDTH, APP_HEIGHT } = useSettingsContext()

    const { footerItems } = usePlatformContext()


    return (

        <View style={{
            height: APP_HEIGHT,
            width: APP_WIDTH * 0.65,
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column"
        }}>
            <Header defaultTitle={"Platform"} title={title} gameName={selectedGame?.name} />
            
            <Body onBackground={onBackground} selectedGame={selectedGame} />
            {/* <Footer /> */}

            <Footer
                buttonAction={buttonAction}
                items={footerItems}
          />
        </View>
    )
}
