When I actually have the site deployed, if I refresh or navigate to the about page and back to the index page, I get an error:

meta name="apple-mobile-web-app-capable" content="yes"> is deprecated. Please include <meta name="mobile-web-app-capable" content="yes">

client-m-3-jTO3.js:2 Uncaught (in promise) RangeError: Maximum call stack size exceeded
at $r.setState (client-m-3-jTO3.js:2:45233)
at client-m-3-jTO3.js:4:25161
at Qa.e.isServer.e.startTransition (client-m-3-jTO3.js:4:8304)
at client-m-3-jTO3.js:4:23946
at new Promise (<anonymous>)
at ac.load (client-m-3-jTO3.js:4:23925)
at ac.commitLocation (client-m-3-jTO3.js:4:22478)
at ac.buildAndCommitLocation (client-m-3-jTO3.js:4:23463)
at navigate (client-m-3-jTO3.js:4:23785)
at client-m-3-jTO3.js:2:48759

client-m-3-jTO3.js:4 Uncaught (in promise) RangeError: Maximum call stack size exceeded
at ac.parseLocation (client-m-3-jTO3.js:4:17457)
at ac.load (client-m-3-jTO3.js:4:23874)
at ac.commitLocation (client-m-3-jTO3.js:4:22478)
at ac.buildAndCommitLocation (client-m-3-jTO3.js:4:23463)
at navigate (client-m-3-jTO3.js:4:23785)
at client-m-3-jTO3.js:2:48759
at Object.s [as onGenerate] (index-enXPtrKf.js:1:38282)
at ve (index-enXPtrKf.js:1:27662)
at Object.fn (index-enXPtrKf.js:1:26848)
at ai (client-m-3-jTO3.js:2:5011)
client-m-3-jTO3.js:2 Uncaught (in promise) RangeError: Maximum call stack size exceeded
at ai (client-m-3-jTO3.js:2:5011)
at Ut (client-m-3-jTO3.js:2:4938)
at Nn (client-m-3-jTO3.js:2:5752)
at li (client-m-3-jTO3.js:2:6191)
at client-m-3-jTO3.js:2:6052
at Qe (client-m-3-jTO3.js:2:5912)
at ci (client-m-3-jTO3.js:2:6045)
at Qe (client-m-3-jTO3.js:2:5923)
at ci (client-m-3-jTO3.js:2:6045)
at Qe (client-m-3-jTO3.js:2:5923)

I am not even sure where to put console logs to understand this better

Please help me think of ways to diagnose aand fix this.

I do not see the issue in development

tree -h -I "node_modules|.git|dist|.cache|docs" | cat
[4.0K] .
├── [1.4K] CLAUDE.md
├── [1.0K] LICENSE
├── [2.1K] README.md
├── [ 662] app.config.ts
├── [ 299] components.json
├── [ 834] eslint.config.js
├── [ 212] justfile
├── [1.7K] package.json
├── [257K] pnpm-lock.yaml
├── [ 356] prettier.config.js
├── [4.0K] public
│ ├── [ 664] favicon.ico
│ ├── [ 697] header.svg
│ ├── [ 919] og-image.svg
│ ├── [ 132] robots.txt
│ └── [ 434] sitemap.xml
├── [4.0K] src
│ ├── [1.6K] app.css
│ ├── [ 193] app.tsx
│ ├── [4.0K] components
│ │ ├── [ 113] devtools.tsx
│ │ ├── [5.7K] explain-header.tsx
│ │ ├── [ 33K] generate-form.tsx
│ │ ├── [2.0K] nav-bar.tsx
│ │ ├── [1.8K] theme-switch.tsx
│ │ ├── [3.2K] time-input.tsx
│ │ └── [4.0K] ui
│ │ ├── [2.1K] alert.tsx
│ │ ├── [2.1K] button.tsx
│ │ ├── [1.5K] card.tsx
│ │ ├── [2.1K] checkbox.tsx
│ │ ├── [ 10K] scroll-area.tsx
│ │ ├── [ 912] separator.tsx
│ │ ├── [2.2K] switch.tsx
│ │ ├── [4.3K] tabs.tsx
│ │ ├── [3.5K] textfield.tsx
│ │ └── [1.3K] tooltip.tsx
│ ├── [ 214] entry-client.tsx
│ ├── [3.8K] entry-server.tsx
│ ├── [ 45] global.d.ts
│ ├── [4.0K] lib
│ │ ├── [9.9K] cache-control.ts
│ │ └── [2.9K] utils.ts
│ ├── [2.9K] routeTree.gen.ts
│ ├── [ 591] router.tsx
│ └── [4.0K] routes
│ ├── [ 710] $404.tsx
│ ├── [ 851] \_\_root.tsx
│ ├── [5.3K] about.tsx
│ └── [6.5K] index.tsx
├── [2.6K] tailwind.config.js
└── [ 445] tsconfig.json

