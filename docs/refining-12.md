Based on the current design of the website, I still had questions so I asked a LLM

• no-cache requires revalidation even for fresh responses, but still allows storing the response

I am a bit confused about no-cache. So will the browser wait until revalidation completes then show the html? (If the html was cached with no-cache) or will it show cached response and revalidate in the background?

Let me clarify how no-cache works:
With no-cache, the browser MUST wait for revalidation to complete before showing the content. It does not show stale content while revalidating in the background (that's what stale-while-revalidate is for).
Here's the sequence with no-cache:
Browser has a cached response
User requests the page
Browser MUST check with the server first (sends a validation request)
Only after getting a response from the server will the browser:
Show the new response if the content changed
Show the cached response if the server returns 304 Not Modified
This is different from stale-while-revalidate where:
Browser shows the stale cached content immediately
Revalidates in the background
Updates the cache for next time
The key differences:
no-cache: User waits for revalidation (prioritizes freshness over speed)
stale-while-revalidate: User sees stale content immediately while revalidating (prioritizes speed over freshness)
So if you want to ensure users always see the latest content and don't mind the slight delay for validation, use no-cache. If you want to eliminate waiting time and don't mind users potentially seeing slightly stale content, use stale-while-revalidate.

So if the server doesn't support sending 304 Not modified, there is no point? How does the browser let the server know that it has a cached copy? (informing the server its okay to return a 304)

Great question! The browser uses two main HTTP headers to enable 304 Not Modified responses:
If-None-Match: Sends the ETag value that was received with the cached response
If-Modified-Since: Sends the Last-Modified date that was received with the cached response
Here's how it works:
First response from server includes either/both:
Browser caches the response along with these validation tokens
On subsequent requests with no-cache, browser automatically adds:
Server can then:
Return 304 Not Modified (if content hasn't changed)
Return 200 with new content (if it has changed)
If the server doesn't support 304 responses or doesn't send ETags/Last-Modified headers, then yes - every no-cache request will result in a full download of the resource. This is why it's important for servers to implement proper validation support.
Most modern web servers (Apache, Nginx, etc.) support this out of the box. For example, Nginx automatically generates ETags and handles If-None-Match validation for static files without any configuration needed.
For dynamic content, your application code needs to implement the validation logic:

These questions should be answered by our site. Find some clever way of integrating the key information into our site. If I had this question, I imagine others will too.

And while you are at it, I have nits with the styling:

- the Common Patterns section on the index route has way too big of buttons. Its probably better to use a list layout instead of a grid. Each of these should have a tooltip that explains when you might want to use it.

For example you can say that 'Vite' automatically adds hashed suffixs to static assests at bundle time.

Here are the docs on the tool tip component I want you to use
https://shadcn-solid.com/docs/components/tooltip
Tooltip
A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.

Usage
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

<Tooltip>
  <TooltipTrigger>Hover</TooltipTrigger>
  <TooltipContent>
    <p>Add to library</p>
  </TooltipContent>
</Tooltip>

I added this component to `src/components/ui/tooltip.tsx`

- The main text input at the top of the index route should be much taller. It is the main interface where everything else on the page is generated from.
