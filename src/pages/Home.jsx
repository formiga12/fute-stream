
import React, { useState, useEffect } from 'react';
import { StreamBanner } from '@/api/entities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Timer, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import EmailCollectionModal from '../components/auth/EmailCollectionModal';

export default function HomePage() {
  const [banners, setBanners] = useState({ free: [], paid: [] });
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const now = new Date().toISOString();
      const data = await StreamBanner.list();
      // Remover qualquer verificação de autenticação aqui
      const activeBanners = data.filter(banner => {
        try {
          return banner.active && 
            banner.expiration_date && new Date(banner.expiration_date) > new Date() &&
            banner.start_date && banner.start_date <= now;
        } catch (e) {
          console.error('Erro ao filtrar banner:', e);
          return false;
        }
      });

      const freeBanners = activeBanners.filter(banner => banner.price === 0);
      const paidBanners = activeBanners.filter(banner => banner.price > 0);

      setBanners({
        free: freeBanners,
        paid: paidBanners
      });
    } catch (error) {
      console.error('Erro ao carregar banners:', error);
      setBanners({ free: [], paid: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = (email) => {
    if (selectedBanner) {
      navigate(`/watch?id=${selectedBanner.id}&email=${encodeURIComponent(email)}`);
    }
    setShowEmailModal(false);
  };

  const handleBannerClick = (banner) => {
    if (banner.price === 0) {
      navigate(`/watch?id=${banner.id}&free=true`);
    } else {
      setSelectedBanner(banner);
      setShowEmailModal(true);
    }
  };

  const formatTime = (dateString) => {
    try {
      if (!dateString) return '';
      return format(new Date(dateString), 'dd/MM HH:mm');
    } catch (error) {
      console.error('Erro ao formatar hora:', error);
      return '';
    }
  };

  const BannerCard = ({ banner }) => (
    <Card 
      key={banner.id}
      className="group relative overflow-hidden rounded-xl transition-transform hover:scale-105"
    >
      <div className="relative">
        <img
          src={banner.thumbnail || 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&h=500'}
          alt={banner.title}
          className="w-full h-48 object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Play className="w-16 h-16 text-white" />
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{banner.title}</h3>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Timer className="w-4 h-4 mr-1" />
          {formatTime(banner.start_date)}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">
            {banner.price === 0 ? (
              <span className="text-blue-600">Grátis</span>
            ) : (
              <span className="text-green-600">R$ {banner.price.toFixed(2)}</span>
            )}
          </span>
          <Button
            onClick={() => handleBannerClick(banner)}
            className={banner.price === 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}
          >
            Assistir Agora
          </Button>
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  const hasNoStreams = banners.free.length === 0 && banners.paid.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Transmissões Ao Vivo
        </h1>

        {hasNoStreams ? (
          <div className="text-center text-gray-400 mt-12">
            <h2 className="text-2xl font-semibold mb-2">Nenhuma transmissão disponível</h2>
            <p>Volte mais tarde para novas transmissões!</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Transmissões Premium */}
            {banners.paid.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">Transmissões Premium</h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {banners.paid.map(banner => (
                    <BannerCard key={banner.id} banner={banner} />
                  ))}
                </div>
              </div>
            )}

            {/* Transmissões Gratuitas */}
            {banners.free.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Transmissões Gratuitas</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {banners.free.map(banner => (
                    <BannerCard key={banner.id} banner={banner} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <EmailCollectionModal
        open={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailSubmit}
      />
    </div>
  );
}
