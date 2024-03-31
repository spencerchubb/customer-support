import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
    const supabase = createClient();
    const body = await req.json();
    const { error } = await supabase
        .from('documents')
        .delete()
        .match({ id: body.id });
    if (error) {
        return NextResponse.json({}, { status: 500 });
    }
    return NextResponse.json({ id: body.id, success: true });
}