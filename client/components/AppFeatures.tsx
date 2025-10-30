import { Calculator, BarChart3, Settings, Zap, Lock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AppFeatures() {
  const features = [
    {
      icon: Calculator,
      title: 'Cost Calculator',
      description: 'Easily calculate capital costs, operational expenses, and profitability projections for your dairy unit',
    },
    {
      icon: Settings,
      title: 'Flexible Unit Sizing',
      description: 'Plan for any number of cows (2 to 100+) with automatic cost scaling and adjustments',
    },
    {
      icon: BarChart3,
      title: 'Financial Analysis',
      description: 'Get detailed financial metrics including BCR, NPW, IRR, and 6-year surplus projections',
    },
    {
      icon: TrendingUp,
      title: 'Loan Planning',
      description: 'Calculate optimal loan amounts, repayment schedules, and interest implications',
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'See instant changes as you adjust assumptions - no need to recalculate everything',
    },
    {
      icon: Lock,
      title: 'Editable Parameters',
      description: 'Full control over feeding costs, labour, utilities, and all financial assumptions',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">About Our Application</h2>
          <p className="text-xl text-gray-600">
            A comprehensive tool designed specifically for Indian dairy farmers to make informed business decisions
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-50 via-white to-blue-50 rounded-2xl p-8 mb-16 border border-green-200">
          <p className="text-lg text-gray-700 text-center leading-relaxed">
            Our Dairy Unit Economics application is built by farmers, for farmers. It simplifies complex financial calculations, 
            eliminates guesswork, and helps you plan your dairy venture with confidence. Whether you're starting a small 1-cow unit 
            or scaling to 100+ animals, our app provides the insights you need to succeed.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="card-enhanced border-0 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-lg bg-green-50 border border-green-200">
            <p className="text-3xl font-bold text-green-600 mb-2">100%</p>
            <p className="text-gray-700 font-semibold">Editable</p>
            <p className="text-sm text-gray-600 mt-2">Customize every parameter to match your farm</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-3xl font-bold text-blue-600 mb-2">6-Year</p>
            <p className="text-gray-700 font-semibold">Projections</p>
            <p className="text-sm text-gray-600 mt-2">See detailed year-by-year financial forecasts</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-emerald-50 border border-emerald-200">
            <p className="text-3xl font-bold text-emerald-600 mb-2">Free</p>
            <p className="text-gray-700 font-semibold">Always</p>
            <p className="text-sm text-gray-600 mt-2">No hidden charges or subscription fees</p>
          </div>
        </div>
      </div>
    </section>
  );
}
