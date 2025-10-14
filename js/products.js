let allProducts = [];
let editingProductId = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
});

// Load all products
async function loadProducts() {
    try {
        allProducts = await ProductAPI.getAll();
        displayProducts(allProducts);
    } catch (error) {
        showNotification('Error loading products: ' + error.message, 'danger');
    }
}

// Display products in table
function displayProducts(products) {
    const tbody = document.getElementById('productsTable');
    tbody.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        
        // Determine stock status
        let stockBadge = '';
        if (product.stock === 0) {
            stockBadge = '<span class="badge bg-danger">Out of Stock</span>';
        } else if (product.stock < 10) {
            stockBadge = '<span class="badge bg-warning">Low Stock</span>';
        } else {
            stockBadge = '<span class="badge bg-success">In Stock</span>';
        }
        
        row.innerHTML = `
            <td>
                <strong>${product.name}</strong>
                ${product.description ? `<br><small class="text-muted">${product.description}</small>` : ''}
            </td>
            <td><span class="badge bg-secondary">${product.category}</span></td>
            <td>${formatCurrency(product.price)}</td>
            <td>${product.stock}</td>
            <td>${stockBadge}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editProduct('${product._id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct('${product._id}', '${product.name}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    document.getElementById('searchInput').addEventListener('input', filterProducts);
    
    // Filter functionality
    document.getElementById('categoryFilter').addEventListener('change', filterProducts);
    document.getElementById('stockFilter').addEventListener('change', filterProducts);
    
    // Save product button
    document.getElementById('saveProductBtn').addEventListener('click', saveProduct);
    
    // Reset form when modal closes
    document.getElementById('productModal').addEventListener('hidden.bs.modal', function() {
        resetForm();
    });
}

// Filter products based on search and filters
function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const stockFilter = document.getElementById('stockFilter').value;
    
    let filtered = allProducts.filter(product => {
        // Search filter
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            product.description.toLowerCase().includes(searchTerm);
        
        // Category filter
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        
        // Stock filter
        let matchesStock = true;
        if (stockFilter === 'low') {
            matchesStock = product.stock < 10;
        } else if (stockFilter === 'medium') {
            matchesStock = product.stock >= 10 && product.stock <= 50;
        } else if (stockFilter === 'high') {
            matchesStock = product.stock > 50;
        }
        
        return matchesSearch && matchesCategory && matchesStock;
    });
    
    displayProducts(filtered);
}

// Save product (create or update)
async function saveProduct() {
    const form = document.getElementById('productForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const productData = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        description: document.getElementById('productDescription').value,
        barcode: document.getElementById('productBarcode').value
    };
    
    try {
        if (editingProductId) {
            // Update existing product
            await ProductAPI.update(editingProductId, productData);
            showNotification('Product updated successfully!');
        } else {
            // Create new product
            await ProductAPI.create(productData);
            showNotification('Product added successfully!');
        }
        
        // Close modal and reload products
        bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
        await loadProducts();
        
    } catch (error) {
        showNotification('Error saving product: ' + error.message, 'danger');
    }
}

// Edit product
function editProduct(productId) {
    const product = allProducts.find(p => p._id === productId);
    if (!product) return;
    
    editingProductId = productId;
    
    // Fill form with product data
    document.getElementById('productId').value = product._id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productBarcode').value = product.barcode || '';
    
    // Update modal title
    document.getElementById('productModalTitle').textContent = 'Edit Product';
    
    // Show modal
    new bootstrap.Modal(document.getElementById('productModal')).show();
}

// Delete product
async function deleteProduct(productId, productName) {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) {
        return;
    }
    
    try {
        await ProductAPI.delete(productId);
        showNotification('Product deleted successfully!');
        await loadProducts();
    } catch (error) {
        showNotification('Error deleting product: ' + error.message, 'danger');
    }
}

// Reset form
function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productModalTitle').textContent = 'Add New Product';
    editingProductId = null;
}
