export async function uploadImageToS3(file: File): Promise<string> {
  try {
    // 1. Le pedimos la URL firmada a nuestra función serverless de Vercel
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

    // 2. Usamos esa URL firmada para subir el archivo físico directo a AWS S3
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

    // Retornamos la URL pública de AWS para guardarla en Firestore
    return imageUrl;
  } catch (error: any) {
    console.error('Error en el proceso de subida a S3:', error);
    throw error;
  }
}