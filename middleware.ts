import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// public routes in our case '/'
const isPublicRoute = createRouteMatcher(['/']);
const isProtectedRoute = createRouteMatcher([
  '/Chat(.*)',
  '/Scheduler(.*)',
  '/Profile(.*)',
]);


export default clerkMiddleware(async (auth, req) => {
  if (!isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};