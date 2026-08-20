import { Link } from "react-router-dom";

/**
 * Site-wide footer, a direct port of `solution/includes/footer.php`.
 *
 * Four-column grid (brand + social, Explore, Application, Legal) above a
 * bottom bar holding the copyright line and the button-style nav links.
 */
export default function MarketingFooter()
{
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
                            The student pickup network — order ahead from campus vendors and skip the queue.
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
                        <h3>Explore</h3>
                        <ul>
                            <li><Link to="/#home">Home</Link></li>
                            <li><Link to="/about">About</Link></li>
                            <li><Link to="/#vendors">Services</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                            <li><Link to="/help">Help Center</Link></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3>Application</h3>
                        <ul>
                            <li><Link to="/login">Sign in</Link></li>
                            <li><Link to="/signup">Create account</Link></li>
                            <li><Link to="/student">Student dashboard</Link></li>
                            <li><Link to="/vendor">Vendor dashboard</Link></li>
                            <li><Link to="/dashboard">Admin dashboard</Link></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3>Legal</h3>
                        <ul>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/terms">Terms &amp; Conditions</Link></li>
                            <li><Link to="/donate">Crypto donations</Link></li>
                            <li>
                                <a
                                    href="https://github.com/HChristopherNaoyuki/campus-eats-platform"
                                    target="_blank"
                                    rel="noreferrer noopener"
                                >
                                    Website repository
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://github.com/HChristopherNaoyuki/campus-eats-app-kt"
                                    target="_blank"
                                    rel="noreferrer noopener"
                                >
                                    Mobile app repository
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="copyright">
                        <p>
                            © {new Date().getFullYear()} Campus Eats — student pickup network.
                            All prices in South African Rand (R).
                        </p>
                    </div>

                    <div className="footer-nav-buttons">
                        <Link to="/terms" className="footer-nav-btn">
                            <i className="fas fa-file-contract" aria-hidden="true" />
                            <span>Terms</span>
                        </Link>
                        <Link to="/privacy" className="footer-nav-btn">
                            <i className="fas fa-shield-alt" aria-hidden="true" />
                            <span>Privacy</span>
                        </Link>
                        <Link to="/help" className="footer-nav-btn">
                            <i className="fas fa-life-ring" aria-hidden="true" />
                            <span>Support</span>
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