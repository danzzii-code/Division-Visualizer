import React from 'react';
import Block from './Block';

type BlockType = 'ten' | 'one';

interface BlockGridProps {
  count: number;
  type: BlockType;
  colorClass?: string;
  itemsPerRow?: number;
}

const BlockGrid: React.FC<BlockGridProps> = ({ count, type, colorClass, itemsPerRow = 10 }) => {
  if (count <= 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 justify-start items-start p-1">
      {Array.from({ length: count }).map((_, i) => (
        <Block key={i} type={type} colorClass={colorClass} />
      ))}
    </div>
  );
};

export default BlockGrid;
