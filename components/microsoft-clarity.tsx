import Script from 'next/script';

import { TRACKING_EXCLUDED_ROUTE_PREFIXES } from '@/lib/tracking-config';

interface MicrosoftClarityProps {
  projectId: string;
}

/** Load Clarity on public routes and stop a recording before dashboard navigation. */
export function MicrosoftClarity({ projectId }: MicrosoftClarityProps) {
  const excludedPrefixes = JSON.stringify([...TRACKING_EXCLUDED_ROUTE_PREFIXES]);
  const serializedProjectId = JSON.stringify(projectId);

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`
        (function(w,d,projectId,excludedPrefixes){
          if (w.location.hostname !== 'pixelversestudios.io' &&
              w.location.hostname !== 'www.pixelversestudios.io') return;

          var loaded = false;
          var stopped = false;

          function excluded(pathname){
            return excludedPrefixes.some(function(prefix){
              return pathname.indexOf(prefix) === 0;
            });
          }

          function pathnameFor(url){
            try { return new URL(url, w.location.href).pathname; }
            catch(e) { return w.location.pathname; }
          }

          function load(){
            if (loaded) return;
            loaded = true;
            w.clarity = w.clarity || function(){ (w.clarity.q = w.clarity.q || []).push(arguments); };
            // No consent UI exists on this site. Keep both storage purposes denied.
            w.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' });
            var script = d.createElement('script');
            script.async = true;
            script.src = 'https://www.clarity.ms/tag/' + projectId;
            d.head.appendChild(script);
          }

          function applyRoute(pathname){
            if (excluded(pathname)) {
              if (loaded && !stopped) {
                w.clarity('stop');
                stopped = true;
              }
              return;
            }
            // A stopped session stays off until the next document load.
            if (!loaded) load();
          }

          var originalPushState = w.history.pushState;
          var originalReplaceState = w.history.replaceState;
          w.history.pushState = function(state,title,url){
            if (url) applyRoute(pathnameFor(url));
            return originalPushState.apply(this,arguments);
          };
          w.history.replaceState = function(state,title,url){
            if (url) applyRoute(pathnameFor(url));
            return originalReplaceState.apply(this,arguments);
          };
          w.addEventListener('popstate',function(){ applyRoute(w.location.pathname); });
          applyRoute(w.location.pathname);
        })(window,document,${serializedProjectId},${excludedPrefixes});
      `}
    </Script>
  );
}
