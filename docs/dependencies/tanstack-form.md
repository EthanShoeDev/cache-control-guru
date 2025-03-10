https://tanstack.com/form/latest/docs/framework/solid/quick-start

Quick Start
The bare minimum to get started with TanStack Form is to create a form and add a field. Keep in mind that this example does not include any validation or error handling... yet.

tsx

import { createForm } from '@tanstack/solid-form'

function App() {
const form = createForm(() => ({
defaultValues: {
fullName: '',
},
onSubmit: async ({ value }) => {
// Do something with form data
console.log(value)
},
}))

return (

<div>
<h1>Simple Form Example</h1>
<form
onSubmit={(e) => {
e.preventDefault()
e.stopPropagation()
form.handleSubmit()
}} >
<div>
<form.Field
name="fullName"
children={(field) => (
<input
name={field().name}
value={field().state.value}
onBlur={field().handleBlur}
onInput={(e) => field().handleChange(e.target.value)}
/>
)}
/>
</div>
<button type="submit">Submit</button>
</form>
</div>
)
}

https://tanstack.com/form/latest/docs/framework/solid/guides/basic-concepts

Basic Concepts and Terminology
This page introduces the basic concepts and terminology used in the @tanstack/solid-form library. Familiarizing yourself with these concepts will help you better understand and work with the library.

Form Options
You can create options for your form so that it can be shared between multiple forms by using the formOptions function.

Example:

tsx

const formOpts = formOptions({
defaultValues: {
firstName: '',
lastName: '',
hobbies: [],
} as Person,
})
Form Instance
A Form Instance is an object that represents an individual form and provides methods and properties for working with the form. You create a form instance using the createForm hook provided by the form options. The hook accepts an object with an onSubmit function, which is called when the form is submitted.

tsx

const form = createForm(() => ({
...formOpts,
onSubmit: async ({ value }) => {
// Do something with form data
console.log(value)
},
}))
You may also create a form instance without using formOptions by using the standalone createForm API:

tsx

const form = createForm<Person>(() => ({
onSubmit: async ({ value }) => {
// Do something with form data
console.log(value)
},
defaultValues: {
firstName: '',
lastName: '',
hobbies: [],
},
}))
Field
A Field represents a single form input element, such as a text input or a checkbox. Fields are created using the form.Field component provided by the form instance. The component accepts a name prop, which should match a key in the form's default values. It also accepts a children prop, which is a render prop function that takes a field object as its argument.

Example:

tsx

<form.Field
name="firstName"
children={(field) => (
<input
name={field().name}
value={field().state.value}
onBlur={field().handleBlur}
onInput={(e) => field().handleChange(e.target.value)}
/>
)}
/>
Field State
Each field has its own state, which includes its current value, validation status, error messages, and other metadata. You can access a field's state using the field().state property.

Example:

tsx

const {
value,
meta: { errors, isValidating },
} = field().state
There are three field states can be very useful to see how the user interacts with a field. A field is "touched" when the user clicks/tabs into it, "pristine" until the user changes value in it, and "dirty" after the value has been changed. You can check these states via the isTouched, isPristine and isDirty flags, as seen below.

tsx

const { isTouched, isPristine, isDirty } = field().state.meta
Field states

Field API
The Field API is an object passed to the render prop function when creating a field. It provides methods for working with the field's state.

Example:

tsx

<input
name={field().name}
value={field().state.value}
onBlur={field().handleBlur}
onInput={(e) => field().handleChange(e.target.value)}
/>
Validation
@tanstack/solid-form provides both synchronous and asynchronous validation out of the box. Validation functions can be passed to the form.Field component using the validators prop.

Example:

tsx

<form.Field
name="firstName"
validators={{
    onChange: ({ value }) =>
      !value
        ? 'A first name is required'
        : value.length < 3
          ? 'First name must be at least 3 characters'
          : undefined,
    onChangeAsync: async ({ value }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return value.includes('error') && 'No "error" allowed in first name'
    },
  }}
children={(field) => (
<>
<input
name={field().name}
value={field().state.value}
onBlur={field().handleBlur}
onInput={(e) => field().handleChange(e.target.value)}
/>

<p>{field().state.meta.errors[0]}</p>
</>
)}
/>
Validation with Standard Schema Libraries
In addition to hand-rolled validation options, we also support the Standard Schema specification.

You can define a schema using any of the libraries implementing the specification and pass it to a form or field validator.

Supported libraries include:

