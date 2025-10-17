import React, { useState, useRef } from "react";
import StatusModal from "../StatusModal/StatusModal";
import "./FeedbackForm.css";

interface FormData {
    name: string;
    email: string;
    message: string;
}

interface ModalData {
    id: number
    name: string;
    message: string;
}

const FeedbackForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({ name: "", email: "", message: "" });
    const [modalData, setModalData] = useState<ModalData>({ id: 0, name: "",  message: "" });
    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<"success" | "error">("success");
    const [modalMessage, setModalMessage] = useState("");
    const firstFieldRef = useRef<HTMLInputElement>(null);

    const validate = () => {
        const newErrors: Partial<FormData> = {};
        if (!formData.name.trim()) newErrors.name = "Name is required.";
        if (!formData.email.trim()) newErrors.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid.";
        if (!formData.message.trim()) newErrors.message = "Message is required.";
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setModalType("error");
            setModalMessage("Please fix the highlighted errors and try again.");
            setShowModal(true);
            return;
        }

        try {
            const res = await fetch("http://localhost:8080/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Network response was not ok");
            const responseData: ModalData = await res.json();

            setModalType("success");
            setModalMessage("Form submitted successfully!");
            setShowModal(true);
            setFormData({ name: "", email: "", message: "" });
            setModalData(responseData)
            setErrors({});
            firstFieldRef.current?.focus(); // refocus on first field for accessibility
        } catch (error) {
            setModalType("error");
            setModalMessage("Something went wrong. Please try again later.");
            setShowModal(true);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <>
            <div className="form-container">
                <form
                    className="feedback-form"
                    onSubmit={handleSubmit}
                    noValidate
                    aria-labelledby="feedback-heading"
                >
                    <h2 id="feedback-heading">Feedback Form</h2>

                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            ref={firstFieldRef}
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            aria-invalid={!!errors.name}
                            aria-describedby={errors.name ? "name-error" : undefined}
                            required
                        />
                        {errors.name && (
                            <p id="name-error" className="error-message" role="alert">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? "email-error" : undefined}
                            required
                        />
                        {errors.email && (
                            <p id="email-error" className="error-message" role="alert">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            aria-invalid={!!errors.message}
                            aria-describedby={errors.message ? "message-error" : undefined}
                            required
                        />
                        {errors.message && (
                            <p id="message-error" className="error-message" role="alert">
                                {errors.message}
                            </p>
                        )}
                    </div>

                    <button type="submit" className="submit-button">Submit</button>
                </form>
            </div>

            <StatusModal
                show={showModal}
                message={modalMessage}
                type={modalType}
                onClose={() => setShowModal(false)}
            >
                {modalType === "success" && modalData && (
                    <div className="submitted-data" aria-live="polite">
                        <p data-testid="modal-id"><strong>Id:</strong> {modalData.id}</p>
                        <p data-testid="modal-name"><strong>Name:</strong> {modalData.name}</p>
                        <p data-testid="modal-message"><strong>Message:</strong> {modalData.message}</p>
                    </div>
                )}
            </StatusModal>
        </>
    );
};

export default FeedbackForm;
