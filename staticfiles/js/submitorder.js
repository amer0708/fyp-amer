document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const orderForm = document.getElementById('orderForm');
    const hasCustomSizes = document.getElementById('hasCustomSizes');
    const hasNametags = document.getElementById('hasNametags');
    const customSizesSection = document.getElementById('customSizesSection');
    const nametagsSection = document.getElementById('nametagsSection');
    const maleCustomQty = document.getElementById('maleCustomQty');
    const femaleCustomQty = document.getElementById('femaleCustomQty');
    const customSizeEntries = document.getElementById('customSizeEntries');
    const nametagEntries = document.getElementById('nametagEntries');
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
    
    // Data storage
    let nametagData = {};
    let customSizeData = {};
    let customSizeCount = 0;

    // Initialize form
    initForm();

    function initForm() {
        // Event listeners for checkboxes
        hasCustomSizes.addEventListener('change', function() {
            customSizesSection.style.display = this.checked ? 'block' : 'none';
            if (!this.checked) {
                customSizeEntries.innerHTML = '';
                customSizeCount = 0;
                maleCustomQty.value = 0;
                femaleCustomQty.value = 0;
            }
            if (hasNametags.checked) updateNametagEntries();
        });

        hasNametags.addEventListener('change', function() {
            nametagsSection.style.display = this.checked ? 'block' : 'none';
            if (this.checked) {
                updateNametagEntries();
            } else {
                nametagEntries.innerHTML = '';
                nametagData = {};
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

        // Standard size quantity changes
        const sizeInputs = document.querySelectorAll('input[name^="male"], input[name^="female"]');
        sizeInputs.forEach(input => {
            input.addEventListener('change', function() {
                if (hasNametags.checked) updateNametagEntries();
            });
        });

        // View size chart
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('view-size-chart')) {
                showSizeChartModal();
            }
        });

        // Preview order
        previewBtn.addEventListener('click', function() {
            if (validateForm(true)) {
                generatePreview();
                previewModal.style.display = 'block';
            }
        });

        // Close modals
        closeModal.forEach(btn => {
            btn.addEventListener('click', function() {
                sizeChartModal.style.display = 'none';
                previewModal.style.display = 'none';
            });
        });

        closeSizeChartBtn.addEventListener('click', function() {
            sizeChartModal.style.display = 'none';
        });

        closePreviewBtn.addEventListener('click', function() {
            previewModal.style.display = 'none';
        });

        window.addEventListener('click', function(e) {
            if (e.target === sizeChartModal || e.target === previewModal) {
                sizeChartModal.style.display = 'none';
                previewModal.style.display = 'none';
            }
        });

        // Confirm order from preview
        confirmOrderBtn.addEventListener('click', function() {
            previewModal.style.display = 'none';
            orderForm.submit();
        });

        // Form submission
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                alert('Order submitted successfully!');
                const formData = new FormData(orderForm);
                const data = {};
                formData.forEach((value, key) => {
                    if (data[key] !== undefined) {
                        if (!Array.isArray(data[key])) {
                            data[key] = [data[key]];
                        }
                        data[key].push(value);
                    } else {
                        data[key] = value;
                    }
                });
                console.log('Form Data:', data);
            }
        });

        // Reset form
        orderForm.addEventListener('reset', function() {
            customSizesSection.style.display = 'none';
            nametagsSection.style.display = 'none';
            hasCustomSizes.checked = false;
            hasNametags.checked = false;
            customSizeEntries.innerHTML = '';
            nametagEntries.innerHTML = '';
            customSizeCount = 0;
            maleCustomQty.value = 0;
            femaleCustomQty.value = 0;
            nametagData = {};
            customSizeData = {};
            otherRoleGroup.style.display = 'none';
            const errorFields = orderForm.querySelectorAll('[style*="border-color: red"]');
            errorFields.forEach(field => {
                field.style.borderColor = '#ddd';
            });
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
                neck: entry.querySelector(`[name$="[neck]"]`).value,
                nametag: hasNametags.checked ? entry.querySelector(`[name$="[nametag]"]`)?.value : null
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
                ${hasNametags.checked ? `
                <div class="form-group">
                    <label for="${entryId}-nametag">Nametag Name*</label>
                    <input type="text" id="${entryId}-nametag" name="customSizes[${customSizeCount}][nametag]" required
                        value="${customSizeData[entryId]?.nametag || ''}">
                </div>
                ` : ''}
            `;
            
            customSizeEntries.appendChild(entryDiv);
        }
        
        if (hasNametags.checked) updateNametagEntries();
    }

    function updateNametagEntries() {
        if (!hasNametags.checked) return;
        
        // Save existing data
        const entries = nametagEntries.querySelectorAll('.nametag-entry');
        entries.forEach(entry => {
            const id = entry.id;
            const nameInput = entry.querySelector('input[type="text"]');
            if (nameInput) {
                nametagData[id] = nameInput.value;
            }
        });
        
        // Clear and recreate entries
        nametagEntries.innerHTML = '';
        let nametagIndex = 0;
        
        const standardSizes = ['maleS', 'maleM', 'maleL', 'maleXL', 'maleXXL', 'femaleS', 'femaleM', 'femaleL', 'femaleXL', 'femaleXXL'];
        
        standardSizes.forEach(size => {
            const qty = parseInt(document.getElementById(size).value) || 0;
            if (qty > 0) {
                const gender = size.startsWith('male') ? 'Male' : 'Female';
                const sizeLabel = size.replace(/^male|^female/, '');
                
                for (let i = 0; i < qty; i++) {
                    nametagIndex++;
                    const entryId = `nametag-${nametagIndex}`;
                    
                    const entryDiv = document.createElement('div');
                    entryDiv.className = 'nametag-entry';
                    entryDiv.id = entryId;
                    
                    entryDiv.innerHTML = `
                        <h4>Nametag ${nametagIndex} (${gender} ${sizeLabel})</h4>
                        <div class="form-group">
                            <label for="${entryId}-name">Name*</label>
                            <input type="text" id="${entryId}-name" name="nametags[${nametagIndex}][name]" required
                                value="${nametagData[entryId] || ''}">
                        </div>
                    `;
                    
                    nametagEntries.appendChild(entryDiv);
                }
            }
        });
    }

    function generatePreview() {
        let previewHTML = `
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
                        <th>Nametags</th>
                        <td>${hasNametags.checked ? 'Yes' : 'No'}</td>
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
                            ${hasNametags.checked ? '<th>Nametag</th>' : ''}
                        </tr>
                    </thead>
                    <tbody>
                        ${['S', 'M', 'L', 'XL', 'XXL'].map(size => {
                            const maleQty = parseInt(document.getElementById(`male${size}`).value) || 0;
                            const femaleQty = parseInt(document.getElementById(`female${size}`).value) || 0;
                            let maleNametags = '';
                            let femaleNametags = '';
                            
                            if (hasNametags.checked) {
                                const entries = Array.from(nametagEntries.querySelectorAll('.nametag-entry'));
                                const sizeEntries = entries.filter(entry => entry.textContent.includes(`${size}`));
                                
                                maleNametags = sizeEntries.filter((_, i) => i < maleQty)
                                    .map(entry => entry.querySelector('input').value)
                                    .join(', ');
                                femaleNametags = sizeEntries.filter((_, i) => i >= maleQty)
                                    .map(entry => entry.querySelector('input').value)
                                    .join(', ');
                            }
                            
                            return `
                                <tr>
                                    <td>${size}</td>
                                    <td>${maleQty}</td>
                                    <td>${femaleQty}</td>
                                    ${hasNametags.checked ? `
                                        <td>
                                            ${maleQty > 0 ? `<strong>Male:</strong> ${maleNametags || 'Not specified'}<br>` : ''}
                                            ${femaleQty > 0 ? `<strong>Female:</strong> ${femaleNametags || 'Not specified'}` : ''}
                                        </td>
                                    ` : ''}
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
                                    ${hasNametags.checked ? '<th>Nametag</th>' : ''}
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
                                    const nametag = hasNametags.checked ? (entry.querySelector('[name$="[nametag]"]')?.value || 'Not specified') : '';
                                    
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
                                            ${hasNametags.checked ? `<td>${nametag}</td>` : ''}
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
        
        // Validate required fields
        const requiredFields = orderForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = 'red';
                isValid = false;
                if (!isPreview) {
                    alert('Please fill in all required fields.');
                }
            } else {
                field.style.borderColor = '#ddd';
            }
        });
        
        // Validate at least one standard size has quantity
        const standardSizeInputs = document.querySelectorAll('input[name^="male"], input[name^="female"]');
        let hasStandardQuantities = false;
        
        standardSizeInputs.forEach(input => {
            if (parseInt(input.value) > 0) {
                hasStandardQuantities = true;
            }
        });
        
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
            const customEntries = customSizeEntries.querySelectorAll('.custom-entry').length;
            
            if ((maleQty + femaleQty) > 0 && customEntries === 0) {
                if (!isPreview) {
                    alert('Please add custom size measurements for the custom quantities specified.');
                }
                isValid = false;
            }
            
            if (customEntries > 0 && (maleQty + femaleQty) === 0) {
                if (!isPreview) {
                    alert('Please specify custom size quantities.');
                }
                isValid = false;
            }
        }
        
        return isValid;
    }

    function showSizeChartModal() {
        const sizeCharts = JSON.parse(localStorage.getItem('sizeCharts')) || [];
        
        // Get active charts (or first available if none active)
        const getActiveChart = (gender, sizeType) => {
            const active = sizeCharts.find(c => 
                c.gender === gender && 
                c.sizeType === sizeType && 
                c.isActive
            );
            
            return active || sizeCharts.find(c => 
                c.gender === gender && 
                c.sizeType === sizeType
            );
        };

        const maleChart = getActiveChart('male', 'standard');
        const femaleChart = getActiveChart('female', 'standard');

        let html = '';
        
        if (maleChart) {
            html += `<h3>${maleChart.isActive ? '' : '(Fallback) '}Male Standard Size Chart</h3>`;
            html += generateSizeChartHTML(maleChart);
        } else {
            html += '<h3>Male Standard Size Chart (Default)</h3>';
            html += generateDefaultSizeChartHTML('male');
        }
        
        if (femaleChart) {
            html += '<hr>';
            html += `<h3>${femaleChart.isActive ? '' : '(Fallback) '}Female Standard Size Chart</h3>`;
            html += generateSizeChartHTML(femaleChart);
        } else {
            html += '<hr><h3>Female Standard Size Chart (Default)</h3>';
            html += generateDefaultSizeChartHTML('female');
        }
        
        const sizeChartModal = document.getElementById('sizeChartModal');
        sizeChartModal.querySelector('.modal-content h3').innerHTML = 'Standard Size Chart (in inches)';
        sizeChartModal.querySelector('table').innerHTML = html;
        sizeChartModal.style.display = 'block';
    }

    function generateSizeChartHTML(chart) {
        const sizes = Object.keys(chart.measurements);
        const measurements = sizes.length > 0 ? Object.keys(chart.measurements[sizes[0]]) : [];
        
        let html = `
            <thead>
                <tr>
                    <th>Size</th>
                    ${measurements.map(m => `<th>${m.charAt(0).toUpperCase() + m.slice(1)}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
        `;
        
        sizes.forEach(size => {
            html += `<tr><td>${size}</td>`;
            measurements.forEach(mType => {
                html += `<td>${chart.measurements[size][mType]}</td>`;
            });
            html += `</tr>`;
        });
        
        html += `</tbody>`;
        return html;
    }
    
    function generateDefaultSizeChartHTML(gender) {
        const defaultMale = {
            "S": {"chest":"34-36","waist":"28-30","hip":"34-36","sleeve":"32","neck":"14-14.5"},
            "M": {"chest":"38-40","waist":"32-34","hip":"38-40","sleeve":"33","neck":"15-15.5"},
            "L": {"chest":"42-44","waist":"36-38","hip":"42-44","sleeve":"34","neck":"16-16.5"},
            "XL": {"chest":"46-48","waist":"40-42","hip":"46-48","sleeve":"35","neck":"17-17.5"},
            "XXL": {"chest":"50-52","waist":"44-46","hip":"50-52","sleeve":"36","neck":"18-18.5"}
        };
        
        const defaultFemale = {
            "S": {"chest":"32-34","waist":"24-26","hip":"34-36","sleeve":"30","neck":"12-12.5"},
            "M": {"chest":"36-38","waist":"28-30","hip":"38-40","sleeve":"31","neck":"13-13.5"},
            "L": {"chest":"40-42","waist":"32-34","hip":"42-44","sleeve":"32","neck":"14-14.5"},
            "XL": {"chest":"44-46","waist":"36-38","hip":"44-46","sleeve":"33","neck":"15-15.5"},
            "XXL": {"chest":"48-50","waist":"40-42","hip":"48-50","sleeve":"34","neck":"16-16.5"}
        };
        
        const defaultChart = gender === 'male' ? defaultMale : defaultFemale;
        const sizes = Object.keys(defaultChart);
        const measurements = sizes.length > 0 ? Object.keys(defaultChart[sizes[0]]) : [];
        
        let html = `
            <thead>
                <tr>
                    <th>Size</th>
                    ${measurements.map(m => `<th>${m.charAt(0).toUpperCase() + m.slice(1)}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
        `;
        
        sizes.forEach(size => {
            html += `<tr><td>${size}</td>`;
            measurements.forEach(mType => {
                html += `<td>${defaultChart[size][mType]}</td>`;
            });
            html += `</tr>`;
        });
        
        html += `</tbody>`;
        return html;
    }
});