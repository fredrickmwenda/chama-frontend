import { X } from 'lucide-react';

const Modal = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold mb-6 text-slate-900">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default Modal;