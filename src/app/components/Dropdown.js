// components/Dropdown.js
import {useEffect, useRef, useState} from 'react';

const Dropdown = ({casesArray}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Add event listener when the dropdown is opened
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      // Remove the event listener when the component unmounts or the dropdown is closed
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="text-left text-base bg-tertiary rounded-md px-4 py-2 mt-3"
      >
        {isOpen ? (<p className="text-white">Hide cases</p>) : (
          <p className="text-white">View cases related to your query</p>)}
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full bg-white rounded-md shadow-lg max-h-96 overflow-auto mt-1">
          <ul className="py-2 text-base text-gray-700">
            {casesArray.map((caseItem, index) => (
              <li key={index} className="px-4 py-3 hover:bg-gray-100 border-b border-gray-200">
                <div className="font-semibold">{caseItem.citation}</div>
                <div className="text-sm text-gray-600"><strong>Court: </strong>{caseItem.court}</div>
                <div className="text-sm text-gray-600"><strong>Judge(s): </strong>{caseItem.judge}</div>
                <a
                  href={caseItem.sourceFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 visited:text-purple-600 text-sm"
                >
                  View Source
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;