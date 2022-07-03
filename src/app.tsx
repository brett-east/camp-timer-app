import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import CurrentTimeCell from './components/current-time-cell';
import PlaySoundCell from './components/play-sound-cell';
import TimerRow from './components/timer-row';

import './styles/reset.scss';
import styles from './styles.module.scss';

const App = () => {
  const [timerRowArray, setTimerRowArray] = useState<string[]>([]);

  const handleAddNewRow = () => {setTimerRowArray([...timerRowArray, uuidv4()])};

  return (
    <div className={styles.appWrapper}>
      <div className={styles.app}>
        <div className={styles.topRow}>
          <CurrentTimeCell />
          <PlaySoundCell />
        </div>
        <div className={styles.timerSection}>
          <div className={styles.headerRow}>
            <p>
              Auto timer
            </p>
            <button
              onClick={handleAddNewRow}
              className={styles.addButton}
            >
              Sort by time
            </button>
            <button
              onClick={handleAddNewRow}
              className={styles.addButton}
            >
              +
            </button>
          </div>
          {timerRowArray.map(timerRow => (
            <TimerRow
              key={timerRow}
              id={timerRow}
              addNewRow={handleAddNewRow}
              removeRow={() => setTimerRowArray(timerRowArray.filter(id => id !== timerRow))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
