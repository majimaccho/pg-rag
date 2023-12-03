import { PromptTemplate } from "langchain/prompts";
import { searchSimilarDocuments } from "./similaritySearch";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OPENAI_API_KEY } from "../env";

const model = new ChatOpenAI({
  openAIApiKey: OPENAI_API_KEY,
  modelName: "gpt-4",
});

const promptTemplate = PromptTemplate.fromTemplate(
  ` You are a world-class programmer. 
    You are asked to review a given code in Japanese. 
  
    convention:
    {conventions}

    codes to review:
    {codes}

    Make your review in following format of Markdown in Japanese.
    ## 指摘の有無
    (あり / なし: なしの場合は他に何も記載しない)

    ## 指摘の箇所
    \`\`\`
    (該当のコード)
    \`\`\`

    ## 指摘の内容
    (違反している規約と指摘の内容)

    ## 改善案
    \`\`\`
    (改善後の具体的なコード)
    \`\`\`
  `,
);
export const retrievalAugumentedGeneration = async (text: string) => {
  const relatedDocuments = await searchSimilarDocuments(text)

  const conventions = relatedDocuments.map((document) => document.original).join("\n")

  const chain = promptTemplate.pipe(model);

  const result = await chain.invoke({
    conventions,
    codes: text
  });

  return result;
}

if (require.main === module) {
  (async () => {
    const text = "const hoge = 'huga'"

    const result = await retrievalAugumentedGeneration(text)

    console.log(result.content);
  })()
}