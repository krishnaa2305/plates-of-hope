// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinkItems = navLinks.querySelectorAll('.nav-link');
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });
}

// Password Toggle
const passwordToggle = document.querySelector('.password-toggle');
const passwordInput = document.querySelector('#password');

if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = passwordToggle.querySelector('i');
        if (type === 'password') {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        } else {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    });
}

// Form Submissions
const donateForm = document.querySelector('#donateForm');
const requestForm = document.querySelector('#requestForm');

if (donateForm) {
    donateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            address: document.getElementById('address').value,
            quantity: document.getElementById('quantity').value,
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value
        };
        
        // Here you would normally send this to a server
        console.log('Donation submitted:', formData);
        
        // Generate confirmation number
        const confirmationNumber = 'DON-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-6);
        
        // Store donation data in sessionStorage to pass to confirmation page
        sessionStorage.setItem('donationData', JSON.stringify(formData));
        sessionStorage.setItem('confirmationNumber', confirmationNumber);
        
        // Save donation to localStorage for My Donations page
        const donationRecord = {
            ...formData,
            confirmationNumber: confirmationNumber,
            date: new Date().toISOString(),
            status: 'Pending'
        };
        
        // Get existing donations from localStorage
        let donations = JSON.parse(localStorage.getItem('userDonations') || '[]');
        donations.unshift(donationRecord); // Add new donation at the beginning
        localStorage.setItem('userDonations', JSON.stringify(donations));
        
        // Redirect to confirmation page
        window.location.href = 'donation-confirmation.html';
    });
}

if (requestForm) {
    requestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            address: document.getElementById('req-address').value,
            quantity: document.getElementById('req-quantity').value,
            ngoName: document.getElementById('ngo-name').value,
            phone: document.getElementById('req-phone').value
        };
        
        // Here you would normally send this to a server
        console.log('Food request submitted:', formData);
        
        // Generate request number
        const requestNumber = 'REQ-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-6);
        
        // Store request data in sessionStorage to pass to confirmation page
        sessionStorage.setItem('requestData', JSON.stringify(formData));
        sessionStorage.setItem('requestNumber', requestNumber);
        
        // Redirect to confirmation page
        window.location.href = 'request-confirmation.html';
    });
}

// Login Form
const loginForm = document.querySelector('.login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Here you would normally send this to a server
        console.log('Login attempt:', { email, password });
        
        // Store login info for regular login
        const accountData = {
            name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
            email: email
        };
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('lastLoggedInAccount', JSON.stringify(accountData));
        localStorage.setItem('lastLoggedInProvider', 'email');
        localStorage.setItem('showLoginSuccess', 'true');
        localStorage.setItem('loginSuccessAccount', JSON.stringify(accountData));
        
        // Redirect to home page
        window.location.href = 'index.html';
    });
}

// Signup Form
const signupForm = document.querySelector('#signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        // Here you would normally send this to a server
        console.log('Signup attempt:', { name, email, password });
        
        // Show success message
        alert('Account created successfully! Redirecting to login...');
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    });
}

// Account Selection Modal
const accountModal = document.getElementById('accountModal');
const modalTitle = document.getElementById('modalTitle');
const accountList = document.getElementById('accountList');
const closeModal = document.getElementById('closeModal');
const addAccountBtn = document.getElementById('addAccountBtn');

let currentProvider = null; // 'google' or 'facebook'

