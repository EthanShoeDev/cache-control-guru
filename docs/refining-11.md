The website currently has lots of duplicated information. I want you to go through an eliminate that, while also improving the styling and general layout of the index page.

Here is the main part of the page

<main class="container mx-auto max-w-5xl px-4 py-8">
  <div class="space-y-6">
    <div class="space-y-2 text-center">
      <h1 class="text-4xl font-bold tracking-tight">Cache-Control Guru</h1>
      <p class="text-muted-foreground text-xl">
        Understand and generate Cache-Control headers easily
      </p>
    </div>
    <div class="mx-auto max-w-2xl">
      <div class="space-y-4">
        <div class="space-y-3">
          <div class="flex flex-col space-y-2">
            <div class="flex items-center justify-between">
              <label
                for="cache-control-input"
                class="text-sm leading-none font-medium"
                >Cache-Control Header</label
              ><!--$--><button
                type="button"
                class="inline-flex items-center justify-center font-medium transition-[color,background-color,box-shadow] focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs"
              >
                Copy</button
              ><!--/-->
            </div>
            <input
              id="cache-control-input"
              type="text"
              placeholder="e.g. max-age=3600, no-cache, public"
              class="border-input focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 font-mono text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <!--$--><!--/-->
        </div>
        <div class="space-y-2">
          <h3 class="text-muted-foreground text-sm font-medium">
            Common Patterns:
          </h3>
          <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
            <!--$--><button
              type="button"
              class="inline-flex items-center font-medium transition-[color,background-color,box-shadow] focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border bg-background shadow-sm hover:text-accent-foreground h-8 rounded-md px-3 text-xs justify-start border-blue-100 hover:bg-blue-50/50 dark:border-blue-900 dark:hover:bg-blue-950/30"
            >
              <div class="text-left">
                <div class="text-sm font-medium">
                  Static assets (hash filenames)
                </div>
                <div class="text-muted-foreground mt-1 font-mono text-xs">
                  max-age=31536000, immutable
                </div>
              </div></button
            ><!--/--><!--$--><button
              type="button"
              class="inline-flex items-center font-medium transition-[color,background-color,box-shadow] focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border bg-background shadow-sm hover:text-accent-foreground h-8 rounded-md px-3 text-xs justify-start border-blue-100 hover:bg-blue-50/50 dark:border-blue-900 dark:hover:bg-blue-950/30"
            >
              <div class="text-left">
                <div class="text-sm font-medium">HTML pages</div>
                <div class="text-muted-foreground mt-1 font-mono text-xs">
                  no-cache
                </div>
              </div></button
            ><!--/--><!--$--><button
              type="button"
              class="inline-flex items-center font-medium transition-[color,background-color,box-shadow] focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border bg-background shadow-sm hover:text-accent-foreground h-8 rounded-md px-3 text-xs justify-start border-blue-100 hover:bg-blue-50/50 dark:border-blue-900 dark:hover:bg-blue-950/30"
            >
              <div class="text-left">
                <div class="text-sm font-medium">API responses</div>
                <div class="text-muted-foreground mt-1 font-mono text-xs">
                  private, max-age=60
                </div>
              </div></button
            ><!--/--><!--$--><button
              type="button"
              class="inline-flex items-center font-medium transition-[color,background-color,box-shadow] focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border bg-background shadow-sm hover:text-accent-foreground h-8 rounded-md px-3 text-xs justify-start border-blue-100 hover:bg-blue-50/50 dark:border-blue-900 dark:hover:bg-blue-950/30"
            >
              <div class="text-left">
                <div class="text-sm font-medium">Personalized content</div>
                <div class="text-muted-foreground mt-1 font-mono text-xs">
                  private, max-age=0, must-revalidate
                </div>
              </div></button
            ><!--/--><!--$--><button
              type="button"
              class="inline-flex items-center font-medium transition-[color,background-color,box-shadow] focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border bg-background shadow-sm hover:text-accent-foreground h-8 rounded-md px-3 text-xs justify-start border-blue-100 hover:bg-blue-50/50 dark:border-blue-900 dark:hover:bg-blue-950/30"
            >
              <div class="text-left">
                <div class="text-sm font-medium">
                  Fast updates with fallbacks
                </div>
                <div class="text-muted-foreground mt-1 font-mono text-xs">
                  max-age=60, stale-while-revalidate=3600, stale-if-error=86400
                </div>
              </div></button
            ><!--/--><!--$--><button
              type="button"
              class="inline-flex items-center font-medium transition-[color,background-color,box-shadow] focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border bg-background shadow-sm hover:text-accent-foreground h-8 rounded-md px-3 text-xs justify-start border-blue-100 hover:bg-blue-50/50 dark:border-blue-900 dark:hover:bg-blue-950/30"
            >
              <div class="text-left">
                <div class="text-sm font-medium">Sensitive data</div>
                <div class="text-muted-foreground mt-1 font-mono text-xs">
                  no-store
                </div>
              </div></button
            ><!--/-->
          </div>
        </div>
      </div>
    </div>
    <div class="mx-auto max-w-3xl space-y-8">
      <div class="space-y-6">
        <div class="border-border pt-2">
          <h2 class="mb-4 text-xl font-semibold">Header Explanation</h2>
          <!--$-->
          <div
            class="bg-card text-card-foreground rounded-xl border shadow p-4"
          >
            <p class="text-base">
              This response can be stored by any cache, including browsers and
              shared caches like CDNs. and will remain fresh for 2 hours 46
              minutes 40 seconds. Caches must revalidate with the origin server
              before using this response, even if it's still fresh. Once stale,
              this response must be revalidated with the origin server before
              being used. After becoming stale, it can still be used for 1
              minute while a background revalidation occurs.
            </p>
          </div>
          <!--/-->
        </div>
      </div>
      <div class="border-border border-t pt-6">
        <h2 class="mb-4 text-xl font-semibold">Configure Options</h2>
        <!--$-->
        <div class="space-y-6">
          <div class="space-y-6">
            <div>
              <!--$-->
              <div class="mb-3">
                <h3 class="text-primary text-lg font-medium">1. Cache Type</h3>
                <p class="text-muted-foreground mt-1 text-sm">
                  Determines which caches can store the response. This is the
                  most basic setting for controlling caching behavior.
                </p>
              </div>
              <!--/--><!--$-->
              <div
                class="bg-card text-card-foreground rounded-xl border shadow space-y-4 p-4"
              >
                <div class="space-y-3">
                  <p class="text-sm font-medium">
                    Select how the response can be cached:
                  </p>
                  <div class="flex flex-col gap-4">
                    <div>
                      <label class="flex items-center space-x-2"
                        ><input
                          type="radio"
                          name="cacheType"
                          value="public"
                          class="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                        /><span class="text-sm leading-none font-medium"
                          >Public</span
                        ></label
                      >
                      <div class="mt-2 ml-6">
                        <p class="text-sm">
                          Response can be stored by any cache, including
                          browsers and CDNs. Use for content that can be shared
                          among users.
                        </p>
                        <p
                          class="text-muted-foreground border-primary/20 mt-1 border-l-2 pl-2 text-xs"
                        >
                          Suitable for content that can be shared among multiple
                          users, such as static images or CSS files.
                        </p>
                      </div>
                    </div>
                    <div>
                      <label class="flex items-center space-x-2"
                        ><input
                          type="radio"
                          name="cacheType"
                          value="private"
                          class="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                        /><span class="text-sm leading-none font-medium"
                          >Private</span
                        ></label
                      >
                      <div class="mt-2 ml-6">
                        <p class="text-sm">
                          Response is intended for a single user and must not be
                          stored by shared caches like CDNs. Use for
                          personalized content.
                        </p>
                        <p
                          class="text-muted-foreground border-primary/20 mt-1 border-l-2 pl-2 text-xs"
                        >
                          Use this for personalized content or data that should
                          not be shared, like user-specific pages.
                        </p>
                      </div>
                    </div>
                    <div>
                      <label class="flex items-center space-x-2"
                        ><input
                          type="radio"
                          name="cacheType"
                          value="no-store"
                          class="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                        /><span class="text-sm leading-none font-medium"
                          >No caching (no-store)</span
                        ></label
                      >
                      <div class="mt-2 ml-6">
                        <p class="text-sm">
                          Response must not be stored in any cache. Used for
                          sensitive data that should never be cached. This is
                          the most restrictive directive and overrides all
                          others.
                        </p>
                        <p
                          class="text-muted-foreground border-primary/20 mt-1 border-l-2 pl-2 text-xs"
                        >
                          Ensures that no part of the response is cached,
                          important for privacy and security. This overrides all
                          other directives.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--/-->
            </div>
            <div class="">
              <!--$-->
              <div class="mb-3">
                <h3 class="text-primary text-lg font-medium">
                  2. Freshness Duration
                </h3>
                <p class="text-muted-foreground mt-1 text-sm">
                  Controls how long the response can be used before it becomes
                  stale and potentially needs revalidation.
                </p>
              </div>
              <!--/--><!--$-->
              <div
                class="bg-card text-card-foreground rounded-xl border shadow space-y-4 p-4"
              >
                <div>
                  <!--$-->
                  <div class="relative space-y-2">
                    <div class="flex items-center space-x-2">
                      <div role="group" id="checkbox-cl-50" data-checked="">
                        <div class="flex items-center space-x-2">
                          <!--$--><input
                            type="checkbox"
                            id="checkbox-cl-50-input"
                            name="checkbox-cl-50"
                            value="on"
                            aria-disabled="false"
                            data-checked=""
                            class="[&amp;:focus-visible+div]:ring-ring [&amp;:focus-visible+div]:ring-offset-background [&amp;:focus-visible+div]:ring-[1.5px] [&amp;:focus-visible+div]:ring-offset-2 [&amp;:focus-visible+div]:outline-none"
                            aria-labelledby="checkbox-cl-50-label"
                            style="
                              border: 0px;
                              clip: rect(0px, 0px, 0px, 0px);
                              clip-path: inset(50%);
                              height: 1px;
                              margin: 0px -1px -1px 0px;
                              overflow: hidden;
                              padding: 0px;
                              position: absolute;
                              width: 1px;
                              white-space: nowrap;
                            "
                          />
                          <div
                            data-checked=""
                            id="checkbox-cl-50-control"
                            class="border-primary focus-visible:ring-ring data-[checked]:bg-primary data-[checked]:text-primary-foreground h-4 w-4 shrink-0 rounded-sm border shadow transition-shadow focus-visible:ring-[1.5px] focus-visible:outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
                          >
                            <div
                              data-checked=""
                              id="checkbox-cl-50-indicator"
                              class="flex items-center justify-center text-current"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                class="h-4 w-4"
                              >
                                <path
                                  fill="none"
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="m5 12l5 5L20 7"
                                ></path>
                                <title>Checkbox</title>
                              </svg>
                            </div>
                          </div>
                          <!--/--><!--$--><label
                            id="checkbox-cl-50-label"
                            data-checked=""
                            class="text-sm leading-none font-medium"
                            for="checkbox-cl-50-input"
                            >Max Age</label
                          ><!--/-->
                        </div>
                      </div>
                    </div>
                    <!--$-->
                    <div class="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        class="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      /><select
                        class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring inline-flex h-9 min-w-[100px] items-center justify-between rounded-md border px-3 py-2 text-sm shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="seconds">seconds</option>
                        <option value="minutes">minutes</option>
                        <option value="hours">hours</option>
                        <option value="days">days</option>
                      </select>
                    </div>
                    <p class="text-muted-foreground text-sm">
                      Specifies the maximum time (in seconds) the response
                      remains "fresh". During this time, the browser can use the
                      cached version without checking with the server. After
                      this time, the cache must revalidate the response with the
                      server.
                    </p>
                    <!--/-->
                  </div>
                  <!--/--><!--$--><!--/-->
                </div>
                <div>
                  <div class="relative space-y-2">
                    <div class="flex items-center space-x-2">
                      <div role="group" id="checkbox-cl-52">
                        <div class="flex items-center space-x-2">
                          <!--$--><input
                            type="checkbox"
                            id="checkbox-cl-52-input"
                            name="checkbox-cl-52"
                            value="on"
                            aria-disabled="false"
                            class="[&amp;:focus-visible+div]:ring-ring [&amp;:focus-visible+div]:ring-offset-background [&amp;:focus-visible+div]:ring-[1.5px] [&amp;:focus-visible+div]:ring-offset-2 [&amp;:focus-visible+div]:outline-none"
                            aria-labelledby="checkbox-cl-52-label"
                            style="
                              border: 0px;
                              clip: rect(0px, 0px, 0px, 0px);
                              clip-path: inset(50%);
                              height: 1px;
                              margin: 0px -1px -1px 0px;
                              overflow: hidden;
                              padding: 0px;
                              position: absolute;
                              width: 1px;
                              white-space: nowrap;
                            "
                          />
                          <div
                            id="checkbox-cl-52-control"
                            class="border-primary focus-visible:ring-ring data-[checked]:bg-primary data-[checked]:text-primary-foreground h-4 w-4 shrink-0 rounded-sm border shadow transition-shadow focus-visible:ring-[1.5px] focus-visible:outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
                          ></div>
                          <!--/--><!--$--><label
                            id="checkbox-cl-52-label"
                            class="text-sm leading-none font-medium"
                            for="checkbox-cl-52-input"
                            >Shared Max Age (s-maxage)</label
                          ><!--/-->
                        </div>
                      </div>
                    </div>
                    <!--$--><!--/-->
                  </div>
                </div>
                <div class="space-y-2">
                  <!--$-->
                  <div class="flex items-center space-x-2">
                    <div role="group" id="checkbox-cl-54">
                      <div class="flex items-center space-x-2">
                        <!--$--><input
                          type="checkbox"
                          id="checkbox-cl-54-input"
                          name="checkbox-cl-54"
                          value="on"
                          aria-disabled="false"
                          class="[&amp;:focus-visible+div]:ring-ring [&amp;:focus-visible+div]:ring-offset-background [&amp;:focus-visible+div]:ring-[1.5px] [&amp;:focus-visible+div]:ring-offset-2 [&amp;:focus-visible+div]:outline-none"
                          aria-labelledby="checkbox-cl-54-label"
                          style="
                            border: 0px;
                            clip: rect(0px, 0px, 0px, 0px);
                            clip-path: inset(50%);
                            height: 1px;
                            margin: 0px -1px -1px 0px;
                            overflow: hidden;
                            padding: 0px;
                            position: absolute;
                            width: 1px;
                            white-space: nowrap;
                          "
                        />
                        <div
                          id="checkbox-cl-54-control"
                          class="border-primary focus-visible:ring-ring data-[checked]:bg-primary data-[checked]:text-primary-foreground h-4 w-4 shrink-0 rounded-sm border shadow transition-shadow focus-visible:ring-[1.5px] focus-visible:outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
                        ></div>
                        <!--/--><!--$--><label
                          id="checkbox-cl-54-label"
                          class="text-sm leading-none font-medium"
                          for="checkbox-cl-54-input"
                          >Immutable</label
                        ><!--/-->
                      </div>
                    </div>
                  </div>
                  <!--/-->
                  <p class="text-muted-foreground text-sm">
                    Indicates the response body will not change during its
                    freshness lifetime, preventing unnecessary revalidation on
                    page reload. Best for versioned assets with hash filenames.
                    Support: Chrome, Firefox, Edge support it; Safari has
                    inconsistent support.
                  </p>
                  <!--$--><!--/-->
                </div>
              </div>
              <!--/-->
            </div>
            <div class="">
              <!--$-->
              <div class="mb-3">
                <h3 class="text-primary text-lg font-medium">
                  3. Cache Behavior for Fresh Responses
                </h3>
                <p class="text-muted-foreground mt-1 text-sm">
                  Controls whether fresh responses (within their freshness
                  lifetime) can be used without checking with the server first.
                </p>
              </div>
              <!--/--><!--$-->
              <div
                class="bg-card text-card-foreground rounded-xl border shadow space-y-4 p-4"
              >
                <div class="space-y-3">
                  <p class="text-sm font-medium">
                    How should caches handle responses that are still fresh?
                  </p>
                  <div class="flex flex-col gap-4">
                    <div>
                      <label class="flex items-center space-x-2"
                        ><input
                          type="radio"
                          name="freshBehavior"
                          value="default"
                          class="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                        /><span class="text-sm leading-none font-medium"
                          >Use fresh responses without revalidation</span
                        ></label
                      >
                      <div class="mt-2 ml-6">
                        <p class="text-sm">
                          This is the default behavior; the cache uses the
                          response if within its freshness period.
                        </p>
                        <p
                          class="text-muted-foreground border-primary/20 mt-1 border-l-2 pl-2 text-xs"
                        >
                          Caches can serve the response directly without
                          contacting the origin server as long as it's within
                          the max-age timeframe.
                        </p>
                      </div>
                    </div>
                    <div>
                      <label class="flex items-center space-x-2"
                        ><input
                          type="radio"
                          name="freshBehavior"
                          value="no-cache"
                          class="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                        /><span class="text-sm leading-none font-medium"
                          >Always revalidate responses (no-cache)</span
                        ></label
                      >
                      <div class="mt-2 ml-6">
                        <p class="text-sm">
                          Requires checking with the server before using any
                          cached response.<strong> Note:</strong> This does NOT
                          mean "don't cache" - the browser will still store the
                          response, but must validate it before use. For content
                          that should never be stored, use "no-store" instead.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!--/-->
            </div>
            <div class="">
              <!--$-->
              <div class="mb-3">
                <h3 class="text-primary text-lg font-medium">
                  4. Cache Behavior for Stale Responses
                </h3>
                <p class="text-muted-foreground mt-1 text-sm">
                  Controls how caches handle responses after they've become
                  stale (exceeded their freshness lifetime).
                </p>
              </div>
              <!--/--><!--$-->
              <div
                class="bg-card text-card-foreground rounded-xl border shadow space-y-4 p-4"
              >
                <div class="space-y-3">
                  <div class="flex items-center space-x-2">
                    <div role="group" id="checkbox-cl-56" data-checked="">
                      <div class="flex items-center space-x-2">
                        <!--$--><input
                          type="checkbox"
                          id="checkbox-cl-56-input"
                          name="checkbox-cl-56"
                          value="on"
                          aria-disabled="false"
                          data-checked=""
                          class="[&amp;:focus-visible+div]:ring-ring [&amp;:focus-visible+div]:ring-offset-background [&amp;:focus-visible+div]:ring-[1.5px] [&amp;:focus-visible+div]:ring-offset-2 [&amp;:focus-visible+div]:outline-none"
                          aria-labelledby="checkbox-cl-56-label"
                          style="
                            border: 0px;
                            clip: rect(0px, 0px, 0px, 0px);
                            clip-path: inset(50%);
                            height: 1px;
                            margin: 0px -1px -1px 0px;
                            overflow: hidden;
                            padding: 0px;
                            position: absolute;
                            width: 1px;
                            white-space: nowrap;
                          "
                        />
                        <div
                          data-checked=""
                          id="checkbox-cl-56-control"
                          class="border-primary focus-visible:ring-ring data-[checked]:bg-primary data-[checked]:text-primary-foreground h-4 w-4 shrink-0 rounded-sm border shadow transition-shadow focus-visible:ring-[1.5px] focus-visible:outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
                        >
                          <div
                            data-checked=""
                            id="checkbox-cl-56-indicator"
                            class="flex items-center justify-center text-current"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              class="h-4 w-4"
                            >
                              <path
                                fill="none"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="m5 12l5 5L20 7"
                              ></path>
                              <title>Checkbox</title>
                            </svg>
                          </div>
                        </div>
                        <!--/--><!--$--><label
                          id="checkbox-cl-56-label"
                          data-checked=""
                          class="text-sm leading-none font-medium"
                          for="checkbox-cl-56-input"
                          >Must Revalidate</label
                        ><!--/-->
                      </div>
                    </div>
                  </div>
                  <div class="mt-2 ml-6">
                    <p class="text-sm">
                      Once a response becomes stale, the cache MUST verify it
                      with the origin server before reuse. Prevents caches from
                      using stale responses when disconnected from the origin.
                    </p>
                    <p
                      class="text-muted-foreground border-primary/20 mt-1 border-l-2 pl-2 text-xs"
                    >
                      Ensures that stale responses are not used without checking
                      with the server, improving accuracy.
                    </p>
                  </div>
                </div>
                <div class="space-y-3">
                  <!--$-->
                  <div class="flex items-center space-x-2">
                    <div role="group" id="checkbox-cl-58">
                      <div class="flex items-center space-x-2">
                        <!--$--><input
                          type="checkbox"
                          id="checkbox-cl-58-input"
                          name="checkbox-cl-58"
                          value="on"
                          aria-disabled="false"
                          class="[&amp;:focus-visible+div]:ring-ring [&amp;:focus-visible+div]:ring-offset-background [&amp;:focus-visible+div]:ring-[1.5px] [&amp;:focus-visible+div]:ring-offset-2 [&amp;:focus-visible+div]:outline-none"
                          aria-labelledby="checkbox-cl-58-label"
                          style="
                            border: 0px;
                            clip: rect(0px, 0px, 0px, 0px);
                            clip-path: inset(50%);
                            height: 1px;
                            margin: 0px -1px -1px 0px;
                            overflow: hidden;
                            padding: 0px;
                            position: absolute;
                            width: 1px;
                            white-space: nowrap;
                          "
                        />
                        <div
                          id="checkbox-cl-58-control"
                          class="border-primary focus-visible:ring-ring data-[checked]:bg-primary data-[checked]:text-primary-foreground h-4 w-4 shrink-0 rounded-sm border shadow transition-shadow focus-visible:ring-[1.5px] focus-visible:outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
                        ></div>
                        <!--/--><!--$--><label
                          id="checkbox-cl-58-label"
                          class="text-sm leading-none font-medium"
                          for="checkbox-cl-58-input"
                          >Proxy Revalidate</label
                        ><!--/-->
                      </div>
                    </div>
                  </div>
                  <div class="mt-2 ml-6">
                    <p class="text-sm">
                      Similar to must-revalidate but only applies to shared
                      caches like CDNs. Allows browser caches to serve stale
                      content offline while requiring CDNs to revalidate.
                    </p>
                    <p
                      class="text-muted-foreground border-primary/20 mt-1 border-l-2 pl-2 text-xs"
                    >
                      Allows private caches to serve stale responses while
                      requiring shared caches to revalidate.
                    </p>
                  </div>
                  <!--/--><!--$--><!--/-->
                </div>
                <div class="border-border mt-2 space-y-3 border-t pt-2">
                  <!--$-->
                  <div>
                    <div class="relative space-y-2">
                      <div class="flex items-center space-x-2">
                        <div role="group" id="checkbox-cl-60" data-checked="">
                          <div class="flex items-center space-x-2">
                            <!--$--><input
                              type="checkbox"
                              id="checkbox-cl-60-input"
                              name="checkbox-cl-60"
                              value="on"
                              aria-disabled="false"
                              data-checked=""
                              class="[&amp;:focus-visible+div]:ring-ring [&amp;:focus-visible+div]:ring-offset-background [&amp;:focus-visible+div]:ring-[1.5px] [&amp;:focus-visible+div]:ring-offset-2 [&amp;:focus-visible+div]:outline-none"
                              aria-labelledby="checkbox-cl-60-label"
                              style="
                                border: 0px;
                                clip: rect(0px, 0px, 0px, 0px);
                                clip-path: inset(50%);
                                height: 1px;
                                margin: 0px -1px -1px 0px;
                                overflow: hidden;
                                padding: 0px;
                                position: absolute;
                                width: 1px;
                                white-space: nowrap;
                              "
                            />
                            <div
                              data-checked=""
                              id="checkbox-cl-60-control"
                              class="border-primary focus-visible:ring-ring data-[checked]:bg-primary data-[checked]:text-primary-foreground h-4 w-4 shrink-0 rounded-sm border shadow transition-shadow focus-visible:ring-[1.5px] focus-visible:outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
                            >
                              <div
                                data-checked=""
                                id="checkbox-cl-60-indicator"
                                class="flex items-center justify-center text-current"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  class="h-4 w-4"
                                >
                                  <path
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="m5 12l5 5L20 7"
                                  ></path>
                                  <title>Checkbox</title>
                                </svg>
                              </div>
                            </div>
                            <!--/--><!--$--><label
                              id="checkbox-cl-60-label"
                              data-checked=""
                              class="text-sm leading-none font-medium"
                              for="checkbox-cl-60-input"
                              >Stale While Revalidate</label
                            ><!--/-->
                          </div>
                        </div>
                      </div>
                      <!--$-->
                      <div class="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          step="1"
                          class="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        /><select
                          class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring inline-flex h-9 min-w-[100px] items-center justify-between rounded-md border px-3 py-2 text-sm shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="seconds">seconds</option>
                          <option value="minutes">minutes</option>
                          <option value="hours">hours</option>
                          <option value="days">days</option>
                        </select>
                      </div>
                      <p class="text-muted-foreground text-sm">
                        Allows serving stale content while revalidating in the
                        background. When a cached response becomes stale, it
                        returns the stale response immediately while fetching a
                        fresh copy in the background, eliminating waiting time
                        for users. Example: with max-age=60,
                        stale-while-revalidate=3600, content is fresh for 1
                        minute, then can be used while stale for up to 1 hour
                        during revalidation. Support varies across CDNs:
                        Cloudflare requires Enterprise plan, AWS CloudFront
                        needs Lambda@Edge, Fastly and Akamai fully support it.
                      </p>
                      <!--/-->
                    </div>
                  </div>
                  <!--/--><!--$-->
                  <div
                    role="alert"
                    class="relative w-full rounded-lg border px-4 py-3 text-sm [&amp;:has(svg)]:pl-11 [&amp;>svg+div]:translate-y-[-3px] [&amp;>svg]:absolute [&amp;>svg]:left-4 [&amp;>svg]:top-4 border-yellow-500/50 text-yellow-600 dark:border-yellow-500 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 [&amp;>svg]:text-yellow-600 dark:[&amp;>svg]:text-yellow-500 mt-2"
                  >
                    <div class="leading-5 font-medium tracking-tight">
                      Support Information:
                    </div>
                    <div class="text-sm [&amp;_p]:leading-relaxed">
                      <ul class="list-disc space-y-1 pl-4">
                        <li>
                          <strong>CDNs:</strong> Cloudflare (Enterprise plan),
                          Fastly (full support), Akamai (full support)
                        </li>
                        <li>
                          <strong>Not supported natively:</strong> AWS
                          CloudFront (requires Lambda@Edge)
                        </li>
                        <li>
                          <strong>Browsers:</strong> Chrome, Firefox, Edge
                          support it; Safari has limited support
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div
                    class="mt-3 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950/20"
                  >
                    <h4
                      class="mb-2 font-medium text-blue-700 dark:text-blue-400"
                    >
                      How stale-while-revalidate works:
                    </h4>
                    <p class="text-sm text-blue-700 dark:text-blue-400">
                      When a cached response becomes stale (exceeds max-age):
                    </p>
                    <ol
                      class="mt-2 list-decimal pl-5 text-sm text-blue-700 dark:text-blue-400"
                    >
                      <li>
                        The cached (stale) response is immediately returned to
                        the user
                      </li>
                      <li>
                        A background request is made to the server to get a
                        fresh version
                      </li>
                      <li>
                        The cache is updated with the fresh response for future
                        requests
                      </li>
                    </ol>
                    <p class="mt-2 text-sm text-blue-700 dark:text-blue-400">
                      <strong>Example:</strong> With
                      <code>max-age=60, stale-while-revalidate=3600</code>,
                      content is fresh for 1 minute, then can be served while
                      stale for up to 1 hour during background revalidation.
                    </p>
                  </div>
                  <!--/-->
                </div>
                <div class="border-border mt-2 space-y-3 border-t pt-2">
                  <!--$-->
                  <div>
                    <div class="relative space-y-2">
                      <div class="flex items-center space-x-2">
                        <div role="group" id="checkbox-cl-62">
                          <div class="flex items-center space-x-2">
                            <!--$--><input
                              type="checkbox"
                              id="checkbox-cl-62-input"
                              name="checkbox-cl-62"
                              value="on"
                              aria-disabled="false"
                              class="[&amp;:focus-visible+div]:ring-ring [&amp;:focus-visible+div]:ring-offset-background [&amp;:focus-visible+div]:ring-[1.5px] [&amp;:focus-visible+div]:ring-offset-2 [&amp;:focus-visible+div]:outline-none"
                              aria-labelledby="checkbox-cl-62-label"
                              style="
                                border: 0px;
                                clip: rect(0px, 0px, 0px, 0px);
                                clip-path: inset(50%);
                                height: 1px;
                                margin: 0px -1px -1px 0px;
                                overflow: hidden;
                                padding: 0px;
                                position: absolute;
                                width: 1px;
                                white-space: nowrap;
                              "
                            />
                            <div
                              id="checkbox-cl-62-control"
                              class="border-primary focus-visible:ring-ring data-[checked]:bg-primary data-[checked]:text-primary-foreground h-4 w-4 shrink-0 rounded-sm border shadow transition-shadow focus-visible:ring-[1.5px] focus-visible:outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
                            ></div>
                            <!--/--><!--$--><label
                              id="checkbox-cl-62-label"
                              class="text-sm leading-none font-medium"
                              for="checkbox-cl-62-input"
                              >Stale If Error</label
                            ><!--/-->
                          </div>
                        </div>
                      </div>
                      <!--$--><!--/-->
                    </div>
                  </div>
                  <!--/--><!--$--><!--/-->
                </div>
              </div>
              <!--/-->
            </div>
            <div>
              <!--$-->
              <div class="mb-3">
                <h3 class="text-primary text-lg font-medium">
                  5. Other Directives
                </h3>
                <p class="text-muted-foreground mt-1 text-sm">
                  Additional controls that can be applied to all responses
                  regardless of cache status.
                </p>
              </div>
              <!--/--><!--$-->
              <div
                class="bg-card text-card-foreground rounded-xl border shadow space-y-4 p-4"
              >
                <div class="space-y-3">
                  <!--$-->
                  <div class="flex items-center space-x-2">
                    <div role="group" id="checkbox-cl-64">
                      <div class="flex items-center space-x-2">
                        <!--$--><input
                          type="checkbox"
                          id="checkbox-cl-64-input"
                          name="checkbox-cl-64"
                          value="on"
                          class="[&amp;:focus-visible+div]:ring-ring [&amp;:focus-visible+div]:ring-offset-background [&amp;:focus-visible+div]:ring-[1.5px] [&amp;:focus-visible+div]:ring-offset-2 [&amp;:focus-visible+div]:outline-none"
                          aria-labelledby="checkbox-cl-64-label"
                          style="
                            border: 0px;
                            clip: rect(0px, 0px, 0px, 0px);
                            clip-path: inset(50%);
                            height: 1px;
                            margin: 0px -1px -1px 0px;
                            overflow: hidden;
                            padding: 0px;
                            position: absolute;
                            width: 1px;
                            white-space: nowrap;
                          "
                        />
                        <div
                          id="checkbox-cl-64-control"
                          class="border-primary focus-visible:ring-ring data-[checked]:bg-primary data-[checked]:text-primary-foreground h-4 w-4 shrink-0 rounded-sm border shadow transition-shadow focus-visible:ring-[1.5px] focus-visible:outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
                        ></div>
                        <!--/--><!--$--><label
                          id="checkbox-cl-64-label"
                          class="text-sm leading-none font-medium"
                          for="checkbox-cl-64-input"
                          >No Transform</label
                        ><!--/-->
                      </div>
                    </div>
                  </div>
                  <div class="mt-2 ml-6">
                    <p class="text-sm">
                      Prevents caches from modifying the response content (like
                      image compression). Ensures content integrity by
                      preventing proxies from altering your content in any way.
                    </p>
                    <p
                      class="text-muted-foreground border-primary/20 mt-1 border-l-2 pl-2 text-xs"
                    >
                      Ensures content integrity by preventing proxies from
                      modifying your content.
                    </p>
                  </div>
                  <!--/--><!--$--><!--/-->
                </div>
              </div>
              <!--/-->
            </div>
            <div class="flex justify-end">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-md font-medium transition-[color,background-color,box-shadow] focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 text-sm"
              >
                Reset to Defaults
              </button>
            </div>
            <div>
              <!--$-->
              <hr
                data-orientation="horizontal"
                class="bg-border shrink-0 data-[orientation=horizontal]:h-[1px] data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-[1px] my-4"
              />
              <!--/-->
              <h3 class="text-primary mb-3 text-lg font-medium">
                Directive Interactions
              </h3>
              <div class="text-muted-foreground space-y-2 text-sm">
                <p>
                  • <strong>no-store</strong> overrides all other directives; no
                  caching occurs
                </p>
                <p>
                  • <strong>no-cache</strong> requires revalidation even for
                  fresh responses, but still allows storing the response
                </p>
                <p>
                  • <strong>s-maxage</strong> only applies to shared caches
                  (relevant only for Public cache type)
                </p>
                <p>
                  • <strong>immutable</strong> prevents revalidation on page
                  refresh (HTTP/2+ support varies)
                </p>
                <p>
                  • <strong>must-revalidate</strong> requires revalidation when
                  stale
                </p>
                <p>
                  • <strong>max-age=0</strong> is different from
                  <strong>no-cache</strong>: max-age=0 makes content immediately
                  stale but doesn't prevent caching
                </p>
                <p>
                  • <strong>stale-while-revalidate</strong> and
                  <strong>stale-if-error</strong> provide grace periods for
                  using stale content
                </p>
              </div>
            </div>
          </div>
        </div>
        <!--/-->
      </div>
    </div>
  </div>
</main>
