// src/contexts/SnackbarContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar } from '@vkontakte/vkui';
import { Icon28CheckCircleOutline, Icon28CancelCircleOutline } from '@vkontakte/icons';

interface SnackbarContextType {
  showSnackbar: (message: string, type?: 'success' | 'error') => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [snackbar, setSnackbar] = useState<ReactNode>(null);

  const showSnackbar = (message: string, type: 'success' | 'error' = 'success') => {
    const isSuccess = type === 'success';

    setSnackbar(
      <Snackbar
        placement="top"           // ← Появляется сверху
        offsetY={20}              // отступ от верхнего края
        onClose={() => setSnackbar(null)}
        before={
          isSuccess ? (
            <Icon28CheckCircleOutline fill="var(--vkui--color_icon_positive)" />
          ) : (
            <Icon28CancelCircleOutline fill="var(--vkui--color_icon_negative)" />
          )
        }
        duration={2500}
        style={{ zIndex: 10000 }}
      >
        {message}
      </Snackbar>
    );
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {snackbar}          {/* ← Вот сюда рендерится Snackbar */}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within SnackbarProvider');
  }
  return context;
};