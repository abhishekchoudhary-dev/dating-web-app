# match-me web

A full-stack recommendation application, to connect users based on their profile information.  

## Tech Stack

### Backend Framework

- Java 26 - Primary backend development language
- Spring Boot 4 — application framework
- Spring Security — authentication and authorization
- Spring WebSocket + STOMP — real time messaging and online status
- JWT (jjwt) — stateless authentication via HttpOnly cookies
- Spring Data JPA + Hibernate — ORM and database access
- Lombok — boilerplate reduction
- Jackson — JSON serialization/deserialization
- BCrypt — password hashing
- Maven — build tool

### Database

- PostgreSQL — relational database 
- psql — PostgreSQL command line client for direct DB access

### Frontend

- Next.js 16 — React framework with App Router
- TypeScript — type safe JavaScript
- React 19 — UI library
- Tailwind CSS — utility first styling
- shadcn/ui — component library
- @stomp/stompjs — WebSocket STOMP client
- sockjs-client — WebSocket fallback transport
- lucide-react — icon library

### Build & Development tools

- Maven — Java dependency management and build tool (pom.xml)
- npm — Node.js package manager for frontend (package.json)
- Turbopack — Next.js 16 bundler (replaces Webpack, faster builds)
- Spring Boot DevTools — automatic backend restart on file changes
- Next.js Fast Refresh — instant frontend updates without full reload
- TypeScript Compiler — type checking during development
- IntelliJ IDEA / VS Code — frontend and backend development 

### Version Control

- Git — version control
- Gitea — remote repository hosting

### Architecture pattern used

- Server Components — for data fetching pages (matches, profile, discover)
- Client Components — for real time interactive features
- WebSocket Context — single shared WebSocket connection across all pages
- Hybrid REST + WebSocket — REST for data fetching, WebSocket for real time features
- HttpOnly Cookie Auth — secure JWT storage

## Installation and Setup

### Prerequisites

#### <u>Node.js & npm (v18+ or higher - required for Next.js 16 which needs v18+)</u>

Installation steps - 

##### For Windows

- Download installer from https://nodejs.org
- Download and run the installer(.msi file) and follow the steps

##### For Linux
```bash
# For ubuntu/debian/fedora (nodesource is same for these distros)

# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -

# Install Node.js and npm
sudo apt-get install -y nodejs
```
##### For macOS
```bash
# Using Homebrew
brew install node
```

#### Verify your Node.js & npm installation (For all operating systems)

- To verify both are installed after setup
```bash
node --version   # should show v18.x.x or higher
npm --version    # should show version
```

#### <u>Java 26 Installation</u>

##### For Windows

- Download java 26(.exe file) from https://www.oracle.com/java/technologies/downloads/
- Run the installer and follow the setup wizard
- Add java to PATH variable

##### For Linux

```bash
# For ubuntu/debian/fedora (nodesource is same for these distros)

# Download Java 26 from Oracle
wget https://download.oracle.com/java/26/latest/jdk-26_linux-x64_bin.deb

# Install
sudo dpkg -i jdk-26_linux-x64_bin.deb
```
##### For macOS

```bash
# Using Homebrew
brew install --cask oracle-jdk
```

#### Verify your Java 26 installation (For all operating systems)

- To verify java is installed after setup
```bash
java -version   # should show v26.xx.xx
```

#### <u>Maven Installation</u>

##### For Windows

- Download Maven(.zip file) from https://maven.apache.org/download.cgi
- Extract to C:\Program Files\Maven 
- Add maven to PATH variable

##### For Linux

```bash
# For ubuntu/debian/fedora (nodesource is same for these distros)

# Install Maven
sudo apt-get install -y maven
```
##### For macOS

```bash
# Using Homebrew
brew install maven
```

#### Verify your Maven installation (For all operating systems)

- To verify java is installed after setup
```bash
mvn -version   # should show v3.9.x.
```

#### <u>PostgreSQL Installation</u>

