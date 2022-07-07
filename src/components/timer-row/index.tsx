import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';

import { SOUNDS, SOUND_PATH } from '../../constants';

import styles from './styles.module.scss';
import { ITimerRow } from '../../app';

interface TimerRowProps {
  timerRow: ITimerRow;
  time: string;
  addNewRow: () => void;
  removeRow: (id: string) => void;
  updateRowState: (obj: ITimerRow) => void;
}

const TimerRow = (props: TimerRowProps) => {
  const {
    timerRow,
    time,
    addNewRow,
    removeRow,
    updateRowState,
  } = props;

  const [selectedSound, setSelectedSound] = useState(timerRow.track || `${process.env.PUBLIC_URL}${SOUND_PATH}/first_call.mp3`);
  const [hourField, setHourField] = useState(timerRow.time ? (timerRow.time?.get('hour') % 12)?.toString().padStart(2, '0') : '');
  const [minuteField, setMinuteField] = useState(timerRow.time ? timerRow.time?.get('minute')?.toString().padStart(2, '0') : '');
  const [amPmField, setAmPmField] = useState(timerRow.time ? (timerRow.time?.get('hour') > 12 ? 'pm' : 'am') : '');
  const [rowTime, setRowTime] = useState<dayjs.Dayjs | null>(timerRow.time);
  const [playing, setPlaying] = useState(false);

  const audioPlayerRef = useRef<HTMLAudioElement>(null);

  const hourRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);
  const amPmRef = useRef<HTMLInputElement>(null);

  const handleSetTime = ({ hour, minute, amPm }:
  { hour: string; minute: string; amPm: string }) => {
    if (hour && minute && amPm) {
      const minuteNumber = parseInt(minute, 10);
      const hourNumber = amPm === 'am' ? parseInt(hour, 10) : parseInt(hour, 10) + 12;
      const newTime = dayjs().hour(hourNumber).minute(minuteNumber).second(0);
      setRowTime(newTime);
      updateRowState({
        id: timerRow.id,
        track: selectedSound,
        time: newTime,
      });
    } else {
      setRowTime(null);
      updateRowState({
        id: timerRow.id,
        track: selectedSound,
        time: null,
      });
    }
  }

  if (rowTime?.format('hh:mm:ssa') === time && !playing) {
      if (audioPlayerRef.current) {
      audioPlayerRef.current.currentTime = 0;
      audioPlayerRef.current.play();
    }
  }

  useEffect(() => {
    if (!audioPlayerRef.current?.paused && (audioPlayerRef.current?.currentTime || 0) > 0) {
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  }, [time]);


  const onHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value.match(/^[0-9]{0,2}$/)) {
      return;
    }
    // handle pressing a number greater that 2
    if (e.target.value.match(/^[2-9]{1}$/)) {
      setHourField(`0${e.target.value}`);
      minuteRef.current?.focus();
      handleSetTime({ hour: e.target.value, minute: minuteField, amPm: amPmField });
      return;
    }
    if (e.target.value.match(/^(10|11|12)$/)) {
      setHourField(e.target.value);
      minuteRef.current?.focus();
      handleSetTime({ hour: e.target.value, minute: minuteField, amPm: amPmField });
      return;
    }
    setHourField(e.target.value);
    if (e.target.value.length === 2) {
      minuteRef.current?.focus();
    }
    handleSetTime({ hour: e.target.value, minute: minuteField, amPm: amPmField });
  }

  const onMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value.match(/^[0-9]{0,2}$/)) {
      return;
    }
    if (parseInt(e.target.value, 10) >= 60) {
      return;
    }
    setMinuteField(e.target.value);
    handleSetTime({ hour: hourField, minute: e.target.value, amPm: amPmField });
    if (e.target.value.length === 2) {
      amPmRef.current?.focus();
    }
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
    if (e.target.value.toLowerCase() === 'a' && amPmField === 'am') {
      setAmPmField('');
      handleSetTime({ hour: hourField, minute: minuteField, amPm: '' });
      return;
    }
    if (e.target.value.toLowerCase() === 'p' && amPmField === 'pm') {
      setAmPmField('');
      handleSetTime({ hour: hourField, minute: minuteField, amPm: '' });
      return;
    }
    if (e.target.value.toLowerCase() === 'a') {
      setAmPmField('am');
      handleSetTime({ hour: hourField, minute: minuteField, amPm: 'am' });
    }
    if (e.target.value.toLowerCase() === 'p') {
      setAmPmField('pm');
      handleSetTime({ hour: hourField, minute: minuteField, amPm: 'pm' });
    }
  }

  const onAmPmKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (amPmField === '') {
      if (e.key === 'Backspace') {
        e.preventDefault();
        minuteRef.current?.focus();
      }
    }
  }

  const handleTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const track = `${process.env.PUBLIC_URL}${SOUND_PATH}/${e.target.value}`;
    setSelectedSound(track);
    updateRowState({
      id: timerRow.id,
      track,
      time: rowTime,
    });
  }

  return (
    <div className={`${styles.timerRow} ${playing ? styles.playing : ''}`}>
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
      {rowTime ? (
        <p
          className={styles.indicator}
          title="Ready"
        >
          ✅
        </p>
      ) : (
        <p
          className={styles.indicator}
          title="Please set hour, minute and am/pm"
        >
          🔺
        </p>
      )}
      <select
        className={styles.dropDown}
        onChange={handleTrackChange}
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
        ref={audioPlayerRef}
        className={styles.audioPlayer}
        controls
        src={selectedSound}
      >
        Your browser does not support the
        <code>audio</code> element.
      </audio>
      <div className={styles.buttonWrapper}>
        <button
          onClick={() => removeRow(timerRow.id)}
          className={styles.removeButton}
          title="Remove row"
        >
          -
        </button>
        <button
          onClick={addNewRow}
          className={styles.addButton}
          title="Add row"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default TimerRow;
