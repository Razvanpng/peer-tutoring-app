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
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  acceptSession: async (sessionId, mentorId) => {
    const { data, error } = await supabase
      .from('sessions')
      .update({ status: 'accepted', mentor_id: mentorId })
      .eq('id', sessionId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  getSession: async (id) => {
    const { data, error } = await supabase
      .from('sessions')
      .select('*, mentee:profiles!mentee_id(id, role), mentor:profiles!mentor_id(id, role)')
      .eq('id', id)
      .single();
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

  sendMessage: async (sessionId, senderId, content) => {
    const { data, error } = await supabase
      .from('messages')
      .insert([{ session_id: sessionId, sender_id: senderId, content }])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  updateSessionStatus: async (sessionId, newStatus) => {
    const { data, error } = await supabase
      .from('sessions')
      .update({ status: newStatus })
      .eq('id', sessionId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  submitReview: async (sessionId, rating, review) => {
    const { data, error } = await supabase
      .from('sessions')
      .update({ rating, review })
      .eq('id', sessionId)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
};

export const profilesApi = {
  getProfile: async (id) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  },
  
  updateProfile: async (id, updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  getAllMentors: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'mentor');
    if (error) throw new Error(error.message);
    return data;
  }
};