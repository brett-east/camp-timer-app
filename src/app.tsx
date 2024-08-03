import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';

import CurrentTimeCell from './components/current-time-cell';
import PlaySoundCell from './components/play-sound-cell';
import TimerRow from './components/timer-row';

import './styles/reset.scss';
import styles from './styles.module.scss';

const LOCAL_STORAGE_ITEM = 'campTimerTimes';

export const useInterval = (
  callback: () => void,
  delay: number | null | false,
): void => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const savedCallback = useRef(() => {});

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Set up the interval.
  useEffect(() => {
    if (delay === null || delay === false) return undefined;
    const tick = () => savedCallback.current();
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
};

export const useClock = () => {
  const [time, setTime] = useState<string>('');
  useInterval(() => {
    const displayTime = dayjs().format('hh:mm:ssa');

    setTime(displayTime);
  }, 500);
  return time;
};

export interface ITimerRow {
  id: string;
  time: dayjs.Dayjs | null;
  track: string;
}

const App = () => {
  const [timerRowArray, setTimerRowArray] = useState<ITimerRow[]>([]);
  const time = useClock();

  useEffect(() => {
    const storedTimerRows = localStorage.getItem(LOCAL_STORAGE_ITEM);
    if (!storedTimerRows || !storedTimerRows.includes('[')) {
      return;
    }
    if (storedTimerRows) {
      const parsedTimerRows = JSON.parse(storedTimerRows);
      const sanitisedTimerRows = parsedTimerRows.filter((r: ITimerRow) => {
        return r.hasOwnProperty('id') && r.hasOwnProperty('track') && r.hasOwnProperty('time')
      }).map((r: ITimerRow) => ({
        id: r.id,
        track: r.track,
        time: r.time ? dayjs(r.time) : r.time,
      }));

      setTimerRowArray(sanitisedTimerRows);
    }
  }, []);

  const handleAddNewRow = (index?: number) => {
    const id = uuidv4();
    const newRows = (index && index !== 0) ? ([
      ...timerRowArray.slice(0, index),
      {
        id,
        time: null,
        track: '',
      },
      ...timerRowArray.slice(index),
    ]) : ([
      ...timerRowArray,
      {
        id,
        time: null,
        track: '',
      },
    ]);
    setTimerRowArray(newRows);
    localStorage.setItem(LOCAL_STORAGE_ITEM, JSON.stringify(newRows));
  };

  const handleRemoveRow = (id: string) => {
    const newRows = timerRowArray.filter(timerRow => timerRow.id !== id);
    setTimerRowArray(newRows);
    localStorage.setItem(LOCAL_STORAGE_ITEM, JSON.stringify(newRows));
  }

  const updateRowState = ({ id, time, track }: ITimerRow) => {
    const updatedRows = timerRowArray.map((timerRow) => {
      if (timerRow.id === id) {
        return {
          id,
          time,
          track
        };
      }
      return timerRow;
    });
    localStorage.setItem(LOCAL_STORAGE_ITEM, JSON.stringify(updatedRows));
    setTimerRowArray(updatedRows);
  }

  const sortRows = () => {
    const sortedRows = timerRowArray.sort((a, b) => {
      if (a.time && b.time) {
        if (a.time.isBefore(b.time)) return -1;
        if (a.time.isAfter(b.time)) return 1;
        return 0;
      }
      if (a.time && !b.time) return -1;
      if (!a.time && b.time) return 1;
      return 0;
    });

    setTimerRowArray(sortedRows);
    localStorage.setItem(LOCAL_STORAGE_ITEM, JSON.stringify(sortedRows));
  }

  const handleResetButtonClick = () => {
    const result = window.confirm('Are you sure you want to remove all timers?');
    if (result) {
      resetRows();
    }
  }

  const resetRows = () => {
    setTimerRowArray([]);
    localStorage.setItem(LOCAL_STORAGE_ITEM, '[]');
  }

  return (
    <div className={styles.appWrapper}>
      <div className={styles.app}>
        <div className={styles.topRow}>
          <CurrentTimeCell
            time={time}
          />
          <PlaySoundCell />
        </div>
        <div className={styles.timerSection}>
          <div className={styles.headerRow}>
            <p className={styles.headerText}>
              Auto timer
            </p>
            <div className={styles.buttonSection}>
              <button
                onClick={handleResetButtonClick}
                className={styles.resetButton}
              >
                Reset
              </button>
              <button
                onClick={sortRows}
                className={styles.sortByTimeButton}
              >
                Sort by time
              </button>
              <button
                onClick={() => handleAddNewRow()}
                className={styles.addButton}
                title="Add row"
              >
                +
              </button>
            </div>
          </div>
          {timerRowArray.map((timerRow, index) => (
            <TimerRow
              updateRowState={updateRowState}
              key={timerRow.id}
              timerRow={timerRow}
              time={time}
              addNewRow={() => handleAddNewRow(index + 1)}
              removeRow={() => handleRemoveRow(timerRow.id)}
            />
          ))}
        </div>
      </div>
      <p className={styles.versionNumber}>
        Version: 1.0.1
      </p>
    </div>
  );
}

export default App;
