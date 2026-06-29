const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { pool, getAllSettings, setSettingAsync, refreshSettings } = require('../config/database');

function requireAuth(req, res, next) {
  if (req.session && req.session.adminUser) return next();
  res.redirect('/admin/login');
}

router.get('/login', (req, res) => {
  if (req.session.adminUser) return res.redirect('/admin');
  res.render('admin/login', { error: null });
});

router.post('/login', (req, res, next) => {
  req.app.locals.loginLimiter(req, res, async (err) => {
    if (err) return res.render('admin/login', { error: 'Too many attempts. Try again later.' });
    const { email, password } = req.body;
    if (!email || !password) return res.render('admin/login', { error: 'Email and password required.' });
    try {
      const [rows] = await pool.query('SELECT * FROM admin_users WHERE email = ?', [email]);
      const user = rows[0];
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.render('admin/login', { error: 'Invalid credentials' });
      }
      req.session.regenerate(() => {
        req.session.adminUser = { id: user.id, email: user.email };
        res.redirect('/admin');
      });
    } catch (e) {
      res.render('admin/login', { error: 'Database error. Please try again.' });
    }
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

router.get('/', requireAuth, async (req, res) => {
  const tab = req.query.tab || 'settings';
  try {
    const [services] = await pool.query('SELECT * FROM services ORDER BY sort_order ASC');
    const [whyus] = await pool.query('SELECT * FROM whyus ORDER BY sort_order ASC');
    const [submissions] = await pool.query('SELECT * FROM contact_submissions ORDER BY created_at DESC');
    const [faqs] = await pool.query('SELECT * FROM faqs ORDER BY sort_order ASC');
    const [testimonials] = await pool.query('SELECT * FROM testimonials ORDER BY sort_order ASC');
    const [pricingPackages] = await pool.query('SELECT * FROM pricing_packages ORDER BY sort_order ASC');
    const [clientLogos] = await pool.query('SELECT * FROM client_logos ORDER BY sort_order ASC');
    res.render('admin/dashboard', { tab, services, whyus, submissions, faqs, testimonials, pricingPackages, clientLogos });
  } catch (e) {
    res.render('admin/dashboard', { tab, services: [], whyus: [], submissions: [], faqs: [], testimonials: [], pricingPackages: [], clientLogos: [] });
  }
});

// --- SETTINGS ---
router.post('/api/update-settings', requireAuth, async (req, res) => {
  const allowed = [
    'primary_color','accent_color','bg_color','secondary_color','text_color',
    'site_name','site_tagline','logo_light','logo_dark',
    'hero_headline','hero_subheadline','hero_cta_text','hero_cta_secondary','hero_bg_url',
    'phone','email','ceo_email','address',
    'facebook_url','linkedin_url','whatsapp_url','twitter_url',
    'footer_text','banner_text','banner_bg_color','about_text',
    'services_desc','cta_headline','cta_subheadline','cta_button_text',
    'stat1_label','stat1_value','stat2_label','stat2_value','stat3_label','stat3_value','stat4_label','stat4_value',
    'process_step1_title','process_step1_desc','process_step2_title','process_step2_desc',
    'process_step3_title','process_step3_desc','process_step4_title','process_step4_desc'
  ];
  for (const key of allowed) {
    if (req.body[key] !== undefined) await setSettingAsync(key, String(req.body[key]).trim());
  }
  res.redirect('/admin?tab=settings');
});

router.post('/api/upload', requireAuth, (req, res) => {
  req.app.locals.upload.single('file')(req, res, async (err) => {
    if (err || !req.file) return res.redirect('/admin?tab=settings&error=upload');
    const allowed = ['logo_light', 'logo_dark', 'hero_bg_url'];
    const field = req.body.field || 'logo_light';
    if (allowed.includes(field)) await setSettingAsync(field, `/uploads/${req.file.filename}`);
    res.redirect('/admin?tab=settings');
  });
});

// --- SERVICES ---
router.post('/api/services/add', requireAuth, async (req, res) => {
  const { title, description, detailed_description, icon, flag, features } = req.body;
  if (!title?.trim()) return res.redirect('/admin?tab=services');
  const [[{ m }]] = await pool.query('SELECT MAX(sort_order) as m FROM services');
  await pool.query('INSERT INTO services (title,description,detailed_description,icon,flag,features,sort_order) VALUES (?,?,?,?,?,?,?)',
    [title.trim(), (description||'').trim(), (detailed_description||'').trim(), (icon||'fa-building').trim(), (flag||'').trim(), features || '[]', (m||0)+1]);
  res.redirect('/admin?tab=services');
});

router.post('/api/services/edit', requireAuth, async (req, res) => {
  const { id, title, description, detailed_description, icon, flag, features } = req.body;
  if (!id || !title?.trim()) return res.redirect('/admin?tab=services');
  await pool.query('UPDATE services SET title=?,description=?,detailed_description=?,icon=?,flag=?,features=? WHERE id=?',
    [title.trim(), (description||'').trim(), (detailed_description||'').trim(), (icon||'fa-building').trim(), (flag||'').trim(), features || '[]', id]);
  res.redirect('/admin?tab=services');
});

router.post('/api/services/delete', requireAuth, async (req, res) => {
  if (req.body.id) await pool.query('DELETE FROM services WHERE id=?', [req.body.id]);
  res.redirect('/admin?tab=services');
});

router.post('/api/services/reorder', requireAuth, async (req, res) => {
  const { order } = req.body;
  if (Array.isArray(order)) {
    for (let i = 0; i < order.length; i++) {
      await pool.query('UPDATE services SET sort_order=? WHERE id=?', [i+1, order[i]]);
    }
  }
  res.json({ success: true });
});

// --- WHY US ---
router.post('/api/whyus/add', requireAuth, async (req, res) => {
  const { title, description, icon } = req.body;
  if (!title?.trim()) return res.redirect('/admin?tab=whyus');
  const [[{ m }]] = await pool.query('SELECT MAX(sort_order) as m FROM whyus');
  await pool.query('INSERT INTO whyus (title,description,icon,sort_order) VALUES (?,?,?,?)',
    [title.trim(), (description||'').trim(), (icon||'fa-star').trim(), (m||0)+1]);
  res.redirect('/admin?tab=whyus');
});

router.post('/api/whyus/edit', requireAuth, async (req, res) => {
  const { id, title, description, icon } = req.body;
  if (!id || !title?.trim()) return res.redirect('/admin?tab=whyus');
  await pool.query('UPDATE whyus SET title=?,description=?,icon=? WHERE id=?',
    [title.trim(), (description||'').trim(), (icon||'fa-star').trim(), id]);
  res.redirect('/admin?tab=whyus');
});

router.post('/api/whyus/delete', requireAuth, async (req, res) => {
  if (req.body.id) await pool.query('DELETE FROM whyus WHERE id=?', [req.body.id]);
  res.redirect('/admin?tab=whyus');
});

// --- FAQs ---
router.post('/api/faqs/add', requireAuth, async (req, res) => {
  const { question, answer, category } = req.body;
  if (!question?.trim() || !answer?.trim()) return res.redirect('/admin?tab=faqs');
  const [[{ m }]] = await pool.query('SELECT MAX(sort_order) as m FROM faqs');
  await pool.query('INSERT INTO faqs (question,answer,category,sort_order) VALUES (?,?,?,?)',
    [question.trim(), answer.trim(), (category||'general').trim(), (m||0)+1]);
  res.redirect('/admin?tab=faqs');
});

router.post('/api/faqs/edit', requireAuth, async (req, res) => {
  const { id, question, answer, category } = req.body;
  if (!id || !question?.trim()) return res.redirect('/admin?tab=faqs');
  await pool.query('UPDATE faqs SET question=?,answer=?,category=? WHERE id=?',
    [question.trim(), answer.trim(), (category||'general').trim(), id]);
  res.redirect('/admin?tab=faqs');
});

router.post('/api/faqs/delete', requireAuth, async (req, res) => {
  if (req.body.id) await pool.query('DELETE FROM faqs WHERE id=?', [req.body.id]);
  res.redirect('/admin?tab=faqs');
});

// --- TESTIMONIALS ---
router.post('/api/testimonials/add', requireAuth, async (req, res) => {
  const { name, role, company, quote, rating, video_url, is_featured } = req.body;
  if (!name?.trim() || !quote?.trim()) return res.redirect('/admin?tab=testimonials');
  const [[{ m }]] = await pool.query('SELECT MAX(sort_order) as m FROM testimonials');
  await pool.query('INSERT INTO testimonials (name,role,company,quote,rating,video_url,is_featured,sort_order) VALUES (?,?,?,?,?,?,?,?)',
    [name.trim(), (role||'').trim(), (company||'').trim(), quote.trim(), parseInt(rating)||5, (video_url||'').trim(), is_featured ? 1 : 0, (m||0)+1]);
  res.redirect('/admin?tab=testimonials');
});

router.post('/api/testimonials/edit', requireAuth, async (req, res) => {
  const { id, name, role, company, quote, rating, video_url, is_featured } = req.body;
  if (!id || !name?.trim()) return res.redirect('/admin?tab=testimonials');
  await pool.query('UPDATE testimonials SET name=?,role=?,company=?,quote=?,rating=?,video_url=?,is_featured=? WHERE id=?',
    [name.trim(), (role||'').trim(), (company||'').trim(), quote.trim(), parseInt(rating)||5, (video_url||'').trim(), is_featured ? 1 : 0, id]);
  res.redirect('/admin?tab=testimonials');
});

router.post('/api/testimonials/delete', requireAuth, async (req, res) => {
  if (req.body.id) await pool.query('DELETE FROM testimonials WHERE id=?', [req.body.id]);
  res.redirect('/admin?tab=testimonials');
});

// --- PRICING ---
router.post('/api/pricing/add', requireAuth, async (req, res) => {
  const { country, tier, name, price, original_price, currency, tagline, features, is_popular } = req.body;
  if (!country?.trim() || !name?.trim() || !price?.trim()) return res.redirect('/admin?tab=pricing');
  const [[{ m }]] = await pool.query('SELECT MAX(sort_order) as m FROM pricing_packages');
  await pool.query('INSERT INTO pricing_packages (country,tier,name,price,original_price,currency,tagline,features,is_popular,sort_order) VALUES (?,?,?,?,?,?,?,?,?,?)',
    [country.trim(), (tier||'').trim(), name.trim(), price.trim(), (original_price||'').trim(), (currency||'USD').trim(), (tagline||'').trim(), features || '[]', is_popular ? 1 : 0, (m||0)+1]);
  res.redirect('/admin?tab=pricing');
});

router.post('/api/pricing/edit', requireAuth, async (req, res) => {
  const { id, country, tier, name, price, original_price, currency, tagline, features, is_popular } = req.body;
  if (!id || !name?.trim()) return res.redirect('/admin?tab=pricing');
  await pool.query('UPDATE pricing_packages SET country=?,tier=?,name=?,price=?,original_price=?,currency=?,tagline=?,features=?,is_popular=? WHERE id=?',
    [country.trim(), (tier||'').trim(), name.trim(), price.trim(), (original_price||'').trim(), (currency||'USD').trim(), (tagline||'').trim(), features || '[]', is_popular ? 1 : 0, id]);
  res.redirect('/admin?tab=pricing');
});

router.post('/api/pricing/delete', requireAuth, async (req, res) => {
  if (req.body.id) await pool.query('DELETE FROM pricing_packages WHERE id=?', [req.body.id]);
  res.redirect('/admin?tab=pricing');
});

// --- CLIENT LOGOS ---
router.post('/api/logos/add', requireAuth, async (req, res) => {
  const { name, logo_url, website_url } = req.body;
  if (!name?.trim() || !logo_url?.trim()) return res.redirect('/admin?tab=logos');
  const [[{ m }]] = await pool.query('SELECT MAX(sort_order) as m FROM client_logos');
  await pool.query('INSERT INTO client_logos (name,logo_url,website_url,sort_order) VALUES (?,?,?,?)',
    [name.trim(), logo_url.trim(), (website_url||'').trim(), (m||0)+1]);
  res.redirect('/admin?tab=logos');
});

router.post('/api/logos/edit', requireAuth, async (req, res) => {
  const { id, name, logo_url, website_url } = req.body;
  if (!id || !name?.trim()) return res.redirect('/admin?tab=logos');
  await pool.query('UPDATE client_logos SET name=?,logo_url=?,website_url=? WHERE id=?',
    [name.trim(), logo_url.trim(), (website_url||'').trim(), id]);
  res.redirect('/admin?tab=logos');
});

router.post('/api/logos/delete', requireAuth, async (req, res) => {
  if (req.body.id) await pool.query('DELETE FROM client_logos WHERE id=?', [req.body.id]);
  res.redirect('/admin?tab=logos');
});

// --- SUBMISSIONS ---
router.post('/api/submissions/delete', requireAuth, async (req, res) => {
  if (req.body.id) await pool.query('DELETE FROM contact_submissions WHERE id=?', [req.body.id]);
  res.redirect('/admin?tab=submissions');
});

router.post('/api/submissions/read', requireAuth, async (req, res) => {
  if (req.body.id) await pool.query('UPDATE contact_submissions SET is_read=1 WHERE id=?', [req.body.id]);
  res.redirect('/admin?tab=submissions');
});

module.exports = router;
