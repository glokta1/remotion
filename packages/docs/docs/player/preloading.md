---
sidebar_label: "Preloading"
title: "Preloading assets"
---

By default, assets such as videos, audio, or images will only be loaded as they enter the video. When using the [Remotion Player](/docs/terminology#remotion-player), you may want to preload those assets beforehand to make them play immediately once they enter the video.

Two ways of preloading are supported:

- Signaling to the browser that assets should be loaded using the [`@remotion/preload`](/docs/preload) APIs
- Fetching the assets beforehand and then playing them locally using [`prefetch()`](/docs/prefetch)

## Preloading videos using `@remotion/preload`

By preloading, a `<link type='preload'>` tag is placed on the page, signaling to the browser that it may start loading the media.  
For videos, use [`preloadVideo()`](/docs/preload/preload-video) API, for audio use [`preloadAudio()`](/docs/preload/preload-audio). Perform the preload outside a component or inside an [`useEffect()`](https://reactjs.org/docs/hooks-effect.html).

```tsx twoslash
import { preloadAudio, preloadVideo } from "@remotion/preload";

const unpreloadVideo = preloadVideo("https://example.com/video.mp4");
const unpreloadAudio = preloadAudio(
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
);

// Later, you can optionally clean up the preload
unpreloadVideo();
unpreloadAudio();
```

## Prefetching using `prefetch()`

_Available in v3.2.23_

By prefetching, the full media is downloaded and turned into a Blob URL using [`URL.createObjectURL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL).  
If you pass the original URL into either an [`<Audio>`](/docs/audio), [`<Video>`](/docs/video), [`<OffthreadVideo>`](/docs/offthreadvideo) or [`<Img>`](/docs/img) tag and the asset is prefetched, those components will use Blob URL instead.

```tsx twoslash
import { prefetch } from "remotion";

const { free, waitUntilDone } = prefetch("https://example.com/video.mp4");

waitUntilDone().then(() => {
  console.log("Video has finished loading");
});

// Call free() if you want to un-prefetch and free up the memory:
free();
```

## `@remotion/preload` vs. `prefetch()`

[`prefetch()`](/docs/prefetch) is a more reliable way of ensuring the media is ready when it needs to displayed, but the asset needs to be downloaded in full for it.

[`@remotion/preload`](/docs/preload) is preferrable if the asset is large since you don't have to wait for it finish downloading,

<table>
  <tr>
    <th></th>
    <th>
      <div>
        <code>preloadAudio()</code><br />
        <code>preloadVideo()</code>
      </div>
    </th>
    <th>
      <div>
        <code>prefetch()</code>
      </div>
    </th>
  </tr>
  <tr>
    <td>Works with</td>
    <td>
    All audio and video APIs
    </td>
    <td>
    <a href="/docs/audio"><code>{"<Audio/>"}</code></a>, <a href="/docs/video"><code>{"<Video/>"}</code></a>, <a href="/docs/img"><code>{"<Img/>"}</code></a>, <a href="/docs/offthreadvideo"><code>{"<OffthreadVideo/>"}</code></a>
    </td>
  </tr>
  <tr>
    <td>Mechanism</td>
    <td>
        Inserts a <code>{"<link type='preload'>"}</code> tag
    </td>
    <td>
    Fetches the asset and turns it into a URL blob
    </td>
  </tr>
  <tr>
    <td>Readiness</td>
    <td style={{color: "green"}}>
      Ready to play when asset is partially loaded
    </td>
    <td style={{color: "red"}}>
      Asset must be fully fetched
    </td>
  </tr>
  <tr>
    <td>Reliability</td>
    <td style={{color: "red"}}>
  No guarantee, just a signal to the browser
    </td>
    <td style={{color: "green"}}>
  Guaranteed to be ready
    </td>
  </tr>
    <tr>
    <td>Callback</td>
    <td style={{
      color: "red"
    }}>
      No way to determine if ready
    </td>
    <td style={{
      color: "green"
    }}>
      Ready when promise resolves
    </td>
  </tr>
  <tr>
    <td>Package</td>
    <td>
      @remotion/preload
    </td>
    <td>
      remotion
    </td>
  </tr>
  <tr>
    <td>Handles HTTP redirects</td>
    <td>
    Must use <a href="/docs/preload/resolve-redirect"><code>resolveRedirect()</code></a>
    </td>
    <td>
      Handled automatically
    </td>
  </tr>
  <tr>
    <td><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS">CORS</a></td>
    <td>
      Resource must support CORS if <a href="/docs/preload/resolve-redirect"><code>resolveRedirect()</code></a> is used
    </td>
    <td>
      Resource must support CORS
    </td>
  </tr>
  <tr>
    <td>Available from</td>
    <td>
        v3.0.14
    </td>
    <td>
    v3.2.23
    </td>
  </tr>
</table>

## See also

- [`@remotion/preload`](/docs/preload)
- [`prefetch()`](/docs/prefetch)
