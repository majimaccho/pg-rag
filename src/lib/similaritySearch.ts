import { z } from "zod";
import { db } from "./db";
import { embed } from "./embedding";
import pgvector from 'pgvector/utils';

const DocumentSchema = z.object({
  name: z.string(),
  original: z.string(),
  source: z.string(),
})

export const searchSimilarDocuments = async (text: string) => {
  const vector = await embed(text);

  const embedding = pgvector.toSql(vector)
  const documents = await db.$queryRaw`
    SELECT name, original, source
    FROM documents ORDER BY embedding <-> ${embedding}::vector 
    LIMIT 3
  `

  const parsed = z.array(DocumentSchema).parse(documents)

  return parsed
}

if (require.main === module) {
  (async () => {
    const text = "let hoge = 'huga'"

    const result = await searchSimilarDocuments(text)

    console.log(result);
  })()
}