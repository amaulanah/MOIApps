import React, { createContext, useContext, useState } from 'react';
import ConfirmationModal from '../components/ConfirmationModal';

// 1. Buat Context
const ConfirmationContext = createContext();

// 2. Buat Provider
export const ConfirmationProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    confirmText: 'Ya',
    confirmColor: 'primary'
  });

  // Fungsi inilah yang akan dipanggil oleh komponen lain
  const showConfirmation = (options) => {
    setModalState({
      isOpen: true,
      title: options.title,
      message: options.message,
      onConfirm: options.onConfirm,
      confirmText: options.confirmText || 'Ya',
      confirmColor: options.confirmColor || 'primary'
    });
  };

  const handleConfirm = () => {
    modalState.onConfirm();
    setModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  };

  const handleCancel = () => {
    setModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
  };

  return (
    <ConfirmationContext.Provider value={showConfirmation}>
      {children}
      <ConfirmationModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmText={modalState.confirmText}
        confirmColor={modalState.confirmColor}
      />
    </ConfirmationContext.Provider>
  );
};

// 3. Buat Custom Hook untuk mempermudah penggunaan
export const useConfirmation = () => {
  return useContext(ConfirmationContext);
};