import React, { useState, useRef } from 'react';
import { storageApi, UploadResult } from '../../api/storage';
import { UploadCloud, CheckCircle2, Image as ImageIcon, Copy, Check, AlertCircle, RefreshCw } from 'lucide-react';

interface ImageUploaderProps {
  label?: string;
  folder?: 'hotels' | 'rooms' | 'general';
  value?: string;
  onChange: (url: string) => void;
  onUploadComplete?: (result: UploadResult) => void;
  previewHeight?: string;
  compact?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label = 'Upload Photo to Neon Storage',
  folder = 'hotels',
  value = '',
  onChange,
  onUploadComplete,
  previewHeight = '140px',
  compact = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP)');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const res = await storageApi.uploadImage(file, folder);
      onChange(res.url);
      if (onUploadComplete) {
        onUploadComplete(res);
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err.message || 'Upload failed. Please try again or paste image URL.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCopyUrl = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isNeonStorage = value && value.includes('neon.tech');

  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
          {label}
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setMode('upload')}
            style={{
              background: 'none',
              border: 'none',
              color: mode === 'upload' ? '#4f46e5' : 'var(--text-muted)',
              fontWeight: mode === 'upload' ? 700 : 500,
              cursor: 'pointer',
              textDecoration: mode === 'upload' ? 'underline' : 'none'
            }}
          >
            File Upload
          </button>
          <span style={{ color: 'var(--border)' }}>|</span>
          <button
            type="button"
            onClick={() => setMode('url')}
            style={{
              background: 'none',
              border: 'none',
              color: mode === 'url' ? '#4f46e5' : 'var(--text-muted)',
              fontWeight: mode === 'url' ? 700 : 500,
              cursor: 'pointer',
              textDecoration: mode === 'url' ? 'underline' : 'none'
            }}
          >
            Paste URL
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <div
            onClick={() => !uploading && fileInputRef.current?.click()}
            style={{
              border: '2px dashed var(--border)',
              borderRadius: '10px',
              padding: compact ? '0.75rem' : '1.25rem',
              textAlign: 'center',
              backgroundColor: uploading ? '#f1f5f9' : '#ffffff',
              cursor: uploading ? 'default' : 'pointer',
              transition: 'border-color 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            {uploading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4f46e5' }}>
                <RefreshCw size={20} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Uploading to Neon Database Storage...</span>
              </div>
            ) : (
              <>
                <UploadCloud size={24} color="#4f46e5" />
                <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Click to select photo or drag & drop
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  JPEG, PNG, WebP • Auto-uploaded directly to Neon Object Storage
                </span>
              </>
            )}
          </div>
        </div>
      ) : (
        <input
          type="url"
          placeholder="https://..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: '100%', fontSize: '0.85rem' }}
        />
      )}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem' }}>
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {/* Image Preview & URL Display */}
      {value && (
        <div style={{
          marginTop: '0.6rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backgroundColor: '#f8fafc',
          padding: '0.5rem',
          borderRadius: '8px',
          border: '1px solid var(--border)'
        }}>
          <div style={{
            width: '70px',
            height: '50px',
            borderRadius: '6px',
            overflow: 'hidden',
            backgroundColor: '#e2e8f0',
            flexShrink: 0
          }}>
            <img src={value} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
              {isNeonStorage && (
                <span style={{
                  backgroundColor: '#00e599',
                  color: '#0f172a',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.4rem',
                  borderRadius: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <CheckCircle2 size={11} /> Neon Storage
                </span>
              )}
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Download URL:</span>
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-main)',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {value}
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyUrl}
            title="Copy download URL"
            style={{
              padding: '0.35rem',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.7rem',
              color: copied ? '#059669' : 'var(--text-muted)'
            }}
          >
            {copied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
