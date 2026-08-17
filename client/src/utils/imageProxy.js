export function getProxiedImageUrl(url, fallbackUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600') {
  if (!url) return fallbackUrl;
  if (url.includes('cdninstagram.com') || url.includes('fbcdn.net') || url.includes('instagram.f')) {
    return `http://localhost:5000/api/proxy-image?url=${encodeURIComponent(url)}`;
  }
  return url;
}
