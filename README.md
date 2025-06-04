# Todo List App

A polished, portfolio-worthy Todo List web application built with vanilla JavaScript and Webpack. Features a beautiful dark theme, smooth animations, and a modern user interface.

## Features

- Create, edit, and delete todos with titles, descriptions, due dates, and priority levels
- Organize todos into projects
- Add checklists to todos for subtasks
- Mark todos as complete
- Sort todos by due date and priority
- Persist data using localStorage
- Responsive design for mobile and desktop
- Beautiful dark theme with smooth animations
- Modern, minimalist UI

## Tech Stack

- Vanilla JavaScript (ES6+)
- Webpack for bundling
- date-fns for date handling
- LocalStorage API for data persistence
- CSS3 with custom properties and animations

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/bit2swaz/todo-list.git
   cd todo-list
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm start
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
todo-list/
├── src/
│   ├── modules/
│   │   ├── todo.js         # Todo item factory
│   │   ├── project.js      # Project management
│   │   ├── storage.js      # LocalStorage handling
│   │   └── ui/
│   │       ├── todoUI.js   # Todo DOM manipulation
│   │       ├── projectUI.js # Project view handling
│   │       ├── modal.js    # Modal component
│   │       └── render.js   # Main rendering logic
│   ├── styles/
│   │   ├── main.css       # Main styles
│   │   ├── todo.css       # Todo styles
│   │   ├── modal.css      # Modal styles
│   │   └── animations.css # Animation utilities
│   ├── index.js           # Entry point
│   └── index.html         # HTML template
└── webpack.config.js      # Webpack configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Made with ❤ by [bit2swaz](https://github.com/bit2swaz)
- Icons from [Feather Icons](https://feathericons.com/)
- Font from [Google Fonts](https://fonts.google.com/)