6 directories, 46 files
ethan@Ethan-PC:~/cache-control-guru$

Another stack trace:

store.js:55 Uncaught (in promise) RangeError: Maximum call stack size exceeded
at Store.setState (store.js:55:10)
at router.js:1593:24
at Transitioner.router.startTransition (Transitioner.jsx:32:11)
at router.js:1467:12
at new Promise (<anonymous>)
at Router.load (router.js:1466:19)
at Router.commitLocation (router.js:1346:12)
at Router.buildAndCommitLocation (router.js:1424:17)
at Router.navigate (router.js:1448:17)
at useNavigate.jsx:20:12

solid.js:865 Uncaught (in promise) RangeError: Maximum call stack size exceeded
at runUpdates (solid.js:865:5)
at completeUpdates (solid.js:911:17)
at runUpdates (solid.js:860:5)
at completeUpdates (solid.js:911:17)
at runUpdates (solid.js:860:5)
at completeUpdates (solid.js:911:17)
at runUpdates (solid.js:860:5)
at completeUpdates (solid.js:911:17)
at runUpdates (solid.js:860:5)
at completeUpdates (solid.js:911:17)

I think this might be caused by the way I am storing the header value state: `src/routes/index.tsx`

```tsx
import { GenerateForm } from '@/components/generate-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { enhanceExplanation, parseHeader } from '@/lib/cache-control';
import { createFileRoute } from '@tanstack/solid-router';
import { fallback, zodValidator } from '@tanstack/zod-adapter';
import { Accessor, For, Show } from 'solid-js';
import { z } from 'zod';

// We're removing the mode parameter and only keeping the header parameter
const pageSearchParamSchema = z.object({
  header: fallback(z.string(), ''),
});

type PageSearchParams = z.infer<typeof pageSearchParamSchema>;

export const Route = createFileRoute('/')({
  component: RouteComponent,
  validateSearch: zodValidator(pageSearchParamSchema),
});

function RouteComponent() {
  const searchParams =
    Route.useSearch() as unknown as Accessor<PageSearchParams>;

  const header = () => searchParams().header;

  const navigate = Route.useNavigate();
  const setHeader = (value: string) => {
    void navigate({
      search: {
        header: value,
      },
    });
  };
```

I thought I followed https://tanstack.com/router/latest/docs/framework/solid/guide/search-params pretty well but the async Writing Search Params was a little weird.

Here are those docs

Writing Search Params
Now that you've learned how to read your route's search params, you'll be happy to know that you've already seen the primary APIs to modify and update them. Let's remind ourselves a bit

<Link search />
The best way to update search params is to use the search prop on the <Link /> component.

If the search for the current page shall be updated and the from prop is specified, the to prop can be omitted.
Here's an example:

tsx

// /routes/shop.products.tsx
export const Route = createFileRoute('/shop/products')({
validateSearch: productSearchSchema,
})

const ProductList = () => {
return (
<div>
<Link
from={allProductsRoute.fullPath}
search={(prev) => ({ page: prev.page + 1 })} >
Next Page
</Link>
</div>
)
}
If you want to update the search params in a generic component that is rendered on multiple routes, specifying from can be challenging.

In this scenario you can set to="." which will give you access to loosely typed search params.
Here is an example that illustrates this:

tsx

// `page` is a search param that is defined in the \_\_root route and hence available on all routes.
const PageSelector = () => {
return (
<div>
<Link to="." search={(prev) => ({ ...prev, page: prev.page + 1 })}>
Next Page
</Link>
</div>
)
}
If the generic component is only rendered in a specific subtree of the route tree, you can specify that subtree using from. Here you can omit to='.' if you want.