// Function to show modal
function showAccountModal(provider, accounts) {
    currentProvider = provider;
    
    // Set modal title
    modalTitle.textContent = `Select a ${provider === 'google' ? 'Google' : 'Facebook'} account`;
    
    // Clear existing accounts
    accountList.innerHTML = '';
    
    if (accounts && accounts.length > 0) {
        accounts.forEach((account, index) => {
            const accountItem = document.createElement('div');
            accountItem.className = 'account-item';
            accountItem.dataset.index = index;
            
            const avatar = document.createElement('div');
            avatar.className = `account-avatar ${provider}`;
            avatar.textContent = account.name.charAt(0).toUpperCase();
            
            const accountInfo = document.createElement('div');
            accountInfo.className = 'account-info';
            
            const accountName = document.createElement('div');
            accountName.className = 'account-name';
            accountName.textContent = account.name;
            
            const accountEmail = document.createElement('div');
            accountEmail.className = 'account-email';
            accountEmail.textContent = account.email;
            
            accountInfo.appendChild(accountName);
            accountInfo.appendChild(accountEmail);
            
            accountItem.appendChild(avatar);
            accountItem.appendChild(accountInfo);
            
            accountItem.addEventListener('click', () => {
                handleAccountLogin(provider, account);
            });
            
            accountList.appendChild(accountItem);
        });
    } else {
        const noAccount = document.createElement('div');
        noAccount.style.padding = '20px';
        noAccount.style.textAlign = 'center';
        noAccount.style.color = 'var(--text-secondary)';
        noAccount.textContent = `No ${provider === 'google' ? 'Google' : 'Facebook'} accounts found. Please sign in to your browser.`;
        accountList.appendChild(noAccount);
    }
    
    accountModal.classList.add('active');
}

// Function to close modal
function closeAccountModal() {
    accountModal.classList.remove('active');
    currentProvider = null;
}

// Close modal handlers
if (closeModal) {
    closeModal.addEventListener('click', closeAccountModal);
}

if (accountModal) {
    accountModal.addEventListener('click', (e) => {
        if (e.target === accountModal) {
            closeAccountModal();
        }
    });
}

// Add account button handler
if (addAccountBtn) {
    addAccountBtn.addEventListener('click', () => {
        closeAccountModal();
        // Open new account login flow
        if (currentProvider === 'google') {
            window.open('https://accounts.google.com/signin', '_blank');
        } else if (currentProvider === 'facebook') {
            window.open('https://www.facebook.com/login', '_blank');
        }
    });
}

// Function to detect Google accounts (using Google Identity Services)
async function detectGoogleAccounts() {
    try {
        // Wait for Google Identity Services to load
        await waitForGoogle();
        
        // Check if Google Identity Services is available
        if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
            // Try to get accounts using Credential Manager API or Chrome's account manager
            // Note: Direct account list access requires proper OAuth setup
            // For now, we'll check browser storage and use mock data
            
            // Check if we have stored accounts from previous logins
            const stored = getStoredAccounts('google');
            if (stored && stored.length > 0) {
                return stored;
            }
            
            // Try to get from Chrome's credential manager (if available)
            if (navigator.credentials && navigator.credentials.get) {
                try {
                    const cred = await navigator.credentials.get({
                        password: true,
                        federated: {
                            providers: ['https://accounts.google.com']
                        }
                    });
                    if (cred) {
                        return [{
                            name: cred.name || 'Google User',
                            email: cred.id || 'user@gmail.com'
                        }];
                    }
                } catch (e) {
                    console.log('Credential manager not available');
                }
            }
            
            // Fallback to mock accounts for demo
            // In production, you would use Google Identity Services with proper OAuth
            return getMockGoogleAccounts();
        } else {
            // Fallback: Try to get from localStorage or use mock accounts
            return getStoredAccounts('google') || getMockGoogleAccounts();
        }
    } catch (error) {
        console.error('Error detecting Google accounts:', error);
        return getStoredAccounts('google') || getMockGoogleAccounts();
    }
}

