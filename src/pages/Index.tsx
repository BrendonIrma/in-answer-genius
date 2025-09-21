import { useState, lazy, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnalysisService } from '@/services/analysisService';
import { useToast } from '@/hooks/use-toast';

// Ленивая загрузка компонентов
const AnalysisForm = lazy(() => import('@/components/AnalysisForm'));
const AnalysisResults = lazy(() => import('@/components/AnalysisResults'));

// Импортируем тип отдельно
import type { AnalysisResult } from '@/components/AnalysisResults';

const Index = () => {
  const [currentAnalysis, setCurrentAnalysis] = useState<{url: string, query: string} | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { toast } = useToast();

  // Используем React Query для кэширования
  const { data: result, isLoading, error, refetch } = useQuery({
    queryKey: ['analysis', currentAnalysis?.url, currentAnalysis?.query],
    queryFn: () => {
      if (!currentAnalysis) throw new Error('No analysis parameters');
      return AnalysisService.analyzeWebsite(currentAnalysis.url, currentAnalysis.query);
    },
    enabled: !!currentAnalysis,
    staleTime: 5 * 60 * 1000, // 5 минут
    retry: 2,
  });

  const handleAnalyze = async (url: string, query: string) => {
    setCurrentAnalysis({ url, query });
    
    // Показываем уведомление о начале анализа
    toast({
      title: "Анализ начат",
      description: "Обрабатываем ваш запрос...",
    });
  };

  const handleRetry = () => {
    refetch();
  };

  const handleNewAnalysis = () => {
    setIsTransitioning(true);
    
    // Небольшая задержка для плавного перехода
    setTimeout(() => {
      setCurrentAnalysis(null);
      setIsTransitioning(false);
      
      // Прокручиваем к началу страницы для показа формы анализа
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }, 200);
  };

  // Обработка ошибок
  if (error) {
    toast({
      title: "Ошибка анализа",
      description: "Не удалось выполнить анализ. Попробуйте еще раз.",
      variant: "destructive",
    });
  }

  // Показываем уведомление о завершении анализа
  if (result && !isLoading) {
    toast({
      title: "Анализ завершен",
      description: "Результаты готовы к просмотру",
    });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-primary-gradient bg-clip-text text-transparent mb-2">
              In Answer
            </h1>
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                Powered by YandexGPT
              </span>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Проверьте, упоминается ли ваш сайт в ответах Yandex GPT и получите рекомендации по улучшению видимости
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {!result && (
          <div className={`flex justify-center transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            <Suspense fallback={
              <div className="w-full max-w-2xl mx-auto p-8">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
              </div>
            }>
              <AnalysisForm onAnalyze={handleAnalyze} isLoading={isLoading} />
            </Suspense>
          </div>
        )}
        
        {result && (
            <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              <Suspense fallback={
                <div className="w-full max-w-4xl mx-auto p-8">
                  <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                </div>
              }>
                <AnalysisResults result={result} onRetry={handleRetry} onNewAnalysis={handleNewAnalysis} />
              </Suspense>
            </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>In Answer</strong> — анализ видимости в ответах Yandex GPT
            </p>
            <p>
              Работает с YandexGPT API • Для полной функциональности требуется API ключ Yandex Cloud
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;