tsx

// `page` is a search param that is defined in the /posts route and hence available on all of its child routes.
const PageSelector = () => {
return (
<div>
<Link
from="/posts"
to="."
search={(prev) => ({ ...prev, page: prev.page + 1 })} >
Next Page
</Link>
</div>
)
useNavigate(), navigate({ search })
The navigate function also accepts a search option that works the same way as the search prop on <Link />:

tsx

// /routes/shop.products.tsx
export const Route = createFileRoute('/shop/products/$productId')({
validateSearch: productSearchSchema,
})

const ProductList = () => {
const navigate = useNavigate({ from: Route.fullPath })

return (
<div>
<button
onClick={() => {
navigate({
search: (prev) => ({ page: prev.page + 1 }),
})
}} >
Next Page
</button>
</div>
)
}
router.navigate({ search })
The router.navigate function works exactly the same way as the useNavigate/navigate hook/function above.

<Navigate search />
The <Navigate search /> component works exactly the same way as the useNavigate/navigate hook/function above, but accepts its options as props instead of a function argument.

In all honesty, I do not know solidjs too well so it could have been my fault there. Maybe its better to store the header value in a signal, then read and write the search params in a solid js effect?

Here are some solid js docs

Signals are the cornerstone of reactivity in Solid. They contain values that change over time; when you change a signal's value, it automatically updates anything that uses it.

To create a signal, let's import createSignal from solid-js and call it from our Counter component like this:

const [count, setCount] = createSignal(0);
The argument passed to the create call is the initial value, and the return value is an array with two functions, a getter and a setter. By destructuring, we can name these functions whatever we like. In this case, we name the getter count and the setter setCount.

It is important to notice that the first returned value is a getter (a function returning the current value) and not the value itself. This is because the framework needs to keep track of where that signal is read so it can update things accordingly.

In this lesson, we'll use JavaScript's setInterval function to create a periodically incrementing counter. We can update our count signal every second by adding this code to our Counter component:

setInterval(() => setCount(count() + 1), 1000);
Each tick, we read the previous count, add 1, and set the new value.

Solid's signals also accept a function form where you can use the previous value to set the next value.

setCount(c => c + 1);
Finally, we need to read the signal in our JSX code:

return <div>Count: {count()}</div>;

Signals are trackable values, but they are only one half of the equation. To complement those are observers that can be updated by those trackable values. An effect is one such observer; it runs a side effect that depends on signals.

An effect can be created by importing createEffect from solid-js and providing it a function. The effect automatically subscribes to any signal that is read during the function's execution and reruns when any of them change.

So let's create an Effect that reruns whenever count changes:

createEffect(() => {
console.log("The count is now", count());
});
To update our count Signal, we'll attach a click handler on our button:

<button onClick={() => setCount(count() + 1)}>Click Me</button>
Now clicking the button writes to the console. This is a relatively simple example, but to understand how Solid works, you should imagine that every expression in JSX is its own effect that re-executes whenever its dependent signals change. This is how all rendering works in Solid: from Solid's perspective, all rendering is just a side effect of the reactive system.

Effects that developers create with createEffect run after rendering has completed and are mostly used for scheduling updates that interact with the DOM. If you want to modify the DOM earlier, use createRenderEffect.
import { render } from 'solid-js/web';
import { createSignal, createEffect } from 'solid-js';

function Counter() {
const [count, setCount] = createSignal(0);
createEffect(() => {
console.log("The count is now", count());
});

return <button onClick={() => setCount(count() + 1)}>Click Me</button>;
}

render(() => <Counter />, document.getElementById('app'));

We've seen that whenever we access a signal in JSX, it will automatically update the view when that signal changes. But the component function itself only executes once.

We can create new expressions that depend on signals by wrapping a signal in a function. A function that accesses a signal is effectively also a signal: when its wrapped signal changes it will in turn update its readers.

Let's update our Counter to count by 2 by introducing a doubleCount function:

const doubleCount = () => count() \* 2;
We can then call doubleCount just like a signal in our JSX:

return <div>Count: {doubleCount()}</div>;
We call functions like these derived signals because they gain their reactivity from the signal they access. They don't themselves store a value (if you create a derived signal but never call it, it will be stripped from Solid's output like any unused function) but they'll update any effects that depend on them, and they'll trigger a rerender if included in a view.

