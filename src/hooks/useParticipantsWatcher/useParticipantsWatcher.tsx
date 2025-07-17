import { useEffect, useState } from 'react';
import { RemoteParticipant } from 'twilio-video';
import useVideoContext from '../useVideoContext/useVideoContext';

export default function useParticipantsWatcher() {
  const [isSnackbarDismissed, setIsSnackbarDismissed] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const { room } = useVideoContext();

  useEffect(() => {
    const audioJoin = new Audio('/sounds/Az_Meet_Join_Sound_Effect.mp3');
    const audioLeave = new Audio('/sounds/Az_Meet_End_Call_Sound_Effect.mp3');

    if (room) {
      const participantConnected = (participant: RemoteParticipant) => {
        setSnackbarText(`${participant.identity} joined`);
        audioJoin.play();
        setIsSnackbarDismissed(true);
      };
      const participantDisconnected = (participant: RemoteParticipant) => {
        setSnackbarText(`${participant.identity} left`);
        setIsSnackbarDismissed(true);
        audioLeave.play();
      };
      room.on('participantConnected', participantConnected);
      room.on('participantDisconnected', participantDisconnected);
      return () => {
        room.off('participantConnected', participantConnected);
        room.off('participantDisconnected', participantDisconnected);
      };
    }
  }, [room]);

  return { isActiveSnackbar: isSnackbarDismissed, setSnackbarDismissed: setIsSnackbarDismissed, snackbarText };
}
