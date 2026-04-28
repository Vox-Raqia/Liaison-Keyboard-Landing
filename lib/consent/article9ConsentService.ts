import { supabase } from '../supabase';
import { getCurrentUserId } from '../lib/authSession';

export const ARTICLE9_CONSENT_VERSION = '1.0';

export async function hasArticle9Consent(): Promise<boolean> {
  const userId = getCurrentUserId();
  if (!userId) return false;
  
  const { data, error } = await supabase
    .from('users')
    .select('article9_consent_accepted, article9_consent_version')
    .eq('id', userId)
    .single();
  
  if (error || !data) return false;
  return data.article9_consent_accepted === true && 
         data.article9_consent_version === ARTICLE9_CONSENT_VERSION;
}

export async function grantArticle9Consent(): Promise<boolean> {
  const userId = getCurrentUserId();
  if (!userId) return false;
  
  const { error } = await supabase
    .from('users')
    .update({
      article9_consent_accepted: true,
      article9_consent_version: ARTICLE9_CONSENT_VERSION,
      article9_consent_accepted_at: new Date().toISOString(),
    })
    .eq('id', userId);
  
  return !error;
}

export async function revokeArticle9Consent(): Promise<boolean> {
  const userId = getCurrentUserId();
  if (!userId) return false;
  
  const { error } = await supabase
    .from('users')
    .update({
      article9_consent_accepted: false,
      article9_consent_revoked_at: new Date().toISOString(),
    })
    .eq('id', userId);
  
  return !error;
}