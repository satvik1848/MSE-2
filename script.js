function showMessage(message) {
  alert(message);
}

// Property listing filters
const cityFilter = document.getElementById('cityFilter');
const bhkFilter = document.getElementById('bhkFilter');
const priceFilter = document.getElementById('priceFilter');
const priceValue = document.getElementById('priceValue');

function formatRupees(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

function filterProperties() {
  const cards = document.querySelectorAll('.listing-item');
  if (!cards.length) return;

  const city = cityFilter.value;
  const bhk = bhkFilter.value;
  const maxPrice = Number(priceFilter.value);
  let visible = 0;

  cards.forEach(function(card) {
    const cityMatches = city === 'all' || card.dataset.city === city;
    const bhkMatches = bhk === 'all' || card.dataset.bhk === bhk;
    const priceMatches = Number(card.dataset.price) <= maxPrice;
    const shouldShow = cityMatches && bhkMatches && priceMatches;
    card.hidden = !shouldShow;
    if (shouldShow) visible++;
  });

  document.getElementById('resultCount').textContent = 'Showing ' + visible + ' properties';
  priceValue.textContent = maxPrice >= 10000000
    ? '₹' + (maxPrice / 10000000).toFixed(2) + ' Cr'
    : '₹' + (maxPrice / 100000).toFixed(0) + ' Lakh';
}

if (cityFilter) {
  cityFilter.addEventListener('change', filterProperties);
  bhkFilter.addEventListener('change', filterProperties);
  priceFilter.addEventListener('input', filterProperties);
  document.getElementById('resetFilters').addEventListener('click', function() {
    cityFilter.value = 'all';
    bhkFilter.value = 'all';
    priceFilter.value = 15000000;
    filterProperties();
  });
  filterProperties();
}

// Save favourite properties using browser localStorage
document.querySelectorAll('.favorite-btn').forEach(function(button) {
  button.addEventListener('click', function() {
    const name = button.closest('.property-card').querySelector('h3').textContent;
    let favourites = JSON.parse(localStorage.getItem('homeFinderFavourites') || '[]');
    if (favourites.includes(name)) {
      favourites = favourites.filter(function(item) { return item !== name; });
      button.textContent = '♡ Save';
      button.classList.remove('saved');
    } else {
      favourites.push(name);
      button.textContent = '♥ Saved';
      button.classList.add('saved');
    }
    localStorage.setItem('homeFinderFavourites', JSON.stringify(favourites));
  });
});

// Compare up to two selected properties
const compareBoxes = document.querySelectorAll('.compare-box');
compareBoxes.forEach(function(box) {
  box.addEventListener('change', function() {
    const checked = document.querySelectorAll('.compare-box:checked');
    if (checked.length > 2) {
      box.checked = false;
      alert('You can compare only two properties at a time.');
      return;
    }
    const panel = document.getElementById('comparePanel');
    const output = document.getElementById('compareOutput');
    if (checked.length === 0) {
      panel.hidden = true;
      return;
    }
    panel.hidden = false;
    let html = '<table class="compare-table"><tr><th>Feature</th>';
    checked.forEach(function(item) { html += '<th>' + item.value + '</th>'; });
    html += '</tr><tr><td>City</td>';
    checked.forEach(function(item) { html += '<td>' + item.closest('.listing-item').dataset.city + '</td>'; });
    html += '</tr><tr><td>BHK</td>';
    checked.forEach(function(item) { html += '<td>' + item.closest('.listing-item').dataset.bhk + ' BHK</td>'; });
    html += '</tr><tr><td>Price</td>';
    checked.forEach(function(item) { html += '<td>' + formatRupees(item.closest('.listing-item').dataset.price) + '</td>'; });
    html += '</tr></table>';
    output.innerHTML = html;
  });
});

// EMI calculation using the standard reducing-balance formula
const calculateButton = document.getElementById('calculateEMI');
if (calculateButton) {
  calculateButton.addEventListener('click', function() {
    const principal = Number(document.getElementById('loanAmount').value);
    const annualRate = Number(document.getElementById('interestRate').value);
    const years = Number(document.getElementById('loanYears').value);

    if (principal <= 0 || annualRate < 0 || years <= 0) {
      alert('Please enter valid positive loan details.');
      return;
    }

    const monthlyRate = annualRate / 12 / 100;
    const months = years * 12;
    let emi;

    if (monthlyRate === 0) {
      emi = principal / months;
    } else {
      const factor = Math.pow(1 + monthlyRate, months);
      emi = principal * monthlyRate * factor / (factor - 1);
    }

    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;
    document.getElementById('emiValue').textContent = formatRupees(Math.round(emi));
    document.getElementById('interestValue').textContent = formatRupees(Math.round(totalInterest));
    document.getElementById('totalValue').textContent = formatRupees(Math.round(totalPayment));
  });
}

// Property image preview and sample post form
const imageInput = document.getElementById('propertyImage');
if (imageInput) {
  imageInput.addEventListener('change', function() {
    const file = imageInput.files[0];
    const preview = document.getElementById('imagePreview');
    if (file) {
      preview.src = URL.createObjectURL(file);
      preview.hidden = false;
    } else {
      preview.hidden = true;
    }
  });
}

const propertyForm = document.getElementById('propertyForm');
if (propertyForm) {
  propertyForm.addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById('formMessage').textContent =
      'Thank you, ' + document.getElementById('ownerName').value +
      '! Your sample property listing has been received.';
    propertyForm.reset();
    document.getElementById('imagePreview').hidden = true;
  });
}

// Contact form demo response
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();
    document.getElementById('contactMessage').textContent =
      'Thank you! Your message has been recorded for this demo.';
    contactForm.reset();
  });
}

// Save property from the detail page
const detailFavourite = document.querySelector('.favorite-detail');
if (detailFavourite) {
  detailFavourite.addEventListener('click', function() {
    let favourites = JSON.parse(localStorage.getItem('homeFinderFavourites') || '[]');
    const name = 'Modern Family Villa';
    if (!favourites.includes(name)) {
      favourites.push(name);
      localStorage.setItem('homeFinderFavourites', JSON.stringify(favourites));
      detailFavourite.textContent = '♥ Saved to favourites';
    } else {
      detailFavourite.textContent = '♥ Already in favourites';
    }
  });
}
