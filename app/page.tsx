'use client';

import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy via-gray-900 to-black text-white">
      {/* Hero */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="text-brand-cyan">CardVault</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-300 mb-8"
          >
            Trading Cards Management Platform
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto mb-10"
          >
            Track your collection, monitor values, get AI-powered insights, and connect with collectors worldwide.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4 justify-center"
          >
            <a href="/dashboard" className="px-8 py-4 bg-brand-cyan text-brand-navy font-semibold rounded-lg hover:bg-cyan-400 transition">
              Start Collecting
            </a>
            <a href="#features" className="px-8 py-4 border border-white/30 rounded-lg hover:bg-white/10 transition">
              Learn More
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Track Collection', desc: 'Catalog every item with photos, grades, and values', icon: '📦' },
              { title: 'Value Tracking', desc: 'Monitor market prices and your collection worth', icon: '📈' },
              { title: 'AI Assistant', desc: 'Javari AI helps identify, grade, and price items', icon: '🤖' },
              { title: 'Marketplace', desc: 'Buy, sell, and trade with verified collectors', icon: '🛒' },
              { title: 'Grading', desc: 'Track PSA, CGC, PCGS and other grades', icon: '⭐' },
              { title: 'Community', desc: 'Connect with collectors who share your passion', icon: '👥' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 rounded-xl p-6 border border-white/10"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Start Your Collection Today</h2>
          <p className="text-gray-400 mb-8">Join collectors worldwide using CardVault to manage their trading cards.</p>
          <a href="/signup" className="inline-block px-10 py-4 bg-brand-red text-white font-semibold rounded-lg hover:bg-red-600 transition">
            Create Free Account
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <p className="text-gray-500">© 2025 CR AudioViz AI LLC. Part of Javari Collectors.</p>
          <div className="flex gap-6">
            <a href="https://craudiovizai.com" className="text-gray-400 hover:text-white">Main Site</a>
            <a href="https://javariai.com" className="text-gray-400 hover:text-white">Javari AI</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
