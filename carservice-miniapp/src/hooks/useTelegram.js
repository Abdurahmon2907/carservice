const useTelegram = () => {
  const tg = window.Telegram?.WebApp;

  // Tell Telegram the app is ready — removes the loading screen
  const ready = () => tg?.ready();

  // Expand to full screen
  const expand = () => tg?.expand();

  // Close the Mini App
  const close = () => tg?.close();

  // The raw initData string — we send this to backend for verification
  const initData = tg?.initData || '';

  // Parsed user (available without verification — for display only)
  const user = tg?.initDataUnsafe?.user || null;

  // Telegram theme colors
  const colorScheme = tg?.colorScheme || 'light';

  return { tg, ready, expand, close, initData, user, colorScheme };
};

export default useTelegram;