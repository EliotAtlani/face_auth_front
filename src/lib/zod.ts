import { z } from "zod";

// creating a schema for strings
export const emailSchema = z.coerce.string().email().min(5);
