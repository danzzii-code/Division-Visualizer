import React, { useState, useMemo } from 'react';
import NumberInput from './components/NumberInput';
import Visualization from './components/Visualization';

const App: React.FC = () => {
  const [dividendStr, setDividendStr] = useState<string>('');
  const [divisorStr, setDivisorStr] = useState<string>('');

  const { dividend, divisor, error, isPrompt } = useMemo(() => {
    if (dividendStr === '' || divisorStr === '') {
      return { dividend: 0, divisor: 0, error: '나눗셈을 시작하려면 위 칸에 숫자를 입력해주세요.', isPrompt: true };
    }

    const divd = parseInt(dividendStr, 10);
    const divs = parseInt(divisorStr, 10);
    
    if (isNaN(divd) || isNaN(divs)) {
      return { dividend: 0, divisor: 0, error: '숫자만 입력해주세요.', isPrompt: false };
    }
    if (divd < 10 || divd > 99) {
      return { dividend: divd, divisor: divs, error: '나누어지는 수는 10부터 99까지의 두 자리 수여야 합니다.', isPrompt: false };
    }
    if (divs < 1 || divs > 9) {
      return { dividend: divd, divisor: divs, error: '나누는 수는 1부터 9까지의 한 자리 수여야 합니다.', isPrompt: false };
    }
    if (divs === 0) {
        return { dividend: divd, divisor: divs, error: '0으로 나눌 수 없습니다.', isPrompt: false };
    }
    return { dividend: divd, divisor: divs, error: null, isPrompt: false };
  }, [dividendStr, divisorStr]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 tracking-tight">
            나눗셈 시각화 도우미
          </h1>
          <p className="text-lg text-slate-600 mt-2">
            (두 자리 수) ÷ (한 자리 수) 과정을 눈으로 확인해보세요.
          </p>
        </header>

        <section className="bg-white rounded-xl shadow-lg p-6 mb-8 sticky top-4 z-10 border border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            <NumberInput
              label="나누어지는 수 (10-99)"
              value={dividendStr}
              onChange={(e) => setDividendStr(e.target.value)}
              maxLength={2}
            />
            <div className="text-center text-4xl font-bold text-slate-500">÷</div>
            <NumberInput
              label="나누는 수 (1-9)"
              value={divisorStr}
              onChange={(e) => setDivisorStr(e.target.value)}
              maxLength={1}
            />
          </div>
        </section>

        <section>
          {error ? (
            <div 
              className={isPrompt 
                ? "bg-sky-50 border-l-4 border-sky-400 text-sky-800 p-4 rounded-lg shadow-md" 
                : "bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md"}
              role="alert"
            >
              <p className="font-bold">{isPrompt ? '시작해볼까요?' : '입력 오류'}</p>
              <p>{error}</p>
            </div>
          ) : (
            <Visualization dividend={dividend} divisor={divisor} />
          )}
        </section>
      </main>
       <footer className="w-full max-w-5xl mx-auto mt-12 text-center text-slate-500">
        <p>
            Made with educational purpose.
        </p>
      </footer>
    </div>
  );
};

export default App;