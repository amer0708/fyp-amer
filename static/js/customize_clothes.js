console.log('JavaScript is loaded and running');

document.addEventListener('DOMContentLoaded', function() {
    // State management
    const state = {
        colors: {
            body: '#ffffff',
            sleeves: '#ffffff',
            collar: '#ff0000',
            sleeveBand: '#00ff00',
            button: '#ff00ff',
            buttonLine: '#0000ff'
        },
        designElements: [],
        activeElementId: null,
        dragging: false,
        offset: { x: 0, y: 0 },
        currentView: 'front',
        placementAreas: {
            front: {
                minX: 90,
                maxX: 210,
                minY: 100,
                maxY: 300
            },
            back: {
                minX: 90,
                maxX: 210,
                minY: 100,
                maxY: 300
            },
            'left-shoulder': {
                minX: 120,
                maxX: 180,
                minY: 100,
                maxY: 300
            },
            'right-shoulder': {
                minX: 120,
                maxX: 180,
                minY: 100,
                maxY: 300
            }
        },
        textDefaults: {
            content: 'Enter Text',
            color: '#000000',
            fontSize: 16,
            fontFamily: 'Arial, sans-serif',
            maxLength: 20
        },
        pockets: {
            left: false,
            right: false
        }
    };

    // DOM Elements
    const shirtBodyElements = {
        front: document.querySelectorAll('.shirt-svg[data-view="front"] .shirt-body'),
        back: document.querySelectorAll('.shirt-svg[data-view="back"] .shirt-body'),
        'left-shoulder': document.querySelectorAll('.shirt-svg[data-view="left-shoulder"] .shirt-body'),
        'right-shoulder': document.querySelectorAll('.shirt-svg[data-view="right-shoulder"] .shirt-body')
    };
    
    const sleeveElements = {
        front: document.querySelectorAll('.shirt-svg[data-view="front"] .sleeve'),
        back: document.querySelectorAll('.shirt-svg[data-view="back"] .sleeve'),
        'left-shoulder': document.querySelectorAll('.shirt-svg[data-view="left-shoulder"] .sleeve'),
        'right-shoulder': document.querySelectorAll('.shirt-svg[data-view="right-shoulder"] .sleeve')
    };
    
    const collarElements = {
        front: document.querySelectorAll('.shirt-svg[data-view="front"] .collar'),
        back: document.querySelectorAll('.shirt-svg[data-view="back"] .collar'),
        'left-shoulder': document.querySelectorAll('.shirt-svg[data-view="left-shoulder"] .collar'),
        'right-shoulder': document.querySelectorAll('.shirt-svg[data-view="right-shoulder"] .collar')
    };
    
    const sleeveBandElements = {
        front: document.querySelectorAll('.shirt-svg[data-view="front"] .sleeveband'),
        back: document.querySelectorAll('.shirt-svg[data-view="back"] .sleeveband'),
        'left-shoulder': document.querySelectorAll('.shirt-svg[data-view="left-shoulder"] .sleeveband'),
        'right-shoulder': document.querySelectorAll('.shirt-svg[data-view="right-shoulder"] .sleeveband')
    };
    
    const buttonElements = {
        front: document.querySelectorAll('.shirt-svg[data-view="front"] .button'),
        back: document.querySelectorAll('.shirt-svg[data-view="back"] .button'),
        'left-shoulder': document.querySelectorAll('.shirt-svg[data-view="left-shoulder"] .button'),
        'right-shoulder': document.querySelectorAll('.shirt-svg[data-view="right-shoulder"] .button')
    };
    
    const buttonLineElements = {
        front: document.querySelectorAll('.shirt-svg[data-view="front"] .buttonline'),
        back: document.querySelectorAll('.shirt-svg[data-view="back"] .buttonline'),
        'left-shoulder': document.querySelectorAll('.shirt-svg[data-view="left-shoulder"] .buttonline'),
        'right-shoulder': document.querySelectorAll('.shirt-svg[data-view="right-shoulder"] .buttonline')
    };
    
    const bodyColorButtons = document.querySelectorAll('#body-colors .color-btn');
    const sleeveColorButtons = document.querySelectorAll('#sleeve-colors .color-btn');
    const buttonColorButtons = document.querySelectorAll('#button-colors .color-btn');
    const buttonLineColorButtons = document.querySelectorAll('#button-line-colors .color-btn');
    const collarColorButtons = document.querySelectorAll('#collar-colors .color-btn');
    const sleeveBandColorButtons = document.querySelectorAll('#sleeve-band-colors .color-btn');
    const designImageUploadInput = document.getElementById('design-image-upload');
    const designImageUploadArea = document.getElementById('design-image-upload-area');
    const designElementsContainer = document.getElementById('design-elements-container');
    const currentViewDisplay = document.getElementById('current-view-display');
    const addTextBtn = document.getElementById('add-text-btn');
    const bodyColorSwatch = document.getElementById('body-color-swatch');
    const sleeveColorSwatch = document.getElementById('sleeve-color-swatch');
    const collarColorSwatch = document.getElementById('collar-color-swatch');
    const sleeveBandColorSwatch = document.getElementById('sleeve-band-color-swatch');
    const buttonColorSwatch = document.getElementById('button-color-swatch');
    const buttonLineColorSwatch = document.getElementById('button-line-color-swatch');
    const leftPocketCheckbox = document.getElementById('leftPocket');
    const rightPocketCheckbox = document.getElementById('rightPocket');
    const pocketsSummary = document.getElementById('pockets-summary');
    const downloadBtn = document.getElementById('downloadBtn');

    // Initialize UI
    initializeUI();

    // Event Listeners
    if (bodyColorButtons) {
        bodyColorButtons.forEach(button => {
            button.addEventListener('click', () => setBodyColor(button.dataset.color));
        });
    }

    if (sleeveColorButtons) {
        sleeveColorButtons.forEach(button => {
            button.addEventListener('click', () => setSleeveColor(button.dataset.color));
        });
    }

    if (buttonColorButtons) {
        buttonColorButtons.forEach(button => {
            button.addEventListener('click', () => setButtonColor(button.dataset.color));
        });
    }

    if (buttonLineColorButtons) {
        buttonLineColorButtons.forEach(button => {
            button.addEventListener('click', () => setButtonLineColor(button.dataset.color));
        });
    }

    if (collarColorButtons) {
        collarColorButtons.forEach(button => {
            button.addEventListener('click', () => setCollarColor(button.dataset.color));
        });
    }

    if (sleeveBandColorButtons) {
        sleeveBandColorButtons.forEach(button => {
            button.addEventListener('click', () => setSleeveBandColor(button.dataset.color));
        });
    }

    designImageUploadArea.addEventListener('click', () => {
        designImageUploadInput.click();
    });

    designImageUploadInput.addEventListener('change', handleDesignImageUpload);
    addTextBtn.addEventListener('click', addTextToDesign);

    // Add view button event listeners
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', function() {
            switchView(this.dataset.view);
        });
    });

    // Pocket event listeners
    leftPocketCheckbox.addEventListener('change', updatePockets);
    rightPocketCheckbox.addEventListener('change', updatePockets);

    // Download button event listener
    downloadBtn.addEventListener('click', downloadDesign);

    // Add mouse/touch event listeners to all SVGs
    document.querySelectorAll('.shirt-svg').forEach(svg => {
        svg.addEventListener('mousedown', handleSvgMouseDown);
        svg.addEventListener('touchstart', handleSvgTouchStart, { passive: false });
    });

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleSvgTouchMove, { passive: false });
    document.addEventListener('touchend', handleSvgTouchEnd);

    // UI Initialization
    function initializeUI() {
        setBodyColor('#ffffff');
        setSleeveColor('#ffffff');
        setCollarColor('#ffffff');
        setSleeveBandColor('#ffffff');
        setButtonColor('#ffffff');
        setButtonLineColor('#ffffff');
        updateColorSwatches();
        switchView('front');
        updatePockets();
    }

    function setBodyColor(color) {
        state.colors.body = color;
        Object.values(shirtBodyElements).forEach(elements => {
            if (elements) {
                elements.forEach(el => {
                    // Set the fill attribute
                    el.setAttribute('fill', color);
                    // Also update the style attribute if it exists
                    const currentStyle = el.getAttribute('style');
                    if (currentStyle) {
                        const updatedStyle = currentStyle.replace(/fill:[^;]+;?/g, '');
                        el.setAttribute('style', updatedStyle + `fill:${color};`);
                    }
                });
            }
        });
        if (bodyColorButtons) {
            bodyColorButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.color === color));
        }
        updateColorSwatches();
        // Remove or comment out this block to prevent pocket color from being updated
        // document.querySelectorAll('.pocket').forEach(pocket => {
        //     pocket.setAttribute('fill', color);
        // });
    }

    function setSleeveColor(color) {
        state.colors.sleeves = color;
        Object.values(sleeveElements).forEach(sleeves => {
            if (sleeves) sleeves.forEach(sleeve => {
                // Set the fill attribute
                sleeve.setAttribute('fill', color);
                // Also update the style attribute if it exists
                const currentStyle = sleeve.getAttribute('style');
                if (currentStyle) {
                    const updatedStyle = currentStyle.replace(/fill:[^;]+;?/g, '');
                    sleeve.setAttribute('style', updatedStyle + `fill:${color};`);
                }
            });
        });
        if (sleeveColorButtons) {
            sleeveColorButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.color === color));
        }
        updateColorSwatches();
    }
    function setSleeveBandColor(color) {
        state.colors.sleeveBand = color;
        Object.values(sleeveBandElements).forEach(elements => {
            if (elements) {
                elements.forEach(el => {
                    // Set the fill attribute
                    el.setAttribute('fill', color);
                    // Also update the style attribute if it exists
                    const currentStyle = el.getAttribute('style');
                    if (currentStyle) {
                        const updatedStyle = currentStyle.replace(/fill:[^;]+;?/g, '');
                        el.setAttribute('style', updatedStyle + `fill:${color};`);
                    }
                });
            }
        });
        if (sleeveBandColorButtons) {
            sleeveBandColorButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.color === color));
        }
        updateColorSwatches();
    }

    function setCollarColor(color) {
        state.colors.collar = color;
        Object.values(collarElements).forEach(elements => {
            if (elements) {
                elements.forEach(el => {
                    // Set the fill attribute
                    el.setAttribute('fill', color);
                    // Also update the style attribute if it exists
                    const currentStyle = el.getAttribute('style');
                    if (currentStyle) {
                        const updatedStyle = currentStyle.replace(/fill:[^;]+;?/g, '');
                        el.setAttribute('style', updatedStyle + `fill:${color};`);
                    }
                });
            }
        });
        if (collarColorButtons) {
            collarColorButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.color === color));
        }
        updateColorSwatches();
    }

    function setButtonColor(color) {
        state.colors.button = color;
        Object.values(buttonElements).forEach(elements => {
            if (elements) {
                elements.forEach(el => {
                    // Set the fill attribute
                    el.setAttribute('fill', color);
                    // Also update the style attribute if it exists
                    const currentStyle = el.getAttribute('style');
                    if (currentStyle) {
                        const updatedStyle = currentStyle.replace(/fill:[^;]+;?/g, '');
                        el.setAttribute('style', updatedStyle + `fill:${color};`);
                    }
                });
            }
        });
        if (buttonColorButtons) {
            buttonColorButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.color === color));
        }
        updateColorSwatches();
    }

    function setButtonLineColor(color) {
        state.colors.buttonLine = color;
        Object.values(buttonLineElements).forEach(elements => {
            if (elements) {
                elements.forEach(el => {
                    // Set the fill attribute
                    el.setAttribute('fill', color);
                    // Also update the style attribute if it exists
                    const currentStyle = el.getAttribute('style');
                    if (currentStyle) {
                        const updatedStyle = currentStyle.replace(/fill:[^;]+;?/g, '');
                        el.setAttribute('style', updatedStyle + `fill:${color};`);
                    }
                });
            }
        });
        if (buttonLineColorButtons) {
            buttonLineColorButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.color === color));
        }
        updateColorSwatches();
    }
    function updateColorSwatches() {
        if (bodyColorSwatch) bodyColorSwatch.style.backgroundColor = state.colors.body;
        if (sleeveColorSwatch) sleeveColorSwatch.style.backgroundColor = state.colors.sleeves;
        if (collarColorSwatch) collarColorSwatch.style.backgroundColor = state.colors.collar;
        if (sleeveBandColorSwatch) sleeveBandColorSwatch.style.backgroundColor = state.colors.sleeveBand;
        if (buttonColorSwatch) buttonColorSwatch.style.backgroundColor = state.colors.button;
        if (buttonLineColorSwatch) buttonLineColorSwatch.style.backgroundColor = state.colors.buttonLine;
    }

    function switchView(view) {
        state.currentView = view;
        currentViewDisplay.textContent = view.charAt(0).toUpperCase() + view.slice(1).replace('-', ' ');
        
        // Update active button
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        // Show/hide views
        document.querySelectorAll('.shirt-view').forEach(viewEl => {
            viewEl.classList.toggle('active', viewEl.dataset.view === view);
        });
        
        // Re-render design elements for this view
        renderDesignElements();

        // Update pockets visibility based on view
        updatePocketVisibility();
    }

    function updatePockets() {
        state.pockets.left = leftPocketCheckbox.checked;
        state.pockets.right = rightPocketCheckbox.checked;

        // Update summary
        let pocketText = [];
        if (state.pockets.left) pocketText.push('Left');
        if (state.pockets.right) pocketText.push('Right');
        pocketsSummary.textContent = pocketText.length ? pocketText.join(' and ') : 'None selected';

        // Update pocket visibility
        updatePocketVisibility();
    }

    function updatePocketVisibility() {
        // Remove existing pockets
        document.querySelectorAll('.pocket').forEach(pocket => pocket.remove());

        // Only show pockets in front view
        if (state.currentView === 'front') {
            const svg = document.querySelector('.shirt-svg[data-view="front"]');
            
            if (state.pockets.left) {
                addPocket(svg, 'left');
            }
            if (state.pockets.right) {
                addPocket(svg, 'right');
            }
        }
    }

    function addPocket(svg, side) {
        // Pocket outline path (no fill)
        const pocket = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pocket.classList.add('pocket');
        // Pocket size
        const width = 60;
        const height = 60;
        const pointHeight = 75;
        // Position for left and right pockets
        const xOffset = side === 'left' ? 280 :160;
        const yOffset = 195;
        // The pocket path, shifted by xOffset/yOffset
        const pocketPath = `M${xOffset} ${yOffset} H${xOffset+width} V${yOffset+height} L${xOffset+width/2} ${yOffset+pointHeight} L${xOffset} ${yOffset+height} Z`;
        pocket.setAttribute('d', pocketPath);
        pocket.setAttribute('fill', 'none');
        pocket.setAttribute('stroke', '#000000');
        pocket.setAttribute('stroke-width', '2');
        svg.appendChild(pocket);
    }

    // Design Image Handling
    function handleDesignImageUpload(event) {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageId = 'img-' + Date.now() + Math.random().toString(36).substr(2, 9);
                const imageData = {
                    id: imageId,
                    type: 'image',
                    dataUrl: e.target.result,
                    x: 150,
                    y: 150,
                    width: 50,
                    height: 50,
                    view: state.currentView
                };

                state.designElements.push(imageData);
                addElementToSvg(imageData);
                renderDesignElements();
            };
            reader.readAsDataURL(file);
        });
        designImageUploadInput.value = '';
    }

    function addElementToSvg(elementData) {
        const currentSvg = document.querySelector(`.shirt-svg[data-view="${elementData.view}"]`);
        if (!currentSvg) return;
        
        const draggableContainer = currentSvg.querySelector('.draggable-images');
        if (!draggableContainer) return;

        if (elementData.type === 'image') {
            const imageGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            imageGroup.setAttribute('id', elementData.id);
            imageGroup.setAttribute('class', 'draggable-image');
            imageGroup.setAttribute('transform', `translate(${elementData.x}, ${elementData.y})`);

            // Add transparent rectangle for dragging
            const dragArea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            dragArea.setAttribute('width', elementData.width);
            dragArea.setAttribute('height', elementData.height);
            dragArea.setAttribute('fill', 'transparent');
            dragArea.setAttribute('pointer-events', 'all');

            // Add image element
            const imageElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
            imageElement.setAttribute('href', elementData.dataUrl);
            imageElement.setAttribute('width', elementData.width);
            imageElement.setAttribute('height', elementData.height);
            imageElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            imageElement.setAttribute('pointer-events', 'none');

            imageGroup.appendChild(dragArea);
            imageGroup.appendChild(imageElement);
            draggableContainer.appendChild(imageGroup);
        } else if (elementData.type === 'text') {
            const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            textGroup.setAttribute('id', elementData.id);
            textGroup.setAttribute('class', 'draggable-text');
            textGroup.setAttribute('transform', `translate(${elementData.x}, ${elementData.y})`);

            // Create text element
            const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            textElement.setAttribute('fill', elementData.color);
            textElement.setAttribute('font-size', elementData.fontSize);
            textElement.setAttribute('font-family', elementData.fontFamily);
            textElement.setAttribute('text-anchor', 'middle');
            textElement.setAttribute('dominant-baseline', 'middle');
            textElement.textContent = elementData.content;

            textGroup.appendChild(textElement);
            draggableContainer.appendChild(textGroup);

            // Store dimensions after rendering
            const bbox = textElement.getBBox();
            elementData.width = bbox.width;
            elementData.height = bbox.height;
        }
        setActiveElement(elementData.id);
    }

    // Text Functions
    function addTextToDesign() {
        const textId = 'text-' + Date.now() + Math.random().toString(36).substr(2, 9);
        const textData = {
            id: textId,
            type: 'text',
            content: state.textDefaults.content,
            color: state.textDefaults.color,
            fontSize: state.textDefaults.fontSize,
            fontFamily: state.textDefaults.fontFamily,
            x: 150,
            y: 150,
            view: state.currentView
        };

        state.designElements.push(textData);
        addElementToSvg(textData);
        renderDesignElements();
        openTextEditor(textId);
    }

    function openTextEditor(elementId) {
        const element = state.designElements.find(el => el.id === elementId);
        if (!element || element.type !== 'text') return;

        const newContent = prompt('Enter text (max 20 chars):', element.content);
        if (newContent !== null) {
            element.content = newContent.substring(0, state.textDefaults.maxLength);
            updateTextElement(element);
            renderDesignElements();
        }
    }

    function updateTextElement(textData) {
        const textElement = document.querySelector(`#${textData.id} text`);
        if (textElement) {
            textElement.textContent = textData.content;
            const bbox = textElement.getBBox();
            textData.width = bbox.width;
            textData.height = bbox.height;
        }
    }

    function renderDesignElements() {
        designElementsContainer.innerHTML = '';
        
        const elementsForCurrentView = state.designElements.filter(el => el.view === state.currentView);
        
        elementsForCurrentView.forEach((element, index) => {
            const elementDiv = document.createElement('div');
            elementDiv.className = `design-element-item ${state.activeElementId === element.id ? 'active' : ''}`;
            
            if (element.type === 'image') {
                elementDiv.innerHTML = `
                    <div class="element-details">
                        <img src="${element.dataUrl}" alt="Design Image" class="design-image-thumbnail">
                        <span>Image ${index + 1}</span>
                    </div>
                    <div class="element-controls">
                        <button class="element-control-btn select-btn" data-id="${element.id}">Select</button>
                        <button class="element-control-btn remove-btn" data-id="${element.id}">Remove</button>
                    </div>
                `;
            } else if (element.type === 'text') {
                elementDiv.innerHTML = `
                    <div class="element-details">
                        <div class="text-thumbnail">${element.content.charAt(0)}</div>
                        <span>${element.content}</span>
                    </div>
                    <div class="element-controls">
                        <button class="element-control-btn select-btn" data-id="${element.id}">Select</button>
                        <button class="element-control-btn edit-btn" data-id="${element.id}">Edit</button>
                        <button class="element-control-btn remove-btn" data-id="${element.id}">Remove</button>
                    </div>
                `;
            }

            designElementsContainer.appendChild(elementDiv);
        });

        // Add event listeners
        document.querySelectorAll('.select-btn').forEach(button => {
            button.addEventListener('click', function() {
                setActiveElement(this.dataset.id);
            });
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function() {
                openTextEditor(this.dataset.id);
            });
        });

        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', function() {
                removeDesignElement(this.dataset.id);
            });
        });
    }

    function setActiveElement(elementId) {
        document.querySelectorAll('.design-element-item').forEach(item => {
            item.classList.toggle('active', item.querySelector('.select-btn')?.dataset.id === elementId);
        });
        
        document.querySelectorAll('.draggable-image, .draggable-text').forEach(el => {
            el.classList.toggle('active', el.id === elementId);
        });

        state.activeElementId = elementId;
    }

    function removeDesignElement(elementId) {
        const element = state.designElements.find(el => el.id === elementId);
        if (element) {
            const svgElement = document.querySelector(`.shirt-svg[data-view="${element.view}"] #${elementId}`);
            if (svgElement) {
                svgElement.remove();
            }
        }
        
        state.designElements = state.designElements.filter(el => el.id !== elementId);
        renderDesignElements();
        
        if (state.activeElementId === elementId) {
            state.activeElementId = null;
        }
    }

    function handleSvgMouseDown(event) {
        const target = event.target;
        const isDraggable = target.classList.contains('draggable-text') || 
                          target.classList.contains('draggable-image') ||
                          (target.parentNode && (
                              target.parentNode.classList.contains('draggable-text') || 
                              target.parentNode.classList.contains('draggable-image')
                          ));

        if (!isDraggable) return;

        let targetElement = target;
        while (targetElement && !targetElement.classList.contains('draggable-text') && !targetElement.classList.contains('draggable-image')) {
            targetElement = targetElement.parentNode;
        }

        if (!targetElement) return;

        setActiveElement(targetElement.id);
        state.dragging = true;

        const transform = targetElement.getAttribute('transform');
        const match = transform.match(/translate\(([\d.]+),\s*([\d.]+)\)/);
        if (!match) return;

        const currentX = parseFloat(match[1]);
        const currentY = parseFloat(match[2]);

        const svg = targetElement.closest('.shirt-svg');
        const svgRect = svg.getBoundingClientRect();
        const point = svg.createSVGPoint();
        point.x = event.clientX - svgRect.left;
        point.y = event.clientY - svgRect.top;
        const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());

        state.offset = {
            x: svgPoint.x - currentX,
            y: svgPoint.y - currentY
        };

        targetElement.classList.add('dragging');
    }

    function handleMouseMove(event) {
        if (!state.dragging || !state.activeElementId) return;
        event.preventDefault();

        const element = document.getElementById(state.activeElementId);
        if (!element) return;

        const elementData = state.designElements.find(el => el.id === state.activeElementId);
        if (!elementData) return;

        // Get SVG coordinates
        const svg = element.closest('.shirt-svg');
        const svgRect = svg.getBoundingClientRect();
        const point = svg.createSVGPoint();
        point.x = event.clientX - svgRect.left;
        point.y = event.clientY - svgRect.top;
        const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());

        // Calculate boundaries
        const area = state.placementAreas[elementData.view];
        let width = elementData.width || 0;
        let height = elementData.height || 0;

        // Extra padding for text to ensure it stays fully visible
        const paddingX = elementData.type === 'text' ? width/2 : 0;
        const paddingY = elementData.type === 'text' ? height/2 : 0;
        
        const newX = Math.max(area.minX + paddingX, Math.min(
            svgPoint.x - state.offset.x, 
            area.maxX - paddingX
        ));
        const newY = Math.max(area.minY + paddingY, Math.min(
            svgPoint.y - state.offset.y, 
            area.maxY - paddingY
        ));

        element.setAttribute('transform', `translate(${newX}, ${newY})`);
        elementData.x = newX;
        elementData.y = newY;
    }

    function handleMouseUp() {
        if (state.dragging && state.activeElementId) {
            const element = document.getElementById(state.activeElementId);
            if (element) {
                element.classList.remove('dragging');
            }
        }
        state.dragging = false;
    }

    function handleSvgTouchStart(event) {
        if (event.touches.length !== 1) return;
        event.preventDefault();

        const touch = event.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY,
            bubbles: true
        });
        event.target.dispatchEvent(mouseEvent);
    }

    function handleSvgTouchMove(event) {
        if (event.touches.length !== 1 || !state.dragging) return;
        event.preventDefault();

        const touch = event.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY,
            bubbles: true
        });
        document.dispatchEvent(mouseEvent);
    }

    function handleSvgTouchEnd() {
        if (!state.dragging) return;
        const mouseEvent = new MouseEvent('mouseup', { bubbles: true });
        document.dispatchEvent(mouseEvent);
    }

    function downloadDesign() {
        // Create a new SVG element that will contain all views
        const combinedSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const viewWidth = 500; // Use 500px for each view
        const viewHeight = 600; // Restore original height
        combinedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        combinedSvg.setAttribute('viewBox', `0 0 ${viewWidth * 4} ${viewHeight}`); // Width to accommodate all 4 views side by side

        // Get all views
        const views = ['front', 'back', 'left-shoulder', 'right-shoulder'];
        
        views.forEach((view, index) => {
            // Get the original SVG for this view
            const viewContainer = document.querySelector(`.shirt-view[data-view="${view}"]`);
            if (!viewContainer) return;
            
            const originalSvg = viewContainer.querySelector('svg');
            if (!originalSvg) return;

            // Create a group for this view
            const viewGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            viewGroup.setAttribute('transform', `translate(${index * viewWidth}, 0)`);

            // Clone the contents of the original SVG and clean them
            const contents = originalSvg.cloneNode(true);
            Array.from(contents.children).forEach(child => {
                const cleanedChild = cleanSvgElement(child.cloneNode(true));
                if (cleanedChild !== null) {
                    viewGroup.appendChild(cleanedChild);
                }
            });

            // Add view label
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', (viewWidth / 2).toString());
            text.setAttribute('y', (viewHeight + 40).toString());
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('font-family', 'Arial');
            text.setAttribute('font-size', '18');
            text.textContent = view.charAt(0).toUpperCase() + view.slice(1).replace('-', ' ');
            viewGroup.appendChild(text);

            combinedSvg.appendChild(viewGroup);
        });

        // Add this function to fix malformed path attributes
        function fixMalformedPaths(svgElement) {
            svgElement.querySelectorAll('path').forEach(el => {
                // Only allow valid SVG attributes
                Array.from(el.attributes).forEach(attr => {
                    if (!['d', 'fill', 'stroke', 'stroke-width', 'id', 'class', 'style'].includes(attr.name)) {
                        el.removeAttribute(attr.name);
                    }
                });
                // If fill contains a semicolon, keep only the color
                let fill = el.getAttribute('fill');
                if (fill && fill.includes(';')) {
                    el.setAttribute('fill', fill.split(';')[0]);
                }
                // If style attribute is present and malformed, remove it
                let style = el.getAttribute('style');
                if (style && /[;:][^;:]*[;:]/.test(style) && !style.includes(':')) {
                    el.removeAttribute('style');
                }
            });
        }

        // After combining all views into combinedSvg
        fixMalformedPaths(combinedSvg);

        // Convert SVG to string
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(combinedSvg);
        
        // Create Blob and URL
        const blob = new Blob([svgString], {type: 'image/svg+xml'});
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.download = 'shirt-design-all-views.svg';
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        URL.revokeObjectURL(url);
    }

    function cleanSvgElement(element) {
        // Remove sodipodi:namedview elements entirely (they contain problematic attributes)
        if (element.tagName === 'sodipodi:namedview') {
            return null; // This will remove the element
        }

        // Remove Inkscape and Sodipodi attributes
        const inkscapeAttrs = [
            'inkscape:version', 'inkscape:showpageshadow', 'inkscape:pageopacity',
            'inkscape:pagecheckerboard', 'inkscape:deskcolor', 'inkscape:zoom',
            'inkscape:cx', 'inkscape:cy', 'inkscape:window-width', 'inkscape:window-height',
            'inkscape:window-x', 'inkscape:window-y', 'inkscape:window-maximized',
            'inkscape:current-layer', 'sodipodi:docname', 'sodipodi:nodetypes',
            'inkscape:groupmode', 'inkscape:label'
        ];
        
        inkscapeAttrs.forEach(attr => {
            if (element.hasAttribute(attr)) {
                element.removeAttribute(attr);
            }
        });

        // Remove Inkscape and Sodipodi namespaces from the element
        if (element.hasAttribute('xmlns:inkscape')) {
            element.removeAttribute('xmlns:inkscape');
        }
        if (element.hasAttribute('xmlns:sodipodi')) {
            element.removeAttribute('xmlns:sodipodi');
        }

        // Recursively clean child elements
        const children = Array.from(element.children);
        children.forEach(child => {
            const cleanedChild = cleanSvgElement(child);
            if (cleanedChild === null) {
                element.removeChild(child);
            }
        });

        return element;
    }
});