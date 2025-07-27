document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - JavaScript is running');
    
    // Form elements
    const orderForm = document.getElementById('orderForm');
    console.log('Order form found:', orderForm);
    const hasCustomSizes = document.getElementById('hasCustomSizes');
    const customSizesSection = document.getElementById('customSizesSection');
    const maleCustomQty = document.getElementById('maleCustomQty');
    const femaleCustomQty = document.getElementById('femaleCustomQty');
    const customSizeEntries = document.getElementById('customSizeEntries');
    const sizeChartModal = document.getElementById('sizeChartModal');
    const previewModal = document.getElementById('previewModal');
    const previewBtn = document.getElementById('previewBtn');
    const previewContent = document.getElementById('previewContent');
    const closeModal = document.querySelectorAll('.close');
    const closeSizeChartBtn = document.getElementById('closeSizeChart');
    const closePreviewBtn = document.getElementById('closePreview');
    const confirmOrderBtn = document.getElementById('confirmOrder');
    const roleSelect = document.getElementById('role');
    const otherRoleGroup = document.getElementById('otherRoleGroup');
    const urlParams = new URLSearchParams(window.location.search);
    const designId = urlParams.get('design_id');
    
    // Data storage
    let customSizeData = {};
    let customSizeCount = 0;
    let activeSizeCharts = {}; // Will store active size chart data

    // Initialize form
    initForm();

    function initForm() {
        // Set min date for deliveryDate input to today
        const deliveryDateInput = document.getElementById('deliveryDate');
        if (deliveryDateInput) {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            const minDate = `${yyyy}-${mm}-${dd}`;
            deliveryDateInput.setAttribute('min', minDate);
        }
        // Load active size charts
        loadActiveSizeCharts();
        
        // Event listeners for checkboxes
        hasCustomSizes.addEventListener('change', function() {
            customSizesSection.style.display = this.checked ? 'block' : 'none';
            if (!this.checked) {
                customSizeEntries.innerHTML = '';
                customSizeCount = 0;
                maleCustomQty.value = 0;
                femaleCustomQty.value = 0;
            }
        });

        // Role selection
        roleSelect.addEventListener('change', function() {
            if (this.value === 'other') {
                otherRoleGroup.style.display = 'block';
                document.getElementById('otherRole').required = true;
            } else {
                otherRoleGroup.style.display = 'none';
                document.getElementById('otherRole').required = false;
            }
        });

        // Quantity change handlers
        maleCustomQty.addEventListener('change', updateCustomSizeEntries);
        femaleCustomQty.addEventListener('change', updateCustomSizeEntries);

        // View size chart
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('view-size-chart')) {
                showSizeChartModal();
            }
        });

        // Preview order (only if preview button exists)
        if (previewBtn) {
            previewBtn.addEventListener('click', function() {
                if (validateForm(true)) {
                    generatePreview();
                    previewModal.style.display = 'block';
                }
            });
        }

        // Close modals
        if (closeModal.length > 0) {
            closeModal.forEach(btn => {
                btn.addEventListener('click', function() {
                    if (sizeChartModal) sizeChartModal.style.display = 'none';
                    if (previewModal) previewModal.style.display = 'none';
                });
            });
        }

        if (closeSizeChartBtn) {
            closeSizeChartBtn.addEventListener('click', function() {
                if (sizeChartModal) sizeChartModal.style.display = 'none';
            });
        }

        if (closePreviewBtn) {
            closePreviewBtn.addEventListener('click', function() {
                if (previewModal) previewModal.style.display = 'none';
            });
        }

        window.addEventListener('click', function(e) {
            if (e.target === sizeChartModal || e.target === previewModal) {
                if (sizeChartModal) sizeChartModal.style.display = 'none';
                if (previewModal) previewModal.style.display = 'none';
            }
        });

        // Confirm order from preview (only if confirm button exists)
        if (confirmOrderBtn) {
            confirmOrderBtn.addEventListener('click', function() {
                if (previewModal) previewModal.style.display = 'none';
                submitOrder();
            });
        }

        // Handle submit button click directly
        const submitOrderBtn = document.getElementById('submitOrderBtn');
        if (submitOrderBtn) {
            submitOrderBtn.addEventListener('click', function(e) {
                console.log('Submit Order button clicked');
                e.preventDefault();
                submitOrder();
            });
        }

        // Also keep form submission handler as backup
        orderForm.addEventListener('submit', function(e) {
            console.log('Form submit event triggered');
            e.preventDefault();
            e.stopPropagation();
            console.log('Default prevented, calling submitOrder');
            submitOrder();
            return false;
        });

        // Reset form
        orderForm.addEventListener('reset', function() {
            customSizesSection.style.display = 'none';
            hasCustomSizes.checked = false;
            customSizeEntries.innerHTML = '';
            customSizeCount = 0;
            maleCustomQty.value = 0;
            femaleCustomQty.value = 0;
            customSizeData = {};
            otherRoleGroup.style.display = 'none';
            const errorFields = orderForm.querySelectorAll('[style*="border-color: red"]');
            errorFields.forEach(field => {
                field.style.borderColor = '#ddd';
            });
        });
    }

    function loadActiveSizeCharts() {
        // Fetch active size charts from backend
        fetch('/get_active_size_charts/')
            .then(response => response.json())
            .then(data => {
                activeSizeCharts = data;
            })
            .catch(error => {
                console.error('Error loading size charts:', error);
                // Fallback to default sizes
                activeSizeCharts = {
                    male: {
                        standard: {
                            measurements: {
                                'S': {}, 'M': {}, 'L': {}, 'XL': {}, 'XXL': {}
                            }
                        }
                    },
                    female: {
                        standard: {
                            measurements: {
                                'S': {}, 'M': {}, 'L': {}, 'XL': {}, 'XXL': {}
                            }
                        }
                    }
                };
            });
    }

    function updateCustomSizeEntries() {
        const maleQty = parseInt(maleCustomQty.value) || 0;
        const femaleQty = parseInt(femaleCustomQty.value) || 0;
        const totalQty = maleQty + femaleQty;
        
        // Save existing data
        const entries = customSizeEntries.querySelectorAll('.custom-entry');
        entries.forEach(entry => {
            const id = entry.id;
            customSizeData[id] = {
                chest: entry.querySelector(`[name$="[chest]"]`).value,
                waist: entry.querySelector(`[name$="[waist]"]`).value,
                hip: entry.querySelector(`[name$="[hip]"]`).value,
                shoulder: entry.querySelector(`[name$="[shoulder]"]`).value,
                sleeve: entry.querySelector(`[name$="[sleeve]"]`).value,
                shirtLength: entry.querySelector(`[name$="[shirtLength]"]`).value,
                neck: entry.querySelector(`[name$="[neck]"]`).value
            };
        });
        
        // Clear and recreate entries
        customSizeEntries.innerHTML = '';
        customSizeCount = 0;
        
        for (let i = 0; i < totalQty; i++) {
            customSizeCount++;
            const gender = i < maleQty ? 'male' : 'female';
            const entryId = `custom-size-${customSizeCount}`;
            
            const entryDiv = document.createElement('div');
            entryDiv.className = 'custom-entry';
            entryDiv.id = entryId;
            
            entryDiv.innerHTML = `
                <h4>Custom Size ${customSizeCount} (${gender === 'male' ? 'Male' : 'Female'})</h4>
                <div class="measurement-grid">
                    <div class="form-group">
                        <label for="${entryId}-chest">Chest (in)</label>
                        <input type="number" id="${entryId}-chest" name="customSizes[${customSizeCount}][chest]" step="0.1" min="0" required
                            value="${customSizeData[entryId]?.chest || ''}">
                    </div>
                    <div class="form-group">
                        <label for="${entryId}-waist">Waist (in)</label>
                        <input type="number" id="${entryId}-waist" name="customSizes[${customSizeCount}][waist]" step="0.1" min="0" required
                            value="${customSizeData[entryId]?.waist || ''}">
                    </div>
                    <div class="form-group">
                        <label for="${entryId}-hip">Hip (in)</label>
                        <input type="number" id="${entryId}-hip" name="customSizes[${customSizeCount}][hip]" step="0.1" min="0" required
                            value="${customSizeData[entryId]?.hip || ''}">
                    </div>
                    <div class="form-group">
                        <label for="${entryId}-shoulder">Shoulder (in)</label>
                        <input type="number" id="${entryId}-shoulder" name="customSizes[${customSizeCount}][shoulder]" step="0.1" min="0" required
                            value="${customSizeData[entryId]?.shoulder || ''}">
                    </div>
                    <div class="form-group">
                        <label for="${entryId}-sleeve">Sleeve Length (in)</label>
                        <input type="number" id="${entryId}-sleeve" name="customSizes[${customSizeCount}][sleeve]" step="0.1" min="0" required
                            value="${customSizeData[entryId]?.sleeve || ''}">
                    </div>
                    <div class="form-group">
                        <label for="${entryId}-shirtLength">Shirt Length (in)</label>
                        <input type="number" id="${entryId}-shirtLength" name="customSizes[${customSizeCount}][shirtLength]" step="0.1" min="0" required
                            value="${customSizeData[entryId]?.shirtLength || ''}">
                    </div>
                    <div class="form-group">
                        <label for="${entryId}-neck">Neck (in)</label>
                        <input type="number" id="${entryId}-neck" name="customSizes[${customSizeCount}][neck]" step="0.1" min="0" required
                            value="${customSizeData[entryId]?.neck || ''}">
                    </div>
                </div>
            `;
            
            customSizeEntries.appendChild(entryDiv);
        }
    }

    function showSizeChartModal() {
        let html = '';

        // Helper to capitalize
        function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

        // Loop through all genders and types
        ['male', 'female', 'unisex'].forEach(gender => {
            ['standard', 'numeric'].forEach(type => {
                const chart = activeSizeCharts[gender]?.[type];
                if (chart && chart.measurements && Object.keys(chart.measurements).length > 0) {
                    html += `
                        <div style="margin-bottom:2em;">
                            <div style="font-weight:bold;">Name: ${chart.name || '-'}</div>
                            <div style="font-weight:bold;">Gender: ${cap(gender)}</div>
                            <div style="font-weight:bold;">Type: ${cap(type)}</div>
                            <table style="width:100%;margin-top:0.5em;">
                                <thead>
                                    <tr>
                                        <th>Size</th>
                                        <th>Chest</th>
                                        <th>Waist</th>
                                        <th>Hip</th>
                                        <th>Sleeve</th>
                                    </tr>
                                </thead>
                                <tbody>
                    `;
                    // Define the correct size order
                    const sizeOrder = ['S', 'M', 'L', 'XL', 'XXL'];
                    
                    // Sort the measurements by the defined size order
                    const sortedEntries = Object.entries(chart.measurements).sort((a, b) => {
                        const aIndex = sizeOrder.indexOf(a[0]);
                        const bIndex = sizeOrder.indexOf(b[0]);
                        return aIndex - bIndex;
                    });
                    
                    sortedEntries.forEach(([size, vals]) => {
                        html += `<tr>
                            <td>${size}</td>
                            <td>${vals.chest != null ? vals.chest : '-'}</td>
                            <td>${vals.waist != null ? vals.waist : '-'}</td>
                            <td>${vals.hip != null ? vals.hip : '-'}</td>
                            <td>${vals.sleeve != null ? vals.sleeve : '-'}</td>
                        </tr>`;
                    });
                    html += `
                                </tbody>
                            </table>
                        </div>
                    `;
                }
            });
        });

        if (!html) {
            html = `<div>No size chart data available.</div>`;
        }

        sizeChartModal.querySelector('.modal-content h3').innerHTML = 'Standard Size Chart (in inches)';
        sizeChartModal.querySelector('#dynamicSizeChartTable').innerHTML = html;
        sizeChartModal.style.display = 'block';
    }

    function generatePreview() {
        // Get the design image if available
        const designImg = document.querySelector('.design-preview-image');
        let designImgHtml = '';

        if (designImg) {
            designImgHtml = `
                <div class="preview-design-image">
                    <h3>Your Design</h3>
                    <img src="${designImg.src}" alt="Design Preview" style="max-width: 300px;">
                 </div>`;
        } else {
            const svgContainer = document.querySelector('.svg-preview-container');
            if (svgContainer) {
                designImgHtml = `
                    <div class="preview-design-image">
                        <h3>Your Design</h3>
                        <div class="svg-preview-container">${svgContainer.innerHTML}</div>
                    </div>`;
            }
        }

        // Collect standard sizes
        const standardSizes = {
            male: {},
            female: {}
        };
        
        document.querySelectorAll('input[id^="male"], input[id^="female"]').forEach(input => {
            const qty = parseInt(input.value) || 0;
            if (qty > 0) {
                const gender = input.id.startsWith('male') ? 'male' : 'female';
                const size = input.id.replace(/^male|^female/, '');
                standardSizes[gender][size] = qty;
            }
        });

        let previewHTML = designImgHtml + `
            <div class="preview-section">
                <h3>Customer Details</h3>
                <table class="preview-table">
                    <tr>
                        <th>Full Name</th>
                        <td>${document.getElementById('fullName').value}</td>
                    </tr>
                    <tr>
                        <th>Company Name</th>
                        <td>${document.getElementById('companyName').value}</td>
                    </tr>
                    <tr>
                        <th>Email</th>
                        <td>${document.getElementById('email').value}</td>
                    </tr>
                    <tr>
                        <th>Phone</th>
                        <td>${document.getElementById('phone').value}</td>
                    </tr>
                    <tr>
                        <th>Role</th>
                        <td>${roleSelect.options[roleSelect.selectedIndex].text}${roleSelect.value === 'other' ? ' (' + document.getElementById('otherRole').value + ')' : ''}</td>
                    </tr>
                </table>
            </div>
            
            <div class="preview-section">
                <h3>Order Summary</h3>
                <table class="preview-table">
                    <tr>
                        <th>Custom Sizes</th>
                        <td>${hasCustomSizes.checked ? 'Yes' : 'No'}</td>
                    </tr>
                    <tr>
                        <th>Completion Date</th>
                        <td>${document.getElementById('deliveryDate').value}</td>
                    </tr>
                </table>
            </div>
            
            <div class="preview-section">
                <h3>Standard Sizes</h3>
                <table class="preview-table">
                    <thead>
                        <tr>
                            <th>Size</th>
                            <th>Male</th>
                            <th>Female</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.keys(standardSizes.male).concat(Object.keys(standardSizes.female))
                            .filter((v, i, a) => a.indexOf(v) === i) // Unique sizes
                            .map(size => {
                                const maleQty = standardSizes.male[size] || 0;
                                const femaleQty = standardSizes.female[size] || 0;
                                
                                return `
                                    <tr>
                                        <td>${size}</td>
                                        <td>${maleQty}</td>
                                        <td>${femaleQty}</td>
                                    </tr>
                                `;
                            }).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        if (hasCustomSizes.checked) {
            const maleQty = parseInt(maleCustomQty.value) || 0;
            const femaleQty = parseInt(femaleCustomQty.value) || 0;
            const totalQty = maleQty + femaleQty;
            
            if (totalQty > 0) {
                previewHTML += `
                    <div class="preview-section">
                        <h3>Custom Sizes</h3>
                        <table class="preview-table">
                            <tr>
                                <th>Male Quantity</th>
                                <td>${maleQty}</td>
                            </tr>
                            <tr>
                                <th>Female Quantity</th>
                                <td>${femaleQty}</td>
                            </tr>
                        </table>
                        
                        <h4>Measurements</h4>
                        <table class="preview-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Gender</th>
                                    <th>Chest</th>
                                    <th>Waist</th>
                                    <th>Hip</th>
                                    <th>Shoulder</th>
                                    <th>Sleeve</th>
                                    <th>Length</th>
                                    <th>Neck</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${Array.from(customSizeEntries.querySelectorAll('.custom-entry')).map((entry, index) => {
                                    const gender = index < maleQty ? 'Male' : 'Female';
                                    const chest = entry.querySelector('[name$="[chest]"]').value || 'Not specified';
                                    const waist = entry.querySelector('[name$="[waist]"]').value || 'Not specified';
                                    const hip = entry.querySelector('[name$="[hip]"]').value || 'Not specified';
                                    const shoulder = entry.querySelector('[name$="[shoulder]"]').value || 'Not specified';
                                    const sleeve = entry.querySelector('[name$="[sleeve]"]').value || 'Not specified';
                                    const shirtLength = entry.querySelector('[name$="[shirtLength]"]').value || 'Not specified';
                                    const neck = entry.querySelector('[name$="[neck]"]').value || 'Not specified';
                                    
                                    return `
                                        <tr>
                                            <td>${index + 1}</td>
                                            <td>${gender}</td>
                                            <td>${chest}"</td>
                                            <td>${waist}"</td>
                                            <td>${hip}"</td>
                                            <td>${shoulder}"</td>
                                            <td>${sleeve}"</td>
                                            <td>${shirtLength}"</td>
                                            <td>${neck}"</td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            }
        }
        
        previewContent.innerHTML = previewHTML;
    }

    function validateForm(isPreview = false) {
        let isValid = true;
        const requiredFields = orderForm.querySelectorAll('[required]');
        
        // Clear previous errors
        requiredFields.forEach(f => f.style.borderColor = '#ddd');

        requiredFields.forEach(field => {
            // Check if field is visible and empty
            if (field.offsetParent !== null && !field.value.trim()) {
                field.style.borderColor = 'red';
                isValid = false;
            }
        });

        if (!isValid && !isPreview) {
            alert('Please fill in all required fields marked in red.');
        }
        
        // Validate at least one standard size has quantity
        const standardSizeInputs = document.querySelectorAll('input[id^="male"], input[id^="female"]');
        const hasStandardQuantities = Array.from(standardSizeInputs).some(input => (parseInt(input.value) || 0) > 0);
        
        if (!hasStandardQuantities && !hasCustomSizes.checked) {
            if (!isPreview) {
                alert('Please enter quantities for at least one standard size or enable custom sizes.');
            }
            isValid = false;
        }
        
        // Validate custom sizes if enabled
        if (hasCustomSizes.checked) {
            const maleQty = parseInt(maleCustomQty.value) || 0;
            const femaleQty = parseInt(femaleCustomQty.value) || 0;
            const totalCustomQty = maleQty + femaleQty;
            const customEntries = customSizeEntries.querySelectorAll('.custom-entry').length;
            
            if (totalCustomQty !== customEntries) {
                if (!isPreview) {
                    alert('The number of custom size entries must match the total custom quantity specified.');
                }
                isValid = false;
            }
        }
        
        return isValid;
    }

    function submitOrder() {
        console.log('submitOrder function called');
        if (!validateForm()) {
            console.log('Form validation failed');
            return;
        }
        
        // Collect standard sizes
        const standardSizes = {
            male: {},
            female: {}
        };
        
        document.querySelectorAll('input[id^="male"], input[id^="female"]').forEach(input => {
            // Skip custom quantity fields
            if (input.id.includes('CustomQty')) {
                console.log(`Skipping custom quantity field: ${input.id}`);
                return;
            }
            
            const qty = parseInt(input.value) || 0;
            if (qty > 0) {
                const gender = input.id.startsWith('male') ? 'male' : 'female';
                const size = input.id.replace(/^male|^female/, '');
                console.log(`Processing size: input.id='${input.id}', gender='${gender}', size='${size}' (length=${size.length}), quantity=${qty}`);
                standardSizes[gender][size] = qty;
            }
        });

        // Prepare order data
        const orderData = {
            design_id: designId || '',
            customer_details: {
                fullName: document.getElementById('fullName').value,
                companyName: document.getElementById('companyName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                role: roleSelect.value,
                otherRole: roleSelect.value === 'other' ? document.getElementById('otherRole').value : ''
            },
            order_options: {
                hasCustomSizes: hasCustomSizes.checked,
                deliveryDate: document.getElementById('deliveryDate').value
            },
            standard_sizes: standardSizes
        };

        // Add custom sizes if enabled
        if (hasCustomSizes.checked) {
            orderData.custom_sizes = [];
            const entries = customSizeEntries.querySelectorAll('.custom-entry');
            entries.forEach((entry, index) => {
                const chest = parseFloat(entry.querySelector('[name$="[chest]"]').value) || 0;
                const waist = parseFloat(entry.querySelector('[name$="[waist]"]').value) || 0;
                const hip = parseFloat(entry.querySelector('[name$="[hip]"]').value) || 0;
                const shoulder = parseFloat(entry.querySelector('[name$="[shoulder]"]').value) || 0;
                const sleeve = parseFloat(entry.querySelector('[name$="[sleeve]"]').value) || 0;
                const shirtLength = parseFloat(entry.querySelector('[name$="[shirtLength]"]').value) || 0;
                const neck = parseFloat(entry.querySelector('[name$="[neck]"]').value) || 0;
                
                console.log(`Custom size ${index + 1}: chest=${chest}, waist=${waist}, hip=${hip}, shoulder=${shoulder}, sleeve=${sleeve}, shirtLength=${shirtLength}, neck=${neck}`);
                
                const genderText = entry.textContent;
                const gender = genderText.includes('Male') ? 'male' : 'female';
                console.log(`Gender detection: text='${genderText}', detected='${gender}'`);
                
                orderData.custom_sizes.push({
                    gender: gender,
                    chest: chest,
                    waist: waist,
                    hip: hip,
                    shoulder: shoulder,
                    sleeve: sleeve,
                    shirtLength: shirtLength,
                    neck: neck
                });
            });
        }

        console.log('Order data to submit:', orderData);

        // Submit to server
        fetch('/submit_order/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify(orderData)
        })
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Response data:', data);
            if (data.status === 'success') {
                window.location.href = `/order_confirmation/${data.order_id}/`;
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while submitting the order.');
        });
    }

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
});