// Wait for Google Identity Services to load
function waitForGoogle() {
    return new Promise((resolve) => {
        if (typeof google !== 'undefined' && google.accounts) {
            resolve();
        } else {
            let attempts = 0;
            const checkInterval = setInterval(() => {
                attempts++;
                if (typeof google !== 'undefined' && google.accounts) {
                    clearInterval(checkInterval);
                    resolve();
                } else if (attempts > 50) { // 5 seconds timeout
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
        }
    });
}

// Function to detect Facebook accounts
async function detectFacebookAccounts() {
    try {
        // Wait for Facebook SDK to load
        await waitForFacebook();
        
        // Check if Facebook SDK is loaded
        if (typeof FB !== 'undefined') {
            return new Promise((resolve) => {
                // Initialize FB if not already done
                if (!FB.getLoginStatus) {
                    FB.init({
                        appId: 'YOUR_FACEBOOK_APP_ID', // Replace with your actual app ID
                        cookie: true,
                        xfbml: true,
                        version: 'v18.0'
                    });
                }
                
                FB.getLoginStatus((response) => {
                    if (response.status === 'connected') {
                        // Get user info
                        FB.api('/me', { fields: 'name,email' }, (user) => {
                            if (user && !user.error) {
                                resolve([{
                                    name: user.name,
                                    email: user.email || `user${user.id}@facebook.com`,
                                    id: user.id
                                }]);
                            } else {
                                resolve(getStoredAccounts('facebook') || getMockFacebookAccounts());
                            }
                        });
                    } else {
                        // Check stored accounts first
                        const stored = getStoredAccounts('facebook');
                        if (stored && stored.length > 0) {
                            resolve(stored);
                        } else {
                            // Fallback to mock accounts
                            resolve(getMockFacebookAccounts());
                        }
                    }
                });
            });
        } else {
            // Fallback: Try to get from localStorage or use mock accounts
            return getStoredAccounts('facebook') || getMockFacebookAccounts();
        }
    } catch (error) {
        console.error('Error detecting Facebook accounts:', error);
        return getStoredAccounts('facebook') || getMockFacebookAccounts();
    }
}

// Wait for Facebook SDK to load
function waitForFacebook() {
    return new Promise((resolve) => {
        if (typeof FB !== 'undefined') {
            resolve();
        } else {
            let attempts = 0;
            const checkInterval = setInterval(() => {
                attempts++;
                if (typeof FB !== 'undefined') {
                    clearInterval(checkInterval);
                    resolve();
                } else if (attempts > 50) { // 5 seconds timeout
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
        }
    });
}

// Get stored accounts from localStorage
function getStoredAccounts(provider) {
    try {
        const stored = localStorage.getItem(`${provider}_accounts`);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('Error reading stored accounts:', error);
    }
    return null;
}

// Mock Google accounts (for demo purposes)
// In production, these would be detected from the actual Google sign-in
// You can customize this function to check browser's stored accounts or use Google Identity Services
function getMockGoogleAccounts() {
    // Try to detect accounts from browser's credential store
    // This is a simplified version - real implementation would use Google Identity Services
    
    // Check if there are any stored credentials
    const storedAccounts = [];
    
    // For demo, we'll show common patterns
    // In production, replace this with actual Google Identity Services API call
    const mockAccounts = [
        { name: 'Krishna Chauhan', email: 'krishnaachauhan0309@gmail.com' },
        { name: 'Krishna Chauhan (College)', email: 'bca23135@glbim.ac.in' }
    ];
    
    // You can add logic here to check browser's credential manager
    // or use Google Identity Services to get actual signed-in accounts
    
    return storedAccounts.length > 0 ? storedAccounts : mockAccounts;
}

// Mock Facebook accounts (for demo purposes)
function getMockFacebookAccounts() {
    const mockAccounts = [
        { name: 'John Doe', email: 'john.doe@facebook.com', id: '123456' },
        { name: 'Jane Smith', email: 'jane.smith@facebook.com', id: '789012' }
    ];
    
    return mockAccounts;
}

// Handle account login
function handleAccountLogin(provider, account) {
    console.log(`Logging in with ${provider} account:`, account);
    
    // Store selected account
    localStorage.setItem('lastLoggedInProvider', provider);
    localStorage.setItem('lastLoggedInAccount', JSON.stringify(account));
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('showLoginSuccess', 'true');
    localStorage.setItem('loginSuccessAccount', JSON.stringify(account));
    
    // Close modal
    closeAccountModal();
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Check login status and update navbar
function updateNavbarForLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginNavLink = document.getElementById('loginNavLink');
    const profileDropdown = document.getElementById('profileDropdown');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileProvider = document.getElementById('profileProvider');
    
    if (isLoggedIn) {
        // Hide login link, show profile
        if (loginNavLink) loginNavLink.style.display = 'none';
        if (profileDropdown) {
            profileDropdown.style.display = 'block';
            
            // Get account info
            const accountStr = localStorage.getItem('lastLoggedInAccount');
            const provider = localStorage.getItem('lastLoggedInProvider');
            
            if (accountStr) {
                try {
                    const account = JSON.parse(accountStr);
                    if (profileName) profileName.textContent = account.name || 'User';
                    if (profileEmail) profileEmail.textContent = account.email || 'user@example.com';
                    if (profileProvider) {
                        profileProvider.textContent = provider ? `${provider} account` : '';
                    }
                    
                    // Update avatar with first letter
                    const avatar = profileDropdown.querySelector('.profile-avatar');
                    if (avatar && account.name) {
                        avatar.innerHTML = account.name.charAt(0).toUpperCase();
                    }
                } catch (e) {
                    console.error('Error parsing account:', e);
                }
            }
        }
    } else {
        // Show login link, hide profile
        if (loginNavLink) loginNavLink.style.display = 'block';
        if (profileDropdown) profileDropdown.style.display = 'none';
    }
}

// Profile dropdown toggle
const profileBtn = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');

if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!profileDropdown.contains(e.target)) {
            profileDropdown.classList.remove('active');
        }
    });
}

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Clear login data
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('lastLoggedInProvider');
        localStorage.removeItem('lastLoggedInAccount');
        
        // Update navbar
        updateNavbarForLogin();
        
        // Show message
        alert('You have been logged out successfully!');
        
        // Close dropdown
        if (profileDropdown) {
            profileDropdown.classList.remove('active');
        }
        
        // Refresh page or redirect to home
        window.location.href = 'index.html';
    });
}

