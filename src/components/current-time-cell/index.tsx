import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';

import styles from './styles.module.scss';

const useInterval = (
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
    const displayTime = dayjs().format('HH:mm:ssa');

    setTime(displayTime);
  }, 500);
  return time;
};

interface CurrentTimeCellProps {

}

const CurrentTimeCell = (props: CurrentTimeCellProps) => {
  const time = useClock();
  return (
    <div className={styles.currentTimeCell}>
      <p className={styles.time}>
        {time}
      </p>
    </div>
  );
};

export default CurrentTimeCell;