import { render } from "solid-js/web";
import { createSignal } from "solid-js";

function Counter() {
const [count, setCount] = createSignal(0);
const doubleCount = () => count() \* 2;

setInterval(() => setCount(count() + 1), 1000);

return <div>Count: {doubleCount()}</div>;
}

render(() => <Counter />, document.getElementById('app'));

Most of the time, composing derived signals is sufficient. However, it is sometimes beneficial to cache values in order to reduce duplicated work. We can use memos to evaluate a function and store the result until its dependencies change. This is great for caching calculations for effects that have other dependencies and mitigating the work required for expensive operations like DOM node creation.

Memos are both an observer, like an effect, and a read-only signal. Since they are aware of both their dependencies and their observers, they can ensure that they run only once for any change. This makes them preferable to registering effects that write to signals. Generally, what can be derived, should be derived.

Creating a Memo is as simple as passing a function to createMemo, imported from solid-js. In the example, recalculating the value gets increasingly more expensive with each click. If we wrap it in createMemo, it recalculates only once per click:

const fib = createMemo(() => fibonacci(count()));
Place a console.log inside the fib function to confirm how often it runs:

const fib = createMemo(() => {
console.log("Calculating Fibonacci");
return fibonacci(count());
});

import { render } from 'solid-js/web';
import { createSignal, createMemo } from 'solid-js';

function fibonacci(num) {
if (num <= 1) return 1;

return fibonacci(num - 1) + fibonacci(num - 2);
}

function Counter() {
const [count, setCount] = createSignal(10);
const fib = () => fibonacci(count());

return (
<>
<button onClick={() => setCount(count() + 1)}>Count: {count()}</button>
<div>1. {fib()} {fib()} {fib()} {fib()} {fib()}</div>
<div>2. {fib()} {fib()} {fib()} {fib()} {fib()}</div>
<div>3. {fib()} {fib()} {fib()} {fib()} {fib()}</div>
<div>4. {fib()} {fib()} {fib()} {fib()} {fib()}</div>
<div>5. {fib()} {fib()} {fib()} {fib()} {fib()}</div>
<div>6. {fib()} {fib()} {fib()} {fib()} {fib()}</div>
<div>7. {fib()} {fib()} {fib()} {fib()} {fib()}</div>
<div>8. {fib()} {fib()} {fib()} {fib()} {fib()}</div>
<div>9. {fib()} {fib()} {fib()} {fib()} {fib()}</div>
<div>10. {fib()} {fib()} {fib()} {fib()} {fib()}</div>
</>
);
}

render(() => <Counter />, document.getElementById('app'))

There are only a few Lifecycle functions in Solid as everything lives and dies by the reactive system. The reactive system is created and updates synchronously, so the only scheduling comes down to Effects which are pushed to the end of the update.

We've found that developers doing basic tasks don't often think this way, so to make things a little easier we've made an alias, onMount. onMount is just a createEffect call that is non-tracking, which means it never re-runs. It is just an Effect call but you can use it with confidence that it will run only once for your component, once all initial rendering is done.

Let's use the onMount hook to fetch some photos:

onMount(async () => {
const res = await fetch(`https://jsonplaceholder.typicode.com/photos?_limit=20`);
setPhotos(await res.json());
});
Lifecycles are only run in the browser, so putting code in onMount has the benefit of not running on the server during SSR. Even though we are doing data fetching in this example, usually we use Solid's resources for true server/browser coordination.

import { render } from "solid-js/web";
import { createSignal, onMount, For } from "solid-js";
import "./styles.css";

function App() {
const [photos, setPhotos] = createSignal([]);

onMount(async () => {
const res = await fetch(`https://jsonplaceholder.typicode.com/photos?_limit=20`);
setPhotos(await res.json());
});

return <>
<h1>Photo album</h1>

    <div class="photos">
      <For each={photos()} fallback={<p>Loading...</p>}>{ photo =>
        <figure>
          <img src={photo.thumbnailUrl} alt={photo.title} />
          <figcaption>{photo.title}</figcaption>
        </figure>
      }</For>
    </div>

</>;
}

