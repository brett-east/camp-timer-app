import React from 'react';

import styles from './styles.module.scss';

interface TimerRowProps {

}

const TimerRow = (props: TimerRowProps) => {
  return (
    <div className={styles.timerRowProps}>
      <p>
        timer row props
      </p>
    </div>
  );
};

export default TimerRow;
