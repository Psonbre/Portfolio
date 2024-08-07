class DraggableWindow {
    static instances = [];

    constructor(name, icon, contentPath) {
        this.template = document.getElementById('windowTemplate');
        this.window = this.template.content.cloneNode(true).firstElementChild;
        this.addressBar = this.window.querySelector('.addressBar');
        this.addressBarNameText = this.addressBar.querySelector('.addressBarName p');
        this.addressBarNameIcon = this.addressBar.querySelector('.addressBarName img');
        this.icon = icon;
        this.taskBarIcon = TaskBar.addTaskBarIcon(this);
        this.addressBarNameIcon.setAttribute('src', this.icon);
        this.minimizeIcon = this.addressBar.querySelector('.minimize');
        this.zoomIcon = this.addressBar.querySelector('.zoom');
        this.closeIcon = this.addressBar.querySelector('.close');
        this.content = this.window.querySelector('.content');
        this.addressBarNameText.textContent = name;
        fetch(contentPath)
            .then(response => response.text())
            .then(data => {
                this.content.innerHTML = data;
            });
        this.offsetX = 0;
        this.offsetY = 0;

        this.window.id = `draggableWindow${DraggableWindow.instances.length + 1}`;
        document.body.appendChild(this.window);

        this.attachEventListeners();
        DraggableWindow.instances.push(this);
        this.close();

        this.setInitialPosition();
    }

    attachEventListeners() {
        this.window.addEventListener('click', () => DraggableWindow.focusWindow(this));
        this.addressBar.addEventListener('mousedown', this.startDrag.bind(this));
        document.addEventListener('mouseup', this.endDrag.bind(this));
        document.addEventListener('mousemove', this.drag.bind(this));

        this.addressBar.addEventListener('touchstart', this.startDrag.bind(this));
        document.addEventListener('touchend', this.endDrag.bind(this));
        document.addEventListener('touchmove', this.drag.bind(this));

        this.closeIcon.addEventListener('click', this.close.bind(this));
        this.minimizeIcon.addEventListener('click', this.minimize.bind(this));
        this.zoomIcon.addEventListener('click', this.toggleZoom.bind(this));
    }

    setInitialPosition() {
        requestAnimationFrame(() => {
            const rect = this.window.getBoundingClientRect();
            const centerX = (window.innerWidth / 2);
            const centerY = (window.innerHeight / 3);
            const centerXvw = (centerX / window.innerWidth) * 100;
            const centerYvh = (centerY / window.innerHeight) * 100;
            this.window.style.transform = `translate(${centerXvw}vh, ${centerYvh}vh)`;
            this.offsetX = centerXvw;
            this.offsetY = centerYvh;
        });
    }

    close(event) {
        this.window.setAttribute('state', 'closed');
        setTimeout(() => this.taskBarIcon.destroy(), 0);
        setTimeout(() => this.hide(), 500);
    }

    minimize(event) {
        this.window.setAttribute('state', 'minimized');
        this.taskBarIcon.setFocused(false);
    }

    open() {
        this.window.style.display = 'block';
        setTimeout(() => {
            if (this.window.getAttribute('state') == 'closed'){
                const textElements = this.content.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li:not([noTypewrite])');
                
                if (!this.typewriting){
                    textElements.forEach(element => {
                        typewriterEffect(element);
                    });
                }
            }
            this.window.setAttribute('state', 'opened');
            DraggableWindow.focusWindow(this);
        }, 0);
    }

    toggleOpened() {
        if (this.window.getAttribute('state') == 'opened' && this.window.getAttribute('focused') == 'true') this.minimize();
        else this.open();
    }

    toggleZoom(event) {}

    startDrag(event) {
        DraggableWindow.focusWindow(this);
        this.startX = (event.touches ? event.touches[0].clientX : event.clientX);
        this.startY = (event.touches ? event.touches[0].clientY : event.clientY);
        this.addressBar.classList.add('dragging');
        const transform = window.getComputedStyle(this.window).transform;

        if (transform === 'none' || !transform.startsWith('matrix')) {
            this.offsetX = 0;
            this.offsetY = 0;
        } else {
            const translate = transform.match(/matrix\(([\d\.\-]+),\s*([\d\.\-]+),\s*([\d\.\-]+),\s*([\d\.\-]+),\s*([\d\.\-]+),\s*([\d\.\-]+)\)/);
            if (translate) {
                this.offsetX = parseFloat(translate[5]) / window.innerWidth * 100;
                this.offsetY = parseFloat(translate[6]) / window.innerHeight * 100;
            }
        }
    }

    drag(event) {
        if (!this.addressBar.classList.contains('dragging')) {
            return;
        }
        const dx = (event.touches ? event.touches[0].clientX : event.clientX) - this.startX;
        const dy = (event.touches ? event.touches[0].clientY : event.clientY) - this.startY;
        const dxVw = (dx / window.innerWidth) * 100;
        const dyVh = (dy / window.innerHeight) * 100;
        const newTransform = `translate(${Math.max(-(this.window.offsetWidth/window.innerWidth) * 100 + 1, Math.min(this.offsetX + dxVw, 99))}vw, ${Math.max(0, Math.min(this.offsetY + dyVh, 99))}vh)`;
        this.window.style.transform = newTransform;
    }

    endDrag() {
        this.addressBar.classList.remove('dragging');
    }

    hide() {
        this.window.style.display = 'none';
    }

    static focusWindow(windowToFocus) {
        let highestZIndex = 0;
        DraggableWindow.instances.forEach(instance => {
            instance.window.setAttribute('focused', false);
            highestZIndex = Math.max(highestZIndex, instance.window.style.zIndex)
            instance.taskBarIcon.setFocused(false);
        });
        windowToFocus.window.setAttribute('focused', true);
        windowToFocus.window.style.zIndex = highestZIndex + 1;
        windowToFocus.taskBarIcon.setFocused(true);
    }
}

function typewriterEffect(element) {
    if (element.classList.contains('typewriting')) {
        return;
    }
    element.classList.add('typewriting');
    
    const text = element.textContent;
    element.textContent = '';
    let index = 0;

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, 500 / text.length);
        } else {
            element.classList.remove('typewriting');
        }
    }

    type();
}
