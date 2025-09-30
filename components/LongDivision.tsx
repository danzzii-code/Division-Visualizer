import React, { useState, useMemo, useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import BlockGrid from './BlockGrid';
import StepCard from './StepCard';

interface LongDivisionProps {
  dividend: number;
  divisor: number;
  onComplete?: () => void;
}

const LongDivisionInput: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isWrong: boolean;
  maxLength: number;
  className?: string;
  autoFocus?: boolean;
}> = ({ value, onChange, isWrong, maxLength, className = 'w-12', autoFocus = false }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if(autoFocus && inputRef.current) {
        inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <input
      ref={inputRef}
      type="number"
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      className={`${className} h-12 text-center bg-yellow-50 border-2 rounded-md text-2xl sm:text-3xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all ${
        isWrong ? 'border-red-500 animate-shake' : 'border-sky-400'
      }`}
      onFocus={(e) => e.target.select()}
    />
  );
};

const SplitLongDivisionInput: React.FC<{
  tensValue: string;
  onesValue: string;
  onTensChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOnesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isWrong: boolean;
}> = ({ tensValue, onesValue, onTensChange, onOnesChange, isWrong }) => {
  const tensInputRef = useRef<HTMLInputElement>(null);
  const onesInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    tensInputRef.current?.focus();
  }, []);

  const handleTensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTensChange(e);
    if (e.target.value.length === 1) {
      onesInputRef.current?.focus();
    }
  };

  return (
    <div className="flex">
      <input
        ref={tensInputRef}
        type="number"
        value={tensValue}
        onChange={handleTensChange}
        maxLength={1}
        className={`w-12 h-12 text-center bg-yellow-50 border-2 rounded-l-md text-2xl sm:text-3xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all ${
          isWrong ? 'border-red-500 animate-shake' : 'border-sky-400'
        }`}
        onFocus={(e) => e.target.select()}
      />
      <input
        ref={onesInputRef}
        type="number"
        value={onesValue}
        onChange={onOnesChange}
        maxLength={1}
        className={`w-12 h-12 text-center bg-yellow-50 border-2 border-l-0 rounded-r-md text-2xl sm:text-3xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all ${
          isWrong ? 'border-red-500 animate-shake' : 'border-sky-400'
        }`}
        onFocus={(e) => e.target.select()}
      />
    </div>
  );
};


// Helper component to render a number split into its digits for perfect alignment
const AlignedNumber: React.FC<{
  num: number | null;
  top: string;
  className?: string;
}> = ({ num, top, className = '' }) => {
    if (num === null) return null;
    const s = String(num);
    const ones = s.slice(-1);
    const tens = s.length > 1 ? s.slice(-2, -1) : null;

    return (
        <>
            {tens && (
                <div className={`absolute ${top} left-[56px] w-12 h-12 flex justify-center items-center ${className}`}>
                    {tens}
                </div>
            )}
            <div className={`absolute ${top} left-[104px] w-12 h-12 flex justify-center items-center ${className}`}>
                {ones}
            </div>
        </>
    )
}


