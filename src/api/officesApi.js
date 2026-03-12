// src/api/officesApi.js
import { supabase } from '../config/supabaseClient';

// ==================== OFFICES ====================

/**
 * Fetch all offices
 */
export const getAllOffices = async () => {
  try {
    const { data, error } = await supabase
      .from('offices')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching offices:', error);
    return { data: null, error: error.message };
  }
};

/**
 * Fetch offices by category
 */
export const getOfficesByCategory = async (category) => {
  try {
    const { data, error } = await supabase
      .from('offices')
      .select('*')
      .eq('category', category)
      .order('name', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching offices by category:', error);
    return { data: null, error: error.message };
  }
};

/**
 * Fetch single office by office_id
 */
export const getOfficeByOfficeId = async (officeId) => {
  try {
    const { data, error } = await supabase
      .from('offices')
      .select('*')
      .eq('office_id', officeId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching office:', error);
    return { data: null, error: error.message };
  }
};

/**
 * Search offices by name, description, or building
 */
export const searchOffices = async (searchQuery) => {
  try {
    const { data, error } = await supabase
      .from('offices')
      .select('*')
      .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,building.ilike.%${searchQuery}%`)
      .order('name', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error searching offices:', error);
    return { data: null, error: error.message };
  }
};

/**
 * Create a new office
 */
export const createOffice = async (officeData) => {
  try {
    const { data, error } = await supabase
      .from('offices')
      .insert([officeData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating office:', error);
    return { data: null, error: error.message };
  }
};

// ==================== NAVIGATION VIDEOS ====================

/**
 * Fetch all navigation videos for an office
 */
export const getNavigationVideos = async (officeId) => {
  try {
    const { data, error } = await supabase
      .from('navigation_videos')
      .select('*')
      .eq('office_id', officeId)
      .order('step_number', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching navigation videos:', error);
    return { data: null, error: error.message };
  }
};

/**
 * Upload navigation video to Supabase Storage
 */
export const uploadNavigationVideo = async (file, officeId, stepNumber) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${officeId}/step-${stepNumber}-${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('navigation-videos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('navigation-videos')
      .getPublicUrl(fileName);

    return { data: { path: uploadData.path, publicUrl }, error: null };
  } catch (error) {
    console.error('Error uploading video:', error);
    return { data: null, error: error.message };
  }
};

/**
 * Create navigation video record
 */
export const createNavigationVideo = async (videoData) => {
  try {
    const { data, error } = await supabase
      .from('navigation_videos')
      .insert([videoData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating navigation video:', error);
    return { data: null, error: error.message };
  }
};

// ==================== NAVIGATION INSTRUCTIONS ====================

/**
 * Fetch navigation instructions for a video
 */
export const getNavigationInstructions = async (videoId) => {
  try {
    const { data, error } = await supabase
      .from('navigation_instructions')
      .select('*')
      .eq('video_id', videoId)
      .order('sequence_order', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching navigation instructions:', error);
    return { data: null, error: error.message };
  }
};

/**
 * Create navigation instruction
 */
export const createNavigationInstruction = async (instructionData) => {
  try {
    const { data, error } = await supabase
      .from('navigation_instructions')
      .insert([instructionData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating navigation instruction:', error);
    return { data: null, error: error.message };
  }
};

// ==================== QR CODES ====================

/**
 * Fetch QR code for an office
 */
export const getQRCode = async (officeId) => {
  try {
    const { data, error } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('office_id', officeId)
      .maybeSingle(); // ← fixed: was .single()

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching QR code:', error);
    return { data: null, error: error.message };
  }
};

/**
 * Upload QR code image to Supabase Storage
 */
export const uploadQRCode = async (qrDataUrl, officeId) => {
  try {
    const response = await fetch(qrDataUrl);
    const blob = await response.blob();

    const fileName = `${officeId}-qr-${Date.now()}.png`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('qr-codes')
      .upload(fileName, blob, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('qr-codes')
      .getPublicUrl(fileName);

    return { data: { path: uploadData.path, publicUrl }, error: null };
  } catch (error) {
    console.error('Error uploading QR code:', error);
    return { data: null, error: error.message };
  }
};

/**
 * Create or update QR code record
 */
export const saveQRCode = async (qrCodeData) => {
  try {
    const { data, error } = await supabase
      .from('qr_codes')
      .upsert([qrCodeData], { onConflict: 'office_id' })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error saving QR code:', error);
    return { data: null, error: error.message };
  }
};

// ==================== COMPLETE OFFICE DATA ====================

/**
 * Fetch complete office data with videos, instructions, and QR code
 */
export const getCompleteOfficeData = async (officeId) => {
  try {
    const { data: office, error: officeError } = await supabase
      .from('offices')
      .select('*')
      .eq('office_id', officeId)
      .single();

    if (officeError) throw officeError;

    const { data: videos, error: videosError } = await supabase
      .from('navigation_videos')
      .select(`
        *,
        navigation_instructions (*)
      `)
      .eq('office_id', office.id)
      .order('step_number', { ascending: true });

    if (videosError) throw videosError;

    const { data: qrCode } = await supabase
      .from('qr_codes')
      .select('*')
      .eq('office_id', office.id)
      .maybeSingle(); // ← fixed here too

    const indoorRoute = videos.map((video) => ({
      step: video.step_number,
      instruction: video.navigation_instructions[0]?.instruction_text || 'Continue forward',
      landmark: video.navigation_instructions[0]?.landmark || '',
      distance: video.navigation_instructions[0]?.distance || '10m',
      duration: video.duration,
      videoUrl: video.video_url,
      type: video.navigation_instructions[0]?.instruction_type || 'go_straight'
    }));

    return {
      data: {
        ...office,
        indoorRoute,
        qrCode
      },
      error: null
    };
  } catch (error) {
    console.error('Error fetching complete office data:', error);
    return { data: null, error: error.message };
  }
};