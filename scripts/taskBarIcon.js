class TaskBarIcon{

    constructor(linkedWindow){
        this.template = document.getElementById('taskBarIconTemplate');
        this.linkedWindow = linkedWindow;
        this.el = this.template.content.cloneNode(true).firstElementChild;
        this.image = linkedWindow.icon;
        this.el.src = this.image;
        this.#addEventListeners();
    }

    #addEventListeners() {
        this.el.addEventListener('click', () => {
            this.linkedWindow.toggleOpened();
        })
    }

    setFocused(focused){
        if(focused) this.el.style.display = 'block';
        this.el.setAttribute('focused', focused);
    }

    destroy(){
        this.el.style.display = 'none';
    }
}