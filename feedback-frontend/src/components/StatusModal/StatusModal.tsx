import React, { useEffect, useRef } from "react";
import "./StatusModal.css";

interface StatusModalProps {
    show: boolean;
    message: string;
    type: "success" | "error";
    onClose: () => void;
    children?: React.ReactNode;
}

const StatusModal: React.FC<StatusModalProps> = ({ show, message, type, onClose, children }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const okButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (show) {
            okButtonRef.current?.focus();
        }
    }, [show]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    if (!show) return null;

    return (
        <div
            className="modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            ref={modalRef}
        >
            <div className="modal-content" tabIndex={-1}>
                <h2 id="modal-title">{type === "success" ? "Success" : "Error"}</h2>
                <p id="modal-desc">{message}</p>
                {children && <div>{children}</div>}
                <button
                    ref={okButtonRef}
                    className="ok-button"
                    onClick={onClose}
                    aria-label="Close dialog"
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default StatusModal;
