import Buttons from "@/components/Buttons";

const Tab = ({ label, activeTab, onClick }) => {
  const handleClick = () => {
    onClick(label);
  };

  return (
    <Buttons className={`ui-tab-btn ${activeTab === label ? "active" : ""}`} onClick={handleClick}>
      {label}
    </Buttons>
  );
};

export default Tab;
