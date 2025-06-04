import { format, isToday, isTomorrow, isPast } from 'date-fns';

const TodoUI = {
    createTodoElement(todo, onToggle, onEdit, onDelete) {
        const todoElement = document.createElement('div');
        todoElement.className = `todo-item ${todo.completed ? 'completed' : ''} animate-fade-in`;
        todoElement.dataset.priority = todo.priority;
        todoElement.dataset.id = todo.id;

        const isOverdue = todo.isOverdue();
        const dueDate = todo.dueDate ? new Date(todo.dueDate) : null;
        let dateText = '';
        let dateClass = '';

        if (dueDate) {
            if (isToday(dueDate)) {
                dateText = 'Today';
                dateClass = 'today';
            } else if (isTomorrow(dueDate)) {
                dateText = 'Tomorrow';
            } else if (isPast(dueDate) && !todo.completed) {
                dateText = format(dueDate, 'MMM d');
                dateClass = 'overdue';
            } else {
                dateText = format(dueDate, 'MMM d');
            }
        }

        todoElement.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            
            <div class="todo-content">
                <div class="todo-title">${todo.title}</div>
                ${dateText ? `
                    <div class="todo-details">
                        <span class="todo-date ${dateClass}">${dateText}</span>
                    </div>
                ` : ''}
                <div class="todo-description">
                    ${todo.description ? `<p>${todo.description}</p>` : ''}
                    ${todo.notes ? `<p class="todo-notes">${todo.notes}</p>` : ''}
                    ${this.renderChecklist(todo)}
                </div>
            </div>

            <div class="todo-actions">
                <button class="todo-action-btn edit-btn" title="Edit todo">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="todo-action-btn delete-btn" title="Delete todo">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `;

        // Event listeners
        const checkbox = todoElement.querySelector('.todo-checkbox');
        checkbox.addEventListener('change', () => onToggle(todo));

        const editBtn = todoElement.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => onEdit(todo));

        const deleteBtn = todoElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => onDelete(todo));

        // Toggle description visibility
        const description = todoElement.querySelector('.todo-description');
        description.style.display = 'none';

        // Expand/collapse description
        todoElement.addEventListener('click', (e) => {
            if (!e.target.closest('.todo-checkbox, .todo-action-btn, .todo-checklist input[type="checkbox"]')) {
                const isExpanded = description.style.display === 'block';
                description.style.display = isExpanded ? 'none' : 'block';
                todoElement.classList.toggle('expanded', !isExpanded);
                
                if (!isExpanded) {
                    description.classList.add('animate-fade-in');
                }
            }
        });

        return todoElement;
    },

    renderChecklist(todo) {
        const checklist = todo.getChecklist();
        if (checklist.length === 0) return '';

        return `
            <div class="todo-checklist">
                <h4>Checklist</h4>
                <ul>
                    ${checklist.map(item => `
                        <li class="${item.completed ? 'completed' : ''}">
                            <input type="checkbox" 
                                   data-checklist-id="${item.id}" 
                                   ${item.completed ? 'checked' : ''}>
                            <span>${item.text}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    },

    attachChecklistHandlers(todoElement, todo) {
        const checklistItems = todoElement.querySelectorAll('.todo-checklist input[type="checkbox"]');
        checklistItems.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation(); // Prevent event from bubbling up to todo item
                const itemId = checkbox.dataset.checklistId;
                todo.toggleChecklistItem(itemId);
                checkbox.closest('li').classList.toggle('completed', checkbox.checked);
            });
        });
    }
};

export default TodoUI; 