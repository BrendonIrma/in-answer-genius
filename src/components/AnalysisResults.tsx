import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, TrendingUp, AlertTriangle, RefreshCw, Plus, Star, Target, BookOpen, Shield, Clock, Eye, ThumbsUp, ThumbsDown } from 'lucide-react';

export interface AnalysisResult {
  url: string;
  query: string;
  isInAiAnswer: boolean;
  citabilityScore: number;
  maxScore: number;
  recommendations: string[];
  successChance: number;
  criteria?: {
    relevance: number;
    completeness: number;
    structure: number;
    authority: number;
    freshness: number;
    readability: number;
  };
  strengths?: string[];
  weaknesses?: string[];
  content?: string;
}

interface AnalysisResultsProps {
  result: AnalysisResult;
  onRetry: () => void;
  onNewAnalysis: () => void;
}

// Компонент для отображения критерия
const CriteriaItem = ({ icon: Icon, label, score, max = 10 }: { icon: any, label: string, score: number, max?: number }) => {
  const percentage = (score / max) * 100;
  const getColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-gray-600" />
        <span className="font-medium text-gray-700">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-20 bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className={`font-bold ${getColor()}`}>{score}/{max}</span>
      </div>
    </div>
  );
};

function AnalysisResults({ result, onRetry, onNewAnalysis }: AnalysisResultsProps) {
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

      {/* Детальные критерии */}
      {result.criteria && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Детальная оценка
            </CardTitle>
            <CardDescription>
              Анализ по различным критериям качества контента
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <CriteriaItem icon={Target} label="Релевантность" score={result.criteria.relevance} />
              <CriteriaItem icon={BookOpen} label="Полнота ответа" score={result.criteria.completeness} />
              <CriteriaItem icon={TrendingUp} label="Структурированность" score={result.criteria.structure} />
              <CriteriaItem icon={Shield} label="Экспертность" score={result.criteria.authority} />
              <CriteriaItem icon={Clock} label="Актуальность" score={result.criteria.freshness} />
              <CriteriaItem icon={Eye} label="Читаемость" score={result.criteria.readability} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Сильные и слабые стороны */}
      {(result.strengths?.length || result.weaknesses?.length) && (
        <div className="grid md:grid-cols-2 gap-6">
          {result.strengths?.length > 0 && (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <ThumbsUp className="w-5 h-5" />
                  Сильные стороны
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {result.weaknesses?.length > 0 && (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <ThumbsDown className="w-5 h-5" />
                  Слабые стороны
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

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

      {/* Кнопки действий */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
        <Button 
          onClick={onNewAnalysis}
          size="lg"
          className="h-14 px-10 bg-primary-gradient hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl text-white font-semibold"
        >
          <Plus className="w-5 h-5 mr-2" />
          Начать новый анализ
        </Button>
        
        <Button 
          onClick={onRetry}
          variant="outline" 
          size="lg"
          className="h-14 px-10 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Повторить анализ
        </Button>
      </div>
    </div>
  );
}

export default AnalysisResults;