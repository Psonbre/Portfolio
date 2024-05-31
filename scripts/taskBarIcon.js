class TaskBarIcon{

    constructor(image){
        this.template = document.getElementById('taskBarIconTemplate');
        this.el = this.template.content.cloneNode(true).firstElementChild;
        this.image = image;
        this.imageEl = this.el.querySelector('img');
        this.imageEl.src = this.image;
    }
}