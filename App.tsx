import React, { useState, useMemo } from 'react';
import NumberInput from './components/NumberInput';
import LongDivision from './components/LongDivision';

const App: React.FC = () => {
  const [dividendStr, setDividendStr] = useState<string>('');
  const [divisorStr, setDivisorStr] = useState<string>('');

  const handleDividendChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 2) {
      setDividendStr(e.target.value);
    }
  };

  const handleDivisorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 1) {
      setDivisorStr(e.target.value);
    }
  };

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
      return { dividend: divd, divisor: divs, error: '나누어지는 수는 10부터 99까지의 두 자릿수만 입력할 수 있습니다.', isPrompt: false };
    }
    if (divs < 1 || divs > 9) {
      return { dividend: divd, divisor: divs, error: '나누는 수는 1부터 9까지의 한 자릿수만 입력할 수 있습니다.', isPrompt: false };
    }
     if (divd < divs) {
        return { dividend: divd, divisor: divs, error: '나누어지는 수는 나누는 수보다 크거나 같아야 합니다.', isPrompt: false };
    }
    return { dividend: divd, divisor: divs, error: null, isPrompt: false };
  }, [dividendStr, divisorStr]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-500 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white text-2xl sm:text-3xl font-bold">÷</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-800">
              나눗셈 시각화 도우미
            </h1>
          </div>
          <p className="text-md sm:text-lg text-slate-600 mt-3">
            (두 자리 수) ÷ (한 자리 수) 과정을 눈으로 확인해보세요.
          </p>
        </header>

        <section className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8 border border-slate-200">
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <NumberInput
              label="나누어지는 수 (10-99)"
              value={dividendStr}
              onChange={handleDividendChange}
              placeholder="예: 84"
            />
            <div className="text-4xl font-bold text-slate-400 sm:pt-8">÷</div>
            <NumberInput
              label="나누는 수 (1-9)"
              value={divisorStr}
              onChange={handleDivisorChange}
              placeholder="예: 4"
            />
          </div>
        </section>

        <section>
          {error ? (
            <div 
              className={isPrompt 
                ? "bg-yellow-50 text-amber-800 p-6 rounded-xl text-center text-lg" 
                : "bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md"}
              role="alert"
            >
               {isPrompt ? (
                <p>{error}</p>
              ) : (
                <>
                  <p className="font-bold">입력 오류</p>
                  <p>{error}</p>
                </>
              )}
            </div>
          ) : (
            <LongDivision dividend={dividend} divisor={divisor} />
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