Zod
Valibot
ArkType
tsx

import { z } from 'zod'

// ...
;<form.Field
name="firstName"
validators={{
    onChange: z.string().min(3, 'First name must be at least 3 characters'),
    onChangeAsyncDebounceMs: 500,
    onChangeAsync: z.string().refine(
      async (value) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return !value.includes('error')
      },
      {
        message: 'No "error" allowed in first name',
      },
    ),
  }}
children={(field) => (
<>
<input
name={field().name}
value={field().state.value}
onBlur={field().handleBlur}
onInput={(e) => field().handleChange(e.target.value)}
/>

<p>{field().state.meta.errors[0]}</p>
</>
)}
/>
Reactivity
@tanstack/solid-form offers various ways to subscribe to form and field state changes, most notably the form.useStore hook and the form.Subscribe component. These methods allow you to optimize your form's rendering performance by only updating components when necessary.

Example:

tsx

const firstName = form.useStore((state) => state.values.firstName)
//...
<form.Subscribe
selector={(state) => ({
canSubmit: state.canSubmit,
isSubmitting: state.isSubmitting,
})}
children={(state) => (
<button type="submit" disabled={!state().canSubmit}>
{state().isSubmitting ? '...' : 'Submit'}
</button>
)}
/>
Array Fields
Array fields allow you to manage a list of values within a form, such as a list of hobbies. You can create an array field using the form.Field component with the mode="array" prop.

When working with array fields, you can use the fields pushValue, removeValue, swapValues and moveValue methods to add, remove, and swap values in the array.

Example:

tsx

<form.Field
name="hobbies"
mode="array"
children={(hobbiesField) => (

<div>
Hobbies
<div>
<Show
          when={hobbiesField().state.value.length > 0}
fallback={'No hobbies found.'} >
<Index each={hobbiesField().state.value}>
{(\_, i) => (
<div>
<form.Field
name={`hobbies[${i}].name`}
children={(field) => (
<div>
<label for={field().name}>Name:</label>
<input
id={field().name}
name={field().name}
value={field().state.value}
onBlur={field().handleBlur}
onChange={(e) => field().handleChange(e.target.value)}
/>
<button
type="button"
onClick={() => hobbiesField().removeValue(i)} >
X
</button>
</div>
)}
/>
<form.Field
name={`hobbies[${i}].description`}
children={(field) => {
return (
<div>
<label for={field().name}>Description:</label>
<input
id={field().name}
name={field().name}
value={field().state.value}
onBlur={field().handleBlur}
onChange={(e) => field().handleChange(e.target.value)}
/>
</div>
)
}}
/>
</div>
)}
</Index>
</Show>
</div>
<button
type="button"
onClick={() =>
hobbiesField().pushValue({
name: '',
description: '',
yearsOfExperience: 0,
})
} >
Add hobby
</button>
</div>
)}
/>
These are the basic concepts and terminology used in the @tanstack/solid-form library. Understanding these concepts will help you work more effectively with the library and create complex forms with ease.

https://tanstack.com/form/latest/docs/framework/solid/guides/validation

Form and Field Validation
At the core of TanStack Form's functionalities is the concept of validation. TanStack Form makes validation highly customizable:

You can control when to perform the validation (on change, on input, on blur, on submit...)
Validation rules can be defined at the field level or at the form level
Validation can be synchronous or asynchronous (for example, as a result of an API call)
When is validation performed?
It's up to you! The <Field /> component accepts some callbacks as props such as onChange or onBlur. Those callbacks are passed the current value of the field, as well as the fieldAPI object, so that you can perform the validation. If you find a validation error, simply return the error message as string and it will be available in field().state.meta.errors.

Here is an example:

tsx

<form.Field
name="age"
validators={{
    onChange: ({ value }) =>
      value < 13 ? 'You must be 13 to make an account' : undefined,
  }}

> {(field) => (

    <>
      <label for={field().name}>Age:</label>
      <input
        id={field().name}
        name={field().name}
        value={field().state.value}
        type="number"
        onChange={(e) => field().handleChange(e.target.valueAsNumber)}
      />
      {field().state.meta.errors ? (
        <em role="alert">{field().state.meta.errors.join(', ')}</em>
      ) : null}
    </>

)}
</form.Field>
In the example above, the validation is done at each keystroke (onChange). If, instead, we wanted the validation to be done when the field is blurred, we would change the code above like so:

tsx

