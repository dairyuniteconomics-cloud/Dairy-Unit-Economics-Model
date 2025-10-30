import { AlertCircle, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function ChallengesOpportunities() {
  const challenges = [
    { title: 'Feed Cost Volatility', description: 'Fluctuating feed prices impact profitability and require careful management' },
    { title: 'Market Access', description: 'Limited direct market linkage leading to middleman exploitation' },
    { title: 'Quality Control', description: 'Ensuring consistent milk quality and meeting regulatory standards' },
    { title: 'Climate Impact', description: 'Weather patterns affecting fodder production and animal health' },
    { title: 'Infrastructure', description: 'Limited cold chain and processing facilities in rural areas' },
    { title: 'Technical Knowledge', description: 'Need for modern farming techniques and digital literacy' },
  ];

  const opportunities = [
    { title: 'Digitalization', description: 'Technology adoption for better herd management and record keeping' },
    { title: 'Value Addition', description: 'Processing milk into dairy products for higher margins' },
    { title: 'Organic Farming', description: 'Premium prices for organic and sustainable dairy production' },
    { title: 'Export Markets', description: 'Growing international demand for Indian dairy products' },
    { title: 'Contract Farming', description: 'Direct contracts with dairy processors reducing middlemen' },
    { title: 'Government Support', description: 'Various schemes and subsidies to support dairy farmers' },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Challenges & Opportunities</h2>
          <p className="text-xl text-gray-600">
            Navigating the modern dairy farming landscape with informed decisions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Key Challenges</h3>
            </div>

            <div className="space-y-3">
              {challenges.map((challenge, index) => (
                <Card key={index} className="card-enhanced border-l-4 border-red-400 hover:shadow-lg transition-all">
                  <CardContent className="pt-4">
                    <h4 className="font-semibold text-gray-900 mb-1">{challenge.title}</h4>
                    <p className="text-sm text-gray-600">{challenge.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Opportunities</h3>
            </div>

            <div className="space-y-3">
              {opportunities.map((opportunity, index) => (
                <Card key={index} className="card-enhanced border-l-4 border-green-400 hover:shadow-lg transition-all">
                  <CardContent className="pt-4">
                    <h4 className="font-semibold text-gray-900 mb-1">{opportunity.title}</h4>
                    <p className="text-sm text-gray-600">{opportunity.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
