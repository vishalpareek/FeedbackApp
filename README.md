# Feedback Form — Full Stack App

A **full-stack feedback submission platform** built with:

 **Frontend**: React + TypeScript (Create React App)

 **Backend**: Spring Boot (Java)

 **Testing**: Jest + React Testing Library (frontend) and JUnit (backend)

 **E2E Testing** : Cypress

 **Linting**: ESLint

The app lets users submit feedback through an accessible form. The backend handles validation and storage, while the frontend displays success/error modals with clear messaging.

---

## Prerequisites

Make sure you have the following installed:
- **Node.js** ≥ 18
- **npm** ≥ 9
- **Java** ≥ 17
- **Maven** (optional if using wrapper)

---

## Start Development Servers

### ** Backend (Spring Boot)**

From the project root:

```bash
cd feedback-backend
mvn -N wrapper:wrapper
```
Or run from IntelliJ by executing the FeedbackApplication main class.

####  Backend runs at → http://localhost:8080


### ** Frontend (React + TypeScript)**

In another terminal:

```bash
cd feedback-frontend
npm install
npm start
```

#### Frontend runs at → http://localhost:3000


The frontend connects to the backend API at:
```bash
http://localhost:8080/api/feedbacks
```

## **Run Tests**
### Frontend tests
```bash
cd feedback-frontend
npm test
```
**Cypress E2E tests**
```bash
cd feedback-frontend
cypress run open
```

To run lint checks:
```bash
npm run lint
```

### Backend tests
```bash
cd feedback-backend
mvn test
```

## Summary

| Part | Tech | Port | Command |
|------|------|------|----------|
| **Frontend** | React + TypeScript | 3000 | `npm start` |
| **Backend** | Spring Boot | 8080 | `mvn spring-boot:run` or `./mvnw spring-boot:run` |
| **Tests** | Jest / JUnit | — | `npm test` / `mvn test` |


