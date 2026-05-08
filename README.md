# To-do List App

A minimalist task manager built with React and Vite. The app lets users create, edit, complete, reorder and delete tasks with a clean interface and smooth animations.

## Deploy

Netlify link: https://to-dolist-academic.netlify.app/

## Author

Marco Guevara

## Main Features

- Add new tasks with a title and optional content.
- Validate task titles before saving.
- Edit existing tasks.
- Mark tasks as done or undo them.
- Separate pending tasks from completed tasks.
- Show completed tasks in a different list at the bottom.
- Delete individual tasks.
- Clear all tasks with a confirmation popup.
- Reset the app back to the initial preloaded tasks.
- Reorder tasks with a mobile-friendly drag handle.
- Show success and error messages.
- Responsive layout for desktop and mobile screens.

## How The App Works

The app starts with a list of preloaded tasks from `src/utils/tasks.json`.

When the user adds a new task, it appears at the top of the pending task list, so the newest tasks are shown first. When a task is marked as done, it moves to the completed list at the bottom. Done tasks can still be edited, deleted or moved back to pending with the `UNDO` button.

The `CLEAR` button removes every task from the app, including the preloaded tasks and the tasks added by the user. To avoid deleting everything by mistake, the app shows a confirmation popup before clearing the list.

The drag handle is designed for mobile users. Instead of relying on native browser drag and drop, the app uses pointer events so tasks can be reordered by pressing and moving the handle.

## Project Structure

```text
src/
  App.jsx
  App.css
  main.jsx
  components/
    Form.jsx
    List.jsx
  utils/
    tasks.json
```

## Important Files

- `src/components/Form.jsx`: Main component. It manages task state, form values, validation, editing, clearing, resetting and drag reorder logic.
- `src/components/List.jsx`: Renders each task and its action buttons.
- `src/App.css`: Contains the full visual style, layout, responsive rules and animations.
- `src/utils/tasks.json`: Contains the initial tasks loaded when the app starts or when the user clicks `RESET`.

## Technologies Used

- React
- Vite
- JavaScript
- CSS

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Run lint:

```bash
npm run lint
```

## Notes

This project uses plain React state and CSS.
