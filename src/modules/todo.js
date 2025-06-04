import { format } from 'date-fns';

const TodoFactory = (title, description = '', dueDate = null, priority = 'low', projectId = 'inbox', notes = '', checklist = []) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    let completed = false;
    let _checklist = checklist.map(item => ({
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        text: item,
        completed: false
    }));

    return {
        id,
        title,
        description,
        dueDate,
        priority,
        projectId,
        notes,
        completed,

        toggleComplete() {
            this.completed = !this.completed;
            return this.completed;
        },

        update(updates) {
            Object.assign(this, updates);
        },

        addChecklistItem(text) {
            _checklist.push({
                id: Date.now().toString(36) + Math.random().toString(36).substr(2),
                text,
                completed: false
            });
        },

        removeChecklistItem(id) {
            _checklist = _checklist.filter(item => item.id !== id);
        },

        toggleChecklistItem(id) {
            const item = _checklist.find(item => item.id === id);
            if (item) {
                item.completed = !item.completed;
            }
        },

        getChecklist() {
            return [..._checklist];
        },

        isOverdue() {
            if (!this.dueDate || this.completed) return false;
            return new Date(this.dueDate) < new Date();
        },

        getFormattedDueDate() {
            if (!this.dueDate) return '';
            return format(new Date(this.dueDate), 'MMM d, yyyy');
        },

        toJSON() {
            return {
                id: this.id,
                title: this.title,
                description: this.description,
                dueDate: this.dueDate,
                priority: this.priority,
                projectId: this.projectId,
                notes: this.notes,
                completed: this.completed,
                checklist: _checklist
            };
        }
    };
};

export default TodoFactory; 