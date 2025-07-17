import { Participant } from 'twilio-video';
import useVideoContext from '../useVideoContext/useVideoContext';

export default function useKickOut(participant?: Participant) {
  const { room } = useVideoContext();
  const removeUserEndpoint = process.env.REACT_APP_ENDPOINT
    ? process.env.REACT_APP_ENDPOINT + '/disconnect-participant'
    : '/disconnect-participant';
  const dissconnectUser = (room: any, user: any) => {
    return fetch(removeUserEndpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        room: room,
        user: user,
      }),
    });
  };
  // useEffect(() => {

  // }, [room]);
  const removeUser = () => {
    dissconnectUser(room?.sid, participant?.sid);
  };

  return { removeUser };
}
