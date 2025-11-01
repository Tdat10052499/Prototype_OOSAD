// === DỮ LIỆU MẪU ===
let pets = [
    { id: 101, name: "Mèo Tam Thể", type: "Cat", breed: "Persian", age: 12 },
    { id: 102, name: "Chó Golden", type: "Dog", breed: "Golden Retriever", age: 24 },
    { id: 103, name: "Thỏ Trắng", type: "Rabbit", breed: "Holland Lop", age: 6 },
    { id: 104, name: "Chim Yến", type: "Bird", breed: "Canary", age: 3 },
];

let invoices = [
    { id: 2001, customer: "Nguyễn Văn A", amount: 450, detail: "Spa + Food", date: "2025-10-28" },
    { id: 2002, customer: "Trần Thị B", amount: 1200, detail: "Pet Sales", date: "2025-10-29" },
    { id: 2003, customer: "Lê Văn C", amount: 150, detail: "Vaccination", date: "2025-10-30" },
    { id: 2004, customer: "Phạm Thị D", amount: 300, detail: "Health Checkup", date: "2025-11-01" },
];

let nextPetId = 105;
let nextInvoiceId = 2005;

// === CHỨC NĂNG ĐIỀU HƯỚNG ===

// Chuyển đổi giữa các trang
function showPage(pageId) {
    // Ẩn tất cả các trang
    document.querySelectorAll('.page').forEach(el => {
        el.classList.remove('active');
    });
    
    // Hiển thị trang được chọn
    document.getElementById(pageId + '-page').classList.add('active');
    
    // Cập nhật breadcrumb
    updateBreadcrumb(pageId);
    
    // Cập nhật active nav
    updateActiveNav(pageId);
}

// Cập nhật breadcrumb
function updateBreadcrumb(pageId) {
    const breadcrumb = document.getElementById('current-page');
    const pageNames = {
        'dashboard': 'Dashboard',
        'pets': 'Pet Categories',
        'invoices': 'Invoices'
    };
    breadcrumb.textContent = pageNames[pageId] || 'Dashboard';
}

// Cập nhật navigation active
function updateActiveNav(pageId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const navMap = {
        'dashboard': 0,
        'pets': 1,
        'invoices': 2
    };
    
    const navLinks = document.querySelectorAll('.nav-link');
    if (navLinks[navMap[pageId]]) {
        navLinks[navMap[pageId]].classList.add('active');
    }
}

