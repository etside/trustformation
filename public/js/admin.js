// Admin Panel JS
function editService(service) {
  document.getElementById('editServiceId').value = service.id;
  document.getElementById('editServiceTitle').value = service.title;
  document.getElementById('editServiceIcon').value = service.icon;
  document.getElementById('editServiceFlag').value = service.flag;
  document.getElementById('editServiceDesc').value = service.description;
  document.getElementById('editServiceModal').style.display = 'flex';
}

function editWhyus(item) {
  document.getElementById('editWhyusId').value = item.id;
  document.getElementById('editWhyusTitle').value = item.title;
  document.getElementById('editWhyusIcon').value = item.icon;
  document.getElementById('editWhyusDesc').value = item.description;
  document.getElementById('editWhyusModal').style.display = 'flex';
}

function editPricing(pkg) {
  document.getElementById('editPricingId').value = pkg.id;
  document.getElementById('editPricingCountry').value = pkg.country;
  document.getElementById('editPricingName').value = pkg.name;
  document.getElementById('editPricingPrice').value = pkg.price;
  document.getElementById('editPricingOrigPrice').value = pkg.original_price || '';
  document.getElementById('editPricingFeatures').value = pkg.features || '[]';
  document.getElementById('editPricingModal').style.display = 'flex';
}

function editFaq(faq) {
  document.getElementById('editFaqId').value = faq.id;
  document.getElementById('editFaqQuestion').value = faq.question;
  document.getElementById('editFaqAnswer').value = faq.answer;
  document.getElementById('editFaqCategory').value = faq.category;
  document.getElementById('editFaqModal').style.display = 'flex';
}

function editTestimonial(test) {
  document.getElementById('editTestId').value = test.id;
  document.getElementById('editTestName').value = test.name;
  document.getElementById('editTestRole').value = test.role;
  document.getElementById('editTestCompany').value = test.company;
  document.getElementById('editTestQuote').value = test.quote;
  document.getElementById('editTestRating').value = test.rating;
  document.getElementById('editTestVideo').value = test.video_url || '';
  document.getElementById('editTestFeatured').checked = test.is_featured == 1;
  document.getElementById('editTestimonialModal').style.display = 'flex';
}

function editLogo(logo) {
  document.getElementById('editLogoId').value = logo.id;
  document.getElementById('editLogoName').value = logo.name;
  document.getElementById('editLogoUrl').value = logo.logo_url;
  document.getElementById('editLogoWebsite').value = logo.website_url || '';
  document.getElementById('editLogoModal').style.display = 'flex';
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

// Close modal on backdrop click
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
  });
});

// Color input sync
document.querySelectorAll('.color-input').forEach(group => {
  const colorPicker = group.querySelector('input[type="color"]');
  const hexInput = group.querySelector('.color-hex');
  if (colorPicker && hexInput) {
    colorPicker.addEventListener('input', () => hexInput.value = colorPicker.value);
    hexInput.addEventListener('input', () => {
      if (/^#[0-9A-Fa-f]{6}$/.test(hexInput.value)) colorPicker.value = hexInput.value;
    });
  }
});

// Drag and drop reorder for services
const servicesList = document.getElementById('servicesList');
if (servicesList) {
  let draggedItem = null;

  servicesList.querySelectorAll('.list-item').forEach(item => {
    item.setAttribute('draggable', true);

    item.addEventListener('dragstart', e => {
      draggedItem = item;
      item.style.opacity = '0.5';
    });

    item.addEventListener('dragend', () => {
      item.style.opacity = '1';
      draggedItem = null;
      saveOrder();
    });

    item.addEventListener('dragover', e => {
      e.preventDefault();
      const bounding = item.getBoundingClientRect();
      const offset = e.clientY - bounding.top;
      if (offset > bounding.height / 2) {
        item.parentNode.insertBefore(draggedItem, item.nextSibling);
      } else {
        item.parentNode.insertBefore(draggedItem, item);
      }
    });
  });

  function saveOrder() {
    const order = Array.from(servicesList.querySelectorAll('.list-item'))
      .map(el => el.dataset.id);
    fetch('/admin/api/services/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order })
    });
  }
}
