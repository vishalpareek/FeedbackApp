import React from "react";
import StatusModal from "../StatusModal/StatusModal";
import "./FeedbackForm.css";
import {useFeedbackForm} from "../../hooks/useFeedbackForm";

const FeedbackForm: React.FC = () => {
    const {
        formData,
        errors,
        showModal,
        modalType,
        modalMessage,
        modalData,
        firstFieldRef,
        handleChange,
        handleSubmit,
        handleClose,
    } = useFeedbackForm();

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
                onClose={handleClose}
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
