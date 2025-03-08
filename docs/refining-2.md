The form within the generat tab has a few problems
If I copy and paste the text from the form it looks like this:

General Caching
Cacheability

Public
Response can be stored by any cache, including browsers and CDNs.

Private
Response is intended for a single user and must not be stored by shared caches.

None
Don't specify public or private explicitly.

No Store
Response must not be stored in any cache. Used for sensitive data.

No Cache
Cache must revalidate with the origin server before using the cached copy.

Validation
Must Revalidate
Cache must verify stale responses with the origin server before using them.

Proxy Revalidate
Similar to must-revalidate but only applies to shared caches like CDNs.

Immutable
Indicates the response body will not change over time (for HTTP/2+).

Expiration
Max Age: 3600 seconds (1 hour)

Maximum time the response can be used before revalidation.

Other Directives
No Transform
Prevents caches from modifying the response content (like image compression).

There are radio buttons for Public Private and None however No stor and No Cache are formatted in the same way as the radio buttons but they do not have a radio button.
I am not sure if all of these should be radio buttons, they should if they are all mutually exclusive, refer to the specefication for accurate answer: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control

A similiar problem is happening within the Validation card, they are formatted like the radio buttons above, yet they have no input. They should probably either be a checkbox or a radio button.

And when I finally press the "Generate Cache-Control Header" button, the max-age is always set to 3600. The form should include a text box or numeric input so the user can specify. (Or better yet some input that accepts a relative time delta and that gets converted). There should also be an input for s-maxage. I think that it should be disabled when the "Private" option is set. If it is disabled, it should explain why its disabled when you hover it.

Essentially I want us to double check the specs for cache-control and make sure our form supports all the options.

Also preferrably, there wouldn't be any submit button, the Generated Header would just update as soon as the form options change.
