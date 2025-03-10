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

https://docs.solidjs.com/concepts/stores

Concepts
Stores
Similar to signals, stores are a state management primitive. However, while signals manage a single piece of state, stores create a centralized location to reduce code redundancy. Within Solid, these stores can spawn a collection of reactive signals, each corresponding to a particular property which can be useful when working with complex state.

Creating a store
Stores can manage many data types, including: objects, arrays, strings, and numbers.

Using JavaScript's proxy mechanism, reactivity extends beyond just the top-level objects or arrays. With stores, you can now target nested properties and elements within these structures to create a dynamic tree of reactive data.

import { createStore } from "solid-js/store"

// Initialize store
const [store, setStore] = createStore({
userCount: 3,
users: [
{
id: 0,
username: "felix909",
location: "England",
loggedIn: false,
},
{
id: 1,
username: "tracy634",
location: "Canada",
loggedIn: true,
},
{
id: 2,
username: "johny123",
location: "India",
loggedIn: true,
},
],
})
Accessing store values
Store properties can be accessed directly from the state proxy through directly referencing the targeted property:

console.log(store.userCount) // Outputs: 3
Accessing stores within a tracking scope follows a similar pattern to signals. While signals are created using the createSignal function and require calling the signal function to access their values, store values can be directly accessed without a function call. This provides access to the store's value directly within a tracking scope:

const App = () => {
const [mySignal, setMySignal] = createSignal("This is a signal.")
const [store, setStore] = createStore({
userCount: 3,
users: [
{
id: 0,
username: "felix909",
location: "England",
loggedIn: false,
},
{
id: 1,
username: "tracy634",
location: "Canada",
loggedIn: true,
},
{
id: 2,
username: "johny123",
location: "India",
loggedIn: true,
},
],
})
return (

<div>
<h1>Hello, {store.users[0].username}</h1> {/_ Accessing a store value _/}
<span>{mySignal()}</span> {/_ Accessing a signal _/}
</div>
)
}
When a store is created, it starts with the initial state but does not immediately set up signals to track changes. These signals are created lazily, meaning they are only formed when accessed within a reactive context.

Once data is used within a reactive context, such as within the return statement of a component function, computed property, or an effect, a signal is created and dependencies are established.

For example, if you wanted to print out every new user, adding the console log below will not work because it is not within a tracked scope.

const App = () => {
const [store, setStore] = createStore({
userCount: 3,
users: [ ... ],
})

const addUser = () => { ... }

console.log(store.users.at(-1)) // This won't work

return (

<div>
<h1>Hello, {store.users[0].username}</h1>
<p>User count: {store.userCount}</p>
<button onClick={addUser}>Add user</button>
</div>
)
}
Rather, this would need to be in a tracking scope, like inside a createEffect, so that a dependency is established.

const App = () => {
const [store, setStore] = createStore({
userCount: 3,
users: [ ... ],
})

const addUser = () => { ... }

console.log(store.users.at(-1))
createEffect(() => {
console.log(store.users.at(-1))
})

return (

<div>
<h1>Hello, {store.users[0].username}</h1>
<p>User count: {store.userCount}</p>
<button onClick={addUser}>Add user</button>
</div>
)
}
Modifying store values
Updating values within a store is best accomplished using a setter provided by the createStore initialization. This setter allows for the modification of a specific key and its associated value, following the format setStore(key, newValue):

const [store, setStore] = createStore({
userCount: 3,
users: [ ... ],
})

setStore("users", (currentUsers) => [
...currentUsers,
{
id: 3,
username: "michael584",
location: "Nigeria",
loggedIn: false,
},
])
The value of userCount could also be automatically updated whenever a new user is added to keep it synced with the users array:

const App = () => {
const [store, setStore] = createStore({
userCount: 3,
users: [ ... ],
})

const addUser = () => { ... }

createEffect(() => {
console.log(store.users.at(-1))
setStore("userCount", store.users.length)
})

return (

<div>
<h1>Hello, {store.users[0].username}</h1>
<p>User count: {store.userCount}</p>
<button onClick={addUser}>Add user</button>
</div>
)
}
info
Separating the read and write capabilities of a store provides a valuable debugging advantage.

