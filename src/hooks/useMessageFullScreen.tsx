import { useState, useCallback, useEffect } from 'react';

interface IUseMessageFullScreenReturn {
  messageFullScreenVisibility: boolean;
  hideVisibility: () => void;
  showVisibility: () => void;
  terminateTimeViewMessage: boolean;
}

export const useMessageFullScreen = (): IUseMessageFullScreenReturn => {
  const [
    messageFullScreenVisibility,
    setMessageFullScreenVisibility,
  ] = useState(false);

  const [terminateTimeViewMessage, setTerminateTimeViewMessage] = useState(
    false,
  );

  const hideVisibility = useCallback(() => {
    setMessageFullScreenVisibility(false);
  }, []);

  const showVisibility = useCallback(() => {
    setMessageFullScreenVisibility(true);
  }, []);

  useEffect(() => {
    setTerminateTimeViewMessage(false);
  }, []);

  useEffect(() => {
    let time: NodeJS.Timeout;
    if (messageFullScreenVisibility) {
      time = setTimeout(() => {
        setTerminateTimeViewMessage(true);
        hideVisibility();
      }, 5000);
    }

    return () => {
      if (time) clearTimeout(time);
    };
  }, [messageFullScreenVisibility, hideVisibility]);

  return {
    messageFullScreenVisibility,
    hideVisibility,
    showVisibility,
    terminateTimeViewMessage,
  };
};
