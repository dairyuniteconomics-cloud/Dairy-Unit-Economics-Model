import { ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-blue-50 pt-20 pb-24 sm:pt-32 sm:pb-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full border border-green-200">
            <Zap className="w-4 h-4 text-green-600 mr-2" />
            <span className="text-sm font-semibold text-green-700">Empowering Indian Dairy Farmers</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900">
            Smart Dairy Unit <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Economics</span> Planning
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed">
            Transform your dairy farming business with data-driven insights. Calculate costs, manage herd sizes, and optimize profitability with our powerful, user-friendly calculator designed for Indian dairy farmers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => navigate('/app')}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold h-12 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 rounded-lg border-2 font-semibold"
            >
              Learn More
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">50M+</p>
              <p className="text-sm text-gray-600">Dairy Farmers in India</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">6%</p>
              <p className="text-sm text-gray-600">GDP Contribution</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600">₹2.5T</p>
              <p className="text-sm text-gray-600">Market Value</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