This separation facilitates the tracking and control of the components that are accessing or changing the values.

advanced
A little hidden feature of stores is that you can also create nested stores to help with setting nested properties.

const [store, setStore] = createStore({
userCount: 3,
users: [ ... ],
})

const [users, setUsers] = createStore(store.users)

setUsers((currentUsers) => [
...currentUsers,
{
id: 3,
username: "michael584",
location: "Nigeria",
loggedIn: false,
},
])
Changes made through setUsers will update the store.users property and reading users from this derived store will also be in sync with the values from store.users.

Note that the above relies on store.users to be set already in the existing store.

Path syntax flexibility
Modifying a store using this method is referred to as "path syntax." In this approach, the initial arguments are used to specify the keys that lead to the target value you want to modify, while the last argument provides the new value.

String keys are used to precisely target particular values with path syntax. By specifying these exact key names, you can directly retrieve the targeted information. However, path syntax goes beyond string keys and offers more versatility when accessing targeted values.

Instead of employing the use of just string keys, there is the option of using an array of keys. This method grants you the ability to select multiple properties within the store, facilitating access to nested structures. Alternatively, you can use filtering functions to access keys based on dynamic conditions or specific rules.

Open in Eraser
The flexibility in path syntax makes for efficient navigation, retrieval, and modification of data in your store, regardless of the store's complexity or the requirement for dynamic access scenarios within your application.

Modifying values in arrays
Path syntax provides a convenient way to modify arrays, making it easier to access and update their elements. Instead of relying on discovering individual indices, path syntax introduces several powerful techniques for array manipulation.

Appending new values
To append a new element to an array within a store, you specify the target array and set the index to the desired position. For example, if you wanted to append the new element to the end of the array, you would set the index to array.length:

setStore("users", (otherUsers) => [
...otherUsers,
{
id: 3,
username: "michael584",
location: "Nigeria",
loggedIn: false,
},
])

// can become

setStore("users", store.users.length, {
id: 3,
username: "michael584",
location: "Nigeria",
loggedIn: false,
})
Modifying multiple elements
With path syntax, you can target a subset of elements of an array, or properties of an object, by specifying an array or range of indices.

The most general form is to specify an array of values. For example, if store.users is an array of objects, you can set the loggedIn property of several indices at once like so:

setStore("users", [2, 7, 10], "loggedIn", false)
// equivalent to (but more efficient than):
setStore("users", 2, "loggedIn", false)
setStore("users", 7, "loggedIn", false)
setStore("users", 10, "loggedIn", false)
This array syntax also works for object property names. For example, if store.users is an object mapping usernames to objects, you can set the loggedIn property of several users at once like so:

setStore("users", ["me", "you"], "loggedIn", false)
// equivalent to (but more efficient than):
setStore("users", ["me"], "loggedIn", false)
setStore("users", ["you"], "loggedIn", false)
For arrays specifically, you can specify a range of indices via an object with from and to keys (both of which are inclusive). For example, assuming store.users is an array again, you can set the loggedIn state for all users except index 0 as follows:

setStore("users", { from: 1, to: store.users.length - 1 }, "loggedIn", false)
// equivalent to (but more efficient than):
for (let i = 1; i <= store.users.length - 1; i++) {
setStore("users", i, "loggedIn", false)
}
You can also include a by key in a range object to specify a step size, and thereby update a regular subset of elements. For example, you can set the loggedIn state for even-indexed users like so:

setStore("users", { from: 0, to: store.users.length - 1, by: 2 }, "loggedIn", false)
// equivalent to (but more efficient than):
for (let i = 1; i <= store.users.length - 1; i += 2) {
setStore("users", i, "loggedIn", false)
}
Multi-setter syntax differs from the "equivalent" code in one key way: a single store setter call automatically gets wrapped in a batch, so all the elements update at once before any downstream effects are triggered.

