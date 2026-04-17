import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const FIXED_USER_ID = 'portfolio-admin';

// POST — upload a file (resume or avatar) to Supabase Storage
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = formData.get('category') as string; // 'resume' or 'avatar'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File exceeds 5MB limit' }, { status: 413 });
    }

    const bucket = category === 'avatar' ? 'profile-images' : 'resumes';
    const ext = file.name.split('.').pop() || (category === 'avatar' ? 'jpg' : 'pdf');
    const filePath = `${FIXED_USER_ID}/${category}.${ext}`;

    // Convert File to ArrayBuffer for Supabase upload
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage (upsert to overwrite existing)
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error(uploadError.message);
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // Also update the config in the DB immediately
    const configField = category === 'avatar' ? 'avatarUrl' : 'resumeUrl';
    
    // First get existing config
    const { data: existing } = await supabaseAdmin
      .from('portfolio_settings')
      .select('config')
      .eq('id', 1)
      .single();

    const currentConfig = existing?.config || {};
    const updatedConfig = { 
      ...currentConfig, 
      [configField]: publicUrl,
      ...(category === 'resume' ? { resumeFileName: file.name } : {})
    };

    await supabaseAdmin
      .from('portfolio_settings')
      .upsert({
        id: 1,
        config: updatedConfig,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    return NextResponse.json({
      url: publicUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      success: true,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Upload error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE — remove a file by category from Supabase Storage
export async function DELETE(request: NextRequest) {
  try {
    const { category } = await request.json();
    const bucket = category === 'avatar' ? 'profile-images' : 'resumes';

    // List all files in the user's folder
    const { data: files } = await supabaseAdmin.storage
      .from(bucket)
      .list(FIXED_USER_ID);

    if (files && files.length > 0) {
      const filePaths = files.map(f => `${FIXED_USER_ID}/${f.name}`);
      await supabaseAdmin.storage.from(bucket).remove(filePaths);
    }

    // Also clear the URL from the config in DB
    const configField = category === 'avatar' ? 'avatarUrl' : 'resumeUrl';
    
    const { data: existing } = await supabaseAdmin
      .from('portfolio_settings')
      .select('config')
      .eq('id', 1)
      .single();

    if (existing?.config) {
      const updatedConfig = { ...existing.config };
      delete updatedConfig[configField];
      if (category === 'resume') {
        delete updatedConfig.resumeFileName;
      }

      await supabaseAdmin
        .from('portfolio_settings')
        .upsert({
          id: 1,
          config: updatedConfig,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Delete error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
