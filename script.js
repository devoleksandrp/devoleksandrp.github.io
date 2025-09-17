// Глобальні змінні для зберігання даних
let employees = [];
let applications = [];
let vacations = [];
let dismissals = [];

// Налаштування Telegram
let telegramSettings = {
    botToken: '7702428410:AAHAMD-N5XMyE6rMBlGyttMWMv1rT6rZJXM',
    chatId: '-1002989228607',
    enabled: false
};

// Ініціалізація при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadSampleData();
    loadTelegramSettings();
    updateDashboard();
});

// Ініціалізація додатку
function initializeApp() {
    // Навігація
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
            
            // Оновлення активного посилання
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Пошук працівників
    const searchInput = document.getElementById('employee-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterEmployees(this.value);
        });
    }
}

// Показати секцію
function showSection(sectionId) {
    // Приховати всі секції
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Показати обрану секцію
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Оновити дані в залежності від секції
        switch(sectionId) {
            case 'employees':
                renderEmployeesTable();
                break;
            case 'applications':
                renderApplicationsTable();
                break;
            case 'vacations':
                renderVacationsTable();
                break;
            case 'dismissals':
                renderDismissalsTable();
                break;
            case 'dashboard':
                updateDashboard();
                break;
            case 'settings':
                updateTelegramStatus();
                break;
        }
    }
}

// Оновити головну панель
function updateDashboard() {
    document.getElementById('total-employees').textContent = employees.length;
    document.getElementById('pending-applications').textContent = 
        applications.filter(app => app.status === 'pending').length;
    document.getElementById('active-vacations').textContent = 
        vacations.filter(vac => vac.status === 'active').length;
    document.getElementById('pending-dismissals').textContent = 
        dismissals.filter(dis => dis.status === 'pending').length;
}

// Завантажити тестові дані
function loadSampleData() {
    // Тестові працівники
    employees = [
        {
            id: 1,
            fullName: 'Іваненко Іван Іванович',
            position: 'Менеджер',
            department: 'Продажі',
            hireDate: '2023-01-15',
            status: 'active',
            phone: '+380501234567',
            email: 'ivanenko@company.com'
        },
        {
            id: 2,
            fullName: 'Петренко Петро Петрович',
            position: 'Розробник',
            department: 'IT',
            hireDate: '2023-03-20',
            status: 'active',
            phone: '+380507654321',
            email: 'petrenko@company.com'
        },
        {
            id: 3,
            fullName: 'Сидоренко Сидір Сидорович',
            position: 'Бухгалтер',
            department: 'Фінанси',
            hireDate: '2022-11-10',
            status: 'active',
            phone: '+380509876543',
            email: 'sidorenko@company.com'
        }
    ];

    // Тестові заяви
    applications = [
        {
            id: 1,
            fullName: 'Коваленко Костянтин Костянтинович',
            position: 'Аналітик',
            department: 'Аналітика',
            applicationDate: '2024-01-10',
            status: 'pending',
            phone: '+380501111111',
            email: 'kovalenko@email.com',
            experience: '3 роки',
            education: 'Вища'
        },
        {
            id: 2,
            fullName: 'Морозенко Марія Маріївна',
            position: 'Дизайнер',
            department: 'Маркетинг',
            applicationDate: '2024-01-12',
            status: 'approved',
            phone: '+380502222222',
            email: 'moroz@email.com',
            experience: '2 роки',
            education: 'Вища'
        }
    ];

    // Тестові відпустки
    vacations = [
        {
            id: 1,
            employeeId: 1,
            employeeName: 'Іваненко Іван Іванович',
            type: 'Щорічна',
            startDate: '2024-02-01',
            endDate: '2024-02-14',
            status: 'active',
            days: 14
        },
        {
            id: 2,
            employeeId: 2,
            employeeName: 'Петренко Петро Петрович',
            type: 'Лікарняна',
            startDate: '2024-01-20',
            endDate: '2024-01-25',
            status: 'completed',
            days: 5
        }
    ];

    // Тестові звільнення
    dismissals = [
        {
            id: 1,
            employeeId: 3,
            employeeName: 'Сидоренко Сидір Сидорович',
            reason: 'Власне бажання',
            dismissalDate: '2024-02-15',
            status: 'pending',
            notice: 'Працівник подав заяву на звільнення'
        }
    ];
}

