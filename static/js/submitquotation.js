document.addEventListener('DOMContentLoaded', function() {
    // Check for customer ID and redirect if not found
    const customerId = sessionStorage.getItem('selectedCustomerId');
    if (!customerId) {
        window.location.href = '/admin_dashboard';
        return;
    }

    // Customer data
    const customerData = {
        '1001': { name: 'John Doe', email: 'john@example.com', phone: '+1 (555) 123-4567' },
        '1002': { name: 'Jane Smith', email: 'jane@example.com', phone: '+1 (555) 987-6543' }
    };

    // Update header with customer info
    document.getElementById('customer-name').textContent = customerData[customerId].name;
    document.getElementById('customer-contact').textContent = `${customerData[customerId].email} | ${customerData[customerId].phone}`;

    // Set today's date as default
    const today = new Date();
    const formattedDate = today.toISOString().substr(0, 10);
    document.getElementById('date').value = formattedDate;
    
    // Add item row
    document.getElementById('addItem').addEventListener('click', function() {
        const itemsContainer = document.getElementById('itemsContainer');
        const newItemRow = document.createElement('div');
        newItemRow.className = 'item-row';
        newItemRow.innerHTML = `
            <input type="text" class="item-desc" placeholder="Description">
            <input type="number" class="item-qty" placeholder="Qty" min="1" value="1">
            <input type="number" class="item-price" placeholder="Unit Price" min="0" step="0.01">
            <button class="remove-item btn-secondary">×</button>
        `;
        itemsContainer.appendChild(newItemRow);
        
        // Add event to remove button
        newItemRow.querySelector('.remove-item').addEventListener('click', function() {
            itemsContainer.removeChild(newItemRow);
        });
    });
    
    // Generate receipt
    document.getElementById('generateReceipt').addEventListener('click', function() {
        // Get form values
        const customerName = document.getElementById('customerName').value || 'N/A';
        const companyName = document.getElementById('companyName').value || 'N/A';
        const quotationId = document.getElementById('quotationId').value || 'N/A';
        const date = document.getElementById('date').value || new Date().toISOString().substr(0, 10);
        const bankName = document.getElementById('bankName').value || 'RHB Bank';
        const accountName = document.getElementById('accountName').value || 'Waniey Tailor';
        const accountNumber = document.getElementById('accountNumber').value || '1234-5678-9012';
        
        // Format date for display
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Update receipt header info
        document.getElementById('receipt-customer').textContent = customerName;
        document.getElementById('receipt-company').textContent = companyName;
        document.getElementById('receipt-quotation-id').textContent = quotationId;
        document.getElementById('receipt-date').textContent = formattedDate;
        document.getElementById('receipt-bank-name').textContent = bankName;
        document.getElementById('receipt-account-name').textContent = accountName;
        document.getElementById('receipt-account-number').textContent = accountNumber;
        
        // Process items
        const itemRows = document.querySelectorAll('.item-row');
        const receiptItemsTbody = document.querySelector('#receipt-items tbody');
        receiptItemsTbody.innerHTML = '';
        
        let subtotal = 0;
        
        itemRows.forEach(row => {
            const desc = row.querySelector('.item-desc').value || 'Item';
            const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
            const price = parseFloat(row.querySelector('.item-price').value) || 0;
            const total = qty * price;
            
            subtotal += total;
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${desc}</td>
                <td class="text-right">${qty}</td>
                <td class="text-right">RM${price.toFixed(2)}</td>
                <td class="text-right">RM${total.toFixed(2)}</td>
            `;
            receiptItemsTbody.appendChild(tr);
        });
        
        // Calculate totals (fixed 70% deposit)
        const depositAmount = subtotal * 0.7;
        const balanceDue = subtotal - depositAmount;
        
        // Update totals display
        document.getElementById('subtotal').textContent = `RM${subtotal.toFixed(2)}`;
        document.getElementById('deposit').textContent = `RM${depositAmount.toFixed(2)}`;
        document.getElementById('balance').textContent = `RM${balanceDue.toFixed(2)}`;
        
        // Show receipt
        document.getElementById('receipt').style.display = 'block';
    });
    
    // Print receipt
    document.getElementById('printReceipt').addEventListener('click', function() {
        window.print();
    });
    
    // Add event to existing remove buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemsContainer = document.getElementById('itemsContainer');
            itemsContainer.removeChild(btn.parentNode);
        });
    });
});