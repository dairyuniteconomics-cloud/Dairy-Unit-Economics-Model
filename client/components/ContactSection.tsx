import { Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ContactSection() {
  return (
    <div className="space-y-6 py-8">
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-bold text-gray-900">Get in Touch</h2>
        <p className="text-gray-700">Have questions? Contact me via Email or WhatsApp</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <a
          href="mailto:rakshithk422@gmail.com"
          className="w-full sm:w-auto"
        >
          <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 flex items-center gap-2 h-12 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-white font-semibold">
            <Mail className="w-5 h-5" />
            Email Me
          </Button>
        </a>

        <a
          href={`https://wa.me/919019054557?text=Hi%20Rakshith%2C%20I%20have%20a%20question%20about%20Dairy%20Unit%20Economics`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto"
        >
          <Button className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 flex items-center gap-2 h-12 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-white font-semibold">
            <MessageCircle className="w-5 h-5" />
            WhatsApp
          </Button>
        </a>
      </div>
    </div>
  );
}
