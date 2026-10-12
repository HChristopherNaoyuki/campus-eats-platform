import { Link } from "react-router-dom";
import { useI18n } from "@/i18n";

/**
 * Site-wide footer, a direct port of `solution/includes/footer.php`.
 *
 * Four-column grid (brand + social, Explore, Application, Legal) above a
 * bottom bar holding the copyright line and the button-style nav links.
 */
export default function MarketingFooter()
{
    const { t } = useI18n();
    return (
        <footer className="app-footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-column">
                        <div className="footer-logo">
                            <i className="fas fa-utensils" aria-hidden="true" />
                            <span>Campus Eats</span>
                        </div>
                        <p className="footer-description">
                            {t("mkt.footer.description")}
                        </p>
                        <div className="social-links">
                            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f" aria-hidden="true" /></a>
                            <a href="#" aria-label="Twitter"><i className="fab fa-twitter" aria-hidden="true" /></a>
                            <a href="#" aria-label="Instagram"><i className="fab fa-instagram" aria-hidden="true" /></a>
                            <a
                                href="https://github.com/HChristopherNaoyuki"
                                target="_blank"
                                rel="noreferrer noopener"
                                aria-label="GitHub"
                            >
                                <i className="fab fa-github" aria-hidden="true" />
                            </a>
                        </div>
                    </div>

                    <div className="footer-column">
                        <h3>{t("mkt.footer.explore")}</h3>
                        <ul>
                            <li><Link to="/#home">{t("mkt.nav.home")}</Link></li>
                            <li><Link to="/about">{t("mkt.nav.about")}</Link></li>
                            <li><Link to="/#vendors">{t("mkt.nav.services")}</Link></li>
                            <li><Link to="/faq">{t("mkt.nav.faq")}</Link></li>
                            <li><Link to="/help">{t("mkt.nav.help")}</Link></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3>{t("mkt.footer.application")}</h3>
                        <ul>
                            <li><Link to="/login">{t("mkt.footer.signIn")}</Link></li>
                            <li><Link to="/signup">{t("mkt.footer.createAccount")}</Link></li>
                            <li><Link to="/student">{t("mkt.footer.studentDashboard")}</Link></li>
                            <li><Link to="/vendor">{t("mkt.footer.vendorDashboard")}</Link></li>
                            <li><Link to="/dashboard">{t("mkt.footer.adminDashboard")}</Link></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3>{t("mkt.footer.legal")}</h3>
                        <ul>
                            <li><Link to="/privacy">{t("mkt.footer.privacyPolicy")}</Link></li>
                            <li><Link to="/terms">{t("mkt.footer.termsConditions")}</Link></li>
                            <li><Link to="/donate">{t("mkt.footer.cryptoDonations")}</Link></li>
                            <li>
                                <a
                                    href="https://github.com/HChristopherNaoyuki/campus-eats-platform"
                                    target="_blank"
                                    rel="noreferrer noopener"
                                >
                                    {t("mkt.footer.websiteRepo")}
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://github.com/HChristopherNaoyuki/campus-eats-app-kt"
                                    target="_blank"
                                    rel="noreferrer noopener"
                                >
                                    {t("mkt.footer.mobileRepo")}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="copyright">
                        <p>
                            {t("mkt.footer.copyright").replace("{year}", String(new Date().getFullYear()))}
                        </p>
                    </div>

                    <div className="footer-nav-buttons">
                        <Link to="/terms" className="footer-nav-btn">
                            <i className="fas fa-file-contract" aria-hidden="true" />
                            <span>{t("mkt.footer.terms")}</span>
                        </Link>
                        <Link to="/privacy" className="footer-nav-btn">
                            <i className="fas fa-shield-alt" aria-hidden="true" />
                            <span>{t("mkt.footer.privacy")}</span>
                        </Link>
                        <Link to="/help" className="footer-nav-btn">
                            <i className="fas fa-life-ring" aria-hidden="true" />
                            <span>{t("mkt.footer.support")}</span>
                        </Link>
                        <a
                            href="https://github.com/HChristopherNaoyuki"
                            target="_blank"
                            rel="noreferrer noopener"
                            className="footer-nav-btn"
                        >
                            <i className="fab fa-github" aria-hidden="true" />
                            <span>GitHub</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}