# Client-Server Architecture Analysis Assignment

## Assignment Objective

This assignment is designed to help you understand a client-server architecture by analyzing a project that uses NodeJS for the backend and React with TypeScript for the frontend. You will explore design patterns used in the project, the interaction between the client and server through RESTful APIs, the management of users, and the multi-screen UI on the frontend.

## Part 1: Understanding the Project Structure

### 1. Explore the Repository

You already have access to the repository containing the NodeJS backend and React-Typescript frontend. Get familiar with the folder structure, key files, and the build system.

### 2. Explore Design Patterns

Identify and document at least three design patterns used in the client-server architecture. Examples of common patterns might include the following. Note that not all of these are necessarily in here, and there may be some that are in the code but not mentioned here:

- **Singleton** for managing single instances of services
- **Observer or Publisher-Subscriber** for handling real-time communication between the client and server
- **Model-View-Controller (MVC)** for separating concerns in the backend

Provide examples of where and how these patterns are implemented in the code.

## Part 2: Analyzing the Backend (NodeJS)

### 1. Examine the RESTful API

Explore how the backend is structured to serve API requests. Identify key API endpoints that the client interacts with and document:

- How data is created, read, updated, and deleted (CRUD operations)
- How the server validates and processes client requests before responding

### 2. Real-Time Communication (if applicable)

If the project includes real-time communication (e.g., using WebSockets), investigate:

- How the client and server establish real-time connections
- How messages are exchanged between the client and server, and what kind of data is sent

### 3. User Management

Analyze how the backend manages user authentication and roles. Specifically:

- How is user authentication handled (e.g., via JWT, OAuth)?
- How does the backend differentiate between user types (e.g., admin, regular user) and provide different levels of access?
- What mechanisms are used to secure sensitive user data?

### 4. Middleware and Error Handling

Investigate how the backend uses middleware to handle tasks like:

- Authentication and session management
- Data validation and error handling

Document examples from the code that show how middleware simplifies request handling.

## Part 3: Analyzing the Frontend (React TypeScript)

### 1. Multi-Screen Navigation

Examine how the React app handles navigation between different screens and UI components:

- How is routing set up (e.g., using React Router)?
- How does the app handle protected routes (i.e., only allowing certain users to access specific pages)?

### 2. State Management

Investigate how the app manages state across different screens and components:

- How is user state (e.g., authentication status, role) maintained and shared between components?
- Are tools like Redux or Context API used to manage global state?

### 3. API Interaction

Analyze how the frontend communicates with the backend:

- How are API calls made (e.g., using fetch, axios) and how is the data from the backend processed and displayed in the UI?
- How is the client updated so that they can see other users updating the cells?

### 4. User Interface

Investigate how the app displays different UI components based on user roles:

- How does the frontend handle the display of real-time data if applicable (e.g., chat messages, notifications)?
- How is the cell ownership displayed to the users?

## Part 4: Frontend and Backend Interaction

### 1. API Request-Response Flow

Trace the flow of data from the moment the frontend sends a request to the server to when it receives a response:

- Identify key points in the code where data flows from the server to the client and vice versa
- How does the frontend handle errors returned by the server?

### 2. Real-Time Interaction (if applicable)

If the project includes real-time communication, investigate how the client and server communicate in real-time:

- How are updates pushed from the server to the client, and how does the UI handle them?

## Recommendation on How to Proceed

For this assignment, you will split into two subteams:

- **Frontend Team**: Focus on analyzing the React TypeScript frontend. Dive into the routing system, state management, API interaction, and design patterns used in the client codebase.
- **Backend Team**: Focus on analyzing the NodeJS backend. Explore the REST API, real-time communication (if applicable), user authentication, and middleware.

Each subteam should analyze their part of the system and then present their findings to the other team. This should include:

- A description of the design patterns used in each part of the codebase
- An explanation of how their part interacts with the other team's work (e.g., how the frontend sends requests and processes responses from the backend)
- Key challenges and design choices that improve the performance and scalability of the application

After the presentations, work together as a larger group to discuss how the frontend and backend can be further optimized for performance, security, and user experience.

## Submission Requirements

In your team repo you will produce a file called `CALC-SHEET.md` in a directory called `submissions`. (make the directory and push the file)

This file should contain:

- A written report detailing your findings on design patterns, API interactions, state management, and user handling
- Code snippets or screenshots that illustrate key parts of the client-server interaction

**NO PRESENTATION IS REQUIRED FOR THIS ASSIGNMENT.**

By the end of this assignment, you should have a strong understanding of:

- Client-server architecture and how to analyze a multi-screen frontend built with React TypeScript
- RESTful APIs and real-time communication in a NodeJS backend
- Design patterns used to improve code readability, maintainability, and scalability
- Team collaboration to effectively study and explain both frontend and backend components

---

# Running Instructions

## Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)

## Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Installation

1. Navigate to the project directory (lesson-04)
2. Install dependencies:
   ```bash
   npm install
   ```

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
