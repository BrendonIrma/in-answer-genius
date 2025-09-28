import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Globe } from 'lucide-react';

interface AnalysisFormProps {
  onAnalyze: (url: string, query: string) => void;
  isLoading: boolean;
}

function AnalysisForm({ onAnalyze, isLoading }: AnalysisFormProps) {
  const [url, setUrl] = useState('');
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && query) {
      onAnalyze(url, query);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-0 bg-gradient-to-br from-card via-card to-card/90">
      <CardHeader className="text-center pb-6">
        <div className="mx-auto w-16 h-16 bg-primary-gradient rounded-full flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl font-bold bg-primary-gradient bg-clip-text text-transparent">
          In Answer
        </CardTitle>
        <CardDescription className="text-lg">
          Анализ видимости сайтов в ответах ИИ-поисковиков
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="url" className="text-sm font-medium flex items-center gap-2">
              <Globe className="w-4 h-4" />
              URL сайта
            </Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="query" className="text-sm font-medium flex items-center gap-2">
              <Search className="w-4 h-4" />
              Ключевой запрос
            </Label>
            <Input
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Где сдать анализы онлайн в Казани?"
              className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading || !url || !query}
            className="w-full h-12 bg-primary-gradient hover:opacity-90 transition-all duration-300 font-medium text-base"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Анализируем...
              </div>
            ) : (
              'Начать анализ'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default AnalysisForm;