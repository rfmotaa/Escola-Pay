import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { Button } from '../components/dashboard.ui/button';
import { Input } from '../components/dashboard.ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/dashboard.ui/card';
import { Alert, AlertDescription } from '../components/dashboard.ui/alert';
import { GraduationCap, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Cadastro() {
  const [dados, setDados] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
  });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setDados({ ...dados, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    
    try {
      await authService.cadastrar(dados);
      toast.success('Cadastro realizado com sucesso!', {
        description: 'Você já pode fazer login.',
        icon: <CheckCircle2 className="h-5 w-5" />,
      });
      navigate('/login');
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao cadastrar');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-2 rounded-lg">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              EscolaPay
            </CardTitle>
          </div>
          <p className="text-center text-slate-400 text-sm">
            Crie sua conta gratuitamente
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {erro && (
              <Alert variant="destructive">
                <AlertDescription>{erro}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Input
                name="nome"
                placeholder="Nome Completo"
                value={dados.nome}
                onChange={handleChange}
                required
                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
            
            <div className="space-y-2">
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={dados.email}
                onChange={handleChange}
                required
                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
            
            <div className="space-y-2">
              <Input
                name="senha"
                type="password"
                placeholder="Senha"
                value={dados.senha}
                onChange={handleChange}
                required
                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
            
            <div className="space-y-2">
              <Input
                name="telefone"
                placeholder="Telefone (opcional)"
                value={dados.telefone}
                onChange={handleChange}
                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              disabled={carregando}
            >
              {carregando ? 'Cadastrando...' : 'Criar Conta'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
              onClick={() => navigate('/login')}
            >
              Já tenho conta
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full text-slate-400 hover:text-white"
              onClick={() => navigate('/')}
            >
              Voltar ao Início
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
