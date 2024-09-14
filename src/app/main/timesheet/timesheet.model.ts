import { Moment } from "moment";
import { Task } from "./task.model";

export interface Timesheet {
 task?: Task,
 startDate?: Moment,
 memo?: string,
 timeSpent?: number,
 isCopy?: boolean
}