const LongDivision: React.FC<LongDivisionProps> = ({ dividend, divisor, onComplete }) => {
  const [step, setStep] = useState(0);
  const [userValues, setUserValues] = useState<(string | null)[]>(Array(5).fill(null));
  const [currentInput, setCurrentInput] = useState(''); // For single-digit inputs
  const [currentInputTens, setCurrentInputTens] = useState(''); // For tens digit of two-digit inputs
  const [currentInputOnes, setCurrentInputOnes] = useState(''); // For ones digit of two-digit inputs
  const [feedback, setFeedback] = useState<'idle' | 'wrong'>('idle');
  
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);

  const {
    tensOfDividend, onesOfDividend, quotientTens, firstProduct,
    firstRemainder, quotientOnes, secondProduct, finalRemainder,
    finalQuotient
  } = useMemo(() => {
    const tens = Math.floor(dividend / 10);
    const qTens = Math.floor(tens / divisor);
    const fProduct = qTens * divisor * 10;
    const fRemainder = dividend - fProduct;
    const qOnes = Math.floor(fRemainder / divisor);
    const sProduct = qOnes * divisor;
    const finRemainder = fRemainder - sProduct;
    const fQuotient = qTens * 10 + qOnes;

    return {
      tensOfDividend: tens,
      onesOfDividend: dividend % 10,
      quotientTens: qTens,
      firstProduct: fProduct,
      firstRemainder: fRemainder,
      quotientOnes: qOnes,
      secondProduct: sProduct,
      finalRemainder: finRemainder,
      finalQuotient: fQuotient
    };
  }, [dividend, divisor]);

  const stepDefs = useMemo(() => [
    {
      instruction: `먼저, 십의 묶음 ${tensOfDividend}개를 ${divisor}개로 나눈 몫을 십의 자리 위에 적어보세요.`,
      correctValue: quotientTens,
      maxLength: 1,
    },
    {
      instruction: `십의 자리 몫(${quotientTens})은 실제로 ${quotientTens * 10}을 나타냅니다. 이 값과 나누는 수(${divisor})를 곱한 결과를 아래에 적으세요.`,
      correctValue: firstProduct,
      maxLength: String(firstProduct).length,
    },
    {
      instruction: `이제, 남은 수 ${firstRemainder}를 ${divisor}(으)로 나눈 몫을 일의 자리 위에 적으세요.`,
      correctValue: quotientOnes,
      maxLength: 1,
    },
    {
      instruction: `나누는 수 ${divisor}와 일의 자리 몫 ${quotientOnes}을(를) 곱한 값을 아래에 적으세요.`,
      correctValue: secondProduct,
      maxLength: String(secondProduct).length,
    },
    {
      instruction: `마지막으로, ${firstRemainder}에서 ${secondProduct}을(를) 뺀 나머지를 구하세요.`,
      correctValue: finalRemainder,
      maxLength: String(finalRemainder).length,
    }
  ], [tensOfDividend, divisor, quotientTens, firstProduct, firstRemainder, quotientOnes, secondProduct, finalRemainder]);

  const MAX_STEPS = stepDefs.length;

  useEffect(() => {
    handleReset();
  }, [dividend, divisor]);
  
  useEffect(() => {
    // Add a small delay to ensure the new element is rendered before scrolling
    const timer = setTimeout(() => {
      if (step === 1 && step2Ref.current) {
        step2Ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (step === 4 && step3Ref.current) {
        step3Ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (step === MAX_STEPS && step4Ref.current) {
        step4Ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [step, MAX_STEPS]);

  const handleReset = () => {
    setStep(0);
    setUserValues(Array(MAX_STEPS).fill(null));
    setCurrentInput('');
    setCurrentInputTens('');
    setCurrentInputOnes('');
    setFeedback('idle');
  };

  const handleSingleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= e.target.maxLength) {
      setCurrentInput(e.target.value);
      if (feedback === 'wrong') {
        setFeedback('idle');
      }
    }
  };
  
  const handleTensInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= e.target.maxLength) {
      setCurrentInputTens(e.target.value);
      if (feedback === 'wrong') {
        setFeedback('idle');
      }
    }
  };

  const handleOnesInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= e.target.maxLength) {
      setCurrentInputOnes(e.target.value);
      if (feedback === 'wrong') {
        setFeedback('idle');
      }
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step >= MAX_STEPS) return;

    const { correctValue, maxLength } = stepDefs[step];
    
    const submittedValueStr = maxLength === 1 ? currentInput : (currentInputTens + currentInputOnes);

    if (submittedValueStr.trim() === '') return;

    if (parseInt(submittedValueStr, 10) === correctValue) {
      const newValues = [...userValues];
      newValues[step] = String(correctValue);
      setUserValues(newValues);
      
      const nextStep = step + 1;
      setStep(nextStep);
      
      setCurrentInput('');
      setCurrentInputTens('');
      setCurrentInputOnes('');
      setFeedback('idle');

      if (nextStep === MAX_STEPS && onComplete) {
        onComplete();
      }
    } else {
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback('idle');
        setCurrentInput('');
        setCurrentInputTens('');
        setCurrentInputOnes('');
      }, 600);
    }
  };
  
  const renderTensGrouped = () => {
    const groups: React.ReactNode[] = [];
    for (let i = 0; i < divisor; i++) {
        groups.push(
            <div key={i} className="border-2 border-dashed border-slate-400 rounded-lg p-2 min-h-[100px]">
                <BlockGrid count={quotientTens} type="ten" />
            </div>
        );
    }
    return groups;
  }

  const renderFinalGroups = () => {
     const groups: React.ReactNode[] = [];
     for (let i = 0; i < divisor; i++) {
        groups.push(
            <div key={i} className="border-2 border-dashed border-slate-400 rounded-lg p-2 min-w-[80px]">
                <BlockGrid count={quotientTens} type="ten" />
                <BlockGrid count={quotientOnes} type="one" />
            </div>
        );
    }
    return groups;
  }

  const remainingTensToUngroup = Math.floor(firstRemainder / 10);
  const onesFromUngrouping = remainingTensToUngroup * 10;
  
  const gridColsMap: { [key: number]: string } = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };
  const gridColsClass = gridColsMap[Math.min(divisor, 4)] || 'grid-cols-4';

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
        {/* VISUALIZATION */}
        <div className="xl:col-span-3 space-y-4">
            <h2 className="text-2xl font-bold text-slate-700 text-center mb-4">구체물로 확인하기</h2>
            
            <StepCard step={1} title={`'${dividend}'를 묶음과 낱개로 나타내요`}>
                <div className="flex flex-wrap gap-4 items-start p-2">
                <div>
                    <p className="font-bold mb-1 text-slate-600">십의 묶음 {tensOfDividend}개</p>
                    <BlockGrid count={tensOfDividend} type="ten" />
                </div>
                <div>
                    <p className="font-bold mb-1 text-slate-600">낱개 {onesOfDividend}개</p>
                    <BlockGrid count={onesOfDividend} type="one" />
                </div>
                </div>
            </StepCard>

            {step >= 1 && (
            <div ref={step2Ref}>
              <StepCard step={2} title={`십의 묶음 ${tensOfDividend}개를 ${divisor}개의 묶음으로 나눠요`}>
                  <p className="mb-4 text-slate-600">각 묶음에 <span className="font-bold text-sky-600">{quotientTens}</span>개의 십의 묶음을 넣을 수 있어요. 총 <span className="font-bold">{quotientTens * divisor}</span>개의 십의 묶음을 사용했어요.</p>
                  <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="font-bold text-slate-600 mb-2">나눈 결과</p>
                      <div className={`grid ${gridColsClass} gap-2`}>
                          {renderTensGrouped()}
                      </div>
                      {firstRemainder > 0 && (
                          <div className="mt-4">
                              <p className="font-bold text-slate-600 mb-2">남은 블록</p>
                              <div className="flex flex-wrap gap-4 items-start p-2 border-t pt-4">
                                  <div>
                                      <p className="font-bold mb-1 text-slate-600">십의 묶음 {remainingTensToUngroup}개</p>
                                      <BlockGrid count={remainingTensToUngroup} type="ten" colorClass="bg-sky-200" />
                                  </div>
                                  <div>
                                      <p className="font-bold mb-1 text-slate-600">낱개 {onesOfDividend}개</p>
                                      <BlockGrid count={onesOfDividend} type="one" colorClass="bg-emerald-200" />
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>
              </StepCard>
            </div>
            )}

            {step >= 4 && (
            <div ref={step3Ref}>
              <StepCard step={3} title={`남은 블록을 낱개로 바꿔서 나눠요`}>
                  <p className="mb-2 text-slate-600">남은 십의 묶음 <span className="font-bold">{remainingTensToUngroup}</span>개를 낱개 <span className="font-bold">{onesFromUngrouping}</span>개로 바꿉니다.</p>
                  <p className="mb-4 text-slate-600">원래 있던 낱개 <span className="font-bold">{onesOfDividend}</span>개를 더하면 총 <span className="font-bold text-emerald-600">{firstRemainder}</span>개의 낱개가 됩니다.</p>
                  <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="font-bold text-slate-600 mb-2">총 낱개 블록: {firstRemainder}개</p>
                      <BlockGrid count={firstRemainder} type="one" itemsPerRow={10} />
                  </div>
                  <p className="mt-4 text-slate-600">이 낱개들을 <span className="font-bold">{divisor}</span>묶음으로 나누면 각 묶음에 <span className="font-bold text-emerald-600">{quotientOnes}</span>개씩 들어가고 <span className="font-bold text-amber-600">{finalRemainder}</span>개가 남습니다.</p>
              </StepCard>
            </div>
            )}

            {step >= MAX_STEPS && (
                <div ref={step4Ref}>
                  <StepCard step={4} title="나눗셈 결과">
                      <p className="mb-4 text-lg">
                          <span className="font-bold text-indigo-600">{dividend}</span> ÷ <span className="font-bold text-indigo-600">{divisor}</span>의 몫은 <span className="font-bold text-sky-600">{finalQuotient}</span>이고, 나머지는 <span className="font-bold text-amber-600">{finalRemainder}</span>입니다.
                      </p>
                      <div className="bg-slate-50 p-4 rounded-lg">
                          <p className="font-bold text-slate-600 mb-2">몫: 각 묶음</p>
                          <div className={`grid ${gridColsClass} gap-2 mb-4`}>
                              {renderFinalGroups()}
                          </div>

                          {finalRemainder > 0 && (
                              <div className="mt-4 border-t pt-4">
                                  <p className="font-bold text-slate-600 mb-2">나머지</p>
                                  <BlockGrid count={finalRemainder} type="one" />
                              </div>
                          )}
                      </div>
                  </StepCard>
                </div>
            )}

        </div>

        {/* CALCULATION */}
        <div className="xl:col-span-2 sticky top-8">
             <h2 className="text-2xl font-bold text-slate-700 text-center mb-4">세로셈으로 풀기</h2>
             <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <div className="flex items-start justify-center">
                    <div className="font-mono text-2xl sm:text-3xl relative" style={{ width: '200px', height: '280px' }}>
                    {/* Divisor */}
                    <div className="absolute top-12 left-2 font-bold text-slate-800 text-3xl">{divisor}</div>

                    {/* Division Symbol */}
                    <div className="absolute top-12 left-12 w-24 h-px border-t-4 border-slate-700"></div>
                    <div className="absolute top-12 left-12 h-12 w-px border-l-4 border-slate-700"></div>
                    
                    {/* --- All calculation elements below are positioned absolutely for perfect alignment --- */}
                    
                    {/* Quotient (Tens digit) */}
                    <div className="absolute top-0 left-[56px] w-12 h-12 flex justify-center items-center">
                        {step === 0 ? <LongDivisionInput value={currentInput} onChange={handleSingleInputChange} isWrong={feedback === 'wrong'} maxLength={1} autoFocus={true} /> :
                        step > 0 ? <span className="font-bold text-sky-600">{userValues[0]}</span> :
                        <div className="w-12 h-12 bg-slate-100 rounded-md"></div>}
                    </div>
                    {/* Quotient (Ones digit) */}
                    <div className="absolute top-0 left-[104px] w-12 h-12 flex justify-center items-center">
                        {step === 2 ? <LongDivisionInput value={currentInput} onChange={handleSingleInputChange} isWrong={feedback === 'wrong'} maxLength={1} autoFocus={true} /> :
                        step > 2 ? <span className="font-bold text-emerald-600">{userValues[2]}</span> :
                        <div className="w-12 h-12 bg-slate-100 rounded-md"></div>}
                    </div>

                    {/* Dividend */}
                    <AlignedNumber num={dividend} top="top-12" className="text-slate-800"/>

                    {/* Minus Sign 1 */}
                    <div className={`absolute top-[84px] left-[24px] transition-opacity duration-300 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>-</div>
                    
                    {/* First Product */}
                    <div className={`absolute top-[68px] w-full h-12 transition-opacity duration-300 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                        {step === 1 ? (
                        <>
                            {stepDefs[1].maxLength === 1 ? (
                            <div className="absolute left-[104px]">
                                <LongDivisionInput
                                value={currentInput}
                                onChange={handleSingleInputChange}
                                isWrong={feedback === 'wrong'}
                                maxLength={1}
                                autoFocus={true}
                                />
                            </div>
                            ) : (
                            <div className="absolute left-[56px]">
                                <SplitLongDivisionInput
                                tensValue={currentInputTens}
                                onesValue={currentInputOnes}
                                onTensChange={handleTensInputChange}
                                onOnesChange={handleOnesInputChange}
                                isWrong={feedback === 'wrong'}
                                />
                            </div>
                            )}
                        </>
                        ) : step > 1 ? (
                        <AlignedNumber num={firstProduct} top="top-0" />
                        ) : (
                        <div className="absolute left-[56px] w-24 h-12 bg-slate-100 rounded-md"></div>
                        )}
                    </div>
                    
                    {/* Line 1 */}
                    <div className={`absolute top-[120px] left-[56px] w-24 border-t-2 border-slate-800 transition-opacity duration-300 ${step >= 1 ? 'opacity-100' : 'opacity-0'}`}></div>
                    
                    {/* First Remainder (Bring Down Result) */}
                    <div className={`absolute top-[128px] w-full transition-opacity duration-300 ${step >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                        <AlignedNumber num={firstRemainder} top="top-0" className="font-bold" />
                    </div>


                    {/* Minus Sign 2 */}
                    <div className={`absolute top-[188px] left-[24px] transition-opacity duration-300 ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}>-</div>
                    
                    {/* Second Product */}
                    <div className={`absolute top-[176px] w-full h-12 transition-opacity duration-300 ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                        {step === 3 ? (
                        <>
                            {stepDefs[3].maxLength === 1 ? (
                            <div className="absolute left-[104px]">
                                <LongDivisionInput
                                value={currentInput}
                                onChange={handleSingleInputChange}
                                isWrong={feedback === 'wrong'}
                                maxLength={1}
                                autoFocus={true}
                                />
                            </div>
                            ) : (
                            <div className="absolute left-[56px]">
                                <SplitLongDivisionInput
                                tensValue={currentInputTens}
                                onesValue={currentInputOnes}
                                onTensChange={handleTensInputChange}
                                onOnesChange={handleOnesInputChange}
                                isWrong={feedback === 'wrong'}
                                />
                            </div>
                            )}
                        </>
                        ) : step > 3 ? (
                        <AlignedNumber num={secondProduct} top="top-0" />
                        ) : (
                        <div className="absolute left-[56px] w-24 h-12 bg-slate-100 rounded-md"></div>
                        )}
                    </div>

                    {/* Line 2 */}
                    <div className={`absolute top-[228px] left-[56px] w-24 border-t-2 border-slate-800 transition-opacity duration-300 ${step >= 3 ? 'opacity-100' : 'opacity-0'}`}></div>

                    {/* Final Remainder */}
                    <div className={`absolute top-[236px] w-full h-12 transition-opacity duration-300 ${step >= 4 ? 'opacity-100' : 'opacity-0'}`}>
                        {step === 4 ? (
                        <>
                            {stepDefs[4].maxLength === 1 ? (
                            <div className="absolute left-[104px]">
                                <LongDivisionInput
                                value={currentInput}
                                onChange={handleSingleInputChange}
                                isWrong={feedback === 'wrong'}
                                maxLength={1}
                                autoFocus={true}
                                />
                            </div>
                            ) : (
                            <div className="absolute left-[56px]">
                                <SplitLongDivisionInput
                                tensValue={currentInputTens}
                                onesValue={currentInputOnes}
                                onTensChange={handleTensInputChange}
                                onOnesChange={handleOnesInputChange}
                                isWrong={feedback === 'wrong'}
                                />
                            </div>
                            )}
                        </>
                        ) : step > 4 ? (
                        <AlignedNumber num={finalRemainder} top="top-0" className="font-bold text-amber-600" />
                        ) : (
                        <div className="absolute left-[56px] w-24 h-12 bg-slate-100 rounded-md"></div>
                        )}
                    </div>
                    </div>
                </div>
                <div className="mt-4">
                    <form onSubmit={handleSubmit} className="bg-slate-50 p-4 rounded-lg shadow-inner border border-slate-200">
                        <div className="min-h-[6rem]">
                            {step < MAX_STEPS ? (
                                <>
                                    <p className="font-bold text-lg mb-2 text-slate-700">단계 {step + 1}</p>
                                    <p className="text-slate-600">{stepDefs[step].instruction}</p>
                                </>
                            ) : (
                                <div className="text-center p-4">
                                    <p className="font-bold text-xl text-slate-800">
                                        🎉 계산 완료!
                                    </p>
                                    <p className="text-lg mt-2">
                                        몫 <span className="text-sky-600">{finalQuotient}</span>, 나머지 <span className="text-amber-600">{finalRemainder}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                        {step < MAX_STEPS && (
                            <div className="flex justify-center mt-4">
                                <button type="submit" className="w-full sm:w-auto px-10 py-2 bg-sky-500 text-white font-bold rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors">
                                    확인
                                </button>
                            </div>
                        )}
                    </form>
                    <div className="text-center mt-3">
                        <button onClick={handleReset} title="처음부터" className="inline-flex items-center gap-2 px-3 py-1 text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-md transition-colors">
                            <RefreshCw size={16} /> 다시 시작
                        </button>
                    </div>
                </div>
             </div>
        </div>
    </div>
  );
};

export default LongDivision;