import { supabase } from '@/lib/supabase';

/** Saves license image URL after Cloudinary upload. Verification stays pending until admin approves. */
export async function saveMyPermisPicture(userId: string, cloudinarySecureUrl: string): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({
      permis_picture: cloudinarySecureUrl.trim(),
      permis_verified: false,
    })
    .eq('id', userId);

  if (error) throw new Error(error.message);
}
