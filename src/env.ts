import "dotenv/config";
import { z } from "zod";

export const { 
  OPENAI_API_KEY
} = z.object({
  OPENAI_API_KEY: z.string(),
}).parse(process.env);