# Demo sandbox

Open `/demo` or `/?demo=1` to load the sample. The first screen shows a generated three-game picklist from five fictional board games.

The demo uses only `localStorage['demo:shelf-rotation-picklist:v1']`. It never reads or writes `shelf-rotation-picklist:v1`, the real shelf namespace. **Reset demo** restores the five-game seed. **Start for real** discards the demo namespace and opens an empty real shelf.

The sample is available after the first service-worker-controlled visit, so the offline claim can be checked entirely in this sandbox.
