'use server';
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatGroq } from "@langchain/groq";
import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import "cheerio";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { PromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { StringOutputParser } from "@langchain/core/output_parsers";

async function getChatResponse(userInput: string) {
    try {
        // DEFINE THE MODEL WE WILL USE


        // const llm = new ChatMistralAI({
        //     model: "mistral-large-latest",
        //     temperature: 0
        //   });
        const llm = new ChatFireworks({
            model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
            temperature: 0
        });

        // LOAD THE DOCUMENT FROM SPECIFIC WEBSITE BASED ON YOUR CONTENT
        const loader = new CheerioWebBaseLoader(
            "https://lilianweng.github.io/posts/2023-06-23-agent/",

        );
        const docs = await loader.load();

        // NOW BY USING TEXTSPLITTERS WE WILL SPLIT THE DOCUMENTS INTO SMALL CHUNKS.
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 200,
        });
        const allSplits = await textSplitter.splitDocuments(docs);

        // HERE BY USING THE EMBEDDING MODEL WE WILL CONVERT THE CHUNKS INTO VECTOR.
        // AND, VECTOR WILL BE STORE INSIDE AN VECTOR STORE OR VECTOR DB.
        const vectorStore = await MemoryVectorStore.fromDocuments(
            allSplits,
            new HuggingFaceInferenceEmbeddings({
                apiKey: process.env.HUGGINGFACEHUB_API_TOKEN,
            }),
        );

        // USING RETRIEVER WE WILL EXTRACT THE MOST RELEVANT DATA FROM VECTOR DB.
        const retriever = vectorStore.asRetriever({ k: 6, searchType: "similarity" });

        // HERE, WE WILL SET AN PROMPT TEMPLATE WHICH HAS TO BE PASSED TO OUR LLM.
        const template = `Use the following pieces of context to answer the question at the end.
        If you don't know the answer, just say that you don't know, don't try to make up an answer.
        Use three sentences maximum and keep the answer as concise as possible.
        Always say "thanks for asking!" at the end of the answer.
        
        {context}
        
        Question: ${userInput}
        
        Helpful Answer:
        - **Key Points**:
        - **Summary**: [A concise summary of the response]
          
        Thanks for asking!`;

        const customRagPrompt = PromptTemplate.fromTemplate(template);

        // HERE WE WILL CREATE A CHAIN IN WHICH PROMPT WILL BE PASSED TO OUR LLM.
        const ragChain = await createStuffDocumentsChain({
            llm,
            prompt: customRagPrompt,
            outputParser: new StringOutputParser(),
        });

        // HERE, AFTER PASSING CONTEXT TO LLM USING CHAIN WE WILL RECIVE OUR RESULT.
        const context = await retriever.invoke(userInput);
        let result = await ragChain.invoke({
            question: { userInput },
            context,
        });

        console.log(result);
        return result;


    }
    catch (error) {
        console.error(error);
    };
}


export { getChatResponse };