import swaggerJSDoc from 'swagger-jsdoc';

const apiBaseUrl = process.env.SWAGGER_SERVER_URL || `http://localhost:${process.env.PORT || 3001}`;

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'SmartScholar API',
      version: '1.0.0',
      description: 'Backend API for SmartScholar decentralized transparency platform.',
    },
    servers: [
      {
        url: `${apiBaseUrl}/api`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        SignupRequest: {
          type: 'object',
          required: ['name', 'email', 'password', 'role'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
            role: { type: 'string', enum: ['donor', 'student', 'admin', 'institution', 'verifier'] },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
            avatar: { type: 'string', nullable: true },
          },
        },
        DonationCreateRequest: {
          type: 'object',
          required: ['amount', 'fieldOfStudy'],
          properties: {
            amount: { type: 'number' },
            fieldOfStudy: { type: 'string' },
            scholarshipId: { type: 'string' },
            studentId: { type: 'string' },
          },
        },
        ApplicationCreateRequest: {
          type: 'object',
          required: ['scholarshipId'],
          properties: {
            scholarshipId: { type: 'string' },
          },
        },
      },
    },
    paths: {
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginRequest' },
              },
            },
          },
          responses: {
            '200': { description: 'Logged in' },
            '401': { description: 'Invalid credentials' },
          },
        },
      },
      '/auth/signup': {
        post: {
          tags: ['Auth'],
          summary: 'Signup user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SignupRequest' },
              },
            },
          },
          responses: {
            '201': { description: 'Created' },
            '400': { description: 'Validation error' },
          },
        },
      },
      '/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Get current user',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Current user',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/User' },
                },
              },
            },
          },
        },
      },
      '/donors/{donorId}/donations': {
        get: {
          tags: ['Donor'],
          summary: 'Get donor donations',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'donorId', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Donation list' } },
        },
        post: {
          tags: ['Donor'],
          summary: 'Create donation',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'donorId', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DonationCreateRequest' },
              },
            },
          },
          responses: { '201': { description: 'Donation created' } },
        },
      },
      '/students/{studentId}/applications': {
        get: {
          tags: ['Student'],
          summary: 'Get student applications',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'studentId', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Applications' } },
        },
        post: {
          tags: ['Student'],
          summary: 'Create student application',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'studentId', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ApplicationCreateRequest' },
              },
            },
          },
          responses: { '201': { description: 'Application created' } },
        },
      },
      '/students/{studentId}/documents': {
        post: {
          tags: ['Student'],
          summary: 'Upload student document',
          security: [{ bearerAuth: [] }],
          parameters: [{ in: 'path', name: 'studentId', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: ['file', 'type'],
                  properties: {
                    file: { type: 'string', format: 'binary' },
                    type: {
                      type: 'string',
                      enum: ['transcript', 'admission_letter', 'id_proof', 'recommendation'],
                    },
                  },
                },
              },
            },
          },
          responses: { '201': { description: 'Document uploaded' } },
        },
      },
      '/transactions': {
        get: {
          tags: ['Transactions'],
          summary: 'Get ledger transactions',
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'Transactions list' } },
        },
      },
    },
  },
  apis: [],
});
