import React from 'react';
import { useCampusContext } from '../../context/CampusContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { ToastNotification } from '../../types/campus';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useCampusContext();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2.5 max-w-md w-full px-4 sm:px-0 pointer-events-none"
    >
      {toasts.map((toast: ToastNotification) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start space-x-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
              isSuccess
                ? 'bg-white/95 border-emerald-200 text-slate-800'
                : isError
                ? 'bg-white/95 border-rose-200 text-slate-800'
                : isWarning
                ? 'bg-white/95 border-amber-200 text-slate-800'
                : 'bg-white/95 border-blue-200 text-slate-800'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" aria-hidden="true" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-600" aria-hidden="true" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-600" aria-hidden="true" />}
              {!isSuccess && !isError && !isWarning && (
                <Info className="w-5 h-5 text-blue-600" aria-hidden="true" />
              )}
            </div>

            <div className="flex-1 text-sm font-medium leading-snug">
              {toast.message}
            </div>

            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
