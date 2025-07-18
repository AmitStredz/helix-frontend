import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  DollarSign
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your AI trading assistant. I can help you with market analysis, trading strategies, and portfolio optimization. What would you like to know?",
      timestamp: new Date(),
      suggestions: [
        "Analyze my portfolio",
        "Find arbitrage opportunities",
        "Suggest yield strategies",
        "Market sentiment"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const aiResponses = [
    "Based on current market conditions, ETH appears to be in a consolidation phase. Consider DCA strategies for optimal entry points.",
    "I've identified 3 high-probability arbitrage opportunities across DEXs. The ETH/USDC pair shows 1.2% profit potential.",
    "Your portfolio allocation looks solid. However, consider increasing exposure to yield-bearing assets for better returns.",
    "Market sentiment is currently bullish. Options strategies might be worth exploring for hedging positions.",
    "Cross-chain opportunities are abundant right now. The Arbitrum-Polygon bridge shows interesting yield farming prospects."
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newUserMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        type: 'ai',
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        timestamp: new Date(),
        suggestions: [
          "Tell me more",
          "Show me data",
          "Execute strategy",
          "Risk analysis"
        ]
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const insights = [
    {
      type: 'opportunity',
      icon: TrendingUp,
      title: 'High Yield Detected',
      content: 'New farming pool: 24% APY',
      priority: 'high'
    },
    {
      type: 'warning',
      icon: AlertTriangle,
      title: 'Market Alert',
      content: 'Unusual volatility in BTC',
      priority: 'medium'
    },
    {
      type: 'tip',
      icon: Lightbulb,
      title: 'Strategy Tip',
      content: 'Consider rebalancing portfolio',
      priority: 'low'
    }
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Trading Assistant</h1>
          <p className="text-muted-foreground">Get personalized trading insights and strategy recommendations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* AI Insights Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Market Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights.map((insight, index) => (
                  <div key={index} className="p-3 rounded-lg bg-card/20 border border-white/5">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        insight.priority === 'high' ? 'bg-destructive/20' :
                        insight.priority === 'medium' ? 'bg-accent/20' :
                        'bg-success/20'
                      }`}>
                        <insight.icon className={`w-4 h-4 ${
                          insight.priority === 'high' ? 'text-destructive' :
                          insight.priority === 'medium' ? 'text-accent' :
                          'text-success'
                        }`} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="text-sm font-medium">{insight.title}</div>
                        <div className="text-xs text-muted-foreground">{insight.content}</div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            insight.priority === 'high' ? 'border-destructive/20 text-destructive' :
                            insight.priority === 'medium' ? 'border-accent/20 text-accent' :
                            'border-success/20 text-success'
                          }`}
                        >
                          {insight.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => setInputValue("Analyze my portfolio performance")}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Portfolio Analysis
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => setInputValue("Find arbitrage opportunities")}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Find Arbitrage
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => setInputValue("Suggest yield strategies")}
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Strategy Tips
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="glass-card h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  AI Assistant Chat
                  <Badge variant="outline" className="ml-auto">
                    <div className="w-2 h-2 bg-success rounded-full mr-1" />
                    Online
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.type === 'user' ? 'bg-primary' : 'bg-accent'
                          }`}>
                            {message.type === 'user' ? (
                              <User className="w-4 h-4 text-white" />
                            ) : (
                              <Bot className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className={`p-3 rounded-lg ${
                            message.type === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-card/40 border border-white/10'
                          }`}>
                            <div className="text-sm">{message.content}</div>
                            {message.suggestions && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {message.suggestions.map((suggestion, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-6"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                  >
                                    {suggestion}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="p-3 rounded-lg bg-card/40 border border-white/10">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-accent rounded-full animate-bounce delay-100" />
                            <div className="w-2 h-2 bg-accent rounded-full animate-bounce delay-200" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                {/* Input */}
                <div className="flex gap-2 mt-4">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask me anything about trading, yields, or market analysis..."
                    className="flex-1 glass-card border-white/10"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="btn-gradient-primary"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}