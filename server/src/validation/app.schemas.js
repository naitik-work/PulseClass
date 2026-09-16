const { z } = require('zod');

const createInstituteSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Institute name is required')
    .max(200, 'Institute name must be 200 characters or less'),
});

const joinInstituteSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, 'Institute code is required')
    .max(8, 'Invalid institute code')
    .toUpperCase(),
});

const createClassroomSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Classroom name is required')
    .max(200, 'Classroom name must be 200 characters or less'),
  instituteId: z
    .string()
    .min(1, 'Institute ID is required'),
});

const startSessionSchema = z.object({
  classroomId: z
    .string()
    .min(1, 'Classroom ID is required'),
});

module.exports = {
  createInstituteSchema,
  joinInstituteSchema,
  createClassroomSchema,
  startSessionSchema,
};
