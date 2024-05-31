class TaskBar{

    static el = document.getElementById('taskBar');
    static iconsDiv = this.el.querySelector('.icons')

    static addTaskBarIcon(draggableWindow){
        let taskBarIcon = new TaskBarIcon(draggableWindow.image);
        this.iconsDiv.appendChild(taskBarIcon.el);
    }
}