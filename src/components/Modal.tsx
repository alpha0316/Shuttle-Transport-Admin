import { clsx } from 'clsx';
import { Icon } from './Icon';

interface ModalTab {
  label: string;
  value: string;
  count?: number;
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  tabs?: ModalTab[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  children: React.ReactNode;
  width?: string;
  footer?: React.ReactNode;
}

export function Modal({
  open,
  onClose,
  title,
  tabs,
  activeTab,
  onTabChange,
  children,
  width = 'w-[410px]',
  footer,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[3px]"
        onClick={onClose}
      />
      <div className={clsx(
        'absolute right-[12px] top-[12px] h-[calc(100vh-24px)] rounded-[22px] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.2)] flex flex-col',
        width
      )}>
        <div className="px-[20px] pb-[10px] pt-[22px] shrink-0">
          <h2 className="pr-12 text-[17px] font-bold leading-none text-black">{title}</h2>
          <button
            onClick={onClose}
            className="absolute right-[12px] top-[12px] flex h-[38px] w-[38px] items-center justify-center rounded-full border border-[#e5e5e5] bg-white text-[#202020] shadow-[0_2px_7px_rgba(0,0,0,0.22)] transition-colors hover:bg-[#f8f8f8]"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        {tabs && tabs.length > 0 && (
          <div className="mx-[20px] flex h-[26px] w-fit items-center rounded-[6px] bg-[#f1f1f2] p-[1px] shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => onTabChange?.(tab.value)}
                className={clsx(
                  'flex h-[24px] items-center rounded-[5px] px-[9px] text-[13px] font-medium leading-none transition-colors',
                  activeTab === tab.value
                    ? 'bg-white text-[#242424] shadow-[0_1px_3px_rgba(0,0,0,0.12)]'
                    : 'text-black/50 hover:text-[#555]'
                )}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-[4px] inline-flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-[#ff3b30] px-[2px] text-[9px] font-bold leading-none text-white">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-[20px] pt-[20px]">{children}</div>
        {footer && (
          <div className="shrink-0 border-t border-black/10 px-[20px] py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
