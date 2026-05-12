import React, { createContext, useContext, useState, useCallback } from 'react';
import clsx from 'clsx';

type AnnouncementType = 'polite' | 'assertive';

interface Announcement {
  id: string;
  message: string;
  type: AnnouncementType;
}

interface LiveRegionContextValue {
  announce: (message: string, type?: AnnouncementType) => void;
}

const LiveRegionContext = createContext<LiveRegionContextValue | null>(null);

export function LiveRegionProvider({ children }: { children: React.ReactNode }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const announce = useCallback((message: string, type: AnnouncementType = 'polite') => {
    const id = `announcement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setAnnouncements((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    }, 3000);
  }, []);

  return (
    <LiveRegionContext.Provider value={{ announce }}>
      {children}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcements
          .filter((a) => a.type === 'polite')
          .map((a) => (
            <div key={a.id}>{a.message}</div>
          ))}
      </div>
      <div className="sr-only" aria-live="assertive" aria-atomic="true">
        {announcements
          .filter((a) => a.type === 'assertive')
          .map((a) => (
            <div key={a.id}>{a.message}</div>
          ))}
      </div>
    </LiveRegionContext.Provider>
  );
}

export function useLiveRegion() {
  const context = useContext(LiveRegionContext);
  if (!context) {
    throw new Error('useLiveRegion must be used within LiveRegionProvider');
  }
  return context;
}

export interface AnnouncementToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

export function AnnouncementToast({ message, type = 'info', duration = 3000 }: AnnouncementToastProps) {
  const [visible, setVisible] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const bgColor = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-primary-600',
  }[type];

  if (!visible) return null;

  return (
    <div
      className={clsx(
        'fixed bottom-4 right-4 px-4 py-3 rounded-lg text-white shadow-lg z-50',
        bgColor
      )}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}

export default LiveRegionProvider;