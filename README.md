# Kanban Board

🚀 Live Demo: https://tasktrek-kanban.vercel.app

## Project overview

Kanban Board is an Angular 19 task management application built with a classic kanban workflow. It includes login-based access, role-aware permissions, task creation and editing, priority filtering, and drag-and-drop task movement across board columns.

## Tech stack

- Angular 19.2.x
- TypeScript 5.6.x
- Angular CDK Drag & Drop
- Angular Reactive Forms
- json-server for mock REST API
- SCSS for styling
- RxJS for reactive state handling

## Main features

- Email/password login with mock API authentication
- Kanban board with columns: `Todo`, `In Progress`, `Review`, `Done`
- Add, edit, view, and delete tasks
- Drag and drop tasks between columns
- Role-based permissions for `admin`, `hr`, and `user`
- Search by task title
- Filter by priority and assignee
- Task completion toggle for `in-progress` tasks
- Loading skeleton while tasks are fetched

## Authentication flow

- `LoginComponent` validates credentials against `http://localhost:3000/users`
- Successful login stores `isLoggedIn` and `loggedInUser` in `localStorage`
- `authGuard` protects `/dashboard`
- `loginGuard` redirects logged-in users away from `/login`

## Role-based permissions

User roles are defined in `db.json` and enforced in the UI:

- `admin`
  - Can drag any task
  - Can edit any task
  - Can delete tasks
  - Can mark tasks complete
- `hr`
  - Can drag any task
  - Can edit any task
  - Cannot delete tasks via modal controls
  - Can mark tasks complete
- `user`
  - Can drag only their own tasks
  - Can edit only their own tasks in `todo` or `in-progress`
  - Can complete only their own tasks
  - Cannot modify tasks assigned to others

## Kanban workflow rules

The board uses the following statuses:

- `todo`
- `in-progress`
- `review`
- `done`

Task status is saved through the mock API and displayed in matching columns.

## Drag and drop behavior

- Implemented with Angular CDK in `TasksComponent`
- All columns are connected drop lists
- `admin` and `hr` can move any task
- `user` can move only their assigned tasks
- Moving from `in-progress` to `review` requires task completion for `admin` and `hr`
- Status updates persist through `ApiTasksService.updateTask()`

## Task completion rules

- Completion is available only in the `in-progress` column
- `admin` and `hr` can complete any task
- `user` can complete only tasks assigned to them
- Completed tasks are marked with `task.isCompleted`
- Tasks must be completed before moving to `review` in restricted flows

## API / local server setup

This app uses `json-server` as a mock backend.

- Users endpoint: `http://localhost:3000/users`
- Tasks endpoint: `http://localhost:3000/tasks`

Mock data is stored in `db.json`.

### Start mock API server

```bash
npm run api
```

## Installation steps

1. Install dependencies:

```bash
npm install
```

2. Start the mock API server:

```bash
npm run api
```

3. Start the Angular development server:

```bash
npm start
```

4. Open the app at:

```text
http://localhost:4200
```

## Run project commands

- `npm start` — run Angular dev server
- `npm run api` — run local json-server API
- `npm run build` — build production bundle
- `npm run test` — run unit tests

## Folder structure

```
kanban-board/
├─ angular.json
├─ package.json
├─ db.json
├─ README.md
├─ src/
│  ├─ app/
│  │  ├─ app.routes.ts
│  │  ├─ components/
│  │  │  ├─ add-task-modal/
│  │  │  ├─ board/
│  │  │  ├─ board-loader/
│  │  │  ├─ dashboard/
│  │  │  ├─ login/
│  │  │  ├─ navbar/
│  │  │  ├─ tasks/
│  │  ├─ guard/
│  │  │  ├─ auth/
│  │  │  ├─ loginGuard/
│  │  ├─ models/
│  │  ├─ services/
│  │  │  ├─ api-tasks/
│  │  │  ├─ auth/
│  ├─ main.ts
│  ├─ styles.scss
```

## Important components and services

- `LoginComponent` — login form and authentication flow
- `DashboardComponent` — main protected page and layout
- `BoardComponent` — task loading, filters, and modal control
- `TasksComponent` — kanban columns, drag/drop, and task cards
- `AddTaskModalComponent` — create/edit/view task modal with validation
- `BoardLoaderComponent` — loading skeleton display
- `AuthService` — login and localStorage session handling
- `ApiTasksService` — task CRUD operations against mock API

## Screens/pages overview

- `Login` — secure entry point with validation feedback
- `Dashboard` — kanban board with search, filters, and task modal support

## Validation rules

- Login:
  - Email is required and must be valid
  - Password is required and must be at least 6 characters
- Task form:
  - Title is required, minimum 3 characters, must start with a letter
  - Description is required, minimum 10 characters, must start with a letter
  - Priority is required
  - Due date is required and cannot be in the past
  - Assigned user is required
  - Status is required

## Known limitations

- Authentication is mocked via `json-server`
- Role checks are enforced on the client side only
- No real backend or secure token/session management
- No production API or database configured yet

## Future improvements

- Add secure backend authentication and session management
- Implement server-side role enforcement
- Add full unit and integration tests
- Improve mobile responsiveness and accessibility
- Add task activity/history logging

## Author

Smit Nakum

- Angular Developer
- Built as an Angular 19 Kanban Task Management Application

## License

This project is licensed under the ISC License.

See the LICENSE file for details.
