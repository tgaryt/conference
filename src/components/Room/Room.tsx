import React, { useEffect, useRef } from 'react';
import BackgroundSelectionDialog from '../BackgroundSelectionDialog/BackgroundSelectionDialog';
import ChatWindow from '../ChatWindow/ChatWindow';
import clsx from 'clsx';
import { GalleryView } from '../GalleryView/GalleryView';
import { MobileGalleryView } from '../MobileGalleryView/MobileGalleryView';
import MainParticipant from '../MainParticipant/MainParticipant';
import { makeStyles, Theme, useMediaQuery, useTheme } from '@material-ui/core';
import { Participant, Room as IRoom } from 'twilio-video';
import { ParticipantAudioTracks } from '../ParticipantAudioTracks/ParticipantAudioTracks';
import ParticipantList from '../ParticipantList/ParticipantList';
import { useAppState } from '../../state';
import useChatContext from '../../hooks/useChatContext/useChatContext';
import useScreenShareParticipant from '../../hooks/useScreenShareParticipant/useScreenShareParticipant';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useAutoMutePrivacy from '../../hooks/useAutoMutePrivacy/useAutoMutePrivacy';

const useStyles = makeStyles((theme: Theme) => {
	const totalMobileSidebarHeight = `${theme.sidebarMobileHeight +
		theme.sidebarMobilePadding * 2 +
		theme.participantBorderWidth}px`;
	return {
		container: {
			position: 'relative',
			height: '100%',
			display: 'grid',
			gridTemplateColumns: `1fr ${theme.sidebarWidth}px`,
			gridTemplateRows: '100%',
			[theme.breakpoints.down('sm')]: {
				gridTemplateColumns: `100%`,
				gridTemplateRows: `calc(100% - ${totalMobileSidebarHeight}) ${totalMobileSidebarHeight}`,
			},
		},
		rightDrawerOpen: { gridTemplateColumns: `1fr ${theme.sidebarWidth}px ${theme.rightDrawerWidth}px` },
	};
});

export function useSetSpeakerViewOnScreenShare(
	screenShareParticipant: Participant | undefined,
	room: IRoom | null,
	setIsGalleryViewActive: React.Dispatch<React.SetStateAction<boolean>>,
	isGalleryViewActive: boolean
) {
	const isGalleryViewActiveRef = useRef(isGalleryViewActive);

	useEffect(() => {
		isGalleryViewActiveRef.current = isGalleryViewActive;
	}, [isGalleryViewActive]);

	useEffect(() => {
		if (screenShareParticipant && screenShareParticipant !== room!.localParticipant) {
			const prevIsGalleryViewActive = isGalleryViewActiveRef.current;
			setIsGalleryViewActive(false);
			return () => {
				if (prevIsGalleryViewActive) {
					setIsGalleryViewActive(prevIsGalleryViewActive);
				}
			};
		}
	}, [screenShareParticipant, setIsGalleryViewActive, room]);
}

export default function Room() {
	const classes = useStyles();
	const { isChatWindowOpen } = useChatContext();
	const { isBackgroundSelectionOpen, room } = useVideoContext();
	const { isGalleryViewActive, setIsGalleryViewActive } = useAppState();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const screenShareParticipant = useScreenShareParticipant();

	useAutoMutePrivacy();

	useSetSpeakerViewOnScreenShare(screenShareParticipant, room, setIsGalleryViewActive, isGalleryViewActive);

	return (
		<div
			className={clsx(classes.container, {
				[classes.rightDrawerOpen]: isChatWindowOpen || isBackgroundSelectionOpen,
			})}
		>
			<ParticipantAudioTracks />

			{isGalleryViewActive ? (
				isMobile ? (
					<MobileGalleryView />
				) : (
					<GalleryView />
				)
			) : (
				<>
					<MainParticipant />
					<ParticipantList />
				</>
			)}

			<ChatWindow />
			<BackgroundSelectionDialog />
		</div>
	);
}
