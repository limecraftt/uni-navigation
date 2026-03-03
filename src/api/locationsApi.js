import { supabase } from '../config/supabaseClient';

export const getAllLocations = async () => {
  const { data, error } = await supabase
    .from('campus_locations')
    .select('*')
    .eq('is_active', true)
    .order('category').order('name');
  return { data, error };
};

export const getAllLocationsAdmin = async () => {
  const { data, error } = await supabase
    .from('campus_locations')
    .select('*')
    .order('category').order('name');
  return { data, error };
};

export const createLocation = async (payload) => {
  const { data, error } = await supabase
    .from('campus_locations').insert([payload]).select().single();
  return { data, error };
};

export const updateLocation = async (id, payload) => {
  const { data, error } = await supabase
    .from('campus_locations').update(payload).eq('id', id).select().single();
  return { data, error };
};

export const deleteLocation = async (id) => {
  const { error } = await supabase
    .from('campus_locations').delete().eq('id', id);
  return { error };
};
