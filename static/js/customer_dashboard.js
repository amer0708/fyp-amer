document.addEventListener('DOMContentLoaded', function() {
    // Example data for demonstration
    const orders = [
        {
            id: 101,
            date: '2024-06-01',
            status: 'In Progress',
            items: [
                { name: 'Custom Shirt', quantity: 2, price: 50 },
                { name: 'Logo Embroidery', quantity: 1, price: 20 }
            ],
            quotation: {
                date: '2024-06-02',
                subtotal: 120,
                deposit: 84,
                balance: 36
            }
        },
        {
            id: 102,
            date: '2024-05-20',
            status: 'Paid',
            items: [
                { name: 'Uniform Set', quantity: 3, price: 40 }
            ],
            quotation: {
                date: '2024-05-21',
                subtotal: 120,
                deposit: 84,
                balance: 36
            }
        }
    ];

    const ordersBody = document.getElementById('customer-orders-body');
    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.date}</td>
            <td>${order.status}</td>
            <td><button class="view-order-btn">View Order</button></td>
        `;
        ordersBody.appendChild(row);
        row.querySelector('.view-order-btn').addEventListener('click', function() {
            window.location.href = '/receivequotation';
        });
    });

    // Modal logic
    const modal = document.getElementById('viewOrderModal');
    const closeModal = document.getElementById('closeViewOrderModal');
    closeModal.onclick = function() {
        modal.style.display = 'none';
    };
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    function showOrderModal(order) {
        const content = document.getElementById('order-details-content');
        content.innerHTML = `
            <h3>Order #${order.id}</h3>
            <p><strong>Date:</strong> ${order.date}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <h4>Items</h4>
            <ul>
                ${order.items.map(item => `<li>${item.name} (x${item.quantity}) - RM${item.price.toFixed(2)}</li>`).join('')}
            </ul>
            <h4>Receive Quotation</h4>
            <div class="quotation-section" style="background:#f8f9fa; padding:1em; border-radius:6px; margin-top:1em;">
                <p><strong>Quotation Date:</strong> ${order.quotation.date}</p>
                <p><strong>Subtotal:</strong> RM${order.quotation.subtotal.toFixed(2)}</p>
                <p><strong>Deposit Required (70%):</strong> RM${order.quotation.deposit.toFixed(2)}</p>
                <p><strong>Balance:</strong> RM${order.quotation.balance.toFixed(2)}</p>
                <button id="go-to-receive-quotation-btn" class="beautiful-btn" style="margin-top:1em; background:#007bff; color:#fff;">Go to Receive Quotation</button>
            </div>
        `;
        modal.style.display = 'block';
        // Add navigation for the button
        const goToQuotationBtn = document.getElementById('go-to-receive-quotation-btn');
        if (goToQuotationBtn) {
            goToQuotationBtn.addEventListener('click', function() {
                window.location.href = '/receivequotation';
            });
        }
    }
}); 