// Bật/Tắt form modal
function toggleForm(formId) {
    const form = document.getElementById(formId);
    const overlay = document.getElementById('modal-overlay');
    
    if (form.classList.contains('hidden')) {
        form.classList.remove('hidden');
        overlay.classList.add('active');
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    } else {
        form.classList.add('hidden');
        overlay.classList.remove('active');
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Đóng tất cả modal
function closeAllModals() {
    document.querySelectorAll('.form-modal').forEach(modal => {
        modal.classList.add('hidden');
    });
    
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('active');
    overlay.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// === PET MANAGEMENT FUNCTIONS (UC.2.0 - UC.2.4) ===

// UC.2.0: View list of Pet
function renderPetList(data = pets) {
    const tableBody = document.querySelector('#pet-table tbody');
    tableBody.innerHTML = '';
    
    data.forEach(pet => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${pet.id}</td>
            <td>${pet.name}</td>
            <td>${pet.type}</td>
            <td>${pet.breed || 'N/A'}</td>
            <td>${pet.age || 'N/A'} tháng</td>
            <td>
                <div class="table-actions">
                    <button class="action-icon action-edit" onclick="updatePetPrompt(${pet.id})" title="Update Pet (UC.2.3)">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-icon action-delete" onclick="deletePet(${pet.id})" title="Delete Pet (UC.2.4)">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
    });
}

// UC.2.1: Search Pet
function searchPet() {
    const searchTerm = document.getElementById('search-pet').value.toLowerCase();
    const filteredPets = pets.filter(pet =>
        pet.name.toLowerCase().includes(searchTerm) ||
        pet.type.toLowerCase().includes(searchTerm) ||
        (pet.breed && pet.breed.toLowerCase().includes(searchTerm))
    );
    renderPetList(filteredPets);
}

// UC.2.2: Add Pet
function addPet() {
    const name = document.getElementById('pet-name').value;
    const type = document.getElementById('pet-type').value;
    const breed = document.getElementById('pet-breed').value;
    const age = document.getElementById('pet-age').value;

    const newPet = { 
        id: nextPetId++, 
        name, 
        type, 
        breed: breed || null,
        age: age ? parseInt(age) : null
    };
    
    pets.push(newPet);
    renderPetList();
    
    // Refresh charts với dữ liệu mới
    if (charts.petType) {
        refreshCharts();
    }
    
    // Đóng modal và reset form
    toggleForm('pet-form');
    document.querySelector('.pet-form-content').reset();
    
    // Hiển thị thông báo và dialog thành công
    showNotification(`Pet "${name}" đã được thêm thành công!`, 'success');
    showSuccessDialog('Pet Added Successfully!', `${name} (${type}) has been added to the system.`);
}

// UC.2.3: Update Pet
function updatePetPrompt(id) {
    const pet = pets.find(p => p.id === id);
    if (!pet) return;

    const newName = prompt(`Tên mới cho Pet ID ${id} (hiện tại: ${pet.name}):`, pet.name);
    if (newName === null) return;
    
    const newType = prompt(`Loại mới cho Pet ID ${id} (hiện tại: ${pet.type}):`, pet.type);
    if (newType === null) return;
    
    const newBreed = prompt(`Giống mới cho Pet ID ${id} (hiện tại: ${pet.breed || 'N/A'}):`, pet.breed || '');
    if (newBreed === null) return;
    
    const newAge = prompt(`Tuổi mới cho Pet ID ${id} (hiện tại: ${pet.age || 'N/A'} tháng):`, pet.age || '');
    if (newAge === null) return;

    // Cập nhật dữ liệu
    pet.name = newName || pet.name;
    pet.type = newType || pet.type;
    pet.breed = newBreed || pet.breed;
    pet.age = newAge ? parseInt(newAge) : pet.age;
    
    renderPetList();
    showNotification(`Pet "${pet.name}" đã được cập nhật!`, 'success');
    showSuccessDialog('Pet Updated Successfully!', `${pet.name} information has been updated.`);
}

// UC.2.4: Delete Pet
function deletePet(id) {
    const pet = pets.find(p => p.id === id);
    if (!pet) return;
    
    showConfirmDialog(
        'Delete Pet Confirmation',
        `Are you sure you want to delete "${pet.name}" (${pet.type})? This action cannot be undone.`,
        () => {
            pets = pets.filter(p => p.id !== id);
            renderPetList();
            if (charts.petType) {
                refreshCharts();
            }
            showNotification(`Pet "${pet.name}" đã được xóa!`, 'success');
            showSuccessDialog('Pet Deleted Successfully!', `${pet.name} has been removed from the system.`);
        }
    );
}

// === INVOICE MANAGEMENT FUNCTIONS (UC.3.0 - UC.3.5) ===

// UC.3.0: View list of Invoice
function renderInvoiceList(data = invoices) {
    const tableBody = document.querySelector('#invoice-table tbody');
    tableBody.innerHTML = '';
    
    data.forEach(invoice => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${invoice.id}</td>
            <td>${invoice.customer}</td>
            <td>$${invoice.amount.toLocaleString()}</td>
            <td>${invoice.detail}</td>
            <td>${invoice.date}</td>
            <td>
                <div class="table-actions">
                    <button class="action-icon action-view" onclick="viewInvoiceDetail(${invoice.id})" title="View Detail (UC.3.1)">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-icon action-edit" onclick="updateInvoicePrompt(${invoice.id})" title="Update Invoice (UC.3.4)">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-icon action-print" onclick="printInvoice(${invoice.id})" title="Print Invoice (UC.3.5)">
                        <i class="fas fa-print"></i>
                    </button>
                    <button class="action-icon action-delete" onclick="deleteInvoice(${invoice.id})" title="Delete Invoice">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
    });
}

// UC.3.1: View detail of Invoice
function viewInvoiceDetail(id) {
    const invoice = invoices.find(i => i.id === id);
    if (!invoice) return;
    
    const detailMessage = `Invoice Details:
• Customer: ${invoice.customer}
• Amount: $${invoice.amount.toLocaleString()}
• Service: ${invoice.detail}
• Date: ${invoice.date}`;
    
    showSuccessDialog(`Invoice #${invoice.id} Details`, detailMessage);
}

// UC.3.2: Search Invoice
function searchInvoice() {
    const searchTerm = document.getElementById('search-invoice').value.toLowerCase();
    const filteredInvoices = invoices.filter(invoice =>
        invoice.customer.toLowerCase().includes(searchTerm) ||
        invoice.detail.toLowerCase().includes(searchTerm) ||
        String(invoice.id).includes(searchTerm)
    );
    renderInvoiceList(filteredInvoices);
}

// UC.3.3: Add Invoice
function addInvoice() {
    const customer = document.getElementById('customer-name').value;
    const amount = parseFloat(document.getElementById('invoice-amount').value);
    const detail = document.getElementById('invoice-detail').value;

    const newInvoice = { 
        id: nextInvoiceId++, 
        customer, 
        amount,
        detail: detail || "General Service",
        date: new Date().toISOString().split('T')[0] // Current date
    };
    
    invoices.push(newInvoice);
    renderInvoiceList();
    
    // Refresh charts với dữ liệu mới
    if (charts.revenueTrend) {
        refreshCharts();
    }
    
    // Đóng modal và reset form
    toggleForm('invoice-form');
    document.querySelector('.invoice-form-content').reset();
    
    // Hiển thị thông báo và dialog thành công
    showNotification(`Hóa đơn cho "${customer}" đã được tạo thành công!`, 'success');
    showSuccessDialog('Invoice Created Successfully!', `Invoice #${newInvoice.id} for ${customer} ($${amount}) has been created.`);
}

// UC.3.4: Update Invoice
function updateInvoicePrompt(id) {
    const invoice = invoices.find(i => i.id === id);
    if (!invoice) return;

    const newCustomer = prompt(`Tên khách hàng mới cho Invoice ID ${id} (hiện tại: ${invoice.customer}):`, invoice.customer);
    if (newCustomer === null) return;
    
    const newAmount = prompt(`Số tiền mới cho Invoice ID ${id} (hiện tại: $${invoice.amount}):`, invoice.amount);
    if (newAmount === null) return;
    
    const newDetail = prompt(`Chi tiết mới cho Invoice ID ${id} (hiện tại: ${invoice.detail}):`, invoice.detail);
    if (newDetail === null) return;

    // Validate amount
    if (newAmount && isNaN(parseFloat(newAmount))) {
        showNotification("Số tiền không hợp lệ. Vui lòng nhập số hợp lệ.", 'error');
        return;
    }

    // Cập nhật dữ liệu
    invoice.customer = newCustomer || invoice.customer;
    invoice.amount = newAmount ? parseFloat(newAmount) : invoice.amount;
    invoice.detail = newDetail || invoice.detail;
    
    renderInvoiceList();
    showNotification(`Invoice #${id} đã được cập nhật!`, 'success');
    showSuccessDialog('Invoice Updated Successfully!', `Invoice #${id} for ${invoice.customer} has been updated.`);
}

// Delete Invoice
function deleteInvoice(id) {
    const invoice = invoices.find(i => i.id === id);
    if (!invoice) return;
    
    showConfirmDialog(
        'Delete Invoice Confirmation',
        `Are you sure you want to delete Invoice #${id} for "${invoice.customer}" ($${invoice.amount})? This action cannot be undone.`,
        () => {
            invoices = invoices.filter(i => i.id !== id);
            renderInvoiceList();
            if (charts.revenueTrend) {
                refreshCharts();
            }
            showNotification(`Invoice #${id} đã được xóa!`, 'success');
            showSuccessDialog('Invoice Deleted Successfully!', `Invoice #${id} for ${invoice.customer} has been removed from the system.`);
        }
    );
}

// UC.3.5: Print Invoice
function printInvoice(id) {
    const invoice = invoices.find(i => i.id === id);
    if (!invoice) return;
    
    // Simulate print action
    showNotification(`Invoice #${id} đã được gửi đến máy in!`, 'success');
    showSuccessDialog('Invoice Printed Successfully!', `Invoice #${id} for ${invoice.customer} ($${invoice.amount.toLocaleString()}) has been sent to the printer.`);
    
    console.log('Print Invoice:', invoice);
}

// === CHARTS & ANALYTICS ===

// Chart instances
let charts = {};

// Khởi tạo tất cả charts
function initializeCharts() {
    initPetTypeChart();
    initRevenueTrendChart();
    initPetAgeChart();
    initServiceChart();
}

// Pet Type Distribution Pie Chart
function initPetTypeChart() {
    const ctx = document.getElementById('petTypeChart').getContext('2d');
    
    const petTypeCounts = pets.reduce((acc, pet) => {
        acc[pet.type] = (acc[pet.type] || 0) + 1;
        return acc;
    }, {});
    
    charts.petType = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(petTypeCounts),
            datasets: [{
                data: Object.values(petTypeCounts),
                backgroundColor: [
                    '#FF6B6B', // Red
                    '#4ECDC4', // Teal  
                    '#45B7D1', // Blue
                    '#96CEB4', // Green
                    '#FFEAA7', // Yellow
                    '#DDA0DD', // Plum
                    '#98D8C8'  // Mint
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const percentage = ((context.parsed / pets.length) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Revenue Trend Line Chart
function initRevenueTrendChart() {
    const ctx = document.getElementById('revenueTrendChart').getContext('2d');
    
    // Generate sample revenue data for last 7 days
    const revenueData = generateRevenueData();
    
    charts.revenueTrend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: revenueData.labels,
            datasets: [{
                label: 'Daily Revenue ($)',
                data: revenueData.values,
                borderColor: '#1976d2',
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#1976d2',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            }
        }
    });
}

// Pet Age Distribution Bar Chart
function initPetAgeChart() {
    const ctx = document.getElementById('petAgeChart').getContext('2d');
    
    const ageGroups = {
        '0-6 months': 0,
        '6-12 months': 0,
        '1-2 years': 0,
        '2+ years': 0
    };
    
    pets.forEach(pet => {
        const age = pet.age || 0;
        if (age <= 6) ageGroups['0-6 months']++;
        else if (age <= 12) ageGroups['6-12 months']++;
        else if (age <= 24) ageGroups['1-2 years']++;
        else ageGroups['2+ years']++;
    });
    
    charts.petAge = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(ageGroups),
            datasets: [{
                label: 'Number of Pets',
                data: Object.values(ageGroups),
                backgroundColor: [
                    'rgba(255, 107, 107, 0.8)',
                    'rgba(78, 205, 196, 0.8)', 
                    'rgba(69, 183, 209, 0.8)',
                    'rgba(150, 206, 180, 0.8)'
                ],
                borderColor: [
                    'rgba(255, 107, 107, 1)',
                    'rgba(78, 205, 196, 1)',
                    'rgba(69, 183, 209, 1)', 
                    'rgba(150, 206, 180, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Service Types Polar Chart
function initServiceChart() {
    const ctx = document.getElementById('serviceChart').getContext('2d');
    
    const services = {
        'Spa & Grooming': 0,
        'Pet Sales': 0,
        'Vaccination': 0,
        'Health Checkup': 0,
        'Other Services': 0
    };
    
    invoices.forEach(invoice => {
        const detail = invoice.detail.toLowerCase();
        if (detail.includes('spa') || detail.includes('grooming')) services['Spa & Grooming']++;
        else if (detail.includes('sales') || detail.includes('pet')) services['Pet Sales']++;
        else if (detail.includes('vaccination') || detail.includes('vaccine')) services['Vaccination']++;
        else if (detail.includes('checkup') || detail.includes('health')) services['Health Checkup']++;
        else services['Other Services']++;
    });
    
    charts.service = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: Object.keys(services),
            datasets: [{
                data: Object.values(services),
                backgroundColor: [
                    'rgba(255, 107, 107, 0.7)',
                    'rgba(78, 205, 196, 0.7)',
                    'rgba(69, 183, 209, 0.7)',
                    'rgba(150, 206, 180, 0.7)',
                    'rgba(255, 234, 167, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 107, 107, 1)',
                    'rgba(78, 205, 196, 1)',
                    'rgba(69, 183, 209, 1)',
                    'rgba(150, 206, 180, 1)', 
                    'rgba(255, 234, 167, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 10,
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

// Generate sample revenue data
function generateRevenueData() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const values = [];
    
    // Calculate daily revenue from invoices (sample distribution)
    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const avgDaily = totalRevenue / 7;
    
    for (let i = 0; i < 7; i++) {
        // Add some randomness to make it realistic
        const variance = (Math.random() - 0.5) * avgDaily * 0.4;
        values.push(Math.round(avgDaily + variance));
    }
    
    return { labels: days, values: values };
}

// Refresh all charts (auto-called when data changes)
function refreshCharts() {
    // Destroy existing charts
    Object.values(charts).forEach(chart => chart.destroy());
    
    // Reinitialize charts with updated data
    initializeCharts();
}

// === NOTIFICATION SYSTEM ===

// Hiển thị toast notification
function showNotification(message, type = 'info', title = '') {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    
    // Set notification class based on type
    notification.className = `notification ${type}`;
    
    // Choose icon based on type
    const icons = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'warning': 'fas fa-exclamation-triangle',
        'info': 'fas fa-info-circle'
    };
    
    // Set default titles
    const defaultTitles = {
        'success': 'Success!',
        'error': 'Error!',
        'warning': 'Warning!',
        'info': 'Info'
    };
    
    const finalTitle = title || defaultTitles[type];
    const iconClass = icons[type] || icons['info'];
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="${iconClass}"></i>
        </div>
        <div class="notification-content">
            <h4>${finalTitle}</h4>
            <p>${message}</p>
        </div>
        <button class="notification-close" onclick="removeNotification(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification.querySelector('.notification-close'));
    }, 5000);
}

// Remove notification
function removeNotification(closeBtn) {
    const notification = closeBtn.closest('.notification');
    notification.classList.remove('show');
    
    setTimeout(() => {
        notification.remove();
    }, 300);
}

// Show success dialog
function showSuccessDialog(title, message) {
    const overlay = document.getElementById('success-dialog-overlay');
    const titleEl = document.getElementById('success-title');
    const messageEl = document.getElementById('success-message');
    
    titleEl.textContent = title;
    messageEl.textContent = message;
    
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Close success dialog
function closeSuccessDialog() {
    const overlay = document.getElementById('success-dialog-overlay');
    overlay.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Show confirmation dialog
function showConfirmDialog(title, message, onConfirm) {
    const overlay = document.getElementById('confirm-dialog-overlay');
    const titleEl = document.getElementById('confirm-title');
    const messageEl = document.getElementById('confirm-message');
    const confirmBtn = document.getElementById('confirm-yes-btn');
    
    titleEl.textContent = title;
    messageEl.textContent = message;
    
    // Remove existing event listeners
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    // Add new event listener
    newConfirmBtn.addEventListener('click', () => {
        closeConfirmDialog();
        if (onConfirm) {
            onConfirm();
        }
    });
    
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Close confirmation dialog
function closeConfirmDialog() {
    const overlay = document.getElementById('confirm-dialog-overlay');
    overlay.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// === KHỞI TẠO ỨNG DỤNG ===
document.addEventListener('DOMContentLoaded', () => {
    // Hiển thị trang Dashboard mặc định
    showPage('dashboard');
    
    // Load dữ liệu ban đầu
    renderPetList();
    renderInvoiceList();

    // Khởi tạo charts sau khi DOM đã sẵn sàng
    setTimeout(() => {
        initializeCharts();
    }, 100);

    // Event listeners cho Pet Form
    document.querySelector('.pet-form-content').addEventListener('submit', function(e) {
        e.preventDefault();
        addPet();
    });

    // Event listeners cho Invoice Form  
    document.querySelector('.invoice-form-content').addEventListener('submit', function(e) {
        e.preventDefault();
        addInvoice();
    });
    
    // Event listener cho ESC key để đóng modal và dialogs
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
            closeSuccessDialog();
            closeConfirmDialog();
        }
    });
    
    console.log('PETCARE Staff Management System initialized successfully!');
    console.log('Charts initialized with Chart.js library');
});