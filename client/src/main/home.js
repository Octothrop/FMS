import React from "react";
import { useTranslation } from "react-i18next";
import Header from "../header-footer/header";
import Footer from "../header-footer/footer";
import "./home.css";
import TestimonialsSlider from "./slider";

const Home = () => {
  const { t } = useTranslation();

  const features = [
    {
      title: t("feature.buySellCrops.title"),
      description: t("feature.buySellCrops.description"),
      image: t("feature.buySellCrops.image"),
    },
    {
      title: t("feature.supportBot.title"),
      description: t("feature.supportBot.description"),
      image: t("feature.supportBot.image"),
    },
    {
      title: t("feature.funding.title"),
      description: t("feature.funding.description"),
      image: t("feature.funding.image"),
    },
    {
      title: t("feature.management.title"),
      description: t("feature.management.description"),
      image: t("feature.management.image"),
    },
  ];

  return (
    <div className="Home">
      <Header />
      <div className="home-main">
        <div className="section-1">
          <div className="image-container">
            <img
              src="https://img.freepik.com/free-photo/healthy-eating-fresh-vegetables-rustic-wicker-basket-generated-by-ai_188544-37704.jpg?t=st=1727603601~exp=1727607201~hmac=5d02fa2ece01e6f530ec42f94984230e655deae65819d1c9849983a484445c05&w=1380"
              alt="Nature"
            />
            <p className="overlay-text">{t("section-1-text")}</p>
          </div>
        </div>
        <img
          className="section-2"
          src="https://img.freepik.com/free-vector/social-media-cover-template-agriculture-farming-organic-food_23-2150196186.jpg?t=st=1727605829~exp=1727609429~hmac=f9e012e6def88e94047b4a467e451c89ffb1a6358fe30f2badf614f474316408&w=1380"
          alt="Social Media Cover"
        />
        <div className="section-3">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <img
                src={feature.image}
                alt={feature.title}
                className="feature-image"
              />
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
        <img
          className="ad"
          src="https://img.freepik.com/free-vector/hand-drawn-agriculture-company-facebook-cover_23-2149702295.jpg?t=st=1727607041~exp=1727610641~hmac=01c130d308ab42e4796077c38513d47e0973742e5ebdf9488c2e055dad6a9658&w=1380"
          alt="Webinar Template"
        />
        <TestimonialsSlider />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