##### For Windows

- Down the installer from EDB at https://www.postgresql.org/download/windows/
- Run the installer — remember the password you set for postgres user
- Keep default port 5432
- After installation open pgAdmin(GUI) or run `psql -U postgres` from command prompt
- Create database and user:
```bash
CREATE DATABASE web;
CREATE USER admin WITH PASSWORD 'admin';
GRANT ALL PRIVILEGES ON DATABASE web TO admin;
```

##### For Linux

```bash
# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Start PostgreSQL on WSL or native linux (if auto start is not enabled)
sudo service postgresql start

# Run postgres and create database and user
sudo -u postgres psql
CREATE DATABASE web;
CREATE USER admin WITH PASSWORD 'admin';
GRANT ALL PRIVILEGES ON DATABASE web TO admin;
\q
```

##### For macOS

```bash
# Install postgreSQL
brew install postgresql@15
brew services start postgresql@15

# Run postgres
psql postgres #if installed through homebrew 
OR
sudo -u postgres psql #if downloaded

# Create database and user
CREATE DATABASE web;
CREATE USER admin WITH PASSWORD 'admin';
GRANT ALL PRIVILEGES ON DATABASE web TO admin;
\q
```

### Running the program

1. Clone the repository:
```bash
git clone https://gitea.kood.tech/kaarelsirel/web
cd web
```
2. Database Setup:
```bash
# Make sure database is created with user and is running
# Steps to create database have been explained above in installation guide.
```
3. Backend Setup:
```bash
cd backend
mvn install -DskipTests #to install dependencies in pom.xml file
```

4. Frontend Setup:
```bash
cd frontend
npm install # to install dependencies
```

5. Run the program:

```bash
# Backend
mvn spring-boot:run # backend will start on http://localhost:8080
```
- Hibernate will automatically create all tables on first run if database is created.
- The data seeder will also run automatically creating 100 test users.

```bash
# Frontend
npm start # frontend will start on http:localhost:3000
```

6. Accessing the application

- Open you browser and go to:
```bash
http://localhost:3000
```

- Register a new account or use any seeded test account:
```bash
Email: james@test.com
Password: password
```
- **IMPORTANT NOTE**: All seeded account has password 'password' and the username is the '{username}@test.com'. Sample usernames can be seen from the data seeder or log has been added so spring terminal can be used to see the usernames of creates users for logging into without creating any user.


### Bonus features in the program

- The application supports includes a feature wherein a user can hide their online status by clicking the 'Hide online status' button on the bottom left sidebar if they want privacy and then the other matched users will not be able to see them online. This can be toggled back to 'Show online status' from the bottom left sidebar button.


## Application Endpoints - the application uses REST endpoints internally 

### Authentication 

| Method       | Endpoint             | Description                  |
| -------------| ---------------------| -----------------------------|
| POST         | /api/auth/register   | Register a new user          |
| POST         | /api/auth/login      | Login and receive JWT cookie |
| POST         | /api/auth/logout     | Logout and clear cookie      | 

### Current User (Authenticated user)

| Method       | Endpoint             | Description                  |
| -------------| ---------------------| -----------------------------|
| GET          | /api/me              | Get current user             |
| PUT          | /api/me              | Update full profile          |
| PUT          | /api/me/profile-picture | Upload profile picture    | 
| DELETE       | /api/me/profile-picture | Delete profile picture    |
| GET          | /api/me/profile         | Get current user 'about me' |
| GET          | /api/me/BIO             | Get current user bio        |
| GET          | /api/me/bio/options     | Get available bio options   |
| PATCH        | /api/me/hide-online-statusToggle | Toggle online statud |

### Users 

| Method       | Endpoint             | Description                  |
| -------------| ---------------------| -----------------------------|
| GET          | /api/users/{id}      | Get user by ID               |
| GET          | /api/users/{id}/bio  | Get user bio                 |
| GET          | /api/users/{id}/profile | Logout and clear cookie   | 

