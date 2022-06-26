import React from 'react';
import CurrentTimeCell from './components/current-time-cell';
import PlaySoundCell from './components/play-sound-cell';
import TimerRow from './components/timer-row';

import './styles/reset.scss';
import styles from './styles.module.scss';

const App = () => {
  return (
    <div className={styles.appWrapper}>
      <div className={styles.app}>
        <div className={styles.topRow}>
          <CurrentTimeCell />
          <PlaySoundCell />
        </div>
        <div className={styles.timerRow}>
          <TimerRow />
        </div>
      </div>
    </div>
  );
}

export default App;
