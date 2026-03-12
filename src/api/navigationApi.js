import { supabase } from '../config/supabaseClient';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// ─── Cloudinary Upload ────────────────────────────────────────────
export const uploadVideoToCloudinary = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('resource_type', 'video');
  formData.append('folder', 'navigation-videos');

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    });

    xhr.addEventListener('load', () => {
      const response = JSON.parse(xhr.responseText);
      if (xhr.status === 200) {
        resolve({
          url: response.secure_url,
          publicId: response.public_id,
          duration: Math.round(response.duration || 0)
        });
      } else {
        reject(new Error(response.error?.message || 'Upload failed'));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
    
    xhr.open(
      'POST',
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`
    );
    xhr.send(formData);
  });
};

// ─── Get All Edges (for BFS - public) ────────────────────────────
export const getAllEdges = async () => {
  const { data, error } = await supabase
    .from('navigation_edges')
    .select(`
      *,
      from_location:campus_locations!from_location_id(id, name, category),
      to_location:campus_locations!to_location_id(id, name, category)
    `)
    .eq('is_active', true)
    .order('created_at');
  return { data, error };
};

// ─── Get All Edges (for admin) ────────────────────────────────────
export const getAllEdgesAdmin = async () => {
  const { data, error } = await supabase
    .from('navigation_edges')
    .select(`
      *,
      from_location:campus_locations!from_location_id(id, name, category),
      to_location:campus_locations!to_location_id(id, name, category)
    `)
    .order('created_at', { ascending: false });
  return { data, error };
};

// ─── Create Edge ──────────────────────────────────────────────────
export const createEdge = async (payload) => {
  const { data, error } = await supabase
    .from('navigation_edges')
    .insert([payload])
    .select()
    .single();
  return { data, error };
};

// ─── Delete Edge ──────────────────────────────────────────────────
export const deleteEdge = async (id) => {
  const { error } = await supabase
    .from('navigation_edges')
    .delete()
    .eq('id', id);
  return { error };
};

// ─── Toggle Active ────────────────────────────────────────────────
export const toggleEdgeActive = async (id, is_active) => {
  const { data, error } = await supabase
    .from('navigation_edges')
    .update({ is_active })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
};