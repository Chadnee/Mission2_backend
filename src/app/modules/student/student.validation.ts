import { studentValidationSchema } from './student.validation';
import { z } from "zod";

const userNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20).refine((value)=> /^[A-Z]/.test(value),{
    message: "First name must start with a capital letter",
  }),
  middleName: z.string(),
  lastName: z.string(),
})

const guardianValidationSchema = z.object({
  fatherName: z.string(),
  fatherOccupation: z.string(),
  fatherContactNo: z.string(),
  motherName: z.string(),
  motherOccupation: z.string(),
  motherContactNo: z.string(),
});

const localGuardianValidationSchema = z.object({
  name:z.string(),
  occupation: z.string(),
  contactNo: z.string(),
  address: z.string(),
})

 const createStudentValidationSchema = z.object({
  body: z.object({
   // id: z.string(),
    password: z.string().max(20).optional(),
    student: z.object({
      name: userNameValidationSchema,
      gender: z.enum(["male", "female"]),
      dateOfBirth:z.string().optional(),
      email: z.string().email(),
      contactNo:z.string(),
      emergencyContactInfo: z.string(),
      bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      guardian: guardianValidationSchema,
      localGuardian: localGuardianValidationSchema,
      admissionSemester: z.string(),
       //profileImage: z.string(),
       academicDepartment: z.string(),
    })
    //drkar nei, auto generated
    // isActice: z.enum(['active', 'blocked']).default('active'),
    // isDeleted: z.boolean().optional(),
  })
 })

 // schema for updating data

 const userNameValidationSchemaOptional = z.object({
  firstName: z.string().min(1).max(20).refine((value) => /^[A-Z]/.test(value), {
    message: "First name must start with a capital letter",
  }).optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
}).optional();

const guardianValidationSchemaOptional = z.object({
  fatherName: z.string().optional(),
  fatherOccupation: z.string().optional(),
  fatherContactNo: z.string().optional(),
  motherName: z.string().optional(),
  motherOccupation: z.string().optional(),
  motherContactNo: z.string().optional(),
}).optional();

const localGuardianValidationSchemaOptional = z.object({
  name: z.string().optional(),
  occupation: z.string().optional(),
  contactNo: z.string().optional(),
  address: z.string().optional(),
}).optional();

export const updateStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    student: z.object({
      name: userNameValidationSchemaOptional,
      gender: z.enum(["male", "female"]).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email().optional(),
      contactNo: z.string().optional(),
      emergencyContactInfo: z.string().optional(),
      bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      guardian: guardianValidationSchemaOptional,
      localGuardian: localGuardianValidationSchemaOptional,
      admissionSemester: z.string().optional(),
      profileImage: z.string().optional(),
      academicDepartment: z.string().optional(),
    }).optional()
  })
});

export const studentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema
}


// import Joi from "joi";

// const nameValidationSchema = Joi.object({
//     firstName: Joi.string().required().messages({
//       "string.empty": "First name is required",
//     }),
//     middleName: Joi.string().optional(),
//     lastName: Joi.string()
//       .required()
//       .pattern(/^[A-Za-z]+$/)
//       .messages({
//         "string.empty": "Last name is required",
//         "string.pattern.base": "Last name must contain only alphabetic characters",
//       }),
//   });
  
//   // Guardian sub-schema
//   const guardianValidationSchema = Joi.object({
//     fatherName: Joi.string().required().messages({
//       "string.empty": "Father's name is required",
//     }),
//     fatherOccupation: Joi.string().required().messages({
//       "string.empty": "Father's occupation is required",
//     }),
//     fatherContactNo: Joi.string().required().messages({
//       "string.empty": "Father's contact number is required",
//     }),
//     motherName: Joi.string().required().messages({
//       "string.empty": "Mother's name is required",
//     }),
//     motherOccupation: Joi.string().required().messages({
//       "string.empty": "Mother's occupation is required",
//     }),
//     motherContactNo: Joi.string().required().messages({
//       "string.empty": "Mother's contact number is required",
//     }),
//   });
  
//   // Local Guardian sub-schema
//   const localGuardianValidationSchema = Joi.object({
//     name: Joi.string().required().messages({
//       "string.empty": "Local guardian's name is required",
//     }),
//     occupation: Joi.string().required().messages({
//       "string.empty": "Local guardian's occupation is required",
//     }),
//     contactNo: Joi.string().required().messages({
//       "string.empty": "Local guardian's contact number is required",
//     }),
//     address: Joi.string().required().messages({
//       "string.empty": "Local guardian's address is required",
//     }),
//   });

//   const studentValidationSchema = Joi.object({
//     id: Joi.string().required().messages({
//       "string.base": "ID must be a string",
//       "string.empty": "ID is required",
//     }),
  
//     name: nameValidationSchema.required().messages({
//       "object.base": "Name is required",
//     }),
  
//     gender: Joi.string().valid("male", "female").required().messages({
//       "any.only": "Gender must be either 'male' or 'female'",
//     }),
  
//     dateOfBirth: Joi.string().optional(),
  
//     email: Joi.string().email().required().messages({
//       "string.email": "Email must be a valid email address",
//       "string.empty": "Email is required",
//     }),
  
//     contactNo: Joi.string().required().messages({
//       "string.empty": "Contact number is required",
//     }),
  
//     emergencyContactInfo: Joi.string().required().messages({
//       "string.empty": "Emergency contact information is required",
//     }),
  
//     bloodGroup: Joi.string()
//       .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
//       .optional()
//       .messages({
//         "any.only": "Invalid blood group",
//       }),
  
//     presentAddress: Joi.string().required().messages({
//       "string.empty": "Present address is required",
//     }),
  
//     permanentAddress: Joi.string().required().messages({
//       "string.empty": "Permanent address is required",
//     }),
  
//     guardian: guardianValidationSchema.required().messages({
//       "object.base": "Guardian information is required",
//     }),
  
//     localGuardian: localGuardianValidationSchema.required().messages({
//       "object.base": "Local guardian information is required",
//     }),
  
//     profileImage: Joi.string().optional(),
  
//     isActive: Joi.string().valid("active", "blocked").default("active").messages({
//       "any.only": "Status must be either 'active' or 'blocked'",
//     }),
//   });

//   export default studentValidationSchema;