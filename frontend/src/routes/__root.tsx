import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
    Outlet,
    Link,
    createRootRouteWithContext,
    useRouter,
    HeadContent,
} from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles/global.css?url";
import { reportLovableError } from "../lib/lovable-error";
import Navbar from "../components/site/Navbar";
import Footer from "../components/site/Footer";
import ResourceFallback from "../components/site/ResourceFallback";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <ResourceFallback
      error={error}
      onRetry={reset}
      isFullPage={true}
    />
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "JHUB Africa — Innovation for Transformation" },
        {
          name: "description",
          content:
            "JHUB Africa is the innovation hub of JKUAT, empowering researchers, students and entrepreneurs to build technology for Africa.",
        },
        { name: "author", content: "JHUB Africa" },
        {
          property: "og:title",
          content: "JHUB Africa — Innovation for Transformation",
        },
        {
          property: "og:description",
          content:
            "The innovation hub of JKUAT, empowering Africa-first technology.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:site", content: "@Lovable" },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
      ],
    }),
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observeElements = () => {
      const elements = document.querySelectorAll(".content-section, .theme-row-item, .horizontal-event-card");
      if (elements.length === 0) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-revealed");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
      );

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 50 && rect.bottom >= 0) {
          el.classList.add("is-revealed");
        } else {
          observer.observe(el);
        }
      });

      return () => observer.disconnect();
    };

    const cleanup = observeElements();
    const timeout = setTimeout(observeElements, 120);

    return () => {
      if (cleanup) cleanup();
      clearTimeout(timeout);
    };
  }, [router.state.location.pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <HeadContent />
      <div className="app-shell">
        <Navbar />
        <main className="route-transition-wrap">
          <Outlet />
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}
