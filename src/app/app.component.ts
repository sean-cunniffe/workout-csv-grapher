import {Component, HostListener, OnInit} from '@angular/core';
import {Log} from './common/log';
import {LogFactoryService} from './services/log-factory.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'workout-csv-grapher';
  logs: Log[] = [];
  logMapByExerciseName: Map<string, Log[]> = new Map<string, Log[]>();
  public graph: any = [];
  delimiter: any = undefined;
  navigator: any = navigator.platform;

  @HostListener('fetch', ['$event'])
  dataFetch(event: Event): void {
    console.log(event);
    this.getFile(event);
  }

  constructor(private logFactory: LogFactoryService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    if (navigator.platform.includes('Linux')) {
      this.delimiter = ';';
    } else if (navigator.platform.includes('Mac')) {
      this.delimiter = ',';
    }
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

      const sets: Map<string, Log[]> = this.splitIntoExerciseNames(this.logs);
      // put both mass moved and top set into one graph
      sets.forEach(((value, key) => {
        const tempExercise = [];
        const volumeExercise = this.getByExerciseByVolumePerDay(key, value);
        const topSetExercise = this.getByExerciseByTopSetPerDay(key, value);
        volumeExercise.forEach((value1, index, array) => {
          const tempArr = [];
          tempArr.push(value1.data[0]);
          tempArr.push(topSetExercise[index].data[0]);
          tempExercise.push();
          this.graph.push({data: tempArr, layout: value1.layout});
        });
      }));
      // sort exercises by most logs taken
      this.graph.sort((b, a) => a.data[0].x.length > b.data[0].x.length ? 1 : (b.data[0].x.length > a.data[0].x.length) ? -1 : 0);
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

  /**
   *
   * @param exerciseName
   * @param sets All sets of the same exercise with different dates
   * @private
   */
  private getByExerciseByVolumePerDay(exerciseName: string, sets: Log[]): any[] {
    const tempGraph: any[] = [];
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
    tempGraph.push({
      data: [{x: xValues, y: yValues, type: 'scatter', marker: {color: 'red'}, name: 'Total Mass Moved (KG)'}],
      layout: {width: window.innerWidth, title: exerciseName, legend: {orientation: 'h', font: {size: 18}}},
      sets: mappingByDate
    });
    return tempGraph;
  }

  private getByExerciseByTopSetPerDay(exerciseName: string, sets: Log[]): any[] {
    const tempGraph: any[] = [];
    const mappingByDate: Map<number, Log[]> = new Map<number, Log[]>();
    // map by date
    sets.forEach(
      (set, key) => mappingByDate.has(+set.date) ? mappingByDate.get(+set.date).push(set) : mappingByDate.set(+set.date, [set])
    );
    // add all values together from each date
    const yValues: number[] = [];
    const xValues: Date[] = [];
    mappingByDate.forEach((logs, key) => {
      let tempYValue = 0;
      xValues.push(new Date(key));
      logs.forEach(value => {
        const massMoved = value.weight * value.reps;
        tempYValue = massMoved > tempYValue ? massMoved : tempYValue;
      });
      yValues.push(tempYValue);
    });
    tempGraph.push({
      data: [{x: xValues, y: yValues, type: 'scatter', marker: {color: 'blue'}, name: 'Top Set (KG)'}],
      layout: {width: window.innerWidth, title: exerciseName, legend: {orientation: 'h'}},
      sets: mappingByDate
    });
    return tempGraph;
  }
}

