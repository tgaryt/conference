import React from 'react';
import RoomLoadingScreen from './RoomLoadingScreen/RoomLoadingScreen';
import IntroContainer from '../IntroContainer/IntroContainer';

export enum Steps {
  roomNameStep,
  deviceSelectionStep,
}

export default function PreJoinScreens() {
  return (
    <IntroContainer>
      <RoomLoadingScreen />
    </IntroContainer>
  );
}
