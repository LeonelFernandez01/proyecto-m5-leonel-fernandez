export async function uploadImageToS3(file: File): Promise<string> {
  try {
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
      }),
    });

    if (!response.ok) {
      throw new Error('Error al obtener la URL firmada desde Vercel');
    }

    const { uploadUrl, imageUrl } = await response.json();

   
    const uploadResult = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!uploadResult.ok) {
      throw new Error('Error al subir el archivo físico a Amazon S3');
    }

     
    return imageUrl;
   } catch (error) {
    console.error('Error en el proceso de subida a S3:', error);
    throw error;
  }
}