// Initialize navbar on page load
document.addEventListener('DOMContentLoaded', () => {
    updateNavbarForLogin();
    loadDonationConfirmation();
    loadRequestConfirmation();
    loadMyDonations();
    showLoginSuccessModal();
});

// Show login success modal
function showLoginSuccessModal() {
    const showModal = localStorage.getItem('showLoginSuccess');
    if (showModal === 'true') {
        const modal = document.getElementById('loginSuccessModal');
        const userNameEl = document.getElementById('loginUserName');
        const userEmailEl = document.getElementById('loginUserEmail');
        const closeBtn = document.getElementById('closeLoginModal');
        
        if (modal) {
            // Get account info
            const accountStr = localStorage.getItem('loginSuccessAccount');
            if (accountStr) {
                try {
                    const account = JSON.parse(accountStr);
                    if (userNameEl) userNameEl.textContent = account.name || 'User';
                    if (userEmailEl) userEmailEl.textContent = account.email || 'user@example.com';
                } catch (e) {
                    console.error('Error parsing account:', e);
                }
            }
            
            // Show modal
            modal.classList.add('active');
            
            // Close modal on button click
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    modal.classList.remove('active');
                    localStorage.removeItem('showLoginSuccess');
                    localStorage.removeItem('loginSuccessAccount');
                });
            }
            
            // Close modal on background click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    localStorage.removeItem('showLoginSuccess');
                    localStorage.removeItem('loginSuccessAccount');
                }
            });
            
            // Auto close after 5 seconds
            setTimeout(() => {
                modal.classList.remove('active');
                localStorage.removeItem('showLoginSuccess');
                localStorage.removeItem('loginSuccessAccount');
            }, 5000);
        }
    }
}

// Load donation confirmation data
function loadDonationConfirmation() {
    // Check if we're on the confirmation page
    if (window.location.pathname.includes('donation-confirmation.html')) {
        const donationDataStr = sessionStorage.getItem('donationData');
        const confirmationNumber = sessionStorage.getItem('confirmationNumber');
        
        if (donationDataStr) {
            try {
                const donationData = JSON.parse(donationDataStr);
                
                // Populate confirmation details
                const donorNameEl = document.getElementById('donorName');
                const donorPhoneEl = document.getElementById('donorPhone');
                const donorAddressEl = document.getElementById('donorAddress');
                const donationQuantityEl = document.getElementById('donationQuantity');
                const submissionDateEl = document.getElementById('submissionDate');
                const confirmationNumberEl = document.getElementById('confirmationNumber');
                
                if (donorNameEl) donorNameEl.textContent = donationData.name || '-';
                if (donorPhoneEl) donorPhoneEl.textContent = donationData.phone || '-';
                if (donorAddressEl) donorAddressEl.textContent = donationData.address || '-';
                if (donationQuantityEl) donationQuantityEl.textContent = donationData.quantity || '-';
                if (confirmationNumberEl && confirmationNumber) {
                    confirmationNumberEl.textContent = confirmationNumber;
                }
                
                // Set submission date
                if (submissionDateEl) {
                    const now = new Date();
                    const dateStr = now.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    });
                    submissionDateEl.textContent = dateStr;
                }
            } catch (e) {
                console.error('Error loading donation data:', e);
                // If data is missing, redirect to donate page
                alert('No donation data found. Redirecting to donation page...');
                window.location.href = 'donate.html';
            }
        } else {
            // If no data, redirect to donate page
            alert('No donation data found. Redirecting to donation page...');
            window.location.href = 'donate.html';
        }
    }
}

