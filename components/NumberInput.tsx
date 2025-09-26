import React from 'react';

interface NumberInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const NumberInput: React.FC<NumberInputProps> = ({ label, value, onChange, placeholder }) => {
  return (
    <div className="flex-1 w-full">
      <label className="block mb-2 text-sm font-medium text-slate-600">{label}</label>
      <input
        type="number"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full text-4xl font-bold p-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition placeholder:text-slate-400 placeholder:font-medium placeholder:text-3xl"
        onFocus={(e) => e.target.select()}
      />
    </div>
  );
};

export default NumberInput;