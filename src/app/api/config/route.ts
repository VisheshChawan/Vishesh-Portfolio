import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, supabase } from '@/lib/supabase';

// GET — fetch the latest saved config for all visitors
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('portfolio_settings')
      .select('config')
      .eq('id', 1)
      .single();

    if (error) {
      // PGRST116 means no rows found, which is fine for first-time use
      if (error.code === 'PGRST116') {
        return NextResponse.json({ data: null }, { status: 200 });
      }
      throw error;
    }

    return NextResponse.json({ data: data.config }, { status: 200 });
  } catch (error: any) {
    console.error('Config GET error:', error.message);
    return NextResponse.json({ data: null, error: error.message }, { status: 500 });
  }
}

// POST — admin saves the full config to Supabase
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { error } = await supabaseAdmin
      .from('portfolio_settings')
      .upsert({ 
        id: 1, 
        config: body, 
        updated_at: new Date().toISOString() 
      }, { onConflict: 'id' });

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Config POST error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
