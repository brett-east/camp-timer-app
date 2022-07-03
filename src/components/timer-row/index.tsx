import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import { SOUNDS, SOUND_PATH } from '../../constants';

import styles from './styles.module.scss';

interface TimerRowProps {
  id: string;
  addNewRow: () => void;
  removeRow: (id: string) => void;
}

const TimerRow = (props: TimerRowProps) => {
  const {
    id,
    addNewRow,
    removeRow,
  } = props;
  const [selectedSound, setSelectedSound] = useState(`${process.env.PUBLIC_URL}${SOUND_PATH}/first_call.mp3`);
  const [hourField, setHourField] = useState('');
  const [minuteField, setMinuteField] = useState('');
  const [amPmField, setAmPmField] = useState('');
  const [time, setTime] = useState('');

  const hourRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);
  const amPmRef = useRef<HTMLInputElement>(null);

  const handleSetTime = () => {
    console.log('here');

    if (hourField && minuteField && amPmField) {
      setTime('');
      console.log(dayjs(`${hourField}:${minuteField}:${amPmField}`));
    }
  }

  const onHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value.match(/^[0-9]{0,2}$/)) {
      return;
    }
    // handle pressing a number greater that 2
    if (e.target.value.match(/^[2-9]{1}$/)) {
      setHourField(`0${e.target.value}`);
      minuteRef.current?.focus();
      return;
    }
    if (e.target.value.match(/^(10|11|12)$/)) {
      setHourField(e.target.value);
      minuteRef.current?.focus();
      return;
    }
    setHourField(e.target.value);
    if (e.target.value.length === 2) {
      minuteRef.current?.focus();
    }
    handleSetTime();
  }

  const onMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('minute');

    if (!e.target.value.match(/^[0-9]{0,2}$/)) {
      return;
    }
    if (parseInt(e.target.value, 10) > 60) {
      return;
    }
    setMinuteField(e.target.value);
    if (e.target.value.length === 2) {
      amPmRef.current?.focus();
    }
    handleSetTime();
  }

  const onMinuteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (minuteField === '') {
      if (e.key === 'Backspace') {
        e.preventDefault();
        hourRef.current?.focus();
      }
    }
  }

  const onAmPmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('e.target.value', e.target.value, 'amPmField', amPmField);
    if (e.target.value.toLowerCase() === 'a' && amPmField === 'am') {
      setAmPmField('');
      return;
    }
    if (e.target.value.toLowerCase() === 'p' && amPmField === 'pm') {
      setAmPmField('');
      return;
    }
    if (e.target.value.toLowerCase() === 'a') {
      setAmPmField('am');
    }
    if (e.target.value.toLowerCase() === 'p') {
      setAmPmField('pm');
    }
    handleSetTime();
  }

  const onAmPmKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('e', minuteField);

    if (amPmField === '') {
      if (e.key === 'Backspace') {
        e.preventDefault();
        minuteRef.current?.focus();
      }
    }
  }

  return (
    <div className={styles.timerRow}>
      <div className={styles.timeWrapper}>
        <input
          type="text"
          maxLength={2}
          className={styles.hourField}
          value={hourField}
          onChange={onHourChange}
          ref={hourRef}
          placeholder="07"
        />
        <span className={styles.timeColon}>:</span>
        <input
          type="text"
          maxLength={2}
          className={styles.minuteField}
          value={minuteField}
          onChange={onMinuteChange}
          onKeyDown={onMinuteKeyDown}
          ref={minuteRef}
          placeholder="00"
        />
        <input
          type="text"
          maxLength={2}
          className={styles.amPmField}
          value={amPmField}
          onChange={onAmPmChange}
          onKeyDown={onAmPmKeyDown}
          ref={amPmRef}
          placeholder="am"
        />
      </div>
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
      <button
        onClick={addNewRow}
        className={styles.addButton}
      >
        +
      </button>
      <button
        onClick={() => removeRow(id)}
        className={styles.addButton}
      >
        -
      </button>
    </div>
  );
};

export default TimerRow;