<form.Field
name="age"
validators={{
    onChange: ({ value }) =>
      value < 13 ? 'You must be 13 to make an account' : undefined,
  }}

> {(field) => (

    <>
      <label for={field().name}>Age:</label>
      <input
        id={field().name}
        name={field().name}
        value={field().state.value}
        type="number"
        // Listen to the onBlur event on the field
        onBlur={field().handleBlur}
        // We always need to implement onChange, so that TanStack Form receives the changes
        onChange={(e) => field().handleChange(e.target.valueAsNumber)}
      />
      {field().state.meta.errors ? (
        <em role="alert">{field().state.meta.errors.join(', ')}</em>
      ) : null}
    </>

)}
</form.Field>
So you can control when the validation is done by implementing the desired callback. You can even perform different pieces of validation at different times:

tsx

<form.Field
name="age"
validators={{
    onChange: ({ value }) =>
      value < 13 ? 'You must be 13 to make an account' : undefined,
    onBlur: ({ value }) => (value < 0 ? 'Invalid value' : undefined),
  }}

> {(field) => (

    <>
      <label for={field().name}>Age:</label>
      <input
        id={field().name}
        name={field().name}
        value={field().state.value}
        type="number"
        // Listen to the onBlur event on the field
        onBlur={field().handleBlur}
        // We always need to implement onChange, so that TanStack Form receives the changes
        onChange={(e) => field().handleChange(e.target.valueAsNumber)}
      />
      {field().state.meta.errors ? (
        <em role="alert">{field().state.meta.errors.join(', ')}</em>
      ) : null}
    </>

)}
</form.Field>
In the example above, we are validating different things on the same field at different times (at each keystroke and when blurring the field). Since field().state.meta.errors is an array, all the relevant errors at a given time are displayed. You can also use field().state.meta.errorMap to get errors based on when the validation was done (onChange, onBlur etc...). More info about displaying errors below.

Displaying Errors
Once you have your validation in place, you can map the errors from an array to be displayed in your UI:

tsx

<form.Field
name="age"
validators={{
    onChange: ({ value }) =>
      value < 13 ? 'You must be 13 to make an account' : undefined,
  }}

> {(field) => {

    return (
      <>
        {/* ... */}
        {field().state.meta.errors.length ? (
          <em>{field().state.meta.errors.join(',')}</em>
        ) : null}
      </>
    )

}}
</form.Field>
Or use the errorMap property to access the specific error you're looking for:

tsx

<form.Field
name="age"
validators={{
    onChange: ({ value }) =>
      value < 13 ? 'You must be 13 to make an account' : undefined,
  }}

> {(field) => (

    <>
      {/* ... */}
      {field().state.meta.errorMap['onChange'] ? (
        <em>{field().state.meta.errorMap['onChange']}</em>
      ) : null}
    </>

)}
</form.Field>
It's worth mentioning that our errors array and the errorMap matches the types returned by the validators. This means that:

tsx

<form.Field
name="age"
validators={{
    onChange: ({ value }) => (value < 13 ? { isOldEnough: false } : undefined),
  }}

> {(field) => (

    <>
      {/* ... */}
      {/* errorMap.onChange is type `{isOldEnough: false} | undefined` */}
      {/* meta.errors is type `Array<{isOldEnough: false} | undefined>` */}
      {!field().state.meta.errorMap['onChange']?.isOldEnough ? (
        <em>The user is not old enough</em>
      ) : null}
    </>

)}
</form.Field>
Validation at field level vs at form level
As shown above, each <Field> accepts its own validation rules via the onChange, onBlur etc... callbacks. It is also possible to define validation rules at the form level (as opposed to field by field) by passing similar callbacks to the createForm() hook.

Example:

tsx

export default function App() {
const form = createForm(() => ({
defaultValues: {
age: 0,
},
onSubmit: async ({ value }) => {
console.log(value)
},
validators: {
// Add validators to the form the same way you would add them to a field
onChange({ value }) {
if (value.age < 13) {
return 'Must be 13 or older to sign'
}
return undefined
},
},
}))

// Subscribe to the form's error map so that updates to it will render
// alternately, you can use `form.Subscribe`
const formErrorMap = form.useStore((state) => state.errorMap)

return (

<div>
{/_ ... _/}
{formErrorMap().onChange ? (
<div>
<em>There was an error on the form: {formErrorMap().onChange}</em>
</div>
) : null}
{/_ ... _/}
</div>
)
}
Asynchronous Functional Validation
While we suspect most validations will be synchronous, there are many instances where a network call or some other async operation would be useful to validate against.

