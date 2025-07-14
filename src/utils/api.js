// src/utils/api.js
const handleApiResponse = (response, setSessionExpiredFn) => {
    // Only handle 401 status as expired session
    if (response.status === 401) {
      console.log("api.js| handleApiResponse - 401 Unauthorized detected - session expired");
      
      // Only call setSessionExpired if the function was provided
      if (typeof setSessionExpiredFn === 'function') {
        setSessionExpiredFn(true);
      }
      
      // Dispatch a global event for other components to react to
      window.dispatchEvent(new CustomEvent('session-expired'));
      return { ok: false, status: 401 };
    }
    
    return response;
  };
  
  export const fetchWithAuth = async (url, options = {}, setSessionExpiredFn = null) => {
    try {
      const fetchOptions = {
        ...options,
        credentials: 'include',
      };
      
      const response = await fetch(url, fetchOptions);
      
      // Return the original response if it's OK, otherwise handle it
      if (response.ok) {
        return response;
      }
      
      return handleApiResponse(response, setSessionExpiredFn);
    } catch (error) {
      console.error('api.js| fetchWithAuth - API request error:', error);
      throw error;
    }
  };