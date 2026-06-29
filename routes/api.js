const express = require('express');
const router = express.Router();
const { getAllSettings, pool } = require('../config/database');

router.get('/settings', (req, res) => res.json(getAllSettings()));

router.get('/services', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order ASC');
  res.json(rows);
});

router.get('/whyus', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM whyus ORDER BY sort_order ASC');
  res.json(rows);
});

router.get('/faqs', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM faqs WHERE is_active = 1 ORDER BY sort_order ASC');
  res.json(rows);
});

router.get('/testimonials', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM testimonials WHERE is_active = 1 ORDER BY sort_order ASC');
  res.json(rows);
});

router.get('/pricing', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM pricing_packages WHERE is_active = 1 ORDER BY sort_order ASC');
  res.json(rows);
});

router.get('/client-logos', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM client_logos WHERE is_active = 1 ORDER BY sort_order ASC');
  res.json(rows);
});

module.exports = router;
