import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { Buffer } from 'node:buffer';
import type { IncomingMessage } from 'node:http';

interface NeonStorageConfig {
  apiKey?: string;
  projectId?: string;
  branchId?: string;
  bucketName?: string;
  storageEndpoint?: string;
}

/**
 * Vite plugin that provides /api/v1/storage endpoints connected to Neon Database Object Storage
 * Uses environment variables (NEON_API_KEY, VITE_NEON_PROJECT_ID, etc.) - no secrets hardcoded.
 */
function neonStoragePlugin(config: NeonStorageConfig): Plugin {
  const {
    apiKey = '',
    projectId = '',
    branchId = '',
    bucketName = '',
    storageEndpoint = ''
  } = config;

  return {
    name: 'neon-storage-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';
        if (!url.startsWith('/api/v1/storage/')) {
          return next();
        }

        if (!apiKey) {
          console.warn('[Neon Storage] NEON_API_KEY is not configured in environment.');
        }

        // Endpoint: /api/v1/storage/presign
        if (url === '/api/v1/storage/presign' && req.method === 'POST') {
          try {
            const bodyStr = await readRequestBody(req);
            const { fileName, contentType, folder = 'hotels' } = JSON.parse(bodyStr || '{}');
            const cleanName = (fileName || 'image.jpg').replace(/[^a-zA-Z0-9.-]/g, '_');
            const objectKey = `${folder}/${Date.now()}-${cleanName}`;
            const cType = contentType || 'image/jpeg';

            const presignInfo = await getNeonPresignedUrl(objectKey, cType, { apiKey, projectId, branchId, bucketName });
            const downloadUrl = `${storageEndpoint}/${bucketName}/${objectKey}`;

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              uploadUrl: presignInfo.url,
              downloadUrl,
              objectKey
            }));
          } catch (err: any) {
            console.error('[Neon Storage] Presign error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message || 'Presign failed' }));
          }
          return;
        }

        // Endpoint: /api/v1/storage/upload
        if (url === '/api/v1/storage/upload' && req.method === 'POST') {
          try {
            const chunks: Buffer[] = [];
            for await (const chunk of req) {
              chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
            }
            const buffer = Buffer.concat(chunks);
            const contentTypeHeader = req.headers['content-type'] || '';

            let fileBuffer: Buffer = buffer;
            let fileName = 'upload.jpg';
            let fileType = 'image/jpeg';
            let folder = 'hotels';

            if (contentTypeHeader.includes('multipart/form-data')) {
              const boundaryMatch = contentTypeHeader.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
              const boundary = boundaryMatch ? (boundaryMatch[1] || boundaryMatch[2]) : null;

              if (boundary) {
                const parts = parseMultipart(buffer, boundary);
                for (const p of parts) {
                  if (p.filename) {
                    fileBuffer = p.data;
                    fileName = p.filename;
                    if (p.contentType) fileType = p.contentType;
                  } else if (p.name === 'folder') {
                    folder = p.data.toString().trim();
                  }
                }
              }
            } else {
              fileType = contentTypeHeader || 'image/jpeg';
            }

            const cleanName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
            const objectKey = `${folder}/${Date.now()}-${cleanName}`;

            // Get presigned URL from Neon
            const presignInfo = await getNeonPresignedUrl(objectKey, fileType, { apiKey, projectId, branchId, bucketName });

            // Upload to Neon S3
            const uploadRes = await fetch(presignInfo.url, {
              method: 'PUT',
              headers: {
                'Content-Type': fileType
              },
              body: fileBuffer
            });

            if (!uploadRes.ok) {
              throw new Error(`Upload to Neon storage failed with status ${uploadRes.status}`);
            }

            const downloadUrl = `${storageEndpoint}/${bucketName}/${objectKey}`;
            console.log(`[Neon Storage] Uploaded: ${objectKey} -> ${downloadUrl}`);

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: true,
              url: downloadUrl,
              key: objectKey
            }));
          } catch (err: any) {
            console.error('[Neon Storage] Upload error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message || 'Upload failed' }));
          }
          return;
        }

        next();
      });
    }
  };
}

async function readRequestBody(req: any): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

async function getNeonPresignedUrl(
  objectKey: string,
  contentType: string,
  options: { apiKey: string; projectId: string; branchId: string; bucketName: string }
) {
  if (!options.apiKey) {
    throw new Error('NEON_API_KEY is not defined in environment variables');
  }

  const mcpBody = JSON.stringify({
    jsonrpc: '2.0',
    id: Date.now(),
    method: 'tools/call',
    params: {
      name: 'presign_storage_object',
      arguments: {
        project_id: options.projectId,
        branch_id: options.branchId,
        bucket_name: options.bucketName,
        object_key: objectKey,
        operation: 'upload',
        content_type: contentType
      }
    }
  });

  const res = await fetch('https://mcp.neon.tech/mcp', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${options.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream'
    },
    body: mcpBody
  });

  const text = await res.text();
  const dataLine = text.split('\n').find(l => l.startsWith('data: '));
  if (!dataLine) {
    throw new Error('Invalid MCP response from Neon');
  }

  const json = JSON.parse(dataLine.substring(6));
  const rawContent = json?.result?.content?.[0]?.text;
  if (!rawContent) {
    throw new Error('No content in presign response');
  }

  return JSON.parse(rawContent);
}

function parseMultipart(buffer: Buffer, boundary: string): Array<{ name?: string; filename?: string; contentType?: string; data: Buffer }> {
  const parts: Array<{ name?: string; filename?: string; contentType?: string; data: Buffer }> = [];
  const boundaryBuffer = Buffer.from(`--${boundary}`);
  let start = 0;

  while (true) {
    const idx = buffer.indexOf(boundaryBuffer, start);
    if (idx === -1) break;
    if (start > 0) {
      const partBuffer = buffer.slice(start, idx - 2);
      const headerEnd = partBuffer.indexOf('\r\n\r\n');
      if (headerEnd !== -1) {
        const headerStr = partBuffer.slice(0, headerEnd).toString('utf8');
        const data = partBuffer.slice(headerEnd + 4);

        const nameMatch = headerStr.match(/name="([^"]+)"/);
        const filenameMatch = headerStr.match(/filename="([^"]+)"/);
        const contentTypeMatch = headerStr.match(/Content-Type:\s*([^\r\n]+)/i);

        parts.push({
          name: nameMatch ? nameMatch[1] : undefined,
          filename: filenameMatch ? filenameMatch[1] : undefined,
          contentType: contentTypeMatch ? contentTypeMatch[1].trim() : undefined,
          data
        });
      }
    }
    start = idx + boundaryBuffer.length + 2;
  }

  return parts;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const neonConfig: NeonStorageConfig = {
    apiKey: process.env.NEON_API_KEY || env.NEON_API_KEY || '',
    projectId: process.env.VITE_NEON_PROJECT_ID || env.VITE_NEON_PROJECT_ID || '',
    branchId: process.env.VITE_NEON_BRANCH_ID || env.VITE_NEON_BRANCH_ID || '',
    bucketName: process.env.VITE_NEON_BUCKET_NAME || env.VITE_NEON_BUCKET_NAME || '',
    storageEndpoint: process.env.VITE_NEON_STORAGE_ENDPOINT || env.VITE_NEON_STORAGE_ENDPOINT || ''
  };

  return {
    plugins: [react(), neonStoragePlugin(neonConfig)],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          bypass(req) {
            if (req.url?.startsWith('/api/v1/storage')) {
              return req.url;
            }
          }
        }
      }
    }
  };
});