Dynamic value assignment
Path syntax also provides a way to set values within an array using functions instead of static values. These functions receive the old value as an argument, allowing you to compute the new value based on the existing one. This dynamic approach is particularly useful for complex transformations.

setStore("users", 3, "loggedIn" , (loggedIn) => !loggedIn)
Filtering values
In scenarios where you want to update elements in an array based on a specific condition, you can pass a function as an argument. This function will act as a filter, allowing you to select elements that satisfy the condition. It receives the old value and index as arguments, providing the flexibility to make conditional updates.

setStore("users", (user) => user.username.startsWith("t"), "loggedIn", false)
In addition to .startsWith, you can use other array methods like .find to filter for the values that you need.

Modifying objects
When using store setters to modify objects, if a new value is an object, it will be shallow merged with the existing value. What this refers to is that the properties of the existing object will be combined with the properties of the "new" object you are setting, updating any overlapping properties with the values from the new object.

What this means, is that you can directly make the change to the store without spreading out properties of the existing user object.

setStore("users", 0, {
id: 109,
})

// is equivalent to

setStore("users", 0, (user) => ({
...user,
id: 109,
}))
Store utilities
Store updates with produce
Rather than directly modifying a store with setters, Solid has the produce utility. This utility provides a way to work with data as if it were a mutable JavaScript object. produce also provides a way to make changes to multiple properties at the same time which eliminates the need for multiple setter calls.

import { produce } from "solid-js/store"

// without produce
setStore("users", 0, "username", "newUsername")
setStore("users", 0, "location", "newLocation")

// with produce
setStore(
"users",
0,
produce((user) => {
user.username = "newUsername"
user.location = "newLocation"
})
)
produce and setStore do have distinct functionalities. While both can be used to modify the state, the key distinction lies in how they handle data. produce allows you to work with a temporary draft of the state, apply the changes, then produce a new immutable version of the store. Comparatively, setStore provides a more straightforward way to update the store directly, without creating a new version.

It's important to note, however, produce is specifically designed to work with arrays and objects. Other collection types, such as JavaScript Sets and Maps, are not compatible with this utility.

Data integration with reconcile
When new information needs to be merged into an existing store reconcile can be useful. reconcile will determine the differences between new and existing data and initiate updates only when there are changed values, thereby avoiding unnecessary updates.

const { createStore, reconcile } from "solid-js/stores"

const [data, setData] = createStore({
animals: ['cat', 'dog', 'bird', 'gorilla']
})

const newData = getNewData() // eg. contains ['cat', 'dog', 'bird', 'gorilla', 'koala']
setData('animals', reconcile(newData))
In this example, the store will look for the differences between the existing and incoming data sets. Consequently, only 'koala' - the new edition - will cause an update.

Extracting raw data with unwrap
When there is a need for dealing with data outside of a reactive context, the unwrap utility offers a way to transform a store to a standard object. This conversion serves several important purposes.

Firstly, it provides a snapshot of the current state without the processing overhead associated with reactivity. This can be useful in situations where an unaltered, non-reactive view of the data is needed. Additionally, unwrap provides a means to interface with third-party libraries or tools that anticipate regular JavaScript objects. This utility acts as a bridge to facilitate smooth integrations with external components and simplifies the incorporation of stores into various applications and workflows.

import { createStore, unwrap } from "solid-js/store"

const [data, setData] = createStore({
animals: ["cat", "dog", "bird", "gorilla"],
})

const rawData = unwrap(data)
To learn more about how to use Stores in practice, visit the guide on complex state management.

https://docs.solidjs.com/advanced-concepts/fine-grained-reactivity

Advanced concepts
Fine-grained reactivity
Reactivity ensures automatic responses to data changes, eliminating the need for manual updates to the user interface (UI). By connecting UI elements to the underlying data, updates become automated. In a fine-grained reactive system an application will now have the ability to make highly targeted and specific updates.

