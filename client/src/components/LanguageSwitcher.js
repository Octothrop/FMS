import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <div>
      <select onChange={changeLanguage} defaultValue="en">
        <option value="en">ENG</option>
        <option value="kn">KAN</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
