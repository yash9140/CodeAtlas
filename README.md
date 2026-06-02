# GitHub Repo Explorer Monorepo

An interview-ready, full-stack application built for the Studio Graphene Full Stack Assessment. This project enables users to search for GitHub profiles, instantly view and filter their repositories, and inspect detailed repository and programming language analytics.

To ensure client security and bypass direct GitHub API limits, all client communication is routed through a Node.js Express proxy layer, which implements memory caching to ensure fast loading times and rate-limiting resilience.

## 🚀 Live Demos
- **Frontend (Vercel)**: [https://code-atlas-client.vercel.app/](https://code-atlas-client.vercel.app/)
- **Backend (Render)**: [https://codeatlas-cgyv.onrender.com/](https://codeatlas-cgyv.onrender.com/)

---

## 🛠️ Tech Stack

### Frontend
- **React (Vite)**: Rapid hot module replacement and compilation.
- **Tailwind CSS v3**: Fully responsive styling, smooth transitions, and premium dark theme matching modern design systems (GitHub + Linear + Vercel).
- **Lucide React**: Premium, consistent iconography.
- **TanStack Query (React Query) v5**: Managing client-side fetching states, loading states, error states, and cache syncing.
- **Recharts**: High-performance SVGs for generating interactive language distribution charts.
- **Axios**: Promised-based HTTP client configuration.

### Backend
- **Node.js & Express**: Fast, unopinionated web framework for backend routing.
- **Node Cache**: High-performance, in-memory caching for API responses.
- **Axios**: Server-side proxy calls to GitHub.
- **Dotenv**: Safe injection of environment variables.
- **Cors**: Restricts frontend origins.

### Testing
- **Vitest**: Modern Jest-compatible test runner for Unit tests.
- **Supertest**: Endpoint integration assertions.

---

## 💡 Why These Technologies?

1. **Express + Node Cache (Backend Proxy)**:
   Calling third-party APIs directly from the browser risks leaking developer secrets (like the `GITHUB_TOKEN`) and causes rate limits to be hit almost immediately (anonymous GitHub rate limit is just 60 requests per hour). The backend proxy hides credentials and uses `node-cache` with a 60-second Time-To-Live (TTL) to instantly serve duplicate search queries, avoiding unnecessary external network calls.
2. **TanStack Query (React Query)**:
   Simplifies asynchronous state handling in React. It tracks loading skeletons, manages client-side request caches, and keeps UI states fully synchronized without bloated `useState` or `useEffect` code.
3. **Recharts**:
   A declarative chart library designed for React. It automatically handles SVG rendering, resizing, responsive containers, and interactive hover tooltips which are essential for premium dashboards.
4. **Vite**:
   Enables lightning-fast build speeds (under 7 seconds for the production bundle) compared to bulky Webpack solutions.

---

## 📂 Folder Structure

```
root/
├── client/                     # React Frontend Workspace
│   ├── src/
│   │   ├── components/         # Reusable presentation components
│   │   │   ├── ErrorDisplay.jsx # Visual error state screens
│   │   │   ├── LanguageChart.jsx # Recharts language distribution visualizer
│   │   │   ├── LoadingSkeleton.jsx # Profile & Repos grid loaders
│   │   │   ├── ProfileCard.jsx  # Primary user stats card
│   │   │   ├── RecentSearches.jsx # Sidebar history selector
│   │   │   └── RepoCard.jsx     # Expandable repository details card
│   │   ├── hooks/              # Custom React Hooks
│   │   │   ├── useDebounce.js
│   │   │   └── useGitHubQuery.js
│   │   ├── services/           # Axios client configurations
│   │   │   └── api.js
│   │   ├── utils/              # Client-side text/date formatters
│   │   │   └── formatters.js
│   │   ├── App.jsx             # Main component root
│   │   ├── index.css           # Custom scrollbars and styling rules
│   │   └── main.jsx            # Application entry & QueryClient mount
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Express Backend Workspace
│   ├── cache/                  # In-memory storage layer
│   │   └── githubCache.js
│   ├── controllers/            # Request handlers
│   │   └── githubController.js
│   ├── middleware/             # Global filters (error handling)
│   │   └── errorHandler.js
│   ├── routes/                 # Express route paths
│   │   └── githubRoutes.js
│   ├── services/               # Internal API callers
│   │   └── githubService.js
│   ├── utils/                  # Backend utilities (styled console logger)
│   │   └── logger.js
│   ├── app.js                  # Express setup
│   ├── server.js               # Entry script listener
│   └── tests/                  # Backend unit/integration tests
│       └── github.test.js
│
├── package.json                # Root workspaces metadata
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js** (v16.x or higher)
- **npm** (v7.x or higher)

### Setup Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/username/github-repo-explorer.git
   cd github-repo-explorer
   ```

2. **Install Workspace Dependencies**:
   From the root folder, run a single command to install all packages for both the client and server:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file inside the `server/` directory:
   ```bash
   cp server/.env.example server/.env
   ```
   *Note: If you encounter GitHub Rate Limit errors, generate a Personal Access Token on GitHub and paste it in `GITHUB_TOKEN=your_token` in `server/.env`.*

4. **Run the Application**:
   Run both frontend and backend concurrently in development mode using:
   ```bash
   npm run dev
   ```
   - **Frontend** will be running at `http://localhost:5173`
   - **Backend** will be running at `http://localhost:5000`

---

## 🔑 Environment Variables

### Backend (`server/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Local port the backend listens on | `5000` |
| `NODE_ENV` | Mode of operation | `development` |
| `CLIENT_URL` | CORS restriction allowed origin | `http://localhost:5173` |
| `GITHUB_TOKEN` | Optional GitHub Personal Access Token | `ghp_123456789...` |

### Frontend (`client/.env` - optional in development)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Server URL override (fallback is proxy) | `http://localhost:5000` |

---

## 🛰️ API Documentation

### Base URL: `/api/github`

#### 1. Get Profile Details and Repositories
- **Endpoint**: `GET /api/github/:username`
- **Description**: Returns profile summaries and the user's first 100 repositories (used for language analytics and list views).
- **Headers**:
  - `Accept: application/json`
- **Success Response (200 OK)**:
  ```json
  {
    "profile": {
      "avatar": "https://avatars.githubusercontent.com/u/5832347?v=4",
      "name": "The Octocat",
      "username": "octocat",
      "bio": "GitHub testing user",
      "followers": 9500,
      "following": 9,
      "publicRepos": 8
    },
    "repositories": [
      {
        "id": 182212,
        "name": "boysenberry-repo-1",
        "description": "Testing repository",
        "primaryLanguage": "Ruby",
        "starCount": 120,
        "lastUpdatedDate": "2024-05-12T10:00:00Z",
        "openIssuesCount": 2,
        "forkCount": 12,
        "defaultBranch": "master",
        "repositoryUrl": "https://github.com/octocat/boysenberry-repo-1",
        "visibility": "Public"
      }
    ]
  }
  ```
- **Error Responses**:
  - `404 Not Found` (Username not registered on GitHub)
    ```json
    { "success": false, "message": "User not found." }
    ```
  - `429 Too Many Requests` (External rate limit exceeded)
    ```json
    { "success": false, "message": "GitHub API rate limit reached. Please try again later." }
    ```

#### 2. Get Paginated Repositories
- **Endpoint**: `GET /api/github/:username/repos`
- **Query Params**:
  - `page`: Page index (defaults to `1`)
  - `perPage`: Items per page (defaults to `12`)
- **Description**: Fetches page-specific lists of repositories for users with extensive lists.
- **Success Response (200 OK)**:
  ```json
  [
    {
      "id": 182212,
      "name": "boysenberry-repo-1",
      ...
    }
  ]
  ```

---

## 🧪 Testing Instructions

Backend tests run using **Vitest** to assert service fetches, caching logic, and error handlers:
- **Run all tests**:
  ```bash
  npm run test:server
  ```
- **Watch mode**:
  ```bash
  npm run test:server -- --watch
  ```

---

## ☁️ Deployment Instructions

### Deploying Backend (Render)
1. Sign up on [Render](https://render.com).
2. Connect your Git repository.
3. Select **Web Service**.
4. Configure fields:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under Environment variables, add `GITHUB_TOKEN` and set `NODE_ENV` to `production`.

### Deploying Frontend (Vercel)
1. Sign up on [Vercel](https://vercel.app).
2. Create **New Project** and import the repository.
3. In Project Settings, configure:
   - **Root Directory**: `client`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variables:
   - `VITE_API_URL`: Your deployed Render Web Service URL (e.g. `https://codeatlas-cgyv.onrender.com`).

---

## 🔮 Future Improvements
1. **Database Search Sync**: Store recent searches in MongoDB to sync client history across devices rather than relying solely on client `localStorage`.
2. **Organization Filter**: Add support for organization profile explorers alongside user profile explorers.
3. **Readme Read-throughs**: Fetch and display the actual README file when expanding repository cards.
