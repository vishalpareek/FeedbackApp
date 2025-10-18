describe("StatusModal E2E Tests", () => {
    const baseUrl = "http://localhost:3000";

    beforeEach(() => {
        cy.visit(baseUrl);
    });

    it("shows success modal after submitting feedback", () => {
        // Fill feedback form
        cy.get('input[name="name"]').type("Vishal");
        cy.get('input[name="email"]').type("vishal@example.com");
        cy.get('textarea[name="message"]').type("Great app!");

        // Intercept POST
        cy.intercept("POST", "/api/feedbacks").as("submitFeedback");

        // Submit
        cy.get('button[type="submit"]').click();

        // Check modal appears
        cy.get(".modal-overlay").should("be.visible");
        cy.get("#modal-title").should("contain.text", "Success");
        cy.get("#modal-desc").should("contain.text", "Feedback submitted successfully");

        // Close modal
        cy.get(".ok-button").click();
        cy.get(".modal-overlay").should("not.exist");
    });

    it("shows error modal when backend fails", () => {
        cy.get('input[name="name"]').type("Vishal");
        cy.get('input[name="email"]').type("vishal@example.com");
        cy.get('textarea[name="message"]').type("Great app!");

        // Simulate server error
        cy.intercept("POST", "/api/feedbacks", {
            statusCode: 500,
            body: { error: "Server error" },
        }).as("submitFeedbackError");

        cy.get('button[type="submit"]').click();
        cy.wait("@submitFeedbackError");

        cy.get(".modal-overlay").should("be.visible");
        cy.get("#modal-title").should("contain.text", "Error");
        cy.get("#modal-desc").should("contain.text", "Something went wrong. Please try again later.");

        // Close modal
        cy.get(".ok-button").click();
        cy.get(".modal-overlay").should("not.exist");
    });

    it("closes modal on Escape key press", () => {
        cy.get('input[name="name"]').type("Vishal");
        cy.get('input[name="email"]').type("vishal@example.com");
        cy.get('textarea[name="message"]').type("Great app!");

        cy.intercept("POST", "/api/feedbacks").as("submitFeedback");
        cy.get('button[type="submit"]').click();
        cy.wait("@submitFeedback");

        cy.get(".modal-overlay").should("be.visible");

        // Press Escape
        cy.get("body").type("{esc}");
        cy.get(".modal-overlay").should("not.exist");
    });

    it("focus is on OK button when modal opens", () => {
        cy.get('input[name="name"]').type("Vishal");
        cy.get('input[name="email"]').type("vishal@example.com");
        cy.get('textarea[name="message"]').type("Great app!");

        cy.intercept("POST", "/api/feedbacks").as("submitFeedback");
        cy.get('button[type="submit"]').click();
        cy.wait("@submitFeedback");

        // Check focus
        cy.focused().should("have.class", "ok-button");
    });
});
