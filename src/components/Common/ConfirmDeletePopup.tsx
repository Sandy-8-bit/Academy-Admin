import { AlertTriangle } from "lucide-react";
import ButtonSm from "@/components/common/Button";

interface ConfirmDeletePopupProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  confirmDisabled?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeletePopup: React.FC<ConfirmDeletePopupProps> = ({
  open,
  title = "Delete item?",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isConfirming = false,
  confirmDisabled = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-666 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-red-600" />
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>

        <p className="text-slate-600 mb-6">{description}</p>

        <div className="flex justify-end gap-3">
          <ButtonSm state="outline" text={cancelLabel} onClick={onCancel} />
          <ButtonSm
            state="danger"
            text={confirmLabel}
            onClick={onConfirm}
            disabled={confirmDisabled}
            isPending={isConfirming}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeletePopup;
