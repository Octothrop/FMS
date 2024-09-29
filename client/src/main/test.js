import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

const Test = () => {
  const { t } = useTranslation();

  return (
    <div className="Home">
      <LanguageSwitcher />

      <h1>{t('welcome')}</h1>
      <p>{t('description')}</p>
    </div>
  );
};

export default Test;
