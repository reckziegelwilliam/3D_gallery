'use client';

import React, { useState, useEffect } from 'react';
import { useGalleryStore } from '@/store/galleryStore';

export function SettingsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Use Zustand selectors to prevent unnecessary re-renders
  const settings = useGalleryStore((state) => state.settings);
  const updateSettings = useGalleryStore((state) => state.updateSettings);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Escape' && isOpen) {
        setIsOpen(false);
      } else if (e.code === 'KeyM' && !isOpen) {
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-30 w-12 h-12 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
        title="Settings (M)"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gallery-cream rounded-lg shadow-2xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-bold text-gallery-darkWood">
            Settings
          </h2>
          <button
            title="Close"
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gallery-accent/10 rounded-full transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Settings */}
        <div className="space-y-6">
          {/* Quality */}
          <div>
            <label title="Graphics Quality" className="block text-sm font-medium text-gallery-darkWood mb-2">
              Graphics Quality
            </label>
            <select
              title="Graphics Quality"
              value={settings.quality}
              onChange={(e) =>
                updateSettings({
                  quality: e.target.value as 'low' | 'medium' | 'high',
                })
              }
              className="w-full px-3 py-2 bg-white border border-gallery-accent/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-gallery-gold"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Mouse Sensitivity */}
          <div>
            <label title="Mouse Sensitivity" className="block text-sm font-medium text-gallery-darkWood mb-2">
              Mouse Sensitivity: {settings.mouseSensitivity.toFixed(1)}
            </label>
            <input
              title="Mouse Sensitivity"
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={settings.mouseSensitivity}
              onChange={(e) =>
                updateSettings({
                  mouseSensitivity: parseFloat(e.target.value),
                })
              }
              className="w-full"
            />
          </div>

          {/* Movement Speed */}
          <div>
            <label title="Movement Speed" className="block text-sm font-medium text-gallery-darkWood mb-2">
              Movement Speed: {settings.movementSpeed.toFixed(1)} m/s
            </label>
            <input
              title="Movement Speed"
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={settings.movementSpeed}
              onChange={(e) =>
                updateSettings({ movementSpeed: parseFloat(e.target.value) })
              }
              className="w-full"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span title="Head Bob" className="text-sm font-medium text-gallery-darkWood">
                Head Bob
              </span>
              <input
                type="checkbox"
                checked={settings.headBobEnabled}
                onChange={(e) =>
                  updateSettings({ headBobEnabled: e.target.checked })
                }
                className="w-5 h-5 rounded"
              />
            </label>

            <label className="flex items-center justify-between">
              <span title="Audio" className="text-sm font-medium text-gallery-darkWood">
                Audio
              </span>
              <input
                type="checkbox"
                checked={settings.audioEnabled}
                onChange={(e) =>
                  updateSettings({ audioEnabled: e.target.checked })
                }
                className="w-5 h-5 rounded"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gallery-darkWood">
                Background Music
              </span>
              <input
                type="checkbox"
                checked={settings.musicEnabled}
                onChange={(e) =>
                  updateSettings({ musicEnabled: e.target.checked })
                }
                className="w-5 h-5 rounded"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm font-medium text-gallery-darkWood">
                Motion Reduced Mode
              </span>
              <input
                type="checkbox"
                checked={settings.motionReduced}
                onChange={(e) =>
                  updateSettings({ motionReduced: e.target.checked })
                }
                className="w-5 h-5 rounded"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gallery-accent/20">
          <p className="text-xs text-gallery-accent text-center">
            Press ESC to close • Press M to open settings
          </p>
        </div>
      </div>
    </div>
  );
}

