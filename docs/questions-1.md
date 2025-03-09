Okay I am new to solid in general. And I am new to solid start, (the solid ssr meta framework)

And yet newere still, I am new to using tanstack router with solid start. SSR support for tanstack router in solid js was just merged 6 days ago and there arent many docs for it.

I am trying to understand the best way to implement dark mode in the shadcn-solid way.
Here are those docs: @https://shadcn-solid.com/docs/dark-mode

Thos docs are not using tanstack router for solid, it is using the solid start router.

I can see in my root route @\_\_root.tsx There is a suspense

There is also a suspense in the solid start root router. Here are the docs on that @https://docs.solidjs.com/solid-start/building-your-application/routing

Creating new routes
SolidStart uses file based routing which is a way of defining your routes by creating files and folders in your project. This includes your pages and API routes.

SolidStart traverses your routes directory, collects all of the routes, and then makes them accessible using the <FileRoutes />. This component will only include your UI routes, and not your API routes. Rather than manually defining each Route inside a Router component, <FileRoutes /> will generate the routes for you based on the file system.

Because <FileRoutes /> returns a routing config object, you can use it with the router of your choice. In this example we use solid-router:

import { Suspense } from "solid-js";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";

export default function App() {
return (
<Router root={(props) => <Suspense>{props.children}</Suspense>}>
<FileRoutes />
</Router>
);
}
The <Router /> component expects a root prop which functions as the root layout of your entire app. You will want to make sure props.children is wrapped in <Suspense /> because each component will be lazy loaded automatically for you. Without this you may see some unexpected hydration errors.

<FileRoutes /> will generate a route for each file in the routes directory and its subdirectories. For a route to be rendered as a page, it must default export a component. This component represents the content that will be rendered when users visit the page:

export default function Index() {
return <div>Welcome to my site!</div>;
}
This means that all you have to do is create a file in your routes folder and SolidStart takes care of everything else needed to make that route available to visit in your application!

Those docs justify the suspense by saying: because each component will be lazy loaded automatically for you. Without this you may see some unexpected hydration errors.

Which to me kinda reads:
_waves arms in the air_
without it there are errors.

I want know more about why its there and the implications of putting code within the suspense vs out of the suspense.

For example what would happen if the NavBar were within the suspense?

In regards to the dark mode docs for shadcn solid, should the ColorModeScript go in or outside the suspense? Why are why not? How does import { MetaProvider } from "@solidjs/meta"; relate? Where should it go and why?

So many questions