An example of this can be seen in the contrast between Solid and React. In Solid, updates are made to the targeted attribute that needs to be changed, avoiding broader and, sometimes unnecessary, updates. In contrast, React would re-execute an entire component for a change in the single attribute, which can be less efficient.

Because of the fine-grained reactive system, unnecessary recalculations are avoided. Through targeting only the areas of an application that have changed the user experience becomes smoother and more optimized.

Note: If you're new to the concept of reactivity and want to learn the basics, consider starting with our intro to reactivity guide.

Reactive primitives
In Solid's reactivity system, there are two key elements: signals and observers. These core elements serve as the foundation for more specialized reactive features:

Stores which are proxies that create, read, and write signals under the hood.
Memos resemble effects but are distinct in that they return a signal and optimize computations through caching. They update based on the behavior of effects, but are more ideal for computational optimization.
Resources, building on the concept of memos, convert the asynchronicity of network requests into synchronicity, where the results are embedded within a signal.
Render effects are a tailored type of effect that initiate immediately, specifically designed for managing the rendering process.
Understanding signals
Signals are like mutable variables that can point to a value now and another in the future. They are made up of two primary functions:

Getter: how to read the current value of a signal.
Setter: a way to modify or update a signal's value.
In Solid, the createSignal function can be used to create a signal. This function returns the getter and setter as a pair in a two-element array, called a tuple.

import { createSignal } from "solid-js";

const [count, setCount] = createSignal(1);

console.log(count()); // prints "1"

setCount(0); // changes count to 0

console.log(count()); // prints "0"
Here, count serves as the getter, and setCount functions as the setter.

Effects
Effects are functions that are triggered when the signals they depend on point to a different value. They can be thought of as automated responders where any changes in the signal's value will trigger the effect to run.

import { createSignal, createEffect } from "solid-js";

const [count, setCount] = createSignal(0);

createEffect(() => {
console.log(count());
});
The effect takes a function that is called whenever any of the signals it relies on changes, such as count in this example.

Building a reactive system
To grasp the concept of reactivity, it is often helpful to construct a reactive system from scratch.

The following example will follow the observer pattern, where data entities (signals) will maintain a list of their subscribers (effects). This is a way to notify subscribers whenever a signal they observe changes.

Here is a basic code outline to begin:

function createSignal() {}

function createEffect() {}

const [count, setCount] = createSignal(0);

createEffect(() => {
console.log("The count is " + count());
});
Reactive primitives
createSignal
The createSignal function performs two main tasks:

Initialize the value (in this case, count is set to 0).
Return an array with two elements: the getter and setter function.
function createSignal(initialValue) {
let value = initialValue;

function getter() {
return value;
}

function setter(newValue) {
value = newValue;
}

return [getter, setter];
}

// ..
This allows you to retrieve the current value through the getter and make any changes via the setter. At this stage, reactivity is not present, however.

createEffect
createEffect defines a function that immediately calls the function that is passed into it:

// ..

function createEffect(fn) {
fn();
}

// ..
Making a system reactive
Reactivity emerges when linking createSignal and createEffect and this happens through:

Maintaining a reference to the current subscriber's function.
Registering this function during the creation of an effect.
Adding the function to a subscriber list when accessing a signal.
Notifying all subscribers when the signal has updated.
let currentSubscriber = null;

function createSignal(initialValue) {
let value = initialValue;
const subscribers = new Set();

function getter() {
if (currentSubscriber) {
subscribers.add(currentSubscriber);
}
return value;
}

function setter(newValue) {
if (value === newValue) return; // if the new value is not different, do not notify dependent effects and memos
value = newValue;
for (const subscriber of subscribers) {
subscriber(); //
}
}

return [getter, setter];
}

// creating an effect
function createEffect(fn) {
const previousSubscriber = currentSubscriber; // Step 1
currentSubscriber = fn;
fn();
currentSubscriber = previousSubscriber;
}

//..
A variable is used to hold a reference to the current executing subscriber function. This is used to determine which effects are dependent on which signals.

