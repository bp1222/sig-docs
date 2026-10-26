var e=e=>{switch(e){case`capsules`:return`direction: down

SigCapsules: {
  label: "Capsules"

  Shim: {
    label: "Built-in capsule registration"
  }
  Instance: {
    label: "Capsule instance"
  }
  Routes: {
    label: "Routes and notify"
  }
  Registry: {
    label: "Capsule registry"
  }
  Configuration: {
    label: "Capsule configuration"
  }
  Terminals: {
    label: "Terminal handlers"
  }
  Capsule: {
    label: "Capsule"
  }
}

SigCapsules.Shim -> SigCapsules.Registry: "registers each built-in capsule"
SigCapsules.Configuration -> SigCapsules.Capsule: "validates against the property table of the capsule"
SigCapsules.Instance -> SigCapsules.Configuration: "resolves property values at start"
SigCapsules.Routes -> SigCapsules.Terminals: "finds the destination input terminal by name"
`;case`capsules_components`:return`direction: down

SigHost: {
  label: "Host"
}
SigMgmt: {
  label: "Management"
}
SigProject: {
  label: "Project"
}
SigService: {
  label: "Service"
}
SigCapsules: {
  label: "Capsules"

  Shim: {
    label: "Built-in capsule registration"
  }
  Instance: {
    label: "Capsule instance"
  }
  Routes: {
    label: "Routes and notify"
  }
  Registry: {
    label: "Capsule registry"
  }
  Configuration: {
    label: "Capsule configuration"
  }
  Terminals: {
    label: "Terminal handlers"
  }
  Capsule: {
    label: "Capsule"
  }
}
SigHttp: {
  label: "HTTP"
}
SigFoundation: {
  label: "Foundation"
}

SigHost -> SigCapsules.Registry: "creates the registry before the run and destroys it after"
SigHost -> SigCapsules.Shim: "sig_builtin_capsules_register"
SigMgmt -> SigCapsules.Registry: "walks the registered capsules and their property tables"
SigMgmt -> SigCapsules.Configuration: "walks the property values of an instance"
SigMgmt -> SigCapsules.Instance: "instance name, configuration, type and terminals"
SigMgmt -> SigCapsules.Routes: "sig_capsule_instance_walk_routes for the links of a service"
SigProject -> SigCapsules.Registry: "looks up the type of a configuration"
SigProject -> SigCapsules.Configuration: "[...]"
SigProject -> SigCapsules.Instance: "[...]"
SigProject -> SigCapsules.Routes: "wires receivers with sig_capsule_instance_connect"
SigService -> SigCapsules.Instance: "resolves properties, then runs start hooks on the calling thread; stop hooks after the join"
SigService -> SigCapsules.Terminals: "[...]"
SigCapsules.Shim -> SigCapsules.Registry: "registers each built-in capsule"
SigCapsules.Configuration -> SigCapsules.Capsule: "validates against the property table of the capsule"
SigCapsules.Instance -> SigCapsules.Configuration: "resolves property values at start"
SigCapsules.Routes -> SigCapsules.Terminals: "finds the destination input terminal by name"
SigCapsules.Registry -> SigFoundation: "[...]"
SigCapsules.Configuration -> SigFoundation: "boxed property values"
SigCapsules.Instance -> SigFoundation: "[...]"
SigCapsules.Instance -> SigService: "schedule and cancel jobs on instance->service"
SigCapsules.Routes -> SigFoundation: "one sig_ll of routes per output terminal"
SigCapsules.Routes -> SigService: "[...]"
SigCapsules.Shim -> SigHttp: "the weather capsule, if listed in SIG_CAPSULES and SIG_HTTP_CLIENT is on, takes sig_http_get_async as its transport (weather_capsule.h includes sig_http_client.h)"
`;case`index`:return`direction: down

Operator: {
  label: "Operator"
  shape: c4-person
}
Browser: {
  label: "Browser UI"
  shape: c4-person
}
Cli: {
  label: "curl and scripts"
  shape: c4-person
}
Sig: {
  label: "libsig"

  Host: {
    label: "Host"
  }
  Http: {
    label: "HTTP"
  }
  Persistence: {
    label: "Persistence"
  }
  Feed: {
    label: "Signal feed"
  }
  Platform: {
    label: "Platform"
  }
}
Store: {
  label: "Project store"
  shape: stored_data
}
Network: {
  label: "Network"
}

Operator -> Sig.Host: "runs sighost with a project directory and options (host/posix/main.c: -p -l -m -o -s -h)"
Browser -> Sig.Http: "REST/JSON over HTTP"
Cli -> Sig.Http: "REST/JSON over HTTP"
Sig.Host -> Sig.Http: "registers the server (with -m)"
Browser -> Sig.Feed: "WebSocket on /feed"
Sig.Host -> Sig.Feed: "registers the feed (with -m, when built)"
Sig.Http -> Sig.Feed: "[...]"
Sig.Feed -> Sig.Http: "WebSocket upgrade on the server"
Sig.Host -> Sig.Persistence: "opens the store"
Sig.Persistence -> Store: "reads at project load; rewrites on edit (temp file, then rename)"
Sig.Http -> Sig.Platform: "sockets, threads, clock"
Sig.Feed -> Sig.Platform: "threads, clock, sockets"
Sig.Platform -> Network: "sig_net (the optional sig::net target, SIG_NET): listen, accept, read and write"
`;case`feed`:return`direction: down

SigFeed: {
  label: "Signal feed"

  Module: {
    label: "Feed module"
  }
  Upgrade: {
    label: "Upgrade handler"
  }
  Tap: {
    label: "Tap callback"
  }
  Connection: {
    label: "WebSocket connection"
  }
  Hub: {
    label: "Subscription hub"
  }
  Messages: {
    label: "Message encoding"
  }
  Queue: {
    label: "Subscription queue"
  }
}

SigFeed.Module -> SigFeed.Hub: "creates it in create, destroys it in destroy"
SigFeed.Upgrade -> SigFeed.Connection: "adopts the connection: directly on the loop thread, or via the hand-off list"
SigFeed.Connection -> SigFeed.Hub: "subscribe and unsubscribe, on the loop thread"
SigFeed.Connection -> SigFeed.Queue: "sig_feed_sub_pop for each subscription on every flush tick"
SigFeed.Connection -> SigFeed.Messages: "parses commands; encodes events, replies and errors"
SigFeed.Hub -> SigFeed.Queue: "creates a queue with each subscription"
SigFeed.Tap -> SigFeed.Queue: "offers a copy to each matching subscription"
`;case`feed_components`:return`direction: down

SigHost: {
  label: "Host"
}
SigHttp: {
  label: "HTTP"
}
SigService: {
  label: "Service"
}
SigFeed: {
  label: "Signal feed"

  Module: {
    label: "Feed module"
  }
  Upgrade: {
    label: "Upgrade handler"
  }
  Tap: {
    label: "Tap callback"
  }
  Connection: {
    label: "WebSocket connection"
  }
  Hub: {
    label: "Subscription hub"
  }
  Messages: {
    label: "Message encoding"
  }
  Queue: {
    label: "Subscription queue"
  }
}
SigPlatform: {
  label: "Platform"
}
SigRuntime: {
  label: "Runtime"
}
SigFoundation: {
  label: "Foundation"
}

SigHost -> SigFeed.Module: "sig_signal_feed_module, with -m when the feed was built"
SigHttp -> SigFeed.Upgrade: "[...]"
SigService -> SigFeed.Tap: "calls the installed function on the emitting thread (the feed is the only user of sig_runtime_set_tap in this repository)"
SigFeed.Module -> SigFeed.Hub: "creates it in create, destroys it in destroy"
SigFeed.Upgrade -> SigFeed.Connection: "adopts the connection: directly on the loop thread, or via the hand-off list"
SigFeed.Connection -> SigFeed.Hub: "subscribe and unsubscribe, on the loop thread"
SigFeed.Connection -> SigFeed.Queue: "sig_feed_sub_pop for each subscription on every flush tick"
SigFeed.Connection -> SigFeed.Messages: "parses commands; encodes events, replies and errors"
SigFeed.Hub -> SigFeed.Queue: "creates a queue with each subscription"
SigFeed.Tap -> SigFeed.Queue: "offers a copy to each matching subscription"
SigFeed.Module -> SigFoundation: "logs why a connection was dropped, and configuration errors"
SigFeed.Module -> SigHttp: "sig_http_server_from_runtime and sig_http_server_register_upgrade(\\"/feed\\") in create"
SigFeed.Module -> SigPlatform: "sig_thread_create and sig_thread_join for the private loop thread; a mutex for the running flag and counts"
SigFeed.Module -> SigRuntime: "[...]"
SigFeed.Upgrade -> SigHttp: "sig_ws_accept_key for the 101 response; sig_ws_encode for the 1013 close"
SigFeed.Upgrade -> SigPlatform: "one non-blocking write for the refusal, then closes the socket"
SigFeed.Connection -> SigHttp: "sig_ws_decode of client frames; sig_ws_encode of every server frame"
SigFeed.Connection -> SigPlatform: "[...]"
SigFeed.Connection -> SigRuntime: "sig_loop_watch_fd, watch_modify and the flush timer"
SigFeed.Hub -> SigPlatform: "a mutex serializing hub calls and a reader-writer lock over the subscription table"
SigFeed.Hub -> SigRuntime: "[...]"
SigFeed.Queue -> SigFoundation: "[...]"
SigFeed.Messages -> SigFoundation: "sig_json writer; sig_value_from_json and sig_value_to_json"
`;case`feed_subscription`:return`direction: right

SigHttpDispatch: {
  label: "Request evaluation and routing"
}
SigHttpLooped: {
  label: "Event-loop transport"
}
SigFeedUpgrade: {
  label: "Upgrade handler"
}
SigHttpWs: {
  label: "WebSocket primitives"
}
SigFeedConnection: {
  label: "WebSocket connection"
}
SigFeedMessages: {
  label: "Message encoding"
}
SigFeedHub: {
  label: "Subscription hub"
}
SigRuntimeControl: {
  label: "Control mutex (edit lock)"
}
SigRuntimeTap: {
  label: "Signal tap installation"
}
SigServiceTap: {
  label: "Tap slot"
}
SigFeedTap: {
  label: "Tap callback"
}
SigFeedQueue: {
  label: "Subscription queue"
}
SigPlatformNet: {
  label: "TCP sockets"
}

SigHttpDispatch -> SigHttpDispatch: "GET /feed with Upgrade: websocket: the request is read in full, request_authorized() accepts it, Sec-WebSocket-Version must be 13, the key non-empty, and an Origin header, if present, must equal cors_origin (else 400 or 403). The longest upgrade prefix \\"/feed\\" matches"
SigHttpLooped -> SigFeedUpgrade: "the server unwatches the fd and offers the non-blocking connection to on_upgrade (the threaded transport does the same from its server thread)"
SigFeedUpgrade -> SigHttpWs: "sig_ws_accept_key for the Sec-WebSocket-Accept value"
SigFeedUpgrade -> SigFeedConnection: "fewer than 8 connections: the connection is adopted, watched on the loop, the 101 response queued and written, the 20 ms flush timer armed. (The ninth gets 101 plus a close frame 1013.)"
SigFeedConnection -> SigHttpWs: "client frame {\\"op\\":\\"subscribe\\",\\"id\\":\\"a\\",\\"service\\":\\"S\\",\\"instance\\":\\"I\\",\\"terminal\\":\\"T\\"} is decoded and unmasked (at most 4096 bytes)"
SigFeedConnection -> SigFeedMessages: "sig_feed_parse_command: names must be 1 to 63 bytes"
SigFeedConnection -> SigFeedHub: "sig_feed_hub_subscribe (an id already in use is bad_request, a 17th subscription is too_many; both are answered without calling the hub)"
SigFeedHub -> SigRuntimeControl: "sig_runtime_find_terminal under the control mutex: not_found if the names do not exist, bad_request if the runtime is not running; gives the direction"
SigFeedHub -> SigRuntimeTap: "sig_runtime_set_tap(hub_tap): the subscription is already in the hub table, and the tap is installed on this subscribe (a later subscribe installs it again)"
SigRuntimeTap -> SigServiceTap: "the tap is stored on every service of the running project; a service rebuilt later gets it too"
SigFeedConnection -> SigFeedMessages: "reply {\\"op\\":\\"subscribed\\",\\"id\\":\\"a\\",\\"dir\\":\\"in|out\\"} is encoded and queued for the socket"
SigServiceTap -> SigFeedTap: "a signal crosses the terminal: sig_service_tap_emit calls hub_tap on the emitting thread, before an input handler or when an output is notified"
SigFeedTap -> SigFeedQueue: "for each subscription matching direction, terminal, instance and service name: a copy is queued with the next seq and a timestamp, or, when the queue is full or the value too large, a drop is counted (merged with a drop already at the tail). No I/O"
SigFeedConnection -> SigFeedQueue: "flush tick, within 20 ms: sig_feed_sub_pop returns signals in order, with a dropped event with its count at the place where values were lost"
SigFeedConnection -> SigFeedMessages: "each event is encoded as a signal or dropped message"
SigFeedConnection -> SigPlatformNet: "frames are written to the socket; if more than 1 MiB is unsent, popping and reading stop until the client catches up, and the queues drop"
SigFeedConnection -> SigFeedHub: "unsubscribe, or the connection closing: the subscription is freed. When the last subscription goes, the hub asks the runtime to remove the tap"
`;case`foundation`:return`direction: down

SigFoundation: {
  label: "Foundation"

  Status: {
    label: "Status codes"
  }
  Json: {
    label: "JSON"
  }
  Expressions: {
    label: "Expressions"
  }
  Python: {
    label: "Python bindings"
  }
  Values: {
    label: "Values"
  }
  Containers: {
    label: "Hash table and list"
  }
  Logging: {
    label: "Logging"
  }
  Allocation: {
    label: "Allocation"
  }
  Refcount: {
    label: "Reference counts"
  }
}

SigFoundation.Containers -> SigFoundation.Allocation: "allocates nodes and buckets"
SigFoundation.Values -> SigFoundation.Allocation: "allocates strings and bytes"
SigFoundation.Json -> SigFoundation.Allocation: "grows output buffers"
SigFoundation.Expressions -> SigFoundation.Allocation: "compiles to heap nodes"
SigFoundation.Containers -> SigFoundation.Refcount: "counts references"
SigFoundation.Values -> SigFoundation.Refcount: "counts references to shared payloads"
SigFoundation.Values -> SigFoundation.Containers: "maps and lists are a sig_ht and a sig_ll"
SigFoundation.Values -> SigFoundation.Logging: "logs refused mutations at debug level"
SigFoundation.Json -> SigFoundation.Values: "walks and builds sig_value trees"
SigFoundation.Expressions -> SigFoundation.Values: "evaluates against a sig_value"
SigFoundation.Python -> SigFoundation.Values: "converts sig_value trees"
`;case`foundation_components`:return`direction: down

SigCapsules: {
  label: "Capsules"
}
SigFeed: {
  label: "Signal feed"
}
SigHost: {
  label: "Host"
}
SigHttp: {
  label: "HTTP"
}
SigMgmt: {
  label: "Management"
}
SigPersistence: {
  label: "Persistence"
}
SigPlatform: {
  label: "Platform"
}
SigProject: {
  label: "Project"
}
SigRuntime: {
  label: "Runtime"
}
SigService: {
  label: "Service"
}
SigFoundation: {
  label: "Foundation"

  Json: {
    label: "JSON"
  }
  Expressions: {
    label: "Expressions"
  }
  Python: {
    label: "Python bindings"
  }
  Values: {
    label: "Values"
  }
  Containers: {
    label: "Hash table and list"
  }
  Logging: {
    label: "Logging"
  }
  Allocation: {
    label: "Allocation"
  }
  Refcount: {
    label: "Reference counts"
  }
  Status: {
    label: "Status codes"
  }
}

SigCapsules -> SigFoundation.Allocation: "allocates the registry"
SigCapsules -> SigFoundation.Containers: "[...]"
SigCapsules -> SigFoundation.Logging: "logs resolve errors"
SigCapsules -> SigFoundation.Values: "boxed property values"
SigFeed -> SigFoundation.Allocation: "entries"
SigFeed -> SigFoundation.Containers: "entries kept in a sig_ll"
SigFeed -> SigFoundation.Logging: "logs why a connection was dropped, and configuration errors"
SigFeed -> SigFoundation.Values: "sig_value_dup copies the signal"
SigFeed -> SigFoundation.Json: "sig_json writer; sig_value_from_json and sig_value_to_json"
SigHost -> SigFoundation.Allocation: "allocates its state"
SigHost -> SigFoundation.Logging: "[...]"
SigHttp -> SigFoundation.Allocation: "[...]"
SigHttp -> SigFoundation.Logging: "[...]"
SigMgmt -> SigFoundation.Values: "[...]"
SigMgmt -> SigFoundation.Json: "sig_json writer, sig_value_from_json for the rename body"
SigPersistence -> SigFoundation.Allocation: "[...]"
SigPersistence -> SigFoundation.Containers: "backends kept in a sig_ht"
SigPersistence -> SigFoundation.Logging: "trace line after a successful load, save or remove"
SigPlatform -> SigFoundation.Allocation: "[...]"
SigPlatform -> SigFoundation.Logging: "logs listen failures"
SigProject -> SigFoundation.Allocation: "allocates the project and its tables"
SigProject -> SigFoundation.Logging: "logs load progress and failures"
SigProject -> SigFoundation.Json: "[...]"
SigRuntime -> SigFoundation.Allocation: "[...]"
SigRuntime -> SigFoundation.Logging: "[...]"
SigService -> SigFoundation.Allocation: "allocates the service and its tables"
SigService -> SigFoundation.Containers: "[...]"
SigService -> SigFoundation.Logging: "logs start, stop and hook failures"
SigService -> SigFoundation.Values: "sig_value_dup copies the signal"
SigFoundation.Containers -> SigFoundation.Allocation: "allocates nodes and buckets"
SigFoundation.Values -> SigFoundation.Allocation: "allocates strings and bytes"
SigFoundation.Json -> SigFoundation.Allocation: "grows output buffers"
SigFoundation.Expressions -> SigFoundation.Allocation: "compiles to heap nodes"
SigFoundation.Containers -> SigFoundation.Refcount: "counts references"
SigFoundation.Values -> SigFoundation.Refcount: "counts references to shared payloads"
SigFoundation.Values -> SigFoundation.Containers: "maps and lists are a sig_ht and a sig_ll"
SigFoundation.Values -> SigFoundation.Logging: "logs refused mutations at debug level"
SigFoundation.Json -> SigFoundation.Values: "walks and builds sig_value trees"
SigFoundation.Expressions -> SigFoundation.Values: "evaluates against a sig_value"
SigFoundation.Python -> SigFoundation.Values: "converts sig_value trees"
SigFoundation.Logging -> SigPlatform: "serializes writes with a sig_mutex"
`;case`host`:return`direction: down

SigHost: {
  label: "Host"

  Entry: {
    label: "sighost entry point"
  }
  Runner: {
    label: "Boot runner"
  }
  Shutdown: {
    label: "POSIX shutdown trigger"
  }
}

SigHost.Runner -> SigHost.Shutdown: "arm_shutdown before start; disarm_shutdown after stop"
SigHost.Entry -> SigHost.Runner: "sig_host_run with the file store, the registry, the modules and the flag"
SigHost.Entry -> SigHost.Shutdown: "sig_host_posix_platform supplies the hooks"
`;case`host_components`:return`direction: down

SigHost: {
  label: "Host"

  Entry: {
    label: "sighost entry point"
  }
  Runner: {
    label: "Boot runner"
  }
  Shutdown: {
    label: "POSIX shutdown trigger"
  }
}
SigCapsules: {
  label: "Capsules"
}
SigFeed: {
  label: "Signal feed"
}
SigHttp: {
  label: "HTTP"
}
SigMgmt: {
  label: "Management"
}
SigPersistence: {
  label: "Persistence"
}
SigFoundation: {
  label: "Foundation"
}
SigRuntime: {
  label: "Runtime"
}

SigHost.Runner -> SigHost.Shutdown: "arm_shutdown before start; disarm_shutdown after stop"
SigHost.Entry -> SigHost.Runner: "sig_host_run with the file store, the registry, the modules and the flag"
SigHost.Entry -> SigHost.Shutdown: "sig_host_posix_platform supplies the hooks"
SigHost.Runner -> SigFoundation: "logs the store that was opened"
SigHost.Runner -> SigPersistence: "sig_persistence_create opens the store; sig_persistence_destroy closes it last"
SigHost.Runner -> SigRuntime: "[...]"
SigHost.Shutdown -> SigFoundation: "[...]"
SigHost.Shutdown -> SigRuntime: "[...]"
SigHost.Entry -> SigCapsules: "[...]"
SigHost.Entry -> SigFeed: "sig_signal_feed_module, with -m when the feed was built"
SigHost.Entry -> SigFoundation: "sig_log_init and sig_log_shutdown"
SigHost.Entry -> SigHttp: "sig_http_server_module, with -m"
SigHost.Entry -> SigMgmt: "[...]"
SigHost.Entry -> SigPersistence: "passes sig_persistence_file_module and the project directory"
`;case`http`:return`direction: down

SigHttp: {
  label: "HTTP"

  Server: {
    label: "Server module"
  }
  Threaded: {
    label: "Threaded transport"
  }
  Looped: {
    label: "Event-loop transport"
  }
  Dispatch: {
    label: "Request evaluation and routing"
  }
  Parser: {
    label: "Request parser and response formatter"
  }
  Ws: {
    label: "WebSocket primitives"
  }
  Client: {
    label: "HTTP client"
  }
}

SigHttp.Server -> SigHttp.Dispatch: "both transports evaluate each request through it"
SigHttp.Server -> SigHttp.Threaded: "starts the server thread when the runtime has no loop; sets the stop flag and joins at stop"
SigHttp.Server -> SigHttp.Looped: "watches the listener on the loop when the runtime has one"
SigHttp.Dispatch -> SigHttp.Parser: "sig_http_parse_head and sig_http_format_response"
SigHttp.Threaded -> SigHttp.Dispatch: "evaluate_request for each connection"
SigHttp.Looped -> SigHttp.Dispatch: "evaluate_request when a readable event has data"
`;case`http_components`:return`direction: down

SigCapsules: {
  label: "Capsules"
}
SigFeed: {
  label: "Signal feed"
}
SigHost: {
  label: "Host"
}
SigMgmt: {
  label: "Management"
}
SigHttp: {
  label: "HTTP"

  Client: {
    label: "HTTP client"
  }
  Server: {
    label: "Server module"
  }
  Ws: {
    label: "WebSocket primitives"
  }
  Threaded: {
    label: "Threaded transport"
  }
  Looped: {
    label: "Event-loop transport"
  }
  Dispatch: {
    label: "Request evaluation and routing"
  }
  Parser: {
    label: "Request parser and response formatter"
  }
}
SigFoundation: {
  label: "Foundation"
}
SigPlatform: {
  label: "Platform"
}
SigRuntime: {
  label: "Runtime"
}

SigCapsules -> SigHttp.Client: "the weather capsule, if listed in SIG_CAPSULES and SIG_HTTP_CLIENT is on, takes sig_http_get_async as its transport (weather_capsule.h includes sig_http_client.h)"
SigFeed -> SigHttp.Server: "sig_http_server_from_runtime and sig_http_server_register_upgrade(\\"/feed\\") in create"
SigFeed -> SigHttp.Ws: "[...]"
SigHost -> SigHttp.Server: "sig_http_server_module, with -m"
SigMgmt -> SigHttp.Server: "sig_http_server_from_runtime and sig_http_server_register(\\"/\\") in its create hook"
SigHttp.Server -> SigHttp.Dispatch: "both transports evaluate each request through it"
SigHttp.Server -> SigHttp.Threaded: "starts the server thread when the runtime has no loop; sets the stop flag and joins at stop"
SigHttp.Server -> SigHttp.Looped: "watches the listener on the loop when the runtime has one"
SigHttp.Dispatch -> SigHttp.Parser: "sig_http_parse_head and sig_http_format_response"
SigHttp.Threaded -> SigHttp.Dispatch: "evaluate_request for each connection"
SigHttp.Looped -> SigHttp.Dispatch: "evaluate_request when a readable event has data"
SigHttp.Server -> SigFoundation: "[...]"
SigHttp.Server -> SigPlatform: "[...]"
SigHttp.Server -> SigRuntime: "registered as the runtime module \\"http_server\\"; create, start, stop and destroy hooks"
SigHttp.Dispatch -> SigMgmt: "runs the handler registered for the longest matching prefix, \\"/\\" here"
SigHttp.Threaded -> SigFeed: "offers a validated upgrade connection on the server thread"
SigHttp.Threaded -> SigPlatform: "[...]"
SigHttp.Looped -> SigFeed: "offers a validated upgrade connection on the loop thread, with the fd already unwatched"
SigHttp.Looped -> SigPlatform: "[...]"
SigHttp.Looped -> SigRuntime: "sig_loop_watch_fd, sig_loop_watch_modify, sig_loop_timer_start for connections and the listener"
SigHttp.Client -> SigFoundation: "[...]"
`;case`mgmt`:return`direction: down

SigMgmt: {
  label: "Management"

  Glue: {
    label: "HTTP glue module"
  }
  Module: {
    label: "Mgmt module"
  }
  Rest: {
    label: "REST router"
  }
  Actions: {
    label: "Service actions"
  }
  Edits: {
    label: "Edit operations"
  }
  Status: {
    label: "Status mapping and JSON rendering"
  }
  Reads: {
    label: "Read operations"
  }
}

SigMgmt.Glue -> SigMgmt.Module: "sig_mgmt_from_runtime in its create hook"
SigMgmt.Actions -> SigMgmt.Reads: "builds the returned {name, state} tree under the shared lock"
SigMgmt.Rest -> SigMgmt.Reads: "GET routes"
SigMgmt.Rest -> SigMgmt.Actions: "POST start, stop, restart and shutdown routes"
SigMgmt.Rest -> SigMgmt.Edits: "PUT, PATCH, DELETE and rename routes"
SigMgmt.Rest -> SigMgmt.Status: "maps statuses to HTTP and renders the result tree"
SigMgmt.Glue -> SigMgmt.Rest: "the registered handler calls sig_mgmt_rest_handle"
`;case`mgmt_components`:return`direction: down

SigHost: {
  label: "Host"
}
SigHttp: {
  label: "HTTP"
}
SigMgmt: {
  label: "Management"

  Glue: {
    label: "HTTP glue module"
  }
  Module: {
    label: "Mgmt module"
  }
  Rest: {
    label: "REST router"
  }
  Actions: {
    label: "Service actions"
  }
  Edits: {
    label: "Edit operations"
  }
  Status: {
    label: "Status mapping and JSON rendering"
  }
  Reads: {
    label: "Read operations"
  }
}
SigCapsules: {
  label: "Capsules"
}
SigFoundation: {
  label: "Foundation"
}
SigPlatform: {
  label: "Platform"
}
SigProject: {
  label: "Project"
}
SigRuntime: {
  label: "Runtime"
}
SigService: {
  label: "Service"
}

SigHost -> SigMgmt.Module: "sig_mgmt_module, with -m"
SigHost -> SigMgmt.Glue: "sig_mgmt_http_module, with -m"
SigHttp -> SigMgmt.Glue: "runs the handler registered for the longest matching prefix, \\"/\\" here"
SigMgmt.Glue -> SigMgmt.Module: "sig_mgmt_from_runtime in its create hook"
SigMgmt.Actions -> SigMgmt.Reads: "builds the returned {name, state} tree under the shared lock"
SigMgmt.Rest -> SigMgmt.Reads: "GET routes"
SigMgmt.Rest -> SigMgmt.Actions: "POST start, stop, restart and shutdown routes"
SigMgmt.Rest -> SigMgmt.Edits: "PUT, PATCH, DELETE and rename routes"
SigMgmt.Rest -> SigMgmt.Status: "maps statuses to HTTP and renders the result tree"
SigMgmt.Glue -> SigMgmt.Rest: "the registered handler calls sig_mgmt_rest_handle"
SigMgmt.Module -> SigPlatform: "[...]"
SigMgmt.Module -> SigRuntime: "registered as the runtime module \\"mgmt\\"; create and destroy hooks only"
SigMgmt.Reads -> SigCapsules: "[...]"
SigMgmt.Reads -> SigFoundation: "builds the result trees with sig_value maps and lists"
SigMgmt.Reads -> SigPlatform: "sig_rwlock_rdlock around every read"
SigMgmt.Reads -> SigProject: "[...]"
SigMgmt.Reads -> SigRuntime: "sig_runtime_walk_modules for the module names"
SigMgmt.Reads -> SigService: "walks the instances of a service, its name, its running flag"
SigMgmt.Actions -> SigPlatform: "shared lock for the lookup, exclusive lock for the rebuild"
SigMgmt.Actions -> SigProject: "sig_project_refresh_service rebuilds a stopped, dirty service"
SigMgmt.Actions -> SigRuntime: "[...]"
SigMgmt.Edits -> SigFoundation: "builds the result tree from the definition text"
SigMgmt.Edits -> SigPlatform: "sig_rwlock_wrlock around the edit"
SigMgmt.Edits -> SigProject: "[...]"
SigMgmt.Edits -> SigRuntime: "sig_runtime_edit runs the project edit under the control lock"
SigMgmt.Status -> SigFoundation: "sig_json writer, sig_value_from_json for the rename body"
SigMgmt.Glue -> SigHttp: "sig_http_server_from_runtime and sig_http_server_register(\\"/\\") in its create hook"
SigMgmt.Glue -> SigRuntime: "registered as the runtime module \\"mgmt_http\\"; create hook only"
`;case`edit_and_restart`:return`direction: right

SigHttpDispatch: {
  label: "Request evaluation and routing"
}
SigMgmtGlue: {
  label: "HTTP glue module"
}
SigMgmtRest: {
  label: "REST router"
}
SigMgmtEdits: {
  label: "Edit operations"
}
SigRuntimeControl: {
  label: "Control mutex (edit lock)"
}
SigProjectEditing: {
  label: "Editing"
}
SigProjectParser: {
  label: "Config parser"
}
SigPersistenceStore: {
  label: "Store interface"
}
SigPersistenceFile: {
  label: "File backend"
}
SigPersistenceAtomic: {
  label: "Atomic save"
}
SigProjectDirty: {
  label: "Dirty tracking"
}
SigMgmtActions: {
  label: "Service actions"
}
SigServiceLifecycle: {
  label: "Start and stop"
}
SigMgmtReads: {
  label: "Read operations"
}

SigHttpDispatch -> SigMgmtGlue: "PATCH /configurations/Sim: the server has read the whole request, request_authorized() accepted it, and the longest matching prefix is \\"/\\", whose handler is the glue"
SigMgmtGlue -> SigMgmtRest: "sig_mgmt_rest_handle(method, path, body) splits and decodes the path and finds the PATCH route (400 if the body is empty)"
SigMgmtRest -> SigMgmtEdits: "sig_mgmt_patch_configuration: the exclusive mgmt lock is taken, so in-flight reads drain first"
SigMgmtEdits -> SigRuntimeControl: "sig_runtime_edit runs the project edit under the runtime control mutex (SIG_ERR_STATE if the runtime is not RUNNING)"
SigRuntimeControl -> SigProjectEditing: "sig_project_patch_configuration: the JSON patch is merged over the stored text, then put_configuration runs"
SigProjectEditing -> SigProjectParser: "the merged document is parsed exactly as at load, then checked against the property table of its capsule (sig_capsule_configuration_validate); nothing is written if either fails (422 with the reason)"
SigProjectEditing -> SigPersistenceStore: "save_doc: the document plus a newline goes to sig_persistence_save(\\"configurations\\", \\"Sim\\")"
SigPersistenceStore -> SigPersistenceFile: "the namespace and key are checked against the file backend rules, and the \\"configurations\\" namespace maps to the .cfg extension"
SigPersistenceFile -> SigPersistenceAtomic: "the file backend writes Sim.cfg.tmp, fsyncs it and renames it over Sim.cfg; on failure the old file and the old definition stay"
SigProjectEditing -> SigProjectDirty: "the sequence number is bumped, so every service that uses Sim is dirty. A stopped service is rebuilt right away; a running one keeps its old instances"
SigMgmtEdits -> SigMgmtRest: "the exclusive lock is released, then the result {name, config} is built from the copied text; 200 with the new document"
SigHttpDispatch -> SigMgmtGlue: "POST /services/test/restart arrives the same way"
SigMgmtGlue -> SigMgmtRest: "matched against POST /services/:name/restart"
SigMgmtRest -> SigMgmtActions: "sig_mgmt_restart_service holds none of the mgmt lock while the hooks run"
SigMgmtActions -> SigRuntimeControl: "sig_runtime_service_stop under the control mutex"
SigRuntimeControl -> SigServiceLifecycle: "sig_service_stop: the worker is joined first, then the stop hooks run on the calling thread"
SigMgmtActions -> SigProjectDirty: "prepare_service: still dirty and stopped, so under the exclusive lock and sig_runtime_edit, sig_project_refresh_service rebuilds the service from its stored definition text (memory, not a reload from disk)"
SigMgmtActions -> SigRuntimeControl: "sig_runtime_service_start_prebuilt (SIG_ERR_STALE would send it back to the rebuild, up to 8 times)"
SigRuntimeControl -> SigServiceLifecycle: "sig_service_start: start hooks on the calling thread, then the worker thread is spawned"
SigMgmtActions -> SigMgmtReads: "the {name, state} result is built under the shared lock and returned with 200; it carries no dirty flag"
`;case`persistence`:return`direction: down

SigPersistence: {
  label: "Persistence"

  Registry: {
    label: "Backend registry"
  }
  Store: {
    label: "Store interface"
  }
  File: {
    label: "File backend"
  }
  Atomic: {
    label: "Atomic save"
  }
}

SigPersistence.Store -> SigPersistence.File: "forwards to the hooks of the backend it was created with (the file backend is the one the library ships)"
SigPersistence.Registry -> SigPersistence.Store: "holds the sig_persistence_module structs that sig_persistence_create binds"
SigPersistence.File -> SigPersistence.Atomic: "save writes through the temp file and rename"
`;case`persistence_components`:return`direction: down

SigHost: {
  label: "Host"
}
SigProject: {
  label: "Project"
}
SigPersistence: {
  label: "Persistence"

  Registry: {
    label: "Backend registry"
  }
  Store: {
    label: "Store interface"
  }
  File: {
    label: "File backend"
  }
  Atomic: {
    label: "Atomic save"
  }
}
SigFoundation: {
  label: "Foundation"
}

SigHost -> SigPersistence.Store: "sig_persistence_create opens the store; sig_persistence_destroy closes it last"
SigHost -> SigPersistence.File: "passes sig_persistence_file_module and the project directory"
SigProject -> SigPersistence.Store: "[...]"
SigPersistence.Store -> SigPersistence.File: "forwards to the hooks of the backend it was created with (the file backend is the one the library ships)"
SigPersistence.Registry -> SigPersistence.Store: "holds the sig_persistence_module structs that sig_persistence_create binds"
SigPersistence.File -> SigPersistence.Atomic: "save writes through the temp file and rename"
SigPersistence.Store -> SigFoundation: "[...]"
SigPersistence.Registry -> SigFoundation: "backends kept in a sig_ht"
SigPersistence.File -> SigFoundation: "paths, key lists and the loaded buffer"
`;case`platform`:return`direction: down

SigPlatform: {
  label: "Platform"

  Threads: {
    label: "Threads and synchronization"
  }
  Time: {
    label: "Time"
  }
  Poller: {
    label: "Poller backends"
  }
  Net: {
    label: "TCP sockets"
  }
}

SigPlatform.Threads -> SigPlatform.Time: "deadlines for timed waits"
`;case`platform_components`:return`direction: down

SigFeed: {
  label: "Signal feed"
}
SigFoundation: {
  label: "Foundation"
}
SigHttp: {
  label: "HTTP"
}
SigMgmt: {
  label: "Management"
}
SigRuntime: {
  label: "Runtime"
}
SigService: {
  label: "Service"
}
SigPlatform: {
  label: "Platform"

  Threads: {
    label: "Threads and synchronization"
  }
  Net: {
    label: "TCP sockets"
  }
  Poller: {
    label: "Poller backends"
  }
  Time: {
    label: "Time"
  }
}

SigFeed -> SigPlatform.Threads: "[...]"
SigFeed -> SigPlatform.Time: "millisecond clock for the liveness deadlines"
SigFeed -> SigPlatform.Net: "[...]"
SigFoundation -> SigPlatform.Threads: "serializes writes with a sig_mutex"
SigHttp -> SigPlatform.Threads: "sig_thread_create and sig_thread_join for the server thread"
SigHttp -> SigPlatform.Time: "[...]"
SigHttp -> SigPlatform.Poller: "SIG_POLL_READ and SIG_POLL_WRITE event masks for its watches"
SigHttp -> SigPlatform.Net: "[...]"
SigMgmt -> SigPlatform.Threads: "[...]"
SigMgmt -> SigPlatform.Time: "sig_time_now for the start time"
SigRuntime -> SigPlatform.Threads: "control mutex, shutdown mutex and condition"
SigRuntime -> SigPlatform.Time: "[...]"
SigRuntime -> SigPlatform.Poller: "sleeps in sig_poller_wait; wakes with sig_poller_wake"
SigService -> SigPlatform.Threads: "[...]"
SigService -> SigPlatform.Time: "sig_time_now for the next fire time"
SigPlatform.Threads -> SigPlatform.Time: "deadlines for timed waits"
SigPlatform.Poller -> SigFoundation: "allocates the poller state"
SigPlatform.Net -> SigFoundation: "[...]"
`;case`project`:return`direction: down

SigProject: {
  label: "Project"

  Loader: {
    label: "Project load"
  }
  Ownership: {
    label: "Ownership and auto-start"
  }
  Introspection: {
    label: "Walk and introspection"
  }
  Editing: {
    label: "Editing"
  }
  Dirty: {
    label: "Dirty tracking"
  }
  Parser: {
    label: "Config parser"
  }
}

SigProject.Loader -> SigProject.Parser: "parses each stored document: configurations first, then services"
SigProject.Editing -> SigProject.Parser: "validates a new document exactly as load does"
SigProject.Dirty -> SigProject.Parser: "rebuilds a stopped service from its definition"
SigProject.Editing -> SigProject.Dirty: "rebuilds stopped services after every edit"
`;case`project_components`:return`direction: down

SigMgmt: {
  label: "Management"
}
SigRuntime: {
  label: "Runtime"
}
SigProject: {
  label: "Project"

  Introspection: {
    label: "Walk and introspection"
  }
  Editing: {
    label: "Editing"
  }
  Loader: {
    label: "Project load"
  }
  Ownership: {
    label: "Ownership and auto-start"
  }
  Dirty: {
    label: "Dirty tracking"
  }
  Parser: {
    label: "Config parser"
  }
}
SigPersistence: {
  label: "Persistence"
}
SigCapsules: {
  label: "Capsules"
}
SigFoundation: {
  label: "Foundation"
}
SigService: {
  label: "Service"
}

SigMgmt -> SigProject.Introspection: "walks and looks up services and configurations, and copies their stored definitions"
SigMgmt -> SigProject.Editing: "sig_project_put/patch/delete_* and rename_configuration"
SigMgmt -> SigProject.Dirty: "[...]"
SigRuntime -> SigProject.Loader: "sig_project_load at start"
SigRuntime -> SigProject.Ownership: "auto-start at start, stop_all and destroy at stop"
SigRuntime -> SigProject.Introspection: "[...]"
SigRuntime -> SigProject.Dirty: "start and restart rebuild a stale stopped service"
SigProject.Loader -> SigProject.Parser: "parses each stored document: configurations first, then services"
SigProject.Editing -> SigProject.Parser: "validates a new document exactly as load does"
SigProject.Dirty -> SigProject.Parser: "rebuilds a stopped service from its definition"
SigProject.Editing -> SigProject.Dirty: "rebuilds stopped services after every edit"
SigProject.Parser -> SigCapsules: "[...]"
SigProject.Parser -> SigFoundation: "sig_value_from_json parses the document"
SigProject.Parser -> SigService: "[...]"
SigProject.Loader -> SigFoundation: "[...]"
SigProject.Loader -> SigPersistence: "sig_persistence_list and sig_persistence_load on the configurations namespace, then the services namespace"
SigProject.Ownership -> SigCapsules: "[...]"
SigProject.Ownership -> SigService: "[...]"
SigProject.Editing -> SigCapsules: "validates properties against the capsule table"
SigProject.Editing -> SigFoundation: "merge patch and renaming work on parsed JSON"
SigProject.Editing -> SigPersistence: "sig_persistence_save of the edited document (plus a newline) and sig_persistence_remove on delete"
`;case`overview`:return`direction: down

SigHost: {
  label: "Host"
}
SigFoundation: {
  label: "Foundation"
}
SigFeed: {
  label: "Signal feed"
}
SigMgmt: {
  label: "Management"
}
SigPlatform: {
  label: "Platform"
}
SigRuntime: {
  label: "Runtime"
}
SigProject: {
  label: "Project"
}
SigCapsules: {
  label: "Capsules"
}
SigPersistence: {
  label: "Persistence"
}
SigHttp: {
  label: "HTTP"
}
SigService: {
  label: "Service"
}

SigCapsules -> SigHttp: "upward, weather capsule only: sig_http_get_async (SIG_CAPSULES and SIG_HTTP_CLIENT)"
SigCapsules -> SigService: "upward: enqueues signals, schedules jobs"
SigHost -> SigCapsules: "creates the registry and fills it with the built-ins"
SigMgmt -> SigCapsules: "registry, instances, routes"
SigProject -> SigCapsules: "builds configurations and instances from the registry"
SigRuntime -> SigCapsules: "borrows the capsule registry"
SigService -> SigCapsules: "runs instance hooks and terminal handlers"
SigFeed -> SigHttp: "WebSocket upgrade on the server"
SigFeed -> SigRuntime: "runtime module; tap and terminal lookup"
SigFeed -> SigService: "service name of a tapped signal"
SigHost -> SigFeed: "registers the feed (with -m, when built)"
SigHttp -> SigFeed: "[...]"
SigService -> SigFeed: "calls the installed function on the emitting thread (the feed is the only user of sig_runtime_set_tap in this repository)"
SigFoundation -> SigPlatform: "upward: the log mutex"
SigHost -> SigHttp: "registers the server (with -m)"
SigHost -> SigMgmt: "registers management and its glue (with -m)"
SigHost -> SigPersistence: "opens the store"
SigHost -> SigRuntime: "creates, starts and stops the runtime; registers modules"
SigHttp -> SigMgmt: "runs the handler registered for the longest matching prefix, \\"/\\" here"
SigHttp -> SigRuntime: "runtime module; uses the loop of the runtime"
SigMgmt -> SigHttp: "the glue registers the REST handler on the server"
SigMgmt -> SigProject: "reads and edits through the runtime"
SigMgmt -> SigRuntime: "service control, edits, shutdown"
SigMgmt -> SigService: "service and instance state"
SigProject -> SigPersistence: "loads and saves the stored documents"
SigRuntime -> SigPersistence: "borrows the store"
SigProject -> SigService: "creates services and adds instances"
SigRuntime -> SigProject: "loads, owns and edits the project"
SigRuntime -> SigService: "starts and stops services, sets driven mode and the tap"
SigService -> SigRuntime: "upward: the tap type, from sig_tap.h"
`;case`runtime`:return`direction: down

SigRuntime: {
  label: "Runtime"

  Lifecycle: {
    label: "Lifecycle state machine"
  }
  Control: {
    label: "Control mutex (edit lock)"
  }
  Stepping: {
    label: "Driven mode and stepping"
  }
  Shutdown: {
    label: "Shutdown request"
  }
  Modules: {
    label: "Runtime module registry"
  }
  Tap: {
    label: "Signal tap installation"
  }
  Loop: {
    label: "Event loop"
  }
}

SigRuntime.Lifecycle -> SigRuntime.Shutdown: "start clears a pending request"
SigRuntime.Lifecycle -> SigRuntime.Modules: "create all, start all, then stop and destroy in reverse"
SigRuntime.Lifecycle -> SigRuntime.Tap: "stop clears the tap on every service before modules go"
SigRuntime.Shutdown -> SigRuntime.Loop: "a request wakes the loop when one is set"
SigRuntime.Stepping -> SigRuntime.Loop: "service wake callback calls sig_loop_wake"
`;case`runtime_components`:return`direction: down

SigFeed: {
  label: "Signal feed"
}
SigHost: {
  label: "Host"
}
SigHttp: {
  label: "HTTP"
}
SigMgmt: {
  label: "Management"
}
SigRuntime: {
  label: "Runtime"

  Control: {
    label: "Control mutex (edit lock)"
  }
  Lifecycle: {
    label: "Lifecycle state machine"
  }
  Stepping: {
    label: "Driven mode and stepping"
  }
  Shutdown: {
    label: "Shutdown request"
  }
  Modules: {
    label: "Runtime module registry"
  }
  Tap: {
    label: "Signal tap installation"
  }
  Loop: {
    label: "Event loop"
  }
}
SigProject: {
  label: "Project"
}
SigService: {
  label: "Service"
}
SigFoundation: {
  label: "Foundation"
}
SigPlatform: {
  label: "Platform"
}

SigFeed -> SigRuntime.Modules: "registered as the runtime module \\"signal_feed\\"; create, start, stop and destroy hooks"
SigFeed -> SigRuntime.Control: "sig_runtime_find_terminal validates the names and gives the direction"
SigFeed -> SigRuntime.Tap: "sig_runtime_set_tap installs the callback (on every successful subscribe) and removes it when the last subscription goes"
SigFeed -> SigRuntime.Loop: "[...]"
SigHost -> SigRuntime.Lifecycle: "sig_runtime_create, start, stop and destroy"
SigHost -> SigRuntime.Shutdown: "[...]"
SigHost -> SigRuntime.Modules: "sig_runtime_register_module for each configured module, in order"
SigHost -> SigRuntime.Control: "sig_runtime_dump_info on SIGINFO"
SigHost -> SigRuntime.Loop: "[...]"
SigHost -> SigRuntime.Stepping: "single-threaded only: sig_runtime_set_loop; the step hook calls sig_runtime_step"
SigHttp -> SigRuntime.Modules: "registered as the runtime module \\"http_server\\"; create, start, stop and destroy hooks"
SigHttp -> SigRuntime.Loop: "sig_loop_watch_fd, sig_loop_watch_modify, sig_loop_timer_start for connections and the listener"
SigMgmt -> SigRuntime.Shutdown: "sig_runtime_request_shutdown"
SigMgmt -> SigRuntime.Modules: "[...]"
SigMgmt -> SigRuntime.Control: "[...]"
SigRuntime.Lifecycle -> SigRuntime.Shutdown: "start clears a pending request"
SigRuntime.Lifecycle -> SigRuntime.Modules: "create all, start all, then stop and destroy in reverse"
SigRuntime.Lifecycle -> SigRuntime.Tap: "stop clears the tap on every service before modules go"
SigRuntime.Shutdown -> SigRuntime.Loop: "a request wakes the loop when one is set"
SigRuntime.Stepping -> SigRuntime.Loop: "service wake callback calls sig_loop_wake"
SigRuntime.Lifecycle -> SigFoundation: "[...]"
SigRuntime.Lifecycle -> SigPlatform: "[...]"
SigRuntime.Lifecycle -> SigProject: "[...]"
SigRuntime.Lifecycle -> SigService: "in driven mode only: sets driven and the wake callback on each service"
SigRuntime.Control -> SigProject: "[...]"
SigRuntime.Control -> SigService: "start and stop under the control mutex; blocks until hooks have run"
SigRuntime.Tap -> SigProject: "walks the services"
SigRuntime.Tap -> SigService: "installs the tap on each service"
SigRuntime.Loop -> SigFoundation: "[...]"
SigRuntime.Loop -> SigPlatform: "[...]"
SigRuntime.Stepping -> SigProject: "walks the services"
SigRuntime.Stepping -> SigService: "steps each running driven service"
`;case`boot_and_shutdown`:return`direction: right

SigHostRunner: {
  label: "Boot runner"
}
SigPersistenceStore: {
  label: "Store interface"
}
SigRuntimeLifecycle: {
  label: "Lifecycle state machine"
}
SigRuntimeLoop: {
  label: "Event loop"
}
SigRuntimeStepping: {
  label: "Driven mode and stepping"
}
SigRuntimeModules: {
  label: "Runtime module registry"
}
SigHostShutdown: {
  label: "POSIX shutdown trigger"
}
SigProjectLoader: {
  label: "Project load"
}
SigProjectParser: {
  label: "Config parser"
}
SigProjectOwnership: {
  label: "Ownership and auto-start"
}
SigServiceLifecycle: {
  label: "Start and stop"
}
SigRuntimeShutdown: {
  label: "Shutdown request"
}
SigRuntimeTap: {
  label: "Signal tap installation"
}

SigHostRunner -> SigPersistenceStore: "sig_persistence_create opens the store (the file backend, from the project directory)"
SigHostRunner -> SigRuntimeLifecycle: "sig_runtime_create takes the store and the capsule registry (both borrowed)"
SigHostRunner -> SigRuntimeLoop: "Single-threaded mode only: sig_loop_create and sig_loop_set_step(host_step)"
SigHostRunner -> SigRuntimeStepping: "Single-threaded mode only: sig_runtime_set_loop (CREATED only)"
SigHostRunner -> SigRuntimeModules: "sig_runtime_register_module for each configured module, in order (CREATED only)"
SigHostRunner -> SigHostShutdown: "arm_shutdown, before the start: a sigwait thread, or in single-threaded mode handlers and a self-pipe on the loop"
SigHostRunner -> SigRuntimeLifecycle: "sig_runtime_start"
SigRuntimeLifecycle -> SigProjectLoader: "state STARTING, clears any shutdown request, then sig_project_load reads the store"
SigProjectLoader -> SigProjectParser: "configurations are parsed first, then services, whose instances are wired in two passes"
SigRuntimeLifecycle -> SigRuntimeModules: "create hook of every module in registration order, then start hook of every module"
SigRuntimeLifecycle -> SigProjectOwnership: "each service is put in driven or threaded mode, then sig_project_start_auto"
SigProjectOwnership -> SigServiceLifecycle: "every auto_start service: start hooks run on the calling thread, then the worker thread is spawned (none if driven); state becomes RUNNING"
SigHostRunner -> SigRuntimeShutdown: "Threaded mode: sig_runtime_wait blocks until a shutdown is requested"
SigHostRunner -> SigRuntimeLoop: "Single-threaded mode instead: sig_loop_run until the step hook sees a shutdown request and calls sig_loop_stop"
SigHostShutdown -> SigRuntimeShutdown: "On SIGINT or SIGTERM: sig_runtime_request_shutdown sets the flag, notifies the condition, wakes the loop if set"
SigHostRunner -> SigRuntimeLifecycle: "sig_runtime_stop"
SigRuntimeLifecycle -> SigProjectOwnership: "state STOPPING, then sig_project_stop_all"
SigProjectOwnership -> SigServiceLifecycle: "sig_service_stop: worker joined first, then stop hooks run on the calling thread"
SigRuntimeLifecycle -> SigRuntimeTap: "the tap is cleared on every service; the control mutex is released"
SigRuntimeLifecycle -> SigRuntimeModules: "stop hook of every module in reverse order, then destroy hook of every module in reverse order"
SigRuntimeLifecycle -> SigProjectOwnership: "sig_project_destroy: each service stopped, its instances destroyed, the service destroyed; then configurations; state CREATED"
SigHostRunner -> SigHostShutdown: "disarm_shutdown: the thread is joined and the signal mask restored, or the handlers restored and the pipe closed"
SigHostRunner -> SigRuntimeLifecycle: "sig_runtime_destroy"
SigHostRunner -> SigRuntimeLoop: "Single-threaded mode only: sig_loop_destroy"
SigHostRunner -> SigPersistenceStore: "sig_persistence_destroy, last because the runtime borrows the store"
`;case`service`:return`direction: down

SigService: {
  label: "Service"

  Lifecycle: {
    label: "Start and stop"
  }
  Instances: {
    label: "Owned instance set"
  }
  Queue: {
    label: "Signal queue"
  }
  Driven: {
    label: "Driven mode"
  }
  Scheduler: {
    label: "Job scheduler"
  }
  Worker: {
    label: "Worker thread"
  }
  Tap: {
    label: "Tap slot"
  }
}

SigService.Lifecycle -> SigService.Queue: "opens the queue before start hooks; closes it at stop and on a failed start"
SigService.Lifecycle -> SigService.Scheduler: "cancels all jobs at stop and on a failed start"
SigService.Lifecycle -> SigService.Worker: "spawns it unless the service is driven; joins it first on stop"
SigService.Queue -> SigService.Worker: "notifies the queue condition variable"
SigService.Queue -> SigService.Driven: "calls the wake callback of the owner, with no lock held"
SigService.Driven -> SigService.Queue: "a step delivers the queued batch"
SigService.Scheduler -> SigService.Worker: "notifies the condition so the wait deadline is recomputed"
SigService.Worker -> SigService.Scheduler: "runs the jobs that are due"
SigService.Driven -> SigService.Scheduler: "a step runs the jobs that are due"
SigService.Worker -> SigService.Tap: "input tap just before the handler"
SigService.Driven -> SigService.Tap: "input tap before each handler"
`;case`service_components`:return`direction: down

SigCapsules: {
  label: "Capsules"
}
SigMgmt: {
  label: "Management"
}
SigProject: {
  label: "Project"
}
SigRuntime: {
  label: "Runtime"
}
SigService: {
  label: "Service"

  Instances: {
    label: "Owned instance set"
  }
  Lifecycle: {
    label: "Start and stop"
  }
  Queue: {
    label: "Signal queue"
  }
  Driven: {
    label: "Driven mode"
  }
  Scheduler: {
    label: "Job scheduler"
  }
  Worker: {
    label: "Worker thread"
  }
  Tap: {
    label: "Tap slot"
  }
}
SigFoundation: {
  label: "Foundation"
}
SigFeed: {
  label: "Signal feed"
}
SigPlatform: {
  label: "Platform"
}

SigCapsules -> SigService.Queue: "sig_service_enqueue on the service of the destination"
SigCapsules -> SigService.Scheduler: "schedule and cancel jobs on instance->service"
SigCapsules -> SigService.Tap: "output tap before the route lookup"
SigMgmt -> SigService.Instances: "walks the instances of a service, its name, its running flag"
SigProject -> SigService.Lifecycle: "[...]"
SigProject -> SigService.Instances: "adds each instance to the service"
SigRuntime -> SigService.Lifecycle: "start and stop under the control mutex; blocks until hooks have run"
SigRuntime -> SigService.Driven: "[...]"
SigRuntime -> SigService.Tap: "installs the tap on each service"
SigService.Lifecycle -> SigService.Queue: "opens the queue before start hooks; closes it at stop and on a failed start"
SigService.Lifecycle -> SigService.Scheduler: "cancels all jobs at stop and on a failed start"
SigService.Lifecycle -> SigService.Worker: "spawns it unless the service is driven; joins it first on stop"
SigService.Queue -> SigService.Worker: "notifies the queue condition variable"
SigService.Queue -> SigService.Driven: "calls the wake callback of the owner, with no lock held"
SigService.Driven -> SigService.Queue: "a step delivers the queued batch"
SigService.Scheduler -> SigService.Worker: "notifies the condition so the wait deadline is recomputed"
SigService.Worker -> SigService.Scheduler: "runs the jobs that are due"
SigService.Driven -> SigService.Scheduler: "a step runs the jobs that are due"
SigService.Worker -> SigService.Tap: "input tap just before the handler"
SigService.Driven -> SigService.Tap: "input tap before each handler"
SigService.Lifecycle -> SigCapsules: "resolves properties, then runs start hooks on the calling thread; stop hooks after the join"
SigService.Lifecycle -> SigFoundation: "[...]"
SigService.Lifecycle -> SigPlatform: "sig_thread_create, sig_thread_join"
SigService.Instances -> SigFoundation: "instances kept in a sig_ht"
SigService.Queue -> SigFoundation: "[...]"
SigService.Scheduler -> SigPlatform: "sig_time_now for the next fire time"
SigService.Worker -> SigCapsules: "terminal->handler(instance, signal, name) on the thread of the service"
SigService.Worker -> SigPlatform: "sig_condition_wait and timedwait on the queue lock"
SigService.Driven -> SigCapsules: "handlers run on the thread that steps"
SigService.Tap -> SigFeed: "calls the installed function on the emitting thread (the feed is the only user of sig_runtime_set_tap in this repository)"
SigService.Tap -> SigPlatform: "set_tap takes the queue lock to swap the slot"
`;case`signal_delivery`:return`direction: right

SigCapsulesCapsule: {
  label: "Capsule"
}
SigCapsulesRoutes: {
  label: "Routes and notify"
}
SigServiceTap: {
  label: "Tap slot"
}
SigServiceQueue: {
  label: "Signal queue"
}
SigFoundationValues: {
  label: "Values"
}
SigServiceWorker: {
  label: "Worker thread"
}
SigCapsulesTerminals: {
  label: "Terminal handlers"
}

SigCapsulesCapsule -> SigCapsulesRoutes: "Capsule code calls sig_capsule_instance_notify(src, \\"out\\", &value): from a handler or job on the worker of the source service, or from a start/stop hook on the thread that called start/stop"
SigCapsulesRoutes -> SigServiceTap: "Output tap point: sig_service_tap_emit(SIG_TAP_OUTPUT) before the route lookup, so unrouted outputs are seen too; one atomic load if no tap is set"
SigCapsulesRoutes -> SigServiceQueue: "For each route: the input terminal is found by name on the destination capsule, then sig_service_enqueue on the service of the destination (no route: the signal is dropped; one failure does not stop the others)"
SigServiceQueue -> SigFoundationValues: "sig_value_dup deep-copies the signal into a queue entry, so the sender keeps ownership and does not wait for the receiver to run"
SigServiceQueue -> SigServiceWorker: "Pushed under the queue lock, queue condition variable notified (a driven service calls its wake callback instead)"
SigServiceWorker -> SigServiceTap: "Input tap point: sig_service_tap_emit(SIG_TAP_INPUT) just before the handler, on this worker thread"
SigServiceWorker -> SigCapsulesTerminals: "terminal->handler(instance, &copy, terminal_name) runs on the thread of the destination service; the copy is destroyed afterwards"
`;default:throw Error(`Unknown viewId: `+e)}};export{e as d2Source};