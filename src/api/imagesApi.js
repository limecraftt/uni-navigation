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
    formData.append('resource_type', 'video');
    formData.append('folder', 'uni-navigation/panoramas');

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
          // FIX: Removed redundant cloudName2 — cloudName is already in scope
          resolve({
            data: {
              publicUrl: data.secure_url,
              publicId: data.public_id,
              duration: Math.round(data.duration),
              thumbnail: `https://res.cloudinary.com/${cloudName}/video/upload/so_0,w_600,h_400,c_fill/${data.public_id}.jpg`
            },
            error: null
          });
        } else {
          resolve({ data: null, error: 'Upload failed: ' + xhr.statusText });
        }
      });

      xhr.addEventListener('error', () => resolve({ data: null, error: 'Network error during upload' }));
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);
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

    // FIX: Guard against null data before calling .reduce()
    if (!data) return { data: [], error: null };

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
    // FIX: Validate file type and size before uploading
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return { data: null, error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` };
    }
    if (file.size > maxSizeBytes) {
      return { data: null, error: 'File size exceeds 10MB limit.' };
    }

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
      // FIX: Handle storage deletion error instead of silently ignoring it
      const { error: storageError } = await supabase.storage
        .from('campus-images')
        .remove([imagePath]);
      if (storageError) throw storageError;
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

/**
 * FIX: Panorama videos are stored on Cloudinary, not Supabase Storage.
 * Deletion from Cloudinary must be done server-side (e.g. via a backend endpoint
 * or Cloudinary Admin API) using the publicId, to avoid exposing API secrets.
 * This function now deletes only the database record and logs a warning if a
 * cloudinaryPublicId is provided but cannot be cleaned up client-side.
 *
 * To fully delete the Cloudinary asset, call your backend endpoint, e.g.:
 *   await fetch('/api/cloudinary/delete', { method: 'POST', body: JSON.stringify({ publicId }) })
 *
 * @param {string} panoramaId - The database row ID
 * @param {string|null} cloudinaryPublicId - The Cloudinary public_id of the video
 */
export const deletePanorama = async (panoramaId, cloudinaryPublicId) => {
  try {
    if (cloudinaryPublicId) {
      console.warn(
        'Cloudinary asset deletion must be handled server-side to protect API credentials. ' +
        `Please delete public_id "${cloudinaryPublicId}" via your backend.`
      );
      // TODO: Call your backend endpoint here, e.g.:
      // const res = await fetch('/api/cloudinary/delete', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ publicId: cloudinaryPublicId }),
      // });
      // if (!res.ok) throw new Error('Failed to delete Cloudinary asset');
    }

    const { error } = await supabase.from('panorama_images').delete().eq('id', panoramaId);
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};