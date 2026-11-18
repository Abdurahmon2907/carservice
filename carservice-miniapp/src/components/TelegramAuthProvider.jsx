import { useEffect, useState } from 'react';
import useAppStore from '../store/useAppStore';
import { telegramAuth } from '../api';

const TelegramAuthProvider = ({ children }) => {
  const { setToken, setUser, token } = useAppStore();
  const [checking, setChecking]      = useState(true);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      tg.ready();
      tg.expand();
    }

    const authenticate = async () => {
      if (token) {
        setChecking(false);
        return;
      }

      // Wait for Telegram SDK to fully populate initData
      await new Promise((r) => setTimeout(r, 300));

      const initData = window.Telegram?.WebApp?.initData;

      console.log('initData:', initData ? 'EXISTS' : 'EMPTY');

      if (initData) {
        try {
          const result = await telegramAuth(initData);
          setToken(result.token);
          setUser(result.user);
          console.log('Telegram auth success:', result.user.firstName);
        } catch (err) {
          console.error('Telegram auth failed:', err.message);
        }
      }

      setChecking(false);
    };

    authenticate();
  }, []);

  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-5xl animate-bounce mb-4">🚗</div>
          <p className="text-gray-400 text-sm">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default TelegramAuthProvider;