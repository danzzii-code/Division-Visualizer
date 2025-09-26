import React from 'react';

interface NumberInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength: number;
}

const NumberInput: React.FC<NumberInputProps> = ({ label, value, onChange, maxLength }) => {
  return (
    <div className="flex flex-col items-center">
      <label className="mb-2 text-sm font-medium text-slate-600">{label}</label>
      <input
        type="number"
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className="w-full sm:w-32 text-center text-4xl font-bold p-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
        onFocus={(e) => e.target.select()}
      />
    </div>
  );
};

export default NumberInput;
