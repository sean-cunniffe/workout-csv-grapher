import {Component} from '@angular/core';
import {Log} from './common/log';
import {LogFactoryService} from './services/log-factory.service';

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
  delimiter: any = undefined;

  constructor(private logFactory: LogFactoryService) {
  }

  getFile(event: Event): void {
    const fileList: FileList = (event.target as HTMLInputElement).files;
    const file = fileList.item(0);
    const fileReader = new FileReader();
    fileReader.onload = ev => {
      const data = (fileReader.result as string).trim();
      const split1: any[] = data.replace(new RegExp('"', 'g'), '').split('\n');
      // split the first row (title row) to create object
      const titles: any[] = split1[0].split(this.delimiter);
      this.logs = this.logFactory
        .setTitles(titles)
        .setDelimiter(this.delimiter)
        .createLogs(split1);
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

