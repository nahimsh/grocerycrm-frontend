// API Configuration
const API_BASE_URL = 'https://grocerycrm-backend.onrender.com/api';

// Generic API request function
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Product API functions
const ProductAPI = {
    // Get all products
    getAll: () => apiRequest('/products'),
    
    // Create new product
    create: (productData) => apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
    }),
    
    // Update product
    update: (id, productData) => apiRequest(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
    }),
    
    // Delete product
    delete: (id) => apiRequest(`/products/${id}`, {
        method: 'DELETE'
    })
};

// Sales API functions
const SalesAPI = {
    // Get all sales
    getAll: () => apiRequest('/sales'),
    
    // Create new sale
    create: (saleData) => apiRequest('/sales', {
        method: 'POST',
        body: JSON.stringify(saleData)
    })
};

// Dashboard API functions
// Dashboard API functions
const DashboardAPI = {
    // Option 1: Use existing reports endpoint (RECOMMENDED - no backend changes needed)
    getStats: () => apiRequest('/reports/dashboard'),
    
    // Option 2: Use dedicated dashboard endpoint (if you registered dashboard routes)
    // getStats: () => apiRequest('/dashboard/stats'),
};


// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}
