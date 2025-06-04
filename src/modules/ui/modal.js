const Modal = {
    modal: null,
    modalTitle: null,
    modalBody: null,
    isOpen: false,
    onSubmit: null,
    toastTimeout: null,

    init() {
        this.modal = document.getElementById('modal');
        this.modalTitle = document.getElementById('modal-title');
        this.modalBody = document.getElementById('modal-body');

        // Create toast container
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);

        // Close button event
        document.getElementById('close-modal').addEventListener('click', () => this.close());

        // Click outside to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.close();
        });
    },

    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} animate-slide-right`;
        toast.textContent = message;

        // Remove existing toasts
        if (this.toastTimeout) {
            clearTimeout(this.toastTimeout);
        }
        toastContainer.innerHTML = '';
        
        toastContainer.appendChild(toast);

        // Auto remove after 3 seconds
        this.toastTimeout = setTimeout(() => {
            toast.classList.add('toast-hide');
            setTimeout(() => {
                if (toastContainer.contains(toast)) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        }, 3000);
    },

    showConfirm(title, message, onConfirm) {
        const content = `
            <div class="confirm-dialog">
                <p>${message}</p>
                <div class="confirm-actions">
                    <button class="secondary-btn" id="cancel-btn">Cancel</button>
                    <button class="primary-btn" id="confirm-btn">Confirm</button>
                </div>
            </div>
        `;

        this.open(title, content);

        const confirmBtn = this.modalBody.querySelector('#confirm-btn');
        const cancelBtn = this.modalBody.querySelector('#cancel-btn');

        confirmBtn.addEventListener('click', () => {
            onConfirm();
            this.close();
        });

        cancelBtn.addEventListener('click', () => {
            this.close();
        });
    },

    open(title, content, onSubmit) {
        this.modalTitle.textContent = title;
        this.modalBody.innerHTML = content;
        this.onSubmit = onSubmit;
        this.modal.classList.add('show');
        this.isOpen = true;

        // Focus first input
        const firstInput = this.modalBody.querySelector('input, textarea');
        if (firstInput) firstInput.focus();

        // Handle form submission
        const form = this.modalBody.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                // Handle checklist items
                if (data.checklistItems) {
                    data.checklist = data.checklistItems.split('\n')
                        .map(item => item.trim())
                        .filter(item => item !== '');
                    delete data.checklistItems;
                }

                if (this.onSubmit) {
                    this.onSubmit(data);
                }
                this.close();
            });
        }
    },

    close() {
        this.modal.classList.remove('show');
        this.isOpen = false;
        this.modalBody.innerHTML = '';
        this.onSubmit = null;
    },

    createTodoForm(todo = null) {
        return `
            <form class="todo-form">
                <div class="form-group">
                    <label for="title">Title</label>
                    <input type="text" id="title" name="title" class="form-control" required 
                           value="${todo ? todo.title : ''}" placeholder="Enter todo title">
                </div>

                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" name="description" class="form-control" rows="3" 
                              placeholder="Enter description">${todo ? todo.description : ''}</textarea>
                </div>

                <div class="form-group">
                    <label for="dueDate">Due Date</label>
                    <input type="date" id="dueDate" name="dueDate" class="form-control"
                           value="${todo && todo.dueDate ? todo.dueDate.split('T')[0] : ''}">
                </div>

                <div class="form-group">
                    <label>Priority</label>
                    <div class="priority-options">
                        <div class="priority-option low">
                            <input type="radio" id="priority-low" name="priority" value="low" 
                                   ${!todo || todo.priority === 'low' ? 'checked' : ''}>
                            <label for="priority-low">Low</label>
                        </div>
                        <div class="priority-option medium">
                            <input type="radio" id="priority-medium" name="priority" value="medium"
                                   ${todo && todo.priority === 'medium' ? 'checked' : ''}>
                            <label for="priority-medium">Medium</label>
                        </div>
                        <div class="priority-option high">
                            <input type="radio" id="priority-high" name="priority" value="high"
                                   ${todo && todo.priority === 'high' ? 'checked' : ''}>
                            <label for="priority-high">High</label>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label for="notes">Notes</label>
                    <textarea id="notes" name="notes" class="form-control" rows="2" 
                              placeholder="Additional notes">${todo ? todo.notes : ''}</textarea>
                </div>

                <div class="form-group">
                    <label for="checklistItems">Checklist Items</label>
                    <textarea id="checklistItems" name="checklistItems" class="form-control" rows="3" 
                              placeholder="Enter items (one per line)">${todo ? todo.getChecklist().map(item => item.text).join('\n') : ''}</textarea>
                </div>

                <button type="submit" class="primary-btn">
                    ${todo ? 'Update Todo' : 'Create Todo'}
                </button>
            </form>
        `;
    },

    createProjectForm(project = null) {
        return `
            <form class="project-form">
                <div class="form-group">
                    <label for="name">Project Name</label>
                    <input type="text" id="name" name="name" class="form-control" required 
                           value="${project ? project.name : ''}" placeholder="Enter project name">
                </div>

                <div class="form-group">
                    <label for="color">Project Color</label>
                    <input type="color" id="color" name="color" class="form-control" 
                           value="${project ? project.color : '#bb86fc'}">
                </div>

                <button type="submit" class="primary-btn">
                    ${project ? 'Update Project' : 'Create Project'}
                </button>
            </form>
        `;
    }
};

export default Modal; 