import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Internals} from 'remotion';
import {
	AudioContextMetadata,
	getAudioMetadata,
} from '../helpers/get-audio-metadata';
import {getWaveformPortion} from '../helpers/get-waveform-portion';
import {TIMELINE_LAYER_HEIGHT} from '../helpers/timeline-layout';
import {AudioWaveformBar} from './AudioWaveformBar';

const container: React.CSSProperties = {
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	position: 'absolute',
	height: TIMELINE_LAYER_HEIGHT,
};

const canvasStyle: React.CSSProperties = {
	position: 'absolute',
};

export const AudioWaveform: React.FC<{
	src: string;
	visualizationWidth: number;
	fps: number;
	startFrom: number;
	duration: number;
	setMaxMediaDuration: React.Dispatch<React.SetStateAction<number>>;
	volume: string | number;
}> = ({
	src,
	fps,
	startFrom: baseStartFrom,
	duration: baseDuration,
	visualizationWidth,
	setMaxMediaDuration,
	volume,
}) => {
	const [metadata, setMetadata] = useState<AudioContextMetadata | null>(null);

	const {
		startFrom,
		durationInFrames,
	} = Internals.getAudioRangeFromStartFromAndDuration({
		startFrom: baseStartFrom,
		durationInFrames: baseDuration,
	});
	const canvas = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (!canvas.current) {
			return;
		}
		const context = canvas.current.getContext('2d');
		if (!context) {
			return;
		}
		context.clearRect(0, 0, visualizationWidth, TIMELINE_LAYER_HEIGHT);
		if (typeof volume === 'number') {
			// The volume is a number, meaning it could change on each frame-
			// User did not use the (f: number) => number syntax, so we can't draw
			// a visualization.
			return;
		}

		const volumes = volume.split(',').map((v) => Number(v));
		context.beginPath();
		context.moveTo(0, TIMELINE_LAYER_HEIGHT);
		volumes.forEach((v, index) => {
			const x = (index / (volumes.length - 1)) * visualizationWidth;
			const y = (1 - v) * (TIMELINE_LAYER_HEIGHT - 2);
			if (index === 0) {
				context.moveTo(x, y);
			} else {
				context.lineTo(x, y);
			}
		});
		context.strokeStyle = 'rgba(255, 255, 255, 0.7)';
		context.stroke();
	}, [visualizationWidth, metadata, durationInFrames, startFrom, volume]);

	useEffect(() => {
		getAudioMetadata(src)
			.then((data) => {
				setMaxMediaDuration(Math.floor(data.duration * fps));
				setMetadata(data);
			})
			.catch((err) => {
				console.error(`Could not load waveform for ${src}`, err);
			});
	}, [fps, setMaxMediaDuration, src]);

	const normalized = useMemo(() => {
		if (!metadata || metadata.numberOfChannels === 0) {
			return [];
		}

		return getWaveformPortion({
			metadata,
			startFrom,
			fps,
			durationInFrames,
			visualizationWidth,
		});
	}, [durationInFrames, fps, metadata, startFrom, visualizationWidth]);

	if (!metadata) {
		return null;
	}
	return (
		<div style={container}>
			{normalized.map((w) => {
				return <AudioWaveformBar key={w.index} amplitude={w.amplitude} />;
			})}
			<canvas
				ref={canvas}
				style={canvasStyle}
				width={visualizationWidth}
				height={TIMELINE_LAYER_HEIGHT}
			/>
		</div>
	);
};
