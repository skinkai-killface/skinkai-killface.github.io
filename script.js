document.addEventListener('DOMContentLoaded', () => {
    /* =============================================
       ENTRANCE ANIMATIONS (instant, no scroll reveal)
       ============================================= */
    const revealElements = document.querySelectorAll('.outline-box, .project-card');
    revealElements.forEach((el, i) => {
        el.classList.add('reveal');
        setTimeout(() => el.classList.add('active'), 200 + i * 120);
    });

    /* =============================================
       VANILLA 3D TILT EFFECT
       ============================================= */
    const tiltElements = document.querySelectorAll('.tilt-element');

    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element

            // Calculate rotation (max 10 degrees)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            // Update CSS variables for radial gradient hover effect (used in outline-box)
            if (element.classList.contains('outline-box')) {
                element.style.setProperty('--mouse-x', `${x}px`);
                element.style.setProperty('--mouse-y', `${y}px`);
            }
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            // Reset transition for smooth return
            element.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
            setTimeout(() => {
                element.style.transition = ''; // Remove transition so mousemove is instant
            }, 500);
        });
    });

    /* =============================================
       RIPPLE EFFECT ON BUTTONS
       ============================================= */
    const createRipple = (event, element) => {
        const circle = document.createElement('span');
        const diameter = Math.max(element.clientWidth, element.clientHeight);
        const radius = diameter / 2;

        const rect = element.getBoundingClientRect();

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - rect.left - radius}px`;
        circle.style.top = `${event.clientY - rect.top - radius}px`;
        circle.classList.add('ripple');

        const ripple = element.querySelector('.ripple');
        if (ripple) {
            ripple.remove();
        }

        element.appendChild(circle);
    };

    /* =============================================
       TOAST NOTIFICATIONS (INTERACTIONS)
       ============================================= */
    const toastContainer = document.getElementById('toast-container');

    const showToast = (message) => {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M22 4L12 14.01l-3-3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);

        // Force reflow
        void toast.offsetWidth;

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 400); // match CSS transition duration
        }, 3000);
    };

    // Attach interactions
    document.querySelectorAll('.ripple-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            createRipple(e, this);
            const action = this.getAttribute('data-action');
            if (action) {
                showToast(action);
            }
        });
    });

    document.querySelectorAll('.interactive-box').forEach(box => {
        box.addEventListener('click', function (e) {
            // Prevent if clicking on something inside that handles its own clicks (though we don't have any here, good practice)
            const title = this.querySelector('.box-title').textContent;
            showToast(`Expanded details for: ${title.split('20')[0].trim()}`);
        });
    });
});
