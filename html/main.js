console.log('✅ main.js is connected!');

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const navList = document.getElementById('navList');
  if (menuToggle && navList) {
    menuToggle.addEventListener('click', () => navList.classList.toggle('show'));
  }

  // Smooth anchor scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
      if (navList && navList.classList.contains('show')) navList.classList.remove('show');
    });
  });

  // Initialize carousel (if defined)
  if (typeof initializeCarousel === 'function') initializeCarousel();

  // Explore Events Button
  const openEventsBtn = document.querySelector('.button1');
  if (openEventsBtn) openEventsBtn.addEventListener('click', e => {
    e.preventDefault();
    openEventsModal();
  });

  // Proceed to Payment Button
  const proceedBtn = document.getElementById('proceedToPaymentBtn');
  if (proceedBtn) proceedBtn.addEventListener('click', handleProceedToPayment);

  // =================== PAYMENT CONTROLS SETUP ===================
  // Payment method selection buttons
  document.querySelectorAll('.pay-method').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pay-method').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedPaymentMethod = btn.getAttribute('data-method');
      hideAllPaymentContainers();

      if (selectedPaymentMethod === 'upi') {
        document.getElementById('upiContainer').style.display = 'block';
        showUpiQr();
      } else if (selectedPaymentMethod === 'card') {
        document.getElementById('cardContainer').style.display = 'block';
      } else if (selectedPaymentMethod === 'cash') {
        document.getElementById('cashContainer').style.display = 'block';
        const cashTxt = document.getElementById('cashAmountText');
        if (cashTxt && currentSelectedEvent) {
          cashTxt.textContent = currentSelectedEvent.price;
        }
      }
    });
  });

  // Payment action buttons
  const payDemoBtn = document.getElementById('payDemoBtn');
  const payCardBtn = document.getElementById('payCardBtn');
  const confirmCashBtn = document.getElementById('confirmCashBtn');
  const closeSuccessBtn = document.getElementById('closeSuccessBtn');

  if (payDemoBtn) {
    payDemoBtn.addEventListener('click', () => simulatePaymentSuccess('UPI'));
  }

  if (payCardBtn) {
    payCardBtn.addEventListener('click', () => simulatePaymentSuccess('Card'));
  }

  if (confirmCashBtn) {
    confirmCashBtn.addEventListener('click', () => simulatePaymentSuccess('Cash'));
  }

  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', () => {
      const popup = document.getElementById('paymentSuccessPopup');
      if (popup) popup.style.display = 'none';
    });
  }
});

// =================== GLOBALS ===================
let currentSelectedEvent = null;
let selectedPaymentMethod = null;

