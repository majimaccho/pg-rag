import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OPENAI_API_KEY } from "../env";
import { db } from "./db";
import pgvector from 'pgvector/utils';

export const embed = async (text: string) => {
  
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: OPENAI_API_KEY, // In Node.js defaults to process.env.OPENAI_API_KEY
    batchSize: 1024, // Default value if omitted is 512. Max is 2048
  });

  const vector = await embeddings.embedQuery(text);
  
  return vector
}

const storeDocument = async ({
  name, text, source
}: {
  name: string,
  text: string,
  source: string
}) => {
  const vector = await embed(text);

  const vectorSql = pgvector.toSql(vector)

  
  const result = await db.$executeRaw`
    INSERT INTO documents (
      "name", original, embedding, source
    )
    VALUES (
      ${name}, ${text}, ${vectorSql}::vector, ${source})
  `
}


if (require.main === module) {
  (async () => {

    // 全てのドキュメントを削除
    await db.document.deleteMany({})

    const sources: {
      name: string,
      text: string,
      source: string
    }[] = [
      {
        name: "変数の宣言",
        text: "変数の宣言時はconstを利用し、let, varは極力使わない。どうしても必要な場合はletを使用する",
        source: "code"
      },
      {
        name: "型の安全性",
        text: "any型は例外なく使わない。必要になる場合設計を見直し、型を定義する",
        source: "code"
      },
      {
        name: "配列から配列の定義",
        text: "配列から別の配列を定義する場合は、mapを利用する。for文forEachはイミュータビリティを損なうため使わない",
        source: "code"
      }, 
      {
        name: "アロー関数による関数の定義",
        text: "一貫性のために関数の定義はアロー関数を利用する。",
        source: "code"
      },
    ]

    sources.forEach(async (source) => {
      await storeDocument(source)
    })
  })();
}