
// src/types/express/index.d.ts
import { UserPayload } from '@/middleware/auth.middleware'; // Adjust path as necessary

declare global {
  namespace Express {
    export interface Request {
      user?: UserPayload; // Add your custom user payload type here
    }
  }
}
