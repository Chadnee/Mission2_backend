export const calculateGradePoints = (totlaMarks:number) => {
    let result = {
        grade: 'NA',
        gradePoints: 0
    }
    if(totlaMarks >= 0 && totlaMarks <= 19){
        result = {
            grade: 'F',
            gradePoints: 0.00
        };
    }else if(totlaMarks >=20 && totlaMarks <= 39){
         result = {
            grade: 'D',
            gradePoints: 2.00
        };
    } else if(totlaMarks >=40 && totlaMarks <= 59){
         result = {
            grade: 'C',
            gradePoints: 3.00
        };
    } else if(totlaMarks >=60 && totlaMarks <= 79){
         result = {
            grade: 'B',
            gradePoints: 3.50
        };
    }else if(totlaMarks >=80 && totlaMarks <= 100){
         result = {
            grade: 'A',
            gradePoints: 4.00
        };
    }else{
        result = {
        grade: 'NA',
        gradePoints: 0
    }
    }
    return result;
}