require('dotenv').config();
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const DB_TYPE = (process.env.DB_TYPE || 'mysql').toLowerCase();

// --- In-memory settings cache ---
let _settings = {};

// --- SQLite adapter ---
function initSQLite() {
  const Database = require('better-sqlite3');
  const dbPath = path.resolve(process.env.DB_PATH || './data/trust-formation.db');
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  const db = require('better-sqlite3')(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      detailed_description TEXT DEFAULT '',
      icon TEXT DEFAULT 'fa-building',
      flag TEXT DEFAULT '',
      image_url TEXT DEFAULT '',
      features TEXT DEFAULT '[]',
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS whyus (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      icon TEXT DEFAULT 'fa-star',
      sort_order INTEGER DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS faqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      category TEXT DEFAULT 'general',
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT DEFAULT '',
      company TEXT DEFAULT '',
      quote TEXT NOT NULL,
      avatar_url TEXT DEFAULT '',
      video_url TEXT DEFAULT '',
      rating INTEGER DEFAULT 5,
      is_featured INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS pricing_packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      country TEXT NOT NULL,
      tier TEXT NOT NULL,
      name TEXT NOT NULL,
      price TEXT NOT NULL,
      original_price TEXT DEFAULT '',
      currency TEXT DEFAULT 'USD',
      tagline TEXT DEFAULT '',
      features TEXT DEFAULT '[]',
      is_popular INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS client_logos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      logo_url TEXT NOT NULL,
      website_url TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT DEFAULT '',
      service_interest TEXT DEFAULT '',
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedSQLite(db);

  db.prepare('SELECT key, value FROM settings').all()
    .forEach(r => { _settings[r.key] = r.value; });

  console.log('SQLite database initialized successfully.');

  const pool = {
    query: async (sql, params = []) => {
      sql = sql.replace(/`/g, '"');
      if (/^\s*SELECT/i.test(sql)) {
        const rows = db.prepare(sql).all(...params);
        return [rows];
      } else {
        const info = db.prepare(sql).run(...params);
        return [{ insertId: info.lastInsertRowid, affectedRows: info.changes }];
      }
    },
    getConnection: async () => ({
      query: async (sql, params = []) => pool.query(sql, params),
      release: () => {},
    }),
  };

  return pool;
}

function seedSQLite(db) {
  const count = db.prepare('SELECT COUNT(*) as c FROM settings').get().c;
  if (count > 0) return;

  const defaults = {
    primary_color: '#0D1B2A', accent_color: '#E8963E', bg_color: '#0A0F1C',
    secondary_color: '#1B2838', text_color: '#B8C5D6',
    site_name: 'Trust Formation', site_tagline: 'Your Trusted Partner for Global Business Formation',
    logo_light: '/trust-white-logo.png', logo_dark: '/trust-black-logo.png',
    hero_headline: 'Launch Your Business Globally with Confidence',
    hero_subheadline: 'We handle company registration, compliance, and formation across the USA, UK, Canada, and Bangladesh — so you can focus on growing your business.',
    hero_cta_text: 'Get Started Today', hero_cta_secondary: 'View Services',
    hero_bg_url: '',
    phone: '+1 (917) 718-9718', email: 'info@trustformation.net',
    ceo_email: 'ceo@trustformation.net',
    address: '2554 Bedford Avenue, Brooklyn, NY, United States',
    facebook_url: 'https://www.facebook.com/TrustFormation/',
    linkedin_url: '', whatsapp_url: '', twitter_url: '',
    footer_text: `© ${new Date().getFullYear()} Trust Formation. All rights reserved.`,
    banner_text: 'Hassle-free business formation in 50+ countries',
    banner_bg_color: '#0D1B2A',
    stat1_label: 'Happy Clients', stat1_value: '5,000+',
    stat2_label: 'Countries', stat2_value: '50+',
    stat3_label: 'Experience', stat3_value: '10+ Years',
    stat4_label: 'Success Rate', stat4_value: '99.8%',
    services_desc: 'Comprehensive business formation and compliance solutions worldwide. From LLC setup in the USA to Ltd formation in the UK — we handle everything.',
    about_text: 'Trust Formation is a leading corporate service provider specializing in international business formation. With over a decade of experience, we have helped thousands of entrepreneurs and businesses establish their presence across the USA, UK, Canada, and Bangladesh.',
    cta_headline: 'Ready to Start Your Business Journey?',
    cta_subheadline: 'Get a free consultation and discover how we can help you launch your company in any country.',
    cta_button_text: 'Book Free Consultation',
    process_step1_title: 'Consultation',
    process_step1_desc: 'Share your business goals and we\'ll recommend the best formation strategy.',
    process_step2_title: 'Documentation',
    process_step2_desc: 'We prepare and file all required documents with the relevant authorities.',
    process_step3_title: 'Formation',
    process_step3_desc: 'Your company is officially registered and ready to operate.',
    process_step4_title: 'Ongoing Support',
    process_step4_desc: 'Bank accounts, compliance, tax filing — we support you long-term.',
  };

  const ins = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  for (const [k, v] of Object.entries(defaults)) ins.run(k, v);

  const services = [
    ['USA Company Formation (LLC Setup)', 'Register your LLC or Corporation in the United States with full compliance. Includes EIN, registered agent, and operating agreement.', 'Full-service LLC formation including state filing, EIN获取, registered agent service, operating agreement, and ongoing compliance support.', 'fa-flag-usa', '🇺🇸', '', JSON.stringify(['LLC & Corporation formation', 'EIN (Tax ID) registration', 'Registered agent service (1 year)', 'Operating agreement', 'Business address (1 year)', 'Mail forwarding']), 1],
    ['UK Company Registration (Ltd Setup)', 'Set up your Limited Company in the United Kingdom quickly and easily with Companies House registration.', 'Complete UK Ltd formation with Companies House registration, registered office address, director service address, and UTR number.', 'fa-building', '🇬🇧', '', JSON.stringify(['Companies House registration', 'UK registered office (1 year)', 'Director service address', 'UTR number application', 'PSC register', 'Incorporation certificate']), 2],
    ['Canada Company Formation', 'Start your business in Canada with expert guidance through federal or provincial incorporation.', 'Expert-guided Canadian business incorporation at federal or provincial level, with full compliance documentation.', 'fa-leaf', '🇨🇦', '', JSON.stringify(['Federal or provincial incorporation', 'NUANS name search', 'Articles of incorporation', 'Corporate seal', 'Registered agent service', 'Annual compliance support']), 3],
    ['Bangladesh Company Registration (RJSC)', 'Register your company in Bangladesh with complete RJSC filing, memorandum, and legal assistance.', 'Full Bangladesh company registration including RJSC filing, memorandum & articles of association, trade license, and TIN.', 'fa-landmark', '🇧🇩', '', JSON.stringify(['RJSC registration', 'Memorandum & Articles of Association', 'Trade license acquisition', 'TIN (Tax Identification Number)', 'Bank account opening assistance', 'Board resolution drafting']), 4],
    ['E-Trade License', 'Obtain your e-commerce trade license to legally sell online across international markets.', 'Complete e-commerce trade license acquisition for online selling across domestic and international platforms.', 'fa-cart-shopping', '', '', JSON.stringify(['Trade license application', 'Platform compliance review', 'Payment gateway setup', 'Cross-border selling guidance', 'VAT/GST registration', 'Annual renewal support']), 5],
    ['Audit Support', 'Professional audit support and regulatory compliance services for businesses of all sizes.', 'Comprehensive audit preparation and compliance support including financial review, documentation, and regulatory filings.', 'fa-magnifying-glass-chart', '', '', JSON.stringify(['Financial audit preparation', 'Compliance gap analysis', 'Regulatory filing support', 'Internal controls review', 'Documentation assistance', 'Audit response support']), 6],
    ['Apostille & Attestation Services', 'Get apostille certification and embassy attestation for international document authentication.', 'Fast and reliable apostille certification and embassy attestation for documents needed internationally.', 'fa-stamp', '', '', JSON.stringify(['Hague Apostille certification', 'Embassy attestation', 'Document authentication', 'Multi-country processing', 'Expedited service available', 'Door-to-door delivery']), 7],
    ['Notary & Translation Services', 'Professional notarization and certified translation services for legal and business documents.', 'Expert notarization and certified translation services for documents in any language, accepted worldwide.', 'fa-file-signature', '', '', JSON.stringify(['Public notary services', 'Certified translations (100+ languages)', 'Legal document translation', 'Sworn translator certificates', 'Apostille for translations', 'Rush processing available']), 8],
  ];
  const svc = db.prepare('INSERT INTO services (title, description, detailed_description, icon, flag, image_url, features, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  for (const s of services) svc.run(...s);

  const whyus = [
    ['Fast Processing', 'Most formations completed within 48 hours with our streamlined digital process.', 'fa-bolt', 1],
    ['Transparent Pricing', 'No hidden fees, no surprises. What you see is what you pay — guaranteed.', 'fa-dollar-sign', 2],
    ['100% Legal Compliance', 'Fully compliant with all local and international regulations. Your business is protected.', 'fa-shield-halved', 3],
    ['Dedicated Support', 'Our expert team is available 24/7 to assist you at every step of the formation process.', 'fa-headset', 4],
    ['Global Network', 'Established partnerships with banks, government agencies, and legal firms in 50+ countries.', 'fa-globe', 5],
    ['Proven Track Record', 'Over 5,000 successful formations with a 99.8% approval rate across all jurisdictions.', 'fa-chart-line', 6],
  ];
  const why = db.prepare('INSERT INTO whyus (title, description, icon, sort_order) VALUES (?, ?, ?, ?)');
  for (const w of whyus) why.run(...w);

  const faqs = [
    ['Can non-residents register a company in the USA?', 'Yes, absolutely. Non-US residents can form an LLC or Corporation in the USA without living in the country. You do not need a US address, Social Security Number, or ITIN to start. We handle the entire process remotely, including registered agent service and EIN application.', 'usa', 1],
    ['What documents do I need for USA LLC formation?', 'You will need: a valid passport or government-issued ID, proof of address (utility bill or bank statement from the last 3 months), and your chosen company name. We handle all the state filings, EIN application, and operating agreement on your behalf.', 'usa', 2],
    ['How long does it take to form a company in the USA?', 'LLC formation typically takes 3-5 business days for state processing. EIN issuance takes 1-2 business days after filing. Total time from document submission to having a fully operational company is usually 7-10 business days.', 'usa', 3],
    ['Which US state should I form my LLC in?', 'Delaware, Wyoming, and New Mexico are the most popular states for non-resident LLCs due to favorable tax laws, privacy protections, and low fees. We provide a free consultation to help you choose the best state for your specific business needs.', 'usa', 4],
    ['Can non-residents register a company in the UK?', 'Yes. Non-UK residents can form a UK Limited Company. You need at least one director (who can be non-UK resident) and a UK registered office address, which we provide as part of our formation package.', 'uk', 5],
    ['What are the ongoing compliance requirements for a UK Ltd?', 'UK companies must file an annual confirmation statement and annual accounts with Companies House. Our packages include compliance reminders and support for these filings to keep your company in good standing.', 'uk', 6],
    ['How much does it cost to register a company in Bangladesh?', 'Bangladesh company registration costs vary based on authorized capital and company type. Our packages start from BDT 15,000 and include RJSC filing, memorandum preparation, trade license, and TIN. Contact us for a detailed quote based on your specific requirements.', 'bangladesh', 7],
    ['What is an apostille and when do I need one?', 'An apostille is a form of authentication issued to documents for use in countries that are part of the Hague Apostille Convention. You may need an apostille for educational documents, business documents, power of attorney, or any legal document to be used in a foreign country.', 'services', 8],
    ['Do you provide bank account opening assistance?', 'Yes. Our packages include guidance and support for opening business bank accounts in your formation country. We work with major banks and fintech providers to help you get the best banking solution for your business needs.', 'general', 9],
    ['What payment methods do you accept?', 'We accept all major credit/debit cards, PayPal, bank transfers, and cryptocurrency payments. All transactions are secured with SSL encryption and PCI DSS compliance.', 'general', 10],
  ];
  const faq = db.prepare('INSERT INTO faqs (question, answer, category, sort_order) VALUES (?, ?, ?, ?)');
  for (const f of faqs) faq.run(...f);

  const testimonials = [
    ['Mohammad Mainul Arefin', 'Founder & CEO', 'Ecomcarry LLC', 'Trust Formation made our US LLC setup incredibly smooth. PayPal and Stripe accounts were working within days. Their team is professional, responsive, and truly cares about client success.', '', '', 5, 1, 1],
    ['Abu Huraira Bin Aman', 'Co-Founder & CTO', 'VISER X', 'The level of professionalism and after-service support is unmatched. From company registration to bank account setup, every step was handled with expertise. Highly recommended for anyone looking to expand globally.', '', '', 5, 1, 2],
    ['Sultan Mahamud', 'Co-Founder & CEO', 'Digital Ventures', 'What impressed me most was the transparency and clear communication. No hidden charges, no surprises. Everything was exactly as promised. Trust Formation lives up to their name.', '', '', 5, 1, 3],
    ['Reyazul Masud Riham', 'Founder', 'Global Trade Co.', 'From Bangladesh to a US LLC — Trust Formation handled everything including RJSC, apostille, and bank setup. One-stop solution for international business formation.', '', '', 4, 0, 4],
  ];
  const test = db.prepare('INSERT INTO testimonials (name, role, company, quote, avatar_url, video_url, rating, is_featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  for (const t of testimonials) test.run(...t);

  const packages = [
    ['USA', 'Basic', 'Incorporate', '$199', '$249', 'USD', 'Start Compliant', JSON.stringify(['LLC Incorporation', 'EIN (Tax ID)', 'Registered Agent (1 yr)', 'Business Address (1 yr)', 'Operating Agreement', 'Basic Tax Consultation']), 0, 1],
    ['USA', 'Growth', 'Growth', '$449', '$499', 'USD', 'Grow with Support', JSON.stringify(['Everything in Basic', 'Bank Account Setup', 'Fintech Business Account', 'Business Debit Card', 'Stripe Setup', 'Expert Financial Guidance']), 1, 2],
    ['USA', 'Elite', 'Elite', '$749', '$799', 'USD', 'Run It Like a Pro', JSON.stringify(['Everything in Growth', 'PayPal Setup', 'ITIN (Tax ID)', 'High-Value Business Guide', 'Priority Support', 'Annual Compliance Review']), 0, 3],
    ['UK', 'Basic', 'Basic', '£179', '£229', 'GBP', 'Essential Setup', JSON.stringify(['Companies House Registration', 'UK Registered Office (1 yr)', 'Director Service Address', 'ID Verification', 'UTR Number', 'Wise Business Account']), 0, 4],
    ['UK', 'Standard', 'Standard', '£229', '£279', 'GBP', 'Professional', JSON.stringify(['Everything in Basic', 'Stripe Setup Guidance', 'Compliance Reminders', 'PSC Register', 'Incorporation Certificate', 'Web Authentication Code']), 1, 5],
    ['UK', 'Premium', 'Premium', '£299', '£349', 'GBP', 'Complete Package', JSON.stringify(['Everything in Standard', 'PayPal Setup Guidance', 'Priority Support', 'Tax Consultation', 'Annual Filing Support', 'Dedicated Account Manager']), 0, 6],
    ['Canada', 'Basic', 'Starter', '$299', '$399', 'USD', 'Launch Your Canadian Business', JSON.stringify(['Federal Incorporation', 'NUANS Name Search', 'Articles of Incorporation', 'Corporate Seal', 'Registered Agent (1 yr)', 'Basic Compliance Guide']), 0, 7],
    ['Canada', 'Growth', 'Business', '$549', '$649', 'USD', 'Scale in Canada', JSON.stringify(['Everything in Starter', 'Provincial Registration', 'Bank Account Assistance', 'Business Number (BN)', 'GST/HST Registration', 'Priority Support']), 1, 8],
    ['Bangladesh', 'Basic', 'Startup', 'BDT 25,000', 'BDT 35,000', 'BDT', 'Launch Locally', JSON.stringify(['RJSC Registration', 'Memorandum & Articles', 'Trade License', 'TIN Certificate', 'Board Resolution', 'Basic Compliance']), 0, 9],
    ['Bangladesh', 'Standard', 'Enterprise', 'BDT 45,000', 'BDT 60,000', 'BDT', 'Scale in Bangladesh', JSON.stringify(['Everything in Startup', 'Bank Account Opening', 'VAT Registration', 'IRC/ERC (Import/Export)', 'Bonded Warehouse License', 'Priority Support']), 1, 10],
  ];
  const pkg = db.prepare('INSERT INTO pricing_packages (country, tier, name, price, original_price, currency, tagline, features, is_popular, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  for (const p of packages) pkg.run(...p);

  const logos = [
    ['Wise', '/client-logos/wise.svg', 'https://wise.com', 1],
    ['Payoneer', '/client-logos/payoneer.svg', 'https://payoneer.com', 2],
    ['Stripe', '/client-logos/stripe.svg', 'https://stripe.com', 3],
    ['PayPal', '/client-logos/paypal.svg', 'https://paypal.com', 4],
    ['Amazon', '/client-logos/amazon.svg', 'https://amazon.com', 5],
  ];
  const logo = db.prepare('INSERT INTO client_logos (name, logo_url, website_url, sort_order) VALUES (?, ?, ?, ?)');
  for (const l of logos) logo.run(...l);

  const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'Admin@2025', 10);
  db.prepare('INSERT OR IGNORE INTO admin_users (email, password) VALUES (?, ?)').run(
    process.env.ADMIN_EMAIL || 'admin@trustformation.net', hash
  );

  console.log('Default data seeded successfully.');
}

// --- MySQL adapter ---
function initMySQL() {
  const mysql = require('mysql2/promise');
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    database: process.env.DB_NAME || 'trustfo1_web',
    user: process.env.DB_USER || 'trustfo1_jub',
    password: process.env.DB_PASS || '',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4',
  });

  async function setup() {
    const conn = await pool.getConnection();
    try {
      await conn.query(`CREATE TABLE IF NOT EXISTS settings (\`key\` VARCHAR(100) PRIMARY KEY, value TEXT, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
      await conn.query(`CREATE TABLE IF NOT EXISTS services (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL, description TEXT DEFAULT '', detailed_description TEXT DEFAULT '', icon VARCHAR(100) DEFAULT 'fa-building', flag VARCHAR(20) DEFAULT '', image_url VARCHAR(500) DEFAULT '', features TEXT DEFAULT '[]', sort_order INT DEFAULT 0, is_active TINYINT(1) DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
      await conn.query(`CREATE TABLE IF NOT EXISTS whyus (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL, description TEXT DEFAULT '', icon VARCHAR(100) DEFAULT 'fa-star', sort_order INT DEFAULT 0) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
      await conn.query(`CREATE TABLE IF NOT EXISTS faqs (id INT AUTO_INCREMENT PRIMARY KEY, question TEXT NOT NULL, answer TEXT NOT NULL, category VARCHAR(50) DEFAULT 'general', sort_order INT DEFAULT 0, is_active TINYINT(1) DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
      await conn.query(`CREATE TABLE IF NOT EXISTS testimonials (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, role VARCHAR(255) DEFAULT '', company VARCHAR(255) DEFAULT '', quote TEXT NOT NULL, avatar_url VARCHAR(500) DEFAULT '', video_url VARCHAR(500) DEFAULT '', rating INT DEFAULT 5, is_featured TINYINT(1) DEFAULT 0, sort_order INT DEFAULT 0, is_active TINYINT(1) DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
      await conn.query(`CREATE TABLE IF NOT EXISTS pricing_packages (id INT AUTO_INCREMENT PRIMARY KEY, country VARCHAR(50) NOT NULL, tier VARCHAR(50) NOT NULL, name VARCHAR(100) NOT NULL, price VARCHAR(50) NOT NULL, original_price VARCHAR(50) DEFAULT '', currency VARCHAR(10) DEFAULT 'USD', tagline VARCHAR(255) DEFAULT '', features TEXT DEFAULT '[]', is_popular TINYINT(1) DEFAULT 0, sort_order INT DEFAULT 0, is_active TINYINT(1) DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
      await conn.query(`CREATE TABLE IF NOT EXISTS client_logos (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, logo_url VARCHAR(500) NOT NULL, website_url VARCHAR(500) DEFAULT '', sort_order INT DEFAULT 0, is_active TINYINT(1) DEFAULT 1, created_at DATETIME DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
      await conn.query(`CREATE TABLE IF NOT EXISTS admin_users (id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
      await conn.query(`CREATE TABLE IF NOT EXISTS contact_submissions (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, phone VARCHAR(50) DEFAULT '', service_interest VARCHAR(255) DEFAULT '', message TEXT NOT NULL, is_read TINYINT(1) DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
      await seedMySQL(conn);
      const [rows] = await conn.query('SELECT `key`, value FROM settings');
      rows.forEach(r => { _settings[r.key] = r.value; });
      console.log('MySQL database initialized successfully.');
    } finally {
      conn.release();
    }
  }

  setup().catch(err => {
    console.error('Database initialization failed:', err.message);
    console.error('Check MySQL credentials in .env — DB_HOST, DB_NAME, DB_USER, DB_PASS');
    process.exit(1);
  });

  return pool;
}

async function seedMySQL(conn) {
  const [[{ c }]] = await conn.query('SELECT COUNT(*) as c FROM settings');
  if (c > 0) return;

  const defaults = {
    primary_color: '#0D1B2A', accent_color: '#E8963E', bg_color: '#0A0F1C',
    secondary_color: '#1B2838', text_color: '#B8C5D6',
    site_name: 'Trust Formation', site_tagline: 'Your Trusted Partner for Global Business Formation',
    logo_light: '/trust-white-logo.png', logo_dark: '/trust-black-logo.png',
    hero_headline: 'Launch Your Business Globally with Confidence',
    hero_subheadline: 'We handle company registration, compliance, and formation across the USA, UK, Canada, and Bangladesh — so you can focus on growing your business.',
    hero_cta_text: 'Get Started Today', hero_cta_secondary: 'View Services',
    hero_bg_url: '',
    phone: '+1 (917) 718-9718', email: 'info@trustformation.net',
    ceo_email: 'ceo@trustformation.net',
    address: '2554 Bedford Avenue, Brooklyn, NY, United States',
    facebook_url: 'https://www.facebook.com/TrustFormation/',
    linkedin_url: '', whatsapp_url: '', twitter_url: '',
    footer_text: `© ${new Date().getFullYear()} Trust Formation. All rights reserved.`,
    banner_text: 'Hassle-free business formation in 50+ countries',
    banner_bg_color: '#0D1B2A',
    stat1_label: 'Happy Clients', stat1_value: '5,000+',
    stat2_label: 'Countries', stat2_value: '50+',
    stat3_label: 'Experience', stat3_value: '10+ Years',
    stat4_label: 'Success Rate', stat4_value: '99.8%',
    services_desc: 'Comprehensive business formation and compliance solutions worldwide.',
    about_text: 'Trust Formation is a leading corporate service provider specializing in international business formation.',
    cta_headline: 'Ready to Start Your Business Journey?',
    cta_subheadline: 'Get a free consultation and discover how we can help you launch your company.',
    cta_button_text: 'Book Free Consultation',
    process_step1_title: 'Consultation',
    process_step1_desc: 'Share your business goals and we\'ll recommend the best formation strategy.',
    process_step2_title: 'Documentation',
    process_step2_desc: 'We prepare and file all required documents with the relevant authorities.',
    process_step3_title: 'Formation',
    process_step3_desc: 'Your company is officially registered and ready to operate.',
    process_step4_title: 'Ongoing Support',
    process_step4_desc: 'Bank accounts, compliance, tax filing — we support you long-term.',
  };
  for (const [k, v] of Object.entries(defaults))
    await conn.query('INSERT IGNORE INTO settings (`key`, value) VALUES (?, ?)', [k, v]);

  const services = [
    ['USA Company Formation (LLC Setup)', 'Register your LLC or Corporation in the United States with full compliance. Includes EIN, registered agent, and operating agreement.', 'Full-service LLC formation including state filing, EIN获取, registered agent service, operating agreement, and ongoing compliance support.', 'fa-flag-usa', '🇺🇸', '', JSON.stringify(['LLC & Corporation formation', 'EIN (Tax ID) registration', 'Registered agent service (1 year)', 'Operating agreement', 'Business address (1 year)', 'Mail forwarding']), 1],
    ['UK Company Registration (Ltd Setup)', 'Set up your Limited Company in the United Kingdom quickly and easily with Companies House registration.', 'Complete UK Ltd formation with Companies House registration, registered office address, director service address, and UTR number.', 'fa-building', '🇬🇧', '', JSON.stringify(['Companies House registration', 'UK registered office (1 year)', 'Director service address', 'UTR number application', 'PSC register', 'Incorporation certificate']), 2],
    ['Canada Company Formation', 'Start your business in Canada with expert guidance through federal or provincial incorporation.', 'Expert-guided Canadian business incorporation at federal or provincial level, with full compliance documentation.', 'fa-leaf', '🇨🇦', '', JSON.stringify(['Federal or provincial incorporation', 'NUANS name search', 'Articles of incorporation', 'Corporate seal', 'Registered agent service', 'Annual compliance support']), 3],
    ['Bangladesh Company Registration (RJSC)', 'Register your company in Bangladesh with complete RJSC filing, memorandum, and legal assistance.', 'Full Bangladesh company registration including RJSC filing, memorandum & articles of association, trade license, and TIN.', 'fa-landmark', '🇧🇩', '', JSON.stringify(['RJSC registration', 'Memorandum & Articles of Association', 'Trade license acquisition', 'TIN (Tax Identification Number)', 'Bank account opening assistance', 'Board resolution drafting']), 4],
    ['E-Trade License', 'Obtain your e-commerce trade license to legally sell online across international markets.', 'Complete e-commerce trade license acquisition for online selling across domestic and international platforms.', 'fa-cart-shopping', '', '', JSON.stringify(['Trade license application', 'Platform compliance review', 'Payment gateway setup', 'Cross-border selling guidance', 'VAT/GST registration', 'Annual renewal support']), 5],
    ['Audit Support', 'Professional audit support and regulatory compliance services for businesses of all sizes.', 'Comprehensive audit preparation and compliance support including financial review, documentation, and regulatory filings.', 'fa-magnifying-glass-chart', '', '', JSON.stringify(['Financial audit preparation', 'Compliance gap analysis', 'Regulatory filing support', 'Internal controls review', 'Documentation assistance', 'Audit response support']), 6],
    ['Apostille & Attestation Services', 'Get apostille certification and embassy attestation for international document authentication.', 'Fast and reliable apostille certification and embassy attestation for documents needed internationally.', 'fa-stamp', '', '', JSON.stringify(['Hague Apostille certification', 'Embassy attestation', 'Document authentication', 'Multi-country processing', 'Expedited service available', 'Door-to-door delivery']), 7],
    ['Notary & Translation Services', 'Professional notarization and certified translation services for legal and business documents.', 'Expert notarization and certified translation services for documents in any language, accepted worldwide.', 'fa-file-signature', '', '', JSON.stringify(['Public notary services', 'Certified translations (100+ languages)', 'Legal document translation', 'Sworn translator certificates', 'Apostille for translations', 'Rush processing available']), 8],
  ];
  for (const s of services)
    await conn.query('INSERT INTO services (title, description, detailed_description, icon, flag, image_url, features, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', s);

  const whyus = [
    ['Fast Processing', 'Most formations completed within 48 hours with our streamlined digital process.', 'fa-bolt', 1],
    ['Transparent Pricing', 'No hidden fees, no surprises. What you see is what you pay — guaranteed.', 'fa-dollar-sign', 2],
    ['100% Legal Compliance', 'Fully compliant with all local and international regulations. Your business is protected.', 'fa-shield-halved', 3],
    ['Dedicated Support', 'Our expert team is available 24/7 to assist you at every step of the formation process.', 'fa-headset', 4],
    ['Global Network', 'Established partnerships with banks, government agencies, and legal firms in 50+ countries.', 'fa-globe', 5],
    ['Proven Track Record', 'Over 5,000 successful formations with a 99.8% approval rate across all jurisdictions.', 'fa-chart-line', 6],
  ];
  for (const w of whyus)
    await conn.query('INSERT INTO whyus (title, description, icon, sort_order) VALUES (?, ?, ?, ?)', w);

  const faqs = [
    ['Can non-residents register a company in the USA?', 'Yes, absolutely. Non-US residents can form an LLC or Corporation in the USA without living in the country. You do not need a US address, Social Security Number, or ITIN to start. We handle the entire process remotely, including registered agent service and EIN application.', 'usa', 1],
    ['What documents do I need for USA LLC formation?', 'You will need: a valid passport or government-issued ID, proof of address (utility bill or bank statement from the last 3 months), and your chosen company name. We handle all the state filings, EIN application, and operating agreement on your behalf.', 'usa', 2],
    ['How long does it take to form a company in the USA?', 'LLC formation typically takes 3-5 business days for state processing. EIN issuance takes 1-2 business days after filing. Total time from document submission to having a fully operational company is usually 7-10 business days.', 'usa', 3],
    ['Which US state should I form my LLC in?', 'Delaware, Wyoming, and New Mexico are the most popular states for non-resident LLCs due to favorable tax laws, privacy protections, and low fees. We provide a free consultation to help you choose the best state for your specific business needs.', 'usa', 4],
    ['Can non-residents register a company in the UK?', 'Yes. Non-UK residents can form a UK Limited Company. You need at least one director (who can be non-UK resident) and a UK registered office address, which we provide as part of our formation package.', 'uk', 5],
    ['What are the ongoing compliance requirements for a UK Ltd?', 'UK companies must file an annual confirmation statement and annual accounts with Companies House. Our packages include compliance reminders and support for these filings to keep your company in good standing.', 'uk', 6],
    ['How much does it cost to register a company in Bangladesh?', 'Bangladesh company registration costs vary based on authorized capital and company type. Our packages start from BDT 15,000 and include RJSC filing, memorandum preparation, trade license, and TIN. Contact us for a detailed quote.', 'bangladesh', 7],
    ['What is an apostille and when do I need one?', 'An apostille is a form of authentication issued to documents for use in countries that are part of the Hague Apostille Convention. You may need an apostille for educational documents, business documents, power of attorney, or any legal document to be used in a foreign country.', 'services', 8],
    ['Do you provide bank account opening assistance?', 'Yes. Our packages include guidance and support for opening business bank accounts in your formation country. We work with major banks and fintech providers to help you get the best banking solution for your business needs.', 'general', 9],
    ['What payment methods do you accept?', 'We accept all major credit/debit cards, PayPal, bank transfers, and cryptocurrency payments. All transactions are secured with SSL encryption and PCI DSS compliance.', 'general', 10],
  ];
  for (const f of faqs)
    await conn.query('INSERT INTO faqs (question, answer, category, sort_order) VALUES (?, ?, ?, ?)', f);

  const testimonials = [
    ['Mohammad Mainul Arefin', 'Founder & CEO', 'Ecomcarry LLC', 'Trust Formation made our US LLC setup incredibly smooth. PayPal and Stripe accounts were working within days. Their team is professional, responsive, and truly cares about client success.', '', '', 5, 1, 1],
    ['Abu Huraira Bin Aman', 'Co-Founder & CTO', 'VISER X', 'The level of professionalism and after-service support is unmatched. From company registration to bank account setup, every step was handled with expertise.', '', '', 5, 1, 2],
    ['Sultan Mahamud', 'Co-Founder & CEO', 'Digital Ventures', 'What impressed me most was the transparency and clear communication. No hidden charges, no surprises. Everything was exactly as promised.', '', '', 5, 1, 3],
    ['Reyazul Masud Riham', 'Founder', 'Global Trade Co.', 'From Bangladesh to a US LLC — Trust Formation handled everything including RJSC, apostille, and bank setup. One-stop solution for international business formation.', '', '', 4, 0, 4],
  ];
  for (const t of testimonials)
    await conn.query('INSERT INTO testimonials (name, role, company, quote, avatar_url, video_url, rating, is_featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', t);

  const packages = [
    ['USA', 'Basic', 'Incorporate', '$199', '$249', 'USD', 'Start Compliant', JSON.stringify(['LLC Incorporation', 'EIN (Tax ID)', 'Registered Agent (1 yr)', 'Business Address (1 yr)', 'Operating Agreement', 'Basic Tax Consultation']), 0, 1],
    ['USA', 'Growth', 'Growth', '$449', '$499', 'USD', 'Grow with Support', JSON.stringify(['Everything in Basic', 'Bank Account Setup', 'Fintech Business Account', 'Business Debit Card', 'Stripe Setup', 'Expert Financial Guidance']), 1, 2],
    ['USA', 'Elite', 'Elite', '$749', '$799', 'USD', 'Run It Like a Pro', JSON.stringify(['Everything in Growth', 'PayPal Setup', 'ITIN (Tax ID)', 'High-Value Business Guide', 'Priority Support', 'Annual Compliance Review']), 0, 3],
    ['UK', 'Basic', 'Basic', '£179', '£229', 'GBP', 'Essential Setup', JSON.stringify(['Companies House Registration', 'UK Registered Office (1 yr)', 'Director Service Address', 'ID Verification', 'UTR Number', 'Wise Business Account']), 0, 4],
    ['UK', 'Standard', 'Standard', '£229', '£279', 'GBP', 'Professional', JSON.stringify(['Everything in Basic', 'Stripe Setup Guidance', 'Compliance Reminders', 'PSC Register', 'Incorporation Certificate', 'Web Authentication Code']), 1, 5],
    ['UK', 'Premium', 'Premium', '£299', '£349', 'GBP', 'Complete Package', JSON.stringify(['Everything in Standard', 'PayPal Setup Guidance', 'Priority Support', 'Tax Consultation', 'Annual Filing Support', 'Dedicated Account Manager']), 0, 6],
    ['Canada', 'Basic', 'Starter', '$299', '$399', 'USD', 'Launch Your Canadian Business', JSON.stringify(['Federal Incorporation', 'NUANS Name Search', 'Articles of Incorporation', 'Corporate Seal', 'Registered Agent (1 yr)', 'Basic Compliance Guide']), 0, 7],
    ['Canada', 'Growth', 'Business', '$549', '$649', 'USD', 'Scale in Canada', JSON.stringify(['Everything in Starter', 'Provincial Registration', 'Bank Account Assistance', 'Business Number (BN)', 'GST/HST Registration', 'Priority Support']), 1, 8],
    ['Bangladesh', 'Basic', 'Startup', 'BDT 25,000', 'BDT 35,000', 'BDT', 'Launch Locally', JSON.stringify(['RJSC Registration', 'Memorandum & Articles', 'Trade License', 'TIN Certificate', 'Board Resolution', 'Basic Compliance']), 0, 9],
    ['Bangladesh', 'Standard', 'Enterprise', 'BDT 45,000', 'BDT 60,000', 'BDT', 'Scale in Bangladesh', JSON.stringify(['Everything in Startup', 'Bank Account Opening', 'VAT Registration', 'IRC/ERC (Import/Export)', 'Bonded Warehouse License', 'Priority Support']), 1, 10],
  ];
  for (const p of packages)
    await conn.query('INSERT INTO pricing_packages (country, tier, name, price, original_price, currency, tagline, features, is_popular, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', p);

  const logos = [
    ['Wise', '/client-logos/wise.svg', 'https://wise.com', 1],
    ['Payoneer', '/client-logos/payoneer.svg', 'https://payoneer.com', 2],
    ['Stripe', '/client-logos/stripe.svg', 'https://stripe.com', 3],
    ['PayPal', '/client-logos/paypal.svg', 'https://paypal.com', 4],
    ['Amazon', '/client-logos/amazon.svg', 'https://amazon.com', 5],
  ];
  for (const l of logos)
    await conn.query('INSERT INTO client_logos (name, logo_url, website_url, sort_order) VALUES (?, ?, ?, ?)', l);

  const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'Admin@2025', 10);
  await conn.query('INSERT IGNORE INTO admin_users (email, password) VALUES (?, ?)',
    [process.env.ADMIN_EMAIL || 'admin@trustformation.net', hash]);

  console.log('Default data seeded successfully.');
}

// --- Shared helpers ---
function getSetting(key, defaultVal = '') {
  return _settings[key] !== undefined ? _settings[key] : defaultVal;
}

function getAllSettings() {
  return { ..._settings };
}

async function setSettingAsync(key, value) {
  if (DB_TYPE === 'sqlite') {
    await pool.query('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [key, value]);
  } else {
    await pool.query(
      'INSERT INTO settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?, updated_at = NOW()',
      [key, value, value]
    );
  }
  _settings[key] = value;
}

async function refreshSettings() {
  const [rows] = await pool.query('SELECT key, value FROM settings');
  _settings = {};
  rows.forEach(r => { _settings[r.key] = r.value; });
}

// --- Bootstrap ---
const pool = DB_TYPE === 'sqlite' ? initSQLite() : initMySQL();

module.exports = { pool, getSetting, getAllSettings, setSettingAsync, refreshSettings };
