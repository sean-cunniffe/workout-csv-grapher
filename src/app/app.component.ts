import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Log} from './common/log';
import {LogFactoryService} from './services/log-factory.service';
import {GraphFactoryService} from './services/graph-factory.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'workout-csv-grapher';
  logs: Log[] = [];
  public graph: any = [];
  delimiter: any = undefined;
  file: File = undefined;
  searchTerm = '';

  constructor(private logFactory: LogFactoryService, public cdr: ChangeDetectorRef, private graphFactoryService: GraphFactoryService) {

  }

  ngOnInit(): void {
    if (navigator.platform.includes('Linux')) {
      this.delimiter = ';';
    } else if (navigator.platform.includes('Mac')) {
      this.delimiter = ',';
    } else {
      this.delimiter = ';';
    }
    navigator.serviceWorker.onmessage = (event) => {
      this.file = event.data.file;
      if (this.file) {
        this.getData(this.file);
      }
      this.cdr.detectChanges();
    };
    navigator.serviceWorker.controller.postMessage({
      type: 'READY FOR FILE',
    });
  }

  /**
   * get file from page
   */
  getFile(event: Event): void {
    const fileList: FileList = (event.target as HTMLInputElement).files;
    this.file = fileList.item(0);
    this.getData(this.file);
  }

  /**
   * get data from file
   */
  getData(file: File): void {
    console.log('Loading data from file...');
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
        const mappingByDate: Map<number, Log[]> = new Map<number, Log[]>();
        // map by date
        value.forEach(
          (set) => mappingByDate.has(+set.date) ? mappingByDate.get(+set.date).push(set) : mappingByDate.set(+set.date, [set])
        );
        const volumeExercise = this.graphFactoryService.createTotalVolumeGraph(key, mappingByDate);
        const topSetExercise = this.graphFactoryService.createTopSetVolumeGraph(key, mappingByDate);
        const topWeightExercise = this.graphFactoryService.createMostWeightUsedGraph(key, mappingByDate);
        volumeExercise.forEach((value1, index, array) => {
          const tempArr = [];
          tempArr.push(value1.data[0]);
          tempArr.push(topSetExercise[index].data[0]);
          tempArr.push(topWeightExercise[index].data[0]);
          this.graph.push({data: tempArr, layout: value1.layout});
        });
      }));
      // sort exercises by most logs taken
      this.graph.sort((b, a) => a.data[0].x.length > b.data[0].x.length ? 1 : (b.data[0].x.length > a.data[0].x.length) ? -1 : 0);
      console.log('...finished loading');
    };
    fileReader.readAsText(file);
  }


  /**
   * Map exercise by exercise name
   */
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
   * hides plots that don't have searchTerm
   */
  searchTitle(): void {
    for (const exercise of this.graph) {
      const title: string = exercise.layout.title.text;
      exercise.hidden = !title.toLowerCase().includes(this.searchTerm.toLowerCase());
    }
  }
}

