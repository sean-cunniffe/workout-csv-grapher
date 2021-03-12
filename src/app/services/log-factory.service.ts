import {Injectable} from '@angular/core';
import {Log} from '../common/log';

@Injectable({
  providedIn: 'root'
})
export class LogFactoryService {

  constructor() {
  }

  delimiter = '';

  titles = {
    date: -1,
    distance: -1,
    exerciseName: -1,
    notes: -1,
    reps: -1,
    seconds: -1,
    setOrder: -1,
    weight: -1,
    workoutName: -1,
    workoutNotes: -1
  };


  setTitles(titles: string[]): LogFactoryService {
    for (let index = 0; index < titles.length; index++) {
      switch (titles[index]) {
        case 'Date':
          this.titles.date = index;
          break;
        case 'Workout Name':
          this.titles.workoutName = index;
          break;
        case 'Exercise Name':
          this.titles.exerciseName = index;
          break;
        case 'Set Order':
          this.titles.setOrder = index;
          break;
        case 'Weight':
          this.titles.weight = index;
          break;
        case 'Reps':
          this.titles.reps = index;
          break;
        case 'Distance':
          this.titles.distance = index;
          break;
        case 'Seconds':
          this.titles.seconds = index;
          break;
        case 'Notes':
          this.titles.notes = index;
          break;
        case 'Workout Notes':
          this.titles.workoutNotes = index;
          break;
      }
    }
    return this;
  }

  createLogs(data: any[]): Log[] {
    const logs = [];
    for (const set of data) {
      const setSplit = set.split(this.delimiter);
      const t = this.titles;
      const log = new Log(new Date(setSplit[t.date]), setSplit[t.workoutName], setSplit[t.exerciseName], +setSplit[t.setOrder]
        , +setSplit[t.weight], setSplit[t.reps], +setSplit[t.distance], +setSplit[t.seconds], setSplit[t.notes], setSplit[t.workoutNotes]);
      logs.push(log);
    }

    return logs;
  }

  setDelimiter(delimiter: any): LogFactoryService {
    this.delimiter = delimiter;
    return this;
  }
}


