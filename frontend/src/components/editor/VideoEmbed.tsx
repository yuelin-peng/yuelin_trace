import React, { useState } from 'react';
import clsx from 'clsx';
import { Input } from '@/components/common/Input';

export interface VideoEmbedProps {
  onEmbed: (url: string) => void;
  className?: string;
}

const VIDEO_PATTERNS = {
  youtube: /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/)?([\w-]{11})/,
  vimeo: /^(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/,
  bilibili: /^(?:https?:\/\/)?(?:www\.)?bilibili\.com\/video\/(BV[\w]+)/,
  dailymotion: /^(?:https?:\/\/)?(?:www\.)?dailymotion\.com\/video\/([\w]+)/,
};

export function VideoEmbed({ onEmbed, className }: VideoEmbedProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const detectPlatform = (videoUrl: string): string | null => {
    for (const [platform, pattern] of Object.entries(VIDEO_PATTERNS)) {
      if (pattern.test(videoUrl)) {
        return platform;
      }
    }
    return null;
  };

  const getEmbedUrl = (videoUrl: string): string | null => {
    const platform = detectPlatform(videoUrl);
    
    switch (platform) {
      case 'youtube': {
        const match = videoUrl.match(VIDEO_PATTERNS.youtube);
        if (match) {
          return `https://www.youtube.com/embed/${match[1]}`;
        }
        break;
      }
      case 'vimeo': {
        const match = videoUrl.match(VIDEO_PATTERNS.vimeo);
        if (match) {
          return `https://player.vimeo.com/video/${match[1]}`;
        }
        break;
      }
      case 'bilibili': {
        const match = videoUrl.match(VIDEO_PATTERNS.bilibili);
        if (match) {
          return `https://player.bilibili.com/player.html?bvid=${match[1]}`;
        }
        break;
      }
      case 'dailymotion': {
        const match = videoUrl.match(VIDEO_PATTERNS.dailymotion);
        if (match) {
          return `https://www.dailymotion.com/embed/video/${match[1]}`;
        }
        break;
      }
    }
    
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!url.trim()) {
      setError('Please enter a video URL');
      return;
    }

    const embedUrl = getEmbedUrl(url.trim());
    if (embedUrl) {
      onEmbed(embedUrl);
      setUrl('');
    } else {
      setError('Unsupported video URL. Try YouTube, Vimeo, Bilibili, or Dailymotion.');
    }
  };

  return (
    <div className={clsx('space-y-3', className)}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste video URL (YouTube, Vimeo, Bilibili...)"
            error={error || undefined}
            aria-label="Video URL"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Embed
        </button>
      </form>
      <p className="text-xs text-gray-400">
        Supported: YouTube, Vimeo, Bilibili, Dailymotion
      </p>
    </div>
  );
}

export function VideoPlayer({ src, className }: { src: string; className?: string }) {
  return (
    <div className={clsx('video-player rounded-lg overflow-hidden', className)}>
      <iframe
        src={src}
        className="w-full aspect-video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Video player"
      />
    </div>
  );
}

export default VideoEmbed;