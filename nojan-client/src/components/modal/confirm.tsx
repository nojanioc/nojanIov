import { Button, Modal } from "flowbite-react";
import { useCallback } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "بله",
  cancelText = "خیر",
}: ConfirmModalProps) => {
  const handleConfirm = useCallback(() => {
    onConfirm();
    onClose();
  }, [onConfirm, onClose]);

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      {/* <Modal.Header>{title}</Modal.Header> */}
      <Modal.Body>
        <div className="space-y-6">
          <p className="text-md font-medium leading-relaxed text-gray-500">
            {message}
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end gap-4">
          <Button color="gray" onClick={onClose}>
            {cancelText}
          </Button>
          <Button color="failure" onClick={handleConfirm}>
            {confirmText}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
