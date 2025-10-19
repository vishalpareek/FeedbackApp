describe("FeedbackForm - Get All Feedbacks", () => {
    beforeEach(() => {
        cy.intercept("GET", "http://localhost:8080/api/feedbacks", {
            statusCode: 200,
            body: [
                {
                    id: 1,
                    name: "John Doe",
                    message: "Great work!",
                    createdAt: "2025-10-18T21:47:30.716Z",
                },
                {
                    id: 2,
                    name: "Vishal Pareek",
                    message: "Nice UI!",
                    createdAt: "2025-10-18T21:50:00.123Z",
                },
            ],
        }).as("getFeedbacks");

        cy.visit("http://localhost:3000");
    });

    it("fetches and displays all feedbacks in a table", () => {
        cy.contains(/get all feedbacks/i).click();

        cy.wait("@getFeedbacks");

        cy.contains(/all feedbacks/i).should("be.visible");

        // Verify table contents
        cy.contains("td", "John Doe").should("exist");
        cy.contains("td", "Vishal Pareek").should("exist");
        cy.contains("td", "Great work!").should("exist");
        cy.contains("td", "Nice UI!").should("exist");

        // Verify ISO formatted createdAt
        cy.contains("td", "2025-10-18T21:47:30.716Z").should("exist");
    });

    it("shows 'No feedback found' message when list is empty", () => {
        cy.intercept("GET", "http://localhost:8080/api/feedbacks", {
            statusCode: 200,
            body: [],
        }).as("getEmpty");

        cy.visit("http://localhost:3000");
        cy.contains(/get all feedbacks/i).click();

        cy.wait("@getEmpty");
        cy.contains(/no feedback found/i).should("be.visible");
    });

    it("shows error modal if API fails", () => {
        cy.intercept("GET", "http://localhost:8080/api/feedbacks", {
            statusCode: 500,
            body: { error: "Failed to fetch feedbacks" },
        }).as("getError");

        cy.visit("http://localhost:3000");
        cy.contains(/get all feedbacks/i).click();

        cy.wait("@getError");
        cy.contains(/Failed to fetch feedbacks/i).should("be.visible");
    });
});
