import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react';

export interface AnalysisResult {
  url: string;
  query: string;
  isInAiAnswer: boolean;
  citabilityScore: number;
  maxScore: number;
  recommendations: string[];
  successChance: number;
}

interface AnalysisResultsProps {
  result: AnalysisResult;
  onRetry: () => void;
}

export function AnalysisResults({ result, onRetry }: AnalysisResultsProps) {
  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getChanceColor = (chance: number) => {
    if (chance >= 70) return 'bg-success text-success-foreground';
    if (chance >= 40) return 'bg-warning text-warning-foreground';
    return 'bg-destructive text-destructive-foreground';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Основные показатели */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Попадание в ответ ИИ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-2 mb-2">
              {result.isInAiAnswer ? (
                <CheckCircle className="w-8 h-8 text-success" />
              ) : (
                <XCircle className="w-8 h-8 text-destructive" />
              )}
            </div>
            <p className="text-2xl font-bold">
              {result.isInAiAnswer ? 'Да' : 'Нет'}
            </p>
          </CardContent>
        </Card>

        <Card className="text-center shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Оценка цитируемости
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <p className={`text-2xl font-bold ${getScoreColor(result.citabilityScore, result.maxScore)}`}>
              {result.citabilityScore}/{result.maxScore}
            </p>
          </CardContent>
        </Card>

        <Card className="text-center shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Шанс попасть в ответ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle className="w-8 h-8 text-info" />
            </div>
            <Badge className={`text-lg font-bold px-3 py-1 ${getChanceColor(result.successChance)}`}>
              +{result.successChance}%
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Рекомендации */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Рекомендации по улучшению
          </CardTitle>
          <CardDescription>
            Конкретные шаги для повышения шансов попадания в ответы ИИ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {result.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  {index + 1}
                </div>
                <p className="text-sm leading-relaxed">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Информация об анализе */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Детали анализа</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <span className="text-sm font-medium text-muted-foreground">URL:</span>
            <p className="text-sm break-all">{result.url}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">Запрос:</span>
            <p className="text-sm">{result.query}</p>
          </div>
        </CardContent>
      </Card>

      {/* Кнопка повторного анализа */}
      <div className="text-center">
        <Button 
          onClick={onRetry}
          variant="outline" 
          className="h-12 px-8 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Повторить анализ
        </Button>
      </div>
    </div>
  );
}