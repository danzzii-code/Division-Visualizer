import React from 'react';

interface StepCardProps {
  step: number;
  title: string;
  children: React.ReactNode;
}

const StepCard: React.FC<StepCardProps> = ({ step, title, children }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h3 className="flex items-center text-xl font-bold text-slate-700">
          <span className="flex items-center justify-center w-8 h-8 bg-sky-500 text-white rounded-full text-sm font-bold mr-4">{step}</span>
          {title}
        </h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default StepCard;