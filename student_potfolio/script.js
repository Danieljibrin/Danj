// ============================================
// COMPLETE SCRIPT - ALL PAGES FUNCTIONALITY
// ============================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {

    console.log('🚀 Website loaded successfully!');

    // ============================================
    // 1. ACADEMIC PLANNER (planner.html)
    // ============================================
    
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const taskCounter = document.getElementById('taskCounter');

    // Only initialize if we're on the planner page
    if (taskInput && addBtn && taskList) {
        
        console.log('📋 Academic Planner initialized!');

        // Initialize tasks array
        let tasks = [];

        // Load tasks from localStorage
        try {
            const storedTasks = localStorage.getItem('plannerTasks');
            if (storedTasks) {
                tasks = JSON.parse(storedTasks);
                console.log('📂 Loaded ' + tasks.length + ' tasks from storage');
            }
        } catch(e) {
            console.warn('⚠️ Could not load tasks from localStorage');
        }

        // Function to render tasks
        function renderTasks() {
            // Clear the list
            taskList.innerHTML = '';
            
            // Update counter
            if (taskCounter) {
                const total = tasks.length;
                const completed = tasks.filter(t => t.completed).length;
                taskCounter.textContent = '(' + completed + '/' + total + ' tasks)';
            }

            // Show empty message if no tasks
            if (tasks.length === 0) {
                const emptyMsg = document.createElement('li');
                emptyMsg.className = 'empty-message';
                emptyMsg.textContent = '📝 No tasks yet. Add a task above!';
                taskList.appendChild(emptyMsg);
                return;
            }

            // Render each task
            for (let i = 0; i < tasks.length; i++) {
                const task = tasks[i];
                const li = document.createElement('li');
                li.className = task.completed ? 'completed' : '';
                
                // Task text
                const taskText = document.createElement('span');
                taskText.textContent = task.text;
                
                // Actions container
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'task-actions';
                
                // Complete button
                const completeBtn = document.createElement('button');
                completeBtn.className = 'complete-btn';
                completeBtn.textContent = '✅';
                completeBtn.title = 'Mark as complete';
                completeBtn.setAttribute('data-index', i);
                completeBtn.addEventListener('click', function() {
                    const idx = parseInt(this.getAttribute('data-index'));
                    toggleTask(idx);
                });
                
                // Delete button
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = '🗑️';
                deleteBtn.title = 'Delete task';
                deleteBtn.setAttribute('data-index', i);
                deleteBtn.addEventListener('click', function() {
                    const idx = parseInt(this.getAttribute('data-index'));
                    deleteTask(idx);
                });
                
                actionsDiv.appendChild(completeBtn);
                actionsDiv.appendChild(deleteBtn);
                
                li.appendChild(taskText);
                li.appendChild(actionsDiv);
                taskList.appendChild(li);
            }

            // Save to localStorage
            try {
                localStorage.setItem('plannerTasks', JSON.stringify(tasks));
            } catch(e) {
                console.warn('⚠️ Could not save tasks to localStorage');
            }
        }

        // Function to add a task
        function addTask() {
            const text = taskInput.value.trim();
            
            // Validate input
            if (text === '') {
                taskInput.style.borderColor = '#e74c3c';
                taskInput.style.backgroundColor = '#fdf0ed';
                taskInput.placeholder = '⚠️ Please enter a task!';
                
                setTimeout(function() {
                    taskInput.style.borderColor = '#ddd';
                    taskInput.style.backgroundColor = '#fafafa';
                    taskInput.placeholder = 'Enter a new task...';
                }, 2000);
                
                return;
            }

            // Add task
            tasks.push({ 
                text: text, 
                completed: false,
                created: new Date().toISOString()
            });
            
            // Clear input
            taskInput.value = '';
            taskInput.style.borderColor = '#2ecc71';
            taskInput.style.backgroundColor = '#eafaf1';
            
            setTimeout(function() {
                taskInput.style.borderColor = '#ddd';
                taskInput.style.backgroundColor = '#fafafa';
            }, 500);
            
            // Re-render
            renderTasks();
            
            // Scroll to new task
            const lastTask = taskList.lastElementChild;
            if (lastTask) {
                setTimeout(function() {
                    lastTask.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }, 100);
            }
            
            console.log('✅ Added task: ' + text);
        }

        // Function to toggle completion
        function toggleTask(index) {
            if (index >= 0 && index < tasks.length) {
                tasks[index].completed = !tasks[index].completed;
                renderTasks();
                console.log('🔄 Toggled task: ' + tasks[index].text);
            }
        }

        // Function to delete task
        function deleteTask(index) {
            if (index >= 0 && index < tasks.length) {
                const taskText = tasks[index].text;
                if (confirm('Delete task: "' + taskText + '"?')) {
                    tasks.splice(index, 1);
                    renderTasks();
                    console.log('🗑️ Deleted task: ' + taskText);
                }
            }
        }

        // --- Event Listeners ---
        
        // Add button click
        addBtn.addEventListener('click', function(e) {
            e.preventDefault();
            addTask();
        });

        // Enter key press
        taskInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addTask();
            }
        });

        // Clear error state on focus
        taskInput.addEventListener('focus', function() {
            this.style.borderColor = '#3498db';
            this.style.backgroundColor = 'white';
            this.placeholder = 'Enter a new task...';
        });

        // Keyboard shortcut: Ctrl+Enter
        taskInput.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                addTask();
            }
        });

        // Initial render
        renderTasks();
        
        console.log('✅ Academic Planner ready!');
        console.log('💡 Tip: Press Enter or Ctrl+Enter to add a task quickly.');
    }

    // ============================================
    // 2. CONTACT FORM - REAL-TIME VALIDATION (contact.html)
    // ============================================
    
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        
        console.log('📧 Contact form with real-time validation initialized!');

        // Get all form elements
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const messageInput = document.getElementById('message');
        const submitBtn = document.getElementById('submitBtn');
        const feedback = document.getElementById('formFeedback');

        // Get error elements
        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const phoneError = document.getElementById('phoneError');
        const messageError = document.getElementById('messageError');

        // Get hint elements
        const nameHint = document.getElementById('nameHint');
        const emailHint = document.getElementById('emailHint');
        const phoneHint = document.getElementById('phoneHint');
        const messageHint = document.getElementById('messageHint');

        // ============================================
        // VALIDATION FUNCTIONS
        // ============================================

        // Validate Name
        function validateName(value) {
            const trimmed = value.trim();
            if (trimmed.length === 0) {
                return { valid: false, message: '⚠️ Name is required.' };
            } else if (trimmed.length < 2) {
                return { valid: false, message: '⚠️ Name must be at least 2 characters.' };
            } else if (trimmed.length > 50) {
                return { valid: false, message: '⚠️ Name must be less than 50 characters.' };
            } else if (!/^[a-zA-Z\s\-']+$/.test(trimmed)) {
                return { valid: false, message: '⚠️ Name can only contain letters, spaces, hyphens, and apostrophes.' };
            }
            return { valid: true, message: '✅ Valid name' };
        }

        // Validate Email
        function validateEmail(value) {
            const trimmed = value.trim();
            if (trimmed.length === 0) {
                return { valid: false, message: '⚠️ Email is required.' };
            }
            
            // Comprehensive email validation
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailPattern.test(trimmed)) {
                return { valid: false, message: '⚠️ Please enter a valid email (e.g., name@domain.com).' };
            }
            
            // Check for common invalid patterns
            if (trimmed.includes('..') || trimmed.includes('@@') || trimmed.startsWith('.') || trimmed.endsWith('.')) {
                return { valid: false, message: '⚠️ Invalid email format.' };
            }
            
            return { valid: true, message: '✅ Valid email' };
        }

        // Validate Phone (Nigerian phone number format)
        function validatePhone(value) {
            const trimmed = value.trim();
            if (trimmed.length === 0) {
                return { valid: false, message: '⚠️ Phone number is required.' };
            }
            
            // Remove spaces, dashes, parentheses, and plus sign for validation
            const clean = trimmed.replace(/[\s\-()]/g, '');
            
            // Check if it contains only digits
            if (!/^\d+$/.test(clean)) {
                return { valid: false, message: '⚠️ Phone number must contain only digits.' };
            }
            
            // Nigerian phone numbers: 11 digits, starting with 0, 7, 8, or 9
            if (clean.length === 11 && /^[0][789]\d{9}$/.test(clean)) {
                return { valid: true, message: '✅ Valid Nigerian phone number' };
            }
            
            // International format: 13-15 digits starting with 234
            if (clean.length >= 13 && clean.length <= 15 && /^234[789]\d{10,12}$/.test(clean)) {
                return { valid: true, message: '✅ Valid Nigerian phone number (international)' };
            }
            
            // Generic phone number: 10-15 digits
            if (clean.length >= 10 && clean.length <= 15) {
                return { valid: true, message: '✅ Valid phone number' };
            }
            
            return { valid: false, message: '⚠️ Invalid phone number. Use 11 digits (e.g., 08012345678).' };
        }

        // Validate Message
        function validateMessage(value) {
            const trimmed = value.trim();
            if (trimmed.length === 0) {
                return { valid: false, message: '⚠️ Message is required.' };
            } else if (trimmed.length < 10) {
                return { valid: false, message: '⚠️ Message must be at least 10 characters.' };
            } else if (trimmed.length > 1000) {
                return { valid: false, message: '⚠️ Message must be less than 1000 characters.' };
            }
            return { valid: true, message: '✅ Valid message' };
        }

        // ============================================
        // REAL-TIME VALIDATION HANDLERS
        // ============================================

        // Validate Name in real-time
        if (nameInput) {
            nameInput.addEventListener('input', function() {
                const result = validateName(this.value);
                updateFieldValidation(this, nameError, nameHint, result);
                updateSubmitButton();
            });
        }

        // Validate Email in real-time
        if (emailInput) {
            emailInput.addEventListener('input', function() {
                const result = validateEmail(this.value);
                updateFieldValidation(this, emailError, emailHint, result);
                updateSubmitButton();
            });
        }

        // Validate Phone in real-time
        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                const result = validatePhone(this.value);
                updateFieldValidation(this, phoneError, phoneHint, result);
                updateSubmitButton();
            });
        }

        // Validate Message in real-time
        if (messageInput) {
            messageInput.addEventListener('input', function() {
                const result = validateMessage(this.value);
                updateFieldValidation(this, messageError, messageHint, result);
                updateSubmitButton();
            });
        }

        // ============================================
        // HELPER FUNCTION TO UPDATE FIELD VALIDATION
        // ============================================

        function updateFieldValidation(input, errorEl, hintEl, result) {
            if (!input) return;
            
            // Remove existing classes
            input.classList.remove('valid', 'invalid');
            if (hintEl) {
                hintEl.classList.remove('valid-hint', 'invalid-hint');
            }
            
            if (result.valid) {
                input.classList.add('valid');
                if (errorEl) errorEl.textContent = '';
                if (hintEl) {
                    hintEl.textContent = result.message;
                    hintEl.classList.add('valid-hint');
                }
            } else {
                input.classList.add('invalid');
                if (errorEl) errorEl.textContent = result.message;
                if (hintEl) {
                    hintEl.textContent = '';
                    hintEl.classList.remove('valid-hint');
                }
            }
        }

        // ============================================
        // UPDATE SUBMIT BUTTON STATE
        // ============================================

        function updateSubmitButton() {
            if (!submitBtn) return;
            
            // Check if all fields exist and are valid
            let allValid = true;
            
            if (nameInput) {
                const nameValid = validateName(nameInput.value).valid;
                allValid = allValid && nameValid;
            }
            if (emailInput) {
                const emailValid = validateEmail(emailInput.value).valid;
                allValid = allValid && emailValid;
            }
            if (phoneInput) {
                const phoneValid = validatePhone(phoneInput.value).valid;
                allValid = allValid && phoneValid;
            }
            if (messageInput) {
                const messageValid = validateMessage(messageInput.value).valid;
                allValid = allValid && messageValid;
            }
            
            submitBtn.disabled = !allValid;
            
            if (allValid) {
                submitBtn.title = 'Form is ready to submit';
                submitBtn.style.background = '#2ecc71';
            } else {
                submitBtn.title = 'Please fix all errors before submitting';
                submitBtn.style.background = '#3498db';
            }
        }

        // ============================================
        // FORM SUBMISSION
        // ============================================

        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();

                // Final validation check
                let allValid = true;
                let firstInvalidField = null;

                if (nameInput) {
                    const result = validateName(nameInput.value);
                    if (!result.valid) {
                        allValid = false;
                        if (!firstInvalidField) firstInvalidField = nameInput;
                        updateFieldValidation(nameInput, nameError, nameHint, result);
                    }
                }
                if (emailInput) {
                    const result = validateEmail(emailInput.value);
                    if (!result.valid) {
                        allValid = false;
                        if (!firstInvalidField) firstInvalidField = emailInput;
                        updateFieldValidation(emailInput, emailError, emailHint, result);
                    }
                }
                if (phoneInput) {
                    const result = validatePhone(phoneInput.value);
                    if (!result.valid) {
                        allValid = false;
                        if (!firstInvalidField) firstInvalidField = phoneInput;
                        updateFieldValidation(phoneInput, phoneError, phoneHint, result);
                    }
                }
                if (messageInput) {
                    const result = validateMessage(messageInput.value);
                    if (!result.valid) {
                        allValid = false;
                        if (!firstInvalidField) firstInvalidField = messageInput;
                        updateFieldValidation(messageInput, messageError, messageHint, result);
                    }
                }

                if (!allValid) {
                    // Scroll to first error
                    if (firstInvalidField) {
                        firstInvalidField.focus();
                        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    return;
                }

                // Collect form data
                const formData = {
                    name: nameInput ? nameInput.value.trim() : '',
                    email: emailInput ? emailInput.value.trim() : '',
                    phone: phoneInput ? phoneInput.value.trim() : '',
                    message: messageInput ? messageInput.value.trim() : '',
                    submittedAt: new Date().toISOString()
                };

                console.log('📨 Form submitted:', formData);

                // Show success message
                if (feedback) {
                    feedback.textContent = '✅ Message sent successfully! Thank you for reaching out.';
                    feedback.className = 'success-message show';
                }

                // Reset form
                contactForm.reset();

                // Reset validation states
                document.querySelectorAll('#contactForm input, #contactForm textarea').forEach(function(el) {
                    el.classList.remove('valid', 'invalid');
                });
                
                document.querySelectorAll('#contactForm .hint').forEach(function(el) {
                    el.textContent = '';
                    el.classList.remove('valid-hint', 'invalid-hint');
                });

                // Reset hints to original
                if (nameHint) nameHint.textContent = 'Must be at least 2 characters';
                if (emailHint) emailHint.textContent = 'e.g., name@domain.com';
                if (phoneHint) phoneHint.textContent = '11 digits (e.g., 08012345678)';
                if (messageHint) messageHint.textContent = 'At least 10 characters';

                // Disable submit button
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.style.background = '#3498db';
                }

                // Hide success message after 5 seconds
                setTimeout(function() {
                    if (feedback) {
                        feedback.className = 'success-message';
                        feedback.textContent = '';
                    }
                }, 5000);

                // Re-enable submit button after form reset
                setTimeout(function() {
                    updateSubmitButton();
                }, 100);
            });
        }

        // ============================================
        // INITIAL STATE FOR CONTACT FORM
        // ============================================

        // Initially disable submit button
        if (submitBtn) {
            submitBtn.disabled = true;
        }

        // Add focus/blur effects
        document.querySelectorAll('#contactForm input, #contactForm textarea').forEach(function(el) {
            el.addEventListener('focus', function() {
                this.parentElement.style.transform = 'scale(1.01)';
                this.parentElement.style.transition = 'transform 0.2s ease';
            });
            
            el.addEventListener('blur', function() {
                this.parentElement.style.transform = 'scale(1)';
                // Trigger validation on blur
                this.dispatchEvent(new Event('input'));
            });
        });

        console.log('✅ Real-time validation ready!');
        console.log('💡 All fields will be validated as you type.');
    }

    // ============================================
    // 3. DYNAMIC FOOTER UPDATE (All Pages)
    // ============================================
    
    const footer = document.querySelector('footer p');
    if (footer) {
        const year = new Date().getFullYear();
        if (footer.textContent.includes('2025')) {
            footer.textContent = '© ' + year + ' Jibrin OKpanachi Daniel. All rights reserved.';
        }
        console.log('📅 Footer updated to ' + year);
    }

    // ============================================
    // 4. ARRAY AND FUNCTION DEMO (All Pages - Console)
    // ============================================
    
    const skills = ['HTML', 'CSS', 'JavaScript', 'Python', 'React'];
    console.log('🛠️ My top skills:', skills.join(', '));

    function displaySkillCount() {
        console.log('📊 I have ' + skills.length + ' key technical skills.');
    }
    displaySkillCount();

    // ============================================
    // 5. PAGE LOAD ANIMATION (All Pages)
    // ============================================
    
    const mainContent = document.querySelector('main');
    if (mainContent) {
        // Add a subtle fade-in if not already present
        if (!mainContent.style.animation) {
            mainContent.style.opacity = '0';
            mainContent.style.transition = 'opacity 0.8s ease';
            setTimeout(function() {
                mainContent.style.opacity = '1';
            }, 100);
        }
    }

    // ============================================
    // 6. GLOBAL KEYBOARD SHORTCUTS
    // ============================================
    
    document.addEventListener('keydown', function(e) {
        // Ctrl+Shift+T to focus on task input (if on planner page)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
            if (taskInput) {
                e.preventDefault();
                taskInput.focus();
                console.log('⌨️ Focused on task input via keyboard shortcut.');
            }
        }
        
        // Escape to clear any error states
        if (e.key === 'Escape') {
            document.querySelectorAll('.invalid').forEach(function(el) {
                el.classList.remove('invalid');
                el.style.borderColor = '#ddd';
                el.style.backgroundColor = '#fafafa';
            });
            document.querySelectorAll('.error-message').forEach(function(el) {
                el.textContent = '';
            });
        }
    });

    // ============================================
    // 7. NAVIGATION ACTIVE STATE (All Pages)
    // ============================================
    
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Update active state in navigation
    document.querySelectorAll('nav a').forEach(function(link) {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    console.log('🎯 All systems ready!');
    console.log('📄 Current page: ' + currentPage);
    console.log('💡 Tips:');
    console.log('   - Press Ctrl+Shift+T to focus on task input (planner page)');
    console.log('   - Press Escape to clear error states');
    console.log('   - All forms have real-time validation');
});