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

    const orders = [
        {
            id: customerId === '1001' ? 1001 : 2001,
            status: customerId === '1001' ? 'paid' : 'in-progress',
            statusHistory: [
                { date: '2023-05-15 10:30', status: 'pending' },
                customerId === '1001' ? 
                    { date: '2023-05-15 14:45', status: 'paid' } :
                    { date: '2023-05-15 14:45', status: 'paid' },
                    { date: '2023-05-16 09:00', status: 'in-progress' }
            ]
        }
    ];

    const statusList = document.querySelector('.status-list');
    
    orders.forEach(order => {
        const statusCard = document.createElement('div');
        statusCard.className = 'status-card';
        
        const availableOptions = getNextStatusOptions(order.status);
        
        statusCard.innerHTML = `
            <div class="order-header">
                <span class="order-id">Order #${order.id}</span>
                <span class="current-status ${order.status.replace(' ', '-')}">
                    ${formatStatus(order.status)}
                </span>
            </div>
            <div class="status-history">
                <h4>Status History</h4>
                <ul>
                    ${order.statusHistory.map(item => `
                        <li>
                            <span class="status-date">${item.date}</span> - 
                            <span class="status ${item.status.replace(' ', '-')}">
                                ${formatStatus(item.status)}
                            </span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            ${availableOptions.length > 0 ? `
            <div class="status-update-form">
                <h4>Update Status</h4>
                <select class="status-select">
                    <option value="">Select new status</option>
                    ${availableOptions.map(opt => `
                        <option value="${opt}">${formatStatus(opt)}</option>
                    `).join('')}
                </select>
                <button class="update-status-btn" data-order="${order.id}">Update Status</button>
            </div>
            ` : ''}
        `;
        
        statusList.appendChild(statusCard);
    });

    document.querySelectorAll('.update-status-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.dataset.order;
            const statusSelect = this.closest('.status-update-form').querySelector('.status-select');
            
            if (statusSelect.value) {
                alert(`Status for order #${orderId} updated to ${formatStatus(statusSelect.value)}!`);
                // In real app, would update status and send to server
            }
        });
    });

    function formatStatus(status) {
        return status.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    function getNextStatusOptions(currentStatus) {
        const statusFlow = {
            'pending': ['paid', 'cancelled'],
            'paid': ['in-progress', 'cancelled'],
            'in-progress': ['completed'],
            'completed': [],
            'cancelled': []
        };
        
        return statusFlow[currentStatus] || [];
    }
});