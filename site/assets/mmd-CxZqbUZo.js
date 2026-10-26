var e=e=>{switch(e){case`capsules`:return`---
title: "Capsules"
---
graph TB
  subgraph SigCapsules["\`Capsules\`"]
    SigCapsules.Shim@{ shape: rectangle, label: "Built-in capsule registration" }
    SigCapsules.Instance@{ shape: rectangle, label: "Capsule instance" }
    SigCapsules.Routes@{ shape: rectangle, label: "Routes and notify" }
    SigCapsules.Registry@{ shape: rectangle, label: "Capsule registry" }
    SigCapsules.Configuration@{ shape: rectangle, label: "Capsule configuration" }
    SigCapsules.Terminals@{ shape: rectangle, label: "Terminal handlers" }
    SigCapsules.Capsule@{ shape: rectangle, label: "Capsule" }
  end
  SigCapsules.Shim -. "\`registers each built-in capsule\`" .-> SigCapsules.Registry
  SigCapsules.Configuration -. "\`validates against the property table of the capsule\`" .-> SigCapsules.Capsule
  SigCapsules.Instance -. "\`resolves property values at start\`" .-> SigCapsules.Configuration
  SigCapsules.Routes -. "\`finds the destination input terminal by name\`" .-> SigCapsules.Terminals
`;case`capsules_components`:return'---\ntitle: "Capsules components"\n---\ngraph TB\n  SigHost@{ shape: rectangle, label: "Host" }\n  SigMgmt@{ shape: rectangle, label: "Management" }\n  SigProject@{ shape: rectangle, label: "Project" }\n  SigService@{ shape: rectangle, label: "Service" }\n  subgraph SigCapsules["`Capsules`"]\n    SigCapsules.Shim@{ shape: rectangle, label: "Built-in capsule registration" }\n    SigCapsules.Instance@{ shape: rectangle, label: "Capsule instance" }\n    SigCapsules.Routes@{ shape: rectangle, label: "Routes and notify" }\n    SigCapsules.Registry@{ shape: rectangle, label: "Capsule registry" }\n    SigCapsules.Configuration@{ shape: rectangle, label: "Capsule configuration" }\n    SigCapsules.Terminals@{ shape: rectangle, label: "Terminal handlers" }\n    SigCapsules.Capsule@{ shape: rectangle, label: "Capsule" }\n  end\n  SigHttp@{ shape: rectangle, label: "HTTP" }\n  SigFoundation@{ shape: rectangle, label: "Foundation" }\n  SigHost -. "`creates the registry before the run and destroys it after`" .-> SigCapsules.Registry\n  SigHost -. "`sig_builtin_capsules_register`" .-> SigCapsules.Shim\n  SigMgmt -. "`walks the registered capsules and their property tables`" .-> SigCapsules.Registry\n  SigMgmt -. "`walks the property values of an instance`" .-> SigCapsules.Configuration\n  SigMgmt -. "`instance name, configuration, type and terminals`" .-> SigCapsules.Instance\n  SigMgmt -. "`sig_capsule_instance_walk_routes for the links of a service`" .-> SigCapsules.Routes\n  SigProject -. "`looks up the type of a configuration`" .-> SigCapsules.Registry\n  SigProject -. "`[...]`" .-> SigCapsules.Configuration\n  SigProject -. "`[...]`" .-> SigCapsules.Instance\n  SigProject -. "`wires receivers with sig_capsule_instance_connect`" .-> SigCapsules.Routes\n  SigService -. "`resolves properties, then runs start hooks on the calling thread; stop hooks after the join`" .-> SigCapsules.Instance\n  SigService -. "`[...]`" .-> SigCapsules.Terminals\n  SigCapsules.Shim -. "`registers each built-in capsule`" .-> SigCapsules.Registry\n  SigCapsules.Configuration -. "`validates against the property table of the capsule`" .-> SigCapsules.Capsule\n  SigCapsules.Instance -. "`resolves property values at start`" .-> SigCapsules.Configuration\n  SigCapsules.Routes -. "`finds the destination input terminal by name`" .-> SigCapsules.Terminals\n  SigCapsules.Registry -. "`[...]`" .-> SigFoundation\n  SigCapsules.Configuration -. "`boxed property values`" .-> SigFoundation\n  SigCapsules.Instance -. "`[...]`" .-> SigFoundation\n  SigCapsules.Instance -. "`schedule and cancel jobs on instance->service`" .-> SigService\n  SigCapsules.Routes -. "`one sig_ll of routes per output terminal`" .-> SigFoundation\n  SigCapsules.Routes -. "`[...]`" .-> SigService\n  SigCapsules.Shim -. "`the weather capsule, if listed in SIG_CAPSULES and SIG_HTTP_CLIENT is on, takes sig_http_get_async as its transport (weather_capsule.h includes sig_http_client.h)`" .-> SigHttp\n';case`index`:return`---
title: "libsig in context"
---
graph TB
  Operator@{ icon: "fa:user", shape: rounded, label: "Operator" }
  Browser@{ icon: "fa:user", shape: rounded, label: "Browser UI" }
  Cli@{ icon: "fa:user", shape: rounded, label: "curl and scripts" }
  subgraph Sig["\`libsig\`"]
    Sig.Host@{ shape: rectangle, label: "Host" }
    Sig.Http@{ shape: rectangle, label: "HTTP" }
    Sig.Persistence@{ shape: rectangle, label: "Persistence" }
    Sig.Feed@{ shape: rectangle, label: "Signal feed" }
    Sig.Platform@{ shape: rectangle, label: "Platform" }
  end
  Store@{ shape: disk, label: "Project store" }
  Network@{ shape: rectangle, label: "Network" }
  Operator -. "\`runs sighost with a project directory and options (host/posix/main.c: -p -l -m -o -s -h)\`" .-> Sig.Host
  Browser -. "\`REST/JSON over HTTP\`" .-> Sig.Http
  Cli -. "\`REST/JSON over HTTP\`" .-> Sig.Http
  Sig.Host -. "\`registers the server (with -m)\`" .-> Sig.Http
  Browser -. "\`WebSocket on /feed\`" .-> Sig.Feed
  Sig.Host -. "\`registers the feed (with -m, when built)\`" .-> Sig.Feed
  Sig.Http -. "\`[...]\`" .-> Sig.Feed
  Sig.Feed -. "\`WebSocket upgrade on the server\`" .-> Sig.Http
  Sig.Host -. "\`opens the store\`" .-> Sig.Persistence
  Sig.Persistence -. "\`reads at project load; rewrites on edit (temp file, then rename)\`" .-> Store
  Sig.Http -. "\`sockets, threads, clock\`" .-> Sig.Platform
  Sig.Feed -. "\`threads, clock, sockets\`" .-> Sig.Platform
  Sig.Platform -. "\`sig_net (the optional sig::net target, SIG_NET): listen, accept, read and write\`" .-> Network
`;case`feed`:return`---
title: "Signal feed"
---
graph TB
  subgraph SigFeed["\`Signal feed\`"]
    SigFeed.Module@{ shape: rectangle, label: "Feed module" }
    SigFeed.Upgrade@{ shape: rectangle, label: "Upgrade handler" }
    SigFeed.Tap@{ shape: rectangle, label: "Tap callback" }
    SigFeed.Connection@{ shape: rectangle, label: "WebSocket connection" }
    SigFeed.Hub@{ shape: rectangle, label: "Subscription hub" }
    SigFeed.Messages@{ shape: rectangle, label: "Message encoding" }
    SigFeed.Queue@{ shape: rectangle, label: "Subscription queue" }
  end
  SigFeed.Module -. "\`creates it in create, destroys it in destroy\`" .-> SigFeed.Hub
  SigFeed.Upgrade -. "\`adopts the connection: directly on the loop thread, or via the hand-off list\`" .-> SigFeed.Connection
  SigFeed.Connection -. "\`subscribe and unsubscribe, on the loop thread\`" .-> SigFeed.Hub
  SigFeed.Connection -. "\`sig_feed_sub_pop for each subscription on every flush tick\`" .-> SigFeed.Queue
  SigFeed.Connection -. "\`parses commands; encodes events, replies and errors\`" .-> SigFeed.Messages
  SigFeed.Hub -. "\`creates a queue with each subscription\`" .-> SigFeed.Queue
  SigFeed.Tap -. "\`offers a copy to each matching subscription\`" .-> SigFeed.Queue
`;case`feed_components`:return'---\ntitle: "Signal feed components"\n---\ngraph TB\n  SigHost@{ shape: rectangle, label: "Host" }\n  SigHttp@{ shape: rectangle, label: "HTTP" }\n  SigService@{ shape: rectangle, label: "Service" }\n  subgraph SigFeed["`Signal feed`"]\n    SigFeed.Module@{ shape: rectangle, label: "Feed module" }\n    SigFeed.Upgrade@{ shape: rectangle, label: "Upgrade handler" }\n    SigFeed.Tap@{ shape: rectangle, label: "Tap callback" }\n    SigFeed.Connection@{ shape: rectangle, label: "WebSocket connection" }\n    SigFeed.Hub@{ shape: rectangle, label: "Subscription hub" }\n    SigFeed.Messages@{ shape: rectangle, label: "Message encoding" }\n    SigFeed.Queue@{ shape: rectangle, label: "Subscription queue" }\n  end\n  SigPlatform@{ shape: rectangle, label: "Platform" }\n  SigRuntime@{ shape: rectangle, label: "Runtime" }\n  SigFoundation@{ shape: rectangle, label: "Foundation" }\n  SigHost -. "`sig_signal_feed_module, with -m when the feed was built`" .-> SigFeed.Module\n  SigHttp -. "`[...]`" .-> SigFeed.Upgrade\n  SigService -. "`calls the installed function on the emitting thread (the feed is the only user of sig_runtime_set_tap in this repository)`" .-> SigFeed.Tap\n  SigFeed.Module -. "`creates it in create, destroys it in destroy`" .-> SigFeed.Hub\n  SigFeed.Upgrade -. "`adopts the connection: directly on the loop thread, or via the hand-off list`" .-> SigFeed.Connection\n  SigFeed.Connection -. "`subscribe and unsubscribe, on the loop thread`" .-> SigFeed.Hub\n  SigFeed.Connection -. "`sig_feed_sub_pop for each subscription on every flush tick`" .-> SigFeed.Queue\n  SigFeed.Connection -. "`parses commands; encodes events, replies and errors`" .-> SigFeed.Messages\n  SigFeed.Hub -. "`creates a queue with each subscription`" .-> SigFeed.Queue\n  SigFeed.Tap -. "`offers a copy to each matching subscription`" .-> SigFeed.Queue\n  SigFeed.Module -. "`logs why a connection was dropped, and configuration errors`" .-> SigFoundation\n  SigFeed.Module -. "`sig_http_server_from_runtime and sig_http_server_register_upgrade(\'/feed\') in create`" .-> SigHttp\n  SigFeed.Module -. "`sig_thread_create and sig_thread_join for the private loop thread; a mutex for the running flag and counts`" .-> SigPlatform\n  SigFeed.Module -. "`[...]`" .-> SigRuntime\n  SigFeed.Upgrade -. "`sig_ws_accept_key for the 101 response; sig_ws_encode for the 1013 close`" .-> SigHttp\n  SigFeed.Upgrade -. "`one non-blocking write for the refusal, then closes the socket`" .-> SigPlatform\n  SigFeed.Connection -. "`sig_ws_decode of client frames; sig_ws_encode of every server frame`" .-> SigHttp\n  SigFeed.Connection -. "`[...]`" .-> SigPlatform\n  SigFeed.Connection -. "`sig_loop_watch_fd, watch_modify and the flush timer`" .-> SigRuntime\n  SigFeed.Hub -. "`a mutex serializing hub calls and a reader-writer lock over the subscription table`" .-> SigPlatform\n  SigFeed.Hub -. "`[...]`" .-> SigRuntime\n  SigFeed.Queue -. "`[...]`" .-> SigFoundation\n  SigFeed.Messages -. "`sig_json writer; sig_value_from_json and sig_value_to_json`" .-> SigFoundation\n';case`feed_subscription`:return`---
title: "Subscribe to a terminal and receive its signals"
---
graph LR
  SigHttpDispatch@{ shape: rectangle, label: "Request evaluation and routing" }
  SigHttpLooped@{ shape: rectangle, label: "Event-loop transport" }
  SigFeedUpgrade@{ shape: rectangle, label: "Upgrade handler" }
  SigHttpWs@{ shape: rectangle, label: "WebSocket primitives" }
  SigFeedConnection@{ shape: rectangle, label: "WebSocket connection" }
  SigFeedMessages@{ shape: rectangle, label: "Message encoding" }
  SigFeedHub@{ shape: rectangle, label: "Subscription hub" }
  SigRuntimeControl@{ shape: rectangle, label: "Control mutex (edit lock)" }
  SigRuntimeTap@{ shape: rectangle, label: "Signal tap installation" }
  SigServiceTap@{ shape: rectangle, label: "Tap slot" }
  SigFeedTap@{ shape: rectangle, label: "Tap callback" }
  SigFeedQueue@{ shape: rectangle, label: "Subscription queue" }
  SigPlatformNet@{ shape: rectangle, label: "TCP sockets" }
  SigHttpDispatch -. "\`GET /feed with Upgrade: websocket: the request is read in full, request_authorized() accepts it, Sec-WebSocket-Version must be 13, the key non-empty, and an Origin header, if present, must equal cors_origin (else 400 or 403). The longest upgrade prefix '/feed' matches\`" .-> SigHttpDispatch
  SigHttpLooped -. "\`the server unwatches the fd and offers the non-blocking connection to on_upgrade (the threaded transport does the same from its server thread)\`" .-> SigFeedUpgrade
  SigFeedUpgrade -. "\`sig_ws_accept_key for the Sec-WebSocket-Accept value\`" .-> SigHttpWs
  SigFeedUpgrade -. "\`fewer than 8 connections: the connection is adopted, watched on the loop, the 101 response queued and written, the 20 ms flush timer armed. (The ninth gets 101 plus a close frame 1013.)\`" .-> SigFeedConnection
  SigFeedConnection -. "\`client frame {'op':'subscribe','id':'a','service':'S','instance':'I','terminal':'T'} is decoded and unmasked (at most 4096 bytes)\`" .-> SigHttpWs
  SigFeedConnection -. "\`sig_feed_parse_command: names must be 1 to 63 bytes\`" .-> SigFeedMessages
  SigFeedConnection -. "\`sig_feed_hub_subscribe (an id already in use is bad_request, a 17th subscription is too_many; both are answered without calling the hub)\`" .-> SigFeedHub
  SigFeedHub -. "\`sig_runtime_find_terminal under the control mutex: not_found if the names do not exist, bad_request if the runtime is not running; gives the direction\`" .-> SigRuntimeControl
  SigFeedHub -. "\`sig_runtime_set_tap(hub_tap): the subscription is already in the hub table, and the tap is installed on this subscribe (a later subscribe installs it again)\`" .-> SigRuntimeTap
  SigRuntimeTap -. "\`the tap is stored on every service of the running project; a service rebuilt later gets it too\`" .-> SigServiceTap
  SigFeedConnection -. "\`reply {'op':'subscribed','id':'a','dir':'in|out'} is encoded and queued for the socket\`" .-> SigFeedMessages
  SigServiceTap -. "\`a signal crosses the terminal: sig_service_tap_emit calls hub_tap on the emitting thread, before an input handler or when an output is notified\`" .-> SigFeedTap
  SigFeedTap -. "\`for each subscription matching direction, terminal, instance and service name: a copy is queued with the next seq and a timestamp, or, when the queue is full or the value too large, a drop is counted (merged with a drop already at the tail). No I/O\`" .-> SigFeedQueue
  SigFeedConnection -. "\`flush tick, within 20 ms: sig_feed_sub_pop returns signals in order, with a dropped event with its count at the place where values were lost\`" .-> SigFeedQueue
  SigFeedConnection -. "\`each event is encoded as a signal or dropped message\`" .-> SigFeedMessages
  SigFeedConnection -. "\`frames are written to the socket; if more than 1 MiB is unsent, popping and reading stop until the client catches up, and the queues drop\`" .-> SigPlatformNet
  SigFeedConnection -. "\`unsubscribe, or the connection closing: the subscription is freed. When the last subscription goes, the hub asks the runtime to remove the tap\`" .-> SigFeedHub
`;case`foundation`:return`---
title: "Foundation"
---
graph TB
  subgraph SigFoundation["\`Foundation\`"]
    SigFoundation.Status@{ shape: rectangle, label: "Status codes" }
    SigFoundation.Json@{ shape: rectangle, label: "JSON" }
    SigFoundation.Expressions@{ shape: rectangle, label: "Expressions" }
    SigFoundation.Python@{ shape: rectangle, label: "Python bindings" }
    SigFoundation.Values@{ shape: rectangle, label: "Values" }
    SigFoundation.Containers@{ shape: rectangle, label: "Hash table and list" }
    SigFoundation.Logging@{ shape: rectangle, label: "Logging" }
    SigFoundation.Allocation@{ shape: rectangle, label: "Allocation" }
    SigFoundation.Refcount@{ shape: rectangle, label: "Reference counts" }
  end
  SigFoundation.Containers -. "\`allocates nodes and buckets\`" .-> SigFoundation.Allocation
  SigFoundation.Values -. "\`allocates strings and bytes\`" .-> SigFoundation.Allocation
  SigFoundation.Json -. "\`grows output buffers\`" .-> SigFoundation.Allocation
  SigFoundation.Expressions -. "\`compiles to heap nodes\`" .-> SigFoundation.Allocation
  SigFoundation.Containers -. "\`counts references\`" .-> SigFoundation.Refcount
  SigFoundation.Values -. "\`counts references to shared payloads\`" .-> SigFoundation.Refcount
  SigFoundation.Values -. "\`maps and lists are a sig_ht and a sig_ll\`" .-> SigFoundation.Containers
  SigFoundation.Values -. "\`logs refused mutations at debug level\`" .-> SigFoundation.Logging
  SigFoundation.Json -. "\`walks and builds sig_value trees\`" .-> SigFoundation.Values
  SigFoundation.Expressions -. "\`evaluates against a sig_value\`" .-> SigFoundation.Values
  SigFoundation.Python -. "\`converts sig_value trees\`" .-> SigFoundation.Values
`;case`foundation_components`:return'---\ntitle: "Foundation components"\n---\ngraph TB\n  SigCapsules@{ shape: rectangle, label: "Capsules" }\n  SigFeed@{ shape: rectangle, label: "Signal feed" }\n  SigHost@{ shape: rectangle, label: "Host" }\n  SigHttp@{ shape: rectangle, label: "HTTP" }\n  SigMgmt@{ shape: rectangle, label: "Management" }\n  SigPersistence@{ shape: rectangle, label: "Persistence" }\n  SigPlatform@{ shape: rectangle, label: "Platform" }\n  SigProject@{ shape: rectangle, label: "Project" }\n  SigRuntime@{ shape: rectangle, label: "Runtime" }\n  SigService@{ shape: rectangle, label: "Service" }\n  subgraph SigFoundation["`Foundation`"]\n    SigFoundation.Json@{ shape: rectangle, label: "JSON" }\n    SigFoundation.Expressions@{ shape: rectangle, label: "Expressions" }\n    SigFoundation.Python@{ shape: rectangle, label: "Python bindings" }\n    SigFoundation.Values@{ shape: rectangle, label: "Values" }\n    SigFoundation.Containers@{ shape: rectangle, label: "Hash table and list" }\n    SigFoundation.Logging@{ shape: rectangle, label: "Logging" }\n    SigFoundation.Allocation@{ shape: rectangle, label: "Allocation" }\n    SigFoundation.Refcount@{ shape: rectangle, label: "Reference counts" }\n    SigFoundation.Status@{ shape: rectangle, label: "Status codes" }\n  end\n  SigCapsules -. "`allocates the registry`" .-> SigFoundation.Allocation\n  SigCapsules -. "`[...]`" .-> SigFoundation.Containers\n  SigCapsules -. "`logs resolve errors`" .-> SigFoundation.Logging\n  SigCapsules -. "`boxed property values`" .-> SigFoundation.Values\n  SigFeed -. "`entries`" .-> SigFoundation.Allocation\n  SigFeed -. "`entries kept in a sig_ll`" .-> SigFoundation.Containers\n  SigFeed -. "`logs why a connection was dropped, and configuration errors`" .-> SigFoundation.Logging\n  SigFeed -. "`sig_value_dup copies the signal`" .-> SigFoundation.Values\n  SigFeed -. "`sig_json writer; sig_value_from_json and sig_value_to_json`" .-> SigFoundation.Json\n  SigHost -. "`allocates its state`" .-> SigFoundation.Allocation\n  SigHost -. "`[...]`" .-> SigFoundation.Logging\n  SigHttp -. "`[...]`" .-> SigFoundation.Allocation\n  SigHttp -. "`[...]`" .-> SigFoundation.Logging\n  SigMgmt -. "`[...]`" .-> SigFoundation.Values\n  SigMgmt -. "`sig_json writer, sig_value_from_json for the rename body`" .-> SigFoundation.Json\n  SigPersistence -. "`[...]`" .-> SigFoundation.Allocation\n  SigPersistence -. "`backends kept in a sig_ht`" .-> SigFoundation.Containers\n  SigPersistence -. "`trace line after a successful load, save or remove`" .-> SigFoundation.Logging\n  SigPlatform -. "`[...]`" .-> SigFoundation.Allocation\n  SigPlatform -. "`logs listen failures`" .-> SigFoundation.Logging\n  SigProject -. "`allocates the project and its tables`" .-> SigFoundation.Allocation\n  SigProject -. "`logs load progress and failures`" .-> SigFoundation.Logging\n  SigProject -. "`[...]`" .-> SigFoundation.Json\n  SigRuntime -. "`[...]`" .-> SigFoundation.Allocation\n  SigRuntime -. "`[...]`" .-> SigFoundation.Logging\n  SigService -. "`allocates the service and its tables`" .-> SigFoundation.Allocation\n  SigService -. "`[...]`" .-> SigFoundation.Containers\n  SigService -. "`logs start, stop and hook failures`" .-> SigFoundation.Logging\n  SigService -. "`sig_value_dup copies the signal`" .-> SigFoundation.Values\n  SigFoundation.Containers -. "`allocates nodes and buckets`" .-> SigFoundation.Allocation\n  SigFoundation.Values -. "`allocates strings and bytes`" .-> SigFoundation.Allocation\n  SigFoundation.Json -. "`grows output buffers`" .-> SigFoundation.Allocation\n  SigFoundation.Expressions -. "`compiles to heap nodes`" .-> SigFoundation.Allocation\n  SigFoundation.Containers -. "`counts references`" .-> SigFoundation.Refcount\n  SigFoundation.Values -. "`counts references to shared payloads`" .-> SigFoundation.Refcount\n  SigFoundation.Values -. "`maps and lists are a sig_ht and a sig_ll`" .-> SigFoundation.Containers\n  SigFoundation.Values -. "`logs refused mutations at debug level`" .-> SigFoundation.Logging\n  SigFoundation.Json -. "`walks and builds sig_value trees`" .-> SigFoundation.Values\n  SigFoundation.Expressions -. "`evaluates against a sig_value`" .-> SigFoundation.Values\n  SigFoundation.Python -. "`converts sig_value trees`" .-> SigFoundation.Values\n  SigFoundation.Logging -. "`serializes writes with a sig_mutex`" .-> SigPlatform\n';case`host`:return`---
title: "Host"
---
graph TB
  subgraph SigHost["\`Host\`"]
    SigHost.Entry@{ shape: rectangle, label: "sighost entry point" }
    SigHost.Runner@{ shape: rectangle, label: "Boot runner" }
    SigHost.Shutdown@{ shape: rectangle, label: "POSIX shutdown trigger" }
  end
  SigHost.Runner -. "\`arm_shutdown before start; disarm_shutdown after stop\`" .-> SigHost.Shutdown
  SigHost.Entry -. "\`sig_host_run with the file store, the registry, the modules and the flag\`" .-> SigHost.Runner
  SigHost.Entry -. "\`sig_host_posix_platform supplies the hooks\`" .-> SigHost.Shutdown
`;case`host_components`:return`---
title: "Host components"
---
graph TB
  subgraph SigHost["\`Host\`"]
    SigHost.Entry@{ shape: rectangle, label: "sighost entry point" }
    SigHost.Runner@{ shape: rectangle, label: "Boot runner" }
    SigHost.Shutdown@{ shape: rectangle, label: "POSIX shutdown trigger" }
  end
  SigCapsules@{ shape: rectangle, label: "Capsules" }
  SigFeed@{ shape: rectangle, label: "Signal feed" }
  SigHttp@{ shape: rectangle, label: "HTTP" }
  SigMgmt@{ shape: rectangle, label: "Management" }
  SigPersistence@{ shape: rectangle, label: "Persistence" }
  SigFoundation@{ shape: rectangle, label: "Foundation" }
  SigRuntime@{ shape: rectangle, label: "Runtime" }
  SigHost.Runner -. "\`arm_shutdown before start; disarm_shutdown after stop\`" .-> SigHost.Shutdown
  SigHost.Entry -. "\`sig_host_run with the file store, the registry, the modules and the flag\`" .-> SigHost.Runner
  SigHost.Entry -. "\`sig_host_posix_platform supplies the hooks\`" .-> SigHost.Shutdown
  SigHost.Runner -. "\`logs the store that was opened\`" .-> SigFoundation
  SigHost.Runner -. "\`sig_persistence_create opens the store; sig_persistence_destroy closes it last\`" .-> SigPersistence
  SigHost.Runner -. "\`[...]\`" .-> SigRuntime
  SigHost.Shutdown -. "\`[...]\`" .-> SigFoundation
  SigHost.Shutdown -. "\`[...]\`" .-> SigRuntime
  SigHost.Entry -. "\`[...]\`" .-> SigCapsules
  SigHost.Entry -. "\`sig_signal_feed_module, with -m when the feed was built\`" .-> SigFeed
  SigHost.Entry -. "\`sig_log_init and sig_log_shutdown\`" .-> SigFoundation
  SigHost.Entry -. "\`sig_http_server_module, with -m\`" .-> SigHttp
  SigHost.Entry -. "\`[...]\`" .-> SigMgmt
  SigHost.Entry -. "\`passes sig_persistence_file_module and the project directory\`" .-> SigPersistence
`;case`http`:return`---
title: "HTTP"
---
graph TB
  subgraph SigHttp["\`HTTP\`"]
    SigHttp.Server@{ shape: rectangle, label: "Server module" }
    SigHttp.Threaded@{ shape: rectangle, label: "Threaded transport" }
    SigHttp.Looped@{ shape: rectangle, label: "Event-loop transport" }
    SigHttp.Dispatch@{ shape: rectangle, label: "Request evaluation and routing" }
    SigHttp.Parser@{ shape: rectangle, label: "Request parser and response formatter" }
    SigHttp.Ws@{ shape: rectangle, label: "WebSocket primitives" }
    SigHttp.Client@{ shape: rectangle, label: "HTTP client" }
  end
  SigHttp.Server -. "\`both transports evaluate each request through it\`" .-> SigHttp.Dispatch
  SigHttp.Server -. "\`starts the server thread when the runtime has no loop; sets the stop flag and joins at stop\`" .-> SigHttp.Threaded
  SigHttp.Server -. "\`watches the listener on the loop when the runtime has one\`" .-> SigHttp.Looped
  SigHttp.Dispatch -. "\`sig_http_parse_head and sig_http_format_response\`" .-> SigHttp.Parser
  SigHttp.Threaded -. "\`evaluate_request for each connection\`" .-> SigHttp.Dispatch
  SigHttp.Looped -. "\`evaluate_request when a readable event has data\`" .-> SigHttp.Dispatch
`;case`http_components`:return`---
title: "HTTP components"
---
graph TB
  SigCapsules@{ shape: rectangle, label: "Capsules" }
  SigFeed@{ shape: rectangle, label: "Signal feed" }
  SigHost@{ shape: rectangle, label: "Host" }
  SigMgmt@{ shape: rectangle, label: "Management" }
  subgraph SigHttp["\`HTTP\`"]
    SigHttp.Client@{ shape: rectangle, label: "HTTP client" }
    SigHttp.Server@{ shape: rectangle, label: "Server module" }
    SigHttp.Ws@{ shape: rectangle, label: "WebSocket primitives" }
    SigHttp.Threaded@{ shape: rectangle, label: "Threaded transport" }
    SigHttp.Looped@{ shape: rectangle, label: "Event-loop transport" }
    SigHttp.Dispatch@{ shape: rectangle, label: "Request evaluation and routing" }
    SigHttp.Parser@{ shape: rectangle, label: "Request parser and response formatter" }
  end
  SigFoundation@{ shape: rectangle, label: "Foundation" }
  SigPlatform@{ shape: rectangle, label: "Platform" }
  SigRuntime@{ shape: rectangle, label: "Runtime" }
  SigCapsules -. "\`the weather capsule, if listed in SIG_CAPSULES and SIG_HTTP_CLIENT is on, takes sig_http_get_async as its transport (weather_capsule.h includes sig_http_client.h)\`" .-> SigHttp.Client
  SigFeed -. "\`sig_http_server_from_runtime and sig_http_server_register_upgrade('/feed') in create\`" .-> SigHttp.Server
  SigFeed -. "\`[...]\`" .-> SigHttp.Ws
  SigHost -. "\`sig_http_server_module, with -m\`" .-> SigHttp.Server
  SigMgmt -. "\`sig_http_server_from_runtime and sig_http_server_register('/') in its create hook\`" .-> SigHttp.Server
  SigHttp.Server -. "\`both transports evaluate each request through it\`" .-> SigHttp.Dispatch
  SigHttp.Server -. "\`starts the server thread when the runtime has no loop; sets the stop flag and joins at stop\`" .-> SigHttp.Threaded
  SigHttp.Server -. "\`watches the listener on the loop when the runtime has one\`" .-> SigHttp.Looped
  SigHttp.Dispatch -. "\`sig_http_parse_head and sig_http_format_response\`" .-> SigHttp.Parser
  SigHttp.Threaded -. "\`evaluate_request for each connection\`" .-> SigHttp.Dispatch
  SigHttp.Looped -. "\`evaluate_request when a readable event has data\`" .-> SigHttp.Dispatch
  SigHttp.Server -. "\`[...]\`" .-> SigFoundation
  SigHttp.Server -. "\`[...]\`" .-> SigPlatform
  SigHttp.Server -. "\`registered as the runtime module 'http_server'; create, start, stop and destroy hooks\`" .-> SigRuntime
  SigHttp.Dispatch -. "\`runs the handler registered for the longest matching prefix, '/' here\`" .-> SigMgmt
  SigHttp.Threaded -. "\`offers a validated upgrade connection on the server thread\`" .-> SigFeed
  SigHttp.Threaded -. "\`[...]\`" .-> SigPlatform
  SigHttp.Looped -. "\`offers a validated upgrade connection on the loop thread, with the fd already unwatched\`" .-> SigFeed
  SigHttp.Looped -. "\`[...]\`" .-> SigPlatform
  SigHttp.Looped -. "\`sig_loop_watch_fd, sig_loop_watch_modify, sig_loop_timer_start for connections and the listener\`" .-> SigRuntime
  SigHttp.Client -. "\`[...]\`" .-> SigFoundation
`;case`mgmt`:return`---
title: "Management"
---
graph TB
  subgraph SigMgmt["\`Management\`"]
    SigMgmt.Glue@{ shape: rectangle, label: "HTTP glue module" }
    SigMgmt.Module@{ shape: rectangle, label: "Mgmt module" }
    SigMgmt.Rest@{ shape: rectangle, label: "REST router" }
    SigMgmt.Actions@{ shape: rectangle, label: "Service actions" }
    SigMgmt.Edits@{ shape: rectangle, label: "Edit operations" }
    SigMgmt.Status@{ shape: rectangle, label: "Status mapping and JSON rendering" }
    SigMgmt.Reads@{ shape: rectangle, label: "Read operations" }
  end
  SigMgmt.Glue -. "\`sig_mgmt_from_runtime in its create hook\`" .-> SigMgmt.Module
  SigMgmt.Actions -. "\`builds the returned {name, state} tree under the shared lock\`" .-> SigMgmt.Reads
  SigMgmt.Rest -. "\`GET routes\`" .-> SigMgmt.Reads
  SigMgmt.Rest -. "\`POST start, stop, restart and shutdown routes\`" .-> SigMgmt.Actions
  SigMgmt.Rest -. "\`PUT, PATCH, DELETE and rename routes\`" .-> SigMgmt.Edits
  SigMgmt.Rest -. "\`maps statuses to HTTP and renders the result tree\`" .-> SigMgmt.Status
  SigMgmt.Glue -. "\`the registered handler calls sig_mgmt_rest_handle\`" .-> SigMgmt.Rest
`;case`mgmt_components`:return'---\ntitle: "Management components"\n---\ngraph TB\n  SigHost@{ shape: rectangle, label: "Host" }\n  SigHttp@{ shape: rectangle, label: "HTTP" }\n  subgraph SigMgmt["`Management`"]\n    SigMgmt.Glue@{ shape: rectangle, label: "HTTP glue module" }\n    SigMgmt.Module@{ shape: rectangle, label: "Mgmt module" }\n    SigMgmt.Rest@{ shape: rectangle, label: "REST router" }\n    SigMgmt.Actions@{ shape: rectangle, label: "Service actions" }\n    SigMgmt.Edits@{ shape: rectangle, label: "Edit operations" }\n    SigMgmt.Status@{ shape: rectangle, label: "Status mapping and JSON rendering" }\n    SigMgmt.Reads@{ shape: rectangle, label: "Read operations" }\n  end\n  SigCapsules@{ shape: rectangle, label: "Capsules" }\n  SigFoundation@{ shape: rectangle, label: "Foundation" }\n  SigPlatform@{ shape: rectangle, label: "Platform" }\n  SigProject@{ shape: rectangle, label: "Project" }\n  SigRuntime@{ shape: rectangle, label: "Runtime" }\n  SigService@{ shape: rectangle, label: "Service" }\n  SigHost -. "`sig_mgmt_module, with -m`" .-> SigMgmt.Module\n  SigHost -. "`sig_mgmt_http_module, with -m`" .-> SigMgmt.Glue\n  SigHttp -. "`runs the handler registered for the longest matching prefix, \'/\' here`" .-> SigMgmt.Glue\n  SigMgmt.Glue -. "`sig_mgmt_from_runtime in its create hook`" .-> SigMgmt.Module\n  SigMgmt.Actions -. "`builds the returned {name, state} tree under the shared lock`" .-> SigMgmt.Reads\n  SigMgmt.Rest -. "`GET routes`" .-> SigMgmt.Reads\n  SigMgmt.Rest -. "`POST start, stop, restart and shutdown routes`" .-> SigMgmt.Actions\n  SigMgmt.Rest -. "`PUT, PATCH, DELETE and rename routes`" .-> SigMgmt.Edits\n  SigMgmt.Rest -. "`maps statuses to HTTP and renders the result tree`" .-> SigMgmt.Status\n  SigMgmt.Glue -. "`the registered handler calls sig_mgmt_rest_handle`" .-> SigMgmt.Rest\n  SigMgmt.Module -. "`[...]`" .-> SigPlatform\n  SigMgmt.Module -. "`registered as the runtime module \'mgmt\'; create and destroy hooks only`" .-> SigRuntime\n  SigMgmt.Reads -. "`[...]`" .-> SigCapsules\n  SigMgmt.Reads -. "`builds the result trees with sig_value maps and lists`" .-> SigFoundation\n  SigMgmt.Reads -. "`sig_rwlock_rdlock around every read`" .-> SigPlatform\n  SigMgmt.Reads -. "`[...]`" .-> SigProject\n  SigMgmt.Reads -. "`sig_runtime_walk_modules for the module names`" .-> SigRuntime\n  SigMgmt.Reads -. "`walks the instances of a service, its name, its running flag`" .-> SigService\n  SigMgmt.Actions -. "`shared lock for the lookup, exclusive lock for the rebuild`" .-> SigPlatform\n  SigMgmt.Actions -. "`sig_project_refresh_service rebuilds a stopped, dirty service`" .-> SigProject\n  SigMgmt.Actions -. "`[...]`" .-> SigRuntime\n  SigMgmt.Edits -. "`builds the result tree from the definition text`" .-> SigFoundation\n  SigMgmt.Edits -. "`sig_rwlock_wrlock around the edit`" .-> SigPlatform\n  SigMgmt.Edits -. "`[...]`" .-> SigProject\n  SigMgmt.Edits -. "`sig_runtime_edit runs the project edit under the control lock`" .-> SigRuntime\n  SigMgmt.Status -. "`sig_json writer, sig_value_from_json for the rename body`" .-> SigFoundation\n  SigMgmt.Glue -. "`sig_http_server_from_runtime and sig_http_server_register(\'/\') in its create hook`" .-> SigHttp\n  SigMgmt.Glue -. "`registered as the runtime module \'mgmt_http\'; create hook only`" .-> SigRuntime\n';case`edit_and_restart`:return`---
title: "Edit a configuration, then restart the service"
---
graph LR
  SigHttpDispatch@{ shape: rectangle, label: "Request evaluation and routing" }
  SigMgmtGlue@{ shape: rectangle, label: "HTTP glue module" }
  SigMgmtRest@{ shape: rectangle, label: "REST router" }
  SigMgmtEdits@{ shape: rectangle, label: "Edit operations" }
  SigRuntimeControl@{ shape: rectangle, label: "Control mutex (edit lock)" }
  SigProjectEditing@{ shape: rectangle, label: "Editing" }
  SigProjectParser@{ shape: rectangle, label: "Config parser" }
  SigPersistenceStore@{ shape: rectangle, label: "Store interface" }
  SigPersistenceFile@{ shape: rectangle, label: "File backend" }
  SigPersistenceAtomic@{ shape: rectangle, label: "Atomic save" }
  SigProjectDirty@{ shape: rectangle, label: "Dirty tracking" }
  SigMgmtActions@{ shape: rectangle, label: "Service actions" }
  SigServiceLifecycle@{ shape: rectangle, label: "Start and stop" }
  SigMgmtReads@{ shape: rectangle, label: "Read operations" }
  SigHttpDispatch -. "\`PATCH /configurations/Sim: the server has read the whole request, request_authorized() accepted it, and the longest matching prefix is '/', whose handler is the glue\`" .-> SigMgmtGlue
  SigMgmtGlue -. "\`sig_mgmt_rest_handle(method, path, body) splits and decodes the path and finds the PATCH route (400 if the body is empty)\`" .-> SigMgmtRest
  SigMgmtRest -. "\`sig_mgmt_patch_configuration: the exclusive mgmt lock is taken, so in-flight reads drain first\`" .-> SigMgmtEdits
  SigMgmtEdits -. "\`sig_runtime_edit runs the project edit under the runtime control mutex (SIG_ERR_STATE if the runtime is not RUNNING)\`" .-> SigRuntimeControl
  SigRuntimeControl -. "\`sig_project_patch_configuration: the JSON patch is merged over the stored text, then put_configuration runs\`" .-> SigProjectEditing
  SigProjectEditing -. "\`the merged document is parsed exactly as at load, then checked against the property table of its capsule (sig_capsule_configuration_validate); nothing is written if either fails (422 with the reason)\`" .-> SigProjectParser
  SigProjectEditing -. "\`save_doc: the document plus a newline goes to sig_persistence_save('configurations', 'Sim')\`" .-> SigPersistenceStore
  SigPersistenceStore -. "\`the namespace and key are checked against the file backend rules, and the 'configurations' namespace maps to the .cfg extension\`" .-> SigPersistenceFile
  SigPersistenceFile -. "\`the file backend writes Sim.cfg.tmp, fsyncs it and renames it over Sim.cfg; on failure the old file and the old definition stay\`" .-> SigPersistenceAtomic
  SigProjectEditing -. "\`the sequence number is bumped, so every service that uses Sim is dirty. A stopped service is rebuilt right away; a running one keeps its old instances\`" .-> SigProjectDirty
  SigMgmtEdits -. "\`the exclusive lock is released, then the result {name, config} is built from the copied text; 200 with the new document\`" .-> SigMgmtRest
  SigHttpDispatch -. "\`POST /services/test/restart arrives the same way\`" .-> SigMgmtGlue
  SigMgmtGlue -. "\`matched against POST /services/:name/restart\`" .-> SigMgmtRest
  SigMgmtRest -. "\`sig_mgmt_restart_service holds none of the mgmt lock while the hooks run\`" .-> SigMgmtActions
  SigMgmtActions -. "\`sig_runtime_service_stop under the control mutex\`" .-> SigRuntimeControl
  SigRuntimeControl -. "\`sig_service_stop: the worker is joined first, then the stop hooks run on the calling thread\`" .-> SigServiceLifecycle
  SigMgmtActions -. "\`prepare_service: still dirty and stopped, so under the exclusive lock and sig_runtime_edit, sig_project_refresh_service rebuilds the service from its stored definition text (memory, not a reload from disk)\`" .-> SigProjectDirty
  SigMgmtActions -. "\`sig_runtime_service_start_prebuilt (SIG_ERR_STALE would send it back to the rebuild, up to 8 times)\`" .-> SigRuntimeControl
  SigRuntimeControl -. "\`sig_service_start: start hooks on the calling thread, then the worker thread is spawned\`" .-> SigServiceLifecycle
  SigMgmtActions -. "\`the {name, state} result is built under the shared lock and returned with 200; it carries no dirty flag\`" .-> SigMgmtReads
`;case`persistence`:return`---
title: "Persistence"
---
graph TB
  subgraph SigPersistence["\`Persistence\`"]
    SigPersistence.Registry@{ shape: rectangle, label: "Backend registry" }
    SigPersistence.Store@{ shape: rectangle, label: "Store interface" }
    SigPersistence.File@{ shape: rectangle, label: "File backend" }
    SigPersistence.Atomic@{ shape: rectangle, label: "Atomic save" }
  end
  SigPersistence.Store -. "\`forwards to the hooks of the backend it was created with (the file backend is the one the library ships)\`" .-> SigPersistence.File
  SigPersistence.Registry -. "\`holds the sig_persistence_module structs that sig_persistence_create binds\`" .-> SigPersistence.Store
  SigPersistence.File -. "\`save writes through the temp file and rename\`" .-> SigPersistence.Atomic
`;case`persistence_components`:return`---
title: "Persistence components"
---
graph TB
  SigHost@{ shape: rectangle, label: "Host" }
  SigProject@{ shape: rectangle, label: "Project" }
  subgraph SigPersistence["\`Persistence\`"]
    SigPersistence.Registry@{ shape: rectangle, label: "Backend registry" }
    SigPersistence.Store@{ shape: rectangle, label: "Store interface" }
    SigPersistence.File@{ shape: rectangle, label: "File backend" }
    SigPersistence.Atomic@{ shape: rectangle, label: "Atomic save" }
  end
  SigFoundation@{ shape: rectangle, label: "Foundation" }
  SigHost -. "\`sig_persistence_create opens the store; sig_persistence_destroy closes it last\`" .-> SigPersistence.Store
  SigHost -. "\`passes sig_persistence_file_module and the project directory\`" .-> SigPersistence.File
  SigProject -. "\`[...]\`" .-> SigPersistence.Store
  SigPersistence.Store -. "\`forwards to the hooks of the backend it was created with (the file backend is the one the library ships)\`" .-> SigPersistence.File
  SigPersistence.Registry -. "\`holds the sig_persistence_module structs that sig_persistence_create binds\`" .-> SigPersistence.Store
  SigPersistence.File -. "\`save writes through the temp file and rename\`" .-> SigPersistence.Atomic
  SigPersistence.Store -. "\`[...]\`" .-> SigFoundation
  SigPersistence.Registry -. "\`backends kept in a sig_ht\`" .-> SigFoundation
  SigPersistence.File -. "\`paths, key lists and the loaded buffer\`" .-> SigFoundation
`;case`platform`:return`---
title: "Platform"
---
graph TB
  subgraph SigPlatform["\`Platform\`"]
    SigPlatform.Threads@{ shape: rectangle, label: "Threads and synchronization" }
    SigPlatform.Time@{ shape: rectangle, label: "Time" }
    SigPlatform.Poller@{ shape: rectangle, label: "Poller backends" }
    SigPlatform.Net@{ shape: rectangle, label: "TCP sockets" }
  end
  SigPlatform.Threads -. "\`deadlines for timed waits\`" .-> SigPlatform.Time
`;case`platform_components`:return'---\ntitle: "Platform components"\n---\ngraph TB\n  SigFeed@{ shape: rectangle, label: "Signal feed" }\n  SigFoundation@{ shape: rectangle, label: "Foundation" }\n  SigHttp@{ shape: rectangle, label: "HTTP" }\n  SigMgmt@{ shape: rectangle, label: "Management" }\n  SigRuntime@{ shape: rectangle, label: "Runtime" }\n  SigService@{ shape: rectangle, label: "Service" }\n  subgraph SigPlatform["`Platform`"]\n    SigPlatform.Threads@{ shape: rectangle, label: "Threads and synchronization" }\n    SigPlatform.Net@{ shape: rectangle, label: "TCP sockets" }\n    SigPlatform.Poller@{ shape: rectangle, label: "Poller backends" }\n    SigPlatform.Time@{ shape: rectangle, label: "Time" }\n  end\n  SigFeed -. "`[...]`" .-> SigPlatform.Threads\n  SigFeed -. "`millisecond clock for the liveness deadlines`" .-> SigPlatform.Time\n  SigFeed -. "`[...]`" .-> SigPlatform.Net\n  SigFoundation -. "`serializes writes with a sig_mutex`" .-> SigPlatform.Threads\n  SigHttp -. "`sig_thread_create and sig_thread_join for the server thread`" .-> SigPlatform.Threads\n  SigHttp -. "`[...]`" .-> SigPlatform.Time\n  SigHttp -. "`SIG_POLL_READ and SIG_POLL_WRITE event masks for its watches`" .-> SigPlatform.Poller\n  SigHttp -. "`[...]`" .-> SigPlatform.Net\n  SigMgmt -. "`[...]`" .-> SigPlatform.Threads\n  SigMgmt -. "`sig_time_now for the start time`" .-> SigPlatform.Time\n  SigRuntime -. "`control mutex, shutdown mutex and condition`" .-> SigPlatform.Threads\n  SigRuntime -. "`[...]`" .-> SigPlatform.Time\n  SigRuntime -. "`sleeps in sig_poller_wait; wakes with sig_poller_wake`" .-> SigPlatform.Poller\n  SigService -. "`[...]`" .-> SigPlatform.Threads\n  SigService -. "`sig_time_now for the next fire time`" .-> SigPlatform.Time\n  SigPlatform.Threads -. "`deadlines for timed waits`" .-> SigPlatform.Time\n  SigPlatform.Poller -. "`allocates the poller state`" .-> SigFoundation\n  SigPlatform.Net -. "`[...]`" .-> SigFoundation\n';case`project`:return`---
title: "Project"
---
graph TB
  subgraph SigProject["\`Project\`"]
    SigProject.Loader@{ shape: rectangle, label: "Project load" }
    SigProject.Ownership@{ shape: rectangle, label: "Ownership and auto-start" }
    SigProject.Introspection@{ shape: rectangle, label: "Walk and introspection" }
    SigProject.Editing@{ shape: rectangle, label: "Editing" }
    SigProject.Dirty@{ shape: rectangle, label: "Dirty tracking" }
    SigProject.Parser@{ shape: rectangle, label: "Config parser" }
  end
  SigProject.Loader -. "\`parses each stored document: configurations first, then services\`" .-> SigProject.Parser
  SigProject.Editing -. "\`validates a new document exactly as load does\`" .-> SigProject.Parser
  SigProject.Dirty -. "\`rebuilds a stopped service from its definition\`" .-> SigProject.Parser
  SigProject.Editing -. "\`rebuilds stopped services after every edit\`" .-> SigProject.Dirty
`;case`project_components`:return'---\ntitle: "Project components"\n---\ngraph TB\n  SigMgmt@{ shape: rectangle, label: "Management" }\n  SigRuntime@{ shape: rectangle, label: "Runtime" }\n  subgraph SigProject["`Project`"]\n    SigProject.Introspection@{ shape: rectangle, label: "Walk and introspection" }\n    SigProject.Editing@{ shape: rectangle, label: "Editing" }\n    SigProject.Loader@{ shape: rectangle, label: "Project load" }\n    SigProject.Ownership@{ shape: rectangle, label: "Ownership and auto-start" }\n    SigProject.Dirty@{ shape: rectangle, label: "Dirty tracking" }\n    SigProject.Parser@{ shape: rectangle, label: "Config parser" }\n  end\n  SigPersistence@{ shape: rectangle, label: "Persistence" }\n  SigCapsules@{ shape: rectangle, label: "Capsules" }\n  SigFoundation@{ shape: rectangle, label: "Foundation" }\n  SigService@{ shape: rectangle, label: "Service" }\n  SigMgmt -. "`walks and looks up services and configurations, and copies their stored definitions`" .-> SigProject.Introspection\n  SigMgmt -. "`sig_project_put/patch/delete_* and rename_configuration`" .-> SigProject.Editing\n  SigMgmt -. "`[...]`" .-> SigProject.Dirty\n  SigRuntime -. "`sig_project_load at start`" .-> SigProject.Loader\n  SigRuntime -. "`auto-start at start, stop_all and destroy at stop`" .-> SigProject.Ownership\n  SigRuntime -. "`[...]`" .-> SigProject.Introspection\n  SigRuntime -. "`start and restart rebuild a stale stopped service`" .-> SigProject.Dirty\n  SigProject.Loader -. "`parses each stored document: configurations first, then services`" .-> SigProject.Parser\n  SigProject.Editing -. "`validates a new document exactly as load does`" .-> SigProject.Parser\n  SigProject.Dirty -. "`rebuilds a stopped service from its definition`" .-> SigProject.Parser\n  SigProject.Editing -. "`rebuilds stopped services after every edit`" .-> SigProject.Dirty\n  SigProject.Parser -. "`[...]`" .-> SigCapsules\n  SigProject.Parser -. "`sig_value_from_json parses the document`" .-> SigFoundation\n  SigProject.Parser -. "`[...]`" .-> SigService\n  SigProject.Loader -. "`[...]`" .-> SigFoundation\n  SigProject.Loader -. "`sig_persistence_list and sig_persistence_load on the configurations namespace, then the services namespace`" .-> SigPersistence\n  SigProject.Ownership -. "`[...]`" .-> SigCapsules\n  SigProject.Ownership -. "`[...]`" .-> SigService\n  SigProject.Editing -. "`validates properties against the capsule table`" .-> SigCapsules\n  SigProject.Editing -. "`merge patch and renaming work on parsed JSON`" .-> SigFoundation\n  SigProject.Editing -. "`sig_persistence_save of the edited document (plus a newline) and sig_persistence_remove on delete`" .-> SigPersistence\n';case`overview`:return'---\ntitle: "Modules"\n---\ngraph TB\n  SigHost@{ shape: rectangle, label: "Host" }\n  SigFoundation@{ shape: rectangle, label: "Foundation" }\n  SigFeed@{ shape: rectangle, label: "Signal feed" }\n  SigMgmt@{ shape: rectangle, label: "Management" }\n  SigPlatform@{ shape: rectangle, label: "Platform" }\n  SigRuntime@{ shape: rectangle, label: "Runtime" }\n  SigProject@{ shape: rectangle, label: "Project" }\n  SigCapsules@{ shape: rectangle, label: "Capsules" }\n  SigPersistence@{ shape: rectangle, label: "Persistence" }\n  SigHttp@{ shape: rectangle, label: "HTTP" }\n  SigService@{ shape: rectangle, label: "Service" }\n  SigCapsules -. "`upward, weather capsule only: sig_http_get_async (SIG_CAPSULES and SIG_HTTP_CLIENT)`" .-> SigHttp\n  SigCapsules -. "`upward: enqueues signals, schedules jobs`" .-> SigService\n  SigHost -. "`creates the registry and fills it with the built-ins`" .-> SigCapsules\n  SigMgmt -. "`registry, instances, routes`" .-> SigCapsules\n  SigProject -. "`builds configurations and instances from the registry`" .-> SigCapsules\n  SigRuntime -. "`borrows the capsule registry`" .-> SigCapsules\n  SigService -. "`runs instance hooks and terminal handlers`" .-> SigCapsules\n  SigFeed -. "`WebSocket upgrade on the server`" .-> SigHttp\n  SigFeed -. "`runtime module; tap and terminal lookup`" .-> SigRuntime\n  SigFeed -. "`service name of a tapped signal`" .-> SigService\n  SigHost -. "`registers the feed (with -m, when built)`" .-> SigFeed\n  SigHttp -. "`[...]`" .-> SigFeed\n  SigService -. "`calls the installed function on the emitting thread (the feed is the only user of sig_runtime_set_tap in this repository)`" .-> SigFeed\n  SigFoundation -. "`upward: the log mutex`" .-> SigPlatform\n  SigHost -. "`registers the server (with -m)`" .-> SigHttp\n  SigHost -. "`registers management and its glue (with -m)`" .-> SigMgmt\n  SigHost -. "`opens the store`" .-> SigPersistence\n  SigHost -. "`creates, starts and stops the runtime; registers modules`" .-> SigRuntime\n  SigHttp -. "`runs the handler registered for the longest matching prefix, \'/\' here`" .-> SigMgmt\n  SigHttp -. "`runtime module; uses the loop of the runtime`" .-> SigRuntime\n  SigMgmt -. "`the glue registers the REST handler on the server`" .-> SigHttp\n  SigMgmt -. "`reads and edits through the runtime`" .-> SigProject\n  SigMgmt -. "`service control, edits, shutdown`" .-> SigRuntime\n  SigMgmt -. "`service and instance state`" .-> SigService\n  SigProject -. "`loads and saves the stored documents`" .-> SigPersistence\n  SigRuntime -. "`borrows the store`" .-> SigPersistence\n  SigProject -. "`creates services and adds instances`" .-> SigService\n  SigRuntime -. "`loads, owns and edits the project`" .-> SigProject\n  SigRuntime -. "`starts and stops services, sets driven mode and the tap`" .-> SigService\n  SigService -. "`upward: the tap type, from sig_tap.h`" .-> SigRuntime\n';case`runtime`:return`---
title: "Runtime"
---
graph TB
  subgraph SigRuntime["\`Runtime\`"]
    SigRuntime.Lifecycle@{ shape: rectangle, label: "Lifecycle state machine" }
    SigRuntime.Control@{ shape: rectangle, label: "Control mutex (edit lock)" }
    SigRuntime.Stepping@{ shape: rectangle, label: "Driven mode and stepping" }
    SigRuntime.Shutdown@{ shape: rectangle, label: "Shutdown request" }
    SigRuntime.Modules@{ shape: rectangle, label: "Runtime module registry" }
    SigRuntime.Tap@{ shape: rectangle, label: "Signal tap installation" }
    SigRuntime.Loop@{ shape: rectangle, label: "Event loop" }
  end
  SigRuntime.Lifecycle -. "\`start clears a pending request\`" .-> SigRuntime.Shutdown
  SigRuntime.Lifecycle -. "\`create all, start all, then stop and destroy in reverse\`" .-> SigRuntime.Modules
  SigRuntime.Lifecycle -. "\`stop clears the tap on every service before modules go\`" .-> SigRuntime.Tap
  SigRuntime.Shutdown -. "\`a request wakes the loop when one is set\`" .-> SigRuntime.Loop
  SigRuntime.Stepping -. "\`service wake callback calls sig_loop_wake\`" .-> SigRuntime.Loop
`;case`runtime_components`:return'---\ntitle: "Runtime components"\n---\ngraph TB\n  SigFeed@{ shape: rectangle, label: "Signal feed" }\n  SigHost@{ shape: rectangle, label: "Host" }\n  SigHttp@{ shape: rectangle, label: "HTTP" }\n  SigMgmt@{ shape: rectangle, label: "Management" }\n  subgraph SigRuntime["`Runtime`"]\n    SigRuntime.Control@{ shape: rectangle, label: "Control mutex (edit lock)" }\n    SigRuntime.Lifecycle@{ shape: rectangle, label: "Lifecycle state machine" }\n    SigRuntime.Stepping@{ shape: rectangle, label: "Driven mode and stepping" }\n    SigRuntime.Shutdown@{ shape: rectangle, label: "Shutdown request" }\n    SigRuntime.Modules@{ shape: rectangle, label: "Runtime module registry" }\n    SigRuntime.Tap@{ shape: rectangle, label: "Signal tap installation" }\n    SigRuntime.Loop@{ shape: rectangle, label: "Event loop" }\n  end\n  SigProject@{ shape: rectangle, label: "Project" }\n  SigService@{ shape: rectangle, label: "Service" }\n  SigFoundation@{ shape: rectangle, label: "Foundation" }\n  SigPlatform@{ shape: rectangle, label: "Platform" }\n  SigFeed -. "`registered as the runtime module \'signal_feed\'; create, start, stop and destroy hooks`" .-> SigRuntime.Modules\n  SigFeed -. "`sig_runtime_find_terminal validates the names and gives the direction`" .-> SigRuntime.Control\n  SigFeed -. "`sig_runtime_set_tap installs the callback (on every successful subscribe) and removes it when the last subscription goes`" .-> SigRuntime.Tap\n  SigFeed -. "`[...]`" .-> SigRuntime.Loop\n  SigHost -. "`sig_runtime_create, start, stop and destroy`" .-> SigRuntime.Lifecycle\n  SigHost -. "`[...]`" .-> SigRuntime.Shutdown\n  SigHost -. "`sig_runtime_register_module for each configured module, in order`" .-> SigRuntime.Modules\n  SigHost -. "`sig_runtime_dump_info on SIGINFO`" .-> SigRuntime.Control\n  SigHost -. "`[...]`" .-> SigRuntime.Loop\n  SigHost -. "`single-threaded only: sig_runtime_set_loop; the step hook calls sig_runtime_step`" .-> SigRuntime.Stepping\n  SigHttp -. "`registered as the runtime module \'http_server\'; create, start, stop and destroy hooks`" .-> SigRuntime.Modules\n  SigHttp -. "`sig_loop_watch_fd, sig_loop_watch_modify, sig_loop_timer_start for connections and the listener`" .-> SigRuntime.Loop\n  SigMgmt -. "`sig_runtime_request_shutdown`" .-> SigRuntime.Shutdown\n  SigMgmt -. "`[...]`" .-> SigRuntime.Modules\n  SigMgmt -. "`[...]`" .-> SigRuntime.Control\n  SigRuntime.Lifecycle -. "`start clears a pending request`" .-> SigRuntime.Shutdown\n  SigRuntime.Lifecycle -. "`create all, start all, then stop and destroy in reverse`" .-> SigRuntime.Modules\n  SigRuntime.Lifecycle -. "`stop clears the tap on every service before modules go`" .-> SigRuntime.Tap\n  SigRuntime.Shutdown -. "`a request wakes the loop when one is set`" .-> SigRuntime.Loop\n  SigRuntime.Stepping -. "`service wake callback calls sig_loop_wake`" .-> SigRuntime.Loop\n  SigRuntime.Lifecycle -. "`[...]`" .-> SigFoundation\n  SigRuntime.Lifecycle -. "`[...]`" .-> SigPlatform\n  SigRuntime.Lifecycle -. "`[...]`" .-> SigProject\n  SigRuntime.Lifecycle -. "`in driven mode only: sets driven and the wake callback on each service`" .-> SigService\n  SigRuntime.Control -. "`[...]`" .-> SigProject\n  SigRuntime.Control -. "`start and stop under the control mutex; blocks until hooks have run`" .-> SigService\n  SigRuntime.Tap -. "`walks the services`" .-> SigProject\n  SigRuntime.Tap -. "`installs the tap on each service`" .-> SigService\n  SigRuntime.Loop -. "`[...]`" .-> SigFoundation\n  SigRuntime.Loop -. "`[...]`" .-> SigPlatform\n  SigRuntime.Stepping -. "`walks the services`" .-> SigProject\n  SigRuntime.Stepping -. "`steps each running driven service`" .-> SigService\n';case`boot_and_shutdown`:return'---\ntitle: "Boot and shutdown (sig_host_run)"\n---\ngraph LR\n  SigHostRunner@{ shape: rectangle, label: "Boot runner" }\n  SigPersistenceStore@{ shape: rectangle, label: "Store interface" }\n  SigRuntimeLifecycle@{ shape: rectangle, label: "Lifecycle state machine" }\n  SigRuntimeLoop@{ shape: rectangle, label: "Event loop" }\n  SigRuntimeStepping@{ shape: rectangle, label: "Driven mode and stepping" }\n  SigRuntimeModules@{ shape: rectangle, label: "Runtime module registry" }\n  SigHostShutdown@{ shape: rectangle, label: "POSIX shutdown trigger" }\n  SigProjectLoader@{ shape: rectangle, label: "Project load" }\n  SigProjectParser@{ shape: rectangle, label: "Config parser" }\n  SigProjectOwnership@{ shape: rectangle, label: "Ownership and auto-start" }\n  SigServiceLifecycle@{ shape: rectangle, label: "Start and stop" }\n  SigRuntimeShutdown@{ shape: rectangle, label: "Shutdown request" }\n  SigRuntimeTap@{ shape: rectangle, label: "Signal tap installation" }\n  SigHostRunner -. "`sig_persistence_create opens the store (the file backend, from the project directory)`" .-> SigPersistenceStore\n  SigHostRunner -. "`sig_runtime_create takes the store and the capsule registry (both borrowed)`" .-> SigRuntimeLifecycle\n  SigHostRunner -. "`Single-threaded mode only: sig_loop_create and sig_loop_set_step(host_step)`" .-> SigRuntimeLoop\n  SigHostRunner -. "`Single-threaded mode only: sig_runtime_set_loop (CREATED only)`" .-> SigRuntimeStepping\n  SigHostRunner -. "`sig_runtime_register_module for each configured module, in order (CREATED only)`" .-> SigRuntimeModules\n  SigHostRunner -. "`arm_shutdown, before the start: a sigwait thread, or in single-threaded mode handlers and a self-pipe on the loop`" .-> SigHostShutdown\n  SigHostRunner -. "`sig_runtime_start`" .-> SigRuntimeLifecycle\n  SigRuntimeLifecycle -. "`state STARTING, clears any shutdown request, then sig_project_load reads the store`" .-> SigProjectLoader\n  SigProjectLoader -. "`configurations are parsed first, then services, whose instances are wired in two passes`" .-> SigProjectParser\n  SigRuntimeLifecycle -. "`create hook of every module in registration order, then start hook of every module`" .-> SigRuntimeModules\n  SigRuntimeLifecycle -. "`each service is put in driven or threaded mode, then sig_project_start_auto`" .-> SigProjectOwnership\n  SigProjectOwnership -. "`every auto_start service: start hooks run on the calling thread, then the worker thread is spawned (none if driven); state becomes RUNNING`" .-> SigServiceLifecycle\n  SigHostRunner -. "`Threaded mode: sig_runtime_wait blocks until a shutdown is requested`" .-> SigRuntimeShutdown\n  SigHostRunner -. "`Single-threaded mode instead: sig_loop_run until the step hook sees a shutdown request and calls sig_loop_stop`" .-> SigRuntimeLoop\n  SigHostShutdown -. "`On SIGINT or SIGTERM: sig_runtime_request_shutdown sets the flag, notifies the condition, wakes the loop if set`" .-> SigRuntimeShutdown\n  SigHostRunner -. "`sig_runtime_stop`" .-> SigRuntimeLifecycle\n  SigRuntimeLifecycle -. "`state STOPPING, then sig_project_stop_all`" .-> SigProjectOwnership\n  SigProjectOwnership -. "`sig_service_stop: worker joined first, then stop hooks run on the calling thread`" .-> SigServiceLifecycle\n  SigRuntimeLifecycle -. "`the tap is cleared on every service; the control mutex is released`" .-> SigRuntimeTap\n  SigRuntimeLifecycle -. "`stop hook of every module in reverse order, then destroy hook of every module in reverse order`" .-> SigRuntimeModules\n  SigRuntimeLifecycle -. "`sig_project_destroy: each service stopped, its instances destroyed, the service destroyed; then configurations; state CREATED`" .-> SigProjectOwnership\n  SigHostRunner -. "`disarm_shutdown: the thread is joined and the signal mask restored, or the handlers restored and the pipe closed`" .-> SigHostShutdown\n  SigHostRunner -. "`sig_runtime_destroy`" .-> SigRuntimeLifecycle\n  SigHostRunner -. "`Single-threaded mode only: sig_loop_destroy`" .-> SigRuntimeLoop\n  SigHostRunner -. "`sig_persistence_destroy, last because the runtime borrows the store`" .-> SigPersistenceStore\n';case`service`:return`---
title: "Service"
---
graph TB
  subgraph SigService["\`Service\`"]
    SigService.Lifecycle@{ shape: rectangle, label: "Start and stop" }
    SigService.Instances@{ shape: rectangle, label: "Owned instance set" }
    SigService.Queue@{ shape: rectangle, label: "Signal queue" }
    SigService.Driven@{ shape: rectangle, label: "Driven mode" }
    SigService.Scheduler@{ shape: rectangle, label: "Job scheduler" }
    SigService.Worker@{ shape: rectangle, label: "Worker thread" }
    SigService.Tap@{ shape: rectangle, label: "Tap slot" }
  end
  SigService.Lifecycle -. "\`opens the queue before start hooks; closes it at stop and on a failed start\`" .-> SigService.Queue
  SigService.Lifecycle -. "\`cancels all jobs at stop and on a failed start\`" .-> SigService.Scheduler
  SigService.Lifecycle -. "\`spawns it unless the service is driven; joins it first on stop\`" .-> SigService.Worker
  SigService.Queue -. "\`notifies the queue condition variable\`" .-> SigService.Worker
  SigService.Queue -. "\`calls the wake callback of the owner, with no lock held\`" .-> SigService.Driven
  SigService.Driven -. "\`a step delivers the queued batch\`" .-> SigService.Queue
  SigService.Scheduler -. "\`notifies the condition so the wait deadline is recomputed\`" .-> SigService.Worker
  SigService.Worker -. "\`runs the jobs that are due\`" .-> SigService.Scheduler
  SigService.Driven -. "\`a step runs the jobs that are due\`" .-> SigService.Scheduler
  SigService.Worker -. "\`input tap just before the handler\`" .-> SigService.Tap
  SigService.Driven -. "\`input tap before each handler\`" .-> SigService.Tap
`;case`service_components`:return'---\ntitle: "Service components"\n---\ngraph TB\n  SigCapsules@{ shape: rectangle, label: "Capsules" }\n  SigMgmt@{ shape: rectangle, label: "Management" }\n  SigProject@{ shape: rectangle, label: "Project" }\n  SigRuntime@{ shape: rectangle, label: "Runtime" }\n  subgraph SigService["`Service`"]\n    SigService.Instances@{ shape: rectangle, label: "Owned instance set" }\n    SigService.Lifecycle@{ shape: rectangle, label: "Start and stop" }\n    SigService.Queue@{ shape: rectangle, label: "Signal queue" }\n    SigService.Driven@{ shape: rectangle, label: "Driven mode" }\n    SigService.Scheduler@{ shape: rectangle, label: "Job scheduler" }\n    SigService.Worker@{ shape: rectangle, label: "Worker thread" }\n    SigService.Tap@{ shape: rectangle, label: "Tap slot" }\n  end\n  SigFoundation@{ shape: rectangle, label: "Foundation" }\n  SigFeed@{ shape: rectangle, label: "Signal feed" }\n  SigPlatform@{ shape: rectangle, label: "Platform" }\n  SigCapsules -. "`sig_service_enqueue on the service of the destination`" .-> SigService.Queue\n  SigCapsules -. "`schedule and cancel jobs on instance->service`" .-> SigService.Scheduler\n  SigCapsules -. "`output tap before the route lookup`" .-> SigService.Tap\n  SigMgmt -. "`walks the instances of a service, its name, its running flag`" .-> SigService.Instances\n  SigProject -. "`[...]`" .-> SigService.Lifecycle\n  SigProject -. "`adds each instance to the service`" .-> SigService.Instances\n  SigRuntime -. "`start and stop under the control mutex; blocks until hooks have run`" .-> SigService.Lifecycle\n  SigRuntime -. "`[...]`" .-> SigService.Driven\n  SigRuntime -. "`installs the tap on each service`" .-> SigService.Tap\n  SigService.Lifecycle -. "`opens the queue before start hooks; closes it at stop and on a failed start`" .-> SigService.Queue\n  SigService.Lifecycle -. "`cancels all jobs at stop and on a failed start`" .-> SigService.Scheduler\n  SigService.Lifecycle -. "`spawns it unless the service is driven; joins it first on stop`" .-> SigService.Worker\n  SigService.Queue -. "`notifies the queue condition variable`" .-> SigService.Worker\n  SigService.Queue -. "`calls the wake callback of the owner, with no lock held`" .-> SigService.Driven\n  SigService.Driven -. "`a step delivers the queued batch`" .-> SigService.Queue\n  SigService.Scheduler -. "`notifies the condition so the wait deadline is recomputed`" .-> SigService.Worker\n  SigService.Worker -. "`runs the jobs that are due`" .-> SigService.Scheduler\n  SigService.Driven -. "`a step runs the jobs that are due`" .-> SigService.Scheduler\n  SigService.Worker -. "`input tap just before the handler`" .-> SigService.Tap\n  SigService.Driven -. "`input tap before each handler`" .-> SigService.Tap\n  SigService.Lifecycle -. "`resolves properties, then runs start hooks on the calling thread; stop hooks after the join`" .-> SigCapsules\n  SigService.Lifecycle -. "`[...]`" .-> SigFoundation\n  SigService.Lifecycle -. "`sig_thread_create, sig_thread_join`" .-> SigPlatform\n  SigService.Instances -. "`instances kept in a sig_ht`" .-> SigFoundation\n  SigService.Queue -. "`[...]`" .-> SigFoundation\n  SigService.Scheduler -. "`sig_time_now for the next fire time`" .-> SigPlatform\n  SigService.Worker -. "`terminal->handler(instance, signal, name) on the thread of the service`" .-> SigCapsules\n  SigService.Worker -. "`sig_condition_wait and timedwait on the queue lock`" .-> SigPlatform\n  SigService.Driven -. "`handlers run on the thread that steps`" .-> SigCapsules\n  SigService.Tap -. "`calls the installed function on the emitting thread (the feed is the only user of sig_runtime_set_tap in this repository)`" .-> SigFeed\n  SigService.Tap -. "`set_tap takes the queue lock to swap the slot`" .-> SigPlatform\n';case`signal_delivery`:return`---
title: "Signal delivery"
---
graph LR
  SigCapsulesCapsule@{ shape: rectangle, label: "Capsule" }
  SigCapsulesRoutes@{ shape: rectangle, label: "Routes and notify" }
  SigServiceTap@{ shape: rectangle, label: "Tap slot" }
  SigServiceQueue@{ shape: rectangle, label: "Signal queue" }
  SigFoundationValues@{ shape: rectangle, label: "Values" }
  SigServiceWorker@{ shape: rectangle, label: "Worker thread" }
  SigCapsulesTerminals@{ shape: rectangle, label: "Terminal handlers" }
  SigCapsulesCapsule -. "\`Capsule code calls sig_capsule_instance_notify(src, 'out', &value): from a handler or job on the worker of the source service, or from a start/stop hook on the thread that called start/stop\`" .-> SigCapsulesRoutes
  SigCapsulesRoutes -. "\`Output tap point: sig_service_tap_emit(SIG_TAP_OUTPUT) before the route lookup, so unrouted outputs are seen too; one atomic load if no tap is set\`" .-> SigServiceTap
  SigCapsulesRoutes -. "\`For each route: the input terminal is found by name on the destination capsule, then sig_service_enqueue on the service of the destination (no route: the signal is dropped; one failure does not stop the others)\`" .-> SigServiceQueue
  SigServiceQueue -. "\`sig_value_dup deep-copies the signal into a queue entry, so the sender keeps ownership and does not wait for the receiver to run\`" .-> SigFoundationValues
  SigServiceQueue -. "\`Pushed under the queue lock, queue condition variable notified (a driven service calls its wake callback instead)\`" .-> SigServiceWorker
  SigServiceWorker -. "\`Input tap point: sig_service_tap_emit(SIG_TAP_INPUT) just before the handler, on this worker thread\`" .-> SigServiceTap
  SigServiceWorker -. "\`terminal->handler(instance, &copy, terminal_name) runs on the thread of the destination service; the copy is destroyed afterwards\`" .-> SigCapsulesTerminals
`;default:throw Error(`Unknown viewId: `+e)}};export{e as mmdSource};