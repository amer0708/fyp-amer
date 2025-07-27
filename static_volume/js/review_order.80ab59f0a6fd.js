document.addEventListener('DOMContentLoaded', function() {
    const customerId = sessionStorage.getItem('selectedCustomerId');
    if (!customerId) {
        window.location.href = '/admin_dashboard';
        return;
    }

    const customerData = {
        '1001': { name: 'John Doe', email: 'john@example.com', phone: '+1 (555) 123-4567' },
        '1002': { name: 'Jane Smith', email: 'jane@example.com', phone: '+1 (555) 987-6543' }
    };

    document.getElementById('customer-name').textContent = customerData[customerId].name;
    document.getElementById('customer-contact').textContent = `${customerData[customerId].email} | ${customerData[customerId].phone}`;

    const orders = [
        {
            id: customerId === '1001' ? 1001 : 2001,
            date: '2023-05-15',
            status: customerId === '1001' ? 'paid' : 'in-progress',
            items: [
                { name: 'Product A', quantity: 2, price: 19.99 },
                { name: 'Product B', quantity: 1, price: 29.99 }
            ]
        }
    ];

    const orderList = document.querySelector('.order-list');
    
    orders.forEach(order => {
        const total = order.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        orderCard.dataset.originalStatus = order.status;
        orderCard.innerHTML = `
            <div class="order-header">
                <span class="order-id">Order #${order.id}</span>
                <span class="order-date">${order.date}</span>
                <span class="order-status ${order.status.replace(' ', '-')}">
                    ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="item">
                        <span>${item.name}</span>
                        <span>${item.quantity} x RM${item.price.toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                Total: RM${total.toFixed(2)}
            </div>
            <div class="order-actions" style="text-align:center; margin-top:1em;">
                <button class="submit-quotation-btn beautiful-btn" style="padding: 0.6em 1.5em; font-size: 1em; background: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer; margin-right: 1em;">Submit Price Quotation</button>
                <button class="reject-btn beautiful-btn" style="padding: 0.6em 1.5em; font-size: 1em; background: #dc3545; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Reject</button>
                <div class="rejection-message" style="display:none; color:#dc3545; margin-top:1em; font-weight:bold;">You have rejected this order.</div>
            </div>
        `;
        orderList.appendChild(orderCard);

        const submitQuotationBtn = orderCard.querySelector('.submit-quotation-btn');
        const rejectBtn = orderCard.querySelector('.reject-btn');
        const rejectionMessage = orderCard.querySelector('.rejection-message');

        // Submit Price Quotation button logic
        submitQuotationBtn.addEventListener('click', function() {
            if (!submitQuotationBtn.disabled) {
                window.location.href = '/submitquotation';
            }
        });

        // Reject button logic
        rejectBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to reject this order?')) {
                const statusSpan = orderCard.querySelector('.order-status');
                statusSpan.textContent = 'Rejected';
                statusSpan.className = 'order-status rejected';
                submitQuotationBtn.disabled = true;
                rejectBtn.disabled = true;
                submitQuotationBtn.classList.add('disabled');
                rejectBtn.classList.add('disabled');
                rejectionMessage.style.display = 'block';
            }
        });
    });
});