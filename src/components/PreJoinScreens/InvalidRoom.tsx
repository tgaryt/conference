import React, { useState, useEffect, FormEvent } from 'react';
import InvalidRoomScreen from './RoomNameScreen/InvalidRoomScreen';
import IntroContainer from '../IntroContainer/IntroContainer';

export enum Steps {
  roomNameStep,
  deviceSelectionStep,
}

export default function PreJoinScreens() {
  return (
    <IntroContainer>
      <InvalidRoomScreen />
    </IntroContainer>
  );
}
