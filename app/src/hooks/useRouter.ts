import { useState, useCallback, useEffect } from 'react';
import type { Route, RouterState } from '@/types';

// Parse le hash de l'URL pour extraire la route et les paramètres
function parseHash(): { route: Route; params?: RouterState['params'] } {
  const hash = window.location.hash;
  
  if (!hash || hash === '#/' || hash === '#') {
    return { route: 'home' };
  }
  
  // Enlever le # au début
  const path = hash.slice(1);
  const [pathname, search] = path.split('?');
  const params = search ? Object.fromEntries(new URLSearchParams(search)) : undefined;
  
  // Parser le pathname pour déterminer la route
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments.length === 0) {
    return { route: 'home' };
  }
  
  const routeName = segments[0];
  
  switch (routeName) {
    case 'courses':
      return { route: 'courses' };
    case 'problems':
      return { route: 'problems' };
    case 'formulas':
      return { route: 'formulas', params: { highlightFormula: params?.highlight } };
    case 'library':
      return { route: 'library' };
    case 'ide':
      return { route: 'ide', params: { code: params?.code, language: params?.lang } };
    case 'subjects':
      return { route: 'subjects' };
    case 'periodic-table':
      return { route: 'periodic-table' };
    case 'admin':
      return { route: 'admin' };
    case 'article':
      if (segments.length >= 3) {
        const articleType = segments[1] === 'problem' ? 'problem' : 'course';
        return { 
          route: 'article', 
          params: { type: articleType, id: segments[2] } 
        };
      }
      return { route: 'home' };
    default:
      return { route: 'home' };
  }
}

// Met à jour le hash quand la route change
function updateHash(route: Route, params?: RouterState['params']) {
  let hash = `#/${route}`;
  
  if (params) {
    if (route === 'article' && params.type && params.id) {
      hash = `#/article/${params.type}/${params.id}`;
    } else if (route === 'formulas' && params.highlightFormula) {
      hash = `#/formulas?highlight=${params.highlightFormula}`;
    } else if (route === 'ide' && (params.code || params.language)) {
      const searchParams = new URLSearchParams();
      if (params.code) searchParams.set('code', params.code);
      if (params.language) searchParams.set('lang', params.language);
      hash = `#/ide?${searchParams.toString()}`;
    }
  }
  
  // Ne met à jour que si différent pour éviter les boucles
  if (window.location.hash !== hash) {
    window.location.hash = hash;
  }
}

export function useRouter() {
  // Initialiser avec le hash actuel ou home par défaut
  const initialRoute = parseHash();
  const [state, setState] = useState<RouterState>({ 
    route: initialRoute.route, 
    params: initialRoute.params 
  });

  const router = useCallback((route: Route, params?: RouterState['params']) => {
    setState({ route, params });
    updateHash(route, params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goBack = useCallback(() => {
    setState({ route: 'home' });
    window.location.hash = '#/home';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Écouter les changements de hash (bouton retour du navigateur)
  useEffect(() => {
    const handleHashChange = () => {
      const newRoute = parseHash();
      setState({ route: newRoute.route, params: newRoute.params });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return { state, router, goBack };
}
