import React from 'react';
import { Briefcase, BookOpen, Gamepad2, Link2, Puzzle, Shapes } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<any>> = {
  gamepad: Gamepad2,
  briefcase: Briefcase,
  'book-open': BookOpen,
  puzzle: Puzzle,
  link: Link2
};

const fallbackByType: Record<string, React.ComponentType<any>> = {
  'game-dev': Gamepad2,
  work: Briefcase,
  learning: BookOpen,
  custom: Puzzle
};

type IconGlyphProps = {
  name?: string;
  type?: string;
  className?: string;
};

const IconGlyph = ({ name = '', type = '', className = '' }: IconGlyphProps) => {
  const Icon = iconMap[name] || fallbackByType[type] || Shapes;
  return <Icon size={16} className={className} aria-hidden="true" />;
};

export default IconGlyph;
