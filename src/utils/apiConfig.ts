/**
 * Centralized API and WebSocket configuration for ProFootballDraft.
 * Ensures URLs have valid schemes (https://) across local dev and Render production environments.
 */

export function getApiBaseUrl(): string {
  let url = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (url) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    return url.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') {
    return window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
  }
  return 'http://localhost:5000';
}

export function getSocketUrl(): string {
  let url = process.env.NEXT_PUBLIC_SOCKET_URL?.trim();
  if (url) {
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('ws://') && !url.startsWith('wss://')) {
      url = `https://${url}`;
    }
    return url.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') {
    return window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
  }
  return 'http://localhost:5000';
}

export const API_BASE = getApiBaseUrl();
export const SOCKET_SERVER = getSocketUrl();
