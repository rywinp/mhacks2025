// import { useState } from 'react';
// import { supabase } from './supabaseClient';
// import * as FileSystem from 'expo-file-system';

// export function useUploadImage() {
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const uploadImage = async (photo: CameraCapturedPicture, bucket = 'images') => {
//     try {
//       setUploading(true);
//       setError(null);

//       // Convert local URI to Blob
//       const blob = await (await fetch(photo.uri)).blob();

//       // Create unique file name
//       const fileExt = photo.uri.split('.').pop();
//       const fileName = `${Date.now()}.${fileExt}`;

//       // Upload to Supabase Storage
//       const { data, error: uploadError } = await supabase.storage
//         .from(bucket)
//         .upload(fileName, blob);

//       if (uploadError) {
//         setError(uploadError.message);
//         return null;
//       }

//       return data?.path; // return the path of uploaded image
//     } catch (err: any) {
//       setError(err.message);
//       return null;
//     } finally {
//       setUploading(false);
//     }
//   };

//   return { uploadImage, uploading, error };
// }
