import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Mail, AlertCircle, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { User as UserEntity } from '@/api/entities';

export default function UserProfilePage() {
  const [userData, setUserData] = useState({
    full_name: '',
    email: '',
    preferences: {
      notifications: true,
      favorite_categories: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const user = await UserEntity.me();
        setUserData({
          full_name: user.full_name,
          email: user.email,
          preferences: user.preferences || {
            notifications: true,
            favorite_categories: []
          }
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Não foi possível carregar os dados do usuário');
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await UserEntity.updateMyUserData({
        preferences: userData.preferences
      });
      setSuccessMessage('Perfil atualizado com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating user profile:', err);
      setError('Ocorreu um erro ao atualizar o perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await UserEntity.logout();
      navigate(createPageUrl('Home'));
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Meu Perfil</h1>
        
        <Card className="p-6 mb-6">
          {successMessage && (
            <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <AlertDescription>{successMessage}</AlertDescription>
              </div>
            </Alert>
          )}
          
          {error && (
            <Alert className="mb-6 bg-red-50 border-red-200 text-red-700">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription>{error}</AlertDescription>
              </div>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  id="fullName"
                  className="pl-10"
                  value={userData.full_name}
                  disabled
                />
              </div>
              <p className="text-xs text-gray-500">Seu nome não pode ser alterado</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  value={userData.email}
                  disabled
                />
              </div>
              <p className="text-xs text-gray-500">Seu email de login não pode ser alterado</p>
            </div>
            
            <div className="space-y-2">
              <Label>Preferências de Streaming</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {['Esportes', 'Filmes', 'Shows', 'Documentários', 'Séries', 'Notícias'].map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`category-${category}`}
                      checked={userData.preferences.favorite_categories.includes(category)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setUserData({
                          ...userData,
                          preferences: {
                            ...userData.preferences,
                            favorite_categories: checked
                              ? [...userData.preferences.favorite_categories, category]
                              : userData.preferences.favorite_categories.filter(c => c !== category)
                          }
                        });
                      }}
                      className="rounded border-gray-300 h-4 w-4"
                    />
                    <label htmlFor={`category-${category}`} className="text-sm font-medium text-gray-700">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span className="ml-2">Salvando...</span>
                  </div>
                ) : (
                  'Salvar alterações'
                )}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleLogout}
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                Sair da conta
              </Button>
            </div>
          </form>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Histórico de Transmissões</h2>
          <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
            <p className="text-gray-500 text-center py-8">
              Você ainda não assistiu a nenhuma transmissão.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}