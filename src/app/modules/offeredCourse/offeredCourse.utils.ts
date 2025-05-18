import { TSchedule } from "./offeredCourse.interface";


export const hasTimeConflict = (assignedSchedule: TSchedule[], newSchedule: TSchedule)=> {
    
    for(const schedule of assignedSchedule) {
      
        const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`)
        const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`)
        const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`);
        const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`)
      //console.log(existingStartTime, existingEndTime, newStartTime, newEndTime)
      
      if(newStartTime <existingEndTime && newEndTime>existingStartTime){
       return true
      }
    }
    return false;
  
}