// Load request confirmation data
function loadRequestConfirmation() {
    // Check if we're on the request confirmation page
    if (window.location.pathname.includes('request-confirmation.html')) {
        const requestDataStr = sessionStorage.getItem('requestData');
        const requestNumber = sessionStorage.getItem('requestNumber');
        
        if (requestDataStr) {
            try {
                const requestData = JSON.parse(requestDataStr);
                
                // Populate confirmation details
                const ngoNameEl = document.getElementById('ngoName');
                const requestPhoneEl = document.getElementById('requestPhone');
                const requestAddressEl = document.getElementById('requestAddress');
                const requestQuantityEl = document.getElementById('requestQuantity');
                const requestDateEl = document.getElementById('requestDate');
                const requestNumberEl = document.getElementById('requestNumber');
                
                if (ngoNameEl) ngoNameEl.textContent = requestData.ngoName || '-';
                if (requestPhoneEl) requestPhoneEl.textContent = requestData.phone || '-';
                if (requestAddressEl) requestAddressEl.textContent = requestData.address || '-';
                if (requestQuantityEl) requestQuantityEl.textContent = requestData.quantity || '-';
                if (requestNumberEl && requestNumber) {
                    requestNumberEl.textContent = requestNumber;
                }
                
                // Set submission date
                if (requestDateEl) {
                    const now = new Date();
                    const dateStr = now.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    });
                    requestDateEl.textContent = dateStr;
                }
            } catch (e) {
                console.error('Error loading request data:', e);
                // If data is missing, redirect to request page
                alert('No request data found. Redirecting to request page...');
                window.location.href = 'request.html';
            }
        } else {
            // If no data, redirect to request page
            alert('No request data found. Redirecting to request page...');
            window.location.href = 'request.html';
        }
    }
}

// Load and display user donations
function loadMyDonations() {
    if (window.location.pathname.includes('my-donations.html')) {
        const donationsList = document.getElementById('donationsList');
        const emptyState = document.getElementById('emptyState');
        
        if (!donationsList || !emptyState) return;
        
        // Get donations from localStorage
        const donations = JSON.parse(localStorage.getItem('userDonations') || '[]');
        
        if (donations.length === 0) {
            donationsList.style.display = 'none';
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
            donationsList.innerHTML = '';
            
            donations.forEach(donation => {
                const donationCard = createDonationCard(donation);
                donationsList.appendChild(donationCard);
            });
        }
    }
}

// Create donation card element
function createDonationCard(donation) {
    const card = document.createElement('div');
    card.className = 'donation-card';
    
    const date = new Date(donation.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    card.innerHTML = `
        <div class="donation-card-header">
            <div class="donation-number">${donation.confirmationNumber}</div>
            <span class="donation-status ${donation.status.toLowerCase()}">${donation.status}</span>
        </div>
        <div class="donation-details">
            <div class="donation-detail-item">
                <div class="donation-detail-label">
                    <i class="fas fa-user"></i>
                    <span>Donor Name</span>
                </div>
                <div class="donation-detail-value">${donation.name}</div>
            </div>
            <div class="donation-detail-item">
                <div class="donation-detail-label">
                    <i class="fas fa-phone"></i>
                    <span>Phone Number</span>
                </div>
                <div class="donation-detail-value">${donation.phone}</div>
            </div>
            <div class="donation-detail-item">
                <div class="donation-detail-label">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>Pickup Address</span>
                </div>
                <div class="donation-detail-value">${donation.address}</div>
            </div>
            <div class="donation-detail-item">
                <div class="donation-detail-label">
                    <i class="fas fa-utensils"></i>
                    <span>Quantity</span>
                </div>
                <div class="donation-detail-value">${donation.quantity}</div>
            </div>
        </div>
        <div class="donation-date">
            <i class="fas fa-calendar"></i>
            <span>Submitted on ${formattedDate}</span>
        </div>
    `;
    
    return card;
}

// Google Login Button
const googleLoginBtn = document.getElementById('googleLoginBtn');
const googleSignupBtn = document.getElementById('googleSignupBtn');

if (googleLoginBtn || googleSignupBtn) {
    const handler = async () => {
        const accounts = await detectGoogleAccounts();
        showAccountModal('google', accounts);
    };
    
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', handler);
    }
    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', handler);
    }
}

