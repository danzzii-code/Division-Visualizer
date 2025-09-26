import React from 'react';

type BlockType = 'ten' | 'one';

interface BlockProps {
  type: BlockType;
  colorClass?: string;
}

const Block: React.FC<BlockProps> = ({ type, colorClass }) => {
  const defaultColor = type === 'ten' ? 'bg-sky-400' : 'bg-emerald-400';
  const color = colorClass || defaultColor;
  const size = type === 'ten' ? 'w-6 h-20' : 'w-6 h-6';
  const hoverEffect = 'transition-transform duration-150 ease-in-out hover:scale-110 hover:z-10';
  
  return (
    <div 
      className={`relative ${size} ${color} rounded border border-slate-600 shadow-sm ${hoverEffect}`} 
      title={type === 'ten' ? '십의 묶음' : '낱개'}
    />
  );
};

export default Block;
