import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { QrCode, Copy, CheckCircle, Timer } from 'lucide-react';
import { StreamBanner } from '@/api/entities';

export default function PaymentModal({ open, onClose, onSuccess, amount, email, bannerId }) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pixKey, setPixKey] = useState('');
  const [verifyCountdown, setVerifyCountdown] = useState(60);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  
  useEffect(() => {
    if (bannerId && open) {
      loadPixKey();
      setVerifyCountdown(60);
      setIsButtonDisabled(true);
    }
  }, [bannerId, open]);
  
  useEffect(() => {
    let timer;
    if (open && verifyCountdown > 0) {
      timer = setTimeout(() => {
        setVerifyCountdown(prev => prev - 1);
      }, 1000);
    } else if (verifyCountdown === 0) {
      setIsButtonDisabled(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [verifyCountdown, open]);
  
  const loadPixKey = async () => {
    setLoading(true);
    try {
      const banners = await StreamBanner.list();
      const banner = banners.find(b => b.id === bannerId);
      if (banner && banner.pix_key) {
        setPixKey(banner.pix_key);
      } else {
        setPixKey("chave-pix-padrao@email.com");
      }
    } catch (error) {
      console.error("Erro ao carregar chave PIX:", error);
      setPixKey("chave-pix-padrao@email.com");
    } finally {
      setLoading(false);
    }
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simulação de verificação de pagamento
  const simulatePayment = () => {
    onSuccess();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pagamento via PIX</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-6">
          <div className="text-sm text-gray-500 mb-4">
            Email: {email}
          </div>

          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <QrCode className="w-48 h-48" />
          </div>
          
          <p className="text-2xl font-bold text-green-600 mb-4">
            R$ {amount.toFixed(2)}
          </p>

          {loading ? (
            <div className="flex items-center justify-center w-full">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              <p className="text-center mb-2 text-sm font-medium text-gray-700">
                Chave PIX
              </p>
              <div className="flex items-center gap-2 w-full max-w-sm bg-gray-50 p-2 rounded-lg">
                <code className="flex-1 text-sm break-all">{pixKey}</code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyPixKey}
                  className="shrink-0"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </>
          )}

          {/* Botão com temporizador */}
          <Button
            onClick={simulatePayment}
            className={`mt-6 ${isButtonDisabled ? 'bg-gray-400 hover:bg-gray-500' : 'bg-green-600 hover:bg-green-700'}`}
            disabled={isButtonDisabled}
          >
            {isButtonDisabled ? (
              <>
                <Timer className="w-4 h-4 mr-2" />
                Aguarde {formatTime(verifyCountdown)}
              </>
            ) : (
              'Verificar Pagamento'
            )}
          </Button>
          
          {isButtonDisabled && (
            <p className="text-xs text-gray-500 mt-2">
              Realize o pagamento via PIX e aguarde a confirmação
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}