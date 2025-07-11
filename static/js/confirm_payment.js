document.addEventListener('DOMContentLoaded', function() {
    const customerId = sessionStorage.getItem('selectedCustomerId');
    if (!customerId) {
        window.location.href = 'admin_dashboard.html';
        return;
    }

    const customerData = {
        '1001': { name: 'John Doe', email: 'john@example.com', phone: '+1 (555) 123-4567' },
        '1002': { name: 'Jane Smith', email: 'jane@example.com', phone: '+1 (555) 987-6543' }
    };

    document.getElementById('customer-name').textContent = customerData[customerId].name;
    document.getElementById('customer-contact').textContent = `${customerData[customerId].email} | ${customerData[customerId].phone}`;

    const payments = [
        {
            orderId: customerId === '1001' ? 1001 : 2001,
            date: '2023-05-15 14:30',
            amount: 69.97,
            method: 'Bank Transfer',
            status: customerId === '1001' ? 'verified' : 'unverified',
            proof: 'https://via.placeholder.com/300x200?text=Payment+Receipt'
        }
    ];

    const paymentList = document.querySelector('.payment-list');
    
    payments.forEach(payment => {
        const paymentCard = document.createElement('div');
        paymentCard.className = 'payment-card';
        
        if (payment.status === 'unverified') {
            paymentCard.innerHTML = `
                <div class="payment-header">
                    <span class="order-id">Order #${payment.orderId}</span>
                    <span class="payment-date">${payment.date}</span>
                    <span class="payment-amount">RM${payment.amount.toFixed(2)}</span>
                </div>
                <div class="payment-method">
                    ${payment.method}
                </div>
                <div class="payment-proof">
                    <img src="${payment.proof}" alt="Payment Receipt">
                </div>
                <div class="payment-actions">
                    <button class="verify-btn" data-order="${payment.orderId}">Verify Payment</button>
                    <button class="reject-btn" data-order="${payment.orderId}">Reject Payment</button>
                </div>
            `;
        } else {
            paymentCard.innerHTML = `
                <div class="payment-header">
                    <span class="order-id">Order #${payment.orderId}</span>
                    <span class="payment-date">${payment.date}</span>
                    <span class="payment-amount">RM${payment.amount.toFixed(2)}</span>
                </div>
                <div class="payment-method">
                    ${payment.method}
                </div>
                <div class="payment-proof">
                    <img src="${payment.proof}" alt="Payment Receipt">
                </div>
                <div class="payment-status verified">
                    Payment Verified on ${payment.date}
                </div>
            `;
        }
        
        paymentList.appendChild(paymentCard);
    });

    document.querySelectorAll('.verify-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.dataset.order;
            alert(`Payment for order #${orderId} verified!`);
            // In real app, would update status and send to server
        });
    });

    document.querySelectorAll('.reject-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.dataset.order;
            alert(`Payment for order #${orderId} rejected!`);
            // In real app, would update status and send to server
        });
    });
});