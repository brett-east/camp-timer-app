import styles from './styles.module.scss';

interface CurrentTimeCellProps {
  time: string;
}

const CurrentTimeCell = (props: CurrentTimeCellProps) => {
  const {
    time,
  } = props;
  return (
    <div className={styles.currentTimeCell}>
      <p className={styles.time}>
        {time}
      </p>
    </div>
  );
};

export default CurrentTimeCell;
