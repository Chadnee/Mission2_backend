 
import { model, Schema } from "mongoose";
import { TAcademicSemester, TAcademicSemesterCode, TAcademicSemesterName, TMonth } from "./academicSemester.interface";
import { AcademicSemesterCode, AcademicSemesterName, Months } from './academicSemester.constant';


const academicSemesterSchema = new Schema<TAcademicSemester>(
    {
        name: {
            type: String,
            required: true,
            enum: AcademicSemesterName,
        },
        code: {
            type:String,
            required: true,
            enum: AcademicSemesterCode
        },
        year: {
            type: String,
            required: true,
        },
        startMonth: {
            type: String,
            enum: Months
        },
        endMonth: {
            type: String,
            enum: Months
        }
    }, {timestamps:true}
)


academicSemesterSchema.pre('save', async function(next){
    
    const isSemesterExists = await AcademicSemesterModel.findOne({
        year: this.year,
        name: this.name,
    })

    if(isSemesterExists){
        throw new Error('Semester is already existed')
    }
    next()
})


export const AcademicSemesterModel = model<TAcademicSemester>(
    'AcademicSemester', 
     academicSemesterSchema
);

