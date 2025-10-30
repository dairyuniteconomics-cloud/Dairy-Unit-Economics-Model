import { HeroSection } from '@/components/HeroSection';
import { IndustryOverview } from '@/components/IndustryOverview';
import { ChallengesOpportunities } from '@/components/ChallengesOpportunities';
import { AppFeatures } from '@/components/AppFeatures';
import { CTASection } from '@/components/CTASection';
import { ContactSection } from '@/components/ContactSection';
import { CursorTrail } from '@/components/CursorTrail';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { GoToTopButton } from '@/components/GoToTopButton';
import { Toaster } from '@/components/ui/sonner';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white">
      <CursorTrail />
      <AnimatedBackground />
      <Toaster />
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">Dairy Economics</h1>
              <p className="text-xs text-gray-600">Smart Farming Solutions</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-6">
            <a href="#features" className="text-gray-700 hover:text-green-600 transition">Features</a>
            <a href="#challenges" className="text-gray-700 hover:text-green-600 transition">Challenges</a>
            <a href="#about" className="text-gray-700 hover:text-green-600 transition">About</a>
          </div>

          <button
            onClick={() => window.location.href = '/app'}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 py-2 rounded-lg transition-all"
          >
            Go to App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Industry Overview */}
      <IndustryOverview />

      {/* Challenges & Opportunities */}
      <div id="challenges">
        <ChallengesOpportunities />
      </div>

      {/* App Features */}
      <div id="features">
        <AppFeatures />
      </div>

      {/* CTA Section */}
      <CTASection />

      {/* Contact Section */}
      <section id="about" className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">Questions, feedback, or partnership opportunities?</p>
          <ContactSection />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4 text-green-400">Dairy Economics</h3>
              <p className="text-gray-400 text-sm">Smart financial planning for dairy farmers</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-200">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-green-400">Features</a></li>
                <li><a href="#" className="hover:text-green-400">Calculator</a></li>
                <li><a href="#" className="hover:text-green-400">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-200">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-green-400">About</a></li>
                <li><a href="#" className="hover:text-green-400">Blog</a></li>
                <li><a href="#" className="hover:text-green-400">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-200">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="mailto:rakshithk422@gmail.com" className="hover:text-green-400">Email</a></li>
                <li><a href="https://wa.me/919019054557" className="hover:text-green-400">WhatsApp</a></li>
                <li><a href="#" className="hover:text-green-400">LinkedIn</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-gray-400 text-sm">
              © 2025 Dairy Unit Economics. All rights reserved by Rakshith Kumar D. | Made with ❤️ for Indian Farmers
            </p>
          </div>
        </div>
      </footer>

      <GoToTopButton />
    </div>
  );
}
