'use server';
import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { PromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

async function getChatResponse(userInput: string) {
    try {
        // Define the model
        const llm = new ChatFireworks({
            model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
            temperature: 0,
        });

        // Load the document from a specific PDF file
        const loader = new PDFLoader("./public/medical.pdf");
        const docs = await loader.load();

        // Split the document into smaller chunks
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 500,
            chunkOverlap: 200,
        });
        const allSplits = await textSplitter.splitDocuments(docs);

        // Convert the chunks into vectors and store them
        const vectorStore = await MemoryVectorStore.fromDocuments(
            allSplits,
            new HuggingFaceInferenceEmbeddings({
                apiKey: process.env.HUGGINGFACEHUB_API_TOKEN,
            }),
        );

        // Retrieve the most relevant data from the vector store
        const retriever = vectorStore.asRetriever({ k: 6, searchType: "similarity" });

        // Set up the prompt template
        const template = `
        Respond only in valid JSON. The JSON object you return should match the following schema:
        
        {{
            "response": [
                {{
                    "heading": "Generated heading based on your query",
                    "context": "Describing content",
                    "points":["Bullet Points"],
                }}
            ]
        }}
        
        

        Use the following pieces of context to answer the question at the end:
        If you don't know the answer, just say that you don't know, don't try to make up an answer.
        Use three sentences maximum and keep the answer as concise as possible.
        Always say "thanks for asking!" at the end of the answer.

        {context}

        Question: ${userInput}
        `;

        const customRagPrompt = PromptTemplate.fromTemplate(template);

        // Create the chain with the prompt and LLM
        const ragChain = await createStuffDocumentsChain({
            llm,
            prompt: customRagPrompt,
            outputParser: new StringOutputParser(),
        });

        // Retrieve context and generate a response
        const context = await retriever.invoke(userInput);
        let result = await ragChain.invoke({
            question: { userInput },
            context,
        });

        // Ensure the result is valid JSON
        if (result && typeof result === 'string') {
            let data = JSON.parse(result);
            console.log(data);
            
            return data;
        } else {
            throw new Error("Invalid response format from LLM.");
        }
    } catch (error) {
        console.error("Error in getChatResponse function:", error);
        throw new Error("Failed to generate a chat response.");
    }
}

export { getChatResponse };
