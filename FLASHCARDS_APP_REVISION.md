# Flashcards MERN App Revision Notes

This document is a revision guide for the Flashcards MERN app using the current project structure.

## 1. What this app is doing

The app is a full-stack flashcard learning app with:
- React frontend for the UI
- Express + TypeScript backend for APIs
- MongoDB + Mongoose for data storage
- JWT authentication for login/signup
- CRUD operations for decks and flashcards

---

## 2. Project architecture

### Frontend
- React + Vite
- React Router for page navigation
- Tailwind CSS for styling
- Components for auth, dashboard, deck detail, navbar, forms

### Backend
- Express server
- TypeScript controllers, routes, middleware, models
- MongoDB database with Mongoose schemas
- Protected routes using JWT

### Data flow
Browser -> React component -> fetch() -> Express route -> Controller -> Mongoose model -> MongoDB -> response -> React state update

---

## 3. Backend concepts with file references

### 3.1 Express app setup
File: `backend/src/index.ts`
- `line 12`: `dotenv.config()` loads environment variables
- `line 14`: `const app = express()` creates the Express app
- `line 15-16`: `app.use(cors())` and `app.use(express.json())` enable CORS and JSON parsing
- `line 18-21`: routes are mounted for health, auth, decks, flashcards
- `line 23`: error handler is attached
- `line 55`: `app.listen(PORT, ...)` starts the server locally

Concepts:
- Express app creation
- Middleware
- Routing
- Starting the server

### 3.2 Authentication routes
File: `backend/src/routes/authRouter.ts`
- `line 7`: `POST /register`
- `line 8`: `POST /login`
- `line 9`: `GET /me` protected by `protect`

Concepts:
- Route grouping
- Protected routes

### 3.3 Auth controller
File: `backend/src/controllers/authController.ts`
- `line 7`: `generateToken()` creates JWT with `jwt.sign()`
- `line 18`: `register()` handles signup
- `line 29`: `User.findOne({ email })` checks if email exists
- `line 37`: `User.create({...})` creates a new user
- `line 66`: `login()` handles login
- `line 78`: `User.findOne({ email }).select('+password')` fetches password for comparison
- `line 87`: `bcrypt.compare()` verifies password
- `line 96`: token is generated and returned
- `line 119`: `getMe()` returns the current user from the protected request

Concepts:
- Request/response handling
- Validation
- JWT signing
- Password verification

### 3.4 JWT protection middleware
File: `backend/src/middleware/auth.ts`
- `line 15-18`: reads the Bearer token from the Authorization header
- `line 29-31`: `jwt.verify()` checks the token
- `line 34`: `User.findById(decoded.id)` loads the logged-in user
- `line 43-44`: attaches the user to `req.user` and calls `next()`

Concepts:
- Middleware
- Authentication guard
- Token verification

### 3.5 Mongoose User model
File: `backend/src/models/User.ts`
- `line 5`: schema definition
- `line 7-24`: fields: `name`, `email`, `password`
- `line 33-39`: `pre('save')` hash password before saving
- `line 43`: `comparePassword()` helper
- `line 47`: model created with `mongoose.model()`

Concepts:
- Schema definition
- Validation rules
- Mongoose hooks
- Password hashing with bcrypt

### 3.6 Mongoose Deck model
File: `backend/src/models/Deck.ts`
- `line 4`: schema definition
- `line 6-12`: `name` and `description`
- `line 17-22`: `flashcards` array stores references to flashcards
- `line 23-28`: `userId` and `type` separate user decks from default decks

Concepts:
- Relationships in MongoDB
- References using `ObjectId`

### 3.7 Mongoose Flashcard model
File: `backend/src/models/Flashcard.ts`
- `line 4`: schema definition
- `line 6-11`: question and answer
- `line 16-20`: details, images, difficulty, tags
- `line 33-38`: references to user and deck

Concepts:
- Schema design
- Optional fields
- Relationship between flashcards and decks

### 3.8 Deck controller
File: `backend/src/controllers/deckController.ts`
- `line 7`: `getDecks()` returns default + user decks
- `line 33`: `getDeck()` fetches a single deck and its flashcards
- `line 77`: `createDeck()` creates a new deck
- `line 113`: `updateDeck()` updates an owned deck
- `line 147`: `deleteDeck()` deletes a user deck and its flashcards

Concepts:
- CRUD with MongoDB
- Authorization checks
- Nested data access

### 3.9 Flashcard controller
File: `backend/src/controllers/flashcardController.ts`
- `line 7`: `getFlashcards()` fetches flashcards by deck or user
- `line 100`: `createFlashcard()` creates a card and appends it to the deck
- `line 157`: `updateFlashcard()` updates an owned card
- `line 218`: `deleteFlashcard()` removes card and updates deck

Concepts:
- Creating related documents
- Updating references
- Protecting ownership

---

## 4. Frontend concepts with file references

### 4.1 App entry and routing
File: `frontend/src/App.tsx`
- `line 15`: checks if a token exists in `localStorage`
- `line 20`: health-check request to the backend
- `line 48`: `handleLogin()` updates auth state
- `line 58`: `handleLogout()` clears the token
- `line 66-84`: React Router routes for landing, dashboard, deck detail

Concepts:
- React state
- `useEffect()` for side effects
- React Router
- Protected routes

### 4.2 Login form
File: `frontend/src/components/authentication/LoginForm.tsx`
- `line 14`: `handleSubmit()` runs on form submission
- `line 25`: `fetch('/api/auth/login', ...)` sends request to backend
- `line 47`: token is stored in `localStorage`
- `line 58`: form UI is rendered

