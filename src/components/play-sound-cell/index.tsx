import React from 'react';

import styles from './styles.module.scss';

interface PlaySoundCellProps {

}

const PlaySoundCell = (props: PlaySoundCellProps) => {
  return (
    <div className={styles.playSoundCell}>
      <p>
        play sound PlaySoundCell
      </p>
    </div>
  );
};

export default PlaySoundCell;
