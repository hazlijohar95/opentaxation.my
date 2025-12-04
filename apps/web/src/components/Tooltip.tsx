import { Tooltip as TooltipPrimitive, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Question } from 'phosphor-react';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
  return (
    <TooltipProvider>
      <TooltipPrimitive>
        <TooltipTrigger asChild>
          {children || <Question weight="duotone" className="h-4 w-4 text-muted-foreground cursor-help" />}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p>{content}</p>
        </TooltipContent>
      </TooltipPrimitive>
    </TooltipProvider>
  );
}
