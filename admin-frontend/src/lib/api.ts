export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // Replace direct localhost URLs with relative ones to allow Next.js proxying
  // This solves CORS and mobile testing issues
  const proxyUrl = url.replace(/^http:\/\/localhost:5001/, '');
  
  const headers = new Headers(options.headers || {});
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(proxyUrl, config);
    
    // Check for unauthorized access
    if (response.status === 401 || response.status === 403) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // Or however the zustand store saves it, but just going to login clears it usually.
        window.location.href = '/login?unauthorized=true';
      }
      throw new Error('Unauthorized access. Please login again.');
    }
    
    return response;
  } catch (error) {
    throw error;
  }
}
