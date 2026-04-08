// src/pages/Pricing.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import './Pricing.css';

const PLANS = [
  {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    desc: 'Perfect for occasional conversions',
    color: '#64748b',
    features: [
      '5 conversions per day',
      '100MB max file size',
      'All standard formats',
      'Files deleted after 2 hours',
      'Standard processing speed',
      'Basic support',
    ],
    cta: 'Get Started Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: { monthly: 9.99, yearly: 7.99 },
    desc: 'For professionals and power users',
    color: '#2563eb',
    badge: 'Most Popular',
    features: [
      'Unlimited conversions',
      '1GB max file size',
      'All 50+ formats',
      'Files stored 7 days',
      'Priority processing',
      'Batch conversions (up to 10)',
      'API access (100 calls/month)',
      'Priority email support',
    ],
    cta: 'Start Pro Trial',
    highlighted: true,
  },
  {
    name: 'Business',
    price: { monthly: 29.99, yearly: 24.99 },
    desc: 'For teams and businesses',
    color: '#7c3aed',
    features: [
      'Everything in Pro',
      '10GB max file size',
      'Files stored 30 days',
      'Unlimited batch conversions',
      'Full API access (unlimited)',
      '5 team members',
      'Custom branding',
      'SLA & dedicated support',
    ],
    cta: 'Start Business Trial',
    highlighted: false,
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const [billing, setBilling] = useState('monthly');

  return (
    <div className="pricing-page">
      <div className="pricing-header">
        <h1>Simple, Transparent Pricing</h1>
        <p>Start free. Upgrade when you need more power.</p>

        <div className="billing-toggle">
          <button
            className={`toggle-btn ${billing === 'monthly' ? 'active' : ''}`}
            onClick={() => setBilling('monthly')}
          >Monthly</button>
          <button
            className={`toggle-btn ${billing === 'yearly' ? 'active' : ''}`}
            onClick={() => setBilling('yearly')}
          >
            Yearly <span className="save-badge">Save 20%</span>
          </button>
        </div>
      </div>

      <div className="pricing-grid">
        {PLANS.map(plan => (
          <div key={plan.name} className={`plan-card ${plan.highlighted ? 'plan-highlighted' : ''}`}>
            {plan.badge && <div className="plan-badge">{plan.badge}</div>}
            <div className="plan-header">
              <h2 className="plan-name" style={{ color: plan.color }}>{plan.name}</h2>
              <div className="plan-price">
                <span className="plan-currency">$</span>
                <span className="plan-amount">
                  {billing === 'yearly' ? plan.price.yearly : plan.price.monthly}
                </span>
                {plan.price.monthly > 0 && <span className="plan-period">/mo</span>}
              </div>
              <p className="plan-desc">{plan.desc}</p>
            </div>

            <button
              className={`btn ${plan.highlighted ? 'btn-primary' : 'btn-outline'} btn-lg plan-cta`}
              onClick={() => navigate(plan.price.monthly === 0 ? '/signup' : `/checkout?plan=${plan.name.toLowerCase()}&billing=${billing}`)}
            >
              {plan.cta}
            </button>

            <ul className="plan-features">
              {plan.features.map(f => (
                <li key={f}>
                  <Check size={14} color={plan.highlighted ? '#2563eb' : '#10b981'} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="pricing-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          {[
            { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.' },
            { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.' },
            { q: 'Is there a free trial?', a: 'Pro and Business plans come with a 7-day free trial. No credit card required to start.' },
            { q: 'What formats are supported?', a: 'We support 200+ file formats including PDF, DOCX, XLSX, PPTX, JPG, PNG, MP4, MP3, and many more.' },
          ].map(item => (
            <div className="faq-item" key={item.q}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
