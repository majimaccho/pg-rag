import { ChatOpenAI } from "langchain/chat_models/openai";
import { LLMChain } from "langchain/chains";
import { ChatPromptTemplate } from "langchain/prompts";
import { OPENAI_API_KEY } from "../env";

const poc = async () => {
  const chat = new ChatOpenAI({
    openAIApiKey: OPENAI_API_KEY,
    modelName: "gpt-4",
    temperature: 1,
  });
  
  
  const text =
    `
    あなたは世界一のプログラマーです。
    イミュータビリティと型の安全性、テストの用意性を重視した、関数型プログラミングの考え方を取り入れた
    {lang}の堅牢なプログラミングのためのコーディング規約をMarkdownk形式で以下のフォーマットで10件生成してください。

    iには規約の番号が入ります。
    
    ## i. 規約名
    ### 規約の説明

    ### そうすることで得られるメリット

    ### コード例（悪い例）

    ### コード例（良い例）

    `
  
    
  const prompt = ChatPromptTemplate.fromTemplate(text)

  const chain = new LLMChain({
    llm: chat,
    prompt, 
    verbose: true
  })  

  console.log("start");

  const result = await chain.call({
    lang: "TypeScript"
    
  })

  console.log(result);
  
}

if (require.main === module) poc()