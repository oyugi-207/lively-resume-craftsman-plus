
import { useState, useEffect } from 'react';

export const useAPIKey = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage first
    const storedKey = localStorage.getItem('gemini_api_key') || localStorage.getItem('openai_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
    setIsLoading(false);
  }, []);

  const saveApiKey = (key: string, provider: 'gemini' | 'openai' = 'gemini') => {
    const storageKey = provider === 'gemini' ? 'gemini_api_key' : 'openai_api_key';
    localStorage.setItem(storageKey, key);
    setApiKey(key);
  };

  const removeApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    localStorage.removeItem('openai_api_key');
    setApiKey(null);
  };

  const getApiKey = (provider: 'gemini' | 'openai' = 'gemini'): string | null => {
    const storageKey = provider === 'gemini' ? 'gemini_api_key' : 'openai_api_key';
    return localStorage.getItem(storageKey);
  };

  return {
    apiKey,
    isLoading,
    saveApiKey,
    removeApiKey,
    getApiKey,
    hasApiKey: !!apiKey
  };
};
