(function() {
    'use strict';

    // Mobile Navigation Toggle
    var menuBtn = document.querySelector('.menu');
    var navEl = document.getElementById('nav');

    if (menuBtn && navEl) {
        menuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            var isOpen = navEl.classList.toggle('open');
            menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Close on Escape key press
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navEl.classList.contains('open')) {
                navEl.classList.remove('open');
                menuBtn.setAttribute('aria-expanded', 'false');
                menuBtn.focus();
            }
        });

        // Close when clicking outside of navigation
        document.addEventListener('click', function(e) {
            if (navEl.classList.contains('open') && !navEl.contains(e.target) && e.target !== menuBtn && !menuBtn.contains(e.target)) {
                navEl.classList.remove('open');
                menuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Product Category Filter
    var chips = document.querySelectorAll('.chip');
    var plist = document.getElementById('plist');

    if (chips.length > 0 && plist) {
        var applyFilter = function(category) {
            chips.forEach(function(chip) {
                chip.setAttribute('aria-pressed', chip.dataset.f === category ? 'true' : 'false');
            });

            var cards = plist.querySelectorAll('.pcard');
            var visibleCount = 0;
            cards.forEach(function(card) {
                var matches = (category === 'all' || card.dataset.cat === category);
                card.hidden = !matches;
                if (matches) {
                    visibleCount++;
                }
            });

            var emptyMsg = plist.querySelector('.empty-state');
            if (visibleCount === 0) {
                if (!emptyMsg) {
                    emptyMsg = document.createElement('div');
                    emptyMsg.className = 'empty-state';
                    emptyMsg.textContent = 'No products found in this category.';
                    plist.appendChild(emptyMsg);
                }
                emptyMsg.hidden = false;
            } else if (emptyMsg) {
                emptyMsg.hidden = true;
            }
        };

        chips.forEach(function(chip) {
            chip.addEventListener('click', function() {
                var selectedCat = chip.dataset.f || 'all';
                applyFilter(selectedCat);

                if (window.history && window.history.replaceState) {
                    var currentUrl = new URL(window.location.href);
                    if (selectedCat === 'all') {
                        currentUrl.searchParams.delete('cat');
                    } else {
                        currentUrl.searchParams.set('cat', selectedCat);
                    }
                    window.history.replaceState(null, '', currentUrl.toString());
                }
            });
        });

        // Initialize filter from URL parameter if present
        try {
            var urlCat = new URLSearchParams(window.location.search).get('cat');
            if (urlCat) {
                var matchingChip = Array.from(chips).find(function(c) { return c.dataset.f === urlCat; });
                if (matchingChip) {
                    applyFilter(urlCat);
                }
            }
        } catch (e) {
            // URLSearchParams fallback
        }
    }

    // Quote Form Handling
    var quoteForm = document.getElementById('quote');
    if (quoteForm) {
        // Prefill product enquiry from query parameter
        try {
            var productParam = new URLSearchParams(window.location.search).get('product');
            if (productParam) {
                var msgTextarea = document.getElementById('msg');
                if (msgTextarea && !msgTextarea.value) {
                    msgTextarea.value = 'Product enquiry: ' + productParam;
                }
            }
        } catch (e) {
            // No URLSearchParams support
        }

        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();

            var statusEl = document.getElementById('form-status');
            var submitBtn = document.getElementById('submit-btn');

            var userName = (quoteForm.elements.name ? quoteForm.elements.name.value : '').trim();
            var userEmail = (quoteForm.elements.email ? quoteForm.elements.email.value : '').trim();
            var userPhone = (quoteForm.elements.phone ? quoteForm.elements.phone.value : '').trim();
            var userMsg = document.getElementById('msg') ? document.getElementById('msg').value.trim() : '';

            // Validation
            if (!userName || !/^\S+@\S+\.\S+$/.test(userEmail) || !userMsg) {
                if (statusEl) {
                    statusEl.className = 'status-msg show err';
                    statusEl.textContent = 'Please enter your name, a valid email address, and your project requirements.';
                }
                return;
            }

            // Prevent double submission
            if (quoteForm.dataset.submitting === 'true') {
                return;
            }

            quoteForm.dataset.submitting = 'true';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Submitting...';
            }

            if (statusEl) {
                statusEl.className = 'status-msg show loading';
                statusEl.textContent = 'Sending your quote request...';
            }

            var formData = new FormData(quoteForm);

            fetch(quoteForm.action || 'https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                if (data.success) {
                    if (statusEl) {
                        statusEl.className = 'status-msg show ok';
                        statusEl.textContent = 'Thank you! Your quote request has been sent successfully. Our engineering team will respond within 24 hours.';
                    }
                    quoteForm.reset();
                } else {
                    throw new Error(data.message || 'Form submission failed');
                }
            })
            .catch(function(err) {
                if (statusEl) {
                    statusEl.className = 'status-msg show err';
                    statusEl.innerHTML = 'Unable to send automatically. Please email your inquiry to <a href="mailto:contact@onpowertech.com">contact@onpowertech.com</a> or <a href="https://wa.me/918810503192" target="_blank" rel="noopener">Chat with us on WhatsApp</a>.';
                }
            })
            .finally(function() {
                quoteForm.dataset.submitting = 'false';
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Request';
                }
            });
        });
    }
})();
