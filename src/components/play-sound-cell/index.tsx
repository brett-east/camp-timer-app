import React, { useState } from 'react';
import { SOUNDS, SOUND_PATH } from '../../constants';

import styles from './styles.module.scss';

interface PlaySoundCellProps {

}

const PlaySoundCell = (props: PlaySoundCellProps) => {
  const [selectedSound, setSelectedSound] = useState(`${process.env.PUBLIC_URL}${SOUND_PATH}/announcement.mp3`);

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
