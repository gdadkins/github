import React, { useState, useEffect, useCallback } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import ErrorBoundary from '../ErrorBoundary';
import './DashboardLayout.css';

interface Widget {
  id: string;
  component: React.ComponentType<any>;
  title: string;
  description: string;
  size: 'small' | 'medium' | 'large' | 'full';
  minSize?: 'small' | 'medium' | 'large';
  category: 'critical' | 'primary' | 'secondary' | 'optional';
  isPremium?: boolean;
  props?: any;
}

interface DashboardLayoutProps {
  widgets: Widget[];
  layout?: string;
  onLayoutChange?: (widgets: Widget[]) => void;
  isPremium?: boolean;
}

interface SortableWidgetProps {
  widget: Widget;
  onRemove: (id: string) => void;
  onResize: (id: string, size: Widget['size']) => void;
  isPremium: boolean;
}

const SortableWidget: React.FC<SortableWidgetProps> = ({ widget, onRemove, onResize, isPremium }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const Component = widget.component;


  // Component validation for React components (including lazy components)
  const isValidComponent = Component && (
    typeof Component === 'function' || 
    (Component as any).$$typeof === Symbol.for('react.lazy') ||
    (Component as any).$$typeof === Symbol.for('react.forward_ref') ||
    (Component as any).$$typeof === Symbol.for('react.memo') ||
    (Component as any).$$typeof
  );
  
  if (!isValidComponent) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`dashboard-widget size-${widget.size} category-${widget.category} ${isDragging ? 'dragging' : ''}`}
      >
        <div className="widget-header">
          <h3 className="widget-title">{widget.title}</h3>
          <button
            className="widget-remove"
            onClick={() => onRemove(widget.id)}
            title="Remove widget"
          >
            ×
          </button>
        </div>
        <div className="widget-content">
          <div className="error-content" style={{ padding: '20px', textAlign: 'center', color: '#ef4444' }}>
            <p>Component failed to load</p>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>Widget ID: {widget.id}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`dashboard-widget size-${widget.size} category-${widget.category} ${isDragging ? 'dragging' : ''}`}
    >
      <div className="widget-header">
        <div className="widget-drag-handle" {...attributes} {...listeners}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3 3h2v2H3V3zm0 4h2v2H3V7zm0 4h2v2H3v-2zm4-8h2v2H7V3zm0 4h2v2H7V7zm0 4h2v2H7v-2zm4-8h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2z"/>
          </svg>
        </div>
        <h3 className="widget-title">{widget.title}</h3>
        <div className="widget-controls">
          <div className="size-selector">
            {(['small', 'medium', 'large', 'full'] as const).map(size => (
              <button
                key={size}
                className={`size-button ${widget.size === size ? 'active' : ''}`}
                onClick={() => onResize(widget.id, size)}
                disabled={widget.minSize && ['small', 'medium', 'large'].indexOf(size) < ['small', 'medium', 'large'].indexOf(widget.minSize)}
                title={`Resize to ${size}`}
              >
                <span className={`size-icon ${size}`}></span>
              </button>
            ))}
          </div>
          <button
            className="widget-remove"
            onClick={() => onRemove(widget.id)}
            title="Remove widget"
          >
            ×
          </button>
        </div>
      </div>
      <div className="widget-content">
        {widget.isPremium && !isPremium ? (
          <div className="premium-overlay">
            <div className="premium-content">
              <span className="premium-icon">🔒</span>
              <h4>Premium Feature</h4>
              <p>{widget.description}</p>
              <button className="premium-upgrade">Upgrade to Premium</button>
            </div>
          </div>
        ) : (
          <React.Suspense fallback={
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <div className="loading-spinner" style={{ width: '32px', height: '32px', margin: '0 auto' }}></div>
            </div>
          }>
            <ErrorBoundary>
              <Component {...widget.props} />
            </ErrorBoundary>
          </React.Suspense>
        )}
      </div>
    </div>
  );
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  widgets: initialWidgets, 
  layout = 'default',
  onLayoutChange,
  isPremium = false 
}) => {
  const [widgets, setWidgets] = useState(initialWidgets);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [availableWidgets, setAvailableWidgets] = useState<Widget[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterCategory, setFilterCategory] = useState<'all' | Widget['category']>('all');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    // Load saved layout from localStorage
    const savedLayout = localStorage.getItem(`dashboard-layout-${layout}`);
    if (savedLayout) {
      try {
        const parsed = JSON.parse(savedLayout);
        // Merge with initial widgets to handle new widgets
        const mergedWidgets = initialWidgets.map(widget => {
          const saved = parsed.find((w: any) => w.id === widget.id);
          return saved ? { ...widget, ...saved } : widget;
        });
        setWidgets(mergedWidgets);
      } catch (e) {
        console.error('Failed to load saved layout:', e);
        // Fallback to initial widgets if saved layout is corrupted
        setWidgets(initialWidgets);
      }
    } else {
      // No saved layout, use initial widgets
      setWidgets(initialWidgets);
    }
  }, [layout, initialWidgets]);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        // Save to localStorage
        localStorage.setItem(`dashboard-layout-${layout}`, JSON.stringify(newOrder));
        
        // Notify parent
        onLayoutChange?.(newOrder);
        
        return newOrder;
      });
    }
  };

  const handleRemoveWidget = useCallback((id: string) => {
    setWidgets(prev => {
      const updated = prev.filter(w => w.id !== id);
      localStorage.setItem(`dashboard-layout-${layout}`, JSON.stringify(updated));
      onLayoutChange?.(updated);
      return updated;
    });
    
    // Add to available widgets
    const removed = widgets.find(w => w.id === id);
    if (removed) {
      setAvailableWidgets(prev => [...prev, removed]);
    }
  }, [widgets, layout, onLayoutChange]);

  const handleResizeWidget = useCallback((id: string, size: Widget['size']) => {
    setWidgets(prev => {
      const updated = prev.map(w => w.id === id ? { ...w, size } : w);
      localStorage.setItem(`dashboard-layout-${layout}`, JSON.stringify(updated));
      onLayoutChange?.(updated);
      return updated;
    });
  }, [layout, onLayoutChange]);

  const handleAddWidget = useCallback((widget: Widget) => {
    setWidgets(prev => {
      const updated = [...prev, widget];
      localStorage.setItem(`dashboard-layout-${layout}`, JSON.stringify(updated));
      onLayoutChange?.(updated);
      return updated;
    });
    
    setAvailableWidgets(prev => prev.filter(w => w.id !== widget.id));
  }, [layout, onLayoutChange]);

  const resetLayout = useCallback(() => {
    setWidgets(initialWidgets);
    localStorage.removeItem(`dashboard-layout-${layout}`);
    onLayoutChange?.(initialWidgets);
    setAvailableWidgets([]);
  }, [initialWidgets, layout, onLayoutChange]);

  const filteredWidgets = filterCategory === 'all' 
    ? widgets 
    : widgets.filter(w => w.category === filterCategory);

  return (
    <div className={`dashboard-layout ${isCustomizing ? 'customizing' : ''} view-${viewMode}`}>
      <div className="layout-controls">
        <div className="control-group">
          <button
            className={`control-button ${isCustomizing ? 'active' : ''}`}
            onClick={() => setIsCustomizing(!isCustomizing)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
              <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
            </svg>
            <span>Customize</span>
          </button>
          
          {isCustomizing && (
            <>
              <div className="view-toggle">
                <button
                  className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid view"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/>
                  </svg>
                </button>
                <button
                  className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List view"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                  </svg>
                </button>
              </div>

              <button
                className="control-button"
                onClick={resetLayout}
                title="Reset to default layout"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                </svg>
                <span>Reset</span>
              </button>
            </>
          )}
        </div>

        <div className="filter-group">
          <label className="filter-label">Show:</label>
          <select 
            className="filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
          >
            <option value="all">All Widgets</option>
            <option value="critical">Critical</option>
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="optional">Optional</option>
          </select>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredWidgets.map(w => w.id)}
          strategy={rectSortingStrategy}
          disabled={!isCustomizing}
        >
          <div className="widgets-grid">
            {filteredWidgets.map((widget) => (
              <SortableWidget
                key={widget.id}
                widget={widget}
                onRemove={handleRemoveWidget}
                onResize={handleResizeWidget}
                isPremium={isPremium}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {isCustomizing && availableWidgets.length > 0 && (
        <div className="available-widgets">
          <h3>Available Widgets</h3>
          <div className="widgets-list">
            {availableWidgets.map((widget) => (
              <div key={widget.id} className="available-widget">
                <div className="widget-info">
                  <h4>{widget.title}</h4>
                  <p>{widget.description}</p>
                  {widget.isPremium && <span className="premium-badge">Premium</span>}
                </div>
                <button
                  className="add-widget-button"
                  onClick={() => handleAddWidget(widget)}
                  disabled={widget.isPremium && !isPremium}
                >
                  + Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;