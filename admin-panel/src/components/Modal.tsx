import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  fullScreen?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  fullScreen = false,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200 flex flex-col ${fullScreen ? "w-full h-full md:h-[95vh] md:max-w-7xl rounded-none md:rounded-3xl" : "w-full max-w-md rounded-2xl"}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 shrink-0">
          <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors group"
          >
            <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-600 dark:group-hover:text-white">
              close
            </span>
          </button>
        </div>
        <div className={`flex-1 overflow-y-auto ${fullScreen ? "" : "p-6"}`}>
          {children}
        </div>
      </div>
    </div>
  );
};
