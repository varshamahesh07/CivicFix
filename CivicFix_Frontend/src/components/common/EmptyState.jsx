import React from 'react';
import { Inbox, FileSearch, ImageOff } from 'lucide-react';

export default function EmptyState({
  title = 'No records found',
  description = 'There are no items to display at this time.',
  action = null,
  icon = 'inbox'
}) {
  const getIcon = () => {
    switch (icon) {
      case 'search':
        return <FileSearch className="w-12 h-12 text-civic-charcoal-400 stroke-1" />;
      case 'image':
        return <ImageOff className="w-12 h-12 text-civic-charcoal-400 stroke-1" />;
      case 'inbox':
      default:
        return <Inbox className="w-12 h-12 text-civic-charcoal-400 stroke-1" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl border border-dashed border-civic-navy-200/80 bg-civic-sand-50/50">
      <div className="w-16 h-16 rounded-full bg-civic-sand-100 flex items-center justify-center mb-4 border border-civic-navy-100">
        {getIcon()}
      </div>
      <h4 className="text-base font-semibold text-civic-navy-900 mb-1">{title}</h4>
      <p className="text-sm text-civic-charcoal-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
