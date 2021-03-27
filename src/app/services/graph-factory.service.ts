import {Injectable} from '@angular/core';
import {Log} from '../common/log';

@Injectable({
  providedIn: 'root'
})
export class GraphFactoryService {

  totalMassMoved = 'Total Volume Moved (KG)';
  totalMassMovedColor = 'Red';
  topSetByVolume = 'Top Set by Volume (KG)';
  topSetByVolumeColor = 'Green';
  mostWeightUsed = 'Most Weight Used (KG)';
  mostWeightUsedColor = 'Blue';
  topWeightMultiplier = 1;

  constructor() {
  }

  private static createGraph(xValues: Date[], yValues: number[], exerciseName: string, mappingByDate: Map<number, Log[]>, lineColor: string,
                             legendName: string, type: string): any {
    return {
      data: [{x: xValues, y: yValues, type, marker: {color: lineColor}, name: legendName}],
      layout: {width: window.innerWidth, title: exerciseName, legend: {orientation: 'h', font: {size: 18}},   yaxis: {
          type: 'log',
          autorange: true
        }},
      sets: mappingByDate,
      hidden: false
    };
  }

  public createTotalVolumeGraph(exerciseName: string, sets: Map<number, Log[]>): any {
    const tempGraph: any[] = [];
    // add all values together from each date
    const yValues: number[] = [];
    const xValues: Date[] = [];
    sets.forEach((logs, key) => {
      xValues.push(new Date(key));
      yValues.push(logs.reduce((previousValue, currentValue) => previousValue + (currentValue.reps * currentValue.weight), 0));
    });
    tempGraph.push(GraphFactoryService.createGraph(xValues, yValues, exerciseName, sets, this.totalMassMovedColor,
      this.totalMassMoved, 'scatter'));
    return tempGraph;
  }

  public createTopSetVolumeGraph(exerciseName: string, sets: Map<number, Log[]>): any {
    const tempGraph: any[] = [];
    // add all values together from each date
    const yValues: number[] = [];
    const xValues: Date[] = [];
    sets.forEach((logs, key) => {
      let tempYValue = 0;
      xValues.push(new Date(key));
      logs.forEach(value => {
        const massMoved = value.weight * value.reps;
        tempYValue = massMoved > tempYValue ? massMoved : tempYValue;
      });
      yValues.push(tempYValue);
    });
    tempGraph.push(GraphFactoryService.createGraph(xValues, yValues, exerciseName, sets, this.topSetByVolumeColor,
      this.topSetByVolume, 'scatter'));
    return tempGraph;
  }

  public createMostWeightUsedGraph(exerciseName: string, sets: Map<number, Log[]>): any {
    const tempGraph: any[] = [];
    // add all values together from each date
    const yValues: number[] = [];
    const xValues: Date[] = [];
    sets.forEach((logs, key) => {
      let tempYValue = 0;
      xValues.push(new Date(key));
      logs.forEach(value => {
        const tempWeight = value.weight * this.topWeightMultiplier;
        tempYValue = tempWeight > tempYValue ? tempWeight : tempYValue;
      });
      yValues.push(tempYValue);
    });
    tempGraph.push(GraphFactoryService.createGraph(xValues, yValues, exerciseName, sets, this.mostWeightUsedColor,
      this.mostWeightUsed, 'scatter'));
    return tempGraph;
  }
}

