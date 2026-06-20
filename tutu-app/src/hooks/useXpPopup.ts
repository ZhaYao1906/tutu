import { useState, useCallback } from 'react';

interface XpPopup {
  id: string;
  x: number;
  y: number;
  amount: number;
}

export const useXpPopup = () => {
  const [popups, setPopups] = useState<XpPopup[]>([]);

  const showXpPopup = useCallback((x: number, y: number, amount: number) => {
    const id = Date.now().toString();
    setPopups(prev => [...prev, { id, x, y, amount }]);
    
    setTimeout(() => {
      setPopups(prev => prev.filter(p => p.id !== id));
    }, 1500);
  }, []);

  return { popups, showXpPopup };
};