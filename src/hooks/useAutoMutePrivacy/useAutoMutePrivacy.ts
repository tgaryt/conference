import { useEffect, useRef } from 'react';
import { RemoteParticipant } from 'twilio-video';
import useVideoContext from '../useVideoContext/useVideoContext';

export default function useAutoMutePrivacy() {
	const { room } = useVideoContext();
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (!room) {
			return;
		}

		const startPrivacyTimer = () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			timeoutRef.current = setTimeout(() => {
				if (room.participants.size === 0) {
					const localParticipant = room.localParticipant;
					
					localParticipant.audioTracks.forEach(publication => {
						if (publication.track && publication.track.isEnabled) {
							publication.track.disable();
						}
					});

					localParticipant.videoTracks.forEach(publication => {
						if (publication.track && !publication.track.name.includes('screen') && publication.track.isEnabled) {
							const videoTrack = publication.track;
							localParticipant.unpublishTrack(videoTrack);
							localParticipant.emit('trackUnpublished', publication);
							videoTrack.stop();
						}
					});
				}
			}, 30000);
		};

		const checkAndManagePrivacy = () => {
			const participantCount = room.participants.size;

			if (participantCount === 0) {
				startPrivacyTimer();
			} else {
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
					timeoutRef.current = null;
				}
			}
		};

		const handleParticipantConnected = (participant: RemoteParticipant) => {
			checkAndManagePrivacy();
		};

		const handleParticipantDisconnected = (participant: RemoteParticipant) => {
			checkAndManagePrivacy();
		};

		const handleTrackPublished = () => {
			checkAndManagePrivacy();
		};

		checkAndManagePrivacy();

		room.on('participantConnected', handleParticipantConnected);
		room.on('participantDisconnected', handleParticipantDisconnected);
		room.localParticipant.on('trackPublished', handleTrackPublished);

		return () => {
			room.off('participantConnected', handleParticipantConnected);
			room.off('participantDisconnected', handleParticipantDisconnected);
			room.localParticipant.off('trackPublished', handleTrackPublished);
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [room]);
}
