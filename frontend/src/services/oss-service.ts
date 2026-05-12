export interface OssConfig {
  bucket: string;
  region: string;
  accessKeyId?: string;
  accessKeySecret?: string;
  stsToken?: string;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  publicUrl: string;
  expiresAt: string;
}

export class OssService {
  private apiUrl: string;
  private bucket: string;
  private region: string;

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    this.bucket = process.env.NEXT_PUBLIC_OSS_BUCKET || '';
    this.region = process.env.NEXT_PUBLIC_OSS_REGION || 'oss-cn-hangzhou';
  }

  async getPresignedUploadUrl(
    filename: string,
    contentType: string
  ): Promise<PresignedUrlResponse> {
    const response = await fetch(`${this.apiUrl}/oss/v1/GetUploadUrl`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bucket: this.bucket,
        region: this.region,
        filename,
        contentType,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get upload URL');
    }

    return response.json();
  }

  async uploadFile(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const { uploadUrl, publicUrl } = await this.getPresignedUploadUrl(
      file.name,
      file.type
    );

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress((e.loaded / e.total) * 100);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(publicUrl);
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  }

  getPublicUrl(objectKey: string): string {
    return `https://${this.bucket}.${this.region}.aliyuncs.com/${objectKey}`;
  }
}

export const ossService = new OssService();