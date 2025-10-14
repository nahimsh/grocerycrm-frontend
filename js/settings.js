// ============================================
// GLOBAL SETTINGS MANAGER
// ============================================

const SettingsManager = {
    settings: null,
    
    // Load settings from backend
    async load() {
        try {
            const response = await fetch('http://localhost:5000/api/settings');
            if (response.ok) {
                this.settings = await response.json();
                console.log('✅ Settings loaded:', this.settings);
                return this.settings;
            } else {
                console.warn('⚠️ Settings not found, using defaults');
                this.settings = this.getDefaults();
                return this.settings;
            }
        } catch (error) {
            console.error('❌ Failed to load settings:', error);
            this.settings = this.getDefaults();
            return this.settings;
        }
    },
    
    // Get default settings
    getDefaults() {
        return {
            general: {
                storeName: 'GroceryCRM',
                currency: 'INR',
                currencySymbol: '₹',
                timezone: 'Asia/Kolkata',
                dateFormat: 'DD/MM/YYYY'
            },
            business: {
                name: '',
                address: '',
                phone: '',
                email: '',
                gstNumber: '',
                panNumber: ''
            },
            notifications: {
                lowStockAlert: true,
                outOfStockAlert: true
            },
            inventory: {
                autoDeductStock: true,
                allowNegativeStock: false
            },
            receipt: {
                headerText: 'Thank you for your purchase!',
                footerText: 'Please visit again',
                showGST: true,
                autoPrint: false
            },
            payments: {
                enableCash: true,
                enableCard: true,
                enableUPI: true,
                enableCredit: true,
                creditLimit: 50000
            }
        };
    },
    
    // Get specific setting value
    get(path) {
        if (!this.settings) return null;
        const keys = path.split('.');
        let value = this.settings;
        for (const key of keys) {
            value = value?.[key];
        }
        return value;
    },
    
    // Format currency
    formatCurrency(amount) {
        const symbol = this.get('general.currencySymbol') || '₹';
        return `${symbol}${parseFloat(amount).toFixed(2)}`;
    },
    
    // Format date
    formatDate(date) {
        const format = this.get('general.dateFormat') || 'DD/MM/YYYY';
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        
        if (format === 'MM/DD/YYYY') {
            return `${month}/${day}/${year}`;
        }
        return `${day}/${month}/${year}`; // DD/MM/YYYY
    }
};

// Auto-load settings when script is included
(async function() {
    await SettingsManager.load();
})();
