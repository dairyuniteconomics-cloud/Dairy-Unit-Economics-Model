import { TrendingUp, Users, Globe, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function IndustryOverview() {
  const stats = [
    {
      icon: Users,
      title: 'Largest Producer',
      description: 'India is the world\'s largest milk producer with 220+ million metric tons annually',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Contributes to 23% of global dairy production, supporting rural economies nationwide',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: TrendingUp,
      title: 'Rapid Growth',
      description: 'Annual growth rate of 4-6%, driven by increasing demand and modern practices',
      color: 'from-purple-500 to-pink-600',
    },
    {
      icon: Briefcase,
      title: 'Employment',
      description: 'Provides livelihood to 80+ million people directly and indirectly across India',
      color: 'from-orange-500 to-red-600',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Dairy Industry in India</h2>
          <p className="text-xl text-gray-600">
            Understanding the scale and importance of dairy farming in India's economy and rural development
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="card-enhanced border-0 hover:shadow-2xl transition-all duration-300">
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{stat.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-green-600 mb-2">220M+</p>
              <p className="text-gray-700 font-semibold">Metric Tons of Milk Annually</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600 mb-2">₹35,000+</p>
              <p className="text-gray-700 font-semibold">Average Annual Income per Household</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-emerald-600 mb-2">6.5%</p>
              <p className="text-gray-700 font-semibold">CAGR (Last 5 Years)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
