
import { z } from "zod";

const userSchemaValidation = z.object({
    password: z.string({
        invalid_type_error: 'Password must be string',
    })
    .max(20, {message: 'Password can not be more than 20 characters'})
    .optional()
    
})

export const UserValidation = {
    userSchemaValidation,
}

// {
//   "password": "student1234",
//   "student": {
//     "name": {
//       "firstName": "Marhaba akhter",
//       "middleName": "Grace",
//       "lastName": "Miller"
//     },
//     "gender": "female",
//     "dateOfBirth": "2002-11-30",
//     "email": "marhaba@gmail.com",
//     "contactNo": "+1987654321",
//     "emergencyContactInfo": "+1234509876",
//     "bloodGroup": "B+",
//     "presentAddress": "789 Pine Road, Cityville, Country",
//     "permanentAddress": "321 Birch Street, Hometown, Country",
//     "guardian": {
//       "fatherName": "James Miller",
//       "fatherOccupation": "Professor",
//       "fatherContactNo": "+4455667788",
//       "motherName": "Linda Miller",
//       "motherOccupation": "Nurse",
//       "motherContactNo": "+5566778899"
//     },
//     "localGuardian": {
//       "name": "Soer",
//       "occupation": "Lawyer",
//       "contactNo": "+6677889900",
//       "address": "951 Cedar Avenue, Metro City, Country"
//     },
//     "admissionSemester": "680501be37ccb02a53983220",
//     "academicDepartment":"68066b0439fee2203a56b0d4",
//     "profileImage": "https://example.com/sophia.jpg"
//   }
// }