### Recommendations

| Method       | Endpoint             | Description                  |
| -------------| ---------------------| -----------------------------|
| GET          | /api/recommendations | Get recommended users        |

### Connections

| Method       | Endpoint             | Description                  |
| -------------| ---------------------| -----------------------------|
| GET          | /api/connections     | Get all matched connections  |
| POST         | /api/connections/{id}/match  | Like a user          |
| POST         | /api/connections/{id}/dismiss | Dismiss a user      |
| DELETE       | /api/connections/{id}/unmatch  | Unmatch a user     |

### Messages (Chat)

| Method       | Endpoint             | Description                  |
| -------------| ---------------------| -----------------------------|
| GET          | /api/messages/{userId}  | Get paginated chat messages history |
| GET          | /api/messages/{userId}/unread | Get unread message count      |
| GET          | /api/messages/{userId}/last  | Get last message timestamp     |
| POST         | /api/messages/{userId}/read  | Mark messages as read          |

### Websockets (stomp)

| Destination  | Direction             | Description                  |
| -------------| ---------------------| ------------------------------|
| /app/chat    | Client -> Server     | Send a message                |
| /app/typing  | Client -> Server     | Send typing indicator         |
| /app/status/request   | Client -> Server   | Request online status  |
| /user/{email}/queue/messages | Server -> Client | Receive messages  |
| /user/{email}/queue/status   | Server -> Client | Receive status s  |
| /user/{email}/queue/unread   | Server -> Client | Receive unread count |
| /user/{email}/queue/typing   | Server -> Client | Receive typing indicator |
| /topic/status   | Server -> All | Broadcase online status to all           |


## Usage Guide

### Register and Login

- Visit http://localhost:3000/register
- Enter your email and password
- You will be redirected to the onboarding page to complete your profile

### Complete Your Profile
```bash
#Fill in your:

Name and about me
Age, gender and location
Interests (up to 5)
Languages (up to 3)
Partner preferences (age range, gender, distance)
```

### Discover people

- Navigate to Discover in the sidebar
- Browse through recommended profiles one at a time
- Click Match to send a like or Dismiss to skip
- If someone you liked has already liked you back — it is an instant match

### Matches

- Navigate to Matches in the sidebar
- See all your matched users ordered by most recent activity
- Green dot next to name means the user is currently online
- Red badge on Chat button shows unread message count

### Chat

- Click Chat on any match to open the conversation
- Messages are delivered in real time
- Typing indicator shows when the other person is typing
- Scroll up and Click Load older messages to view previous messages (10 at at time)

### View Profile

- Click View Full Profile on any match card
- See full details including interests, languages and location
- Click Chat to start a conversation from the profile page
- Click Unmatch to remove the connection permanently

### Privacy

- Click your name at the bottom left of the sidebar
- Click Hide online status to appear offline to other users
- Click Show online status to become visible again


## Error Handling

### Backend Error Handling

- The backend uses a global exception handler (GlobalExceptionHandler) that catches all exceptions and returns consistent JSON error responses.
- Custom exceptions handled:
```bash
ResourceNotFoundException → 404 when a user, profile or connection is not found
EmailAlreadyTakenException → 409 when registering with an existing email
FileStorageException → 500 when profile picture upload fails
Validation errors → 400 with field level error messages
```

### Input Validation

- Backend uses Jakarta Bean Validation annotations on request DTOs:
```bash
Name        → minimum 2 characters, maximum 100
Age         → must be between 18 and 100
Interests   → minimum 1, maximum 5
Languages   → minimum 1, maximum 3
About me    → maximum 300 characters
Distance    → between 1 and 100
```
- Invalid requests are rejected before reaching the service layer.

### Profile access security

- Users can only see full profile with matched connections
- Attempting to access /profile/{id} with an unmatched or invalid user returns an error message

### Authentication

