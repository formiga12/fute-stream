import * as React from "react"

import { cn } from "@/lib/utils"

// Create our own simplified implementation without using Radix UI
const Tabs = ({ value, onValueChange, children }) => {
  const [activeTab, setActiveTab] = React.useState(value);
  
  React.useEffect(() => {
    if (value) {
      setActiveTab(value);
    }
  }, [value]);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (onValueChange) {
      onValueChange(tab);
    }
  };
  
  // Clone children with proper context
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      const props = {};
      
      if (child.type.displayName === 'TabsList' || child.type.displayName === 'TabsContent') {
        props.activeTab = activeTab;
        props.onTabChange = handleTabChange;
      }
      
      return React.cloneElement(child, props);
    }
    return child;
  });
  
  return <div className="tabs-root">{childrenWithProps}</div>;
};

const TabsList = ({ className, activeTab, onTabChange, children, ...props }) => {
  // Clone trigger children with active state and click handler
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child) && child.type.displayName === 'TabsTrigger') {
      return React.cloneElement(child, {
        isActive: activeTab === child.props.value,
        onClick: () => onTabChange(child.props.value)
      });
    }
    return child;
  });
  
  return (
    <div 
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", 
        className
      )}
      {...props}
    >
      {childrenWithProps}
    </div>
  );
};
TabsList.displayName = "TabsList";

const TabsTrigger = ({ className, value, isActive, onClick, children, ...props }) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        isActive 
          ? "bg-background text-foreground shadow-sm" 
          : "text-muted-foreground hover:bg-background/50 hover:text-foreground",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = ({ className, value, activeTab, children, ...props }) => {
  // Only render content if tab is active
  if (value !== activeTab) {
    return null;
  }
  
  return (
    <div
      className={cn(
        "mt-2 focus-visible:outline-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
export default Tabs;