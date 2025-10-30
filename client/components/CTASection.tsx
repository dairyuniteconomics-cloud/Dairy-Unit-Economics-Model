import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function CTASection() {
  const navigate = useNavigate();

  const benefits = [
    'Free to use - no registration required',
    'Instant financial projections and analysis',
    'Customize for any dairy unit size',
    'Make data-driven business decisions',
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-bold">
            Start Planning Your Dairy Business Today
          </h2>
          <p className="text-xl text-green-50">
            Make informed decisions with our comprehensive dairy economics calculator. Perfect for farmers, investors, and dairy consultants.
          </p>

          <div className="grid md:grid-cols-2 gap-4 my-8 text-left">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-200 flex-shrink-0 mt-1" />
                <p className="text-green-50">{benefit}</p>
              </div>
            ))}
          </div>

          <Button
            onClick={() => navigate('/app')}
            size="lg"
            className="bg-white text-green-700 hover:bg-green-50 font-semibold h-12 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
          >
            Launch the Calculator <ArrowRight className="w-5 h-5" />
          </Button>

          <p className="text-sm text-green-100">
            Questions? <a href="mailto:rakshithk422@gmail.com" className="underline hover:text-white">Contact us</a> • <a href="https://wa.me/919019054557" className="underline hover:text-white">WhatsApp</a>
          </p>
        </div>
      </div>
    </section>
  );
}
