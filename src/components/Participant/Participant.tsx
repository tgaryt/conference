import React from 'react';
import ParticipantInfo from '../ParticipantInfo/ParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import { Participant as IParticipant } from 'twilio-video';

interface ParticipantProps {
  participant: IParticipant;
  videoOnly?: boolean;
  enableScreenShare?: boolean;
  onClick?: () => void;
  isSelected?: boolean;
  isLocalParticipant?: boolean;
  hideParticipant?: boolean;
  isDominantSpeaker?: boolean;
  isHost?: any;
}

export function Participant({
  participant,
  videoOnly,
  enableScreenShare,
  onClick,
  isSelected,
  isLocalParticipant,
  hideParticipant,
  isDominantSpeaker,
  isHost,
}: ParticipantProps) {
  return (
    <ParticipantInfo
      participant={participant}
      onClick={onClick}
      isSelected={isSelected}
      isLocalParticipant={isLocalParticipant}
      hideParticipant={hideParticipant}
      isDominantSpeaker={isDominantSpeaker}
      isHost={isHost}
    >
      <ParticipantTracks
        participant={participant}
        videoOnly={videoOnly}
        enableScreenShare={enableScreenShare}
        isLocalParticipant={isLocalParticipant}
      />
    </ParticipantInfo>
  );
}

export default React.memo(Participant);
