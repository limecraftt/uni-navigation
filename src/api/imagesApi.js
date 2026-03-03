// src/api/imagesApi.js
import { supabase } from '../config/supabaseClient';

// ==================== CLOUDINARY UPLOAD ====================

/**
 * Upload video to Cloudinary with progress tracking
 */
export const uploadVideoToCloudinary = async (file, onProgress) => {
  try {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          const cloudName2 = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
          resolve({
            data: {
              publicUrl: data.secure_url,
              publicId: data.public_id,
              duration: Math.round(data.duration),
              thumbnail: `https://res.cloudinary.com/${cloudName2}/video/upload/so_0,w_600,h_400,c_fill/${data.public_id}.jpg`
            },
            error: null
          });
        } else {
          resolve({ data: null, error: 'Upload failed: ' + xhr.statusText });
        }
      });

      xhr.addEventListener('error', () => resolve({ data: null, error: 'Network error during upload' }));
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`);
      xhr.send(formData);
    });
  } catch (error) {
    return { data: null, error: error.message };
  }
};

// ==================== CAMPUS IMAGES ====================

export const getAllCampusImages = async () => {
  try {
    const { data, error } = await supabase
      .from('campus_images')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

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
    return { data: null, error: error.message };
  }
};

export const getCampusImagesByLocation = async () => {
  try {
    const { data, error } = await supabase
      .from('campus_images')
      .select('*')
      .order('location_name', { ascending: true })
      .order('display_order', { ascending: true });
    if (error) throw error;

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
        id: image.id,
        src: image.image_url,
        caption: image.caption,
        thumbnail: image.thumbnail_url,
        storagePath: image.image_url
      });
      return acc;
    }, {});

    return { data: Object.values(grouped), error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const uploadCampusImage = async (file, locationName) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${locationName}/${Date.now()}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('campus-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = supabase.storage
      .from('campus-images')
      .getPublicUrl(fileName);
    return { data: { path: uploadData.path, publicUrl }, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

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
    return { data: null, error: error.message };
  }
};

export const deleteCampusImage = async (imageId, imagePath) => {
  try {
    if (imagePath) {
      await supabase.storage.from('campus-images').remove([imagePath]);
    }
    const { error } = await supabase.from('campus_images').delete().eq('id', imageId);
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// ==================== PANORAMA VIDEOS ====================

export const getAllPanoramas = async () => {
  try {
    const { data, error } = await supabase
      .from('panorama_images')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

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
    return { data: null, error: error.message };
  }
};

export const deletePanorama = async (panoramaId, imagePath) => {
  try {
    if (imagePath) {
      await supabase.storage.from('panoramas').remove([imagePath]);
    }
    const { error } = await supabase.from('panorama_images').delete().eq('id', panoramaId);
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};