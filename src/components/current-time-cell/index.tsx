import React from 'react';

import * as styles from './styles.module.scss';

interface CurrentTimeCellProps {

}

const CurrentTimeCell = (props: CurrentTimeCellProps) => {
  return (
    <div className={styles.currentTimeCell}>
      <p>
        current time cell
      </p>
    </div>
  );
};

export default CurrentTimeCell;
