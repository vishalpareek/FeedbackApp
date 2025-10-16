import React, { useState } from "react";
import "./FeedbackForm.css";
import StatusModal from "./StatusModal/StatusModal";

interface FormData {
    name: string;
    email: string;
    message: string;
}

interface Errors {
    name?: string;
    email?: string;
    message?: string;
    submit?: string;
}

const FeedbackForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        message: "",
    });
    const [errors, setErrors] = useState<Errors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalMessage, setModalMessage] = useState<string>("");
    const [modalType, setModalType] = useState<"success" | "error">("success");
    const [showModal, setShowModal] = useState(false);
    const [submittedData, setSubmittedData] = useState<FormData | null>(null);

    const validate = (): boolean => {
        const newErrors: Errors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email";
        }
        if (!formData.message.trim()) newErrors.message = "Message is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        setErrors({});

        try {
            const res = fetch("http://localhost:8080/api/feedback/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            }).then((res) => res.json())
                .then((data) => {
                    setModalMessage("Feedback received successfully");
                    setModalType("success");
                    setSubmittedData(formData);
                    setShowModal(true);
                    setFormData({ name: "", email: "", message: "" });
                })
                .catch((err) => {
                    setModalMessage(err.toString());
                    setModalType("error");
                    setShowModal(true);
                });

        } catch (err: any) {
            setModalMessage(err.message || "Something went wrong!");
            setModalType("error");
            setErrors({ submit: err.message || "Something went wrong" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
        <div className="form-container">
            <form className="contact-form" onSubmit={handleSubmit} aria-labelledby="feedback-heading">
                <h2 id="feedback-heading">Feedback Form</h2>

                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && <span className="error" id="name-error" role="alert">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        name="email"
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        required
                    />
                    {errors.email && <span className="error" id="email-error" role="alert">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="message">Feedback message</label>
                    <textarea
                        name="message"
                        id="message"
                        value={formData.message}
                        onChange={handleChange}
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? "message-error" : undefined}
                        required
                    />
                    {errors.message && <span className="error">{errors.message}</span>}
                </div>

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </button>
            </form>

        </div>

    <StatusModal
        show={showModal}
        message={modalMessage}
        type={modalType}
        onClose={() => setShowModal(false)}
    >
        {modalType === "success" && submittedData && (
            <div>
                <p><strong>Name:</strong> {submittedData.name}</p>
                <p><strong>Email:</strong> {submittedData.email}</p>
                <p><strong>Message:</strong> {submittedData.message}</p>
            </div>
        )}
    </StatusModal>
    </>
    );
};

export default FeedbackForm;
