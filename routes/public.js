const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const [services] = await pool.query('SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order ASC');
    const [whyus] = await pool.query('SELECT * FROM whyus ORDER BY sort_order ASC');
    const [faqs] = await pool.query('SELECT * FROM faqs WHERE is_active = 1 ORDER BY sort_order ASC');
    const [testimonials] = await pool.query('SELECT * FROM testimonials WHERE is_active = 1 ORDER BY sort_order ASC');
    const [pricingPackages] = await pool.query('SELECT * FROM pricing_packages WHERE is_active = 1 ORDER BY sort_order ASC');
    const [clientLogos] = await pool.query('SELECT * FROM client_logos WHERE is_active = 1 ORDER BY sort_order ASC');
    res.render('index', { services, whyus, faqs, testimonials, pricingPackages, clientLogos, query: req.query });
  } catch (e) {
    console.error('Error loading homepage:', e);
    res.render('index', { services: [], whyus: [], faqs: [], testimonials: [], pricingPackages: [], clientLogos: [], query: req.query });
  }
});

router.post('/contact', (req, res, next) => {
  req.app.locals.contactLimiter(req, res, async (err) => {
    if (err) return res.redirect('/#contact?error=rate_limit');
    const { name, email, phone, service_interest, message } = req.body;
    if (!name?.trim() || !email?.trim() || !message?.trim()) return res.redirect('/#contact');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return res.redirect('/#contact?error=invalid_email');
    try {
      await pool.query(
        'INSERT INTO contact_submissions (name, email, phone, service_interest, message) VALUES (?, ?, ?, ?, ?)',
        [name.trim(), email.trim(), (phone || '').trim(), (service_interest || '').trim(), message.trim()]
      );
    } catch (e) { /* log silently */ }
    res.redirect('/#contact?submitted=true');
  });
});

module.exports = router;
