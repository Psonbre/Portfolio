window.onload = function() {
    const icons = document.querySelectorAll('.floatingIcon');
    const container = document.querySelector('.networkContainer');
    const linesMap = new Map();

    function updateLines() {
        const connectedPairs = new Set();

        icons.forEach((iconA, index) => {
            icons.forEach((iconB, index2) => {
                if (index !== index2) {
                    const pairKey = [index, index2].sort().join('-');
                    if (connectedPairs.has(pairKey)) return;
                    connectedPairs.add(pairKey);

                    const iconAPos = iconA.querySelector('img').getBoundingClientRect();
                    const iconBPos = iconB.querySelector('img').getBoundingClientRect();
                    const containerPos = container.getBoundingClientRect();

                    const x1 = iconAPos.left + iconAPos.width / 2 - containerPos.left;
                    const y1 = iconAPos.top + iconAPos.height / 2 - containerPos.top;
                    const x2 = iconBPos.left + iconBPos.width / 2 - containerPos.left;
                    const y2 = iconBPos.top + iconBPos.height / 2 - containerPos.top;

                    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
                    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

                    let line;
                    if (linesMap.has(pairKey)) {
                        line = linesMap.get(pairKey);
                    } else {
                        line = document.createElement('div');
                        line.className = 'connection';
                        line.style.zIndex = -1;
                        line.style.position = "absolute";
                        container.appendChild(line);
                        linesMap.set(pairKey, line);
                    }

                    line.style.width = 4 - (length / Math.max(container.clientWidth / 1, container.clientHeight / 1)) + "px";
                    line.style.height = length + 'px';
                    line.style.backgroundColor = 'lime';
                    line.style.top = y1 + 'px';
                    line.style.left = x1 + 'px';
                    line.style.transform = `rotate(${angle - 90}deg)`;
                    line.style.transformOrigin = '0 0';
                    line.style.opacity = 1 - (length / Math.max(container.clientWidth / 2, container.clientHeight / 2));
                }
            });
        });

        // Remove lines that are no longer needed
        linesMap.forEach((line, pairKey) => {
            if (!connectedPairs.has(pairKey)) {
                line.remove();
                linesMap.delete(pairKey);
            }
        });
    }

    function animate() {
        updateLines();
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
    window.addEventListener('resize', updateLines);
};
