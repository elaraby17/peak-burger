import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "./Hero";
import PopularProducts from "./PopularProducts";
import Categories from "./Categories";
import SpecialOffers from "./SpecialOffers";
import WhyPeakBurger from "./WhyPeakBurger";
import Reviews from "./Reviews";
import CTA from "./CTA";

export default function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    document.title = "Peak Burger — Fresh. Hot. Unforgettable.";
  }, []);

  useEffect(() => {
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, [hash]);

  return (
    <div>
      <Hero />
      <PopularProducts />
      <Categories />
      <SpecialOffers />
      <WhyPeakBurger />
      <Reviews />
      <CTA />
    </div>
  );
}
