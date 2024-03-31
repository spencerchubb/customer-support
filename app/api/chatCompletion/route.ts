import OpenAI from "openai";
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from "next/server";
import { OpenAIStream, StreamingTextResponse } from "ai";

export async function POST(req: NextRequest): Promise<Response> {
    const supabase = createClient();
    const body = await req.json();
    const messages = body.messages;
    const lastMessage = messages[messages.length - 1].content;

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const embeddingObject = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: lastMessage,
        encoding_format: "float",
        dimensions: 512,
    });
    const embedding = embeddingObject.data[0].embedding;

    const { error: matchError, data: similarDocs } = await supabase.rpc(
        'get_similar_documents',
        {
            embedding,
            match_count: 1,
        }
    );

    if (matchError) {
        console.error(matchError);
        return NextResponse.json({}, { status: 500 });
    }

    const context = similarDocs.map((section: any) => section.text).join("\n");

    // Replace the last message with the prompt and context.
    const prompt = `Given the following sections from the TechPulse documentation, answer the query using only that information. If the answer is not explicitly written in the documentation, say "Sorry, I don't know how to help with that."
Context sections:
${context}

Query: """
${lastMessage}
"""
`;
    messages[messages.length - 1].content = prompt;

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        stream: true,
        messages,
    })
    
    const stream = OpenAIStream(response)
    
    return new StreamingTextResponse(stream)

    // const completionOptions = {
    //     model: 'gpt-3.5-turbo-instruct',
    //     prompt,
    //     max_tokens: 128,
    //     stream: true,
    // }

    // const response = await fetch('https://api.openai.com/v1/completions', {
    //     method: 'POST',
    //     headers: {
    //         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(completionOptions),
    // });

    // if (!response.ok) {
    //     const error = await response.json();
    //     throw new Error('Failed to generate completion', error);
    // }

    // // Proxy the streamed SSE response from OpenAI
    // return new Response(response.body, {
    //     headers: {
    //         'Content-Type': 'text/event-stream',
    //     },
    // });
}
