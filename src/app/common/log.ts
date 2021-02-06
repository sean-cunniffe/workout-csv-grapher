export class Log {

  constructor(public date: Date,
              public workoutName: string,
              public exerciseName: string,
              public setOrder: number,
              public weight: number,
              public weightUnit: string,
              public reps: number,
              public RPE: number,
              public distance: number,
              public distanceUnit: string,
              public seconds: number,
              public notes: string,
              public workoutNotes: string) {
  }

  toString(): string {
    return (`${this.date} ${this.workoutName} ${this.exerciseName} ${this.setOrder} ${this.weight} ${this.weightUnit} ${this.reps} ${this.RPE} ${this.distance}
     ${this.distanceUnit} ${this.seconds} ${this.notes} ${this.workoutNotes}`);
  }
}
