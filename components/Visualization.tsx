import React from 'react';

const AreaBox: React.FC<{bgColor: string, value: number, calculation: string, className?: string}> = 
    ({ bgColor, value, calculation, className }) => (
    <div className={`${bgColor} ${className} text-white flex flex-col items-center justify-center p-4 min-h-[100px] transition-transform hover:scale-105`}>
        <p className="text-2xl sm:text-3xl font-bold">{value}</p>
        <p className="text-sm opacity-80">{calculation}</p>
    </div>
);

const StepContainer: React.FC<{step: number, title: string, children: React.ReactNode}> = ({step, title, children}) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h3 className="flex items-center text-xl font-bold text-slate-700 mb-4">
          <span className="flex items-center justify-center w-8 h-8 bg-indigo-500 text-white rounded-full text-sm font-bold mr-4">{step}</span>
          {title}
        </h3>
        {children}
    </div>
);


interface VisualizationProps {
  num1: number;
  num2: number;
}

const Visualization: React.FC<VisualizationProps> = ({ num1, num2 }) => {
    const tens1 = Math.floor(num1 / 10) * 10;
    const ones1 = num1 % 10;
    const tens2 = Math.floor(num2 / 10) * 10;
    const ones2 = num2 % 10;

    const p1 = tens1 * tens2;
    const p2 = tens1 * ones2;
    const p3 = ones1 * tens2;
    const p4 = ones1 * ones2;
    const total = p1 + p2 + p3 + p4;

    return (
        <div className="space-y-6">
            <StepContainer step={1} title="숫자 분해하기">
                <div className="flex flex-col sm:flex-row justify-around items-center text-center gap-4 p-4 bg-slate-50 rounded-lg">
                    <p className="text-xl">{num1} = <span className="font-bold text-indigo-600">{tens1}</span> + <span className="font-bold text-teal-600">{ones1}</span></p>
                    <p className="text-xl">{num2} = <span className="font-bold text-purple-600">{tens2}</span> + <span className="font-bold text-pink-600">{ones2}</span></p>
                </div>
            </StepContainer>

            <StepContainer step={2} title="넓이 모델로 계산하기">
                <div className="flex justify-center p-2 sm:p-4">
                    <div className="inline-grid grid-cols-[auto_1fr_1fr] grid-rows-[auto_1fr_1fr] gap-x-2 gap-y-1">
                        {/* Top Labels */}
                        <div />
                        <div className="text-center font-bold p-1 text-slate-700 text-lg">{tens2}</div>
                        <div className="text-center font-bold p-1 text-slate-700 text-lg">{ones2}</div>
                        
                        {/* First Row */}
                        <div className="text-center font-bold p-1 flex items-center justify-center text-slate-700 text-lg">{tens1}</div>
                        <AreaBox bgColor="bg-indigo-500" value={p1} calculation={`(${tens1}×${tens2})`} className="rounded-tl-lg" />
                        <AreaBox bgColor="bg-purple-500" value={p2} calculation={`(${tens1}×${ones2})`} className="rounded-tr-lg" />

                        {/* Second Row */}
                        <div className="text-center font-bold p-1 flex items-center justify-center text-slate-700 text-lg">{ones1}</div>
                        <AreaBox bgColor="bg-teal-500" value={p3} calculation={`(${ones1}×${tens2})`} className="rounded-bl-lg" />
                        <AreaBox bgColor="bg-pink-500" value={p4} calculation={`(${ones1}×${ones2})`} className="rounded-br-lg" />
                    </div>
                </div>
            </StepContainer>

            <StepContainer step={3} title="부분 곱 더하기">
                 <div className="flex justify-center">
                    <div className="text-right text-2xl font-mono tracking-wider bg-slate-50 p-6 rounded-lg">
                        <p className="text-indigo-600">{p1}</p>
                        <p className="text-purple-600">{p2}</p>
                        <p className="text-teal-600">{p3}</p>
                        <p className="text-pink-600 border-b-2 border-slate-400 pb-2">+ {p4}</p>
                        <p className="font-bold text-3xl mt-2 text-slate-800">{total}</p>
                    </div>
                </div>
            </StepContainer>

            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-xl shadow-xl text-center">
                <h3 className="text-xl font-bold mb-1">최종 결과</h3>
                <p className="text-3xl sm:text-4xl font-extrabold">
                    {num1} × {num2} = {total}
                </p>
            </div>
        </div>
    );
};

export default Visualization;
