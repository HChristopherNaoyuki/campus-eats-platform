import { Link } from "react-router-dom";
import { useCampus } from "@/store/campusStore";

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

    const featured = vendors.find((vendor) => menu.some((item) => item.vendorId === vendor.id));
    const featuredMenu = featured
        ? menu.filter((item) => item.vendorId === featured.id).slice(0, 4)
        : [];

    const steps =
    [
        { number: "1", title: "Browse & order", text: "Pick items from any campus vendor and confirm your order." },
        { number: "2", title: "Vendor prepares", text: "Track status as it moves from Pending → Preparing → Completed." },
        { number: "3", title: "Pick it up", text: "Walk over to the vendor's stall and grab your bag. Done." },
    ];

    const features =
    [
        { icon: "fa-users", title: "User Management", text: "Register & sign in as Student, Vendor, or Admin." },
        { icon: "fa-store", title: "Vendor Management", text: "Onboard campus vendors with location & contact." },
        { icon: "fa-utensils", title: "Menu Management", text: "Add, update, and remove menu items per vendor." },
        { icon: "fa-clipboard-list", title: "Order Management", text: "Place orders and track Pending → Preparing → Completed." },
    ];

    return (
        <>
            <section id="home" className="hero">
                <div className="container">
                    <h1>Skip the line.<br /><span>Pick up on campus.</span></h1>
                    <p>
                        Campus Eats is the on-campus pickup network. Order ahead from your favorite campus vendor,
                        then grab it on the way to class. No delivery fee, no waiting.
                    </p>
                    <div className="hero-buttons">
                        <Link to="/signup" className="btn btn-ce-primary btn-primary">Order now</Link>
                        <a href="#how-it-works" className="btn btn-outline">Learn more</a>
                    </div>
                </div>
            </section>

            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <div>
                            <div className="stat-number">{vendors.length.toLocaleString()}</div>
                            <div className="stat-label">Campus Vendors</div>
                        </div>
                        <div>
                            <div className="stat-number">{menu.length.toLocaleString()}</div>
                            <div className="stat-label">Menu Items</div>
                        </div>
                        <div>
                            <div className="stat-number">&lt;5 min</div>
                            <div className="stat-label">Avg Pickup</div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="how-it-works">
                <div className="container">
                    <div className="section-title">
                        <h2>Pickup in three steps</h2>
                        <p>Designed around the campus rhythm — between lectures, before practice, after the library.</p>
                    </div>
                    <div className="steps">
                        {steps.map((step) => (
                            <div className="step" key={step.number}>
                                <div className="step-number">{step.number}</div>
                                <h3>{step.title}</h3>
                                <p>{step.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="features">
                <div className="container">
                    <div className="section-title">
                        <h2>Everything the system manages</h2>
                        <p>Four core modules, exactly as defined in the process spec.</p>
                    </div>
                    <div className="features-grid">
                        {features.map((feature) => (
                            <div className="feature-card" key={feature.title}>
                                <div className="feature-icon"><i className={`fas ${feature.icon}`} aria-hidden="true" /></div>
                                <h3>{feature.title}</h3>
                                <p>{feature.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="vendors" className="vendors">
                <div className="container">
                    <div className="section-title">
                        <h2>Featured Vendor</h2>
                        <p>Discover our latest campus vendor. Sign up to see all available options.</p>
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
                                        <h4>Popular Items</h4>
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
                                        Sign up or log in to view all vendors and place orders.
                                    </p>
                                    <div className="featured-vendor-actions">
                                        <Link to="/signup" className="btn btn-ce-primary btn-primary">Sign Up to Order</Link>
                                        <Link to="/login" className="btn btn-outline">Log In</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <i className="fas fa-store-slash" aria-hidden="true" />
                            <h3>No Vendors Available</h3>
                            <p>No vendors are currently available. Please check back later.</p>
                            <Link to="/signup" className="btn btn-ce-primary btn-primary">Sign Up</Link>
                        </div>
                    )}
                </div>
            </section>

            <section className="cta vendor-cta">
                <div className="container">
                    <h2>Run a stall on campus?</h2>
                    <p>
                        List your menu, take pickup orders, and fulfill them with a simple status workflow.
                        Reports for sales, vendor performance, and user activity included.
                    </p>
                    <ul>
                        <li><i className="fas fa-check-circle" aria-hidden="true" /> Per-vendor menu CRUD</li>
                        <li><i className="fas fa-check-circle" aria-hidden="true" /> Live order queue</li>
                        <li><i className="fas fa-check-circle" aria-hidden="true" /> Sales &amp; performance reports</li>
                    </ul>
                    <Link to="/signup" className="btn btn-secondary">Become a vendor</Link>
                </div>
            </section>
        </>
    );
}