// Facebook Login Button
const facebookLoginBtn = document.getElementById('facebookLoginBtn');
const facebookSignupBtn = document.getElementById('facebookSignupBtn');

if (facebookLoginBtn || facebookSignupBtn) {
    const handler = async () => {
        const accounts = await detectFacebookAccounts();
        showAccountModal('facebook', accounts);
    };
    
    if (facebookLoginBtn) {
        facebookLoginBtn.addEventListener('click', handler);
    }
    if (facebookSignupBtn) {
        facebookSignupBtn.addEventListener('click', handler);
    }
}

// Load Google Identity Services (optional - for actual Google sign-in)
// You can add this script tag to HTML: <script src="https://accounts.google.com/gsi/client" async defer></script>

// Load Facebook SDK (optional - for actual Facebook sign-in)
// You can add this script tag to HTML: <script src="https://connect.facebook.net/en_US/sdk.js" async defer></script>

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active Navigation Link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const navLinksList = document.querySelectorAll('.nav-link');

navLinksList.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || 
        (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

// Scroll to Top Functionality (if needed)
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// Add scroll event listener to show/hide scroll to top button (optional)
let scrollToTopBtn = null;

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        if (!scrollToTopBtn) {
            scrollToTopBtn = document.createElement('button');
            scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
            scrollToTopBtn.className = 'scroll-to-top';
            scrollToTopBtn.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: var(--primary-green);
                color: white;
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                z-index: 999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                transition: all 0.3s;
            `;
            scrollToTopBtn.addEventListener('click', scrollToTop);
            scrollToTopBtn.addEventListener('mouseenter', () => {
                scrollToTopBtn.style.transform = 'translateY(-5px)';
                scrollToTopBtn.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
            });
            scrollToTopBtn.addEventListener('mouseleave', () => {
                scrollToTopBtn.style.transform = 'translateY(0)';
                scrollToTopBtn.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            });
            document.body.appendChild(scrollToTopBtn);
        }
        scrollToTopBtn.style.display = 'flex';
    } else if (scrollToTopBtn) {
        scrollToTopBtn.style.display = 'none';
    }
});

// Form Validation Enhancement
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePhone = (phone) => {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

// Add real-time validation to login form
const emailInput = document.getElementById('email');
if (emailInput) {
    emailInput.addEventListener('blur', () => {
        if (emailInput.value && !validateEmail(emailInput.value)) {
            emailInput.style.borderColor = '#EF4444';
            emailInput.setCustomValidity('Please enter a valid email address');
        } else {
            emailInput.style.borderColor = '#D1D5DB';
            emailInput.setCustomValidity('');
        }
    });
}

// Add real-time validation to phone inputs
const phoneInputs = document.querySelectorAll('input[type="tel"]');
phoneInputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value && !validatePhone(input.value)) {
            input.style.borderColor = '#EF4444';
            input.setCustomValidity('Please enter a valid phone number');
        } else {
            input.style.borderColor = '#D1D5DB';
            input.setCustomValidity('');
        }
    });
});

// Loading Animation (optional)
const showLoading = () => {
    // You can add a loading spinner here
    console.log('Loading...');
};

const hideLoading = () => {
    // Hide loading spinner
    console.log('Loaded!');
};

// Intersection Observer for Fade-in Animations (optional)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.impact-card, .step-card, .testimonial-card, .service-card, .value-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

console.log('Plates of Hope website loaded successfully!');
