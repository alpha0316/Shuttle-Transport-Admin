import { clsx } from 'clsx';
import {
  CaretLeft, CaretRight, CaretDown, CaretUp, X, Bell, Gear, User, Bus, Plus, Trash, PencilSimple,
  Eye, ArrowsClockwise, MapPin, Wrench, Warning, CheckCircle,
  type Icon as PhosphorIcon,
} from '@phosphor-icons/react';

const iconMap: Record<string, PhosphorIcon> = {
  'chevron-left': CaretLeft,
  'chevron-right': CaretRight,
  'chevron-down': CaretDown,
  'chevron-up': CaretUp,
  x: X,
  bell: Bell,
  gear: Gear,
  user: User,
  bus: Bus,
  plus: Plus,
  trash: Trash,
  edit: PencilSimple,
  view: Eye,
  refresh: ArrowsClockwise,
  'map-pin': MapPin,
  wrench: Wrench,
  warning: Warning,
  'check-circle': CheckCircle,
};

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
}

export function Icon({ name, size = 16, className, color }: IconProps) {
  const Comp = iconMap[name];
  if (!Comp) {
    return <span className={clsx('inline-block', className)} style={{ width: size, height: size }} />;
  }
  return <Comp size={size} className={className} color={color} />;
}
