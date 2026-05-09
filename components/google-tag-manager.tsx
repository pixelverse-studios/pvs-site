'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

import {
  TRACKING_EXCLUDED_ROUTE_PREFIXES,
  isTrackingExcludedRoute,
} from '@/lib/tracking-config';

interface GoogleTagManagerProps {
  containerId: string;
}

export function GoogleTagManager({ containerId }: GoogleTagManagerProps) {
  const pathname = usePathname();

  if (isTrackingExcludedRoute(pathname)) {
    return null;
  }

  const source = `https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(containerId)}`;
  const excludedPrefixes = JSON.stringify([...TRACKING_EXCLUDED_ROUTE_PREFIXES]);
  const serializedContainerId = JSON.stringify(containerId);

  return (
    <>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          (function(w,l,excludedPrefixes){
            w[l]=w[l]||[];

            function isExcludedPath(pathname){
              return excludedPrefixes.some(function(prefix){
                return pathname.indexOf(prefix) === 0;
              });
            }

            function getPathFromUrl(url){
              try {
                return new URL(url, w.location.href).pathname;
              } catch(e) {
                return w.location.pathname;
              }
            }

            function pushConsentForPath(pathname, mode){
              var denied = isExcludedPath(pathname);
              w[l].push(['consent', mode, {
                analytics_storage: denied ? 'denied' : 'granted',
                ad_storage: denied ? 'denied' : 'granted',
                ad_user_data: denied ? 'denied' : 'granted',
                ad_personalization: denied ? 'denied' : 'granted'
              }]);

              if (denied) return;

              w[l].push({
                event: 'pvs_tracking_consent_update',
                pvs_tracking_allowed: !denied,
                page_path: pathname
              });
            }

            w.gtag = w.gtag || function(){w[l].push(arguments);};
            pushConsentForPath(w.location.pathname, 'default');

            if (w.history && !w.history.__pvsGtmConsentGuard) {
              var originalPushState = w.history.pushState;
              var originalReplaceState = w.history.replaceState;

              w.history.pushState = function(state, title, url){
                if (url) pushConsentForPath(getPathFromUrl(url), 'update');
                return originalPushState.apply(this, arguments);
              };

              w.history.replaceState = function(state, title, url){
                if (url) pushConsentForPath(getPathFromUrl(url), 'update');
                return originalReplaceState.apply(this, arguments);
              };

              w.addEventListener('popstate', function(){
                pushConsentForPath(w.location.pathname, 'update');
              });

              w.history.__pvsGtmConsentGuard = true;
            }
          })(window,'dataLayer',${excludedPrefixes});

          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer',${serializedContainerId});
        `}
      </Script>
      <noscript>
        <iframe
          title="Google Tag Manager"
          src={source}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}