render(() => <App />, document.getElementById('app'));

Some frameworks pair their cleanup methods as return values of their side effects or lifecycle methods. Since everything in a Solid render tree is living inside a (possibly inert) Effect and can be nested, we made onCleanup a first-class method. You can call it at any scope and it will run when that scope is triggered to re-evaluate and when it is finally disposed.

Use it in your components or in your Effects. Use it in your custom directives. Use it pretty much anywhere that is part of the synchronous execution of the reactive system.

The Signal example from the introduction never cleaned up after itself. Let's fix that by replacing the setInterval call with this:

const timer = setInterval(() => setCount(count() + 1), 1000);
onCleanup(() => clearInterval(timer));

import { render } from "solid-js/web";
import { createSignal, onCleanup } from "solid-js";

function Counter() {
const [count, setCount] = createSignal(0);

const timer = setInterval(() => setCount(count() + 1), 1000);
onCleanup(() => clearInterval(timer));

return <div>Count: {count()}</div>;
}

render(() => <Counter />, document.getElementById('app'));

Props are what we call the object that is passed to our component function on execution that represents all the attributes bound to its JSX. Props objects are readonly and have reactive properties which are wrapped in Object getters. This allows them to have a consistent form regardless of whether the caller used signals, signal expressions, or static values. You access them by props.propName.

For this reason it is also very important to not just destructure props objects, as that would lose reactivity if not done within a tracking scope. In general accessing properties on the props object outside of Solid's primitives or JSX can lose reactivity. This applies not just to destructuring, but also to spreads and functions like Object.assign.

Solid has a few utilities to help us when working with props. The first is mergeProps, which merges potentially reactive objects together (like a nondestructive Object.assign) without losing reactivity. The most common case is when setting default props for our components.

In the example, in greetings.tsx, we inlined the defaults in the template, but we could also use mergeProps to keep reactive updates even when setting defaults:

const merged = mergeProps({ greeting: "Hi", name: "John" }, props);

return <h3>{merged.greeting} {merged.name}</h3>

One of the reasons for fine-grained reactivity in Solid is that it can handle nested updates independently. You can have a list of users and when we update one name we only update a single location in the DOM without diffing the list itself. Very few (even reactive) UI frameworks can do this.

But how do we accomplish this? In the example we have a list of todos in a signal. In order to mark a todo as complete, we would need to replace the todo with a clone. This is how most frameworks work, but it's wasteful as we rerun the list diffing and we recreate the DOM elements as illustrated in the console.log.

const toggleTodo = (id) => {
setTodos(
todos().map((todo) => (todo.id !== id ? todo : { ...todo, completed: !todo.completed })),
);
};
Instead, in a fine-grained library like Solid, we initialize the data with nested Signals like this:

const addTodo = (text) => {
const [completed, setCompleted] = createSignal(false);
setTodos([...todos(), { id: ++todoId, text, completed, setCompleted }]);
};
Now we can update the completion state by calling setCompleted without any additional diffing. This is because we've moved the complexity to the data rather than the view. And we know exactly how the data changes.

const toggleTodo = (id) => {
const todo = todos().find((t) => t.id === id);
if (todo) todo.setCompleted(!todo.completed())
}
If you change the remaining references of todo.completed to todo.completed(), the example should now only run the console.log on creation and not when you toggle a todo.

This of course requires some manual mapping and it was the only choice available to us in the past. But now, thanks to proxies, we can do most of this work in the background without manual intervention. Continue to the next tutorials to see how.

import { render } from "solid-js/web";
import { For, createSignal } from "solid-js";

