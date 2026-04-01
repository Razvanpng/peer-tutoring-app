import { supabase } from './supabase';

export const sessionsApi = {
  getPendingSessions: async () => {
    const { data, error } = await supabase
      .from('sessions')
      .select('*, mentee:profiles!mentee_id(role)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },

  getMenteeSessions: async (menteeId) => {
    const { data, error } = await supabase
      .from('sessions')
      .select('*, mentor:profiles!mentor_id(role)')
      .eq('mentee_id', menteeId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },

  getMentorSessions: async (mentorId) => {
    const { data, error } = await supabase
      .from('sessions')
      .select('*, mentee:profiles!mentee_id(role)')
      .eq('mentor_id', mentorId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },

  createSession: async (sessionData) => {
    const { data, error } = await supabase
      .from('sessions')
      .insert([sessionData])
      .select();
    
    if (error) throw new Error(error.message);
    return data?.[0]; 
  },

  acceptSession: async (sessionId, mentorId) => {
    const { data, error } = await supabase
      .from('sessions')
      .update({ status: 'accepted', mentor_id: mentorId })
      .eq('id', sessionId)
      .select();
    
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error('Session not found or update failed.');
    return data[0];
  },

  getSession: async (id) => {
    const { data, error } = await supabase
      .from('sessions')
      .select('*, mentee:profiles!mentee_id(id, role), mentor:profiles!mentor_id(id, role)')
      .eq('id', id)
      .maybeSingle(); 
    
    if (error) throw new Error(error.message);
    return data;
  },

  getMessages: async (sessionId) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  },

  uploadChatImage: async (sessionId, file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${sessionId}/${Date.now()}-${Math.random()}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('chat-images')
      .upload(fileName, file);

    if (error) throw new Error(error.message);

    const { data } = supabase.storage
      .from('chat-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  },

  sendMessage: async (sessionId, senderId, content, imageUrl = null) => {
    const { data, error } = await supabase
      .from('messages')
      .insert([{ session_id: sessionId, sender_id: senderId, content, image_url: imageUrl }])
      .select();
    
    if (error) throw new Error(error.message);
    return data?.[0];
  },

  updateSessionStatus: async (sessionId, newStatus) => {
    const { data, error } = await supabase
      .from('sessions')
      .update({ status: newStatus })
      .eq('id', sessionId)
      .select();
    
    if (error) throw new Error(error.message);
    return data?.[0];
  },

  submitReview: async (sessionId, rating, review) => {
    const { data, error } = await supabase
      .from('sessions')
      .update({ rating, review })
      .eq('id', sessionId)
      .select();
    
    if (error) throw new Error(error.message);
    return data?.[0];
  }
};

export const profilesApi = {
  getProfile: async (id) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  },
  
  updateProfile: async (id, updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw new Error(error.message);
    return data?.[0];
  },

  getAllMentors: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'mentor');
    if (error) throw new Error(error.message);
    return data;
  },

  uploadAvatar: async (userId, file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file);

    if (uploadError) throw new Error(uploadError.message);

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }
};