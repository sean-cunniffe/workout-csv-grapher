import {Component} from '@angular/core';
import {Log} from './common/log';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'workout-csv-grapher';
  logs: Log[] = [];
  logMapByExerciseName: Map<string, Log[]> = new Map<string, Log[]>();
  public graph: any = [];

  getFile(event: Event): void {
    const fileList: FileList = (event.target as HTMLInputElement).files;
    const file = fileList.item(0);
    const fileReader = new FileReader();
    fileReader.onload = ev => {
      const split1 = (fileReader.result as string).replace(new RegExp('"', 'g'), '').split('\n');
      for (const set of split1) {
        const setSplit = set.split(';');
        const log = new Log(new Date(setSplit[0]), setSplit[1], setSplit[2], +setSplit[3], +setSplit[4], setSplit[5]
          , +setSplit[6], +setSplit[7], +setSplit[8], setSplit[9], +setSplit[10], setSplit[11], setSplit[12]);
        this.logs.push(log);
      }
      this.logs.splice(0, 1);
      this.logs.splice(this.logs.length - 1, 1);

      this.generateGraphsByVolumePerDay();
    };
    fileReader.readAsText(file);
  }

  splitIntoExerciseNames(logs: Log[]): Map<string, Log[]> {
    const sets: Map<string, Log[]> = new Map<string, Log[]>();
    for (const log of logs) {
      if (sets.has(log.exerciseName)) {
        sets.get(log.exerciseName).push(log);
      } else {
        sets.set(log.exerciseName, [log]);
      }
    }
    sets.delete('Workout Name');
    return sets;
  }


  generateGraphsByVolumePerDay(): void {
    const sets: Map<string, Log[]> = this.splitIntoExerciseNames(this.logs);
    sets.forEach(((value, key) => this.getByExerciseByVolumePerDay(key, value)));
  }


  private getByExerciseByVolumePerDay(exerciseName: string, sets: Log[]): void {
    const mappingByDate: Map<number, Log[]> = new Map<number, Log[]>();

    // map by date
    sets.forEach(
      (set, key) => mappingByDate.has(+set.date) ? mappingByDate.get(+set.date).push(set) : mappingByDate.set(+set.date, [set])
    );
    // add all values together from each date
    const yValues: number[] = [];
    const xValues: Date[] = [];
    mappingByDate.forEach((logs, key) => {
      xValues.push(new Date(key));
      yValues.push(logs.reduce((previousValue, currentValue) => previousValue + (currentValue.reps * currentValue.weight), 0));
    });
    this.graph.push({
      data: [{x: xValues, y: yValues, type: 'scatter', marker: {color: 'red'}},
      ],
      layout: {width: window.innerWidth, title: exerciseName},
      sets: mappingByDate
    });
  }
}