Concepts:
- Controlled inputs
- Form submission
- API calls from frontend
- Saving auth token in browser

### 4.3 Register form
File: `frontend/src/components/authentication/RegisterForm.tsx`
- `line 15`: submits registration request
- `line 24`: sends data to `/api/auth/register`
- `line 43`: stores token after success

Concepts:
- Form handling
- Client-side validation
- Auth flow

### 4.4 Dashboard page
File: `frontend/src/pages/Dashboard.tsx`
- `line 25`: `useEffect()` loads decks from `/api/decks`
- `line 30`: reads token from `localStorage`
- `line 36`: sends `Authorization` header
- `line 45`: stores fetched decks in state
- `line 56`: opens create deck modal
- `line 79`: delete request to `/api/decks/:id`

Concepts:
- `useEffect()` for loading data
- `useState()` for UI state
- Conditional rendering
- Modals

### 4.5 Deck detail page
File: `frontend/src/pages/DeckDetail.tsx`
- `line 25`: loads the selected deck
- `line 75`: selecting a card updates UI state
- `line 80`: flipping card toggles answer visibility
- `line 84`: delete card request to `/api/flashcards/:id`
- `line 152`: submit card form for create/update
- `line 181`: builds payload for API
- `line 295-320`: shows card list
- `line 363-390`: flashcard viewer UI
- `line 421-525`: add/edit card modal form

Concepts:
- Complex component state
- CRUD UI for flashcards
- Event handling
- Conditional rendering

### 4.6 Create deck form
File: `frontend/src/components/dashboard/CreateDeckForm.tsx`
- `line 25`: handles deck create/edit submission
- `line 44`: sends `PATCH` if editing
- `line 57`: sends `POST` if creating
- `line 79`: notifies parent component after success

Concepts:
- Reusable form component
- Edit vs create logic

### 4.7 Navbar
File: `frontend/src/components/layout/NavBar.tsx`
- `line 41`: if not authenticated, shows Login button
- `line 51`: if authenticated, shows Logout button

Concepts:
- Navigation UI
- Conditional rendering based on auth state

---

## 5. Important React concepts used in this app

- `useState()` for local component state
- `useEffect()` for API calls and lifecycle behavior
- Controlled inputs for forms
- `fetch()` for backend communication
- `localStorage` for storing the JWT token
- React Router for page navigation
- Conditional rendering for auth state and modals

---

## 6. Important Node/Express/Mongo concepts used in this app

- Express middleware and routing
- Controllers for business logic
- Models for database schema
- Mongoose queries like `find`, `findById`, `create`, `findByIdAndUpdate`, `findByIdAndDelete`
- JWT verification and protection middleware
- Password hashing with bcrypt
- Authorization checks for user-owned data

---

## 7. One complete flow: user logs in and creates a deck

This is the most important end-to-end flow to remember.

### Step 1: User opens the app
- The React app loads in `frontend/src/App.tsx`
- It checks `localStorage` for an existing JWT token
- If no token is present, the app shows the landing page and auth modal

### Step 2: User submits login form
- In `frontend/src/components/authentication/LoginForm.tsx`, the user enters email and password
- On submit, the component runs `handleSubmit()`
- It sends a `POST` request to `/api/auth/login`

### Step 3: Backend receives login request
- Express route in `backend/src/routes/authRouter.ts` receives the request
- It forwards the request to `login()` in `backend/src/controllers/authController.ts`

### Step 4: Backend checks credentials
- The controller looks up the user by email using `User.findOne({ email })`
- It compares the entered password with the stored hash using `bcrypt.compare()`
- If correct, it creates a JWT token using `jwt.sign()`

### Step 5: Backend returns token to frontend
- The backend sends back a JSON response with:
  - user info
  - JWT token
- The frontend stores the token in `localStorage`
- The app changes to the authenticated state

### Step 6: User clicks “New Deck”
- The dashboard page loads decks from `/api/decks`
- The user clicks the create deck button
- The `CreateDeckForm` opens

### Step 7: Frontend sends create deck request
- `CreateDeckForm` sends a `POST` request to `/api/decks`
- It includes:
  - deck name
  - description
  - JWT token in `Authorization: Bearer ...`

### Step 8: Backend protects the route
- The request passes through `protect` middleware in `backend/src/middleware/auth.ts`
- The middleware extracts the JWT from the header
- It verifies the token and loads the user
- If valid, it allows the request to continue

### Step 9: Controller creates the deck
- `createDeck()` in `backend/src/controllers/deckController.ts` receives the request
- It reads `name` and `description` from `req.body`
- It creates a new document using `Deck.create({...})`

### Step 10: MongoDB saves the document
- Mongoose saves the deck to the MongoDB `decks` collection
- The record contains:
  - `name`
  - `description`
  - `userId`
  - `type: 'user'`
  - empty flashcards array

### Step 11: Backend returns success response
- The controller sends back JSON with the created deck
- The frontend receives the response
- The UI closes the modal and updates the dashboard

### Step 12: User sees the new deck in the UI
- The React component updates local state
- The new deck appears on the dashboard

That is the complete cycle of a real user action in this app:
Frontend form -> API request -> auth middleware -> controller -> Mongoose -> MongoDB -> response -> React UI update

---

## 8. Quick memory trick

Remember the app as this chain:
- React handles UI and forms
- Express handles requests
- Mongoose talks to MongoDB
- JWT protects routes
- Controllers contain the main logic
- Models define the data structure

If you remember this pattern, you can rebuild the app mentally from any feature.
