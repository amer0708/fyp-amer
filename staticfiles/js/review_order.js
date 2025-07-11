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
                        <span>${item.quantity} x $${item.price.toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                Total: $${total.toFixed(2)}
            </div>
        `;
        orderList.appendChild(orderCard);
    });
});