// Рендеринг таблиці працівників
function renderEmployeesTable() {
    const tbody = document.getElementById('employees-tbody');
    tbody.innerHTML = '';

    employees.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${employee.id}</td>
            <td>${employee.fullName}</td>
            <td>${employee.position}</td>
            <td>${employee.department}</td>
            <td>${formatDate(employee.hireDate)}</td>
            <td><span class="status status-active">Активний</span></td>
            <td>
                <button class="btn btn-primary" onclick="editEmployee(${employee.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteEmployee(${employee.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Рендеринг таблиці заяв
function renderApplicationsTable() {
    const tbody = document.getElementById('applications-tbody');
    tbody.innerHTML = '';

    applications.forEach(application => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${application.id}</td>
            <td>${application.fullName}</td>
            <td>${application.position}</td>
            <td>${formatDate(application.applicationDate)}</td>
            <td><span class="status status-${application.status}">${getStatusText(application.status)}</span></td>
            <td>
                <button class="btn btn-success" onclick="approveApplication(${application.id})" 
                        ${application.status !== 'pending' ? 'disabled' : ''}>
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-danger" onclick="rejectApplication(${application.id})"
                        ${application.status !== 'pending' ? 'disabled' : ''}>
                    <i class="fas fa-times"></i>
                </button>
                <button class="btn btn-primary" onclick="viewApplication(${application.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Рендеринг таблиці відпусток
function renderVacationsTable() {
    const tbody = document.getElementById('vacations-tbody');
    tbody.innerHTML = '';

    vacations.forEach(vacation => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${vacation.id}</td>
            <td>${vacation.employeeName}</td>
            <td>${vacation.type}</td>
            <td>${formatDate(vacation.startDate)}</td>
            <td>${formatDate(vacation.endDate)}</td>
            <td><span class="status status-${vacation.status}">${getStatusText(vacation.status)}</span></td>
            <td>
                <button class="btn btn-primary" onclick="editVacation(${vacation.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteVacation(${vacation.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Рендеринг таблиці звільнень
function renderDismissalsTable() {
    const tbody = document.getElementById('dismissals-tbody');
    tbody.innerHTML = '';

    dismissals.forEach(dismissal => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${dismissal.id}</td>
            <td>${dismissal.employeeName}</td>
            <td>${dismissal.reason}</td>
            <td>${formatDate(dismissal.dismissalDate)}</td>
            <td><span class="status status-${dismissal.status}">${getStatusText(dismissal.status)}</span></td>
            <td>
                <button class="btn btn-success" onclick="approveDismissal(${dismissal.id})"
                        ${dismissal.status !== 'pending' ? 'disabled' : ''}>
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-danger" onclick="rejectDismissal(${dismissal.id})"
                        ${dismissal.status !== 'pending' ? 'disabled' : ''}>
                    <i class="fas fa-times"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Показати форму додавання працівника
function showAddEmployeeForm() {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <form id="employee-form">
            <div class="form-row">
                <div class="form-group">
                    <label for="emp-fullName">ПІБ *</label>
                    <input type="text" id="emp-fullName" required>
                </div>
                <div class="form-group">
                    <label for="emp-position">Посада *</label>
                    <input type="text" id="emp-position" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="emp-department">Відділ *</label>
                    <select id="emp-department" required>
                        <option value="">Оберіть відділ</option>
                        <option value="IT">IT</option>
                        <option value="Продажі">Продажі</option>
                        <option value="Маркетинг">Маркетинг</option>
                        <option value="Фінанси">Фінанси</option>
                        <option value="HR">HR</option>
                        <option value="Аналітика">Аналітика</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="emp-hireDate">Дата прийому *</label>
                    <input type="date" id="emp-hireDate" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="emp-phone">Телефон</label>
                    <input type="tel" id="emp-phone" placeholder="+380501234567">
                </div>
                <div class="form-group">
                    <label for="emp-email">Email</label>
                    <input type="email" id="emp-email" placeholder="example@company.com">
                </div>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-primary" onclick="saveEmployee()">Зберегти</button>
                <button type="button" class="btn" onclick="closeModal()">Скасувати</button>
            </div>
        </form>
    `;
    
    document.getElementById('modal-title').textContent = 'Додати працівника';
    showModal();
}

// Показати форму заяви на працевлаштування
function showApplicationForm() {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <form id="application-form">
            <div class="form-row">
                <div class="form-group">
                    <label for="app-fullName">ПІБ *</label>
                    <input type="text" id="app-fullName" required>
                </div>
                <div class="form-group">
                    <label for="app-position">Посада *</label>
                    <input type="text" id="app-position" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="app-department">Відділ *</label>
                    <select id="app-department" required>
                        <option value="">Оберіть відділ</option>
                        <option value="IT">IT</option>
                        <option value="Продажі">Продажі</option>
                        <option value="Маркетинг">Маркетинг</option>
                        <option value="Фінанси">Фінанси</option>
                        <option value="HR">HR</option>
                        <option value="Аналітика">Аналітика</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="app-experience">Досвід роботи</label>
                    <input type="text" id="app-experience" placeholder="2 роки">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="app-phone">Телефон *</label>
                    <input type="tel" id="app-phone" required placeholder="+380501234567">
                </div>
                <div class="form-group">
                    <label for="app-email">Email *</label>
                    <input type="email" id="app-email" required placeholder="example@email.com">
                </div>
            </div>
            <div class="form-group">
                <label for="app-education">Освіта</label>
                <input type="text" id="app-education" placeholder="Вища">
            </div>
            <div class="form-group">
                <label for="app-motivation">Мотиваційний лист</label>
                <textarea id="app-motivation" placeholder="Розкажіть про себе та чому хочете працювати в нашій компанії..."></textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-primary" onclick="saveApplication()">Подати заяву</button>
                <button type="button" class="btn" onclick="closeModal()">Скасувати</button>
            </div>
        </form>
    `;
    
    document.getElementById('modal-title').textContent = 'Заява на працевлаштування';
    showModal();
}

// Показати форму відпустки
function showVacationForm() {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <form id="vacation-form">
            <div class="form-group">
                <label for="vac-employee">Працівник *</label>
                <select id="vac-employee" required>
                    <option value="">Оберіть працівника</option>
                    ${employees.map(emp => `<option value="${emp.id}">${emp.fullName}</option>`).join('')}
                </select>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="vac-type">Тип відпустки *</label>
                    <select id="vac-type" required>
                        <option value="">Оберіть тип</option>
                        <option value="Щорічна">Щорічна</option>
                        <option value="Лікарняна">Лікарняна</option>
                        <option value="Декретна">Декретна</option>
                        <option value="Навчальна">Навчальна</option>
                        <option value="Без збереження зарплати">Без збереження зарплати</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="vac-days">Кількість днів</label>
                    <input type="number" id="vac-days" min="1" max="365">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="vac-startDate">Дата початку *</label>
                    <input type="date" id="vac-startDate" required>
                </div>
                <div class="form-group">
                    <label for="vac-endDate">Дата закінчення *</label>
                    <input type="date" id="vac-endDate" required>
                </div>
            </div>
            <div class="form-group">
                <label for="vac-reason">Причина</label>
                <textarea id="vac-reason" placeholder="Опишіть причину відпустки..."></textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-primary" onclick="saveVacation()">Оформити відпустку</button>
                <button type="button" class="btn" onclick="closeModal()">Скасувати</button>
            </div>
        </form>
    `;
    
    document.getElementById('modal-title').textContent = 'Оформлення відпустки';
    showModal();
}

// Показати форму звільнення
function showDismissalForm() {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <form id="dismissal-form">
            <div class="form-group">
                <label for="dis-employee">Працівник *</label>
                <select id="dis-employee" required>
                    <option value="">Оберіть працівника</option>
                    ${employees.map(emp => `<option value="${emp.id}">${emp.fullName}</option>`).join('')}
                </select>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="dis-reason">Причина звільнення *</label>
                    <select id="dis-reason" required>
                        <option value="">Оберіть причину</option>
                        <option value="Власне бажання">Власне бажання</option>
                        <option value="Порушення трудової дисципліни">Порушення трудової дисципліни</option>
                        <option value="Скорочення штату">Скорочення штату</option>
                        <option value="Невиконання обов'язків">Невиконання обов'язків</option>
                        <option value="Інша причина">Інша причина</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="dis-date">Дата звільнення *</label>
                    <input type="date" id="dis-date" required>
                </div>
            </div>
            <div class="form-group">
                <label for="dis-notice">Примітки</label>
                <textarea id="dis-notice" placeholder="Додаткові відомості про звільнення..."></textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-primary" onclick="saveDismissal()">Оформити звільнення</button>
                <button type="button" class="btn" onclick="closeModal()">Скасувати</button>
            </div>
        </form>
    `;
    
    document.getElementById('modal-title').textContent = 'Оформлення звільнення';
    showModal();
}

// Зберегти працівника
function saveEmployee() {
    const form = document.getElementById('employee-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const newEmployee = {
        id: employees.length + 1,
        fullName: document.getElementById('emp-fullName').value,
        position: document.getElementById('emp-position').value,
        department: document.getElementById('emp-department').value,
        hireDate: document.getElementById('emp-hireDate').value,
        status: 'active',
        phone: document.getElementById('emp-phone').value,
        email: document.getElementById('emp-email').value
    };

    employees.push(newEmployee);
    closeModal();
    renderEmployeesTable();
    updateDashboard();
    showNotification('Працівника успішно додано!', 'success');
    
    // Відправити в Telegram
    sendEmployeeToTelegram(newEmployee);
}

// Зберегти заяву
function saveApplication() {
    const form = document.getElementById('application-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const newApplication = {
        id: applications.length + 1,
        fullName: document.getElementById('app-fullName').value,
        position: document.getElementById('app-position').value,
        department: document.getElementById('app-department').value,
        applicationDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        phone: document.getElementById('app-phone').value,
        email: document.getElementById('app-email').value,
        experience: document.getElementById('app-experience').value,
        education: document.getElementById('app-education').value,
        motivation: document.getElementById('app-motivation').value
    };

    applications.push(newApplication);
    closeModal();
    renderApplicationsTable();
    updateDashboard();
    showNotification('Заяву успішно подано!', 'success');
    
    // Відправити в Telegram
    sendApplicationToTelegram(newApplication);
}

// Зберегти відпустку
function saveVacation() {
    const form = document.getElementById('vacation-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const employeeId = parseInt(document.getElementById('vac-employee').value);
    const employee = employees.find(emp => emp.id === employeeId);

    const newVacation = {
        id: vacations.length + 1,
        employeeId: employeeId,
        employeeName: employee.fullName,
        type: document.getElementById('vac-type').value,
        startDate: document.getElementById('vac-startDate').value,
        endDate: document.getElementById('vac-endDate').value,
        status: 'active',
        days: parseInt(document.getElementById('vac-days').value) || 0,
        reason: document.getElementById('vac-reason').value
    };

    vacations.push(newVacation);
    closeModal();
    renderVacationsTable();
    updateDashboard();
    showNotification('Відпустку успішно оформлено!', 'success');
    
    // Відправити в Telegram
    sendVacationToTelegram(newVacation);
}

// Зберегти звільнення
function saveDismissal() {
    const form = document.getElementById('dismissal-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const employeeId = parseInt(document.getElementById('dis-employee').value);
    const employee = employees.find(emp => emp.id === employeeId);

    const newDismissal = {
        id: dismissals.length + 1,
        employeeId: employeeId,
        employeeName: employee.fullName,
        reason: document.getElementById('dis-reason').value,
        dismissalDate: document.getElementById('dis-date').value,
        status: 'pending',
        notice: document.getElementById('dis-notice').value
    };

    dismissals.push(newDismissal);
    closeModal();
    renderDismissalsTable();
    updateDashboard();
    showNotification('Звільнення успішно оформлено!', 'success');
    
    // Відправити в Telegram
    sendDismissalToTelegram(newDismissal);
}

// Схваліти заяву
function approveApplication(id) {
    const application = applications.find(app => app.id === id);
    if (application) {
        application.status = 'approved';
        
        // Додати працівника до списку
        const newEmployee = {
            id: employees.length + 1,
            fullName: application.fullName,
            position: application.position,
            department: application.department,
            hireDate: new Date().toISOString().split('T')[0],
            status: 'active',
            phone: application.phone,
            email: application.email
        };
        employees.push(newEmployee);
        
        renderApplicationsTable();
        renderEmployeesTable();
        updateDashboard();
        showNotification('Заяву схвалено! Працівника додано до штату.', 'success');
        
        // Відправити в Telegram
        sendEmployeeToTelegram(newEmployee);
    }
}

// Відхилити заяву
function rejectApplication(id) {
    const application = applications.find(app => app.id === id);
    if (application) {
        application.status = 'rejected';
        renderApplicationsTable();
        updateDashboard();
        showNotification('Заяву відхилено.', 'warning');
    }
}

// Схваліти звільнення
function approveDismissal(id) {
    const dismissal = dismissals.find(dis => dis.id === id);
    if (dismissal) {
        dismissal.status = 'approved';
        
        // Видалити працівника зі списку
        employees = employees.filter(emp => emp.id !== dismissal.employeeId);
        
        renderDismissalsTable();
        renderEmployeesTable();
        updateDashboard();
        showNotification('Звільнення схвалено! Працівника видалено зі штату.', 'success');
    }
}

// Відхилити звільнення
function rejectDismissal(id) {
    const dismissal = dismissals.find(dis => dis.id === id);
    if (dismissal) {
        dismissal.status = 'rejected';
        renderDismissalsTable();
        updateDashboard();
        showNotification('Звільнення відхилено.', 'warning');
    }
}

// Переглянути заяву
function viewApplication(id) {
    const application = applications.find(app => app.id === id);
    if (application) {
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <div class="application-details">
                <h4>Деталі заяви</h4>
                <p><strong>ПІБ:</strong> ${application.fullName}</p>
                <p><strong>Посада:</strong> ${application.position}</p>
                <p><strong>Відділ:</strong> ${application.department}</p>
                <p><strong>Телефон:</strong> ${application.phone}</p>
                <p><strong>Email:</strong> ${application.email}</p>
                <p><strong>Досвід:</strong> ${application.experience}</p>
                <p><strong>Освіта:</strong> ${application.education}</p>
                <p><strong>Дата подачі:</strong> ${formatDate(application.applicationDate)}</p>
                <p><strong>Статус:</strong> <span class="status status-${application.status}">${getStatusText(application.status)}</span></p>
                ${application.motivation ? `<p><strong>Мотиваційний лист:</strong><br>${application.motivation}</p>` : ''}
            </div>
            <div class="form-actions">
                <button type="button" class="btn" onclick="closeModal()">Закрити</button>
            </div>
        `;
        
        document.getElementById('modal-title').textContent = 'Деталі заяви';
        showModal();
    }
}

// Редагувати працівника
function editEmployee(id) {
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
        showAddEmployeeForm();
        
        // Заповнити форму даними
        document.getElementById('emp-fullName').value = employee.fullName;
        document.getElementById('emp-position').value = employee.position;
        document.getElementById('emp-department').value = employee.department;
        document.getElementById('emp-hireDate').value = employee.hireDate;
        document.getElementById('emp-phone').value = employee.phone;
        document.getElementById('emp-email').value = employee.email;
        
        // Змінити функцію збереження
        document.querySelector('#employee-form .btn-primary').onclick = function() {
            updateEmployee(id);
        };
    }
}

// Оновити працівника
function updateEmployee(id) {
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
        employee.fullName = document.getElementById('emp-fullName').value;
        employee.position = document.getElementById('emp-position').value;
        employee.department = document.getElementById('emp-department').value;
        employee.hireDate = document.getElementById('emp-hireDate').value;
        employee.phone = document.getElementById('emp-phone').value;
        employee.email = document.getElementById('emp-email').value;
        
        closeModal();
        renderEmployeesTable();
        showNotification('Дані працівника оновлено!', 'success');
    }
}

// Видалити працівника
function deleteEmployee(id) {
    if (confirm('Ви впевнені, що хочете видалити цього працівника?')) {
        employees = employees.filter(emp => emp.id !== id);
        renderEmployeesTable();
        updateDashboard();
        showNotification('Працівника видалено!', 'warning');
    }
}

// Редагувати відпустку
function editVacation(id) {
    const vacation = vacations.find(vac => vac.id === id);
    if (vacation) {
        showVacationForm();
        
        // Заповнити форму даними
        document.getElementById('vac-employee').value = vacation.employeeId;
        document.getElementById('vac-type').value = vacation.type;
        document.getElementById('vac-startDate').value = vacation.startDate;
        document.getElementById('vac-endDate').value = vacation.endDate;
        document.getElementById('vac-days').value = vacation.days;
        document.getElementById('vac-reason').value = vacation.reason;
        
        // Змінити функцію збереження
        document.querySelector('#vacation-form .btn-primary').onclick = function() {
            updateVacation(id);
        };
    }
}

// Оновити відпустку
function updateVacation(id) {
    const vacation = vacations.find(vac => vac.id === id);
    if (vacation) {
        vacation.type = document.getElementById('vac-type').value;
        vacation.startDate = document.getElementById('vac-startDate').value;
        vacation.endDate = document.getElementById('vac-endDate').value;
        vacation.days = parseInt(document.getElementById('vac-days').value) || 0;
        vacation.reason = document.getElementById('vac-reason').value;
        
        closeModal();
        renderVacationsTable();
        showNotification('Дані відпустки оновлено!', 'success');
    }
}

// Видалити відпустку
function deleteVacation(id) {
    if (confirm('Ви впевнені, що хочете видалити цю відпустку?')) {
        vacations = vacations.filter(vac => vac.id !== id);
        renderVacationsTable();
        updateDashboard();
        showNotification('Відпустку видалено!', 'warning');
    }
}

// Фільтрувати працівників
function filterEmployees(searchTerm) {
    const tbody = document.getElementById('employees-tbody');
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm.toLowerCase())) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Показати модальне вікно
function showModal() {
    document.getElementById('modal-overlay').classList.add('active');
}

// Закрити модальне вікно
function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

// Форматувати дату
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA');
}

// Отримати текст статусу
function getStatusText(status) {
    const statusMap = {
        'pending': 'На розгляді',
        'approved': 'Схвалено',
        'rejected': 'Відхилено',
        'active': 'Активний',
        'completed': 'Завершено'
    };
    return statusMap[status] || status;
}

// Показати повідомлення
function showNotification(message, type = 'info') {
    // Створити елемент повідомлення
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Стилі для повідомлення
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1001;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    // Кольори залежно від типу
    const colors = {
        'success': '#27ae60',
        'warning': '#f39c12',
        'error': '#e74c3c',
        'info': '#3498db'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Додати анімацію
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Додати до DOM
    document.body.appendChild(notification);
    
    // Видалити через 3 секунди
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 300);
    }, 3000);
}

// Закрити модальне вікно при кліку поза ним
document.addEventListener('click', function(e) {
    const modal = document.getElementById('modal-overlay');
    if (e.target === modal) {
        closeModal();
    }
});

// Обробка клавіші Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// ==================== TELEGRAM ФУНКЦІЇ ====================

// Завантажити налаштування Telegram
function loadTelegramSettings() {
    const saved = localStorage.getItem('telegramSettings');
    if (saved) {
        telegramSettings = JSON.parse(saved);
        updateTelegramSettingsForm();
    }
}

// Зберегти налаштування Telegram
function saveTelegramSettings() {
    const botToken = document.getElementById('bot-token').value.trim();
    const chatId = document.getElementById('chat-id').value.trim();
    const enabled = document.getElementById('telegram-enabled').checked;

    if (!botToken || !chatId) {
        showNotification('Будь ласка, заповніть всі обов\'язкові поля', 'error');
        return;
    }

    telegramSettings = {
        botToken: botToken,
        chatId: chatId,
        enabled: enabled
    };

    localStorage.setItem('telegramSettings', JSON.stringify(telegramSettings));
    showNotification('Налаштування Telegram збережено!', 'success');
    updateTelegramStatus();
}

// Оновити форму налаштувань Telegram
function updateTelegramSettingsForm() {
    if (document.getElementById('bot-token')) {
        document.getElementById('bot-token').value = telegramSettings.botToken;
        document.getElementById('chat-id').value = telegramSettings.chatId;
        document.getElementById('telegram-enabled').checked = telegramSettings.enabled;
        updateTelegramStatus();
    }
}

// Оновити статус Telegram
function updateTelegramStatus() {
    const settingsCard = document.querySelector('.settings-card');
    if (!settingsCard) return;

    let statusElement = document.getElementById('telegram-status');
    if (!statusElement) {
        statusElement = document.createElement('div');
        statusElement.id = 'telegram-status';
        settingsCard.insertBefore(statusElement, settingsCard.querySelector('form'));
    }

    if (telegramSettings.enabled && telegramSettings.botToken && telegramSettings.chatId) {
        statusElement.className = 'telegram-status connected';
        statusElement.innerHTML = '<i class="fas fa-check-circle"></i> Telegram підключено та активний';
    } else {
        statusElement.className = 'telegram-status disconnected';
        statusElement.innerHTML = '<i class="fas fa-exclamation-circle"></i> Telegram не налаштовано';
    }
}

// Тест з'єднання з Telegram
async function testTelegramConnection() {
    const botToken = document.getElementById('bot-token').value.trim();
    const chatId = document.getElementById('chat-id').value.trim();

    if (!botToken || !chatId) {
        showNotification('Будь ласка, заповніть Bot Token та Chat ID', 'error');
        return;
    }

    const testMessage = `🧪 Тест повідомлення з системи кадрового обліку\n\nЧас: ${new Date().toLocaleString('uk-UA')}\nСтатус: ✅ З\'єднання успішне!`;

    try {
        await sendTelegramMessage(testMessage, botToken, chatId);
        showNotification('Тест повідомлення успішно відправлено!', 'success');
    } catch (error) {
        showNotification('Помилка відправки: ' + error.message, 'error');
    }
}

// Відправити повідомлення в Telegram
async function sendTelegramMessage(message, botToken = null, chatId = null) {
    const token = botToken || telegramSettings.botToken;
    const chat = chatId || telegramSettings.chatId;

    if (!token || !chat || !telegramSettings.enabled) {
        throw new Error('Telegram не налаштовано');
    }

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const data = {
        chat_id: chat,
        text: message,
        parse_mode: 'HTML'
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.description || 'Помилка відправки повідомлення');
    }

    return await response.json();
}

// Форматувати заяву для Telegram
function formatApplicationForTelegram(application) {
    return `📝 <b>НОВА ЗАЯВА НА ПРАЦЕВЛАШТУВАННЯ</b>

👤 <b>ПІБ:</b> ${application.fullName}
💼 <b>Посада:</b> ${application.position}
🏢 <b>Відділ:</b> ${application.department}
📞 <b>Телефон:</b> ${application.phone}
📧 <b>Email:</b> ${application.email}
📅 <b>Дата подачі:</b> ${formatDate(application.applicationDate)}

${application.experience ? `💼 <b>Досвід:</b> ${application.experience}` : ''}
${application.education ? `🎓 <b>Освіта:</b> ${application.education}` : ''}

${application.motivation ? `💬 <b>Мотиваційний лист:</b>\n${application.motivation}` : ''}

🆔 <b>ID заяви:</b> ${application.id}
⏰ <b>Час:</b> ${new Date().toLocaleString('uk-UA')}`;
}

// Форматувати відпустку для Telegram
function formatVacationForTelegram(vacation) {
    return `🏖️ <b>НОВА ВІДПУСТКА</b>

👤 <b>Працівник:</b> ${vacation.employeeName}
📋 <b>Тип:</b> ${vacation.type}
📅 <b>Дата початку:</b> ${formatDate(vacation.startDate)}
📅 <b>Дата закінчення:</b> ${formatDate(vacation.endDate)}
📊 <b>Кількість днів:</b> ${vacation.days}

${vacation.reason ? `💬 <b>Причина:</b> ${vacation.reason}` : ''}

🆔 <b>ID відпустки:</b> ${vacation.id}
⏰ <b>Час:</b> ${new Date().toLocaleString('uk-UA')}`;
}

// Форматувати звільнення для Telegram
function formatDismissalForTelegram(dismissal) {
    return `🚪 <b>НОВЕ ЗВІЛЬНЕННЯ</b>

👤 <b>Працівник:</b> ${dismissal.employeeName}
📋 <b>Причина:</b> ${dismissal.reason}
📅 <b>Дата звільнення:</b> ${formatDate(dismissal.dismissalDate)}

${dismissal.notice ? `💬 <b>Примітки:</b> ${dismissal.notice}` : ''}

🆔 <b>ID звільнення:</b> ${dismissal.id}
⏰ <b>Час:</b> ${new Date().toLocaleString('uk-UA')}`;
}

// Форматувати додавання працівника для Telegram
function formatEmployeeForTelegram(employee) {
    return `👥 <b>НОВИЙ ПРАЦІВНИК</b>

👤 <b>ПІБ:</b> ${employee.fullName}
💼 <b>Посада:</b> ${employee.position}
🏢 <b>Відділ:</b> ${employee.department}
📅 <b>Дата прийому:</b> ${formatDate(employee.hireDate)}

${employee.phone ? `📞 <b>Телефон:</b> ${employee.phone}` : ''}
${employee.email ? `📧 <b>Email:</b> ${employee.email}` : ''}

🆔 <b>ID працівника:</b> ${employee.id}
⏰ <b>Час:</b> ${new Date().toLocaleString('uk-UA')}`;
}

// Відправити заяву в Telegram
async function sendApplicationToTelegram(application) {
    if (!telegramSettings.enabled) return;

    try {
        const message = formatApplicationForTelegram(application);
        await sendTelegramMessage(message);
    } catch (error) {
        console.error('Помилка відправки заяви в Telegram:', error);
        showNotification('Не вдалося відправити заяву в Telegram', 'warning');
    }
}

// Відправити відпустку в Telegram
async function sendVacationToTelegram(vacation) {
    if (!telegramSettings.enabled) return;

    try {
        const message = formatVacationForTelegram(vacation);
        await sendTelegramMessage(message);
    } catch (error) {
        console.error('Помилка відправки відпустки в Telegram:', error);
        showNotification('Не вдалося відправити відпустку в Telegram', 'warning');
    }
}

// Відправити звільнення в Telegram
async function sendDismissalToTelegram(dismissal) {
    if (!telegramSettings.enabled) return;

    try {
        const message = formatDismissalForTelegram(dismissal);
        await sendTelegramMessage(message);
    } catch (error) {
        console.error('Помилка відправки звільнення в Telegram:', error);
        showNotification('Не вдалося відправити звільнення в Telegram', 'warning');
    }
}

// Відправити працівника в Telegram
async function sendEmployeeToTelegram(employee) {
    if (!telegramSettings.enabled) return;

    try {
        const message = formatEmployeeForTelegram(employee);
        await sendTelegramMessage(message);
    } catch (error) {
        console.error('Помилка відправки працівника в Telegram:', error);
        showNotification('Не вдалося відправити дані працівника в Telegram', 'warning');
    }
}
