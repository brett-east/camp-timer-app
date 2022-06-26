import React, { useState } from 'react';

import styles from './styles.module.scss';

interface PlaySoundCellProps {

}

const PlaySoundCell = (props: PlaySoundCellProps) => {
  const SOUND_PATH = '/sounds';
  const [selectedSound, setSelectedSound] = useState(`${process.env.PUBLIC_URL}${SOUND_PATH}/first_call.mp3`);
  const [playing, setPlaying] = useState(false);
  return (
    <div className={styles.playSoundCell}>
      <select
        className={styles.dropDown}
        onChange={(e) => (setSelectedSound(`${process.env.PUBLIC_URL}${SOUND_PATH}/${e.target.value}`))}
      >
        {SOUNDS.map(sound => (
          <option
            key={sound.id}
            value={sound.track}
          >
            {sound.title}
          </option>
        ))}
      </select>
      <audio
        className={styles.audioPlayer}
        controls
        src={selectedSound}
      >
        Your browser does not support the
        <code>audio</code> element.
      </audio>
    </div>
  );
};

export default PlaySoundCell;

const SOUNDS = [
  {
    id: 'firstCall',
    title: 'First call',
    track: 'first_call.mp3',
  },
  {
    id: 'flagDown',
    title: 'Flag down',
    track: 'flag_down.mp3',
  },
  {
    id: 'flagUp',
    title: 'Flag up',
    track: 'flag_up.mp3',
  },
  {
    id: 'reveille',
    title: 'Reveille',
    track: 'reveille.mp3',
  },
  {
    id: 'sticks',
    title: 'Sticks',
    track: 'sticks.mp3',
  },
  {
    id: 'taps',
    title: 'Taps',
    track: 'taps.mp3',
  },
];
