
import React, { useState, useEffect } from 'react';
import { StreamBanner } from '@/api/entities';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';
import { 
  Play, 
  Pencil, 
  Trash2, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Eye,
  Plus,
  Calendar as CalendarIcon,
  QrCode
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import EditBannerModal from '../components/banners/EditBannerModal';
import DeleteBannerModal from '../components/banners/DeleteBannerModal';
import { Badge } from "@/components/ui/badge";
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { UploadFile } from '@/api/integrations';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ManageBannersPage() {
  const [banners, setBanners] = useState([]);
  const [editingBanner, setEditingBanner] = useState(null);
  const [deletingBanner, setDeletingBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("list");
  const navigate = useNavigate();

  // Estado para novo banner
  const [newBanner, setNewBanner] = useState({
    title: '',
    price: 99.90,
    stream_url: '',
    embed_code: '',
    pix_key: '',
    start_date: '',
    expiration_date: '',
    active: true
  });
  const [isFree, setIsFree] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const adminAuthenticated = localStorage.getItem('adminAuthenticated');
    if (adminAuthenticated !== 'true') {
      window.location.href = createPageUrl("AdminLogin");
    }
  }, []);

  useEffect(() => {
    loadBanners();
  }, []);

  useEffect(() => {
    // Update price when isFree changes
    if (isFree) {
      setNewBanner({ ...newBanner, price: 0 });
    } else if (newBanner.price === 0) {
      setNewBanner({ ...newBanner, price: 99.90 });
    }
  }, [isFree]);

  const loadBanners = async () => {
    setLoading(true);
    const data = await StreamBanner.list('-created_date');
    setBanners(data);
    setLoading(false);
  };

  const getBannerStatus = (banner) => {
    const now = new Date();
    const startDate = new Date(banner.start_date);
    const expirationDate = new Date(banner.expiration_date);

    if (!banner.active) return { status: 'inactive', label: 'Inativo', color: 'bg-gray-100 text-gray-800' };
    if (now < startDate) return { status: 'scheduled', label: 'Agendado', color: 'bg-blue-100 text-blue-800' };
    if (now > expirationDate) return { status: 'expired', label: 'Expirado', color: 'bg-red-100 text-red-800' };
    return { status: 'active', label: 'Ativo', color: 'bg-green-100 text-green-800' };
  };

  const handleEdit = async (updatedBanner) => {
    await StreamBanner.update(updatedBanner.id, updatedBanner);
    setEditingBanner(null);
    loadBanners();
  };

  const handleDelete = async (bannerId) => {
    await StreamBanner.delete(bannerId);
    setDeletingBanner(null);
    loadBanners();
  };

  const handlePlay = (banner) => {
    navigate(createPageUrl('Watch') + `?id=${banner.id}`);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const { file_url } = await UploadFile({ file });
      setNewBanner({ ...newBanner, thumbnail: file_url });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await StreamBanner.create(newBanner);
      setNewBanner({
        title: '',
        price: isFree ? 0 : 99.90,
        stream_url: '',
        embed_code: '',
        pix_key: '',
        start_date: '',
        expiration_date: '',
        active: true
      });
      setSuccessMessage('Banner criado com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
      loadBanners();
      setActiveTab("list"); // Voltar para a lista após criar
    } catch (error) {
      console.error("Erro ao criar banner:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && activeTab === "list") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Transmissões</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="list">Lista de Transmissões</TabsTrigger>
          <TabsTrigger value="create">Criar Nova Transmissão</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Visualizações</TableHead>
                    <TableHead>Início</TableHead>
                    <TableHead>Expiração</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banners.map((banner) => {
                    const status = getBannerStatus(banner);
                    return (
                      <TableRow key={banner.id}>
                        <TableCell className="font-medium">{banner.title}</TableCell>
                        <TableCell>
                          <Badge className={status.color}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>
                          {banner.price === 0 ? (
                            <Badge variant="secondary">Grátis</Badge>
                          ) : (
                            `R$ ${banner.price.toFixed(2)}`
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4 text-gray-500" />
                            {banner.view_count || 0}
                          </div>
                        </TableCell>
                        <TableCell>{format(new Date(banner.start_date), 'dd/MM/yyyy HH:mm')}</TableCell>
                        <TableCell>{format(new Date(banner.expiration_date), 'dd/MM/yyyy HH:mm')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handlePlay(banner)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingBanner(banner)}
                              className="text-amber-600 hover:text-amber-800"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeletingBanner(banner)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  {banners.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <AlertCircle className="h-8 w-8 text-gray-400" />
                          <p className="text-gray-500">Nenhuma transmissão encontrada</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="create">
          <Card className="p-6">
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 relative">
                <span className="block sm:inline">{successMessage}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Título</Label>
                <Input
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                  placeholder="Título da transmissão"
                  required
                />
              </div>

              <div>
                <Label>Valor</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Switch
                      checked={isFree}
                      onCheckedChange={(checked) => setIsFree(checked)}
                      id="free-switch"
                    />
                    <Label htmlFor="free-switch" className="cursor-pointer">Transmissão Gratuita</Label>
                  </div>
                  
                  {!isFree && (
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newBanner.price}
                      onChange={(e) => setNewBanner({ ...newBanner, price: parseFloat(e.target.value) })}
                      placeholder="99.90"
                      required
                    />
                  )}
                </div>
              </div>

              {!isFree && (
                <div>
                  <Label className="flex items-center gap-2">
                    <QrCode className="w-4 h-4" />
                    Chave PIX para Pagamento
                  </Label>
                  <Input
                    value={newBanner.pix_key || ''}
                    onChange={(e) => setNewBanner({ ...newBanner, pix_key: e.target.value })}
                    placeholder="CPF, CNPJ, email ou chave aleatória"
                    required={!isFree}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Utilizada para gerar o QR Code de pagamento
                  </p>
                </div>
              )}

              <div>
                <Label>URL da Transmissão</Label>
                <Input
                  value={newBanner.stream_url}
                  onChange={(e) => setNewBanner({ ...newBanner, stream_url: e.target.value })}
                  placeholder="URL do stream (m3u8, m3u, ts, mp4)"
                  required
                />
              </div>

              <div>
                <Label>Código de Incorporação (opcional)</Label>
                <Textarea
                  value={newBanner.embed_code}
                  onChange={(e) => setNewBanner({ ...newBanner, embed_code: e.target.value })}
                  placeholder="<iframe src='...'></iframe> ou outro código de incorporação"
                  className="min-h-[100px]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Adicione código HTML personalizado para incorporar vídeos de plataformas como YouTube, Vimeo, etc.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Data de Início</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newBanner.start_date ? 
                          format(new Date(newBanner.start_date), 'PPP HH:mm') : 
                          'Selecione a data e hora'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newBanner.start_date ? new Date(newBanner.start_date) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            const datetime = new Date(date);
                            datetime.setHours(new Date().getHours());
                            datetime.setMinutes(new Date().getMinutes());
                            setNewBanner({ ...newBanner, start_date: datetime.toISOString() });
                          }
                        }}
                      />
                      <Input
                        type="time"
                        className="m-2"
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(':');
                          const date = new Date(newBanner.start_date || new Date());
                          date.setHours(parseInt(hours));
                          date.setMinutes(parseInt(minutes));
                          setNewBanner({ ...newBanner, start_date: date.toISOString() });
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Data de Expiração</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newBanner.expiration_date ? 
                          format(new Date(newBanner.expiration_date), 'PPP HH:mm') : 
                          'Selecione a data e hora'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newBanner.expiration_date ? new Date(newBanner.expiration_date) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            const datetime = new Date(date);
                            datetime.setHours(23);
                            datetime.setMinutes(59);
                            setNewBanner({ ...newBanner, expiration_date: datetime.toISOString() });
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label>Imagem de Prévia</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="mt-1"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={newBanner.active}
                  onCheckedChange={(checked) => setNewBanner({ ...newBanner, active: checked })}
                />
                <Label>Ativo</Label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setActiveTab("list")}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processando...
                    </span>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Banner
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>
      </Tabs>

      {editingBanner && (
        <EditBannerModal
          banner={editingBanner}
          onSave={handleEdit}
          onClose={() => setEditingBanner(null)}
        />
      )}

      {deletingBanner && (
        <DeleteBannerModal
          banner={deletingBanner}
          onConfirm={() => handleDelete(deletingBanner.id)}
          onClose={() => setDeletingBanner(null)}
        />
      )}
    </div>
  );
}
