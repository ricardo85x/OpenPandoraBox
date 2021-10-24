import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

import {FooterItem} from './FooterItem';

import {useSettingsContext} from '../../hooks/useSettings';

interface FooterProps {
  items: any[];
  buttonAction: (...args: any[]) => void;
}

export const Footer = ({items = [], buttonAction}: FooterProps) => {
  const {themeColor} = useSettingsContext();

  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      colors={[themeColor[3], themeColor[4], themeColor[5]]}
      style={{
        width: '100%',
        height: 50,
        display: 'flex',
        justifyContent: 'space-around',
        alignContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderTopColor: '#4A5568',
        borderTopWidth: 2,
      }}>
      {items.map((item) => (
        <FooterItem
          buttonAction={buttonAction}
          key={item.title}
          btnName={item.title}
          btnText={item.text}
        />
      ))}
    </LinearGradient>
  );
};
