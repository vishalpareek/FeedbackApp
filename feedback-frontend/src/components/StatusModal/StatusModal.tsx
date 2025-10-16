import React from "react";
import "./StatusModal.css";

interface StatusModalProps {
    show: boolean;
    message: string;
    type?: "success" | "error";
    onClose: () => void;
    children?: React.ReactNode;
}

const StatusModal: React.FC<StatusModalProps> = ({ show, message, type = "success", onClose, children }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className={`modal-content ${type}`}
                onClick={(e) => e.stopPropagation()}
            >
                <p className="modal-message">{message}</p>

                {children && <div className="modal-extra">{children}</div>}

                <button onClick={onClose}>OK</button>
            </div>
        </div>
    );
};

export default StatusModal;
