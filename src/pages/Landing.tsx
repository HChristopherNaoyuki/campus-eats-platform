import { Link } from "react-router-dom";
import { useCampus } from "@/store/campusStore";
import { Button } from "@/components/ui/button";
import homePhoto from "@/assets/home-restaurant.jpg.asset.json";
import { useI18n } from "@/i18n";

/**
 * Home page, a direct port of the reference `index.php`.
 *
 * Section order, copy, icons and markup mirror the PHP landing page: hero,
 * stats band, "Pickup in three steps", the four core modules, the featured
 * vendor card fed by the live API catalogue, and the vendor call to action.
 */
export default function Landing()
{
    const { vendors, menu } = useCampus();
    const { t } = useI18n();

    const featured = vendors.find((vendor) => menu.some((item) => item.vendorId === vendor.id));
    const featuredMenu = featured
        ? menu.filter((item) => item.vendorId === featured.id).slice(0, 4)
        : [];

    const steps =
    [
        { number: "1", titleKey: "mkt.landing.step1Title", textKey: "mkt.landing.step1Text" },
        { number: "2", titleKey: "mkt.landing.step2Title", textKey: "mkt.landing.step2Text" },
        { number: "3", titleKey: "mkt.landing.step3Title", textKey: "mkt.landing.step3Text" },
    ];

    const features =
    [
        { icon: "fa-users", titleKey: "mkt.landing.feature1Title", textKey: "mkt.landing.feature1Text" },
        { icon: "fa-store", titleKey: "mkt.landing.feature2Title", textKey: "mkt.landing.feature2Text" },
        { icon: "fa-utensils", titleKey: "mkt.landing.feature3Title", textKey: "mkt.landing.feature3Text" },
        { icon: "fa-clipboard-list", titleKey: "mkt.landing.feature4Title", textKey: "mkt.landing.feature4Text" },
    ];

    return (
        <div className="refined-page home-page">
            <section id="home" className="hero">
                <img className="home-photo" src={homePhoto.url} alt="" fetchPriority="high" />
                <div className="container">
                    <h1>{t("mkt.landing.heroTitle1")}<br /><span>{t("mkt.landing.heroTitle2")}</span></h1>
                    <p>{t("mkt.landing.heroText")}</p>
                    <div className="hero-buttons">
                        <Button asChild className="home-action"><Link to="/signup">{t("mkt.landing.orderNow")}</Link></Button>
                        <Button asChild variant="outline" className="home-action home-action-outline"><a href="#how-it-works">{t("mkt.landing.learnMore")}</a></Button>
                    </div>
                </div>
            </section>

            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <div>
                            <div className="stat-number">{vendors.length.toLocaleString()}</div>
                            <div className="stat-label">{t("mkt.landing.statVendors")}</div>
                        </div>
                        <div>
                            <div className="stat-number">{menu.length.toLocaleString()}</div>
                            <div className="stat-label">{t("mkt.landing.statMenuItems")}</div>
                        </div>
                        <div>
                            <div className="stat-number">{t("mkt.landing.statPickup")}</div>
                            <div className="stat-label">{t("mkt.landing.statPickupLabel")}</div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="how-it-works">
                <div className="container">
                    <div className="section-title">
                        <h2>{t("mkt.landing.stepsTitle")}</h2>
                        <p>{t("mkt.landing.stepsSubtitle")}</p>
                    </div>
                    <div className="steps">
                        {steps.map((step) => (
                            <div className="step" key={step.number}>
                                <div className="step-number">{step.number}</div>
                                <h3>{t(step.titleKey)}</h3>
                                <p>{t(step.textKey)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="features">
                <div className="container">
                    <div className="section-title">
                        <h2>{t("mkt.landing.featuresTitle")}</h2>
                        <p>{t("mkt.landing.featuresSubtitle")}</p>
                    </div>
                    <div className="features-grid">
                        {features.map((feature) => (
                            <div className="feature-card" key={feature.titleKey}>
                                <div className="feature-icon"><i className={`fas ${feature.icon}`} aria-hidden="true" /></div>
                                <h3>{t(feature.titleKey)}</h3>
                                <p>{t(feature.textKey)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="vendors" className="vendors">
                <div className="container">
                    <div className="section-title">
                        <h2>{t("mkt.landing.featuredVendorTitle")}</h2>
                        <p>{t("mkt.landing.featuredVendorSubtitle")}</p>
                    </div>

                    {featured ? (
                        <div className="featured-vendor">
                            <div className="featured-vendor-header">
                                <h2>
                                    <i className="fas fa-store" aria-hidden="true" />
                                    {featured.name}
                                </h2>
                            </div>
                            <div className="featured-vendor-body">
                                <p>
                                    <i className="fas fa-map-marker-alt" aria-hidden="true" />
                                    {featured.location}
                                </p>
                                <p>
                                    <i className="fas fa-tag" aria-hidden="true" />
                                    {featured.contact}
                                </p>

                                {featuredMenu.length > 0 && (
                                    <div className="featured-vendor-menu">
                                        <h4>{t("mkt.landing.popularItems")}</h4>
                                        <div className="menu-preview">
                                            {featuredMenu.map((item) => (
                                                <div className="menu-preview-item" key={item.id}>
                                                    <div className="item-name">{item.name}</div>
                                                    <div className="item-price">R {item.price.toFixed(2)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="featured-vendor-footer">
                                    <p>
                                        <i className="fas fa-info-circle" aria-hidden="true" />
                                        {t("mkt.landing.signUpToView")}
                                    </p>
                                    <div className="featured-vendor-actions">
                                        <Button asChild className="home-action"><Link to="/signup">{t("mkt.landing.signUpToOrder")}</Link></Button>
                                        <Button asChild variant="outline" className="home-action home-action-outline"><Link to="/login">{t("mkt.landing.logIn")}</Link></Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <i className="fas fa-store-slash" aria-hidden="true" />
                            <h3>{t("mkt.landing.noVendorsTitle")}</h3>
                            <p>{t("mkt.landing.noVendorsText")}</p>
                            <Button asChild className="home-action"><Link to="/signup">{t("mkt.landing.signUp")}</Link></Button>
                        </div>
                    )}
                </div>
            </section>

            <section className="cta vendor-cta">
                <div className="container">
                    <h2>{t("mkt.landing.ctaTitle")}</h2>
                    <p>{t("mkt.landing.ctaText")}</p>
                    <ul>
                        <li><i className="fas fa-check-circle" aria-hidden="true" /> {t("mkt.landing.ctaItem1")}</li>
                        <li><i className="fas fa-check-circle" aria-hidden="true" /> {t("mkt.landing.ctaItem2")}</li>
                        <li><i className="fas fa-check-circle" aria-hidden="true" /> {t("mkt.landing.ctaItem3")}</li>
                    </ul>
                    <Button asChild className="home-action"><Link to="/signup">{t("mkt.landing.becomeVendor")}</Link></Button>
                </div>
            </section>
        </div>
    );
}
