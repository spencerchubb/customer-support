import OpenAI from "openai";
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request): Promise<Response> {
    const supabase = createClient();
    const body = await req.json();

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const embeddingObject = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: body.text,
        encoding_format: "float",
        dimensions: 512,
    });
    body.embedding = embeddingObject.data[0].embedding;

    const { data, error } = await supabase
        .from('documents')
        .insert(body)
        .select();
    if (error) {
        return Response.json({}, { status: 500 });
    }
    return Response.json({ doc: data[0] });
}
