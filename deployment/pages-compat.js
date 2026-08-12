(function () {
  const basePath = '/adxchange';

  function routePath() {
    const hash = window.location.hash || '#/';
    const raw = hash.startsWith('#') ? hash.slice(1) : hash;
    return (raw.split('?')[0] || '/').replace(/\/+$/, '') || '/';
  }

  function pagesPage() {
    const p = routePath();
    const map = {
      '/': home,
      '/advertisers': advertisers,
      '/publishers': publishers,
      '/login': login,
      '/register': register,
      '/forgot-password': forgot,
      '/app/advertiser/dashboard': advertiserDashboard,
      '/app/advertiser/campaigns': campaignList,
      '/app/advertiser/campaigns/new': campaignNew,
      '/app/advertiser/reports': reports,
      '/earner/onboarding': publisherOnboarding,
      '/earner/dashboard': publisherDashboard,
      '/earner/screens': screens,
      '/earner/content': contentPage,
      '/earner/earnings': earnings,
      '/ops/dashboard': ops
    };
    if (map[p]) return map[p]();
    if (p === '/app/advertiser/billing') return generic('Billing', 'advertiser');
    if (p === '/earner/venues') return generic('Venues', 'publisher');
    if (p === '/earner/payouts') return generic('Payouts', 'publisher');
    if (p === '/ops/campaigns') return generic('Campaigns');
    if (p === '/ops/venues') return generic('Venues');
    if (p === '/ops/screens') return generic('Screens');
    if (p === '/ops/playbacks') return generic('Playbacks');
    if (p === '/ops/reconciliation') return generic('Reconciliation');
    return notfound();
  }

  const deepPath = window.location.pathname.startsWith(basePath)
    ? window.location.pathname.slice(basePath.length)
    : '/';
  if (!window.location.hash && deepPath && deepPath !== '/') {
    history.replaceState({}, '', basePath + '/#' + deepPath);
  }

  page = pagesPage;

  document.addEventListener('click', function (event) {
    const anchor = event.target.closest && event.target.closest('a[data-nav]');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href || !href.startsWith('/')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.hash = '#' + href;
  }, true);

  window.addEventListener('hashchange', function () {
    render();
  });

  if (!window.location.hash) history.replaceState({}, '', basePath + '/#/');
  render();
})();
