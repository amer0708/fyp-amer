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
                maxY: 300,
                leftImage: false,
                rightImage: false,
                leftText: false
            },
            back: {
                minX: 90,
                maxX: 210,
                minY: 100,
                maxY: 300,
                image: false,
                text: false
            },
            'left-shoulder': {
                minX: 120,
                maxX: 180,
                minY: 100,
                maxY: 300,
                image: false,
                text: false
            },
            'right-shoulder': {
                minX: 120,
                maxX: 180,
                minY: 100,
                maxY: 300,
                image: false,
                text: false
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
    window.state = state;

    // === Default positions for design elements ===
    const DEFAULT_POSITIONS = {
        front: {
            leftImage:  { x: 285, y: 130 },
            rightImage: { x: 163, y: 130 },
            text:       { x: 190, y: 195 }
        },
        back:     { image: { x: 217, y: 125 }, text: { x: 240, y: 190 } },
        'left-shoulder':  { image: { x: 230, y: 170 }, text: { x: 255, y: 255 } },
        'right-shoulder': { image: { x: 210, y: 170 }, text: { x: 240, y: 250 } }
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
    const previewBtn = document.getElementById('previewBtn');
    const modal = document.getElementById('previewModal');
    const closeModal = document.querySelector('.close-modal');
    const previewContainer = document.getElementById('previewContainer');

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

    // View buttons
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', function() {
            switchView(this.dataset.view);
        });
    });

    // Pocket checkboxes
    leftPocketCheckbox.addEventListener('change', updatePockets);
    rightPocketCheckbox.addEventListener('change', updatePockets);

    // Download button
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadDesign);
    }

    // Preview button
    if (previewBtn) {
        previewBtn.addEventListener('click', showDesignPreview);
    }

    // Modal close button
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Drag and drop events (REMOVE ALL DRAGGABLE FUNCTIONALITY)
    // document.querySelectorAll('.shirt-svg').forEach(svg => {
    //     svg.addEventListener('mousedown', ...);
    //     svg.addEventListener('touchstart', ...);
    // });
    // document.addEventListener('mousemove', handleMouseMove);
    // document.addEventListener('mouseup', handleMouseUp);
    // document.addEventListener('touchmove', handleSvgTouchMove, { passive: false });
    // document.addEventListener('touchend', handleSvgTouchEnd);
    // Remove handleSvgMouseDown, handleMouseMove, handleMouseUp, handleSvgTouchStart, handleSvgTouchMove, handleSvgTouchEnd functions if not used elsewhere.

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

    // Color setting functions
    function setBodyColor(color) {
        state.colors.body = color;
        Object.values(shirtBodyElements).forEach(elements => {
            if (elements) {
                elements.forEach(el => {
                    el.setAttribute('fill', color);
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
    }

    function setSleeveColor(color) {
        state.colors.sleeves = color;
        Object.values(sleeveElements).forEach(sleeves => {
            if (sleeves) sleeves.forEach(sleeve => {
                sleeve.setAttribute('fill', color);
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
                    el.setAttribute('fill', color);
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
                    el.setAttribute('fill', color);
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
                    el.setAttribute('fill', color);
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
                    el.setAttribute('fill', color);
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
        
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        document.querySelectorAll('.shirt-view').forEach(viewEl => {
            viewEl.classList.toggle('active', viewEl.dataset.view === view);
        });
        
        renderDesignElements();
        updatePocketVisibility();
        updateAddElementButtonStates();
    }

    function updateAddElementButtonStates() {
        const currentViewState = state.placementAreas[state.currentView];
        const addTextBtn = document.getElementById('add-text-btn');
        
        if (state.currentView === 'front') {
            addTextBtn.disabled = currentViewState.leftText;
            designImageUploadArea.style.opacity = (currentViewState.leftImage && currentViewState.rightImage) ? '0.5' : '1';
        } else {
            addTextBtn.disabled = currentViewState.text;
            designImageUploadArea.style.opacity = currentViewState.image ? '0.5' : '1';
        }
    }

    function updatePockets() {
        state.pockets.left = leftPocketCheckbox.checked;
        state.pockets.right = rightPocketCheckbox.checked;

        let pocketText = [];
        if (state.pockets.left) pocketText.push('Left');
        if (state.pockets.right) pocketText.push('Right');
        pocketsSummary.textContent = pocketText.length ? pocketText.join(' and ') : 'None selected';

        updatePocketVisibility();
    }

    function updatePocketVisibility() {
        document.querySelectorAll('.pocket').forEach(pocket => pocket.remove());

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
        const pocket = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pocket.classList.add('pocket');
        const width = 60;
        const height = 60;
        const pointHeight = 75;
        const xOffset = side === 'left' ? 280 : 160;
        const yOffset = 205;
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

        const currentViewState = state.placementAreas[state.currentView];
        
        // Check if we can add more images to this view
        if (state.currentView === 'front') {
            if (currentViewState.leftImage && currentViewState.rightImage) {
                alert('Front view can only have 2 images (one on left and one on right)');
                // Clear the input immediately and reset it
                designImageUploadInput.value = '';
                // Reset the input by cloning and replacing it
                const newInput = designImageUploadInput.cloneNode(true);
                designImageUploadInput.parentNode.replaceChild(newInput, designImageUploadInput);
                // Re-add the event listener to the new input
                newInput.addEventListener('change', handleDesignImageUpload);
                // Update the reference
                window.designImageUploadInput = newInput;
                return;
            }
        } else {
            if (currentViewState.image) {
                alert('This view can only have 1 image');
                // Clear the input immediately and reset it
                designImageUploadInput.value = '';
                // Reset the input by cloning and replacing it
                const newInput = designImageUploadInput.cloneNode(true);
                designImageUploadInput.parentNode.replaceChild(newInput, designImageUploadInput);
                // Re-add the event listener to the new input
                newInput.addEventListener('change', handleDesignImageUpload);
                // Update the reference
                window.designImageUploadInput = newInput;
                return;
            }
        }

        const file = files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageId = 'img-' + Date.now() + Math.random().toString(36).substr(2, 9);
            const imageData = {
                id: imageId,
                type: 'image',
                dataUrl: e.target.result,
                x: 200,
                y: 150,
                width: 50,
                height: 50,
                view: state.currentView
            };

            // For front view, determine if this is left or right image
            if (state.currentView === 'front') {
                if (!currentViewState.leftImage) {
                    imageData.position = 'left';
                    state.placementAreas.front.leftImage = true;
                } else if (!currentViewState.rightImage) {
                    imageData.position = 'right';
                    state.placementAreas.front.rightImage = true;
                }
            } else {
                state.placementAreas[state.currentView].image = true;
            }

            state.designElements.push(imageData);
            addElementToSvg(imageData);
            renderDesignElements();
            updateAddElementButtonStates();
        };
        reader.readAsDataURL(file);
        designImageUploadInput.value = '';
    }

    function addElementToSvg(elementData) {
        const currentSvg = document.querySelector(`.shirt-svg[data-view="${elementData.view}"]`);
        if (!currentSvg) return;
        
        const draggableContainer = currentSvg.querySelector('.draggable-images');
        if (!draggableContainer) return;

        if (elementData.type === 'image') {
            // Set default position for each view
            if (elementData.view === 'front' && elementData.position) {
                if (elementData.position === 'left' && DEFAULT_POSITIONS.front.leftImage) {
                    elementData.x = DEFAULT_POSITIONS.front.leftImage.x;
                    elementData.y = DEFAULT_POSITIONS.front.leftImage.y;
                } else if (elementData.position === 'right' && DEFAULT_POSITIONS.front.rightImage) {
                    elementData.x = DEFAULT_POSITIONS.front.rightImage.x;
                    elementData.y = DEFAULT_POSITIONS.front.rightImage.y;
                }
            } else if (DEFAULT_POSITIONS[elementData.view]) {
                elementData.x = DEFAULT_POSITIONS[elementData.view].image.x;
                elementData.y = DEFAULT_POSITIONS[elementData.view].image.y;
            }
            
            const imageGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            imageGroup.setAttribute('id', elementData.id);
            imageGroup.setAttribute('class', 'draggable-image');
            
            imageGroup.setAttribute('transform', `translate(${elementData.x}, ${elementData.y})`);

            const dragArea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            dragArea.setAttribute('width', elementData.width);
            dragArea.setAttribute('height', elementData.height);
            dragArea.setAttribute('fill', 'transparent');
            dragArea.setAttribute('pointer-events', 'all');

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
            // Set default position for each view
            if (DEFAULT_POSITIONS[elementData.view]) {
                elementData.x = DEFAULT_POSITIONS[elementData.view].text.x;
                elementData.y = DEFAULT_POSITIONS[elementData.view].text.y;
            }
            
            const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            textGroup.setAttribute('id', elementData.id);
            textGroup.setAttribute('class', 'draggable-text');
            
            textGroup.setAttribute('transform', `translate(${elementData.x}, ${elementData.y})`);

            const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            textElement.setAttribute('fill', elementData.color);
            textElement.setAttribute('font-size', elementData.fontSize);
            textElement.setAttribute('font-family', elementData.fontFamily);
            textElement.setAttribute('text-anchor', 'middle');
            textElement.setAttribute('dominant-baseline', 'middle');
            textElement.textContent = elementData.content;

            textGroup.appendChild(textElement);
            draggableContainer.appendChild(textGroup);

            const bbox = textElement.getBBox();
            elementData.width = bbox.width;
            elementData.height = bbox.height;
        }
        setActiveElement(elementData.id);
    }

    // Text Functions
    function addTextToDesign() {
        const currentViewState = state.placementAreas[state.currentView];
        
        // Check if we can add more text to this view
        if (state.currentView === 'front') {
            if (currentViewState.leftText) {
                alert('Front view can only have 1 text on the left side');
                return;
            }
        } else {
            if (currentViewState.text) {
                alert('This view can only have 1 text');
                return;
            }
        }

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

        // Mark text as added for this view
        if (state.currentView === 'front') {
            state.placementAreas.front.leftText = true;
        } else {
            state.placementAreas[state.currentView].text = true;
        }

        state.designElements.push(textData);
        addElementToSvg(textData);
        renderDesignElements();
        openTextEditor(textId);
        updateAddElementButtonStates();
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
                        <span>Image ${index + 1}${element.position ? ' (' + element.position + ')' : ''}</span>
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
            
            // Update placement area state
            if (element.view === 'front') {
                if (element.type === 'image') {
                    if (element.position === 'left') {
                        state.placementAreas.front.leftImage = false;
                    } else if (element.position === 'right') {
                        state.placementAreas.front.rightImage = false;
                    }
                } else if (element.type === 'text') {
                    state.placementAreas.front.leftText = false;
                }
            } else {
                if (element.type === 'image') {
                    state.placementAreas[element.view].image = false;
                } else if (element.type === 'text') {
                    state.placementAreas[element.view].text = false;
                }
            }
        }
        
        state.designElements = state.designElements.filter(el => el.id !== elementId);
        renderDesignElements();
        updateAddElementButtonStates();
        
        if (state.activeElementId === elementId) {
            state.activeElementId = null;
        }
    }

    // Download Function
    function downloadDesign() {
        const combinedSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const viewWidth = 500;
        const viewHeight = 600;
        combinedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        combinedSvg.setAttribute('viewBox', `0 0 ${viewWidth * 4} ${viewHeight}`);

        const views = ['front', 'back', 'left-shoulder', 'right-shoulder'];
        
        views.forEach((view, index) => {
            const viewContainer = document.querySelector(`.shirt-view[data-view="${view}"]`);
            if (!viewContainer) return;
            
            const originalSvg = viewContainer.querySelector('svg');
            if (!originalSvg) return;

            const viewGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            viewGroup.setAttribute('transform', `translate(${index * viewWidth}, 0)`);

            const contents = originalSvg.cloneNode(true);
            Array.from(contents.children).forEach(child => {
                const cleanedChild = cleanSvgElement(child.cloneNode(true));
                if (cleanedChild !== null) {
                    viewGroup.appendChild(cleanedChild);
                }
            });

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

        function fixMalformedPaths(svgElement) {
            svgElement.querySelectorAll('path').forEach(el => {
                Array.from(el.attributes).forEach(attr => {
                    if (!['d', 'fill', 'stroke', 'stroke-width', 'id', 'class', 'style'].includes(attr.name)) {
                        el.removeAttribute(attr.name);
                    }
                });
                let fill = el.getAttribute('fill');
                if (fill && fill.includes(';')) {
                    el.setAttribute('fill', fill.split(';')[0]);
                }
                let style = el.getAttribute('style');
                if (style && /[;:][^;:]*[;:]/.test(style) && !style.includes(':')) {
                    el.removeAttribute('style');
                }
            });
        }

        fixMalformedPaths(combinedSvg);

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(combinedSvg);
        
        const blob = new Blob([svgString], {type: 'image/svg+xml'});
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'shirt-design-all-views.svg';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }

    // Preview Function
    function showDesignPreview() {
        if (!modal || !previewContainer) return;
        const viewWidth = 500;
        const viewHeight = 600;
        const views = ['front', 'back', 'left-shoulder', 'right-shoulder'];
        const previewSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        previewSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        previewSvg.setAttribute('viewBox', `0 0 ${viewWidth * 4} ${viewHeight}`);
        views.forEach((view, index) => {
            const viewContainer = document.querySelector(`.shirt-view[data-view="${view}"]`);
            if (!viewContainer) return;
            const originalSvg = viewContainer.querySelector('svg');
            if (!originalSvg) return;
            const viewGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            viewGroup.setAttribute('transform', `translate(${index * viewWidth}, 0)`);
            // Only process element nodes
            Array.from(originalSvg.childNodes).forEach(child => {
                if (child.nodeType === 1) {
                    const cleanedChild = cleanSvgElement(child.cloneNode(true));
                    if (cleanedChild) viewGroup.appendChild(cleanedChild);
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
            previewSvg.appendChild(viewGroup);
        });
        previewContainer.innerHTML = '';
        previewContainer.appendChild(previewSvg);
        modal.style.display = 'block';
    }

    function cleanSvgElement(element) {
        if (element.tagName === 'sodipodi:namedview') {
            return null;
        }

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

        if (element.hasAttribute('xmlns:inkscape')) {
            element.removeAttribute('xmlns:inkscape');
        }
        if (element.hasAttribute('xmlns:sodipodi')) {
            element.removeAttribute('xmlns:sodipodi');
        }

        const children = Array.from(element.children);
        children.forEach(child => {
            const cleanedChild = cleanSvgElement(child);
            if (cleanedChild === null) {
                element.removeChild(child);
            }
        });

        return element;
    }
    // Modify the prepareOrderSubmission function
function prepareOrderSubmission() {
    // Collect all design data
    const designData = {
        colors: state.colors,
        designElements: state.designElements,
        pockets: state.pockets,
        views: ['front', 'back', 'left-shoulder', 'right-shoulder']
    };

    // Create a combined SVG of all views
    const combinedSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const viewWidth = 500;
    const viewHeight = 600;
    combinedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    combinedSvg.setAttribute('viewBox', `0 0 ${viewWidth * 4} ${viewHeight}`);

    const views = ['front', 'back', 'left-shoulder', 'right-shoulder'];
    
    views.forEach((view, index) => {
        const viewContainer = document.querySelector(`.shirt-view[data-view="${view}"]`);
        if (!viewContainer) return;
        
        const originalSvg = viewContainer.querySelector('svg');
        if (!originalSvg) return;

        const viewGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        viewGroup.setAttribute('transform', `translate(${index * viewWidth}, 0)`);

        const contents = originalSvg.cloneNode(true);
        Array.from(contents.children).forEach(child => {
            const cleanedChild = cleanSvgElement(child.cloneNode(true));
            if (cleanedChild !== null) {
                viewGroup.appendChild(cleanedChild);
            }
        });

        combinedSvg.appendChild(viewGroup);
    });

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(combinedSvg);

    // Send the design to the server to be saved as an image
    fetch('/save_design/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),  // You'll need to implement getCookie
        },
        body: JSON.stringify({
            svg_data: svgString,
            design_data: designData
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Store the design ID in sessionStorage
            sessionStorage.setItem('design_id', data.design_id);
            // Redirect to the order form
            window.location.href = "/submit_order/";
        } else {
            alert('Error saving design: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while saving the design.');
    });
}

// Helper function to get CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
// When saving design before redirecting to order page
function saveAndRedirect() {
    const designData = getDesignData(); // Your function to collect design data
    
    fetch('/customize/save-design/', {
        method: 'POST',
        body: JSON.stringify(designData),
        headers: {'Content-Type': 'application/json'}
    })
    .then(response => response.json())
    .then(data => {
        // Pass design ID to order page
        window.location.href = `/submit-order/?design_id=${data.design_id}`;
    });
}
});