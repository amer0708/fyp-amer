document.addEventListener('DOMContentLoaded', function() {
    const customers = [
        { id: 1001, name: 'John Doe', email: 'john@example.com', phone: '+1 (555) 123-4567' },
        { id: 1002, name: 'Jane Smith', email: 'jane@example.com', phone: '+1 (555) 987-6543' },
        { id: 1003, name: 'Robert Johnson', email: 'robert@example.com', phone: '+1 (555) 456-7890' }
    ];

    const customerList = document.querySelector('.customer-list');
    const searchInput = document.getElementById('customer-search');
    const searchBtn = document.getElementById('search-btn');

    function renderCustomers(filteredCustomers) {
        customerList.innerHTML = '';
        
        const customersToRender = filteredCustomers || customers;
        
        customersToRender.forEach(customer => {
            const customerCard = document.createElement('div');
            customerCard.className = 'customer-card';
            customerCard.dataset.customerId = customer.id;
            
            customerCard.innerHTML = `
                <div class="customer-info">
                    <h3>${customer.name}</h3>
                    <p>${customer.email}</p>
                    <p>${customer.phone}</p>
                </div>
                <div class="customer-actions">
                    <button class="select-customer-btn">Select</button>
                </div>
            `;
            
            customerList.appendChild(customerCard);
        });

        document.querySelectorAll('.select-customer-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const customerId = this.closest('.customer-card').dataset.customerId;
                sessionStorage.setItem('selectedCustomerId', customerId);
                window.location.href = "/review_order";
            });
        });
    }

    function filterCustomers() {
        const searchTerm = searchInput.value.toLowerCase();
        const filtered = customers.filter(customer => 
            customer.name.toLowerCase().includes(searchTerm) ||
            customer.email.toLowerCase().includes(searchTerm) ||
            customer.phone.includes(searchTerm)
        );
        renderCustomers(filtered);
    }

    renderCustomers();
    searchInput.addEventListener('input', filterCustomers);
    searchBtn.addEventListener('click', filterCustomers);
});