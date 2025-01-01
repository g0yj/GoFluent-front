import { useCallback, useEffect, useState } from "react";
import Tab from "./Tab";

// eslint-disable-next-line react/display-name
const Tabs = ({ defaultActiveTab, children, onChangeTab }) => {
  const [activeTab, setActiveTab] = useState(
    defaultActiveTab ?? children[0]?.props?.label ?? children.props.label
  );
  const [key, setKey] = useState(0);

  const handleTabClick = useCallback((tabLabel) => {
    setActiveTab(tabLabel);
    setKey(prevKey => prevKey + 1);
      onChangeTab && onChangeTab(tabLabel);
  }, [onChangeTab]);

  useEffect(() => {
    onChangeTab && onChangeTab(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, onChangeTab]);

  return (
    <div className="ui-tabs-wrap">
      <div className="tab-btn-wrap">
        {Array.isArray(children) ? (
          children.map((child) => (
            <Tab
              key={`${child.props.label}-${key}`}
              label={child.props.label}
              onClick={handleTabClick}
              activeTab={activeTab}
            />
          ))
        ) : (
          <Tab
            key={`${children.props.label}-${key}`}
            label={children.props.label}
            onClick={handleTabClick}
            activeTab={activeTab}
          />
        )}
      </div>
      <div className="tab-content" key={key}>
        {Array.isArray(children)
          ? children.find((child) => child.props.label === activeTab)?.props?.children
          : children.props.children}
      </div>
    </div>
  );
};

export default Tabs;
