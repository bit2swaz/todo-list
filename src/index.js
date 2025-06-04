import './styles/main.css';
import './styles/modal.css';
import './styles/todo.css';
import './styles/animations.css';

import Render from './modules/ui/render';

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Render.init();
}); 