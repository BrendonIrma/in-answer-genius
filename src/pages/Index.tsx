import { useState } from 'react';
import { AnalysisForm } from '@/components/AnalysisForm';
import { AnalysisResults, type AnalysisResult } from '@/components/AnalysisResults';
import { AnalysisService } from '@/services/analysisService';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<{url: string, query: string} | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async (url: string, query: string) => {
    setIsLoading(true);
    setResult(null);
    setCurrentAnalysis({ url, query });

    try {
      const analysisResult = await AnalysisService.analyzeWebsite(url, query);
      setResult(analysisResult);
      
      toast({
        title: "Анализ завершен",
        description: "Результаты готовы к просмотру",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Ошибка анализа",
        description: "Не удалось выполнить анализ. Попробуйте еще раз.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (currentAnalysis) {
      handleAnalyze(currentAnalysis.url, currentAnalysis.query);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-primary-gradient bg-clip-text text-transparent mb-2">
              In Answer
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Проверьте, упоминается ли ваш сайт в ответах ИИ-поисковиков и получите рекомендации по улучшению видимости
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {!result && (
          <div className="flex justify-center">
            <AnalysisForm onAnalyze={handleAnalyze} isLoading={isLoading} />
          </div>
        )}
        
        {result && (
          <AnalysisResults result={result} onRetry={handleRetry} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>In Answer</strong> — анализ видимости в ответах ИИ-поисковиков
            </p>
            <p>
              Демо-версия • Для полной функциональности требуются API ключи Yandex Search API v2 и OpenAI GPT-4
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;