Inside createSignal, the initial value is stored and a Set is used to store any subscriber functions that are dependent on the signal. This function will then return two functions for the signal:

The getter function checks to see if the current subscriber function is being accessed and, if it is, adds it to the list of subscribers before returning the current value of the signal.
The setter function evaluated the new value against the old value, notifying the dependent functions only when the signal has been updated.
When creating the createEffect function, a reference to any previous subscribers is initialized to handle any possible nested effects present. The current subscriber is then passed to the given function, which is run immediately. During this run, if the effect accesses any signals it is then registered as a subscriber to those signals. The current subscriber, once the given function has been run, will be reset to its previous value so that, if there are any nested effects, they are operated correctly.

Validating the reactive system
To validate the system, increment the count value at one-second intervals:

//..

const [count, setCount] = createSignal(0);

createEffect(() => {
console.log("The count is " + count());
});

setInterval(() => {
setCount(count() + 1);
}, 1000);
This will display the incremented count value on the console at one-second intervals to confirm the reactive system's functionality.

Managing lifecycles in a reactive system
In reactive systems, various elements, often referred to as "nodes", are interconnected. These nodes can be signals, effects, or other reactive primitives. They serve as the individual units that collectively make up the reactive behavior of the system.

When a node changes, the system will re-evaluate the parts connected to that node. This can result in updates, additions, or removals of these connections, which affect the overall behavior of the system.

Now, consider a scenario where a condition influences the data used to calculate an output:

// Temperature.jsx
console.log("1. Initialize");
const [temperature, setTemperature] = createSignal(72);
const [unit, setUnit] = createSignal("Fahrenheit");
const [displayTemp, setDisplayTemp] = createSignal(true);

const displayTemperature = createMemo(() => {
if (!displayTemp()) return "Temperature display is off";
return `${temperature()} degrees ${unit()}`;
});

createEffect(() => console.log("Current temperature is", displayTemperature()));

console.log("2. Turn off displayTemp");
setDisplayTemp(false);

console.log("3. Change unit");
setUnit("Celsius");

console.log("4. Turn on displayTemp");
setDisplayTemp(true);
In this example, the createMemo primitive is used to cache the state of a computation. This means the computation doesn't have to be re-run if its dependencies remain unchanged.

The displayTemperature memo has an early return condition based on the value of displayTemp. When displayTemp is false, the memo returns a message saying "Temperature display is off," and as a result, temperature and unit are not tracked.

If the unit is changed while displayTemp is false, however, the effect won't trigger since none of the memo's current dependencies (displayTemp in this case) have changed.

Synchronous nature of effect tracking
The reactivity system described above operates synchronously. This operation has implications for how effects and their dependencies are tracked. Specifically, the system registers the subscriber, runs the effect function, and then unregisters the subscriber — all in a linear, synchronous sequence.

Consider the following example:

createEffect(() => {
setTimeout(() => {
console.log(count());
}, 1000);
});
The createEffect function in this example, initiates a setTimeout to delay the console log. Because the system is synchronous, it doesn't wait for this operation to complete. By the time the count getter is triggered within the setTimeout, the global scope no longer has a registered subscriber. As a result, this count signal will not add the callback as a subscriber which leads to potential issues with tracking the changes to count.

Handling asynchronous effects
While the basic reactivity system is synchronous, frameworks like Solid offer more advanced features to handle asynchronous scenarios. For example, the on function provides a way to manually specify the dependencies of an effect. This is particularly useful for to make sure asynchronous operations are correctly tied into the reactive system.

Solid also introduces the concept of resources for managing asynchronous operations. Resources are specialized reactive primitives that convert the asynchronicity of operations like network requests into synchronicity, embedding the results within a signal. The system can then track asynchronous operations and their state, keeping the UI up-to-date when the operation completes or its' state changes.

Using resources in Solid can assist in complex scenarios when multiple asynchronous operations are involved and the completion may affect different parts of the reactive system. By integrating resources into the system, you can ensure that dependencies are correctly tracked and that the UI remains consistent with the underlying asynchronous data.
