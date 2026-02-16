import React from 'react';
import { Briefcase, BookOpen, Gamepad2, Link2, Puzzle, Shapes } from 'lucide-react';

const iconMap = {
  gamepad: Gamepad2,
  briefcase: Briefcase,
  'book-open': BookOpen,
  puzzle: Puzzle,
  link: Link2
};

const fallbackByType = {
  'game-dev': Gamepad2,
  work: Briefcase,
  learning: BookOpen,
  custom: Puzzle
};

const IconGlyph = ({ name, type, className = '' }) => {
  const Icon = iconMap[name] || fallbackByType[type] || Shapes;
  return <Icon size={16} className={className} aria-hidden="true" />;
};

export default IconGlyph;
