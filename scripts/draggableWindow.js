class DraggableWindow {
    static instances = [];

    constructor(name, icon, content) {
        this.template = document.querySelector('#windowTemplate');
        this.window = this.template.content.cloneNode(true).firstElementChild;
        this.addressBar = this.window.querySelector('.addressBar');
        this.addressBarNameText = this.addressBar.querySelector('.addressBarName p');
        this.addressBarNameIcon = this.addressBar.querySelector('.addressBarName img');
        this.icon = icon;
        this.addressBarNameIcon.setAttribute('src',  this.icon);
        this.minimize = this.addressBar.querySelector('.minimize');
        this.zoom = this.addressBar.querySelector('.zoom');
        this.close = this.addressBar.querySelector('.close');
        this.content = this.window.querySelector('.content');
        this.addressBarNameText.textContent = name;
        this.content.innerHTML = content;
        this.offsetX = 0;
        this.offsetY = 0;

        this.window.id = `draggableWindow${DraggableWindow.instances.length + 1}`;
        document.body.appendChild(this.window);

        this.attachEventListeners();
        DraggableWindow.instances.push(this);

        this.setInitialPosition();
    }

    attachEventListeners() {
        this.addressBar.addEventListener('mousedown', this.startDrag.bind(this));
        document.addEventListener('mouseup', this.endDrag.bind(this));
        document.addEventListener('mousemove', this.drag.bind(this));
        this.close.addEventListener('click', this.closeWindow.bind(this));
        this.minimize.addEventListener('click', this.minimizeWindow.bind(this));
        this.zoom.addEventListener('click', this.toggleZoomWindow.bind(this));
    }

    setInitialPosition() {
        requestAnimationFrame(() => {
            const rect = this.window.getBoundingClientRect();
            const centerX = (window.innerWidth - rect.width) / 2;
            const centerY = (window.innerHeight - rect.height) / 2;
            this.window.style.transform = `translate(${centerX}px, ${centerY}px)`;
            this.offsetX = centerX;
            this.offsetY = centerY;
        });
    }

    closeWindow(event){
        this.window.setAttribute('state', 'closed');
    }

    minimizeWindow(event){
        this.window.setAttribute('state', 'minimized');
    }

    toggleZoomWindow(event){

    }

    startDrag(event) {
        this.startX = event.clientX;
        this.startY = event.clientY;
        this.addressBar.classList.add('dragging');
        const transform = window.getComputedStyle(this.window).transform;
    
        if (transform === 'none' || !transform.startsWith('matrix')) {
            this.offsetX = 0;
            this.offsetY = 0;
        } else {
            const translate = transform.match(/matrix\(([\d\.\-]+),\s*([\d\.\-]+),\s*([\d\.\-]+),\s*([\d\.\-]+),\s*([\d\.\-]+),\s*([\d\.\-]+)\)/);
            if (translate) {
                this.offsetX = parseFloat(translate[5]);
                this.offsetY = parseFloat(translate[6]);
            }
        }
    }
    
    drag(event) {
        if (!this.addressBar.classList.contains('dragging')) {
            return;
        }
        const dx = event.clientX - this.startX;
        const dy = event.clientY - this.startY;
        const newTransform = `translate(${this.offsetX + dx}px, ${this.offsetY + dy}px)`;
        this.window.style.transform = newTransform;
    }

    endDrag() {
        this.addressBar.classList.remove('dragging');
    }

    static removeAllWindows() {
        DraggableWindow.instances.forEach(instance => {
            instance.window.remove();
        });
        DraggableWindow.instances = [];
    }
}

new DraggableWindow("profile.txt", "/assets/images/profileIcon.svg", null);
