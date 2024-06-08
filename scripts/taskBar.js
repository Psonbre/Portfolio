class TaskBar{
    static el = document.getElementById('taskBar');
    static iconsDiv = this.el.querySelector('.icons')

    static addTaskBarIcon(draggableWindow){
        let taskBarIcon = new TaskBarIcon(draggableWindow);
        this.iconsDiv.appendChild(taskBarIcon.el);
        return taskBarIcon;
    }
}