- All endpoints except /api/auth/** and /ws/** require a valid JWT cookie
- Expired or missing tokens return 401 Unauthorized
- Passwords are hashed with BCrypt before storage

### Frontend Error Handling

- Failed API calls return empty states rather than crashing the page
- Invalid chat routes show a friendly message instead of a 404 page
- Profile not found returns a not found message with an icon
- User cannot chat with themselves


## Project Structure

- The whole project lives inside the web folder after cloning the repository. The structure inside the folder is as follow:-

```
web/
├── backend/                          # Spring Boot Java backend
│   ├── src/main/java/com/matchme/backend/
│   │   ├── BackendApplication.java   # Spring Boot entry point
│   │   ├── DataSeeder.java           # Seeds 100 test users on startup
│   │   ├── auth/                     # Authentication
│   │   │   ├── dto/
│   │   │   │    ├── AuthService.java  # Register and login logic  
│   │   │   │    ├── AuthResponse.java
│   │   │   │    ├── RegisterRequest.java
│   │   │   │    └── LoginRequest.java
│   │   │   ├── jwt/
│   │   │   |    ├── JwtService.java   # JWT generation and validation
│   │   │   |    ├── JwtAuthenticationFilter.java
│   │   │   |    └── IssuedToken.java
|   |   |   └── AuthController.java
│   │   ├── config/                   # Spring configuration
│   │   │    ├── SecurityConfig.java   # Spring Security and CORS
│   │   │    ├── WebSocketConfig.java  # STOMP WebSocket configuration
│   │   │    └── WebConfig.java        # Static file serving for uploads
│   │   ├── exception/                # Global error handling
│   │   │    ├── GlobalExceptionHandler.java
│   │   │    ├── ResourceNotFoundException.java
│   │   │    ├── EmailAlreadyTakenException.java
|   |   |    ├── ApiError.java
|   |   |    ├── RestAccessDeniedHandler.java
|   |   |    ├── RestAuthenticationEntryPoint.java
│   │   │    └── FileStorageException.java
│   │   └── user/                     # Core user domain
│   │       ├── User.java             # User entity
│   │       ├── UserRepository.java
│   │       ├── UserService.java
│   │       ├── UserMapper.java
│   │       ├── UserFullProfileMapper.java
│   │       ├── CustomUserDetailsService.java
│   │       ├── MeController.java     # /api/me endpoints
│   │       ├── UserController.java   # /api/users/{id} endpoints
│   │       ├── dto/                  # User request/response DTOs
│   │       │    ├── MeResponse.java
│   │       │    ├── UserFullProfileRequest.java
│   │       │    ├── UserFullProfileReponse.java 
│   │       │    ├── UserRequest.java
│   │       │    └── UserResponse.java
│   │       ├── bio/                  # User bio (age, gender, interests)
│   │       │    ├── UserBio.java
│   │       │    ├── UserBioService.java
│   │       │    ├── UserBioRepository.java
│   │       │    ├── UserBioMapper.java
│   │       │    ├── dto/  
│   │       │    │    ├── MeBioResponse.java
│   │       │    │    ├── UserBioOptionResponse.java
│   │       │    │    ├── UserBioRequest.java 
│   │       │    │    └── UserBioResponse.java            
│   │       │    └── enums/            # Gender, Interest, Language, GenderPreference enums
│   │       ├── profile/              # User profile (about me)
│   │       │   ├── UserProfile.java
│   │       │   ├── UserProfileMapper.java
│   │       │   ├── UserProfileService.java
│   │       │   ├── UserProfileRepository.java
│   │       │   └── dto/
│   │       │        ├── UserProfileRequest.java
│   │       │        └── UserProfileResponse.java
│   │       ├── connection/           # Match, dismiss, unmatch
│   │       │   ├── Connection.java
│   │       │   ├── ConnectionService.java
│   │       │   ├── ConnectionRepository.java
│   │       │   ├── ConnectionController.java
│   │       │   └── enums/
│   │       │       └── ConnectionStatus.java
│   │       ├── recommendation/       # Recommendation algorithm
│   │       │   ├── RecommendationService.java
│   │       │   ├── RecommendationController.java
│   │       │   ├── scoring/
│   │       │   │     ├── ScoreCalculator.java
│   │       │   │     ├── InterestScoreCalculator.java
│   │       │   │     ├── LanguageScoreCalculator.java
│   │       │   │     └── LocationScoreCalculator.java
│   │       │   └── dto/
│   │       │        └── RecommendationResponse.java
│   │       └── chat/                 # Real time messaging
│   │           ├── Message.java
│   │           ├── MessageRepository.java
│   │           ├── MessageService.java
│   │           ├── ChatController.java
│   │           ├── WebSocketEventListener.java
│   │           └── dto/
│   │               ├── MessageRequest.java
│   │               ├── MessageResponse.java
│   │               ├── TypingEvent.java
│   │               └── StatusEvent.java
│   ├── src/main/resources/
│   │   └── application.properties    # Database, JWT, app configuration
│   └── pom.xml                       # Maven dependencies
│
└── frontend/                         # Next.js TypeScript frontend
    ├── app/
    │   ├── (guest)/                  # Unauthenticated pages
    │   │   ├── login/
    │   │   ├── register/
    │   │   └── actions.tsx           # Register and login server actions
    │   ├── (authenticated)/          # Authenticated pages
    │   │   ├── layout.tsx            # Sidebar + GlobalWebSocketConnector
    │   │   ├── actions.tsx           # fetchWithAuth, getAuthenticatedUser
    │   │   ├── types.ts              # Shared TypeScript types
    │   │   ├── discover/             # Recommendation cards
    │   │   │   ├── page.tsx
    │   │   │   ├── Discover.tsx      # Client component with like/dismiss
    │   │   │   ├── data.ts
    │   │   │   ├── actions.ts
    |   │   │   └── types.ts
    |   │   ├── likes/             # Recommendation cards
    │   │   │   ├── page.tsx
    │   │   │   ├── LikesClient.tsx      # Client component with match/dismiss
    │   │   │   ├── data.ts
    │   │   │   └── actions.ts
    |   │   │   └── types.ts
    │   │   ├── matches/              # Matched users list
    │   │   │   ├── page.tsx
    │   │   │   ├── MatchesClient.tsx # Real time unread and online status
    │   │   │   ├── UnreadListener.tsx
    │   │   │   ├── data.ts
    │   │   │   ├── actions.ts
    │   │   │   └── types.ts
    │   │   ├── chat/
    │   │   │   └── [id]/             # Dynamic chat route
    │   │   │       ├── page.tsx
    │   │   │       ├── ChatWindow.tsx # Real time chat client component
    │   │   │       └── data.ts
    │   │   └── profile/
    │   │       ├── [[...userId]]/    # Optional catch-all profile route
    │   │       │   ├── page.tsx      # Own profile or other user profile
    │   │       │   └── data.ts
    │   │       └── update/           # Profile edit form
    │   │           ├── page.tsx
    │   │           ├── ProfileEditForm.tsx
    │   │           ├── data.ts
    │   │           └── actions.ts
    │   └── (onboarding)/             # First time profile setup
    │       └── onboarding/
    ├── components/
    │   ├── ui/                       # shadcn components
    │   ├── sidebar/                  # App sidebar components
    │   │   ├── app-sidebar.tsx
    │   │   ├── nav-main.tsx
    │   │   └── nav-user.tsx
    │   └── realtime/                 # WebSocket client components
    │       ├── WebSocketContext.tsx  # Shared WebSocket connection
    │       ├── GlobalWebSocketConnector.tsx
    │       ├── RealtimeListener.tsx  # Unread and online status
    │       └── OnlineStatusListener.tsx # online status for profile page
    ├── next.config.ts
    ├── tailwind.config.ts
    └── package.json
```