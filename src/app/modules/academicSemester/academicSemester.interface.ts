export type TMonth = 
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December";

export type TAcademicSemesterName = 'Autumn' | 'Summar' |'Fall';
export type TAcademicSemesterCode = '01' | '02' | '03';
export type TAcademicSemester = {
    name: TAcademicSemesterName;
    code: TAcademicSemesterCode;
    year: string;
    startMonth: TMonth;
    endMonth: TMonth;
}

export type TAcademicSemesterNameCodeMapper = {
  [key: string]: string;
};