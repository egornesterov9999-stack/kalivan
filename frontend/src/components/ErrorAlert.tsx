import React from 'react';
import { FiAlertCircle, FiX } from 'react-icons/fi';

interface ErrorAlertProps {
  message: string;
  onClose?: () => void;
  type?: 'error' | 'warning' | 'info';
}

export default function ErrorAlert({ message, onClose, type = 'error' }: ErrorAlertProps) {
  const colors = {
    error: 'bg-red-900/20 border-red-500/50 text-red-400',
    warning: 'bg-yellow-900/20 border-yellow-500/50 text-yellow-400',
    info: 'bg-blue-900/20 border-blue-500/50 text-blue-400',
  };

  return (
    <div className={`p-4 border rounded-lg flex items-center justify-between ${colors[type]}`}>
      <div className="flex items-center gap-3">
        <FiAlertCircle className="flex-shrink-0" />
        <p className="text-sm">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-lg opacity-70 hover:opacity-100">
          <FiX />
        </button>
      )}
    </div>
  );
}