To do this, we have dedicated onChangeAsync, onBlurAsync, and other methods that can be used to validate against:

tsx

<form.Field
name="age"
validators={{
    onChangeAsync: async ({ value }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return value < 13 ? 'You must be 13 to make an account' : undefined
    },
  }}

> {(field) => (

    <>
      <label for={field().name}>Age:</label>
      <input
        id={field().name}
        name={field().name}
        value={field().state.value}
        type="number"
        onChange={(e) => field().handleChange(e.target.valueAsNumber)}
      />
      {field().state.meta.errors ? (
        <em role="alert">{field().state.meta.errors.join(', ')}</em>
      ) : null}
    </>

)}
</form.Field>
Synchronous and Asynchronous validations can coexist. For example, it is possible to define both onBlur and onBlurAsync on the same field:

tsx

<form.Field
name="age"
validators={{
    onBlur: ({ value }) => (value < 13 ? 'You must be at least 13' : undefined),
    onBlurAsync: async ({ value }) => {
      const currentAge = await fetchCurrentAgeOnProfile()
      return value < currentAge ? 'You can only increase the age' : undefined
    },
  }}

> {(field) => (

    <>
      <label for={field().name}>Age:</label>
      <input
        id={field().name}
        name={field().name}
        value={field().state.value}
        type="number"
        onBlur={field().handleBlur}
        onChange={(e) => field().handleChange(e.target.valueAsNumber)}
      />
      {field().state.meta.errors ? (
        <em role="alert">{field().state.meta.errors.join(', ')}</em>
      ) : null}
    </>

)}
</form.Field>
The synchronous validation method (onBlur) is run first and the asynchronous method (onBlurAsync) is only run if the synchronous one (onBlur) succeeds. To change this behaviour, set the asyncAlways option to true, and the async method will be run regardless of the result of the sync method.

Built-in Debouncing
While async calls are the way to go when validating against the database, running a network request on every keystroke is a good way to DDOS your database.

Instead, we enable an easy method for debouncing your async calls by adding a single property:

tsx

<form.Field
name="age"
asyncDebounceMs={500}
validators={{
    onChangeAsync: async ({ value }) => {
      // ...
    },
  }}
children={(field) => {
return <>{/_ ... _/}</>
}}
/>
This will debounce every async call with a 500ms delay. You can even override this property on a per-validation property:

tsx

<form.Field
name="age"
asyncDebounceMs={500}
validators={{
    onChangeAsyncDebounceMs: 1500,
    onChangeAsync: async ({ value }) => {
      // ...
    },
    onBlurAsync: async ({ value }) => {
      // ...
    },
  }}
children={(field) => {
return <>{/_ ... _/}</>
}}
/>
This will run onChangeAsync every 1500ms while onBlurAsync will run every 500ms.

Validation through Schema Libraries
While functions provide more flexibility and customization over your validation, they can be a bit verbose. To help solve this, there are libraries that provide schema-based validation to make shorthand and type-strict validation substantially easier. You can also define a single schema for your entire form and pass it to the form level, errors will be automatically propagated to the fields.

Standard Schema Libraries
TanStack Form natively supports all libraries following the Standard Schema specification, most notably:

Zod
Valibot
ArkType
Note: make sure to use the latest version of the schema libraries as older versions might not support Standard Schema yet.

To use schemas from these libraries you can pass them to the validators props as you would do with a custom function:

tsx

import { z } from 'zod'

// ...

const form = createForm(() => ({
// ...
}))

;<form.Field
name="age"
validators={{
    onChange: z.number().gte(13, 'You must be 13 to make an account'),
  }}
children={(field) => {
return <>{/_ ... _/}</>
}}
/>
Async validations on form and field level are supported as well:

tsx

<form.Field
name="age"
validators={{
    onChange: z.number().gte(13, 'You must be 13 to make an account'),
    onChangeAsyncDebounceMs: 500,
    onChangeAsync: z.number().refine(
      async (value) => {
        const currentAge = await fetchCurrentAgeOnProfile()
        return value >= currentAge
      },
      {
        message: 'You can only increase the age',
      },
    ),
  }}
children={(field) => {
return <>{/_ ... _/}</>
}}
/>
Preventing invalid forms from being submitted
The onChange, onBlur etc... callbacks are also run when the form is submitted and the submission is blocked if the form is invalid.

