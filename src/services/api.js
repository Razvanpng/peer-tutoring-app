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
  }
};