function NotFoundPage(): JSX.Element {
  return (
    <div className="page">
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <a className="header__logo-link" href="main.html">
                <img
                  className="header__logo"
                  src="img/logo.svg"
                  alt="6 cities logo"
                  width="81"
                  height="41"
                />
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="page__main page__main--index">
        <div className="container">
          <section className="not-found">
            <h1 className="not-found__title">404</h1>
            <h2 className="not-found__subtitle">Page Not Found</h2>
            <p className="not-found__text">
              The page you are looking for does not exist.
            </p>
            <a className="not-found__link" href="main.html">
              Go to main page
            </a>
          </section>
        </div>
      </main>
    </div>
  );
}

export default NotFoundPage;