const App = () => {
const [todos, setTodos] = createSignal([])
let input;
let todoId = 0;

const addTodo = (text) => {
const [completed, setCompleted] = createSignal(false);
setTodos([...todos(), { id: ++todoId, text, completed, setCompleted }]);
}
const toggleTodo = (id) => {
const todo = todos().find((t) => t.id === id);
if (todo) todo.setCompleted(!todo.completed())
}

return (
<>
<div>
<input ref={input} />
<button
onClick={(e) => {
if (!input.value.trim()) return;
addTodo(input.value);
input.value = "";
}} >
Add Todo
</button>
</div>
<For each={todos()}>
{(todo) => {
const { id, text } = todo;
console.log(`Creating ${text}`)
return <div>
<input
type="checkbox"
checked={todo.completed()}
onchange={[toggleTodo, id]}
/>
<span
style={{ "text-decoration": todo.completed() ? "line-through" : "none"}} >{text}</span>
</div>
}}
</For>
</>
);
};

render(App, document.getElementById("app"));

Stores are Solid's answer to nested reactivity. They are proxy objects whose properties can be tracked and can contain other objects which automatically become wrapped in proxies themselves, and so on.

To keep things light, Solid creates underlying Signals only for properties that are accessed under tracking scopes. And so, all Signals in Stores are created lazily as requested.

The createStore call takes the initial value and returns a read/write tuple similar to Signals. The first element is the store proxy which is readonly, and the second is a setter function.

The setter function in its most basic form takes an object whose properties will be merged with the current state. It also supports path syntax so that we can do nested updates. In this way we can still maintain control of our reactivity but do pinpoint updates.

Solid's path syntax has many forms and includes some powerful syntax to do iteration and ranges. Refer to the API documentation for a full reference.

Let's look at how much easier it is to achieve nested reactivity with a Store. We can replace the initialization of our component with this:

const [todos, setTodos] = createStore([]);
const addTodo = (text) => {
setTodos([...todos, { id: ++todoId, text, completed: false }]);
};
const toggleTodo = (id) => {
setTodos(
(todo) => todo.id === id,
"completed",
(completed) => !completed
);
};
We make use of the Store's path syntax with function setters that allow us to take the previous state and return the new state on nested values.

Make sure you change the todos() reference to todos in the <For> component.

And that's it. The rest of the template will already react granularly (check the Console on clicking the checkbox).

import { render } from "solid-js/web";
import { For } from "solid-js";
import { createStore } from "solid-js/store";

const App = () => {
let input;
let todoId = 0;
const [todos, setTodos] = createStore([]);

const addTodo = (text) => {
setTodos([...todos, { id: ++todoId, text, completed: false }]);
}

const toggleTodo = (id) => {
setTodos(todo => todo.id === id, "completed", completed => !completed);
}

return (
<>
<div>
<input ref={input} />
<button
onClick={(e) => {
if (!input.value.trim()) return;
addTodo(input.value);
input.value = "";
}} >
Add Todo
</button>
</div>
<For each={todos}>
{(todo) => {
const { id, text } = todo;
console.log(`Creating ${text}`)
return <div>
<input
type="checkbox"
checked={todo.completed}
onchange={[toggleTodo, id]}
/>
<span
style={{ "text-decoration": todo.completed ? "line-through" : "none" }} >{text}</span>
</div>
}}
</For>
</>
);
};

render(App, document.getElementById("app"));

Solid's reactivity is synchronous which means, by the next line after any change, the DOM will have updated. And for the most part this is perfectly fine, as Solid's granular rendering is just a propagation of the update in the reactive system. Unrelated changes "rendering" twice don't actually mean wasted work.

What if the changes are related? Solid's batch helper allows to queue up multiple changes and then apply them all at the same time before notifying their observers.

In this example, we are assigning both names on a button click and this triggers our rendered update twice. You can see the logs in the console when you click the button. So let's wrap the set calls in a batch.

const updateNames = () => {
console.log("Button Clicked");
batch(() => {
setFirstName(firstName() + "n");
setLastName(lastName() + "!");
})
}
And that's it. Now we only notify once for the whole changeset.

import { render } from "solid-js/web";
import { createSignal, batch } from "solid-js";

const App = () => {
const [firstName, setFirstName] = createSignal("John");
const [lastName, setLastName] = createSignal("Smith");
const fullName = () => {
console.log("Running FullName");
return `${firstName()} ${lastName()}`
}
const updateNames = () => {
console.log("Button Clicked");
batch(() => {
setFirstName(firstName() + "n");
setLastName(lastName() + "!");
})
}

return <button onClick={updateNames}>My name is {fullName()}</button>
};

render(App, document.getElementById("app"));
