// src/api/imagesApi.js
import { supabase } from '../config/supabaseClient';

// ==================== CAMPUS IMAGES ====================

/**
 * Fetch all campus images
 */
export const getAllCampusImages = async () => {
  try {
    const { data, error } = await supabase
      .from('campus_images')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching campus images:', error);
    return { data: null, error: error.message };
  }
};

/**
 * Fetch images by category
 */
export const getCampusImagesByCategory = async (category) => {
  try {
    const { data, error } = await supabase
      .from('campus_images')
      .select('*')
      .eq('category', category)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching images by category:', error);
    return { data: null, error: error.message };
  }
};

/**
 * Fetch images grouped by location
 */
export const getCampusImagesByLocation = async () => {
  try {
    const { data, error } = await supabase
      .from('campus_images')
      .select('*')
      .order('location_name', { ascending: true })
      .order('display_order', { ascending: true });

    if (error) throw error;

    // Group by location
    const grouped = data.reduce((acc, image) => {
      if (!acc[image.location_name]) {
        acc[image.location_name] = {
          name: image.location_name,
          category: image.category,
          walkingTime: image.walking_time,
          images: []
        };
      }
      acc[image.location_name].images.push({
        src: image.image_url,
        caption: image.caption,
        thumbnail: image.thumbnail_url
      });
      return acc;
    }, {});

    return { data: Object.values(grouped), error: null };
  } catch (error) {
    console.error('Error fetching grouped images:', error);
    return { data: null, error: error.message };
  }
};

/**
 * Upload campus image to Supabase Storage
 */
export const uploadCampusImage = async (file, locationName) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${locationName}/${Date.now()}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('campus-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('campus-images')
      .getPublicUrl(fileName);

    return { data: { path: uploadData.path, publicUrl }, error: null };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { data: null, error: error.message };
  }
};

/**
 * Create campus image record
 */
export const createCampusImage = async (imageData) => {
  try {
    const { data, error } = await supabase
      .from('campus_images')
      .insert([imageData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating campus image:', error);
    return { data: null, error: error.message };
  }
};

/**
 * Delete campus image
 */
export const deleteCampusImage = async (imageId, imagePath) => {
  try {
    // Delete from storage
    if (imagePath) {
      const { error: storageError } = await supabase.storage
        .from('campus-images')
        .remove([imagePath]);
      
      if (storageError) console.error('Storage delete error:', storageError);
    }

    // Delete from database
    const { error } = await supabase
      .from('campus_images')
      .delete()
      .eq('id', imageId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting campus image:', error);
    return { error: error.message };
  }
};

// ==================== PANORAMA IMAGES ====================

/**
 * Fetch all panorama images
 */
export const getAllPanoramas = async () => {
  try {
    const { data, error } = await supabase
      .from('panorama_images')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching panoramas:', error);
    return { data: null, error: error.message };
  }
};

/**
 * Upload panorama image to Supabase Storage
 */
export const uploadPanorama = async (file, title) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('panoramas')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('panoramas')
      .getPublicUrl(fileName);

    return { data: { path: uploadData.path, publicUrl }, error: null };
  } catch (error) {
    console.error('Error uploading panorama:', error);
    return { data: null, error: error.message };
  }
};

/**
 * Create panorama record
 */
export const createPanorama = async (panoramaData) => {
  try {
    const { data, error } = await supabase
      .from('panorama_images')
      .insert([panoramaData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating panorama:', error);
    return { data: null, error: error.message };
  }
};

/**
 * Delete panorama image
 */
export const deletePanorama = async (panoramaId, imagePath) => {
  try {
    // Delete from storage
    if (imagePath) {
      const { error: storageError } = await supabase.storage
        .from('panoramas')
        .remove([imagePath]);
      
      if (storageError) console.error('Storage delete error:', storageError);
    }

    // Delete from database
    const { error } = await supabase
      .from('panorama_images')
      .delete()
      .eq('id', panoramaId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting panorama:', error);
    return { error: error.message };
  }
};