// =================== EVENTS MODAL ===================
async function loadEvents() {
  const container = document.getElementById('eventsContainer');
  if (!container) return;
  container.innerHTML = '<div class="loading">Loading events...</div>';
  try {
    const res = await fetch('/api/events').catch(() => null);
    let events = res && res.ok ? await res.json() : null;
    if (!events) {
      events = [
        { id: 1, title: 'Summer Music Festival', description: 'Music under the stars', price: 799, date: '2025-07-15', time: '18:00', location: 'Open Ground', imageUrl: '' },
        { id: 2, title: 'Tech Innovation Conference', description: 'Latest in tech', price: 1200, date: '2025-08-20', time: '09:30', location: 'Convention Center', imageUrl: '' },
        { id: 3, title: 'Cultural Arts Exhibition', description: 'Explore art', price: 499, date: '2025-09-10', time: '11:00', location: 'Gallery Hall', imageUrl: '' }
      ];
    }

    container.innerHTML = '';
    if (events.length === 0) {
      container.innerHTML = '<div class="no-events">No events available.</div>';
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'events-grid';
    events.forEach(ev => grid.appendChild(createEventCard(ev)));
    container.appendChild(grid);
  } catch (err) {
    console.error('Error loading events', err);
    container.innerHTML = '<div class="no-events">Error loading events. Try again later.</div>';
  }
}

function createEventCard(event) {
  const card = document.createElement('div');
  card.className = 'event-card';
  const img = event.imageUrl || '../assets/images/pic1.jpg';
  card.innerHTML = `
    <img src="${img}" alt="${event.title}" class="event-image" onerror="this.src='../assets/images/pic1.jpg'">
    <div class="event-info">
      <div class="event-title">${event.title}</div>
      <div class="event-description">${event.description}</div>
      <div class="event-details">
        <div><i class="fa-solid fa-calendar"></i> ${formatDate(event.date)}</div>
        <div><i class="fa-solid fa-clock"></i> ${formatTime(event.time)}</div>
        <div><i class="fa-solid fa-location-dot"></i> ${event.location}</div>
      </div>
      <div class="event-price">₹${event.price}</div>
      <button class="register-btn">Register Now</button>
    </div>`;

  // Attach event listener properly with the event object
  const registerBtn = card.querySelector('.register-btn');
  registerBtn.addEventListener('click', () => {
    openRegistrationModal(event);
  });

  return card;
}

function openEventsModal() {
  const modal = document.getElementById('eventsModal');
  if (modal) {
    modal.style.display = 'block';
    loadEvents?.(); // Safe call in case loadEvents isn't defined
    console.log('✅ Events modal opened');
  } else {
    console.error('❌ eventsModal not found in DOM');
  }
};
function closeEventsModal() {
  const modal = document.getElementById('eventsModal');
  if (modal) {
    modal.style.display = 'none';
    console.log('✅ Events modal closed');
  } else {
    console.error('❌ eventsModal not found in DOM');
  }
}

// =================== REGISTRATION ===================
function openRegistrationModal(event) {
  console.log('📝 Opening registration modal for event:', event);
  currentSelectedEvent = event;
  const modal = document.getElementById('registrationModal');
  const eventInfo = document.getElementById('selectedEventInfo');
  if (!modal || !eventInfo) return;

  eventInfo.innerHTML = `
    <div class="selected-event-info">
      <div class="selected-event-title">${event.title}</div>
      <div class="selected-event-details">
        <span><i class="fa-solid fa-calendar"></i> ${formatDate(event.date)}</span>
        <span><i class="fa-solid fa-clock"></i> ${formatTime(event.time)}</span>
        <span><i class="fa-solid fa-location-dot"></i> ${event.location}</span>
        <span><i class="fa-solid fa-dollar-sign"></i> ₹${event.price}</span>
      </div>
    </div>`;

  const form = document.getElementById('eventRegistrationForm');
  if (form) form.reset();
  modal.style.display = 'block';
}
function closeRegistrationModal() {
  const modal = document.getElementById('registrationModal');
  if (modal) modal.style.display = 'none';
  // Don't clear currentSelectedEvent here - we need it for payment!
}
// =================== PROCEED TO PAYMENT ===================
function handleProceedToPayment() {
  console.log('🔄 Proceeding to payment...');
  console.log('Event before proceeding:', currentSelectedEvent);

  const form = document.getElementById('eventRegistrationForm');
  if (!form) return alert('Registration form not found.');

  const first = form.querySelector('#firstName')?.value.trim();
  const last = form.querySelector('#lastName')?.value.trim();
  const email = form.querySelector('#email')?.value.trim();

  if (!first || !last || !email) {
    alert('Please fill in all required fields.');
    return;
  }

  if (!currentSelectedEvent) {
    alert('Error: Event information lost. Please try again.');
    return;
  }

  closeRegistrationModal();
  openPaymentModal();
}

// =================== PAYMENT FLOW ===================
function openPaymentModal(event) {
  console.log('💳 Opening payment modal');
  console.log('Current selected event:', currentSelectedEvent);

  if (event) currentSelectedEvent = event;
  const modal = document.getElementById('paymentModal');
  if (!modal) {
    console.error('❌ Payment modal not found');
    return;
  }

  const infoBox = document.getElementById('paymentEventInfo');
  if (infoBox && currentSelectedEvent) {
    console.log('✅ Event found, displaying info');
    infoBox.innerHTML = `
      <div class="selected-event-title">${currentSelectedEvent.title}</div>
      <div style="margin-top:6px;color:#444;">Amount: <strong>₹${currentSelectedEvent.price}</strong></div>`;
  } else {
    console.error('❌ No event selected or infoBox not found');
    infoBox && (infoBox.innerHTML = '<div style="color: red;">No event selected</div>');
  }

  selectedPaymentMethod = null;
  document.querySelectorAll('.pay-method').forEach(b => b.classList.remove('active'));
  hideAllPaymentContainers();
  modal.style.display = 'block';
}

function closePaymentModal() {
  const modal = document.getElementById('paymentModal');
  if (modal) modal.style.display = 'none';
}

function hideAllPaymentContainers() {
  ['upiContainer', 'cardContainer', 'cashContainer'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
}


function showUpiQr() {
  const qrImg = document.getElementById('qrImage');
  const upiAmountText = document.getElementById('upiAmountText');
  if (!qrImg || !upiAmountText) return;
  const amount = currentSelectedEvent?.price ?? 0;
  upiAmountText.textContent = `₹${amount}`;
  const upiPayload = `upi://pay?pa=demo@upi&pn=EventSphere&am=${amount}&cu=INR`;
  const qrUrl = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(upiPayload)}`;
  qrImg.src = qrUrl;
  qrImg.alt = `Scan to pay ₹${amount}`;
}

async function simulatePaymentSuccess(method) {
  const popup = document.getElementById('paymentSuccessPopup');
  const title = document.getElementById('successTitle');
  const message = document.getElementById('successMessage');
  const eventName = currentSelectedEvent?.title ?? 'Event';
  const amount = currentSelectedEvent?.price ?? 0;

  if (!popup || !title || !message) return alert('Payment success (demo)');

  // Get registration form data
  const form = document.getElementById('eventRegistrationForm');
  if (!form || !currentSelectedEvent) {
    alert('Registration data not found');
    return;
  }

  const firstName = form.querySelector('#firstName')?.value.trim();
  const lastName = form.querySelector('#lastName')?.value.trim();
  const email = form.querySelector('#email')?.value.trim();
  const phone = form.querySelector('#phone')?.value.trim();
  const messageText = form.querySelector('#message')?.value.trim();

  // Save registration to database
  try {
    const response = await fetch('/api/events/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        eventId: currentSelectedEvent.id,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        message: messageText
      })
    });

    const result = await response.json();

    if (result.success) {
      title.textContent = 'Registration Successful!';
      message.textContent = `Your ${method} payment of ₹${amount} for "${eventName}" was successful. You have been registered for this event!`;
      popup.style.display = 'flex';
      closePaymentModal();

      // Reset the form
      form.reset();
      currentSelectedEvent = null;
    } else {
      alert('Registration failed: ' + (result.error || 'Please try again'));
    }
  } catch (error) {
    console.error('Error registering for event:', error);
    alert('Failed to register for event. Please try again.');
  }
}

// =================== UTILITIES ===================
function formatDate(dateString) {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (err) {
    return dateString;
  }
}

function formatTime(timeString) {
  if (!timeString || !timeString.includes(':')) return '';
  const [h, m] = timeString.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return '';
  const dt = new Date();
  dt.setHours(h, m);
  return dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}


// =================== MODAL CLOSE ON CLICK ===================
window.addEventListener('click', e => {
  ['eventsModal', 'registrationModal', 'paymentModal'].forEach(id => {
    const el = document.getElementById(id);
    if (el && e.target === el) el.style.display = 'none';
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' && typeof changeSlide === 'function') changeSlide(-1);
  if (e.key === 'ArrowRight' && typeof changeSlide === 'function') changeSlide(1);
});

// =================== FEEDBACK HANDLING ===================
let selectedRating = 0;

// Open feedback modal
const openFeedbackBtn = document.getElementById('openFeedbackBtn');
if (openFeedbackBtn) {
  openFeedbackBtn.addEventListener('click', () => {
    const modal = document.getElementById('feedbackModal');
    if (modal) {
      modal.style.display = 'block';
      selectedRating = 0;
      updateStars();
      document.getElementById('feedbackMessage').value = '';
    }
  });
}

// Close feedback modal
const closeModal = document.getElementById('closeModal');
if (closeModal) {
  closeModal.addEventListener('click', () => {
    const modal = document.getElementById('feedbackModal');
    if (modal) modal.style.display = 'none';
  });
}

// Star rating functionality
const stars = document.querySelectorAll('#feedbackModal .stars i');
stars.forEach(star => {
  star.addEventListener('click', () => {
    selectedRating = parseInt(star.getAttribute('data-rating'));
    updateStars();
  });

  star.addEventListener('mouseenter', () => {
    const rating = parseInt(star.getAttribute('data-rating'));
    highlightStars(rating);
  });
});

const starsContainer = document.querySelector('#feedbackModal .stars');
if (starsContainer) {
  starsContainer.addEventListener('mouseleave', () => {
    updateStars();
  });
}

function updateStars() {
  stars.forEach(star => {
    const rating = parseInt(star.getAttribute('data-rating'));
    if (rating <= selectedRating) {
      star.style.color = '#ffc107';
    } else {
      star.style.color = '#ddd';
    }
  });
}

function highlightStars(rating) {
  stars.forEach(star => {
    const starRating = parseInt(star.getAttribute('data-rating'));
    if (starRating <= rating) {
      star.style.color = '#ffc107';
    } else {
      star.style.color = '#ddd';
    }
  });
}

// Submit feedback
const submitFeedbackBtn = document.getElementById('submitFeedback');
if (submitFeedbackBtn) {
  submitFeedbackBtn.addEventListener('click', async () => {
    const message = document.getElementById('feedbackMessage').value.trim();

    if (selectedRating === 0) {
      alert('Please select a rating!');
      return;
    }

    if (!message) {
      alert('Please write your feedback message!');
      return;
    }

    // Disable button to prevent double submission
    submitFeedbackBtn.disabled = true;
    submitFeedbackBtn.textContent = 'Submitting...';

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Anonymous User',
          email: null,
          rating: selectedRating,
          message: message
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('Thank you for your feedback!');
        document.getElementById('feedbackModal').style.display = 'none';
        selectedRating = 0;
        document.getElementById('feedbackMessage').value = '';
        updateStars();
      } else {
        alert(result.error || 'Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      submitFeedbackBtn.disabled = false;
      submitFeedbackBtn.textContent = 'Submit Feedback';
    }
  });
}
