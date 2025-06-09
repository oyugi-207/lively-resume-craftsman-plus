
import { useState, useEffect } from 'react';

export const useAPIKey = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage first
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
    setIsLoading(false);
  }, []);

  const saveApiKey = (key: string) => {
    localStorage.setItem('gemini_api_key', key);
    setApiKey(key);
  };

  const removeApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey(null);
  };

  return {
    apiKey,
    isLoading,
    saveApiKey,
    removeApiKey,
    hasApiKey: !!apiKey
  };
};
