/// <reference types="node" />
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION_NAME || "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { fileName, fileType } = req.body;
    
    if (!fileName || !fileType) {
      return res.status(400).json({ error: "Faltan los datos fileName o fileType" });
    }

    const bucketName = process.env.AWS_BUCKET_NAME || "";
    const regionName = process.env.AWS_REGION_NAME || "";
    const uniqueFileName = `${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueFileName,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    const imageUrl = `https://${bucketName}.s3.${regionName}.amazonaws.com/${uniqueFileName}`;

    return res.status(200).json({ uploadUrl, imageUrl });
  } catch (error: any) {
    console.error("Error en la API de upload:", error);
    return res.status(500).json({ error: error.message });
  }
}