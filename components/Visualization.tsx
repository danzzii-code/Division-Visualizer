import React, { useMemo, useState, useEffect } from 'react';
import BlockGrid from './BlockGrid';
import StepCard from './StepCard';
import LongDivision from './LongDivision';
import { ArrowDown, ArrowRight } from 'lucide-react';
import TypewriterText from './TypewriterText';

interface VisualizationProps {
  dividend: number;
  divisor: number;
}

const GroupedGrid: React.FC<{count: number, divisor: number, type: 'ten' | 'one', colorClass?: string}> = ({ count, divisor, type, colorClass }) => {
    const numGroups = Math.floor(count / divisor);
    const remainder = count % divisor;

    return (
        <div className="flex flex-wrap items-start gap-4">
            {Array.from({ length: numGroups }).map((_, i) => (
                <div key={`group-${i}`} className="p-2 border-2 border-dashed border-sky-500 rounded-lg bg-sky-50">
                    <BlockGrid count={divisor} type={type} colorClass={colorClass} />
                </div>
            ))}
            {remainder > 0 && (
                 <div className="p-2">
                    <BlockGrid count={remainder} type={type} colorClass={colorClass} />
                 </div>
            )}
        </div>
    );
};


const Visualization: React.FC<VisualizationProps> = ({ dividend, divisor }) => {
  const [longDivisionCompleted, setLongDivisionCompleted] = useState(false);
  const [typingAnimationComplete, setTypingAnimationComplete] = useState(false);


  useEffect(() => {
    setLongDivisionCompleted(false);
    setTypingAnimationComplete(false);
  }, [dividend, divisor]);

  const steps = useMemo(() => {
    if (divisor === 0) return null;

    const tensOfDividend = Math.floor(dividend / 10);
    const onesOfDividend = dividend % 10;

    const quotientTens = Math.floor(tensOfDividend / divisor);
    const remainderTens = tensOfDividend % divisor;
    
    const regroupedOnes = remainderTens * 10;
    const totalOnes = regroupedOnes + onesOfDividend;
    
    const quotientOnes = Math.floor(totalOnes / divisor);
    const finalRemainder = totalOnes % divisor;

    const finalQuotient = quotientTens * 10 + quotientOnes;

    return {
      tensOfDividend,
      onesOfDividend,
      quotientTens,
      remainderTens,
      regroupedOnes,
      totalOnes,
      quotientOnes,
      finalRemainder,
      finalQuotient,
    };
  }, [dividend, divisor]);

  if (!steps) return null;

  const {
    tensOfDividend, onesOfDividend, quotientTens, remainderTens,
    regroupedOnes, totalOnes, quotientOnes, finalRemainder, finalQuotient
  } = steps;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step 1: Initial State */}
        <StepCard step={1} title="나눗셈 준비하기">
          <p className="mb-4 text-slate-600">{dividend}를 십의 묶음과 낱개로 나타냅니다.</p>
          <div className="flex flex-wrap gap-6 items-start">
            <div className="flex-shrink-0">
              <p className="font-semibold text-center mb-2">십의 묶음: {tensOfDividend}개</p>
              <BlockGrid count={tensOfDividend} type="ten" />
            </div>
            <div className="flex-shrink-0">
              <p className="font-semibold text-center mb-2">낱개: {onesOfDividend}개</p>
              <BlockGrid count={onesOfDividend} type="one" />
            </div>
          </div>
        </StepCard>

        {/* Step 2: Divide Tens */}
        <StepCard step={2} title="십의 자리 나누기">
          <p className="mb-4 text-slate-600">십의 묶음 {tensOfDividend}개를 {divisor}개씩 묶습니다. <span className="font-bold text-sky-600">{quotientTens}묶음</span>이 나오고 {remainderTens}개가 남습니다.</p>
          <GroupedGrid count={tensOfDividend} divisor={divisor} type="ten" />
          <p className="mt-4 font-semibold">몫의 십의 자리는 <span className="text-sky-600 text-xl">{quotientTens}</span>입니다.</p>
        </StepCard>
        
        {/* Step 3: Regroup */}
        <StepCard step={3} title="남은 십의 자리와 일의 자리 합치기">
          <p className="mb-4 text-slate-600">남은 십의 묶음 {remainderTens}개를 낱개 {regroupedOnes}개로 바꾼 뒤, 원래 있던 낱개 {onesOfDividend}개와 합칩니다.</p>
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center">
              <div>
                  <p className="font-semibold mb-2">남은 십의 묶음</p>
                  <BlockGrid count={remainderTens} type="ten" />
              </div>
              <ArrowRight className="text-slate-500 w-8 h-8 my-4 sm:my-0" />
              <div>
                  <p className="font-semibold mb-2">낱개로 풀기</p>
                  <BlockGrid count={regroupedOnes} type="one" />
              </div>
              <div className="text-3xl font-bold text-slate-500">+</div>
              <div>
                  <p className="font-semibold mb-2">원래 낱개</p>
                  <BlockGrid count={onesOfDividend} type="one" />
              </div>
          </div>
          <div className="flex justify-center my-4"><ArrowDown className="w-8 h-8 text-slate-500" /></div>
          <p className="mb-4 text-center text-slate-600">이제 낱개는 총 <span className="font-bold text-emerald-600">{totalOnes}</span>개가 되었습니다.</p>
          <div className="flex justify-center">
              <BlockGrid count={totalOnes} type="one" itemsPerRow={15} />
          </div>
        </StepCard>

        {/* Step 4: Divide Ones */}
        <StepCard step={4} title="일의 자리 나누기">
          <p className="mb-4 text-slate-600">낱개 {totalOnes}개를 {divisor}개씩 묶습니다. <span className="font-bold text-emerald-600">{quotientOnes}묶음</span>이 나오고 {finalRemainder}개가 남습니다.</p>
          <GroupedGrid count={totalOnes} divisor={divisor} type="one" />
          <p className="mt-4 font-semibold">몫의 일의 자리는 <span className="text-emerald-600 text-xl">{quotientOnes}</span>입니다.</p>
        </StepCard>
      </div>
      
      {/* Step 5: Long Division */}
      <StepCard step={5} title="세로셈 계산 과정">
        <p className="mb-4 text-center text-slate-600">아래 컨트롤 버튼을 사용하여 세로셈 계산 과정을 단계별로 확인해보세요.</p>
        <LongDivision dividend={dividend} divisor={divisor} onComplete={() => setLongDivisionCompleted(true)} />
      </StepCard>

      {/* Step 6: Final Result - Shown only after long division is completed */}
      {longDivisionCompleted && (
        <StepCard step={6} title="최종 결과">
            <div className="text-center p-6 bg-slate-50 rounded-lg">
                <p className="text-xl text-slate-700 mb-2">
                    {dividend} ÷ {divisor}의 계산 결과는 다음과 같습니다.
                </p>
                <div className="text-3xl font-bold min-h-[3rem] flex items-center justify-center">
                  {!typingAnimationComplete ? (
                    <TypewriterText 
                      text={`몫: ${finalQuotient}, 나머지: ${finalRemainder}`}
                      onComplete={() => setTypingAnimationComplete(true)}
                    />
                  ) : (
                    <p>
                      몫: <span className="text-sky-600">{finalQuotient}</span>, 
                      나머지: <span className="text-amber-600">{finalRemainder}</span>
                    </p>
                  )}
                </div>
                <div className={`mt-6 flex justify-center flex-wrap gap-6 items-start transition-opacity duration-500 ${typingAnimationComplete ? 'opacity-100' : 'opacity-0'}`}>
                    <div>
                        <p className="font-semibold mb-2">몫: {finalQuotient}</p>
                        <div className="flex gap-4">
                            <BlockGrid count={quotientTens} type="ten" />
                            <BlockGrid count={quotientOnes} type="one" />
                        </div>
                    </div>
                    <div>
                        <p className="font-semibold mb-2">나머지: {finalRemainder}</p>
                        <BlockGrid count={finalRemainder} type="one" colorClass="bg-amber-400" />
                    </div>
                </div>
            </div>
        </StepCard>
      )}
    </div>
  );
};

export default Visualization;