The form state object has a canSubmit flag that is false when any field is invalid and the form has been touched (canSubmit is true until the form has been touched, even if some fields are "technically" invalid based on their onChange/onBlur props).

You can subscribe to it via form.Subscribe and use the value in order to, for example, disable the submit button when the form is invalid (in practice, disabled buttons are not accessible, use aria-disabled instead).

tsx

const form = createForm(() => ({
/_ ... _/
}))

return (
/_ ... _/

// Dynamic submit button
<form.Subscribe
selector={(state) => ({
canSubmit: state.canSubmit,
isSubmitting: state.isSubmitting,
})}
children={(state) => (
<button type="submit" disabled={!state().canSubmit}>
{state().isSubmitting ? '...' : 'Submit'}
</button>
)}
/>
)

https://tanstack.com/form/latest/docs/framework/solid/guides/async-initial-values

Async Initial Values
Let's say that you want to fetch some data from an API and use it as the initial value of a form.

While this problem sounds simple on the surface, there are hidden complexities you might not have thought of thus far.

For example, you might want to show a loading spinner while the data is being fetched, or you might want to handle errors gracefully. Likewise, you could also find yourself looking for a way to cache the data so that you don't have to fetch it every time the form is rendered.

While we could implement many of these features from scratch, it would end up looking a lot like another project we maintain: TanStack Query.

As such, this guide shows you how you can mix-n-match TanStack Form with TanStack Query to achieve the desired behavior.

Basic Usage
tsx

import { createForm } from '@tanstack/solid-form'
import { createQuery } from '@tanstack/solid-query'

export default function App() {
const { data, isLoading } = createQuery(() => ({
queryKey: ['data'],
queryFn: async () => {
await new Promise((resolve) => setTimeout(resolve, 1000))
return { firstName: 'FirstName', lastName: 'LastName' }
},
}))

const form = createForm(() => ({
defaultValues: {
firstName: data?.firstName ?? '',
lastName: data?.lastName ?? '',
},
onSubmit: async ({ value }) => {
// Do something with form data
console.log(value)
},
}))

if (isLoading) return <p>Loading..</p>

return null
}
This will show a loading spinner until the data is fetched, and then it will render the form with the fetched data as the initial values.

Arrays
TanStack Form supports arrays as values in a form, including sub-object values inside of an array.

Basic Usage
To use an array, you can use field.state.value on an array value in conjunction with Index from solid-js:

jsx

function App() {
const form = createForm(() => ({
defaultValues: {
people: [],
},
}))

return (
<form.Field name="people" mode="array">
{(field) => (
<Show when={field().state.value.length > 0}>
{/_ Do not change this to `For` or things will not work as-expected _/}
<Index each={field().state.value}>
{
(\_, i) => null // ...
}
</Index>
</Show>
)}
</form.Field>
)
}
You must use Index from solid-js and not For because For will cause the inner components to be re-rendered every time the array changes.

This causes the field to lose its value and therefore delete the subfield's value.

This will generate the mapped JSX every time you run pushValue on field:

jsx

<button onClick={() => field().pushValue({ name: '', age: 0 })} type="button">
Add person
</button>
Finally, you can use a subfield like so:

jsx

<form.Field name={`people[${i}].name`}>
{(subField) => (
<input
value={subField().state.value}
onInput={(e) => {
subField().handleChange(e.currentTarget.value)
}}
/>
)}
</form.Field>
Full Example
jsx

function App() {
const form = createForm(() => ({
defaultValues: {
people: [],
},
onSubmit: ({ value }) => alert(JSON.stringify(value)),
}))

return (

<div>
<form
onSubmit={(e) => {
e.preventDefault()
e.stopPropagation()
form.handleSubmit()
}} >
<form.Field name="people">
{(field) => (
<div>
<Show when={field().state.value.length > 0}>
{/_ Do not change this to For or the test will fail _/}
<Index each={field().state.value}>
{(\_, i) => (
<form.Field name={`people[${i}].name`}>
{(subField) => (
<div>
<label>
<div>Name for person {i}</div>
<input
value={subField().state.value}
onInput={(e) => {
subField().handleChange(e.currentTarget.value)
}}
/>
</label>
</div>
)}
</form.Field>
)}
</Index>
</Show>

              <button
                onClick={() => field().pushValue({ name: '', age: 0 })}
                type="button"
              >
                Add person
              </button>
            </div>
          )}
        </form.Field>
        <button type="submit">Submit</button>
      </form>
    </div>

)
}
