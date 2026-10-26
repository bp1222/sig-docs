var e=e=>{switch(e){case`capsules`:return`@startuml
title "Capsules"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SigCapsulesShim>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigCapsulesInstance>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigCapsulesRoutes>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigCapsulesRegistry>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigCapsulesConfiguration>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigCapsulesTerminals>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigCapsulesCapsule>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "Capsules" <<SigCapsules>> as SigCapsules {
  skinparam RectangleBorderColor<<SigCapsules>> #3b82f6
  skinparam RectangleFontColor<<SigCapsules>> #3b82f6
  skinparam RectangleBorderStyle<<SigCapsules>> dashed

  rectangle "==Built-in capsule registration\\n<size:10>[capsules/sig_builtin_capsules.c; target sig_builtin_capsules]</size>\\n\\nsig_builtin_capsules_register adds every capsule selected at build time\\nto a registry, stopping at the first failure. Each capsule has one\\n#ifdef block, and the definitions come from the SIG_CAPSULES build\\noption (default counter, simulator, logger, filter, switch and\\nstate_change). The weather capsule is known to the shim but is not in the\\ndefault list; if listed, it is skipped with a warning unless the HTTP\\nclient is enabled. The shim\\nis a separate static library on top of sig::sig, built only with\\nSIG_HOST, and is called by the host entry point." <<SigCapsulesShim>> as SigCapsulesShim
  rectangle "==Capsule instance\\n<size:10>[sig_capsule_instance_*; sig_ht, opaque state]</size>\\n\\nOne configuration as used by one service. It holds storage (a table of\\nboxed sig_value, not internally synchronized), an opaque state pointer\\nwith an optional destructor, its routes, and the property values\\nresolved at start (checked, defaults applied, read by index with\\nsig_capsule_instance_int and friends). Rule: an instance belongs to its\\nservice. Handlers and jobs run on the service worker thread; start\\nand stop hooks run on the thread that calls sig_service_start or\\nsig_service_stop (before the worker is spawned, after it is joined),\\nso storage and state are serialized with the worker rather than\\ntouched by one thread. The one thread-safe way to affect an instance\\nfrom elsewhere is a signal. (sig_capsule.h says hooks run on the\\nservice thread and sig_service.h says both; the model follows\\nsrc/runtime/sig_service.c:628-760.) Schedule and cancel wrap the scheduler of the service of\\nthe instance." <<SigCapsulesInstance>> as SigCapsulesInstance
  rectangle "==Routes and notify\\n<size:10>[sig_capsule_instance_connect/notify/walk_routes]</size>\\n\\nconnect records that an output terminal of one instance delivers to an\\ninput terminal of another; several connects on one output fan out.\\nRoutes are set at load time, before the instance is in a started\\nservice. notify tells the tap about the output (before the route\\nlookup), then for every route enqueues a copy on the service of the\\ndestination. An output with no routes silently drops the signal.\\nDelivery is best-effort across routes: one failing destination does\\nnot stop the rest, and the status of the last failure is returned.\\nReading the routes (notify, walk_routes) is safe once the project is\\nloaded; connecting concurrently with notify on a running instance is\\nnot." <<SigCapsulesRoutes>> as SigCapsulesRoutes
  rectangle "==Capsule registry\\n<size:10>[sig_capsule_registry_*; sig_ht]</size>\\n\\nA table of capsules by name. The host creates it and registers every\\ncompiled-in capsule before the project is loaded; the runtime and\\nproject borrow it and it must outlive them. Capsules are static data\\nand are never copied, so each must outlive every configuration that\\nreferences it. The registry can be walked and looked up by name." <<SigCapsulesRegistry>> as SigCapsulesRegistry
  rectangle "==Capsule configuration\\n<size:10>[sig_capsule_configuration_*; sig_ht of boxed values]</size>\\n\\nA named configuration: a borrowed capsule plus the property values\\nset for it (the config parser accepts only int, bool, double and\\nstring). Validation checks a\\nconfiguration against the property table of its capsule: required\\nproperties present, types, int ranges, string choices, and no unknown\\nnames. The properties table is not internally synchronized, but a\\nconfiguration is not modified after project load, so walking its\\nproperties is safe from any thread then. The configuration must outlive\\nevery instance that references it." <<SigCapsulesConfiguration>> as SigCapsulesConfiguration
  rectangle "==Terminal handlers\\n<size:10>[sig_terminal, sig_terminal_fn]</size>\\n\\nA terminal is a name plus, for inputs, a handler\\n(instance, signal, terminal name) that returns a status. Handlers run\\non the thread of the destination service (the loop thread when\\nservices are driven), not on the emitter.\\nThe signal is borrowed for the call; the queue owns the copy." <<SigCapsulesTerminals>> as SigCapsulesTerminals
  rectangle "==Capsule\\n<size:10>[struct sig_capsule; static const data]</size>\\n\\nCompiled-in code and its description: a name, a table of input\\nterminals (each with a handler) and of output terminals, a table of\\nproperties (sig_property), optional start and stop hooks and an\\noptional category (source, sink, flow or state). It is data, not\\nbehaviour: the other components call into the functions it points at.\\nA capsule with no property table accepts any configuration properties." <<SigCapsulesCapsule>> as SigCapsulesCapsule
}

SigCapsulesShim .[#8D8D8D,thickness=2].> SigCapsulesRegistry : <color:#8D8D8D>registers each built-in capsule
SigCapsulesConfiguration .[#8D8D8D,thickness=2].> SigCapsulesCapsule : <color:#8D8D8D>validates against the property table of the capsule
SigCapsulesInstance .[#8D8D8D,thickness=2].> SigCapsulesConfiguration : <color:#8D8D8D>resolves property values at start
SigCapsulesRoutes .[#8D8D8D,thickness=2].> SigCapsulesTerminals : <color:#8D8D8D>finds the destination input terminal by name
@enduml
`;case`capsules_components`:return`@startuml
title "Capsules components"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SigHost>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigMgmt>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigProject>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigService>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigCapsulesShim>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigCapsulesInstance>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigCapsulesRoutes>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigCapsulesRegistry>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHttp>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigCapsulesConfiguration>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigCapsulesTerminals>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigCapsulesCapsule>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFoundation>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "==Host\\n<size:10>[sig_host.h; CMake target sig::host and the sighost executable (SIG_HOST)]</size>\\n\\nThe program that runs a project. sig_host_run is the portable boot\\nsequence; host/posix supplies the command line, the shutdown trigger\\nand the choice of persistence backend. The host registers the runtime\\nmodules it is given and knows nothing about particular capsules,\\nruntime modules or signals; main.c is what selects them." <<SigHost>> as SigHost
rectangle "==Management\\n<size:10>[sig_mgmt.h, sig_mgmt_http.h; sig::mgmt (SIG_MGMT) and sig::mgmt_http (built when SIG_MGMT and SIG_HTTP_SERVER are both on)]</size>\\n\\nReads and controls a running runtime. The operations in sig::mgmt take and\\nreturn plain value trees and status codes and know nothing of any\\ntransport. The REST layer and the glue module in sig::mgmt_http map HTTP\\nonto them, on the shared HTTP server. Built when SIG_MGMT is ON; the HTTP\\npart is built when SIG_MGMT and SIG_HTTP_SERVER are both ON. There is no\\nauthentication anywhere in the area." <<SigMgmt>> as SigMgmt
rectangle "==Project\\n<size:10>[sig_project.h, sig_config.h; part of sig::sig]</size>\\n\\nA project is the capsule configurations and services loaded from a\\npersistence store and wired together. It owns the configurations,\\nservices and capsule instances it builds, keeps the JSON definition of\\neach, and writes every edit back to the store. Nothing is started by\\nloading. The store and the capsule registry are borrowed and must outlive\\nthe project." <<SigProject>> as SigProject
rectangle "==Service\\n<size:10>[sig_service.h; part of sig::sig]</size>\\n\\nA service is a worker thread with a signal queue and a job scheduler,\\nowning a set of capsule instances by name (it borrows them; the project\\nowns them). Once a service is started, terminal handlers and lifecycle\\nhooks of its instances run on its own thread, except that start hooks run\\non the thread that called start and stop hooks on the thread that called\\nstop. A service can instead be driven by an event loop, with no thread of\\nits own." <<SigService>> as SigService
rectangle "Capsules" <<SigCapsules>> as SigCapsules {
  skinparam RectangleBorderColor<<SigCapsules>> #3b82f6
  skinparam RectangleFontColor<<SigCapsules>> #3b82f6
  skinparam RectangleBorderStyle<<SigCapsules>> dashed

  rectangle "==Built-in capsule registration\\n<size:10>[capsules/sig_builtin_capsules.c; target sig_builtin_capsules]</size>\\n\\nsig_builtin_capsules_register adds every capsule selected at build time\\nto a registry, stopping at the first failure. Each capsule has one\\n#ifdef block, and the definitions come from the SIG_CAPSULES build\\noption (default counter, simulator, logger, filter, switch and\\nstate_change). The weather capsule is known to the shim but is not in the\\ndefault list; if listed, it is skipped with a warning unless the HTTP\\nclient is enabled. The shim\\nis a separate static library on top of sig::sig, built only with\\nSIG_HOST, and is called by the host entry point." <<SigCapsulesShim>> as SigCapsulesShim
  rectangle "==Capsule instance\\n<size:10>[sig_capsule_instance_*; sig_ht, opaque state]</size>\\n\\nOne configuration as used by one service. It holds storage (a table of\\nboxed sig_value, not internally synchronized), an opaque state pointer\\nwith an optional destructor, its routes, and the property values\\nresolved at start (checked, defaults applied, read by index with\\nsig_capsule_instance_int and friends). Rule: an instance belongs to its\\nservice. Handlers and jobs run on the service worker thread; start\\nand stop hooks run on the thread that calls sig_service_start or\\nsig_service_stop (before the worker is spawned, after it is joined),\\nso storage and state are serialized with the worker rather than\\ntouched by one thread. The one thread-safe way to affect an instance\\nfrom elsewhere is a signal. (sig_capsule.h says hooks run on the\\nservice thread and sig_service.h says both; the model follows\\nsrc/runtime/sig_service.c:628-760.) Schedule and cancel wrap the scheduler of the service of\\nthe instance." <<SigCapsulesInstance>> as SigCapsulesInstance
  rectangle "==Routes and notify\\n<size:10>[sig_capsule_instance_connect/notify/walk_routes]</size>\\n\\nconnect records that an output terminal of one instance delivers to an\\ninput terminal of another; several connects on one output fan out.\\nRoutes are set at load time, before the instance is in a started\\nservice. notify tells the tap about the output (before the route\\nlookup), then for every route enqueues a copy on the service of the\\ndestination. An output with no routes silently drops the signal.\\nDelivery is best-effort across routes: one failing destination does\\nnot stop the rest, and the status of the last failure is returned.\\nReading the routes (notify, walk_routes) is safe once the project is\\nloaded; connecting concurrently with notify on a running instance is\\nnot." <<SigCapsulesRoutes>> as SigCapsulesRoutes
  rectangle "==Capsule registry\\n<size:10>[sig_capsule_registry_*; sig_ht]</size>\\n\\nA table of capsules by name. The host creates it and registers every\\ncompiled-in capsule before the project is loaded; the runtime and\\nproject borrow it and it must outlive them. Capsules are static data\\nand are never copied, so each must outlive every configuration that\\nreferences it. The registry can be walked and looked up by name." <<SigCapsulesRegistry>> as SigCapsulesRegistry
  rectangle "==Capsule configuration\\n<size:10>[sig_capsule_configuration_*; sig_ht of boxed values]</size>\\n\\nA named configuration: a borrowed capsule plus the property values\\nset for it (the config parser accepts only int, bool, double and\\nstring). Validation checks a\\nconfiguration against the property table of its capsule: required\\nproperties present, types, int ranges, string choices, and no unknown\\nnames. The properties table is not internally synchronized, but a\\nconfiguration is not modified after project load, so walking its\\nproperties is safe from any thread then. The configuration must outlive\\nevery instance that references it." <<SigCapsulesConfiguration>> as SigCapsulesConfiguration
  rectangle "==Terminal handlers\\n<size:10>[sig_terminal, sig_terminal_fn]</size>\\n\\nA terminal is a name plus, for inputs, a handler\\n(instance, signal, terminal name) that returns a status. Handlers run\\non the thread of the destination service (the loop thread when\\nservices are driven), not on the emitter.\\nThe signal is borrowed for the call; the queue owns the copy." <<SigCapsulesTerminals>> as SigCapsulesTerminals
  rectangle "==Capsule\\n<size:10>[struct sig_capsule; static const data]</size>\\n\\nCompiled-in code and its description: a name, a table of input\\nterminals (each with a handler) and of output terminals, a table of\\nproperties (sig_property), optional start and stop hooks and an\\noptional category (source, sink, flow or state). It is data, not\\nbehaviour: the other components call into the functions it points at.\\nA capsule with no property table accepts any configuration properties." <<SigCapsulesCapsule>> as SigCapsulesCapsule
}
rectangle "==HTTP\\n<size:10>[sig_http_server.h, sig_ws.h, sig_http_client.h; sig::http_server (SIG_HTTP_SERVER, needs SIG_NET) and sig::http_client (SIG_HTTP_CLIENT, libcurl)]</size>\\n\\nThe HTTP layer, in two independent parts. The server is one shared HTTP/1.1\\nserver per runtime, offered as a runtime module named http_server (build\\noptions SIG_NET and SIG_HTTP_SERVER); other modules register path prefixes\\non it. The client is a blocking and an asynchronous GET over libcurl (build\\noption SIG_HTTP_CLIENT). The server has no TLS and no authentication." <<SigHttp>> as SigHttp
rectangle "==Foundation\\n<size:10>[CMake target sig::sig (always built)]</size>\\n\\nAllocation, status codes, reference counting, hash table and list,\\nlogging, the sig_value data model, JSON, and the expression language.\\nPart of the sig::sig target and always built; it has no dependency on\\nthe optional modules. Its one dependency outside the module is\\nlogging, which takes a platform mutex (sig_thread.h)." <<SigFoundation>> as SigFoundation

SigHost .[#8D8D8D,thickness=2].> SigCapsulesRegistry : <color:#8D8D8D>creates the registry before the run and destroys it after
SigHost .[#8D8D8D,thickness=2].> SigCapsulesShim : <color:#8D8D8D>sig_builtin_capsules_register
SigMgmt .[#8D8D8D,thickness=2].> SigCapsulesRegistry : <color:#8D8D8D>walks the registered capsules and their property tables
SigMgmt .[#8D8D8D,thickness=2].> SigCapsulesConfiguration : <color:#8D8D8D>walks the property values of an instance
SigMgmt .[#8D8D8D,thickness=2].> SigCapsulesInstance : <color:#8D8D8D>instance name, configuration, type and terminals
SigMgmt .[#8D8D8D,thickness=2].> SigCapsulesRoutes : <color:#8D8D8D>sig_capsule_instance_walk_routes for the links of a service
SigProject .[#8D8D8D,thickness=2].> SigCapsulesRegistry : <color:#8D8D8D>looks up the type of a configuration
SigProject .[#8D8D8D,thickness=2].> SigCapsulesConfiguration : <color:#8D8D8D>[...]
SigProject .[#8D8D8D,thickness=2].> SigCapsulesInstance : <color:#8D8D8D>[...]
SigProject .[#8D8D8D,thickness=2].> SigCapsulesRoutes : <color:#8D8D8D>wires receivers with sig_capsule_instance_connect
SigService .[#8D8D8D,thickness=2].> SigCapsulesInstance : <color:#8D8D8D>resolves properties, then runs start hooks on the calling thread; stop hooks after the join
SigService .[#8D8D8D,thickness=2].> SigCapsulesTerminals : <color:#8D8D8D>[...]
SigCapsulesShim .[#8D8D8D,thickness=2].> SigCapsulesRegistry : <color:#8D8D8D>registers each built-in capsule
SigCapsulesConfiguration .[#8D8D8D,thickness=2].> SigCapsulesCapsule : <color:#8D8D8D>validates against the property table of the capsule
SigCapsulesInstance .[#8D8D8D,thickness=2].> SigCapsulesConfiguration : <color:#8D8D8D>resolves property values at start
SigCapsulesRoutes .[#8D8D8D,thickness=2].> SigCapsulesTerminals : <color:#8D8D8D>finds the destination input terminal by name
SigCapsulesRegistry .[#8D8D8D,thickness=2].> SigFoundation : <color:#8D8D8D>[...]
SigCapsulesConfiguration .[#8D8D8D,thickness=2].> SigFoundation : <color:#8D8D8D>boxed property values
SigCapsulesInstance .[#8D8D8D,thickness=2].> SigFoundation : <color:#8D8D8D>[...]
SigCapsulesInstance .[#8D8D8D,thickness=2].> SigService : <color:#8D8D8D>schedule and cancel jobs on instance->service
SigCapsulesRoutes .[#8D8D8D,thickness=2].> SigFoundation : <color:#8D8D8D>one sig_ll of routes per output terminal
SigCapsulesRoutes .[#8D8D8D,thickness=2].> SigService : <color:#8D8D8D>[...]
SigCapsulesShim .[#8D8D8D,thickness=2].> SigHttp : <color:#8D8D8D>the weather capsule, if listed in SIG_CAPSULES and SIG_HTTP_CLIENT is on, takes sig_http_get_async as its transport (weather_capsule.h includes sig_http_client.h)
@enduml
`;case`index`:return`@startuml
title "libsig in context"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam person<<Operator>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam person<<Browser>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam person<<Cli>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHost>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHttp>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPersistence>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFeed>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam database<<Store>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPlatform>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<Network>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
person "==Operator\\n\\nWhoever starts and stops the sighost process on a machine." <<Operator>> as Operator
person "==Browser UI\\n<size:10>[ui/: React and React Flow, static bundle]</size>\\n\\nThe editor for a running host. It is a client of the management REST\\nAPI and of the signal feed WebSocket, and holds no state of its own\\nbeyond an unsaved draft and a list of recent hosts. It polls the host\\nevery 10 seconds. It is served separately, from its own origin, which\\nthe host must allow with -o." <<Browser>> as Browser
person "==curl and scripts\\n\\nAny HTTP client calling the management REST API." <<Cli>> as Cli
rectangle "libsig" <<Sig>> as Sig {
  skinparam RectangleBorderColor<<Sig>> #3b82f6
  skinparam RectangleFontColor<<Sig>> #3b82f6
  skinparam RectangleBorderStyle<<Sig>> dashed

  rectangle "==Host\\n<size:10>[sig_host.h; CMake target sig::host and the sighost executable (SIG_HOST)]</size>\\n\\nThe program that runs a project. sig_host_run is the portable boot\\nsequence; host/posix supplies the command line, the shutdown trigger\\nand the choice of persistence backend. The host registers the runtime\\nmodules it is given and knows nothing about particular capsules,\\nruntime modules or signals; main.c is what selects them." <<SigHost>> as SigHost
  rectangle "==HTTP\\n<size:10>[sig_http_server.h, sig_ws.h, sig_http_client.h; sig::http_server (SIG_HTTP_SERVER, needs SIG_NET) and sig::http_client (SIG_HTTP_CLIENT, libcurl)]</size>\\n\\nThe HTTP layer, in two independent parts. The server is one shared HTTP/1.1\\nserver per runtime, offered as a runtime module named http_server (build\\noptions SIG_NET and SIG_HTTP_SERVER); other modules register path prefixes\\non it. The client is a blocking and an asynchronous GET over libcurl (build\\noption SIG_HTTP_CLIENT). The server has no TLS and no authentication." <<SigHttp>> as SigHttp
  rectangle "==Persistence\\n<size:10>[sig_persistence.h, sig_persistence_file.h; part of sig::sig]</size>\\n\\nA pluggable store of opaque blobs under a (namespace, key) pair. What a\\nnamespace means, and which names are valid, is up to the backend. The\\nlibrary ships one backend, the file backend. The project reads and writes\\nits configuration and service documents through it. The hooks block, so\\nthey are meant for configuration input and output, not for an event\\nloop hot path." <<SigPersistence>> as SigPersistence
  rectangle "==Signal feed\\n<size:10>[sig_signal_feed.h; sig::signal_feed, SIG_SIGNAL_FEED]</size>\\n\\nStreams the signals crossing chosen capsule terminals to WebSocket\\nclients as JSON text frames, on the path "/feed" of the shared HTTP server.\\nA client names a service, instance and terminal and sees the signals from\\nthen on, with no history. The feed is unauthenticated: the only check is\\nthe Origin test the HTTP server makes. The runtime tap is the source of\\nthe data, and it is installed only while at least one subscription exists." <<SigFeed>> as SigFeed
  rectangle "==Platform\\n<size:10>[CMake targets sig::sig (threads, time, poller) and sig::net (TCP, SIG_NET)]</size>\\n\\nEverything OS-specific, behind headers. Threads, time and the poller are\\npart of sig::sig and always built; the TCP layer is the optional sig::net\\ntarget, built with -DSIG_NET=ON. Only POSIX implementations exist today\\n(src/platform/posix and src/net/sig_net_posix.c); the rest of libsig\\ndoes not include OS headers. A port to another system replaces these\\nfiles and nothing above them." <<SigPlatform>> as SigPlatform
}
database "==Project store\\n<size:10>[directory of configurations/*.cfg and services/*.cfg (file backend)]</size>\\n\\nThe source of truth for a project. The runtime loads it at start and\\nthe edit operations rewrite it." <<Store>> as Store
rectangle "==Network\\n<size:10>[TCP, IPv4]</size>\\n\\nThe sockets the HTTP server listens on and its clients connect over." <<Network>> as Network

Operator .[#8D8D8D,thickness=2].> SigHost : <color:#8D8D8D>runs sighost with a project directory and options (host/posix/main.c: -p -l -m -o -s -h)
Browser .[#8D8D8D,thickness=2].> SigHttp : <color:#8D8D8D>REST/JSON over HTTP
Cli .[#8D8D8D,thickness=2].> SigHttp : <color:#8D8D8D>REST/JSON over HTTP
SigHost .[#8D8D8D,thickness=2].> SigHttp : <color:#8D8D8D>registers the server (with -m)
Browser .[#8D8D8D,thickness=2].> SigFeed : <color:#8D8D8D>WebSocket on /feed
SigHost .[#8D8D8D,thickness=2].> SigFeed : <color:#8D8D8D>registers the feed (with -m, when built)
SigHttp .[#8D8D8D,thickness=2].> SigFeed : <color:#8D8D8D>[...]
SigFeed .[#8D8D8D,thickness=2].> SigHttp : <color:#8D8D8D>WebSocket upgrade on the server
SigHost .[#8D8D8D,thickness=2].> SigPersistence : <color:#8D8D8D>opens the store
SigPersistence .[#8D8D8D,thickness=2].> Store : <color:#8D8D8D>reads at project load; rewrites on edit (temp file, then rename)
SigHttp .[#8D8D8D,thickness=2].> SigPlatform : <color:#8D8D8D>sockets, threads, clock
SigFeed .[#8D8D8D,thickness=2].> SigPlatform : <color:#8D8D8D>threads, clock, sockets
SigPlatform .[#8D8D8D,thickness=2].> Network : <color:#8D8D8D>sig_net (the optional sig::net target, SIG_NET): listen, accept, read and write
@enduml
`;case`feed`:return`@startuml
title "Signal feed"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SigFeedModule>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFeedUpgrade>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFeedTap>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFeedConnection>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFeedHub>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFeedMessages>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFeedQueue>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "Signal feed" <<SigFeed>> as SigFeed {
  skinparam RectangleBorderColor<<SigFeed>> #3b82f6
  skinparam RectangleFontColor<<SigFeed>> #3b82f6
  skinparam RectangleBorderStyle<<SigFeed>> dashed

  rectangle "==Feed module\\n<size:10>[sig_signal_feed_module; runtime module "signal_feed"]</size>\\n\\nTakes no config. Its create hook needs the http_server module to be\\nregistered earlier, creates the hub and registers "/feed" as an upgrade\\nprefix, which also makes the server listen. Its start hook uses the loop\\nof the runtime if there is one, so everything runs on the loop thread;\\notherwise it creates a private loop and runs it on one thread of its own.\\nStop clears the running flag, stops and joins that thread, and closes every\\nconnection, which drops their subscriptions. Destroy frees the hub." <<SigFeedModule>> as SigFeedModule
  rectangle "==Upgrade handler\\n<size:10>[on_upgrade, refuse in sig_signal_feed.c]</size>\\n\\nCalled by the HTTP server for a validated WebSocket upgrade on "/feed". It\\ncomputes the accept key and counts the connection. If 8 connections exist\\nit writes the 101 response and a close frame with code 1013 and closes the\\nsocket. If the module is not running it declines, and the server answers\\n503. Otherwise it takes ownership of the connection: directly, when the\\nfeed runs on the runtime loop, or through a hand-off list that the private\\nloop drains in its step hook after being woken." <<SigFeedUpgrade>> as SigFeedUpgrade
  rectangle "==Tap callback\\n<size:10>[hub_tap in sig_feed_hub.c; sig_tap_fn]</size>\\n\\nThe function the runtime installs. It runs on the emitting thread, a\\nservice worker or the loop thread, for every signal in the system while\\nthe tap is installed. It takes the hub lock shared and, for each matching\\nsubscription (same direction, terminal, instance and service name), estimates\\nthe size of the value once and offers a copy to that subscription. It does\\nno I/O and never calls the runtime. It can wait only on short locks: the\\nhub lock, held exclusively briefly when a subscription is added or\\nremoved, and the mutex of one subscription. It allocates for the copy." <<SigFeedTap>> as SigFeedTap
  rectangle "==WebSocket connection\\n<size:10>[conn_on_fd, flush_tick in sig_signal_feed.c; sig_loop watch and timer]</size>\\n\\nOne connection with up to 16 subscriptions, each with a client-chosen id.\\nIt decodes masked client frames (payload up to 4096 bytes): a text frame\\nis a subscribe or unsubscribe command, a ping gets a pong, a close is\\nechoed. A protocol error closes with 1002 and an oversize frame with 1009.\\nA bad command gets an error reply (bad_request, not_found, too_many) and\\nthe connection stays open. A 20 ms timer, running while any connection\\nexists, pops the events of every subscription and writes them. More than\\n1 MiB of unsent data stops both reading from the client and popping the\\nqueues, so the queues fill and the hub drops. It also drops a connection\\nwith no write progress for 30 s, a close not flushed within 5 s, or no\\ninbound traffic for 75 s, and sends a ping every 30 s." <<SigFeedConnection>> as SigFeedConnection
  rectangle "==Subscription hub\\n<size:10>[sig_feed_hub_*; sig_feed_hub.c]</size>\\n\\nThe set of subscriptions, with no sockets. Subscribe checks that the\\nservice, instance and terminal exist in the running project, creates a\\nsubscription with the direction of the terminal, and asks the runtime to\\ninstall the tap. Unsubscribe removes it, and when none is left asks the\\nruntime to remove the tap; destroy does the same. Subscribe, unsubscribe\\nand destroy are serialized by the hub and must not be called from a\\nservice thread, because they call the runtime. Subscriptions are matched\\nby name, so they survive the rebuild of a service. They do not survive a\\nstop of the runtime, which forgets the tap; the hub notices on its next\\nsubscribe or unsubscribe." <<SigFeedHub>> as SigFeedHub
  rectangle "==Message encoding\\n<size:10>[sig_feed_msg.c; sig_json, sig_value_json]</size>\\n\\nParses a client frame (bad JSON is a parse error; a non-object, an unknown\\nop, or a missing, empty or 64-character-or-longer name is an invalid\\nargument, with the id echoed when it could be read). Encodes the four\\nserver messages: subscribed (direction in or out), signal (id, seq, time,\\ntype name and the value as JSON), dropped (count) and error (the code, and\\nthe id when there is one)." <<SigFeedMessages>> as SigFeedMessages
  rectangle "==Subscription queue\\n<size:10>[offer, record_drop, sig_feed_sub_pop; sig_ll under a mutex]</size>\\n\\nA bounded queue per subscription. A signal is queued as a deep copy with a\\nsequence number and a Unix millisecond timestamp. It is dropped and\\ncounted when its estimated size is over 64 KiB, when 256 signals are\\nalready queued, or when 256 KiB of estimated data would be exceeded, and\\nalso when allocation fails. Consecutive drops merge into one marker\\nat the tail, so the reader sees a dropped event with a count at the\\nplace in the stream where the values were lost. Dropped signals do not\\nuse a sequence number. Pop is non-blocking." <<SigFeedQueue>> as SigFeedQueue
}

SigFeedModule .[#8D8D8D,thickness=2].> SigFeedHub : <color:#8D8D8D>creates it in create, destroys it in destroy
SigFeedUpgrade .[#8D8D8D,thickness=2].> SigFeedConnection : <color:#8D8D8D>adopts the connection: directly on the loop thread, or via the hand-off list
SigFeedConnection .[#8D8D8D,thickness=2].> SigFeedHub : <color:#8D8D8D>subscribe and unsubscribe, on the loop thread
SigFeedConnection .[#8D8D8D,thickness=2].> SigFeedQueue : <color:#8D8D8D>sig_feed_sub_pop for each subscription on every flush tick
SigFeedConnection .[#8D8D8D,thickness=2].> SigFeedMessages : <color:#8D8D8D>parses commands; encodes events, replies and errors
SigFeedHub .[#8D8D8D,thickness=2].> SigFeedQueue : <color:#8D8D8D>creates a queue with each subscription
SigFeedTap .[#8D8D8D,thickness=2].> SigFeedQueue : <color:#8D8D8D>offers a copy to each matching subscription
@enduml
`;case`feed_components`:return`@startuml
title "Signal feed components"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SigHost>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHttp>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigService>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFeedModule>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFeedUpgrade>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFeedTap>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFeedConnection>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFeedHub>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFeedMessages>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFeedQueue>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPlatform>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntime>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFoundation>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "==Host\\n<size:10>[sig_host.h; CMake target sig::host and the sighost executable (SIG_HOST)]</size>\\n\\nThe program that runs a project. sig_host_run is the portable boot\\nsequence; host/posix supplies the command line, the shutdown trigger\\nand the choice of persistence backend. The host registers the runtime\\nmodules it is given and knows nothing about particular capsules,\\nruntime modules or signals; main.c is what selects them." <<SigHost>> as SigHost
rectangle "==HTTP\\n<size:10>[sig_http_server.h, sig_ws.h, sig_http_client.h; sig::http_server (SIG_HTTP_SERVER, needs SIG_NET) and sig::http_client (SIG_HTTP_CLIENT, libcurl)]</size>\\n\\nThe HTTP layer, in two independent parts. The server is one shared HTTP/1.1\\nserver per runtime, offered as a runtime module named http_server (build\\noptions SIG_NET and SIG_HTTP_SERVER); other modules register path prefixes\\non it. The client is a blocking and an asynchronous GET over libcurl (build\\noption SIG_HTTP_CLIENT). The server has no TLS and no authentication." <<SigHttp>> as SigHttp
rectangle "==Service\\n<size:10>[sig_service.h; part of sig::sig]</size>\\n\\nA service is a worker thread with a signal queue and a job scheduler,\\nowning a set of capsule instances by name (it borrows them; the project\\nowns them). Once a service is started, terminal handlers and lifecycle\\nhooks of its instances run on its own thread, except that start hooks run\\non the thread that called start and stop hooks on the thread that called\\nstop. A service can instead be driven by an event loop, with no thread of\\nits own." <<SigService>> as SigService
rectangle "Signal feed" <<SigFeed>> as SigFeed {
  skinparam RectangleBorderColor<<SigFeed>> #3b82f6
  skinparam RectangleFontColor<<SigFeed>> #3b82f6
  skinparam RectangleBorderStyle<<SigFeed>> dashed

  rectangle "==Feed module\\n<size:10>[sig_signal_feed_module; runtime module "signal_feed"]</size>\\n\\nTakes no config. Its create hook needs the http_server module to be\\nregistered earlier, creates the hub and registers "/feed" as an upgrade\\nprefix, which also makes the server listen. Its start hook uses the loop\\nof the runtime if there is one, so everything runs on the loop thread;\\notherwise it creates a private loop and runs it on one thread of its own.\\nStop clears the running flag, stops and joins that thread, and closes every\\nconnection, which drops their subscriptions. Destroy frees the hub." <<SigFeedModule>> as SigFeedModule
  rectangle "==Upgrade handler\\n<size:10>[on_upgrade, refuse in sig_signal_feed.c]</size>\\n\\nCalled by the HTTP server for a validated WebSocket upgrade on "/feed". It\\ncomputes the accept key and counts the connection. If 8 connections exist\\nit writes the 101 response and a close frame with code 1013 and closes the\\nsocket. If the module is not running it declines, and the server answers\\n503. Otherwise it takes ownership of the connection: directly, when the\\nfeed runs on the runtime loop, or through a hand-off list that the private\\nloop drains in its step hook after being woken." <<SigFeedUpgrade>> as SigFeedUpgrade
  rectangle "==Tap callback\\n<size:10>[hub_tap in sig_feed_hub.c; sig_tap_fn]</size>\\n\\nThe function the runtime installs. It runs on the emitting thread, a\\nservice worker or the loop thread, for every signal in the system while\\nthe tap is installed. It takes the hub lock shared and, for each matching\\nsubscription (same direction, terminal, instance and service name), estimates\\nthe size of the value once and offers a copy to that subscription. It does\\nno I/O and never calls the runtime. It can wait only on short locks: the\\nhub lock, held exclusively briefly when a subscription is added or\\nremoved, and the mutex of one subscription. It allocates for the copy." <<SigFeedTap>> as SigFeedTap
  rectangle "==WebSocket connection\\n<size:10>[conn_on_fd, flush_tick in sig_signal_feed.c; sig_loop watch and timer]</size>\\n\\nOne connection with up to 16 subscriptions, each with a client-chosen id.\\nIt decodes masked client frames (payload up to 4096 bytes): a text frame\\nis a subscribe or unsubscribe command, a ping gets a pong, a close is\\nechoed. A protocol error closes with 1002 and an oversize frame with 1009.\\nA bad command gets an error reply (bad_request, not_found, too_many) and\\nthe connection stays open. A 20 ms timer, running while any connection\\nexists, pops the events of every subscription and writes them. More than\\n1 MiB of unsent data stops both reading from the client and popping the\\nqueues, so the queues fill and the hub drops. It also drops a connection\\nwith no write progress for 30 s, a close not flushed within 5 s, or no\\ninbound traffic for 75 s, and sends a ping every 30 s." <<SigFeedConnection>> as SigFeedConnection
  rectangle "==Subscription hub\\n<size:10>[sig_feed_hub_*; sig_feed_hub.c]</size>\\n\\nThe set of subscriptions, with no sockets. Subscribe checks that the\\nservice, instance and terminal exist in the running project, creates a\\nsubscription with the direction of the terminal, and asks the runtime to\\ninstall the tap. Unsubscribe removes it, and when none is left asks the\\nruntime to remove the tap; destroy does the same. Subscribe, unsubscribe\\nand destroy are serialized by the hub and must not be called from a\\nservice thread, because they call the runtime. Subscriptions are matched\\nby name, so they survive the rebuild of a service. They do not survive a\\nstop of the runtime, which forgets the tap; the hub notices on its next\\nsubscribe or unsubscribe." <<SigFeedHub>> as SigFeedHub
  rectangle "==Message encoding\\n<size:10>[sig_feed_msg.c; sig_json, sig_value_json]</size>\\n\\nParses a client frame (bad JSON is a parse error; a non-object, an unknown\\nop, or a missing, empty or 64-character-or-longer name is an invalid\\nargument, with the id echoed when it could be read). Encodes the four\\nserver messages: subscribed (direction in or out), signal (id, seq, time,\\ntype name and the value as JSON), dropped (count) and error (the code, and\\nthe id when there is one)." <<SigFeedMessages>> as SigFeedMessages
  rectangle "==Subscription queue\\n<size:10>[offer, record_drop, sig_feed_sub_pop; sig_ll under a mutex]</size>\\n\\nA bounded queue per subscription. A signal is queued as a deep copy with a\\nsequence number and a Unix millisecond timestamp. It is dropped and\\ncounted when its estimated size is over 64 KiB, when 256 signals are\\nalready queued, or when 256 KiB of estimated data would be exceeded, and\\nalso when allocation fails. Consecutive drops merge into one marker\\nat the tail, so the reader sees a dropped event with a count at the\\nplace in the stream where the values were lost. Dropped signals do not\\nuse a sequence number. Pop is non-blocking." <<SigFeedQueue>> as SigFeedQueue
}
rectangle "==Platform\\n<size:10>[CMake targets sig::sig (threads, time, poller) and sig::net (TCP, SIG_NET)]</size>\\n\\nEverything OS-specific, behind headers. Threads, time and the poller are\\npart of sig::sig and always built; the TCP layer is the optional sig::net\\ntarget, built with -DSIG_NET=ON. Only POSIX implementations exist today\\n(src/platform/posix and src/net/sig_net_posix.c); the rest of libsig\\ndoes not include OS headers. A port to another system replaces these\\nfiles and nothing above them." <<SigPlatform>> as SigPlatform
rectangle "==Runtime\\n<size:10>[sig_runtime.h, sig_loop.h, sig_tap.h; part of sig::sig]</size>\\n\\nOwns one running system: the project loaded from the store, the runtime\\nmodules registered with it, and the lifecycle that starts and stops them.\\nThe runtime borrows the persistence store and the capsule registry it was\\ncreated with; both must outlive it. It can also be given an event loop,\\nwhich makes every service driven and the whole system single-threaded." <<SigRuntime>> as SigRuntime
rectangle "==Foundation\\n<size:10>[CMake target sig::sig (always built)]</size>\\n\\nAllocation, status codes, reference counting, hash table and list,\\nlogging, the sig_value data model, JSON, and the expression language.\\nPart of the sig::sig target and always built; it has no dependency on\\nthe optional modules. Its one dependency outside the module is\\nlogging, which takes a platform mutex (sig_thread.h)." <<SigFoundation>> as SigFoundation

SigHost .[#8D8D8D,thickness=2].> SigFeedModule : <color:#8D8D8D>sig_signal_feed_module, with -m when the feed was built
SigHttp .[#8D8D8D,thickness=2].> SigFeedUpgrade : <color:#8D8D8D>[...]
SigService .[#8D8D8D,thickness=2].> SigFeedTap : <color:#8D8D8D>calls the installed function on the emitting thread (the feed is the only user of sig_runtime_set_tap in this repository)
SigFeedModule .[#8D8D8D,thickness=2].> SigFeedHub : <color:#8D8D8D>creates it in create, destroys it in destroy
SigFeedUpgrade .[#8D8D8D,thickness=2].> SigFeedConnection : <color:#8D8D8D>adopts the connection: directly on the loop thread, or via the hand-off list
SigFeedConnection .[#8D8D8D,thickness=2].> SigFeedHub : <color:#8D8D8D>subscribe and unsubscribe, on the loop thread
SigFeedConnection .[#8D8D8D,thickness=2].> SigFeedQueue : <color:#8D8D8D>sig_feed_sub_pop for each subscription on every flush tick
SigFeedConnection .[#8D8D8D,thickness=2].> SigFeedMessages : <color:#8D8D8D>parses commands; encodes events, replies and errors
SigFeedHub .[#8D8D8D,thickness=2].> SigFeedQueue : <color:#8D8D8D>creates a queue with each subscription
SigFeedTap .[#8D8D8D,thickness=2].> SigFeedQueue : <color:#8D8D8D>offers a copy to each matching subscription
SigFeedModule .[#8D8D8D,thickness=2].> SigFoundation : <color:#8D8D8D>logs why a connection was dropped, and configuration errors
SigFeedModule .[#8D8D8D,thickness=2].> SigHttp : <color:#8D8D8D>sig_http_server_from_runtime and sig_http_server_register_upgrade('/feed') in create
SigFeedModule .[#8D8D8D,thickness=2].> SigPlatform : <color:#8D8D8D>sig_thread_create and sig_thread_join for the private loop thread; a mutex for the running flag and counts
SigFeedModule .[#8D8D8D,thickness=2].> SigRuntime : <color:#8D8D8D>[...]
SigFeedUpgrade .[#8D8D8D,thickness=2].> SigHttp : <color:#8D8D8D>sig_ws_accept_key for the 101 response; sig_ws_encode for the 1013 close
SigFeedUpgrade .[#8D8D8D,thickness=2].> SigPlatform : <color:#8D8D8D>one non-blocking write for the refusal, then closes the socket
SigFeedConnection .[#8D8D8D,thickness=2].> SigHttp : <color:#8D8D8D>sig_ws_decode of client frames; sig_ws_encode of every server frame
SigFeedConnection .[#8D8D8D,thickness=2].> SigPlatform : <color:#8D8D8D>[...]
SigFeedConnection .[#8D8D8D,thickness=2].> SigRuntime : <color:#8D8D8D>sig_loop_watch_fd, watch_modify and the flush timer
SigFeedHub .[#8D8D8D,thickness=2].> SigPlatform : <color:#8D8D8D>a mutex serializing hub calls and a reader-writer lock over the subscription table
SigFeedHub .[#8D8D8D,thickness=2].> SigRuntime : <color:#8D8D8D>[...]
SigFeedQueue .[#8D8D8D,thickness=2].> SigFoundation : <color:#8D8D8D>[...]
SigFeedMessages .[#8D8D8D,thickness=2].> SigFoundation : <color:#8D8D8D>sig_json writer; sig_value_from_json and sig_value_to_json
@enduml
`;case`feed_subscription`:return`@startuml
title "Subscribe to a terminal and receive its signals"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SigHttpDispatch>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHttpLooped>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFeedUpgrade>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHttpWs>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFeedConnection>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFeedMessages>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFeedHub>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntimeControl>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntimeTap>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigServiceTap>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFeedTap>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFeedQueue>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPlatformNet>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "==Request evaluation and routing\\n<size:10>[evaluate_request, find_route, request_authorized in sig_http_server.c]</size>\\n\\nThe protocol part shared by both transports. It parses the head, answers\\n400, 431 or 413 for malformed or oversize requests (head over 8192 bytes,\\ntarget over 512, Content-Length over 8192), waits for the whole body, runs\\nrequest_authorized(), requires Content-Length and a JSON Content-Type on\\nPUT and PATCH (411, 415), answers OPTIONS with 204 when cors_origin is set\\nand 405 otherwise, and routes by the longest registered prefix that\\nmatches at a slash boundary (404 if none). A handler that returns a status\\nother than SIG_OK produces 500; the server frees the response body. A\\nGET with Upgrade: websocket and Connection: Upgrade goes to the upgrade\\ntable when an upgrade prefix matches (400 for a version other than 13 or no\\nkey, 403 when an Origin header does not equal cors_origin or "*"; no Origin\\nheader is allowed); with no matching upgrade prefix it is routed as an\\nordinary GET. request_authorized() ignores its arguments and returns true,\\nso the server has no authentication; it is the single place a check would\\ngo." <<SigHttpDispatch>> as SigHttpDispatch
rectangle "==Event-loop transport\\n<size:10>[listener_event, conn_event; sig_loop watches and timers]</size>\\n\\nUsed when the runtime has a loop. The server owns no thread: the listener\\nand each connection are fd watches on the loop, and handlers run on the\\nloop thread. Each connection is a READING, WRITING or DRAINING state\\nmachine with one timer for its current phase (timeout_ms; 100 ms for\\ndraining, which only follows a 400, 431 or 413 reply, up to 64 KiB\\ndiscarded), so a slow client costs a buffer and a\\ntimer, not the loop. At most four connections are open; at four the\\nlistener is unwatched, leaving further clients queued in the kernel, and it\\nis watched again when a connection closes. A request that times out while\\nreading gets a best-effort 408. An accepted upgrade removes the watch and\\ntimer and hands over the non-blocking connection." <<SigHttpLooped>> as SigHttpLooped
rectangle "==Upgrade handler\\n<size:10>[on_upgrade, refuse in sig_signal_feed.c]</size>\\n\\nCalled by the HTTP server for a validated WebSocket upgrade on "/feed". It\\ncomputes the accept key and counts the connection. If 8 connections exist\\nit writes the 101 response and a close frame with code 1013 and closes the\\nsocket. If the module is not running it declines, and the server answers\\n503. Otherwise it takes ownership of the connection: directly, when the\\nfeed runs on the runtime loop, or through a hand-off list that the private\\nloop drains in its step hook after being woken." <<SigFeedUpgrade>> as SigFeedUpgrade
rectangle "==WebSocket primitives\\n<size:10>[sig_ws.h, sig_ws.c; part of sig::http_server]</size>\\n\\nHandshake and framing, as pure functions with no sockets. The accept key is\\nSHA-1 and base64 of the client key plus the RFC 6455 GUID. Server frames are\\nunmasked and unfragmented text, close, ping or pong. The decoder takes\\nmasked client frames from a buffer and unmasks them in place; it reports an\\nincomplete frame, a payload over a limit, or a protocol error (unmasked,\\nfragmented, reserved bits, unknown opcode, or a control frame over 125\\nbytes)." <<SigHttpWs>> as SigHttpWs
rectangle "==WebSocket connection\\n<size:10>[conn_on_fd, flush_tick in sig_signal_feed.c; sig_loop watch and timer]</size>\\n\\nOne connection with up to 16 subscriptions, each with a client-chosen id.\\nIt decodes masked client frames (payload up to 4096 bytes): a text frame\\nis a subscribe or unsubscribe command, a ping gets a pong, a close is\\nechoed. A protocol error closes with 1002 and an oversize frame with 1009.\\nA bad command gets an error reply (bad_request, not_found, too_many) and\\nthe connection stays open. A 20 ms timer, running while any connection\\nexists, pops the events of every subscription and writes them. More than\\n1 MiB of unsent data stops both reading from the client and popping the\\nqueues, so the queues fill and the hub drops. It also drops a connection\\nwith no write progress for 30 s, a close not flushed within 5 s, or no\\ninbound traffic for 75 s, and sends a ping every 30 s." <<SigFeedConnection>> as SigFeedConnection
rectangle "==Message encoding\\n<size:10>[sig_feed_msg.c; sig_json, sig_value_json]</size>\\n\\nParses a client frame (bad JSON is a parse error; a non-object, an unknown\\nop, or a missing, empty or 64-character-or-longer name is an invalid\\nargument, with the id echoed when it could be read). Encodes the four\\nserver messages: subscribed (direction in or out), signal (id, seq, time,\\ntype name and the value as JSON), dropped (count) and error (the code, and\\nthe id when there is one)." <<SigFeedMessages>> as SigFeedMessages
rectangle "==Subscription hub\\n<size:10>[sig_feed_hub_*; sig_feed_hub.c]</size>\\n\\nThe set of subscriptions, with no sockets. Subscribe checks that the\\nservice, instance and terminal exist in the running project, creates a\\nsubscription with the direction of the terminal, and asks the runtime to\\ninstall the tap. Unsubscribe removes it, and when none is left asks the\\nruntime to remove the tap; destroy does the same. Subscribe, unsubscribe\\nand destroy are serialized by the hub and must not be called from a\\nservice thread, because they call the runtime. Subscriptions are matched\\nby name, so they survive the rebuild of a service. They do not survive a\\nstop of the runtime, which forgets the tap; the hub notices on its next\\nsubscribe or unsubscribe." <<SigFeedHub>> as SigFeedHub
rectangle "==Control mutex (edit lock)\\n<size:10>[sig_runtime_edit, sig_runtime_service_*; one sig_mutex]</size>\\n\\nOne control mutex (the service-control lock in the header) guards the\\nstate and serializes sig_runtime_service_start, stop, restart and\\nstart_prebuilt, sig_runtime_edit, sig_runtime_find_terminal and\\nsig_runtime_dump_info. The service calls, edit and find_terminal return SIG_ERR_STATE\\nunless the runtime is RUNNING (start_prebuilt returns SIG_ERR_STALE for\\na stopped service whose definition changed); uptime returns 0.0 and\\ndump_info reports a partial snapshot when not RUNNING. sig_runtime_edit runs a caller function on the\\nproject under that lock and is the only safe way to call the\\nsig_project editing functions while running. The mutex is held across\\nservice start and stop, which join worker threads. Rule: never call\\nsig_runtime_service_*, sig_runtime_uptime_seconds or\\nsig_runtime_dump_info from a service or capsule thread, because the\\nthread being joined may be the caller and the call deadlocks. Call\\nthem from module, transport or host threads only." <<SigRuntimeControl>> as SigRuntimeControl
rectangle "==Signal tap installation\\n<size:10>[sig_runtime_set_tap; sig_tap.h]</size>\\n\\nsig_runtime_set_tap installs one observer on every service of the\\nrunning project, and on services configured later (a rebuild after an\\nedit keeps it); a NULL function clears it. A tap sees each signal at\\nthe terminal boundary: SIG_TAP_OUTPUT when a capsule notifies an output\\nterminal, routed or not, and SIG_TAP_INPUT just before an input handler\\nruns. The callback runs on the emitting thread, a service worker or the\\nloop thread, and must not block. With no tap the signal path pays one\\natomic pointer load. The runtime forgets the tap when it stops. The\\nsignal feed is the only user, and it installs the tap only while a\\nsubscription exists. The terminal lookup a subscriber uses to validate\\nnames, sig_runtime_find_terminal, belongs to the control component above\\n(it takes the control mutex)." <<SigRuntimeTap>> as SigRuntimeTap
rectangle "==Tap slot\\n<size:10>[sig_service_set_tap, sig_service_tap_emit]</size>\\n\\nHolds the optional observer for the signal tap. sig_service_set_tap is\\nsafe from any thread at any time; the function and its context change\\ntogether atomically, and a replaced tap may still be running on the\\nservice thread when the call returns. With no tap the cost on the signal\\npath is one atomic pointer load. sig_service_tap_emit is called by the\\ncapsule on output and by the delivery loop before an input handler; it\\nis not for capsule code." <<SigServiceTap>> as SigServiceTap
rectangle "==Tap callback\\n<size:10>[hub_tap in sig_feed_hub.c; sig_tap_fn]</size>\\n\\nThe function the runtime installs. It runs on the emitting thread, a\\nservice worker or the loop thread, for every signal in the system while\\nthe tap is installed. It takes the hub lock shared and, for each matching\\nsubscription (same direction, terminal, instance and service name), estimates\\nthe size of the value once and offers a copy to that subscription. It does\\nno I/O and never calls the runtime. It can wait only on short locks: the\\nhub lock, held exclusively briefly when a subscription is added or\\nremoved, and the mutex of one subscription. It allocates for the copy." <<SigFeedTap>> as SigFeedTap
rectangle "==Subscription queue\\n<size:10>[offer, record_drop, sig_feed_sub_pop; sig_ll under a mutex]</size>\\n\\nA bounded queue per subscription. A signal is queued as a deep copy with a\\nsequence number and a Unix millisecond timestamp. It is dropped and\\ncounted when its estimated size is over 64 KiB, when 256 signals are\\nalready queued, or when 256 KiB of estimated data would be exceeded, and\\nalso when allocation fails. Consecutive drops merge into one marker\\nat the tail, so the reader sees a dropped event with a count at the\\nplace in the stream where the values were lost. Dropped signals do not\\nuse a sequence number. Pop is non-blocking." <<SigFeedQueue>> as SigFeedQueue
rectangle "==TCP sockets\\n<size:10>[sig_net.h; BSD sockets]</size>\\n\\nMinimal TCP server primitives: listen, accept, read and write, IPv4\\nonly, numeric addresses only. In the optional sig::net target (SIG_NET),\\nnot in sig::sig. Sockets are always non-blocking and every wait goes\\nthrough poll() with a caller-supplied timeout (a negative one waits\\nforever); a timeout of 0 turns accept and read into polls, so\\nthe descriptors can be registered with a sig_loop. Writes never raise\\nSIGPIPE. The header states no cross-thread rules for a listener or\\nconnection, so use each from one thread at a time." <<SigPlatformNet>> as SigPlatformNet

SigHttpDispatch .[#8D8D8D,thickness=2].> SigHttpDispatch : <color:#8D8D8D>GET /feed with Upgrade: websocket: the request is read in full, request_authorized() accepts it, Sec-WebSocket-Version must be 13, the key non-empty, and an Origin header, if present, must equal cors_origin (else 400 or 403). The longest upgrade prefix '/feed' matches
SigHttpLooped .[#8D8D8D,thickness=2].> SigFeedUpgrade : <color:#8D8D8D>the server unwatches the fd and offers the non-blocking connection to on_upgrade (the threaded transport does the same from its server thread)
SigFeedUpgrade .[#8D8D8D,thickness=2].> SigHttpWs : <color:#8D8D8D>sig_ws_accept_key for the Sec-WebSocket-Accept value
SigFeedUpgrade .[#8D8D8D,thickness=2].> SigFeedConnection : <color:#8D8D8D>fewer than 8 connections: the connection is adopted, watched on the loop, the 101 response queued and written, the 20 ms flush timer armed. (The ninth gets 101 plus a close frame 1013.)
SigFeedConnection .[#8D8D8D,thickness=2].> SigHttpWs : <color:#8D8D8D>client frame {'op':'subscribe','id':'a','service':'S','instance':'I','terminal':'T'} is decoded and unmasked (at most 4096 bytes)
SigFeedConnection .[#8D8D8D,thickness=2].> SigFeedMessages : <color:#8D8D8D>sig_feed_parse_command: names must be 1 to 63 bytes
SigFeedConnection .[#8D8D8D,thickness=2].> SigFeedHub : <color:#8D8D8D>sig_feed_hub_subscribe (an id already in use is bad_request, a 17th subscription is too_many; both are answered without calling the hub)
SigFeedHub .[#8D8D8D,thickness=2].> SigRuntimeControl : <color:#8D8D8D>sig_runtime_find_terminal under the control mutex: not_found if the names do not exist, bad_request if the runtime is not running; gives the direction
SigFeedHub .[#8D8D8D,thickness=2].> SigRuntimeTap : <color:#8D8D8D>sig_runtime_set_tap(hub_tap): the subscription is already in the hub table, and the tap is installed on this subscribe (a later subscribe installs it again)
SigRuntimeTap .[#8D8D8D,thickness=2].> SigServiceTap : <color:#8D8D8D>the tap is stored on every service of the running project; a service rebuilt later gets it too
SigFeedConnection .[#8D8D8D,thickness=2].> SigFeedMessages : <color:#8D8D8D>reply {'op':'subscribed','id':'a','dir':'in|out'} is encoded and queued for the socket
SigServiceTap .[#8D8D8D,thickness=2].> SigFeedTap : <color:#8D8D8D>a signal crosses the terminal: sig_service_tap_emit calls hub_tap on the emitting thread, before an input handler or when an output is notified
SigFeedTap .[#8D8D8D,thickness=2].> SigFeedQueue : <color:#8D8D8D>for each subscription matching direction, terminal, instance and service name: a copy is queued with the next seq and a timestamp, or, when the queue is full or the value too large, a drop is counted (merged with a drop already at the tail). No I/O
SigFeedConnection .[#8D8D8D,thickness=2].> SigFeedQueue : <color:#8D8D8D>flush tick, within 20 ms: sig_feed_sub_pop returns signals in order, with a dropped event with its count at the place where values were lost
SigFeedConnection .[#8D8D8D,thickness=2].> SigFeedMessages : <color:#8D8D8D>each event is encoded as a signal or dropped message
SigFeedConnection .[#8D8D8D,thickness=2].> SigPlatformNet : <color:#8D8D8D>frames are written to the socket; if more than 1 MiB is unsent, popping and reading stop until the client catches up, and the queues drop
SigFeedConnection .[#8D8D8D,thickness=2].> SigFeedHub : <color:#8D8D8D>unsubscribe, or the connection closing: the subscription is freed. When the last subscription goes, the hub asks the runtime to remove the tap
@enduml
`;case`foundation`:return`@startuml
title "Foundation"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SigFoundationStatus>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFoundationJson>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFoundationExpressions>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFoundationPython>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFoundationValues>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFoundationContainers>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFoundationLogging>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFoundationAllocation>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFoundationRefcount>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "Foundation" <<SigFoundation>> as SigFoundation {
  skinparam RectangleBorderColor<<SigFoundation>> #3b82f6
  skinparam RectangleFontColor<<SigFoundation>> #3b82f6
  skinparam RectangleBorderStyle<<SigFoundation>> dashed

  rectangle "==Status codes\\n<size:10>[sig_status.h]</size>\\n\\nsig_status_t: SIG_OK and the SIG_ERR_* codes (ALLOC, INVALID_ARG,\\nNOT_FOUND, EXISTS, PLATFORM, TYPE_MISMATCH, PARSE, STATE, TIMEOUT,\\nSTALE) returned by nearly every libsig function. A header of types\\nonly, so it has no functions." <<SigFoundationStatus>> as SigFoundationStatus
  rectangle "==JSON\\n<size:10>[sig_json.h, sig_value_json.h]</size>\\n\\nsig_json is a streaming JSON writer (an allocation failure is sticky and\\nreported by sig_json_finish). sig_value_to_json and sig_value_from_json\\nconvert sig_value trees to and from strict RFC 8259 JSON; map keys are\\nwritten sorted and bytes become a base64 string (one-way). No shared\\nstate: a writer or value is used by one thread at a time." <<SigFoundationJson>> as SigFoundationJson
  rectangle "==Expressions\\n<size:10>[sig_expr.h]</size>\\n\\nA small condition language (for example input.reading.temp > 21.5)\\ncompiled once with sig_expr_compile and evaluated against a sig_value\\nwith sig_expr_eval_bool. A compiled sig_expr is immutable, evaluating\\nit allocates nothing and is safe from several threads at once. An\\nexpression with no value for a given input reports\\nSIG_ERR_TYPE_MISMATCH." <<SigFoundationExpressions>> as SigFoundationExpressions
  rectangle "==Python bindings\\n<size:10>[sig_value_python.h]</size>\\n\\nsig_value_to_pyobject and sig_value_from_pyobject convert between\\nsig_value and PyObject. Built into sig::sig only with\\n-DSIG_PYTHON_BINDINGS=ON (default OFF), which needs Python 3\\ndevelopment files. The header states no threading rules; callers\\nfollow the Python interpreter rules." <<SigFoundationPython>> as SigFoundationPython
  rectangle "==Values\\n<size:10>[sig_value.h]</size>\\n\\nsig_value: int, bool, double, string, bytes, and map and list containers\\n(backed by sig_ht and sig_ll). Strings, bytes and containers are\\nreference counted; sig_value_copy shares them and sig_value_dup deep\\ncopies. A shared container is frozen: mutators return SIG_ERR_STATE\\nuntil the other handles are released or the value is duplicated. A\\ncontainer must be mutated by one thread at a time; no locking is\\nadded. Nesting is limited to SIG_VALUE_MAX_DEPTH (32) for dup and\\nJSON." <<SigFoundationValues>> as SigFoundationValues
  rectangle "==Hash table and list\\n<size:10>[sig_ht.h, sig_ll.h]</size>\\n\\nsig_ht (string-keyed hash table) and sig_ll (doubly linked list), each\\nwith an optional element destructor and a reference count. Neither is\\ninternally synchronized: the reference count only decides who tears the\\ncontainer down, so a container touched from more than one thread needs\\na caller-owned mutex (for example sig_mutex)." <<SigFoundationContainers>> as SigFoundationContainers
  rectangle "==Logging\\n<size:10>[sig_log.h]</size>\\n\\nLevelled logging (sig_log_trace .. sig_log_fatal) to a FILE*, which may\\nbe NULL to disable output. Each write is serialized by an internal\\nmutex. sig_log_init must run before any thread that logs is spawned, and\\nsig_log_shutdown only after every logging thread has been joined;\\nconcurrent init or shutdown is undefined behaviour." <<SigFoundationLogging>> as SigFoundationLogging
  rectangle "==Allocation\\n<size:10>[sig_alloc.h]</size>\\n\\nsig_alloc, sig_calloc, sig_realloc, sig_free and sig_strdup, with an\\noverridable allocator (sig_alloc_set_allocator). With SIG_DEBUG every\\nblock is tracked by file and line and the block list is guarded by a\\nspinlock. The allocation counters are updated atomically in every\\nbuild. Call sig_alloc_init once before any other sig_alloc_* function." <<SigFoundationAllocation>> as SigFoundationAllocation
  rectangle "==Reference counts\\n<size:10>[sig_atomic.h]</size>\\n\\nsig_refcount_h, a 16-bit counter over C11 atomics\\n(sig_refcount_init/get/add/del). Safe to adjust from several\\nthreads; it protects the count only, not the object it counts." <<SigFoundationRefcount>> as SigFoundationRefcount
}

SigFoundationContainers .[#8D8D8D,thickness=2].> SigFoundationAllocation : <color:#8D8D8D>allocates nodes and buckets
SigFoundationValues .[#8D8D8D,thickness=2].> SigFoundationAllocation : <color:#8D8D8D>allocates strings and bytes
SigFoundationJson .[#8D8D8D,thickness=2].> SigFoundationAllocation : <color:#8D8D8D>grows output buffers
SigFoundationExpressions .[#8D8D8D,thickness=2].> SigFoundationAllocation : <color:#8D8D8D>compiles to heap nodes
SigFoundationContainers .[#8D8D8D,thickness=2].> SigFoundationRefcount : <color:#8D8D8D>counts references
SigFoundationValues .[#8D8D8D,thickness=2].> SigFoundationRefcount : <color:#8D8D8D>counts references to shared payloads
SigFoundationValues .[#8D8D8D,thickness=2].> SigFoundationContainers : <color:#8D8D8D>maps and lists are a sig_ht and a sig_ll
SigFoundationValues .[#8D8D8D,thickness=2].> SigFoundationLogging : <color:#8D8D8D>logs refused mutations at debug level
SigFoundationJson .[#8D8D8D,thickness=2].> SigFoundationValues : <color:#8D8D8D>walks and builds sig_value trees
SigFoundationExpressions .[#8D8D8D,thickness=2].> SigFoundationValues : <color:#8D8D8D>evaluates against a sig_value
SigFoundationPython .[#8D8D8D,thickness=2].> SigFoundationValues : <color:#8D8D8D>converts sig_value trees
@enduml
`;case`foundation_components`:return`@startuml
title "Foundation components"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SigCapsules>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFeed>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHost>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHttp>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigMgmt>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPersistence>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPlatform>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigProject>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntime>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigService>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFoundationJson>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFoundationExpressions>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFoundationPython>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFoundationValues>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFoundationContainers>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFoundationLogging>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFoundationAllocation>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFoundationRefcount>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFoundationStatus>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "==Capsules\\n<size:10>[sig_capsule.h; part of sig::sig, with the shim in capsules/ (target sig_builtin_capsules, SIG_HOST)]</size>\\n\\nThree layers in a 1 : n : n relationship. A capsule is compiled-in static\\ncode; a capsule configuration is a named configuration of one capsule\\n(a capsule plus properties), available to any service in the project;\\na capsule instance is one configuration used by one service, with its\\nown storage, state and routes. This is what runs. An instance takes the\\nname of its configuration, so a configuration appears at most once per\\nservice." <<SigCapsules>> as SigCapsules
rectangle "==Signal feed\\n<size:10>[sig_signal_feed.h; sig::signal_feed, SIG_SIGNAL_FEED]</size>\\n\\nStreams the signals crossing chosen capsule terminals to WebSocket\\nclients as JSON text frames, on the path "/feed" of the shared HTTP server.\\nA client names a service, instance and terminal and sees the signals from\\nthen on, with no history. The feed is unauthenticated: the only check is\\nthe Origin test the HTTP server makes. The runtime tap is the source of\\nthe data, and it is installed only while at least one subscription exists." <<SigFeed>> as SigFeed
rectangle "==Host\\n<size:10>[sig_host.h; CMake target sig::host and the sighost executable (SIG_HOST)]</size>\\n\\nThe program that runs a project. sig_host_run is the portable boot\\nsequence; host/posix supplies the command line, the shutdown trigger\\nand the choice of persistence backend. The host registers the runtime\\nmodules it is given and knows nothing about particular capsules,\\nruntime modules or signals; main.c is what selects them." <<SigHost>> as SigHost
rectangle "==HTTP\\n<size:10>[sig_http_server.h, sig_ws.h, sig_http_client.h; sig::http_server (SIG_HTTP_SERVER, needs SIG_NET) and sig::http_client (SIG_HTTP_CLIENT, libcurl)]</size>\\n\\nThe HTTP layer, in two independent parts. The server is one shared HTTP/1.1\\nserver per runtime, offered as a runtime module named http_server (build\\noptions SIG_NET and SIG_HTTP_SERVER); other modules register path prefixes\\non it. The client is a blocking and an asynchronous GET over libcurl (build\\noption SIG_HTTP_CLIENT). The server has no TLS and no authentication." <<SigHttp>> as SigHttp
rectangle "==Management\\n<size:10>[sig_mgmt.h, sig_mgmt_http.h; sig::mgmt (SIG_MGMT) and sig::mgmt_http (built when SIG_MGMT and SIG_HTTP_SERVER are both on)]</size>\\n\\nReads and controls a running runtime. The operations in sig::mgmt take and\\nreturn plain value trees and status codes and know nothing of any\\ntransport. The REST layer and the glue module in sig::mgmt_http map HTTP\\nonto them, on the shared HTTP server. Built when SIG_MGMT is ON; the HTTP\\npart is built when SIG_MGMT and SIG_HTTP_SERVER are both ON. There is no\\nauthentication anywhere in the area." <<SigMgmt>> as SigMgmt
rectangle "==Persistence\\n<size:10>[sig_persistence.h, sig_persistence_file.h; part of sig::sig]</size>\\n\\nA pluggable store of opaque blobs under a (namespace, key) pair. What a\\nnamespace means, and which names are valid, is up to the backend. The\\nlibrary ships one backend, the file backend. The project reads and writes\\nits configuration and service documents through it. The hooks block, so\\nthey are meant for configuration input and output, not for an event\\nloop hot path." <<SigPersistence>> as SigPersistence
rectangle "==Platform\\n<size:10>[CMake targets sig::sig (threads, time, poller) and sig::net (TCP, SIG_NET)]</size>\\n\\nEverything OS-specific, behind headers. Threads, time and the poller are\\npart of sig::sig and always built; the TCP layer is the optional sig::net\\ntarget, built with -DSIG_NET=ON. Only POSIX implementations exist today\\n(src/platform/posix and src/net/sig_net_posix.c); the rest of libsig\\ndoes not include OS headers. A port to another system replaces these\\nfiles and nothing above them." <<SigPlatform>> as SigPlatform
rectangle "==Project\\n<size:10>[sig_project.h, sig_config.h; part of sig::sig]</size>\\n\\nA project is the capsule configurations and services loaded from a\\npersistence store and wired together. It owns the configurations,\\nservices and capsule instances it builds, keeps the JSON definition of\\neach, and writes every edit back to the store. Nothing is started by\\nloading. The store and the capsule registry are borrowed and must outlive\\nthe project." <<SigProject>> as SigProject
rectangle "==Runtime\\n<size:10>[sig_runtime.h, sig_loop.h, sig_tap.h; part of sig::sig]</size>\\n\\nOwns one running system: the project loaded from the store, the runtime\\nmodules registered with it, and the lifecycle that starts and stops them.\\nThe runtime borrows the persistence store and the capsule registry it was\\ncreated with; both must outlive it. It can also be given an event loop,\\nwhich makes every service driven and the whole system single-threaded." <<SigRuntime>> as SigRuntime
rectangle "==Service\\n<size:10>[sig_service.h; part of sig::sig]</size>\\n\\nA service is a worker thread with a signal queue and a job scheduler,\\nowning a set of capsule instances by name (it borrows them; the project\\nowns them). Once a service is started, terminal handlers and lifecycle\\nhooks of its instances run on its own thread, except that start hooks run\\non the thread that called start and stop hooks on the thread that called\\nstop. A service can instead be driven by an event loop, with no thread of\\nits own." <<SigService>> as SigService
rectangle "Foundation" <<SigFoundation>> as SigFoundation {
  skinparam RectangleBorderColor<<SigFoundation>> #3b82f6
  skinparam RectangleFontColor<<SigFoundation>> #3b82f6
  skinparam RectangleBorderStyle<<SigFoundation>> dashed

  rectangle "==JSON\\n<size:10>[sig_json.h, sig_value_json.h]</size>\\n\\nsig_json is a streaming JSON writer (an allocation failure is sticky and\\nreported by sig_json_finish). sig_value_to_json and sig_value_from_json\\nconvert sig_value trees to and from strict RFC 8259 JSON; map keys are\\nwritten sorted and bytes become a base64 string (one-way). No shared\\nstate: a writer or value is used by one thread at a time." <<SigFoundationJson>> as SigFoundationJson
  rectangle "==Expressions\\n<size:10>[sig_expr.h]</size>\\n\\nA small condition language (for example input.reading.temp > 21.5)\\ncompiled once with sig_expr_compile and evaluated against a sig_value\\nwith sig_expr_eval_bool. A compiled sig_expr is immutable, evaluating\\nit allocates nothing and is safe from several threads at once. An\\nexpression with no value for a given input reports\\nSIG_ERR_TYPE_MISMATCH." <<SigFoundationExpressions>> as SigFoundationExpressions
  rectangle "==Python bindings\\n<size:10>[sig_value_python.h]</size>\\n\\nsig_value_to_pyobject and sig_value_from_pyobject convert between\\nsig_value and PyObject. Built into sig::sig only with\\n-DSIG_PYTHON_BINDINGS=ON (default OFF), which needs Python 3\\ndevelopment files. The header states no threading rules; callers\\nfollow the Python interpreter rules." <<SigFoundationPython>> as SigFoundationPython
  rectangle "==Values\\n<size:10>[sig_value.h]</size>\\n\\nsig_value: int, bool, double, string, bytes, and map and list containers\\n(backed by sig_ht and sig_ll). Strings, bytes and containers are\\nreference counted; sig_value_copy shares them and sig_value_dup deep\\ncopies. A shared container is frozen: mutators return SIG_ERR_STATE\\nuntil the other handles are released or the value is duplicated. A\\ncontainer must be mutated by one thread at a time; no locking is\\nadded. Nesting is limited to SIG_VALUE_MAX_DEPTH (32) for dup and\\nJSON." <<SigFoundationValues>> as SigFoundationValues
  rectangle "==Hash table and list\\n<size:10>[sig_ht.h, sig_ll.h]</size>\\n\\nsig_ht (string-keyed hash table) and sig_ll (doubly linked list), each\\nwith an optional element destructor and a reference count. Neither is\\ninternally synchronized: the reference count only decides who tears the\\ncontainer down, so a container touched from more than one thread needs\\na caller-owned mutex (for example sig_mutex)." <<SigFoundationContainers>> as SigFoundationContainers
  rectangle "==Logging\\n<size:10>[sig_log.h]</size>\\n\\nLevelled logging (sig_log_trace .. sig_log_fatal) to a FILE*, which may\\nbe NULL to disable output. Each write is serialized by an internal\\nmutex. sig_log_init must run before any thread that logs is spawned, and\\nsig_log_shutdown only after every logging thread has been joined;\\nconcurrent init or shutdown is undefined behaviour." <<SigFoundationLogging>> as SigFoundationLogging
  rectangle "==Allocation\\n<size:10>[sig_alloc.h]</size>\\n\\nsig_alloc, sig_calloc, sig_realloc, sig_free and sig_strdup, with an\\noverridable allocator (sig_alloc_set_allocator). With SIG_DEBUG every\\nblock is tracked by file and line and the block list is guarded by a\\nspinlock. The allocation counters are updated atomically in every\\nbuild. Call sig_alloc_init once before any other sig_alloc_* function." <<SigFoundationAllocation>> as SigFoundationAllocation
  rectangle "==Reference counts\\n<size:10>[sig_atomic.h]</size>\\n\\nsig_refcount_h, a 16-bit counter over C11 atomics\\n(sig_refcount_init/get/add/del). Safe to adjust from several\\nthreads; it protects the count only, not the object it counts." <<SigFoundationRefcount>> as SigFoundationRefcount
  rectangle "==Status codes\\n<size:10>[sig_status.h]</size>\\n\\nsig_status_t: SIG_OK and the SIG_ERR_* codes (ALLOC, INVALID_ARG,\\nNOT_FOUND, EXISTS, PLATFORM, TYPE_MISMATCH, PARSE, STATE, TIMEOUT,\\nSTALE) returned by nearly every libsig function. A header of types\\nonly, so it has no functions." <<SigFoundationStatus>> as SigFoundationStatus
}

SigCapsules .[#8D8D8D,thickness=2].> SigFoundationAllocation : <color:#8D8D8D>allocates the registry
SigCapsules .[#8D8D8D,thickness=2].> SigFoundationContainers : <color:#8D8D8D>[...]
SigCapsules .[#8D8D8D,thickness=2].> SigFoundationLogging : <color:#8D8D8D>logs resolve errors
SigCapsules .[#8D8D8D,thickness=2].> SigFoundationValues : <color:#8D8D8D>boxed property values
SigFeed .[#8D8D8D,thickness=2].> SigFoundationAllocation : <color:#8D8D8D>entries
SigFeed .[#8D8D8D,thickness=2].> SigFoundationContainers : <color:#8D8D8D>entries kept in a sig_ll
SigFeed .[#8D8D8D,thickness=2].> SigFoundationLogging : <color:#8D8D8D>logs why a connection was dropped, and configuration errors
SigFeed .[#8D8D8D,thickness=2].> SigFoundationValues : <color:#8D8D8D>sig_value_dup copies the signal
SigFeed .[#8D8D8D,thickness=2].> SigFoundationJson : <color:#8D8D8D>sig_json writer; sig_value_from_json and sig_value_to_json
SigHost .[#8D8D8D,thickness=2].> SigFoundationAllocation : <color:#8D8D8D>allocates its state
SigHost .[#8D8D8D,thickness=2].> SigFoundationLogging : <color:#8D8D8D>[...]
SigHttp .[#8D8D8D,thickness=2].> SigFoundationAllocation : <color:#8D8D8D>[...]
SigHttp .[#8D8D8D,thickness=2].> SigFoundationLogging : <color:#8D8D8D>[...]
SigMgmt .[#8D8D8D,thickness=2].> SigFoundationValues : <color:#8D8D8D>[...]
SigMgmt .[#8D8D8D,thickness=2].> SigFoundationJson : <color:#8D8D8D>sig_json writer, sig_value_from_json for the rename body
SigPersistence .[#8D8D8D,thickness=2].> SigFoundationAllocation : <color:#8D8D8D>[...]
SigPersistence .[#8D8D8D,thickness=2].> SigFoundationContainers : <color:#8D8D8D>backends kept in a sig_ht
SigPersistence .[#8D8D8D,thickness=2].> SigFoundationLogging : <color:#8D8D8D>trace line after a successful load, save or remove
SigPlatform .[#8D8D8D,thickness=2].> SigFoundationAllocation : <color:#8D8D8D>[...]
SigPlatform .[#8D8D8D,thickness=2].> SigFoundationLogging : <color:#8D8D8D>logs listen failures
SigProject .[#8D8D8D,thickness=2].> SigFoundationAllocation : <color:#8D8D8D>allocates the project and its tables
SigProject .[#8D8D8D,thickness=2].> SigFoundationLogging : <color:#8D8D8D>logs load progress and failures
SigProject .[#8D8D8D,thickness=2].> SigFoundationJson : <color:#8D8D8D>[...]
SigRuntime .[#8D8D8D,thickness=2].> SigFoundationAllocation : <color:#8D8D8D>[...]
SigRuntime .[#8D8D8D,thickness=2].> SigFoundationLogging : <color:#8D8D8D>[...]
SigService .[#8D8D8D,thickness=2].> SigFoundationAllocation : <color:#8D8D8D>allocates the service and its tables
SigService .[#8D8D8D,thickness=2].> SigFoundationContainers : <color:#8D8D8D>[...]
SigService .[#8D8D8D,thickness=2].> SigFoundationLogging : <color:#8D8D8D>logs start, stop and hook failures
SigService .[#8D8D8D,thickness=2].> SigFoundationValues : <color:#8D8D8D>sig_value_dup copies the signal
SigFoundationContainers .[#8D8D8D,thickness=2].> SigFoundationAllocation : <color:#8D8D8D>allocates nodes and buckets
SigFoundationValues .[#8D8D8D,thickness=2].> SigFoundationAllocation : <color:#8D8D8D>allocates strings and bytes
SigFoundationJson .[#8D8D8D,thickness=2].> SigFoundationAllocation : <color:#8D8D8D>grows output buffers
SigFoundationExpressions .[#8D8D8D,thickness=2].> SigFoundationAllocation : <color:#8D8D8D>compiles to heap nodes
SigFoundationContainers .[#8D8D8D,thickness=2].> SigFoundationRefcount : <color:#8D8D8D>counts references
SigFoundationValues .[#8D8D8D,thickness=2].> SigFoundationRefcount : <color:#8D8D8D>counts references to shared payloads
SigFoundationValues .[#8D8D8D,thickness=2].> SigFoundationContainers : <color:#8D8D8D>maps and lists are a sig_ht and a sig_ll
SigFoundationValues .[#8D8D8D,thickness=2].> SigFoundationLogging : <color:#8D8D8D>logs refused mutations at debug level
SigFoundationJson .[#8D8D8D,thickness=2].> SigFoundationValues : <color:#8D8D8D>walks and builds sig_value trees
SigFoundationExpressions .[#8D8D8D,thickness=2].> SigFoundationValues : <color:#8D8D8D>evaluates against a sig_value
SigFoundationPython .[#8D8D8D,thickness=2].> SigFoundationValues : <color:#8D8D8D>converts sig_value trees
SigFoundationLogging .[#8D8D8D,thickness=2].> SigPlatform : <color:#8D8D8D>serializes writes with a sig_mutex
@enduml
`;case`host`:return`@startuml
title "Host"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SigHostEntry>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHostRunner>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHostShutdown>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "Host" <<SigHost>> as SigHost {
  skinparam RectangleBorderColor<<SigHost>> #3b82f6
  skinparam RectangleFontColor<<SigHost>> #3b82f6
  skinparam RectangleBorderStyle<<SigHost>> dashed

  rectangle "==sighost entry point\\n<size:10>[main, usage; host/posix/main.c]</size>\\n\\nParses the command line (-p <dir>, --configure-path=<dir> or one bare\\ndirectory, default ./cfg; --configure-from=file, the only backend;\\n-l log level, default trace; -s single-threaded; -h help) and, when\\nbuilt with the management API and the HTTP server, -m\\n[addr:]port and -o origin (-o requires -m). It refuses a path that is\\nnot a directory, initialises logging on stdout, creates the capsule\\nregistry and fills it with the built-in capsules, and builds the\\nmodule list. With -m that list is the HTTP server (configured with\\nbind, port and cors_origin), management and the management glue, in\\nthat order, then the signal feed if it was built; without -m no\\nruntime module is registered. It calls sig_host_run with the file\\nstore and the POSIX platform and returns exit code 1 on any failure." <<SigHostEntry>> as SigHostEntry
  rectangle "==Boot runner\\n<size:10>[sig_host_run, host_step; host/sig_host.c]</size>\\n\\nsig_host_run opens the persistence store (any backend), creates the\\nruntime with the store and the capsule registry, and, if\\nsingle_threaded is set, creates a sig_loop, installs the host step\\nhook and gives the loop to the runtime. It then registers every\\nmodule of the configuration in order, arms the platform shutdown\\ntrigger, starts the runtime, and waits: sig_runtime_wait, or\\nsig_loop_run in single-threaded mode. Then it stops the runtime,\\ndisarms the trigger and destroys the runtime, the loop and the store,\\nthe store last because the runtime borrows it. Everything runs on\\nthe calling thread. The step hook runs sig_runtime_step and stops\\nthe loop once a shutdown has been requested. A failure before the\\nstart jumps to the destroy sequence (nothing is armed yet, or arming\\nitself failed); a failed start is still followed by the disarm. The\\nstatus of the first failure is returned, and a clean shutdown\\nreturns SIG_OK. A NULL store module, capsule registry or module is\\nSIG_ERR_INVALID_ARG. The host does not check that a file store\\ndirectory exists." <<SigHostRunner>> as SigHostRunner
  rectangle "==POSIX shutdown trigger\\n<size:10>[sig_host_posix_platform, posix_arm_shutdown; host/posix/sig_host_posix.c]</size>\\n\\nThe POSIX implementation of the sig_host_platform seam (an\\narm_shutdown and a disarm_shutdown hook). In threaded mode it blocks\\nSIGINT and SIGTERM, and SIGINFO where it exists, in the arming\\nthread and starts a thread that waits for them with sigwait(); a\\nsignal calls sig_runtime_request_shutdown, which is not\\nasync-signal-safe and so cannot run in a handler. In single-threaded\\nmode there is no thread: handlers whose only action is an\\nasync-signal-safe write() to a self-pipe, which the loop watches and\\nwhich makes the same call on the loop thread. SIGINFO writes a\\nruntime snapshot to stderr and does not stop anything. Disarm joins\\nthe thread and restores the signal mask, or restores the handlers\\nand closes the pipe." <<SigHostShutdown>> as SigHostShutdown
}

SigHostRunner .[#8D8D8D,thickness=2].> SigHostShutdown : <color:#8D8D8D>arm_shutdown before start; disarm_shutdown after stop
SigHostEntry .[#8D8D8D,thickness=2].> SigHostRunner : <color:#8D8D8D>sig_host_run with the file store, the registry, the modules and the flag
SigHostEntry .[#8D8D8D,thickness=2].> SigHostShutdown : <color:#8D8D8D>sig_host_posix_platform supplies the hooks
@enduml
`;case`host_components`:return`@startuml
title "Host components"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SigHostEntry>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHostRunner>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigCapsules>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFeed>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHttp>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigMgmt>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHostShutdown>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPersistence>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFoundation>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntime>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "Host" <<SigHost>> as SigHost {
  skinparam RectangleBorderColor<<SigHost>> #3b82f6
  skinparam RectangleFontColor<<SigHost>> #3b82f6
  skinparam RectangleBorderStyle<<SigHost>> dashed

  rectangle "==sighost entry point\\n<size:10>[main, usage; host/posix/main.c]</size>\\n\\nParses the command line (-p <dir>, --configure-path=<dir> or one bare\\ndirectory, default ./cfg; --configure-from=file, the only backend;\\n-l log level, default trace; -s single-threaded; -h help) and, when\\nbuilt with the management API and the HTTP server, -m\\n[addr:]port and -o origin (-o requires -m). It refuses a path that is\\nnot a directory, initialises logging on stdout, creates the capsule\\nregistry and fills it with the built-in capsules, and builds the\\nmodule list. With -m that list is the HTTP server (configured with\\nbind, port and cors_origin), management and the management glue, in\\nthat order, then the signal feed if it was built; without -m no\\nruntime module is registered. It calls sig_host_run with the file\\nstore and the POSIX platform and returns exit code 1 on any failure." <<SigHostEntry>> as SigHostEntry
  rectangle "==Boot runner\\n<size:10>[sig_host_run, host_step; host/sig_host.c]</size>\\n\\nsig_host_run opens the persistence store (any backend), creates the\\nruntime with the store and the capsule registry, and, if\\nsingle_threaded is set, creates a sig_loop, installs the host step\\nhook and gives the loop to the runtime. It then registers every\\nmodule of the configuration in order, arms the platform shutdown\\ntrigger, starts the runtime, and waits: sig_runtime_wait, or\\nsig_loop_run in single-threaded mode. Then it stops the runtime,\\ndisarms the trigger and destroys the runtime, the loop and the store,\\nthe store last because the runtime borrows it. Everything runs on\\nthe calling thread. The step hook runs sig_runtime_step and stops\\nthe loop once a shutdown has been requested. A failure before the\\nstart jumps to the destroy sequence (nothing is armed yet, or arming\\nitself failed); a failed start is still followed by the disarm. The\\nstatus of the first failure is returned, and a clean shutdown\\nreturns SIG_OK. A NULL store module, capsule registry or module is\\nSIG_ERR_INVALID_ARG. The host does not check that a file store\\ndirectory exists." <<SigHostRunner>> as SigHostRunner
  rectangle "==POSIX shutdown trigger\\n<size:10>[sig_host_posix_platform, posix_arm_shutdown; host/posix/sig_host_posix.c]</size>\\n\\nThe POSIX implementation of the sig_host_platform seam (an\\narm_shutdown and a disarm_shutdown hook). In threaded mode it blocks\\nSIGINT and SIGTERM, and SIGINFO where it exists, in the arming\\nthread and starts a thread that waits for them with sigwait(); a\\nsignal calls sig_runtime_request_shutdown, which is not\\nasync-signal-safe and so cannot run in a handler. In single-threaded\\nmode there is no thread: handlers whose only action is an\\nasync-signal-safe write() to a self-pipe, which the loop watches and\\nwhich makes the same call on the loop thread. SIGINFO writes a\\nruntime snapshot to stderr and does not stop anything. Disarm joins\\nthe thread and restores the signal mask, or restores the handlers\\nand closes the pipe." <<SigHostShutdown>> as SigHostShutdown
}
rectangle "==Capsules\\n<size:10>[sig_capsule.h; part of sig::sig, with the shim in capsules/ (target sig_builtin_capsules, SIG_HOST)]</size>\\n\\nThree layers in a 1 : n : n relationship. A capsule is compiled-in static\\ncode; a capsule configuration is a named configuration of one capsule\\n(a capsule plus properties), available to any service in the project;\\na capsule instance is one configuration used by one service, with its\\nown storage, state and routes. This is what runs. An instance takes the\\nname of its configuration, so a configuration appears at most once per\\nservice." <<SigCapsules>> as SigCapsules
rectangle "==Signal feed\\n<size:10>[sig_signal_feed.h; sig::signal_feed, SIG_SIGNAL_FEED]</size>\\n\\nStreams the signals crossing chosen capsule terminals to WebSocket\\nclients as JSON text frames, on the path "/feed" of the shared HTTP server.\\nA client names a service, instance and terminal and sees the signals from\\nthen on, with no history. The feed is unauthenticated: the only check is\\nthe Origin test the HTTP server makes. The runtime tap is the source of\\nthe data, and it is installed only while at least one subscription exists." <<SigFeed>> as SigFeed
rectangle "==HTTP\\n<size:10>[sig_http_server.h, sig_ws.h, sig_http_client.h; sig::http_server (SIG_HTTP_SERVER, needs SIG_NET) and sig::http_client (SIG_HTTP_CLIENT, libcurl)]</size>\\n\\nThe HTTP layer, in two independent parts. The server is one shared HTTP/1.1\\nserver per runtime, offered as a runtime module named http_server (build\\noptions SIG_NET and SIG_HTTP_SERVER); other modules register path prefixes\\non it. The client is a blocking and an asynchronous GET over libcurl (build\\noption SIG_HTTP_CLIENT). The server has no TLS and no authentication." <<SigHttp>> as SigHttp
rectangle "==Management\\n<size:10>[sig_mgmt.h, sig_mgmt_http.h; sig::mgmt (SIG_MGMT) and sig::mgmt_http (built when SIG_MGMT and SIG_HTTP_SERVER are both on)]</size>\\n\\nReads and controls a running runtime. The operations in sig::mgmt take and\\nreturn plain value trees and status codes and know nothing of any\\ntransport. The REST layer and the glue module in sig::mgmt_http map HTTP\\nonto them, on the shared HTTP server. Built when SIG_MGMT is ON; the HTTP\\npart is built when SIG_MGMT and SIG_HTTP_SERVER are both ON. There is no\\nauthentication anywhere in the area." <<SigMgmt>> as SigMgmt
rectangle "==Persistence\\n<size:10>[sig_persistence.h, sig_persistence_file.h; part of sig::sig]</size>\\n\\nA pluggable store of opaque blobs under a (namespace, key) pair. What a\\nnamespace means, and which names are valid, is up to the backend. The\\nlibrary ships one backend, the file backend. The project reads and writes\\nits configuration and service documents through it. The hooks block, so\\nthey are meant for configuration input and output, not for an event\\nloop hot path." <<SigPersistence>> as SigPersistence
rectangle "==Foundation\\n<size:10>[CMake target sig::sig (always built)]</size>\\n\\nAllocation, status codes, reference counting, hash table and list,\\nlogging, the sig_value data model, JSON, and the expression language.\\nPart of the sig::sig target and always built; it has no dependency on\\nthe optional modules. Its one dependency outside the module is\\nlogging, which takes a platform mutex (sig_thread.h)." <<SigFoundation>> as SigFoundation
rectangle "==Runtime\\n<size:10>[sig_runtime.h, sig_loop.h, sig_tap.h; part of sig::sig]</size>\\n\\nOwns one running system: the project loaded from the store, the runtime\\nmodules registered with it, and the lifecycle that starts and stops them.\\nThe runtime borrows the persistence store and the capsule registry it was\\ncreated with; both must outlive it. It can also be given an event loop,\\nwhich makes every service driven and the whole system single-threaded." <<SigRuntime>> as SigRuntime

SigHostRunner .[#8D8D8D,thickness=2].> SigHostShutdown : <color:#8D8D8D>arm_shutdown before start; disarm_shutdown after stop
SigHostEntry .[#8D8D8D,thickness=2].> SigHostRunner : <color:#8D8D8D>sig_host_run with the file store, the registry, the modules and the flag
SigHostEntry .[#8D8D8D,thickness=2].> SigHostShutdown : <color:#8D8D8D>sig_host_posix_platform supplies the hooks
SigHostRunner .[#8D8D8D,thickness=2].> SigFoundation : <color:#8D8D8D>logs the store that was opened
SigHostRunner .[#8D8D8D,thickness=2].> SigPersistence : <color:#8D8D8D>sig_persistence_create opens the store; sig_persistence_destroy closes it last
SigHostRunner .[#8D8D8D,thickness=2].> SigRuntime : <color:#8D8D8D>[...]
SigHostShutdown .[#8D8D8D,thickness=2].> SigFoundation : <color:#8D8D8D>[...]
SigHostShutdown .[#8D8D8D,thickness=2].> SigRuntime : <color:#8D8D8D>[...]
SigHostEntry .[#8D8D8D,thickness=2].> SigCapsules : <color:#8D8D8D>[...]
SigHostEntry .[#8D8D8D,thickness=2].> SigFeed : <color:#8D8D8D>sig_signal_feed_module, with -m when the feed was built
SigHostEntry .[#8D8D8D,thickness=2].> SigFoundation : <color:#8D8D8D>sig_log_init and sig_log_shutdown
SigHostEntry .[#8D8D8D,thickness=2].> SigHttp : <color:#8D8D8D>sig_http_server_module, with -m
SigHostEntry .[#8D8D8D,thickness=2].> SigMgmt : <color:#8D8D8D>[...]
SigHostEntry .[#8D8D8D,thickness=2].> SigPersistence : <color:#8D8D8D>passes sig_persistence_file_module and the project directory
@enduml
`;case`http`:return`@startuml
title "HTTP"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SigHttpServer>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHttpThreaded>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHttpLooped>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHttpDispatch>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHttpParser>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHttpWs>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHttpClient>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "HTTP" <<SigHttp>> as SigHttp {
  skinparam RectangleBorderColor<<SigHttp>> #3b82f6
  skinparam RectangleFontColor<<SigHttp>> #3b82f6
  skinparam RectangleBorderStyle<<SigHttp>> dashed

  rectangle "==Server module\\n<size:10>[sig_http_server_module, sig_http_server_register, sig_http_server_register_upgrade; SIG_HTTP_SERVER]</size>\\n\\nThe runtime module that owns the server, created with a space separated\\nkey=value config: bind (default 127.0.0.1), port (default 8080, 0 for\\nan ephemeral port), cors_origin, and timeout_ms (default 5000, up to\\n600000). An unknown key or a bad value fails module creation with\\nSIG_ERR_INVALID_ARG. The server listens at start only if at least one\\nroute or upgrade prefix was registered; otherwise it logs and does\\nnothing, and a bad bind address then goes unnoticed. A bind that does not\\nstart with "127." logs a warning that the unauthenticated API is\\nreachable from the network. Modules registered after it find the server\\nwith sig_http_server_from_runtime during their create and register\\nprefixes; registration after start is SIG_ERR_STATE and a duplicate\\nprefix is SIG_ERR_EXISTS. Modules stop in reverse registration order, so\\nthe server is still serving while the stop hooks of the modules that\\nregistered routes run." <<SigHttpServer>> as SigHttpServer
  rectangle "==Threaded transport\\n<size:10>[server_main, handle_conn; sig_thread, blocking sig_net calls]</size>\\n\\nUsed when the runtime has no event loop. One server thread accepts with a\\n100 ms timeout, so it sees the stop flag, and serves one connection at a\\ntime, start to finish, with one request per connection. The whole request\\nmust arrive within timeout_ms (else 408), and each write has the same\\ntimeout (100 ms once stopping). After a 400, 431 or 413 reply (the only ones\\nmarked to drain) it briefly reads and discards what the client is still\\nsending so the client reads the reply and not a reset. Handlers run on this thread. An upgrade handler that returns\\nSIG_OK owns the connection; any other status is a 503." <<SigHttpThreaded>> as SigHttpThreaded
  rectangle "==Event-loop transport\\n<size:10>[listener_event, conn_event; sig_loop watches and timers]</size>\\n\\nUsed when the runtime has a loop. The server owns no thread: the listener\\nand each connection are fd watches on the loop, and handlers run on the\\nloop thread. Each connection is a READING, WRITING or DRAINING state\\nmachine with one timer for its current phase (timeout_ms; 100 ms for\\ndraining, which only follows a 400, 431 or 413 reply, up to 64 KiB\\ndiscarded), so a slow client costs a buffer and a\\ntimer, not the loop. At most four connections are open; at four the\\nlistener is unwatched, leaving further clients queued in the kernel, and it\\nis watched again when a connection closes. A request that times out while\\nreading gets a best-effort 408. An accepted upgrade removes the watch and\\ntimer and hands over the non-blocking connection." <<SigHttpLooped>> as SigHttpLooped
  rectangle "==Request evaluation and routing\\n<size:10>[evaluate_request, find_route, request_authorized in sig_http_server.c]</size>\\n\\nThe protocol part shared by both transports. It parses the head, answers\\n400, 431 or 413 for malformed or oversize requests (head over 8192 bytes,\\ntarget over 512, Content-Length over 8192), waits for the whole body, runs\\nrequest_authorized(), requires Content-Length and a JSON Content-Type on\\nPUT and PATCH (411, 415), answers OPTIONS with 204 when cors_origin is set\\nand 405 otherwise, and routes by the longest registered prefix that\\nmatches at a slash boundary (404 if none). A handler that returns a status\\nother than SIG_OK produces 500; the server frees the response body. A\\nGET with Upgrade: websocket and Connection: Upgrade goes to the upgrade\\ntable when an upgrade prefix matches (400 for a version other than 13 or no\\nkey, 403 when an Origin header does not equal cors_origin or "*"; no Origin\\nheader is allowed); with no matching upgrade prefix it is routed as an\\nordinary GET. request_authorized() ignores its arguments and returns true,\\nso the server has no authentication; it is the single place a check would\\ngo." <<SigHttpDispatch>> as SigHttpDispatch
  rectangle "==Request parser and response formatter\\n<size:10>[sig_http.c, sig_http.h; private, in sig::http_server]</size>\\n\\nPure functions over buffers. sig_http_parse_head reads the request line\\nand headers: it accepts HTTP/1.0 and 1.1, removes the query and fragment\\nfrom the path, rejects Transfer-Encoding and conflicting Content-Length\\nvalues, and keeps Content-Type, Content-Length and the WebSocket headers\\n(Upgrade, Connection, Sec-WebSocket-Key, Sec-WebSocket-Version, Origin). It\\nanswers INCOMPLETE until the blank line arrives. sig_http_format_response\\nbuilds a JSON response with Content-Length, Connection: close and\\nCache-Control: no-store, and adds Access-Control-Allow-Origin when\\ncors_origin is set, and the allowed methods and headers on a 204." <<SigHttpParser>> as SigHttpParser
  rectangle "==WebSocket primitives\\n<size:10>[sig_ws.h, sig_ws.c; part of sig::http_server]</size>\\n\\nHandshake and framing, as pure functions with no sockets. The accept key is\\nSHA-1 and base64 of the client key plus the RFC 6455 GUID. Server frames are\\nunmasked and unfragmented text, close, ping or pong. The decoder takes\\nmasked client frames from a buffer and unmasks them in place; it reports an\\nincomplete frame, a payload over a limit, or a protocol error (unmasked,\\nfragmented, reserved bits, unknown opcode, or a control frame over 125\\nbytes)." <<SigHttpWs>> as SigHttpWs
  rectangle "==HTTP client\\n<size:10>[sig_http_client_curl.c; libcurl; SIG_HTTP_CLIENT]</size>\\n\\nsig_http_client_get is a blocking GET with a positive millisecond timeout.\\nIt does not follow redirects, treats any HTTP status other than 200 as\\nSIG_ERR_PLATFORM, and refuses a body over 64 KiB. sig_http_get_async starts\\none short-lived detached thread per request that runs the same transfer and\\nthen calls done on that thread. The header promises that done never runs\\nbefore sig_http_get_async returns, but the curl port does not enforce it\\n(there is no handshake with the caller), so a fast failure can run done\\non the request thread before the call returns. There is no cancel. The client does not use the server, the socket layer or the event\\nloop. In this repository its user is the weather capsule." <<SigHttpClient>> as SigHttpClient
}

SigHttpServer .[#8D8D8D,thickness=2].> SigHttpDispatch : <color:#8D8D8D>both transports evaluate each request through it
SigHttpServer .[#8D8D8D,thickness=2].> SigHttpThreaded : <color:#8D8D8D>starts the server thread when the runtime has no loop; sets the stop flag and joins at stop
SigHttpServer .[#8D8D8D,thickness=2].> SigHttpLooped : <color:#8D8D8D>watches the listener on the loop when the runtime has one
SigHttpDispatch .[#8D8D8D,thickness=2].> SigHttpParser : <color:#8D8D8D>sig_http_parse_head and sig_http_format_response
SigHttpThreaded .[#8D8D8D,thickness=2].> SigHttpDispatch : <color:#8D8D8D>evaluate_request for each connection
SigHttpLooped .[#8D8D8D,thickness=2].> SigHttpDispatch : <color:#8D8D8D>evaluate_request when a readable event has data
@enduml
`;case`http_components`:return`@startuml
title "HTTP components"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SigCapsules>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFeed>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHost>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigMgmt>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHttpClient>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHttpServer>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHttpWs>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHttpThreaded>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHttpLooped>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFoundation>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHttpDispatch>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPlatform>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntime>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHttpParser>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "==Capsules\\n<size:10>[sig_capsule.h; part of sig::sig, with the shim in capsules/ (target sig_builtin_capsules, SIG_HOST)]</size>\\n\\nThree layers in a 1 : n : n relationship. A capsule is compiled-in static\\ncode; a capsule configuration is a named configuration of one capsule\\n(a capsule plus properties), available to any service in the project;\\na capsule instance is one configuration used by one service, with its\\nown storage, state and routes. This is what runs. An instance takes the\\nname of its configuration, so a configuration appears at most once per\\nservice." <<SigCapsules>> as SigCapsules
rectangle "==Signal feed\\n<size:10>[sig_signal_feed.h; sig::signal_feed, SIG_SIGNAL_FEED]</size>\\n\\nStreams the signals crossing chosen capsule terminals to WebSocket\\nclients as JSON text frames, on the path "/feed" of the shared HTTP server.\\nA client names a service, instance and terminal and sees the signals from\\nthen on, with no history. The feed is unauthenticated: the only check is\\nthe Origin test the HTTP server makes. The runtime tap is the source of\\nthe data, and it is installed only while at least one subscription exists." <<SigFeed>> as SigFeed
rectangle "==Host\\n<size:10>[sig_host.h; CMake target sig::host and the sighost executable (SIG_HOST)]</size>\\n\\nThe program that runs a project. sig_host_run is the portable boot\\nsequence; host/posix supplies the command line, the shutdown trigger\\nand the choice of persistence backend. The host registers the runtime\\nmodules it is given and knows nothing about particular capsules,\\nruntime modules or signals; main.c is what selects them." <<SigHost>> as SigHost
rectangle "==Management\\n<size:10>[sig_mgmt.h, sig_mgmt_http.h; sig::mgmt (SIG_MGMT) and sig::mgmt_http (built when SIG_MGMT and SIG_HTTP_SERVER are both on)]</size>\\n\\nReads and controls a running runtime. The operations in sig::mgmt take and\\nreturn plain value trees and status codes and know nothing of any\\ntransport. The REST layer and the glue module in sig::mgmt_http map HTTP\\nonto them, on the shared HTTP server. Built when SIG_MGMT is ON; the HTTP\\npart is built when SIG_MGMT and SIG_HTTP_SERVER are both ON. There is no\\nauthentication anywhere in the area." <<SigMgmt>> as SigMgmt
rectangle "HTTP" <<SigHttp>> as SigHttp {
  skinparam RectangleBorderColor<<SigHttp>> #3b82f6
  skinparam RectangleFontColor<<SigHttp>> #3b82f6
  skinparam RectangleBorderStyle<<SigHttp>> dashed

  rectangle "==HTTP client\\n<size:10>[sig_http_client_curl.c; libcurl; SIG_HTTP_CLIENT]</size>\\n\\nsig_http_client_get is a blocking GET with a positive millisecond timeout.\\nIt does not follow redirects, treats any HTTP status other than 200 as\\nSIG_ERR_PLATFORM, and refuses a body over 64 KiB. sig_http_get_async starts\\none short-lived detached thread per request that runs the same transfer and\\nthen calls done on that thread. The header promises that done never runs\\nbefore sig_http_get_async returns, but the curl port does not enforce it\\n(there is no handshake with the caller), so a fast failure can run done\\non the request thread before the call returns. There is no cancel. The client does not use the server, the socket layer or the event\\nloop. In this repository its user is the weather capsule." <<SigHttpClient>> as SigHttpClient
  rectangle "==Server module\\n<size:10>[sig_http_server_module, sig_http_server_register, sig_http_server_register_upgrade; SIG_HTTP_SERVER]</size>\\n\\nThe runtime module that owns the server, created with a space separated\\nkey=value config: bind (default 127.0.0.1), port (default 8080, 0 for\\nan ephemeral port), cors_origin, and timeout_ms (default 5000, up to\\n600000). An unknown key or a bad value fails module creation with\\nSIG_ERR_INVALID_ARG. The server listens at start only if at least one\\nroute or upgrade prefix was registered; otherwise it logs and does\\nnothing, and a bad bind address then goes unnoticed. A bind that does not\\nstart with "127." logs a warning that the unauthenticated API is\\nreachable from the network. Modules registered after it find the server\\nwith sig_http_server_from_runtime during their create and register\\nprefixes; registration after start is SIG_ERR_STATE and a duplicate\\nprefix is SIG_ERR_EXISTS. Modules stop in reverse registration order, so\\nthe server is still serving while the stop hooks of the modules that\\nregistered routes run." <<SigHttpServer>> as SigHttpServer
  rectangle "==WebSocket primitives\\n<size:10>[sig_ws.h, sig_ws.c; part of sig::http_server]</size>\\n\\nHandshake and framing, as pure functions with no sockets. The accept key is\\nSHA-1 and base64 of the client key plus the RFC 6455 GUID. Server frames are\\nunmasked and unfragmented text, close, ping or pong. The decoder takes\\nmasked client frames from a buffer and unmasks them in place; it reports an\\nincomplete frame, a payload over a limit, or a protocol error (unmasked,\\nfragmented, reserved bits, unknown opcode, or a control frame over 125\\nbytes)." <<SigHttpWs>> as SigHttpWs
  rectangle "==Threaded transport\\n<size:10>[server_main, handle_conn; sig_thread, blocking sig_net calls]</size>\\n\\nUsed when the runtime has no event loop. One server thread accepts with a\\n100 ms timeout, so it sees the stop flag, and serves one connection at a\\ntime, start to finish, with one request per connection. The whole request\\nmust arrive within timeout_ms (else 408), and each write has the same\\ntimeout (100 ms once stopping). After a 400, 431 or 413 reply (the only ones\\nmarked to drain) it briefly reads and discards what the client is still\\nsending so the client reads the reply and not a reset. Handlers run on this thread. An upgrade handler that returns\\nSIG_OK owns the connection; any other status is a 503." <<SigHttpThreaded>> as SigHttpThreaded
  rectangle "==Event-loop transport\\n<size:10>[listener_event, conn_event; sig_loop watches and timers]</size>\\n\\nUsed when the runtime has a loop. The server owns no thread: the listener\\nand each connection are fd watches on the loop, and handlers run on the\\nloop thread. Each connection is a READING, WRITING or DRAINING state\\nmachine with one timer for its current phase (timeout_ms; 100 ms for\\ndraining, which only follows a 400, 431 or 413 reply, up to 64 KiB\\ndiscarded), so a slow client costs a buffer and a\\ntimer, not the loop. At most four connections are open; at four the\\nlistener is unwatched, leaving further clients queued in the kernel, and it\\nis watched again when a connection closes. A request that times out while\\nreading gets a best-effort 408. An accepted upgrade removes the watch and\\ntimer and hands over the non-blocking connection." <<SigHttpLooped>> as SigHttpLooped
  rectangle "==Request evaluation and routing\\n<size:10>[evaluate_request, find_route, request_authorized in sig_http_server.c]</size>\\n\\nThe protocol part shared by both transports. It parses the head, answers\\n400, 431 or 413 for malformed or oversize requests (head over 8192 bytes,\\ntarget over 512, Content-Length over 8192), waits for the whole body, runs\\nrequest_authorized(), requires Content-Length and a JSON Content-Type on\\nPUT and PATCH (411, 415), answers OPTIONS with 204 when cors_origin is set\\nand 405 otherwise, and routes by the longest registered prefix that\\nmatches at a slash boundary (404 if none). A handler that returns a status\\nother than SIG_OK produces 500; the server frees the response body. A\\nGET with Upgrade: websocket and Connection: Upgrade goes to the upgrade\\ntable when an upgrade prefix matches (400 for a version other than 13 or no\\nkey, 403 when an Origin header does not equal cors_origin or "*"; no Origin\\nheader is allowed); with no matching upgrade prefix it is routed as an\\nordinary GET. request_authorized() ignores its arguments and returns true,\\nso the server has no authentication; it is the single place a check would\\ngo." <<SigHttpDispatch>> as SigHttpDispatch
  rectangle "==Request parser and response formatter\\n<size:10>[sig_http.c, sig_http.h; private, in sig::http_server]</size>\\n\\nPure functions over buffers. sig_http_parse_head reads the request line\\nand headers: it accepts HTTP/1.0 and 1.1, removes the query and fragment\\nfrom the path, rejects Transfer-Encoding and conflicting Content-Length\\nvalues, and keeps Content-Type, Content-Length and the WebSocket headers\\n(Upgrade, Connection, Sec-WebSocket-Key, Sec-WebSocket-Version, Origin). It\\nanswers INCOMPLETE until the blank line arrives. sig_http_format_response\\nbuilds a JSON response with Content-Length, Connection: close and\\nCache-Control: no-store, and adds Access-Control-Allow-Origin when\\ncors_origin is set, and the allowed methods and headers on a 204." <<SigHttpParser>> as SigHttpParser
}
rectangle "==Foundation\\n<size:10>[CMake target sig::sig (always built)]</size>\\n\\nAllocation, status codes, reference counting, hash table and list,\\nlogging, the sig_value data model, JSON, and the expression language.\\nPart of the sig::sig target and always built; it has no dependency on\\nthe optional modules. Its one dependency outside the module is\\nlogging, which takes a platform mutex (sig_thread.h)." <<SigFoundation>> as SigFoundation
rectangle "==Platform\\n<size:10>[CMake targets sig::sig (threads, time, poller) and sig::net (TCP, SIG_NET)]</size>\\n\\nEverything OS-specific, behind headers. Threads, time and the poller are\\npart of sig::sig and always built; the TCP layer is the optional sig::net\\ntarget, built with -DSIG_NET=ON. Only POSIX implementations exist today\\n(src/platform/posix and src/net/sig_net_posix.c); the rest of libsig\\ndoes not include OS headers. A port to another system replaces these\\nfiles and nothing above them." <<SigPlatform>> as SigPlatform
rectangle "==Runtime\\n<size:10>[sig_runtime.h, sig_loop.h, sig_tap.h; part of sig::sig]</size>\\n\\nOwns one running system: the project loaded from the store, the runtime\\nmodules registered with it, and the lifecycle that starts and stops them.\\nThe runtime borrows the persistence store and the capsule registry it was\\ncreated with; both must outlive it. It can also be given an event loop,\\nwhich makes every service driven and the whole system single-threaded." <<SigRuntime>> as SigRuntime

SigCapsules .[#8D8D8D,thickness=2].> SigHttpClient : <color:#8D8D8D>the weather capsule, if listed in SIG_CAPSULES and SIG_HTTP_CLIENT is on, takes sig_http_get_async as its transport (weather_capsule.h includes sig_http_client.h)
SigFeed .[#8D8D8D,thickness=2].> SigHttpServer : <color:#8D8D8D>sig_http_server_from_runtime and sig_http_server_register_upgrade('/feed') in create
SigFeed .[#8D8D8D,thickness=2].> SigHttpWs : <color:#8D8D8D>[...]
SigHost .[#8D8D8D,thickness=2].> SigHttpServer : <color:#8D8D8D>sig_http_server_module, with -m
SigMgmt .[#8D8D8D,thickness=2].> SigHttpServer : <color:#8D8D8D>sig_http_server_from_runtime and sig_http_server_register('/') in its create hook
SigHttpServer .[#8D8D8D,thickness=2].> SigHttpDispatch : <color:#8D8D8D>both transports evaluate each request through it
SigHttpServer .[#8D8D8D,thickness=2].> SigHttpThreaded : <color:#8D8D8D>starts the server thread when the runtime has no loop; sets the stop flag and joins at stop
SigHttpServer .[#8D8D8D,thickness=2].> SigHttpLooped : <color:#8D8D8D>watches the listener on the loop when the runtime has one
SigHttpDispatch .[#8D8D8D,thickness=2].> SigHttpParser : <color:#8D8D8D>sig_http_parse_head and sig_http_format_response
SigHttpThreaded .[#8D8D8D,thickness=2].> SigHttpDispatch : <color:#8D8D8D>evaluate_request for each connection
SigHttpLooped .[#8D8D8D,thickness=2].> SigHttpDispatch : <color:#8D8D8D>evaluate_request when a readable event has data
SigHttpServer .[#8D8D8D,thickness=2].> SigFoundation : <color:#8D8D8D>[...]
SigHttpServer .[#8D8D8D,thickness=2].> SigPlatform : <color:#8D8D8D>[...]
SigHttpServer .[#8D8D8D,thickness=2].> SigRuntime : <color:#8D8D8D>registered as the runtime module 'http_server'; create, start, stop and destroy hooks
SigHttpDispatch .[#8D8D8D,thickness=2].> SigMgmt : <color:#8D8D8D>runs the handler registered for the longest matching prefix, '/' here
SigHttpThreaded .[#8D8D8D,thickness=2].> SigFeed : <color:#8D8D8D>offers a validated upgrade connection on the server thread
SigHttpThreaded .[#8D8D8D,thickness=2].> SigPlatform : <color:#8D8D8D>[...]
SigHttpLooped .[#8D8D8D,thickness=2].> SigFeed : <color:#8D8D8D>offers a validated upgrade connection on the loop thread, with the fd already unwatched
SigHttpLooped .[#8D8D8D,thickness=2].> SigPlatform : <color:#8D8D8D>[...]
SigHttpLooped .[#8D8D8D,thickness=2].> SigRuntime : <color:#8D8D8D>sig_loop_watch_fd, sig_loop_watch_modify, sig_loop_timer_start for connections and the listener
SigHttpClient .[#8D8D8D,thickness=2].> SigFoundation : <color:#8D8D8D>[...]
@enduml
`;case`mgmt`:return`@startuml
title "Management"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SigMgmtGlue>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigMgmtModule>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigMgmtRest>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigMgmtActions>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigMgmtEdits>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigMgmtStatus>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigMgmtReads>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "Management" <<SigMgmt>> as SigMgmt {
  skinparam RectangleBorderColor<<SigMgmt>> #3b82f6
  skinparam RectangleFontColor<<SigMgmt>> #3b82f6
  skinparam RectangleBorderStyle<<SigMgmt>> dashed

  rectangle "==HTTP glue module\\n<size:10>[sig_mgmt_http_module; SIG_MGMT and SIG_HTTP_SERVER]</size>\\n\\nThe runtime module named "mgmt_http". Its create hook finds the HTTP\\nserver and the mgmt state (both must be registered earlier, else start\\nfails with the lookup status), refuses any config, and registers the "/"\\nprefix on the server with a handler that calls the REST router and hands\\nits body to the server. So every path of the server not taken by a longer\\nprefix reaches the REST router. It has no start, stop or destroy hook.\\nAuthorization is not here: the server runs its request_authorized() check\\nbefore any handler, and that check always accepts." <<SigMgmtGlue>> as SigMgmtGlue
  rectangle "==Mgmt module\\n<size:10>[sig_mgmt_module; SIG_MGMT]</size>\\n\\nThe runtime module named "mgmt". Its create hook records the start time\\nand initialises the one reader-writer lock; it has no start or stop hook\\nand its destroy hook frees the state. The state is found by other\\nmodules with sig_mgmt_from_runtime after it is created, so it must be\\nregistered before the glue module." <<SigMgmtModule>> as SigMgmtModule
  rectangle "==REST router\\n<size:10>[sig_mgmt_rest_handle, route table, split_path in sig_mgmt_rest.c; private]</size>\\n\\nTurns a method, a path and a body into one operation call. The route\\ntable has 19 routes of up to four segments: system, services (with\\ninstances, config, start, stop, restart), capsules, configurations\\n(with rename) and system/shutdown. A PUT that creates an object answers\\n201 and one that replaces it 200. A path is split on slash first and\\neach segment then percent-decoded, so an encoded slash cannot create a\\nsegment. A malformed escape is 400, more than four segments or no\\nmatching path is 404, and a matching path with another method is 405.\\nPUT, PATCH and the rename route need a body (400 otherwise). Nothing here\\ntouches runtime or project state." <<SigMgmtRest>> as SigMgmtRest
  rectangle "==Service actions\\n<size:10>[sig_mgmt_start/stop/restart_service, request_shutdown]</size>\\n\\nThe hooks of a service run with none of the mgmt lock held. Start never\\ncalls the runtime start that rebuilds: it first rebuilds a stopped, dirty\\nservice in a short exclusive section (the old service is freed, which no\\nreader may be walking), then calls the runtime start for a prebuilt\\nservice, which answers SIG_ERR_STALE if the service went dirty again; the\\npair is retried up to 8 times and then reported as SIG_ERR_STATE. Restart\\nis a stop followed by that start, not one atomic call, so a concurrent\\nstart can win in between and a failed rebuild or start leaves the service\\nstopped. Stopping a stopped service succeeds. Each action returns the new\\nname and state. The shutdown request only records the request in the\\nruntime." <<SigMgmtActions>> as SigMgmtActions
  rectangle "==Edit operations\\n<size:10>[sig_mgmt_put/patch/delete/rename_*; edit_locked]</size>\\n\\nEach edit takes the exclusive lock and runs one project editing function\\ninside sig_runtime_edit, so edits wait for in-flight readers and for the\\nruntime control lock. The project validates the document and writes it\\nto the store; mgmt copies out the resulting definition text and builds\\nthe result tree after the lock is released. If the project reports a\\nfailure, nothing was changed (the one exception is SIG_ERR_ALLOC while\\nbuilding the result, after the edit was applied). The reason text is\\nreturned only for a rejected configuration document or a rename onto a\\ntaken name. A put or patch does not touch a running service; it is\\nreported dirty until it is stopped and rebuilt. Deleting a service stops\\nand destroys it even if it is running.\\nThe shared header notes that an edit waiting behind a slow service start\\nholds the exclusive lock, so reads stall until that start returns." <<SigMgmtEdits>> as SigMgmtEdits
  rectangle "==Status mapping and JSON rendering\\n<size:10>[op_error, edit_error, emit_tree in sig_mgmt_rest.c; private]</size>\\n\\nMaps operation statuses to HTTP, per kind of operation. Reads and actions:\\nnot found 404, an already running service 409, SIG_ERR_STATE 503\\n("runtime is not running", which is also what a start that was\\novertaken 8 times or a missing project produces), and for actions\\nSIG_ERR_INVALID_ARG 422 (a capsule configuration is invalid), anything\\nelse 500. Edits: SIG_ERR_INVALID_ARG 400, a document that failed\\nvalidation 422, not found 404, a configuration in use or a name taken\\n409, SIG_ERR_STATE 503, anything else 500. Errors are {"error": code, "message": text}. Result trees are written\\nas JSON; a property value of kind bytes, map or list is written as null." <<SigMgmtStatus>> as SigMgmtStatus
  rectangle "==Read operations\\n<size:10>[sig_mgmt_system, list_*, get_*; build_* in sig_mgmt.c]</size>\\n\\nEach read takes the shared lock, builds a fresh tree and releases the lock.\\nThe tree is a deep copy with no pointers into runtime state, lists are\\nsorted by name, and concurrent readers do not block each other. A read\\nthat finds no project is SIG_ERR_STATE. A name that does not name an\\nobject is SIG_ERR_NOT_FOUND. The uptime is computed from a start time\\nkept in the module, so a read never takes the runtime control lock and is\\nnot stalled behind a slow service start." <<SigMgmtReads>> as SigMgmtReads
}

SigMgmtGlue .[#8D8D8D,thickness=2].> SigMgmtModule : <color:#8D8D8D>sig_mgmt_from_runtime in its create hook
SigMgmtActions .[#8D8D8D,thickness=2].> SigMgmtReads : <color:#8D8D8D>builds the returned {name, state} tree under the shared lock
SigMgmtRest .[#8D8D8D,thickness=2].> SigMgmtReads : <color:#8D8D8D>GET routes
SigMgmtRest .[#8D8D8D,thickness=2].> SigMgmtActions : <color:#8D8D8D>POST start, stop, restart and shutdown routes
SigMgmtRest .[#8D8D8D,thickness=2].> SigMgmtEdits : <color:#8D8D8D>PUT, PATCH, DELETE and rename routes
SigMgmtRest .[#8D8D8D,thickness=2].> SigMgmtStatus : <color:#8D8D8D>maps statuses to HTTP and renders the result tree
SigMgmtGlue .[#8D8D8D,thickness=2].> SigMgmtRest : <color:#8D8D8D>the registered handler calls sig_mgmt_rest_handle
@enduml
`;case`mgmt_components`:return`@startuml
title "Management components"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SigHost>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHttp>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigMgmtGlue>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigMgmtModule>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigMgmtRest>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigMgmtActions>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigMgmtEdits>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigMgmtStatus>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigMgmtReads>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigCapsules>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFoundation>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPlatform>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigProject>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntime>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigService>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "==Host\\n<size:10>[sig_host.h; CMake target sig::host and the sighost executable (SIG_HOST)]</size>\\n\\nThe program that runs a project. sig_host_run is the portable boot\\nsequence; host/posix supplies the command line, the shutdown trigger\\nand the choice of persistence backend. The host registers the runtime\\nmodules it is given and knows nothing about particular capsules,\\nruntime modules or signals; main.c is what selects them." <<SigHost>> as SigHost
rectangle "==HTTP\\n<size:10>[sig_http_server.h, sig_ws.h, sig_http_client.h; sig::http_server (SIG_HTTP_SERVER, needs SIG_NET) and sig::http_client (SIG_HTTP_CLIENT, libcurl)]</size>\\n\\nThe HTTP layer, in two independent parts. The server is one shared HTTP/1.1\\nserver per runtime, offered as a runtime module named http_server (build\\noptions SIG_NET and SIG_HTTP_SERVER); other modules register path prefixes\\non it. The client is a blocking and an asynchronous GET over libcurl (build\\noption SIG_HTTP_CLIENT). The server has no TLS and no authentication." <<SigHttp>> as SigHttp
rectangle "Management" <<SigMgmt>> as SigMgmt {
  skinparam RectangleBorderColor<<SigMgmt>> #3b82f6
  skinparam RectangleFontColor<<SigMgmt>> #3b82f6
  skinparam RectangleBorderStyle<<SigMgmt>> dashed

  rectangle "==HTTP glue module\\n<size:10>[sig_mgmt_http_module; SIG_MGMT and SIG_HTTP_SERVER]</size>\\n\\nThe runtime module named "mgmt_http". Its create hook finds the HTTP\\nserver and the mgmt state (both must be registered earlier, else start\\nfails with the lookup status), refuses any config, and registers the "/"\\nprefix on the server with a handler that calls the REST router and hands\\nits body to the server. So every path of the server not taken by a longer\\nprefix reaches the REST router. It has no start, stop or destroy hook.\\nAuthorization is not here: the server runs its request_authorized() check\\nbefore any handler, and that check always accepts." <<SigMgmtGlue>> as SigMgmtGlue
  rectangle "==Mgmt module\\n<size:10>[sig_mgmt_module; SIG_MGMT]</size>\\n\\nThe runtime module named "mgmt". Its create hook records the start time\\nand initialises the one reader-writer lock; it has no start or stop hook\\nand its destroy hook frees the state. The state is found by other\\nmodules with sig_mgmt_from_runtime after it is created, so it must be\\nregistered before the glue module." <<SigMgmtModule>> as SigMgmtModule
  rectangle "==REST router\\n<size:10>[sig_mgmt_rest_handle, route table, split_path in sig_mgmt_rest.c; private]</size>\\n\\nTurns a method, a path and a body into one operation call. The route\\ntable has 19 routes of up to four segments: system, services (with\\ninstances, config, start, stop, restart), capsules, configurations\\n(with rename) and system/shutdown. A PUT that creates an object answers\\n201 and one that replaces it 200. A path is split on slash first and\\neach segment then percent-decoded, so an encoded slash cannot create a\\nsegment. A malformed escape is 400, more than four segments or no\\nmatching path is 404, and a matching path with another method is 405.\\nPUT, PATCH and the rename route need a body (400 otherwise). Nothing here\\ntouches runtime or project state." <<SigMgmtRest>> as SigMgmtRest
  rectangle "==Service actions\\n<size:10>[sig_mgmt_start/stop/restart_service, request_shutdown]</size>\\n\\nThe hooks of a service run with none of the mgmt lock held. Start never\\ncalls the runtime start that rebuilds: it first rebuilds a stopped, dirty\\nservice in a short exclusive section (the old service is freed, which no\\nreader may be walking), then calls the runtime start for a prebuilt\\nservice, which answers SIG_ERR_STALE if the service went dirty again; the\\npair is retried up to 8 times and then reported as SIG_ERR_STATE. Restart\\nis a stop followed by that start, not one atomic call, so a concurrent\\nstart can win in between and a failed rebuild or start leaves the service\\nstopped. Stopping a stopped service succeeds. Each action returns the new\\nname and state. The shutdown request only records the request in the\\nruntime." <<SigMgmtActions>> as SigMgmtActions
  rectangle "==Edit operations\\n<size:10>[sig_mgmt_put/patch/delete/rename_*; edit_locked]</size>\\n\\nEach edit takes the exclusive lock and runs one project editing function\\ninside sig_runtime_edit, so edits wait for in-flight readers and for the\\nruntime control lock. The project validates the document and writes it\\nto the store; mgmt copies out the resulting definition text and builds\\nthe result tree after the lock is released. If the project reports a\\nfailure, nothing was changed (the one exception is SIG_ERR_ALLOC while\\nbuilding the result, after the edit was applied). The reason text is\\nreturned only for a rejected configuration document or a rename onto a\\ntaken name. A put or patch does not touch a running service; it is\\nreported dirty until it is stopped and rebuilt. Deleting a service stops\\nand destroys it even if it is running.\\nThe shared header notes that an edit waiting behind a slow service start\\nholds the exclusive lock, so reads stall until that start returns." <<SigMgmtEdits>> as SigMgmtEdits
  rectangle "==Status mapping and JSON rendering\\n<size:10>[op_error, edit_error, emit_tree in sig_mgmt_rest.c; private]</size>\\n\\nMaps operation statuses to HTTP, per kind of operation. Reads and actions:\\nnot found 404, an already running service 409, SIG_ERR_STATE 503\\n("runtime is not running", which is also what a start that was\\novertaken 8 times or a missing project produces), and for actions\\nSIG_ERR_INVALID_ARG 422 (a capsule configuration is invalid), anything\\nelse 500. Edits: SIG_ERR_INVALID_ARG 400, a document that failed\\nvalidation 422, not found 404, a configuration in use or a name taken\\n409, SIG_ERR_STATE 503, anything else 500. Errors are {"error": code, "message": text}. Result trees are written\\nas JSON; a property value of kind bytes, map or list is written as null." <<SigMgmtStatus>> as SigMgmtStatus
  rectangle "==Read operations\\n<size:10>[sig_mgmt_system, list_*, get_*; build_* in sig_mgmt.c]</size>\\n\\nEach read takes the shared lock, builds a fresh tree and releases the lock.\\nThe tree is a deep copy with no pointers into runtime state, lists are\\nsorted by name, and concurrent readers do not block each other. A read\\nthat finds no project is SIG_ERR_STATE. A name that does not name an\\nobject is SIG_ERR_NOT_FOUND. The uptime is computed from a start time\\nkept in the module, so a read never takes the runtime control lock and is\\nnot stalled behind a slow service start." <<SigMgmtReads>> as SigMgmtReads
}
rectangle "==Capsules\\n<size:10>[sig_capsule.h; part of sig::sig, with the shim in capsules/ (target sig_builtin_capsules, SIG_HOST)]</size>\\n\\nThree layers in a 1 : n : n relationship. A capsule is compiled-in static\\ncode; a capsule configuration is a named configuration of one capsule\\n(a capsule plus properties), available to any service in the project;\\na capsule instance is one configuration used by one service, with its\\nown storage, state and routes. This is what runs. An instance takes the\\nname of its configuration, so a configuration appears at most once per\\nservice." <<SigCapsules>> as SigCapsules
rectangle "==Foundation\\n<size:10>[CMake target sig::sig (always built)]</size>\\n\\nAllocation, status codes, reference counting, hash table and list,\\nlogging, the sig_value data model, JSON, and the expression language.\\nPart of the sig::sig target and always built; it has no dependency on\\nthe optional modules. Its one dependency outside the module is\\nlogging, which takes a platform mutex (sig_thread.h)." <<SigFoundation>> as SigFoundation
rectangle "==Platform\\n<size:10>[CMake targets sig::sig (threads, time, poller) and sig::net (TCP, SIG_NET)]</size>\\n\\nEverything OS-specific, behind headers. Threads, time and the poller are\\npart of sig::sig and always built; the TCP layer is the optional sig::net\\ntarget, built with -DSIG_NET=ON. Only POSIX implementations exist today\\n(src/platform/posix and src/net/sig_net_posix.c); the rest of libsig\\ndoes not include OS headers. A port to another system replaces these\\nfiles and nothing above them." <<SigPlatform>> as SigPlatform
rectangle "==Project\\n<size:10>[sig_project.h, sig_config.h; part of sig::sig]</size>\\n\\nA project is the capsule configurations and services loaded from a\\npersistence store and wired together. It owns the configurations,\\nservices and capsule instances it builds, keeps the JSON definition of\\neach, and writes every edit back to the store. Nothing is started by\\nloading. The store and the capsule registry are borrowed and must outlive\\nthe project." <<SigProject>> as SigProject
rectangle "==Runtime\\n<size:10>[sig_runtime.h, sig_loop.h, sig_tap.h; part of sig::sig]</size>\\n\\nOwns one running system: the project loaded from the store, the runtime\\nmodules registered with it, and the lifecycle that starts and stops them.\\nThe runtime borrows the persistence store and the capsule registry it was\\ncreated with; both must outlive it. It can also be given an event loop,\\nwhich makes every service driven and the whole system single-threaded." <<SigRuntime>> as SigRuntime
rectangle "==Service\\n<size:10>[sig_service.h; part of sig::sig]</size>\\n\\nA service is a worker thread with a signal queue and a job scheduler,\\nowning a set of capsule instances by name (it borrows them; the project\\nowns them). Once a service is started, terminal handlers and lifecycle\\nhooks of its instances run on its own thread, except that start hooks run\\non the thread that called start and stop hooks on the thread that called\\nstop. A service can instead be driven by an event loop, with no thread of\\nits own." <<SigService>> as SigService

SigHost .[#8D8D8D,thickness=2].> SigMgmtModule : <color:#8D8D8D>sig_mgmt_module, with -m
SigHost .[#8D8D8D,thickness=2].> SigMgmtGlue : <color:#8D8D8D>sig_mgmt_http_module, with -m
SigHttp .[#8D8D8D,thickness=2].> SigMgmtGlue : <color:#8D8D8D>runs the handler registered for the longest matching prefix, '/' here
SigMgmtGlue .[#8D8D8D,thickness=2].> SigMgmtModule : <color:#8D8D8D>sig_mgmt_from_runtime in its create hook
SigMgmtActions .[#8D8D8D,thickness=2].> SigMgmtReads : <color:#8D8D8D>builds the returned {name, state} tree under the shared lock
SigMgmtRest .[#8D8D8D,thickness=2].> SigMgmtReads : <color:#8D8D8D>GET routes
SigMgmtRest .[#8D8D8D,thickness=2].> SigMgmtActions : <color:#8D8D8D>POST start, stop, restart and shutdown routes
SigMgmtRest .[#8D8D8D,thickness=2].> SigMgmtEdits : <color:#8D8D8D>PUT, PATCH, DELETE and rename routes
SigMgmtRest .[#8D8D8D,thickness=2].> SigMgmtStatus : <color:#8D8D8D>maps statuses to HTTP and renders the result tree
SigMgmtGlue .[#8D8D8D,thickness=2].> SigMgmtRest : <color:#8D8D8D>the registered handler calls sig_mgmt_rest_handle
SigMgmtModule .[#8D8D8D,thickness=2].> SigPlatform : <color:#8D8D8D>[...]
SigMgmtModule .[#8D8D8D,thickness=2].> SigRuntime : <color:#8D8D8D>registered as the runtime module 'mgmt'; create and destroy hooks only
SigMgmtReads .[#8D8D8D,thickness=2].> SigCapsules : <color:#8D8D8D>[...]
SigMgmtReads .[#8D8D8D,thickness=2].> SigFoundation : <color:#8D8D8D>builds the result trees with sig_value maps and lists
SigMgmtReads .[#8D8D8D,thickness=2].> SigPlatform : <color:#8D8D8D>sig_rwlock_rdlock around every read
SigMgmtReads .[#8D8D8D,thickness=2].> SigProject : <color:#8D8D8D>[...]
SigMgmtReads .[#8D8D8D,thickness=2].> SigRuntime : <color:#8D8D8D>sig_runtime_walk_modules for the module names
SigMgmtReads .[#8D8D8D,thickness=2].> SigService : <color:#8D8D8D>walks the instances of a service, its name, its running flag
SigMgmtActions .[#8D8D8D,thickness=2].> SigPlatform : <color:#8D8D8D>shared lock for the lookup, exclusive lock for the rebuild
SigMgmtActions .[#8D8D8D,thickness=2].> SigProject : <color:#8D8D8D>sig_project_refresh_service rebuilds a stopped, dirty service
SigMgmtActions .[#8D8D8D,thickness=2].> SigRuntime : <color:#8D8D8D>[...]
SigMgmtEdits .[#8D8D8D,thickness=2].> SigFoundation : <color:#8D8D8D>builds the result tree from the definition text
SigMgmtEdits .[#8D8D8D,thickness=2].> SigPlatform : <color:#8D8D8D>sig_rwlock_wrlock around the edit
SigMgmtEdits .[#8D8D8D,thickness=2].> SigProject : <color:#8D8D8D>[...]
SigMgmtEdits .[#8D8D8D,thickness=2].> SigRuntime : <color:#8D8D8D>sig_runtime_edit runs the project edit under the control lock
SigMgmtStatus .[#8D8D8D,thickness=2].> SigFoundation : <color:#8D8D8D>sig_json writer, sig_value_from_json for the rename body
SigMgmtGlue .[#8D8D8D,thickness=2].> SigHttp : <color:#8D8D8D>sig_http_server_from_runtime and sig_http_server_register('/') in its create hook
SigMgmtGlue .[#8D8D8D,thickness=2].> SigRuntime : <color:#8D8D8D>registered as the runtime module 'mgmt_http'; create hook only
@enduml
`;case`edit_and_restart`:return`@startuml
title "Edit a configuration, then restart the service"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SigHttpDispatch>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigMgmtGlue>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigMgmtRest>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigMgmtEdits>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntimeControl>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigProjectEditing>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigProjectParser>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPersistenceStore>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPersistenceFile>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPersistenceAtomic>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigProjectDirty>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigMgmtActions>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigServiceLifecycle>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigMgmtReads>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "==Request evaluation and routing\\n<size:10>[evaluate_request, find_route, request_authorized in sig_http_server.c]</size>\\n\\nThe protocol part shared by both transports. It parses the head, answers\\n400, 431 or 413 for malformed or oversize requests (head over 8192 bytes,\\ntarget over 512, Content-Length over 8192), waits for the whole body, runs\\nrequest_authorized(), requires Content-Length and a JSON Content-Type on\\nPUT and PATCH (411, 415), answers OPTIONS with 204 when cors_origin is set\\nand 405 otherwise, and routes by the longest registered prefix that\\nmatches at a slash boundary (404 if none). A handler that returns a status\\nother than SIG_OK produces 500; the server frees the response body. A\\nGET with Upgrade: websocket and Connection: Upgrade goes to the upgrade\\ntable when an upgrade prefix matches (400 for a version other than 13 or no\\nkey, 403 when an Origin header does not equal cors_origin or "*"; no Origin\\nheader is allowed); with no matching upgrade prefix it is routed as an\\nordinary GET. request_authorized() ignores its arguments and returns true,\\nso the server has no authentication; it is the single place a check would\\ngo." <<SigHttpDispatch>> as SigHttpDispatch
rectangle "==HTTP glue module\\n<size:10>[sig_mgmt_http_module; SIG_MGMT and SIG_HTTP_SERVER]</size>\\n\\nThe runtime module named "mgmt_http". Its create hook finds the HTTP\\nserver and the mgmt state (both must be registered earlier, else start\\nfails with the lookup status), refuses any config, and registers the "/"\\nprefix on the server with a handler that calls the REST router and hands\\nits body to the server. So every path of the server not taken by a longer\\nprefix reaches the REST router. It has no start, stop or destroy hook.\\nAuthorization is not here: the server runs its request_authorized() check\\nbefore any handler, and that check always accepts." <<SigMgmtGlue>> as SigMgmtGlue
rectangle "==REST router\\n<size:10>[sig_mgmt_rest_handle, route table, split_path in sig_mgmt_rest.c; private]</size>\\n\\nTurns a method, a path and a body into one operation call. The route\\ntable has 19 routes of up to four segments: system, services (with\\ninstances, config, start, stop, restart), capsules, configurations\\n(with rename) and system/shutdown. A PUT that creates an object answers\\n201 and one that replaces it 200. A path is split on slash first and\\neach segment then percent-decoded, so an encoded slash cannot create a\\nsegment. A malformed escape is 400, more than four segments or no\\nmatching path is 404, and a matching path with another method is 405.\\nPUT, PATCH and the rename route need a body (400 otherwise). Nothing here\\ntouches runtime or project state." <<SigMgmtRest>> as SigMgmtRest
rectangle "==Edit operations\\n<size:10>[sig_mgmt_put/patch/delete/rename_*; edit_locked]</size>\\n\\nEach edit takes the exclusive lock and runs one project editing function\\ninside sig_runtime_edit, so edits wait for in-flight readers and for the\\nruntime control lock. The project validates the document and writes it\\nto the store; mgmt copies out the resulting definition text and builds\\nthe result tree after the lock is released. If the project reports a\\nfailure, nothing was changed (the one exception is SIG_ERR_ALLOC while\\nbuilding the result, after the edit was applied). The reason text is\\nreturned only for a rejected configuration document or a rename onto a\\ntaken name. A put or patch does not touch a running service; it is\\nreported dirty until it is stopped and rebuilt. Deleting a service stops\\nand destroys it even if it is running.\\nThe shared header notes that an edit waiting behind a slow service start\\nholds the exclusive lock, so reads stall until that start returns." <<SigMgmtEdits>> as SigMgmtEdits
rectangle "==Control mutex (edit lock)\\n<size:10>[sig_runtime_edit, sig_runtime_service_*; one sig_mutex]</size>\\n\\nOne control mutex (the service-control lock in the header) guards the\\nstate and serializes sig_runtime_service_start, stop, restart and\\nstart_prebuilt, sig_runtime_edit, sig_runtime_find_terminal and\\nsig_runtime_dump_info. The service calls, edit and find_terminal return SIG_ERR_STATE\\nunless the runtime is RUNNING (start_prebuilt returns SIG_ERR_STALE for\\na stopped service whose definition changed); uptime returns 0.0 and\\ndump_info reports a partial snapshot when not RUNNING. sig_runtime_edit runs a caller function on the\\nproject under that lock and is the only safe way to call the\\nsig_project editing functions while running. The mutex is held across\\nservice start and stop, which join worker threads. Rule: never call\\nsig_runtime_service_*, sig_runtime_uptime_seconds or\\nsig_runtime_dump_info from a service or capsule thread, because the\\nthread being joined may be the caller and the call deadlocks. Call\\nthem from module, transport or host threads only." <<SigRuntimeControl>> as SigRuntimeControl
rectangle "==Editing\\n<size:10>[sig_project_put_/patch_/delete_/rename_*]</size>\\n\\nCreates, replaces, patches (JSON merge patch), deletes and renames\\nconfigurations and services, saving each document to the store under its\\nname followed by one newline. Names must match [A-Za-z0-9_-]{1,64}. A\\ndocument is validated exactly as load would, and a configuration also\\nagainst the property table of its capsule; on any failure nothing is\\nsaved and nothing changes, and sig_project_last_error gives the reason.\\nReplacing or patching a service, and any configuration edit, leaves a\\nrunning service running (it only becomes dirty); deleting a\\nconfiguration that a service definition uses is refused with\\nSIG_ERR_EXISTS. Deleting a service stops and destroys it, even if\\nit is running. Not thread-safe on its\\nown: callers serialize edits with each other and with service start and\\nstop, which sig_runtime_edit does." <<SigProjectEditing>> as SigProjectEditing
rectangle "==Config parser\\n<size:10>[sig_config.h; sig_value JSON; private functions]</size>\\n\\nTurns one .cfg JSON document into live objects. A capsule configuration\\ndocument names its capsule in "type" (looked up in the registry) and may\\ncarry an "attr_value" object whose values must be int, bool, double or\\nstring. A service document has an optional boolean "auto_start" and an\\n"execution" array whose entries each name a capsule configuration; the\\ninstance takes that name. It works in two passes, so a receiver may name\\nan entry listed later: first every entry is instantiated and added to the\\nservice, then every "receivers" object (output terminal to a list of\\nname and input) is wired with sig_capsule_instance_connect. On failure\\nnothing is left allocated. The functions in sig_config.h are SIG_PRIVATE,\\nso this component has no public functions." <<SigProjectParser>> as SigProjectParser
rectangle "==Store interface\\n<size:10>[sig_persistence_module, sig_persistence_create/load/save/remove/list]</size>\\n\\nA backend is a sig_persistence_module: a name, create and destroy, and\\nthe data hooks load, save, remove and list. sig_persistence_create\\nbinds a backend to a config string and keeps the state it returns; the\\ndata calls check their arguments and forward to the hook. A NULL\\nargument, or a backend with no such hook, is SIG_ERR_INVALID_ARG.\\nload returns a sig_alloc buffer that the caller frees and reports a\\nmissing key as SIG_ERR_NOT_FOUND; save creates or replaces the key and\\nonly borrows the data; remove reports a missing key as\\nSIG_ERR_NOT_FOUND; list calls back once per key and stops at the first\\nstatus other than SIG_OK. The callback must not save or remove keys in\\nthe namespace being listed." <<SigPersistenceStore>> as SigPersistenceStore
rectangle "==File backend\\n<size:10>[sig_persistence_file_module ("file"); stdio, dirent, POSIX]</size>\\n\\nMaps a namespace to a directory under a base directory (its config\\nstring; NULL or empty is refused, and the directory is neither checked\\nnor created when the backend is created). A key lives at\\nbase/ns/key.cfg for the "configurations" and "services" namespaces and\\nat base/ns/key.sig for any other namespace. A namespace is 1 to 64\\ncharacters of letters, digits, underscore or hyphen. A key is 1 to 128\\nbytes with no slash, no two consecutive dots and no control character;\\nso "My Svc" and "v1.2" are valid. A name that breaks the rules is\\nSIG_ERR_INVALID_ARG before the filesystem is touched. load and remove\\nreport a missing file as SIG_ERR_NOT_FOUND; other filesystem failures\\nare SIG_ERR_PLATFORM. list returns the regular files with the\\nnamespace extension and a valid key as stem, extension stripped and\\nsorted bytewise; a missing namespace directory lists zero keys." <<SigPersistenceFile>> as SigPersistenceFile
rectangle "==Atomic save\\n<size:10>[file_save in sig_persistence_file.c]</size>\\n\\nsave creates every missing directory down to base/ns (mode 0755, the\\nbase directory included), writes the data to key.ext.tmp in the\\nnamespace directory, flushes and fsyncs it, closes it and renames it\\nover key.ext. A reader or a crash sees the old file or the new one, not\\na half-written file. If the write or the rename fails, the temporary\\nfile is removed and the old content stays in place. The directory\\nitself is not fsynced." <<SigPersistenceAtomic>> as SigPersistenceAtomic
rectangle "==Dirty tracking\\n<size:10>[sig_project_service_dirty/refresh_service]</size>\\n\\nEvery edit bumps a sequence number. A service is dirty when its\\ndefinition, or the definition of a configuration it uses, changed after\\nthe live service was built. A stopped service is rebuilt immediately\\nafter an edit; a running one keeps its old instances and is reported\\ndirty until it is stopped and refreshed, so an edit cannot half-apply.\\nsig_project_refresh_service rebuilds a stopped, dirty service and\\ninvalidates earlier pointers to it; a running service is left alone." <<SigProjectDirty>> as SigProjectDirty
rectangle "==Service actions\\n<size:10>[sig_mgmt_start/stop/restart_service, request_shutdown]</size>\\n\\nThe hooks of a service run with none of the mgmt lock held. Start never\\ncalls the runtime start that rebuilds: it first rebuilds a stopped, dirty\\nservice in a short exclusive section (the old service is freed, which no\\nreader may be walking), then calls the runtime start for a prebuilt\\nservice, which answers SIG_ERR_STALE if the service went dirty again; the\\npair is retried up to 8 times and then reported as SIG_ERR_STATE. Restart\\nis a stop followed by that start, not one atomic call, so a concurrent\\nstart can win in between and a failed rebuild or start leaves the service\\nstopped. Stopping a stopped service succeeds. Each action returns the new\\nname and state. The shutdown request only records the request in the\\nruntime." <<SigMgmtActions>> as SigMgmtActions
rectangle "==Start and stop\\n<size:10>[sig_service_create/start/stop/destroy]</size>\\n\\nsig_service_start runs every instance start hook SYNCHRONOUSLY on the\\ncalling thread, before the worker thread is spawned, so the hooks have\\nrun when start returns. Before each start hook the instance properties\\nare resolved. If resolving or a hook fails, the instances already\\nstarted get their stop hook, scheduled jobs are canceled, no thread is\\nspawned, and the service stays stopped and can be started again.\\nsig_service_stop stops accepting signals, then joins the worker thread\\nFIRST (a driven service has no worker: the calling thread drains the\\nqueued signals itself, sig_service.c:731-743), cancels jobs, then runs\\nthe stop hooks on the calling thread.\\nStarting a started service is SIG_ERR_EXISTS; stopping or destroying a\\nnever-started or stopped service is a safe no-op; destroy stops a\\nrunning service first." <<SigServiceLifecycle>> as SigServiceLifecycle
rectangle "==Read operations\\n<size:10>[sig_mgmt_system, list_*, get_*; build_* in sig_mgmt.c]</size>\\n\\nEach read takes the shared lock, builds a fresh tree and releases the lock.\\nThe tree is a deep copy with no pointers into runtime state, lists are\\nsorted by name, and concurrent readers do not block each other. A read\\nthat finds no project is SIG_ERR_STATE. A name that does not name an\\nobject is SIG_ERR_NOT_FOUND. The uptime is computed from a start time\\nkept in the module, so a read never takes the runtime control lock and is\\nnot stalled behind a slow service start." <<SigMgmtReads>> as SigMgmtReads

SigHttpDispatch .[#8D8D8D,thickness=2].> SigMgmtGlue : <color:#8D8D8D>PATCH /configurations/Sim: the server has read the whole request, request_authorized() accepted it, and the longest matching prefix is '/', whose handler is the glue
SigMgmtGlue .[#8D8D8D,thickness=2].> SigMgmtRest : <color:#8D8D8D>sig_mgmt_rest_handle(method, path, body) splits and decodes the path and finds the PATCH route (400 if the body is empty)
SigMgmtRest .[#8D8D8D,thickness=2].> SigMgmtEdits : <color:#8D8D8D>sig_mgmt_patch_configuration: the exclusive mgmt lock is taken, so in-flight reads drain first
SigMgmtEdits .[#8D8D8D,thickness=2].> SigRuntimeControl : <color:#8D8D8D>sig_runtime_edit runs the project edit under the runtime control mutex (SIG_ERR_STATE if the runtime is not RUNNING)
SigRuntimeControl .[#8D8D8D,thickness=2].> SigProjectEditing : <color:#8D8D8D>sig_project_patch_configuration: the JSON patch is merged over the stored text, then put_configuration runs
SigProjectEditing .[#8D8D8D,thickness=2].> SigProjectParser : <color:#8D8D8D>the merged document is parsed exactly as at load, then checked against the property table of its capsule (sig_capsule_configuration_validate); nothing is written if either fails (422 with the reason)
SigProjectEditing .[#8D8D8D,thickness=2].> SigPersistenceStore : <color:#8D8D8D>save_doc: the document plus a newline goes to sig_persistence_save('configurations', 'Sim')
SigPersistenceStore .[#8D8D8D,thickness=2].> SigPersistenceFile : <color:#8D8D8D>the namespace and key are checked against the file backend rules, and the 'configurations' namespace maps to the .cfg extension
SigPersistenceFile .[#8D8D8D,thickness=2].> SigPersistenceAtomic : <color:#8D8D8D>the file backend writes Sim.cfg.tmp, fsyncs it and renames it over Sim.cfg; on failure the old file and the old definition stay
SigProjectEditing .[#8D8D8D,thickness=2].> SigProjectDirty : <color:#8D8D8D>the sequence number is bumped, so every service that uses Sim is dirty. A stopped service is rebuilt right away; a running one keeps its old instances
SigMgmtEdits .[#8D8D8D,thickness=2].> SigMgmtRest : <color:#8D8D8D>the exclusive lock is released, then the result {name, config} is built from the copied text; 200 with the new document
SigHttpDispatch .[#8D8D8D,thickness=2].> SigMgmtGlue : <color:#8D8D8D>POST /services/test/restart arrives the same way
SigMgmtGlue .[#8D8D8D,thickness=2].> SigMgmtRest : <color:#8D8D8D>matched against POST /services/:name/restart
SigMgmtRest .[#8D8D8D,thickness=2].> SigMgmtActions : <color:#8D8D8D>sig_mgmt_restart_service holds none of the mgmt lock while the hooks run
SigMgmtActions .[#8D8D8D,thickness=2].> SigRuntimeControl : <color:#8D8D8D>sig_runtime_service_stop under the control mutex
SigRuntimeControl .[#8D8D8D,thickness=2].> SigServiceLifecycle : <color:#8D8D8D>sig_service_stop: the worker is joined first, then the stop hooks run on the calling thread
SigMgmtActions .[#8D8D8D,thickness=2].> SigProjectDirty : <color:#8D8D8D>prepare_service: still dirty and stopped, so under the exclusive lock and sig_runtime_edit, sig_project_refresh_service rebuilds the service from its stored definition text (memory, not a reload from disk)
SigMgmtActions .[#8D8D8D,thickness=2].> SigRuntimeControl : <color:#8D8D8D>sig_runtime_service_start_prebuilt (SIG_ERR_STALE would send it back to the rebuild, up to 8 times)
SigRuntimeControl .[#8D8D8D,thickness=2].> SigServiceLifecycle : <color:#8D8D8D>sig_service_start: start hooks on the calling thread, then the worker thread is spawned
SigMgmtActions .[#8D8D8D,thickness=2].> SigMgmtReads : <color:#8D8D8D>the {name, state} result is built under the shared lock and returned with 200; it carries no dirty flag
@enduml
`;case`persistence`:return`@startuml
title "Persistence"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SigPersistenceRegistry>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPersistenceStore>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPersistenceFile>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPersistenceAtomic>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "Persistence" <<SigPersistence>> as SigPersistence {
  skinparam RectangleBorderColor<<SigPersistence>> #3b82f6
  skinparam RectangleFontColor<<SigPersistence>> #3b82f6
  skinparam RectangleBorderStyle<<SigPersistence>> dashed

  rectangle "==Backend registry\\n<size:10>[sig_persistence_registry_*; sig_ht]</size>\\n\\nA name-to-backend table: register adds a backend under its name\\n(the backend must have one), lookup finds it again. The registry only\\nborrows the backend structs. Nothing in src/ or host/ uses it in this\\nrepository; the host passes the file backend directly. It is exercised\\nby the unit tests." <<SigPersistenceRegistry>> as SigPersistenceRegistry
  rectangle "==Store interface\\n<size:10>[sig_persistence_module, sig_persistence_create/load/save/remove/list]</size>\\n\\nA backend is a sig_persistence_module: a name, create and destroy, and\\nthe data hooks load, save, remove and list. sig_persistence_create\\nbinds a backend to a config string and keeps the state it returns; the\\ndata calls check their arguments and forward to the hook. A NULL\\nargument, or a backend with no such hook, is SIG_ERR_INVALID_ARG.\\nload returns a sig_alloc buffer that the caller frees and reports a\\nmissing key as SIG_ERR_NOT_FOUND; save creates or replaces the key and\\nonly borrows the data; remove reports a missing key as\\nSIG_ERR_NOT_FOUND; list calls back once per key and stops at the first\\nstatus other than SIG_OK. The callback must not save or remove keys in\\nthe namespace being listed." <<SigPersistenceStore>> as SigPersistenceStore
  rectangle "==File backend\\n<size:10>[sig_persistence_file_module ("file"); stdio, dirent, POSIX]</size>\\n\\nMaps a namespace to a directory under a base directory (its config\\nstring; NULL or empty is refused, and the directory is neither checked\\nnor created when the backend is created). A key lives at\\nbase/ns/key.cfg for the "configurations" and "services" namespaces and\\nat base/ns/key.sig for any other namespace. A namespace is 1 to 64\\ncharacters of letters, digits, underscore or hyphen. A key is 1 to 128\\nbytes with no slash, no two consecutive dots and no control character;\\nso "My Svc" and "v1.2" are valid. A name that breaks the rules is\\nSIG_ERR_INVALID_ARG before the filesystem is touched. load and remove\\nreport a missing file as SIG_ERR_NOT_FOUND; other filesystem failures\\nare SIG_ERR_PLATFORM. list returns the regular files with the\\nnamespace extension and a valid key as stem, extension stripped and\\nsorted bytewise; a missing namespace directory lists zero keys." <<SigPersistenceFile>> as SigPersistenceFile
  rectangle "==Atomic save\\n<size:10>[file_save in sig_persistence_file.c]</size>\\n\\nsave creates every missing directory down to base/ns (mode 0755, the\\nbase directory included), writes the data to key.ext.tmp in the\\nnamespace directory, flushes and fsyncs it, closes it and renames it\\nover key.ext. A reader or a crash sees the old file or the new one, not\\na half-written file. If the write or the rename fails, the temporary\\nfile is removed and the old content stays in place. The directory\\nitself is not fsynced." <<SigPersistenceAtomic>> as SigPersistenceAtomic
}

SigPersistenceStore .[#8D8D8D,thickness=2].> SigPersistenceFile : <color:#8D8D8D>forwards to the hooks of the backend it was created with (the file backend is the one the library ships)
SigPersistenceRegistry .[#8D8D8D,thickness=2].> SigPersistenceStore : <color:#8D8D8D>holds the sig_persistence_module structs that sig_persistence_create binds
SigPersistenceFile .[#8D8D8D,thickness=2].> SigPersistenceAtomic : <color:#8D8D8D>save writes through the temp file and rename
@enduml
`;case`persistence_components`:return`@startuml
title "Persistence components"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SigHost>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigProject>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPersistenceRegistry>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPersistenceStore>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPersistenceFile>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPersistenceAtomic>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFoundation>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "==Host\\n<size:10>[sig_host.h; CMake target sig::host and the sighost executable (SIG_HOST)]</size>\\n\\nThe program that runs a project. sig_host_run is the portable boot\\nsequence; host/posix supplies the command line, the shutdown trigger\\nand the choice of persistence backend. The host registers the runtime\\nmodules it is given and knows nothing about particular capsules,\\nruntime modules or signals; main.c is what selects them." <<SigHost>> as SigHost
rectangle "==Project\\n<size:10>[sig_project.h, sig_config.h; part of sig::sig]</size>\\n\\nA project is the capsule configurations and services loaded from a\\npersistence store and wired together. It owns the configurations,\\nservices and capsule instances it builds, keeps the JSON definition of\\neach, and writes every edit back to the store. Nothing is started by\\nloading. The store and the capsule registry are borrowed and must outlive\\nthe project." <<SigProject>> as SigProject
rectangle "Persistence" <<SigPersistence>> as SigPersistence {
  skinparam RectangleBorderColor<<SigPersistence>> #3b82f6
  skinparam RectangleFontColor<<SigPersistence>> #3b82f6
  skinparam RectangleBorderStyle<<SigPersistence>> dashed

  rectangle "==Backend registry\\n<size:10>[sig_persistence_registry_*; sig_ht]</size>\\n\\nA name-to-backend table: register adds a backend under its name\\n(the backend must have one), lookup finds it again. The registry only\\nborrows the backend structs. Nothing in src/ or host/ uses it in this\\nrepository; the host passes the file backend directly. It is exercised\\nby the unit tests." <<SigPersistenceRegistry>> as SigPersistenceRegistry
  rectangle "==Store interface\\n<size:10>[sig_persistence_module, sig_persistence_create/load/save/remove/list]</size>\\n\\nA backend is a sig_persistence_module: a name, create and destroy, and\\nthe data hooks load, save, remove and list. sig_persistence_create\\nbinds a backend to a config string and keeps the state it returns; the\\ndata calls check their arguments and forward to the hook. A NULL\\nargument, or a backend with no such hook, is SIG_ERR_INVALID_ARG.\\nload returns a sig_alloc buffer that the caller frees and reports a\\nmissing key as SIG_ERR_NOT_FOUND; save creates or replaces the key and\\nonly borrows the data; remove reports a missing key as\\nSIG_ERR_NOT_FOUND; list calls back once per key and stops at the first\\nstatus other than SIG_OK. The callback must not save or remove keys in\\nthe namespace being listed." <<SigPersistenceStore>> as SigPersistenceStore
  rectangle "==File backend\\n<size:10>[sig_persistence_file_module ("file"); stdio, dirent, POSIX]</size>\\n\\nMaps a namespace to a directory under a base directory (its config\\nstring; NULL or empty is refused, and the directory is neither checked\\nnor created when the backend is created). A key lives at\\nbase/ns/key.cfg for the "configurations" and "services" namespaces and\\nat base/ns/key.sig for any other namespace. A namespace is 1 to 64\\ncharacters of letters, digits, underscore or hyphen. A key is 1 to 128\\nbytes with no slash, no two consecutive dots and no control character;\\nso "My Svc" and "v1.2" are valid. A name that breaks the rules is\\nSIG_ERR_INVALID_ARG before the filesystem is touched. load and remove\\nreport a missing file as SIG_ERR_NOT_FOUND; other filesystem failures\\nare SIG_ERR_PLATFORM. list returns the regular files with the\\nnamespace extension and a valid key as stem, extension stripped and\\nsorted bytewise; a missing namespace directory lists zero keys." <<SigPersistenceFile>> as SigPersistenceFile
  rectangle "==Atomic save\\n<size:10>[file_save in sig_persistence_file.c]</size>\\n\\nsave creates every missing directory down to base/ns (mode 0755, the\\nbase directory included), writes the data to key.ext.tmp in the\\nnamespace directory, flushes and fsyncs it, closes it and renames it\\nover key.ext. A reader or a crash sees the old file or the new one, not\\na half-written file. If the write or the rename fails, the temporary\\nfile is removed and the old content stays in place. The directory\\nitself is not fsynced." <<SigPersistenceAtomic>> as SigPersistenceAtomic
}
rectangle "==Foundation\\n<size:10>[CMake target sig::sig (always built)]</size>\\n\\nAllocation, status codes, reference counting, hash table and list,\\nlogging, the sig_value data model, JSON, and the expression language.\\nPart of the sig::sig target and always built; it has no dependency on\\nthe optional modules. Its one dependency outside the module is\\nlogging, which takes a platform mutex (sig_thread.h)." <<SigFoundation>> as SigFoundation

SigHost .[#8D8D8D,thickness=2].> SigPersistenceStore : <color:#8D8D8D>sig_persistence_create opens the store; sig_persistence_destroy closes it last
SigHost .[#8D8D8D,thickness=2].> SigPersistenceFile : <color:#8D8D8D>passes sig_persistence_file_module and the project directory
SigProject .[#8D8D8D,thickness=2].> SigPersistenceStore : <color:#8D8D8D>[...]
SigPersistenceStore .[#8D8D8D,thickness=2].> SigPersistenceFile : <color:#8D8D8D>forwards to the hooks of the backend it was created with (the file backend is the one the library ships)
SigPersistenceRegistry .[#8D8D8D,thickness=2].> SigPersistenceStore : <color:#8D8D8D>holds the sig_persistence_module structs that sig_persistence_create binds
SigPersistenceFile .[#8D8D8D,thickness=2].> SigPersistenceAtomic : <color:#8D8D8D>save writes through the temp file and rename
SigPersistenceStore .[#8D8D8D,thickness=2].> SigFoundation : <color:#8D8D8D>[...]
SigPersistenceRegistry .[#8D8D8D,thickness=2].> SigFoundation : <color:#8D8D8D>backends kept in a sig_ht
SigPersistenceFile .[#8D8D8D,thickness=2].> SigFoundation : <color:#8D8D8D>paths, key lists and the loaded buffer
@enduml
`;case`platform`:return`@startuml
title "Platform"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SigPlatformThreads>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPlatformTime>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPlatformPoller>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPlatformNet>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "Platform" <<SigPlatform>> as SigPlatform {
  skinparam RectangleBorderColor<<SigPlatform>> #3b82f6
  skinparam RectangleFontColor<<SigPlatform>> #3b82f6
  skinparam RectangleBorderStyle<<SigPlatform>> dashed

  rectangle "==Threads and synchronization\\n<size:10>[sig_thread.h; POSIX threads]</size>\\n\\nThreads, mutexes, condition variables, thread-local storage, and\\nsig_rwlock (many readers or one writer, built on sig_mutex and\\nsig_condition; a waiting writer blocks new readers; not recursive). sig_condition_notify\\nwakes all waiters on every platform, which the rwlock relies on.\\nsig_condition_timedwait takes an absolute CLOCK_MONOTONIC deadline\\nand returns SIG_OK on both notify and timeout, so callers re-check\\ntheir own state. sig_mgmt uses sig_rwlock to guard its operations." <<SigPlatformThreads>> as SigPlatformThreads
  rectangle "==Time\\n<size:10>[sig_time.h; clock_gettime]</size>\\n\\nsig_time_now returns the monotonic clock (CLOCK_MONOTONIC) as a\\nstruct timespec, the clock sig_condition_timedwait deadlines are\\nmeasured on. A read of the system clock with no shared state, so it is\\nsafe from any thread." <<SigPlatformTime>> as SigPlatformTime
  rectangle "==Poller backends\\n<size:10>[sig_poller.h; poll, kqueue or epoll]</size>\\n\\nReadiness notification for file descriptors under sig_loop. Exactly one\\nbackend is linked, chosen at build time with -DSIG_POLLER=poll|kqueue|epoll\\n(default kqueue on Apple and BSD, poll elsewhere). Only POSIX backends\\nexist. Level-triggered. Only sig_poller_wake may be called from a\\nthread other than the one inside sig_poller_wait; add, modify and\\nremove are made by the waiting thread or before it starts. A closed fd\\nmust be removed first." <<SigPlatformPoller>> as SigPlatformPoller
  rectangle "==TCP sockets\\n<size:10>[sig_net.h; BSD sockets]</size>\\n\\nMinimal TCP server primitives: listen, accept, read and write, IPv4\\nonly, numeric addresses only. In the optional sig::net target (SIG_NET),\\nnot in sig::sig. Sockets are always non-blocking and every wait goes\\nthrough poll() with a caller-supplied timeout (a negative one waits\\nforever); a timeout of 0 turns accept and read into polls, so\\nthe descriptors can be registered with a sig_loop. Writes never raise\\nSIGPIPE. The header states no cross-thread rules for a listener or\\nconnection, so use each from one thread at a time." <<SigPlatformNet>> as SigPlatformNet
}

SigPlatformThreads .[#8D8D8D,thickness=2].> SigPlatformTime : <color:#8D8D8D>deadlines for timed waits
@enduml
`;case`platform_components`:return`@startuml
title "Platform components"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SigFeed>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFoundation>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHttp>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigMgmt>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntime>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigService>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPlatformThreads>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPlatformNet>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPlatformPoller>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPlatformTime>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "==Signal feed\\n<size:10>[sig_signal_feed.h; sig::signal_feed, SIG_SIGNAL_FEED]</size>\\n\\nStreams the signals crossing chosen capsule terminals to WebSocket\\nclients as JSON text frames, on the path "/feed" of the shared HTTP server.\\nA client names a service, instance and terminal and sees the signals from\\nthen on, with no history. The feed is unauthenticated: the only check is\\nthe Origin test the HTTP server makes. The runtime tap is the source of\\nthe data, and it is installed only while at least one subscription exists." <<SigFeed>> as SigFeed
rectangle "==Foundation\\n<size:10>[CMake target sig::sig (always built)]</size>\\n\\nAllocation, status codes, reference counting, hash table and list,\\nlogging, the sig_value data model, JSON, and the expression language.\\nPart of the sig::sig target and always built; it has no dependency on\\nthe optional modules. Its one dependency outside the module is\\nlogging, which takes a platform mutex (sig_thread.h)." <<SigFoundation>> as SigFoundation
rectangle "==HTTP\\n<size:10>[sig_http_server.h, sig_ws.h, sig_http_client.h; sig::http_server (SIG_HTTP_SERVER, needs SIG_NET) and sig::http_client (SIG_HTTP_CLIENT, libcurl)]</size>\\n\\nThe HTTP layer, in two independent parts. The server is one shared HTTP/1.1\\nserver per runtime, offered as a runtime module named http_server (build\\noptions SIG_NET and SIG_HTTP_SERVER); other modules register path prefixes\\non it. The client is a blocking and an asynchronous GET over libcurl (build\\noption SIG_HTTP_CLIENT). The server has no TLS and no authentication." <<SigHttp>> as SigHttp
rectangle "==Management\\n<size:10>[sig_mgmt.h, sig_mgmt_http.h; sig::mgmt (SIG_MGMT) and sig::mgmt_http (built when SIG_MGMT and SIG_HTTP_SERVER are both on)]</size>\\n\\nReads and controls a running runtime. The operations in sig::mgmt take and\\nreturn plain value trees and status codes and know nothing of any\\ntransport. The REST layer and the glue module in sig::mgmt_http map HTTP\\nonto them, on the shared HTTP server. Built when SIG_MGMT is ON; the HTTP\\npart is built when SIG_MGMT and SIG_HTTP_SERVER are both ON. There is no\\nauthentication anywhere in the area." <<SigMgmt>> as SigMgmt
rectangle "==Runtime\\n<size:10>[sig_runtime.h, sig_loop.h, sig_tap.h; part of sig::sig]</size>\\n\\nOwns one running system: the project loaded from the store, the runtime\\nmodules registered with it, and the lifecycle that starts and stops them.\\nThe runtime borrows the persistence store and the capsule registry it was\\ncreated with; both must outlive it. It can also be given an event loop,\\nwhich makes every service driven and the whole system single-threaded." <<SigRuntime>> as SigRuntime
rectangle "==Service\\n<size:10>[sig_service.h; part of sig::sig]</size>\\n\\nA service is a worker thread with a signal queue and a job scheduler,\\nowning a set of capsule instances by name (it borrows them; the project\\nowns them). Once a service is started, terminal handlers and lifecycle\\nhooks of its instances run on its own thread, except that start hooks run\\non the thread that called start and stop hooks on the thread that called\\nstop. A service can instead be driven by an event loop, with no thread of\\nits own." <<SigService>> as SigService
rectangle "Platform" <<SigPlatform>> as SigPlatform {
  skinparam RectangleBorderColor<<SigPlatform>> #3b82f6
  skinparam RectangleFontColor<<SigPlatform>> #3b82f6
  skinparam RectangleBorderStyle<<SigPlatform>> dashed

  rectangle "==Threads and synchronization\\n<size:10>[sig_thread.h; POSIX threads]</size>\\n\\nThreads, mutexes, condition variables, thread-local storage, and\\nsig_rwlock (many readers or one writer, built on sig_mutex and\\nsig_condition; a waiting writer blocks new readers; not recursive). sig_condition_notify\\nwakes all waiters on every platform, which the rwlock relies on.\\nsig_condition_timedwait takes an absolute CLOCK_MONOTONIC deadline\\nand returns SIG_OK on both notify and timeout, so callers re-check\\ntheir own state. sig_mgmt uses sig_rwlock to guard its operations." <<SigPlatformThreads>> as SigPlatformThreads
  rectangle "==TCP sockets\\n<size:10>[sig_net.h; BSD sockets]</size>\\n\\nMinimal TCP server primitives: listen, accept, read and write, IPv4\\nonly, numeric addresses only. In the optional sig::net target (SIG_NET),\\nnot in sig::sig. Sockets are always non-blocking and every wait goes\\nthrough poll() with a caller-supplied timeout (a negative one waits\\nforever); a timeout of 0 turns accept and read into polls, so\\nthe descriptors can be registered with a sig_loop. Writes never raise\\nSIGPIPE. The header states no cross-thread rules for a listener or\\nconnection, so use each from one thread at a time." <<SigPlatformNet>> as SigPlatformNet
  rectangle "==Poller backends\\n<size:10>[sig_poller.h; poll, kqueue or epoll]</size>\\n\\nReadiness notification for file descriptors under sig_loop. Exactly one\\nbackend is linked, chosen at build time with -DSIG_POLLER=poll|kqueue|epoll\\n(default kqueue on Apple and BSD, poll elsewhere). Only POSIX backends\\nexist. Level-triggered. Only sig_poller_wake may be called from a\\nthread other than the one inside sig_poller_wait; add, modify and\\nremove are made by the waiting thread or before it starts. A closed fd\\nmust be removed first." <<SigPlatformPoller>> as SigPlatformPoller
  rectangle "==Time\\n<size:10>[sig_time.h; clock_gettime]</size>\\n\\nsig_time_now returns the monotonic clock (CLOCK_MONOTONIC) as a\\nstruct timespec, the clock sig_condition_timedwait deadlines are\\nmeasured on. A read of the system clock with no shared state, so it is\\nsafe from any thread." <<SigPlatformTime>> as SigPlatformTime
}

SigFeed .[#8D8D8D,thickness=2].> SigPlatformThreads : <color:#8D8D8D>[...]
SigFeed .[#8D8D8D,thickness=2].> SigPlatformTime : <color:#8D8D8D>millisecond clock for the liveness deadlines
SigFeed .[#8D8D8D,thickness=2].> SigPlatformNet : <color:#8D8D8D>[...]
SigFoundation .[#8D8D8D,thickness=2].> SigPlatformThreads : <color:#8D8D8D>serializes writes with a sig_mutex
SigHttp .[#8D8D8D,thickness=2].> SigPlatformThreads : <color:#8D8D8D>sig_thread_create and sig_thread_join for the server thread
SigHttp .[#8D8D8D,thickness=2].> SigPlatformTime : <color:#8D8D8D>[...]
SigHttp .[#8D8D8D,thickness=2].> SigPlatformPoller : <color:#8D8D8D>SIG_POLL_READ and SIG_POLL_WRITE event masks for its watches
SigHttp .[#8D8D8D,thickness=2].> SigPlatformNet : <color:#8D8D8D>[...]
SigMgmt .[#8D8D8D,thickness=2].> SigPlatformThreads : <color:#8D8D8D>[...]
SigMgmt .[#8D8D8D,thickness=2].> SigPlatformTime : <color:#8D8D8D>sig_time_now for the start time
SigRuntime .[#8D8D8D,thickness=2].> SigPlatformThreads : <color:#8D8D8D>control mutex, shutdown mutex and condition
SigRuntime .[#8D8D8D,thickness=2].> SigPlatformTime : <color:#8D8D8D>[...]
SigRuntime .[#8D8D8D,thickness=2].> SigPlatformPoller : <color:#8D8D8D>sleeps in sig_poller_wait; wakes with sig_poller_wake
SigService .[#8D8D8D,thickness=2].> SigPlatformThreads : <color:#8D8D8D>[...]
SigService .[#8D8D8D,thickness=2].> SigPlatformTime : <color:#8D8D8D>sig_time_now for the next fire time
SigPlatformThreads .[#8D8D8D,thickness=2].> SigPlatformTime : <color:#8D8D8D>deadlines for timed waits
SigPlatformPoller .[#8D8D8D,thickness=2].> SigFoundation : <color:#8D8D8D>allocates the poller state
SigPlatformNet .[#8D8D8D,thickness=2].> SigFoundation : <color:#8D8D8D>[...]
@enduml
`;case`project`:return`@startuml
title "Project"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SigProjectLoader>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigProjectOwnership>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigProjectIntrospection>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigProjectEditing>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigProjectDirty>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigProjectParser>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "Project" <<SigProject>> as SigProject {
  skinparam RectangleBorderColor<<SigProject>> #3b82f6
  skinparam RectangleFontColor<<SigProject>> #3b82f6
  skinparam RectangleBorderStyle<<SigProject>> dashed

  rectangle "==Project load\\n<size:10>[sig_project_load]</size>\\n\\nReads every key of the "configurations" namespace and then every key of\\nthe "services" namespace of the store, so services can resolve their\\nconfigurations. A namespace the store does not have is empty, not an\\nerror; a key that vanishes between listing and loading is skipped; any\\nother failure to list or load is SIG_ERR_PLATFORM, and a document that\\ndoes not validate is SIG_ERR_PARSE or SIG_ERR_NOT_FOUND. On any failure\\neverything built so far is torn down and no partial project is returned.\\nNothing is started by this call." <<SigProjectLoader>> as SigProjectLoader
  rectangle "==Ownership and auto-start\\n<size:10>[sig_project_destroy/start_auto/stop_all]</size>\\n\\nThe project owns its capsule configurations, its services, and the\\ncapsule instances (kept in an owned list per service; services do not\\nown their instances). sig_project_destroy stops each service, destroys\\nits instances, destroys the service, and finally destroys the\\nconfigurations (replaced or deleted ones are kept on a retired list until\\nthen, because a running service may still borrow them). start_auto starts\\nevery service flagged auto_start, and stop_all stops every service;\\nboth are best-effort across services: one failure does not stop the\\nothers, and the last failure is returned." <<SigProjectOwnership>> as SigProjectOwnership
  rectangle "==Walk and introspection\\n<size:10>[sig_project_walk_*, get_*]</size>\\n\\nLookup of a service or a configuration by name, counting and walking\\nservices and configurations, the services that use a configuration, and\\nthe stored JSON of a definition. The header states that walking is\\nread-only and safe from any thread once the project is loaded, and that a\\nsig_service handed to a callback stays valid until the project is\\ndestroyed; order is unspecified. Caution: the editing functions can\\nreplace and remove services later, and sig_runtime_edit does not exclude\\nreaders that go through sig_mgmt." <<SigProjectIntrospection>> as SigProjectIntrospection
  rectangle "==Editing\\n<size:10>[sig_project_put_/patch_/delete_/rename_*]</size>\\n\\nCreates, replaces, patches (JSON merge patch), deletes and renames\\nconfigurations and services, saving each document to the store under its\\nname followed by one newline. Names must match [A-Za-z0-9_-]{1,64}. A\\ndocument is validated exactly as load would, and a configuration also\\nagainst the property table of its capsule; on any failure nothing is\\nsaved and nothing changes, and sig_project_last_error gives the reason.\\nReplacing or patching a service, and any configuration edit, leaves a\\nrunning service running (it only becomes dirty); deleting a\\nconfiguration that a service definition uses is refused with\\nSIG_ERR_EXISTS. Deleting a service stops and destroys it, even if\\nit is running. Not thread-safe on its\\nown: callers serialize edits with each other and with service start and\\nstop, which sig_runtime_edit does." <<SigProjectEditing>> as SigProjectEditing
  rectangle "==Dirty tracking\\n<size:10>[sig_project_service_dirty/refresh_service]</size>\\n\\nEvery edit bumps a sequence number. A service is dirty when its\\ndefinition, or the definition of a configuration it uses, changed after\\nthe live service was built. A stopped service is rebuilt immediately\\nafter an edit; a running one keeps its old instances and is reported\\ndirty until it is stopped and refreshed, so an edit cannot half-apply.\\nsig_project_refresh_service rebuilds a stopped, dirty service and\\ninvalidates earlier pointers to it; a running service is left alone." <<SigProjectDirty>> as SigProjectDirty
  rectangle "==Config parser\\n<size:10>[sig_config.h; sig_value JSON; private functions]</size>\\n\\nTurns one .cfg JSON document into live objects. A capsule configuration\\ndocument names its capsule in "type" (looked up in the registry) and may\\ncarry an "attr_value" object whose values must be int, bool, double or\\nstring. A service document has an optional boolean "auto_start" and an\\n"execution" array whose entries each name a capsule configuration; the\\ninstance takes that name. It works in two passes, so a receiver may name\\nan entry listed later: first every entry is instantiated and added to the\\nservice, then every "receivers" object (output terminal to a list of\\nname and input) is wired with sig_capsule_instance_connect. On failure\\nnothing is left allocated. The functions in sig_config.h are SIG_PRIVATE,\\nso this component has no public functions." <<SigProjectParser>> as SigProjectParser
}

SigProjectLoader .[#8D8D8D,thickness=2].> SigProjectParser : <color:#8D8D8D>parses each stored document: configurations first, then services
SigProjectEditing .[#8D8D8D,thickness=2].> SigProjectParser : <color:#8D8D8D>validates a new document exactly as load does
SigProjectDirty .[#8D8D8D,thickness=2].> SigProjectParser : <color:#8D8D8D>rebuilds a stopped service from its definition
SigProjectEditing .[#8D8D8D,thickness=2].> SigProjectDirty : <color:#8D8D8D>rebuilds stopped services after every edit
@enduml
`;case`project_components`:return`@startuml
title "Project components"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SigMgmt>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntime>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigProjectIntrospection>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigProjectEditing>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigProjectLoader>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigProjectOwnership>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigProjectDirty>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPersistence>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigProjectParser>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigCapsules>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFoundation>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigService>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "==Management\\n<size:10>[sig_mgmt.h, sig_mgmt_http.h; sig::mgmt (SIG_MGMT) and sig::mgmt_http (built when SIG_MGMT and SIG_HTTP_SERVER are both on)]</size>\\n\\nReads and controls a running runtime. The operations in sig::mgmt take and\\nreturn plain value trees and status codes and know nothing of any\\ntransport. The REST layer and the glue module in sig::mgmt_http map HTTP\\nonto them, on the shared HTTP server. Built when SIG_MGMT is ON; the HTTP\\npart is built when SIG_MGMT and SIG_HTTP_SERVER are both ON. There is no\\nauthentication anywhere in the area." <<SigMgmt>> as SigMgmt
rectangle "==Runtime\\n<size:10>[sig_runtime.h, sig_loop.h, sig_tap.h; part of sig::sig]</size>\\n\\nOwns one running system: the project loaded from the store, the runtime\\nmodules registered with it, and the lifecycle that starts and stops them.\\nThe runtime borrows the persistence store and the capsule registry it was\\ncreated with; both must outlive it. It can also be given an event loop,\\nwhich makes every service driven and the whole system single-threaded." <<SigRuntime>> as SigRuntime
rectangle "Project" <<SigProject>> as SigProject {
  skinparam RectangleBorderColor<<SigProject>> #3b82f6
  skinparam RectangleFontColor<<SigProject>> #3b82f6
  skinparam RectangleBorderStyle<<SigProject>> dashed

  rectangle "==Walk and introspection\\n<size:10>[sig_project_walk_*, get_*]</size>\\n\\nLookup of a service or a configuration by name, counting and walking\\nservices and configurations, the services that use a configuration, and\\nthe stored JSON of a definition. The header states that walking is\\nread-only and safe from any thread once the project is loaded, and that a\\nsig_service handed to a callback stays valid until the project is\\ndestroyed; order is unspecified. Caution: the editing functions can\\nreplace and remove services later, and sig_runtime_edit does not exclude\\nreaders that go through sig_mgmt." <<SigProjectIntrospection>> as SigProjectIntrospection
  rectangle "==Editing\\n<size:10>[sig_project_put_/patch_/delete_/rename_*]</size>\\n\\nCreates, replaces, patches (JSON merge patch), deletes and renames\\nconfigurations and services, saving each document to the store under its\\nname followed by one newline. Names must match [A-Za-z0-9_-]{1,64}. A\\ndocument is validated exactly as load would, and a configuration also\\nagainst the property table of its capsule; on any failure nothing is\\nsaved and nothing changes, and sig_project_last_error gives the reason.\\nReplacing or patching a service, and any configuration edit, leaves a\\nrunning service running (it only becomes dirty); deleting a\\nconfiguration that a service definition uses is refused with\\nSIG_ERR_EXISTS. Deleting a service stops and destroys it, even if\\nit is running. Not thread-safe on its\\nown: callers serialize edits with each other and with service start and\\nstop, which sig_runtime_edit does." <<SigProjectEditing>> as SigProjectEditing
  rectangle "==Project load\\n<size:10>[sig_project_load]</size>\\n\\nReads every key of the "configurations" namespace and then every key of\\nthe "services" namespace of the store, so services can resolve their\\nconfigurations. A namespace the store does not have is empty, not an\\nerror; a key that vanishes between listing and loading is skipped; any\\nother failure to list or load is SIG_ERR_PLATFORM, and a document that\\ndoes not validate is SIG_ERR_PARSE or SIG_ERR_NOT_FOUND. On any failure\\neverything built so far is torn down and no partial project is returned.\\nNothing is started by this call." <<SigProjectLoader>> as SigProjectLoader
  rectangle "==Ownership and auto-start\\n<size:10>[sig_project_destroy/start_auto/stop_all]</size>\\n\\nThe project owns its capsule configurations, its services, and the\\ncapsule instances (kept in an owned list per service; services do not\\nown their instances). sig_project_destroy stops each service, destroys\\nits instances, destroys the service, and finally destroys the\\nconfigurations (replaced or deleted ones are kept on a retired list until\\nthen, because a running service may still borrow them). start_auto starts\\nevery service flagged auto_start, and stop_all stops every service;\\nboth are best-effort across services: one failure does not stop the\\nothers, and the last failure is returned." <<SigProjectOwnership>> as SigProjectOwnership
  rectangle "==Dirty tracking\\n<size:10>[sig_project_service_dirty/refresh_service]</size>\\n\\nEvery edit bumps a sequence number. A service is dirty when its\\ndefinition, or the definition of a configuration it uses, changed after\\nthe live service was built. A stopped service is rebuilt immediately\\nafter an edit; a running one keeps its old instances and is reported\\ndirty until it is stopped and refreshed, so an edit cannot half-apply.\\nsig_project_refresh_service rebuilds a stopped, dirty service and\\ninvalidates earlier pointers to it; a running service is left alone." <<SigProjectDirty>> as SigProjectDirty
  rectangle "==Config parser\\n<size:10>[sig_config.h; sig_value JSON; private functions]</size>\\n\\nTurns one .cfg JSON document into live objects. A capsule configuration\\ndocument names its capsule in "type" (looked up in the registry) and may\\ncarry an "attr_value" object whose values must be int, bool, double or\\nstring. A service document has an optional boolean "auto_start" and an\\n"execution" array whose entries each name a capsule configuration; the\\ninstance takes that name. It works in two passes, so a receiver may name\\nan entry listed later: first every entry is instantiated and added to the\\nservice, then every "receivers" object (output terminal to a list of\\nname and input) is wired with sig_capsule_instance_connect. On failure\\nnothing is left allocated. The functions in sig_config.h are SIG_PRIVATE,\\nso this component has no public functions." <<SigProjectParser>> as SigProjectParser
}
rectangle "==Persistence\\n<size:10>[sig_persistence.h, sig_persistence_file.h; part of sig::sig]</size>\\n\\nA pluggable store of opaque blobs under a (namespace, key) pair. What a\\nnamespace means, and which names are valid, is up to the backend. The\\nlibrary ships one backend, the file backend. The project reads and writes\\nits configuration and service documents through it. The hooks block, so\\nthey are meant for configuration input and output, not for an event\\nloop hot path." <<SigPersistence>> as SigPersistence
rectangle "==Capsules\\n<size:10>[sig_capsule.h; part of sig::sig, with the shim in capsules/ (target sig_builtin_capsules, SIG_HOST)]</size>\\n\\nThree layers in a 1 : n : n relationship. A capsule is compiled-in static\\ncode; a capsule configuration is a named configuration of one capsule\\n(a capsule plus properties), available to any service in the project;\\na capsule instance is one configuration used by one service, with its\\nown storage, state and routes. This is what runs. An instance takes the\\nname of its configuration, so a configuration appears at most once per\\nservice." <<SigCapsules>> as SigCapsules
rectangle "==Foundation\\n<size:10>[CMake target sig::sig (always built)]</size>\\n\\nAllocation, status codes, reference counting, hash table and list,\\nlogging, the sig_value data model, JSON, and the expression language.\\nPart of the sig::sig target and always built; it has no dependency on\\nthe optional modules. Its one dependency outside the module is\\nlogging, which takes a platform mutex (sig_thread.h)." <<SigFoundation>> as SigFoundation
rectangle "==Service\\n<size:10>[sig_service.h; part of sig::sig]</size>\\n\\nA service is a worker thread with a signal queue and a job scheduler,\\nowning a set of capsule instances by name (it borrows them; the project\\nowns them). Once a service is started, terminal handlers and lifecycle\\nhooks of its instances run on its own thread, except that start hooks run\\non the thread that called start and stop hooks on the thread that called\\nstop. A service can instead be driven by an event loop, with no thread of\\nits own." <<SigService>> as SigService

SigMgmt .[#8D8D8D,thickness=2].> SigProjectIntrospection : <color:#8D8D8D>walks and looks up services and configurations, and copies their stored definitions
SigMgmt .[#8D8D8D,thickness=2].> SigProjectEditing : <color:#8D8D8D>sig_project_put/patch/delete_* and rename_configuration
SigMgmt .[#8D8D8D,thickness=2].> SigProjectDirty : <color:#8D8D8D>[...]
SigRuntime .[#8D8D8D,thickness=2].> SigProjectLoader : <color:#8D8D8D>sig_project_load at start
SigRuntime .[#8D8D8D,thickness=2].> SigProjectOwnership : <color:#8D8D8D>auto-start at start, stop_all and destroy at stop
SigRuntime .[#8D8D8D,thickness=2].> SigProjectIntrospection : <color:#8D8D8D>[...]
SigRuntime .[#8D8D8D,thickness=2].> SigProjectDirty : <color:#8D8D8D>start and restart rebuild a stale stopped service
SigProjectLoader .[#8D8D8D,thickness=2].> SigProjectParser : <color:#8D8D8D>parses each stored document: configurations first, then services
SigProjectEditing .[#8D8D8D,thickness=2].> SigProjectParser : <color:#8D8D8D>validates a new document exactly as load does
SigProjectDirty .[#8D8D8D,thickness=2].> SigProjectParser : <color:#8D8D8D>rebuilds a stopped service from its definition
SigProjectEditing .[#8D8D8D,thickness=2].> SigProjectDirty : <color:#8D8D8D>rebuilds stopped services after every edit
SigProjectParser .[#8D8D8D,thickness=2].> SigCapsules : <color:#8D8D8D>[...]
SigProjectParser .[#8D8D8D,thickness=2].> SigFoundation : <color:#8D8D8D>sig_value_from_json parses the document
SigProjectParser .[#8D8D8D,thickness=2].> SigService : <color:#8D8D8D>[...]
SigProjectLoader .[#8D8D8D,thickness=2].> SigFoundation : <color:#8D8D8D>[...]
SigProjectLoader .[#8D8D8D,thickness=2].> SigPersistence : <color:#8D8D8D>sig_persistence_list and sig_persistence_load on the configurations namespace, then the services namespace
SigProjectOwnership .[#8D8D8D,thickness=2].> SigCapsules : <color:#8D8D8D>[...]
SigProjectOwnership .[#8D8D8D,thickness=2].> SigService : <color:#8D8D8D>[...]
SigProjectEditing .[#8D8D8D,thickness=2].> SigCapsules : <color:#8D8D8D>validates properties against the capsule table
SigProjectEditing .[#8D8D8D,thickness=2].> SigFoundation : <color:#8D8D8D>merge patch and renaming work on parsed JSON
SigProjectEditing .[#8D8D8D,thickness=2].> SigPersistence : <color:#8D8D8D>sig_persistence_save of the edited document (plus a newline) and sig_persistence_remove on delete
@enduml
`;case`overview`:return`@startuml
title "Modules"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SigHost>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFoundation>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFeed>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigMgmt>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPlatform>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntime>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigProject>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigCapsules>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPersistence>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHttp>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigService>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "==Host\\n<size:10>[sig_host.h; CMake target sig::host and the sighost executable (SIG_HOST)]</size>\\n\\nThe program that runs a project. sig_host_run is the portable boot\\nsequence; host/posix supplies the command line, the shutdown trigger\\nand the choice of persistence backend. The host registers the runtime\\nmodules it is given and knows nothing about particular capsules,\\nruntime modules or signals; main.c is what selects them." <<SigHost>> as SigHost
rectangle "==Foundation\\n<size:10>[CMake target sig::sig (always built)]</size>\\n\\nAllocation, status codes, reference counting, hash table and list,\\nlogging, the sig_value data model, JSON, and the expression language.\\nPart of the sig::sig target and always built; it has no dependency on\\nthe optional modules. Its one dependency outside the module is\\nlogging, which takes a platform mutex (sig_thread.h)." <<SigFoundation>> as SigFoundation
rectangle "==Signal feed\\n<size:10>[sig_signal_feed.h; sig::signal_feed, SIG_SIGNAL_FEED]</size>\\n\\nStreams the signals crossing chosen capsule terminals to WebSocket\\nclients as JSON text frames, on the path "/feed" of the shared HTTP server.\\nA client names a service, instance and terminal and sees the signals from\\nthen on, with no history. The feed is unauthenticated: the only check is\\nthe Origin test the HTTP server makes. The runtime tap is the source of\\nthe data, and it is installed only while at least one subscription exists." <<SigFeed>> as SigFeed
rectangle "==Management\\n<size:10>[sig_mgmt.h, sig_mgmt_http.h; sig::mgmt (SIG_MGMT) and sig::mgmt_http (built when SIG_MGMT and SIG_HTTP_SERVER are both on)]</size>\\n\\nReads and controls a running runtime. The operations in sig::mgmt take and\\nreturn plain value trees and status codes and know nothing of any\\ntransport. The REST layer and the glue module in sig::mgmt_http map HTTP\\nonto them, on the shared HTTP server. Built when SIG_MGMT is ON; the HTTP\\npart is built when SIG_MGMT and SIG_HTTP_SERVER are both ON. There is no\\nauthentication anywhere in the area." <<SigMgmt>> as SigMgmt
rectangle "==Platform\\n<size:10>[CMake targets sig::sig (threads, time, poller) and sig::net (TCP, SIG_NET)]</size>\\n\\nEverything OS-specific, behind headers. Threads, time and the poller are\\npart of sig::sig and always built; the TCP layer is the optional sig::net\\ntarget, built with -DSIG_NET=ON. Only POSIX implementations exist today\\n(src/platform/posix and src/net/sig_net_posix.c); the rest of libsig\\ndoes not include OS headers. A port to another system replaces these\\nfiles and nothing above them." <<SigPlatform>> as SigPlatform
rectangle "==Runtime\\n<size:10>[sig_runtime.h, sig_loop.h, sig_tap.h; part of sig::sig]</size>\\n\\nOwns one running system: the project loaded from the store, the runtime\\nmodules registered with it, and the lifecycle that starts and stops them.\\nThe runtime borrows the persistence store and the capsule registry it was\\ncreated with; both must outlive it. It can also be given an event loop,\\nwhich makes every service driven and the whole system single-threaded." <<SigRuntime>> as SigRuntime
rectangle "==Project\\n<size:10>[sig_project.h, sig_config.h; part of sig::sig]</size>\\n\\nA project is the capsule configurations and services loaded from a\\npersistence store and wired together. It owns the configurations,\\nservices and capsule instances it builds, keeps the JSON definition of\\neach, and writes every edit back to the store. Nothing is started by\\nloading. The store and the capsule registry are borrowed and must outlive\\nthe project." <<SigProject>> as SigProject
rectangle "==Capsules\\n<size:10>[sig_capsule.h; part of sig::sig, with the shim in capsules/ (target sig_builtin_capsules, SIG_HOST)]</size>\\n\\nThree layers in a 1 : n : n relationship. A capsule is compiled-in static\\ncode; a capsule configuration is a named configuration of one capsule\\n(a capsule plus properties), available to any service in the project;\\na capsule instance is one configuration used by one service, with its\\nown storage, state and routes. This is what runs. An instance takes the\\nname of its configuration, so a configuration appears at most once per\\nservice." <<SigCapsules>> as SigCapsules
rectangle "==Persistence\\n<size:10>[sig_persistence.h, sig_persistence_file.h; part of sig::sig]</size>\\n\\nA pluggable store of opaque blobs under a (namespace, key) pair. What a\\nnamespace means, and which names are valid, is up to the backend. The\\nlibrary ships one backend, the file backend. The project reads and writes\\nits configuration and service documents through it. The hooks block, so\\nthey are meant for configuration input and output, not for an event\\nloop hot path." <<SigPersistence>> as SigPersistence
rectangle "==HTTP\\n<size:10>[sig_http_server.h, sig_ws.h, sig_http_client.h; sig::http_server (SIG_HTTP_SERVER, needs SIG_NET) and sig::http_client (SIG_HTTP_CLIENT, libcurl)]</size>\\n\\nThe HTTP layer, in two independent parts. The server is one shared HTTP/1.1\\nserver per runtime, offered as a runtime module named http_server (build\\noptions SIG_NET and SIG_HTTP_SERVER); other modules register path prefixes\\non it. The client is a blocking and an asynchronous GET over libcurl (build\\noption SIG_HTTP_CLIENT). The server has no TLS and no authentication." <<SigHttp>> as SigHttp
rectangle "==Service\\n<size:10>[sig_service.h; part of sig::sig]</size>\\n\\nA service is a worker thread with a signal queue and a job scheduler,\\nowning a set of capsule instances by name (it borrows them; the project\\nowns them). Once a service is started, terminal handlers and lifecycle\\nhooks of its instances run on its own thread, except that start hooks run\\non the thread that called start and stop hooks on the thread that called\\nstop. A service can instead be driven by an event loop, with no thread of\\nits own." <<SigService>> as SigService

SigCapsules .[#AC4D39,thickness=2].> SigHttp : <color:#AC4D39>upward, weather capsule only: sig_http_get_async (SIG_CAPSULES and SIG_HTTP_CLIENT)
SigCapsules .[#AC4D39,thickness=2].> SigService : <color:#AC4D39>upward: enqueues signals, schedules jobs
SigHost .[#8D8D8D,thickness=2].> SigCapsules : <color:#8D8D8D>creates the registry and fills it with the built-ins
SigMgmt .[#8D8D8D,thickness=2].> SigCapsules : <color:#8D8D8D>registry, instances, routes
SigProject .[#8D8D8D,thickness=2].> SigCapsules : <color:#8D8D8D>builds configurations and instances from the registry
SigRuntime .[#8D8D8D,thickness=2].> SigCapsules : <color:#8D8D8D>borrows the capsule registry
SigService .[#8D8D8D,thickness=2].> SigCapsules : <color:#8D8D8D>runs instance hooks and terminal handlers
SigFeed .[#8D8D8D,thickness=2].> SigHttp : <color:#8D8D8D>WebSocket upgrade on the server
SigFeed .[#8D8D8D,thickness=2].> SigRuntime : <color:#8D8D8D>runtime module; tap and terminal lookup
SigFeed .[#8D8D8D,thickness=2].> SigService : <color:#8D8D8D>service name of a tapped signal
SigHost .[#8D8D8D,thickness=2].> SigFeed : <color:#8D8D8D>registers the feed (with -m, when built)
SigHttp .[#8D8D8D,thickness=2].> SigFeed : <color:#8D8D8D>[...]
SigService .[#8D8D8D,thickness=2].> SigFeed : <color:#8D8D8D>calls the installed function on the emitting thread (the feed is the only user of sig_runtime_set_tap in this repository)
SigFoundation .[#AC4D39,thickness=2].> SigPlatform : <color:#AC4D39>upward: the log mutex
SigHost .[#8D8D8D,thickness=2].> SigHttp : <color:#8D8D8D>registers the server (with -m)
SigHost .[#8D8D8D,thickness=2].> SigMgmt : <color:#8D8D8D>registers management and its glue (with -m)
SigHost .[#8D8D8D,thickness=2].> SigPersistence : <color:#8D8D8D>opens the store
SigHost .[#8D8D8D,thickness=2].> SigRuntime : <color:#8D8D8D>creates, starts and stops the runtime; registers modules
SigHttp .[#8D8D8D,thickness=2].> SigMgmt : <color:#8D8D8D>runs the handler registered for the longest matching prefix, '/' here
SigHttp .[#8D8D8D,thickness=2].> SigRuntime : <color:#8D8D8D>runtime module; uses the loop of the runtime
SigMgmt .[#8D8D8D,thickness=2].> SigHttp : <color:#8D8D8D>the glue registers the REST handler on the server
SigMgmt .[#8D8D8D,thickness=2].> SigProject : <color:#8D8D8D>reads and edits through the runtime
SigMgmt .[#8D8D8D,thickness=2].> SigRuntime : <color:#8D8D8D>service control, edits, shutdown
SigMgmt .[#8D8D8D,thickness=2].> SigService : <color:#8D8D8D>service and instance state
SigProject .[#8D8D8D,thickness=2].> SigPersistence : <color:#8D8D8D>loads and saves the stored documents
SigRuntime .[#8D8D8D,thickness=2].> SigPersistence : <color:#8D8D8D>borrows the store
SigProject .[#8D8D8D,thickness=2].> SigService : <color:#8D8D8D>creates services and adds instances
SigRuntime .[#8D8D8D,thickness=2].> SigProject : <color:#8D8D8D>loads, owns and edits the project
SigRuntime .[#8D8D8D,thickness=2].> SigService : <color:#8D8D8D>starts and stops services, sets driven mode and the tap
SigService .[#AC4D39,thickness=2].> SigRuntime : <color:#AC4D39>upward: the tap type, from sig_tap.h
@enduml
`;case`runtime`:return`@startuml
title "Runtime"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SigRuntimeLifecycle>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntimeControl>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntimeStepping>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntimeShutdown>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntimeModules>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntimeTap>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntimeLoop>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "Runtime" <<SigRuntime>> as SigRuntime {
  skinparam RectangleBorderColor<<SigRuntime>> #3b82f6
  skinparam RectangleFontColor<<SigRuntime>> #3b82f6
  skinparam RectangleBorderStyle<<SigRuntime>> dashed

  rectangle "==Lifecycle state machine\\n<size:10>[sig_runtime_create/start/stop; sig_runtime.c]</size>\\n\\nStates are CREATED, STARTING, RUNNING, STOPPING, back to CREATED, and a\\nstopped runtime may be started again. sig_runtime_start loads the\\nproject from the store, creates every module, starts every module,\\nputs each service in the execution mode of the runtime, then starts the\\nservices flagged auto_start; a failure of an auto-start service is\\nlogged but does not fail the call. If loading or any module step fails,\\nthe modules are torn down in reverse, the project is destroyed and the\\nstate returns to CREATED. sig_runtime_stop is a no-op in CREATED,\\nSIG_ERR_STATE while STARTING or STOPPING, and otherwise stops all\\nservices, clears the tap, stops then destroys every module in reverse,\\nand destroys the project." <<SigRuntimeLifecycle>> as SigRuntimeLifecycle
  rectangle "==Control mutex (edit lock)\\n<size:10>[sig_runtime_edit, sig_runtime_service_*; one sig_mutex]</size>\\n\\nOne control mutex (the service-control lock in the header) guards the\\nstate and serializes sig_runtime_service_start, stop, restart and\\nstart_prebuilt, sig_runtime_edit, sig_runtime_find_terminal and\\nsig_runtime_dump_info. The service calls, edit and find_terminal return SIG_ERR_STATE\\nunless the runtime is RUNNING (start_prebuilt returns SIG_ERR_STALE for\\na stopped service whose definition changed); uptime returns 0.0 and\\ndump_info reports a partial snapshot when not RUNNING. sig_runtime_edit runs a caller function on the\\nproject under that lock and is the only safe way to call the\\nsig_project editing functions while running. The mutex is held across\\nservice start and stop, which join worker threads. Rule: never call\\nsig_runtime_service_*, sig_runtime_uptime_seconds or\\nsig_runtime_dump_info from a service or capsule thread, because the\\nthread being joined may be the caller and the call deadlocks. Call\\nthem from module, transport or host threads only." <<SigRuntimeControl>> as SigRuntimeControl
  rectangle "==Driven mode and stepping\\n<size:10>[sig_runtime_set_loop, sig_runtime_step]</size>\\n\\nsig_runtime_set_loop gives the runtime a loop (CREATED only, else\\nSIG_ERR_STATE). From then on every service is driven: it gets no worker\\nthread and a wake callback that wakes the loop. The host loop calls\\nsig_runtime_step, which steps every running driven service once while\\nholding the control mutex and reports the earliest next deadline.\\nHandlers, jobs and management requests then all run on the loop thread,\\nso the rule that an instance belongs to one thread still holds. Runtime\\nmodules find the loop with sig_runtime_loop and must remove their own\\nfds and timers in stop." <<SigRuntimeStepping>> as SigRuntimeStepping
  rectangle "==Shutdown request\\n<size:10>[sig_runtime_request_shutdown/wait; sig_runtime.c]</size>\\n\\nsig_runtime_request_shutdown records the request under a mutex and\\nsignals a condition variable, from any thread; it only records, and it\\nis NOT async-signal-safe, so a host blocks the signals and calls it\\nfrom a dedicated sigwait() thread. sig_runtime_wait blocks until the\\nrequest has been made since the last start; sig_runtime_shutdown_requested\\nis the non-blocking form. sig_runtime_start clears an earlier request.\\nWith a loop set, a request also wakes the loop." <<SigRuntimeShutdown>> as SigRuntimeShutdown
  rectangle "==Runtime module registry\\n<size:10>[sig_runtime_module; sig_runtime.c]</size>\\n\\nA runtime module is a name plus optional create, start, stop and destroy\\nhooks, run on the thread that calls sig_runtime_start or sig_runtime_stop.\\nRegistration is valid only in CREATED, a duplicate name is SIG_ERR_EXISTS,\\nand the config string is copied. Startup is two-phase: create runs for\\nevery module in registration order before any start runs, so a create\\nmay use the state of modules registered before it\\n(sig_runtime_module_state). Shutdown stops every module and then\\ndestroys every module, each in reverse registration order." <<SigRuntimeModules>> as SigRuntimeModules
  rectangle "==Signal tap installation\\n<size:10>[sig_runtime_set_tap; sig_tap.h]</size>\\n\\nsig_runtime_set_tap installs one observer on every service of the\\nrunning project, and on services configured later (a rebuild after an\\nedit keeps it); a NULL function clears it. A tap sees each signal at\\nthe terminal boundary: SIG_TAP_OUTPUT when a capsule notifies an output\\nterminal, routed or not, and SIG_TAP_INPUT just before an input handler\\nruns. The callback runs on the emitting thread, a service worker or the\\nloop thread, and must not block. With no tap the signal path pays one\\natomic pointer load. The runtime forgets the tap when it stops. The\\nsignal feed is the only user, and it installs the tap only while a\\nsubscription exists. The terminal lookup a subscriber uses to validate\\nnames, sig_runtime_find_terminal, belongs to the control component above\\n(it takes the control mutex)." <<SigRuntimeTap>> as SigRuntimeTap
  rectangle "==Event loop\\n<size:10>[sig_loop.h; over sig_poller]</size>\\n\\nSingle-threaded dispatch: fd watches, one-shot timers and a step hook,\\nover a sig_poller so the same code runs on poll, kqueue or epoll. Each\\niteration runs the step hook, fires due timers, then sleeps until the\\nearlier of the step deadline and the next timer or fd event (capped at\\none hour). Everything except sig_loop_wake and sig_loop_stop must be\\ncalled on the thread that runs sig_loop_run, or before it starts.\\nCallbacks may add, change and remove watches and timers, including\\ntheir own; a watch must be removed before its fd is closed." <<SigRuntimeLoop>> as SigRuntimeLoop
}

SigRuntimeLifecycle .[#8D8D8D,thickness=2].> SigRuntimeShutdown : <color:#8D8D8D>start clears a pending request
SigRuntimeLifecycle .[#8D8D8D,thickness=2].> SigRuntimeModules : <color:#8D8D8D>create all, start all, then stop and destroy in reverse
SigRuntimeLifecycle .[#8D8D8D,thickness=2].> SigRuntimeTap : <color:#8D8D8D>stop clears the tap on every service before modules go
SigRuntimeShutdown .[#8D8D8D,thickness=2].> SigRuntimeLoop : <color:#8D8D8D>a request wakes the loop when one is set
SigRuntimeStepping .[#8D8D8D,thickness=2].> SigRuntimeLoop : <color:#8D8D8D>service wake callback calls sig_loop_wake
@enduml
`;case`runtime_components`:return`@startuml
title "Runtime components"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SigFeed>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHost>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHttp>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigMgmt>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntimeControl>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntimeLifecycle>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntimeStepping>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntimeShutdown>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntimeModules>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntimeTap>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntimeLoop>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigProject>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigService>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFoundation>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPlatform>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "==Signal feed\\n<size:10>[sig_signal_feed.h; sig::signal_feed, SIG_SIGNAL_FEED]</size>\\n\\nStreams the signals crossing chosen capsule terminals to WebSocket\\nclients as JSON text frames, on the path "/feed" of the shared HTTP server.\\nA client names a service, instance and terminal and sees the signals from\\nthen on, with no history. The feed is unauthenticated: the only check is\\nthe Origin test the HTTP server makes. The runtime tap is the source of\\nthe data, and it is installed only while at least one subscription exists." <<SigFeed>> as SigFeed
rectangle "==Host\\n<size:10>[sig_host.h; CMake target sig::host and the sighost executable (SIG_HOST)]</size>\\n\\nThe program that runs a project. sig_host_run is the portable boot\\nsequence; host/posix supplies the command line, the shutdown trigger\\nand the choice of persistence backend. The host registers the runtime\\nmodules it is given and knows nothing about particular capsules,\\nruntime modules or signals; main.c is what selects them." <<SigHost>> as SigHost
rectangle "==HTTP\\n<size:10>[sig_http_server.h, sig_ws.h, sig_http_client.h; sig::http_server (SIG_HTTP_SERVER, needs SIG_NET) and sig::http_client (SIG_HTTP_CLIENT, libcurl)]</size>\\n\\nThe HTTP layer, in two independent parts. The server is one shared HTTP/1.1\\nserver per runtime, offered as a runtime module named http_server (build\\noptions SIG_NET and SIG_HTTP_SERVER); other modules register path prefixes\\non it. The client is a blocking and an asynchronous GET over libcurl (build\\noption SIG_HTTP_CLIENT). The server has no TLS and no authentication." <<SigHttp>> as SigHttp
rectangle "==Management\\n<size:10>[sig_mgmt.h, sig_mgmt_http.h; sig::mgmt (SIG_MGMT) and sig::mgmt_http (built when SIG_MGMT and SIG_HTTP_SERVER are both on)]</size>\\n\\nReads and controls a running runtime. The operations in sig::mgmt take and\\nreturn plain value trees and status codes and know nothing of any\\ntransport. The REST layer and the glue module in sig::mgmt_http map HTTP\\nonto them, on the shared HTTP server. Built when SIG_MGMT is ON; the HTTP\\npart is built when SIG_MGMT and SIG_HTTP_SERVER are both ON. There is no\\nauthentication anywhere in the area." <<SigMgmt>> as SigMgmt
rectangle "Runtime" <<SigRuntime>> as SigRuntime {
  skinparam RectangleBorderColor<<SigRuntime>> #3b82f6
  skinparam RectangleFontColor<<SigRuntime>> #3b82f6
  skinparam RectangleBorderStyle<<SigRuntime>> dashed

  rectangle "==Control mutex (edit lock)\\n<size:10>[sig_runtime_edit, sig_runtime_service_*; one sig_mutex]</size>\\n\\nOne control mutex (the service-control lock in the header) guards the\\nstate and serializes sig_runtime_service_start, stop, restart and\\nstart_prebuilt, sig_runtime_edit, sig_runtime_find_terminal and\\nsig_runtime_dump_info. The service calls, edit and find_terminal return SIG_ERR_STATE\\nunless the runtime is RUNNING (start_prebuilt returns SIG_ERR_STALE for\\na stopped service whose definition changed); uptime returns 0.0 and\\ndump_info reports a partial snapshot when not RUNNING. sig_runtime_edit runs a caller function on the\\nproject under that lock and is the only safe way to call the\\nsig_project editing functions while running. The mutex is held across\\nservice start and stop, which join worker threads. Rule: never call\\nsig_runtime_service_*, sig_runtime_uptime_seconds or\\nsig_runtime_dump_info from a service or capsule thread, because the\\nthread being joined may be the caller and the call deadlocks. Call\\nthem from module, transport or host threads only." <<SigRuntimeControl>> as SigRuntimeControl
  rectangle "==Lifecycle state machine\\n<size:10>[sig_runtime_create/start/stop; sig_runtime.c]</size>\\n\\nStates are CREATED, STARTING, RUNNING, STOPPING, back to CREATED, and a\\nstopped runtime may be started again. sig_runtime_start loads the\\nproject from the store, creates every module, starts every module,\\nputs each service in the execution mode of the runtime, then starts the\\nservices flagged auto_start; a failure of an auto-start service is\\nlogged but does not fail the call. If loading or any module step fails,\\nthe modules are torn down in reverse, the project is destroyed and the\\nstate returns to CREATED. sig_runtime_stop is a no-op in CREATED,\\nSIG_ERR_STATE while STARTING or STOPPING, and otherwise stops all\\nservices, clears the tap, stops then destroys every module in reverse,\\nand destroys the project." <<SigRuntimeLifecycle>> as SigRuntimeLifecycle
  rectangle "==Driven mode and stepping\\n<size:10>[sig_runtime_set_loop, sig_runtime_step]</size>\\n\\nsig_runtime_set_loop gives the runtime a loop (CREATED only, else\\nSIG_ERR_STATE). From then on every service is driven: it gets no worker\\nthread and a wake callback that wakes the loop. The host loop calls\\nsig_runtime_step, which steps every running driven service once while\\nholding the control mutex and reports the earliest next deadline.\\nHandlers, jobs and management requests then all run on the loop thread,\\nso the rule that an instance belongs to one thread still holds. Runtime\\nmodules find the loop with sig_runtime_loop and must remove their own\\nfds and timers in stop." <<SigRuntimeStepping>> as SigRuntimeStepping
  rectangle "==Shutdown request\\n<size:10>[sig_runtime_request_shutdown/wait; sig_runtime.c]</size>\\n\\nsig_runtime_request_shutdown records the request under a mutex and\\nsignals a condition variable, from any thread; it only records, and it\\nis NOT async-signal-safe, so a host blocks the signals and calls it\\nfrom a dedicated sigwait() thread. sig_runtime_wait blocks until the\\nrequest has been made since the last start; sig_runtime_shutdown_requested\\nis the non-blocking form. sig_runtime_start clears an earlier request.\\nWith a loop set, a request also wakes the loop." <<SigRuntimeShutdown>> as SigRuntimeShutdown
  rectangle "==Runtime module registry\\n<size:10>[sig_runtime_module; sig_runtime.c]</size>\\n\\nA runtime module is a name plus optional create, start, stop and destroy\\nhooks, run on the thread that calls sig_runtime_start or sig_runtime_stop.\\nRegistration is valid only in CREATED, a duplicate name is SIG_ERR_EXISTS,\\nand the config string is copied. Startup is two-phase: create runs for\\nevery module in registration order before any start runs, so a create\\nmay use the state of modules registered before it\\n(sig_runtime_module_state). Shutdown stops every module and then\\ndestroys every module, each in reverse registration order." <<SigRuntimeModules>> as SigRuntimeModules
  rectangle "==Signal tap installation\\n<size:10>[sig_runtime_set_tap; sig_tap.h]</size>\\n\\nsig_runtime_set_tap installs one observer on every service of the\\nrunning project, and on services configured later (a rebuild after an\\nedit keeps it); a NULL function clears it. A tap sees each signal at\\nthe terminal boundary: SIG_TAP_OUTPUT when a capsule notifies an output\\nterminal, routed or not, and SIG_TAP_INPUT just before an input handler\\nruns. The callback runs on the emitting thread, a service worker or the\\nloop thread, and must not block. With no tap the signal path pays one\\natomic pointer load. The runtime forgets the tap when it stops. The\\nsignal feed is the only user, and it installs the tap only while a\\nsubscription exists. The terminal lookup a subscriber uses to validate\\nnames, sig_runtime_find_terminal, belongs to the control component above\\n(it takes the control mutex)." <<SigRuntimeTap>> as SigRuntimeTap
  rectangle "==Event loop\\n<size:10>[sig_loop.h; over sig_poller]</size>\\n\\nSingle-threaded dispatch: fd watches, one-shot timers and a step hook,\\nover a sig_poller so the same code runs on poll, kqueue or epoll. Each\\niteration runs the step hook, fires due timers, then sleeps until the\\nearlier of the step deadline and the next timer or fd event (capped at\\none hour). Everything except sig_loop_wake and sig_loop_stop must be\\ncalled on the thread that runs sig_loop_run, or before it starts.\\nCallbacks may add, change and remove watches and timers, including\\ntheir own; a watch must be removed before its fd is closed." <<SigRuntimeLoop>> as SigRuntimeLoop
}
rectangle "==Project\\n<size:10>[sig_project.h, sig_config.h; part of sig::sig]</size>\\n\\nA project is the capsule configurations and services loaded from a\\npersistence store and wired together. It owns the configurations,\\nservices and capsule instances it builds, keeps the JSON definition of\\neach, and writes every edit back to the store. Nothing is started by\\nloading. The store and the capsule registry are borrowed and must outlive\\nthe project." <<SigProject>> as SigProject
rectangle "==Service\\n<size:10>[sig_service.h; part of sig::sig]</size>\\n\\nA service is a worker thread with a signal queue and a job scheduler,\\nowning a set of capsule instances by name (it borrows them; the project\\nowns them). Once a service is started, terminal handlers and lifecycle\\nhooks of its instances run on its own thread, except that start hooks run\\non the thread that called start and stop hooks on the thread that called\\nstop. A service can instead be driven by an event loop, with no thread of\\nits own." <<SigService>> as SigService
rectangle "==Foundation\\n<size:10>[CMake target sig::sig (always built)]</size>\\n\\nAllocation, status codes, reference counting, hash table and list,\\nlogging, the sig_value data model, JSON, and the expression language.\\nPart of the sig::sig target and always built; it has no dependency on\\nthe optional modules. Its one dependency outside the module is\\nlogging, which takes a platform mutex (sig_thread.h)." <<SigFoundation>> as SigFoundation
rectangle "==Platform\\n<size:10>[CMake targets sig::sig (threads, time, poller) and sig::net (TCP, SIG_NET)]</size>\\n\\nEverything OS-specific, behind headers. Threads, time and the poller are\\npart of sig::sig and always built; the TCP layer is the optional sig::net\\ntarget, built with -DSIG_NET=ON. Only POSIX implementations exist today\\n(src/platform/posix and src/net/sig_net_posix.c); the rest of libsig\\ndoes not include OS headers. A port to another system replaces these\\nfiles and nothing above them." <<SigPlatform>> as SigPlatform

SigFeed .[#8D8D8D,thickness=2].> SigRuntimeModules : <color:#8D8D8D>registered as the runtime module 'signal_feed'; create, start, stop and destroy hooks
SigFeed .[#8D8D8D,thickness=2].> SigRuntimeControl : <color:#8D8D8D>sig_runtime_find_terminal validates the names and gives the direction
SigFeed .[#8D8D8D,thickness=2].> SigRuntimeTap : <color:#8D8D8D>sig_runtime_set_tap installs the callback (on every successful subscribe) and removes it when the last subscription goes
SigFeed .[#8D8D8D,thickness=2].> SigRuntimeLoop : <color:#8D8D8D>[...]
SigHost .[#8D8D8D,thickness=2].> SigRuntimeLifecycle : <color:#8D8D8D>sig_runtime_create, start, stop and destroy
SigHost .[#8D8D8D,thickness=2].> SigRuntimeShutdown : <color:#8D8D8D>[...]
SigHost .[#8D8D8D,thickness=2].> SigRuntimeModules : <color:#8D8D8D>sig_runtime_register_module for each configured module, in order
SigHost .[#8D8D8D,thickness=2].> SigRuntimeControl : <color:#8D8D8D>sig_runtime_dump_info on SIGINFO
SigHost .[#8D8D8D,thickness=2].> SigRuntimeLoop : <color:#8D8D8D>[...]
SigHost .[#8D8D8D,thickness=2].> SigRuntimeStepping : <color:#8D8D8D>single-threaded only: sig_runtime_set_loop; the step hook calls sig_runtime_step
SigHttp .[#8D8D8D,thickness=2].> SigRuntimeModules : <color:#8D8D8D>registered as the runtime module 'http_server'; create, start, stop and destroy hooks
SigHttp .[#8D8D8D,thickness=2].> SigRuntimeLoop : <color:#8D8D8D>sig_loop_watch_fd, sig_loop_watch_modify, sig_loop_timer_start for connections and the listener
SigMgmt .[#8D8D8D,thickness=2].> SigRuntimeShutdown : <color:#8D8D8D>sig_runtime_request_shutdown
SigMgmt .[#8D8D8D,thickness=2].> SigRuntimeModules : <color:#8D8D8D>[...]
SigMgmt .[#8D8D8D,thickness=2].> SigRuntimeControl : <color:#8D8D8D>[...]
SigRuntimeLifecycle .[#8D8D8D,thickness=2].> SigRuntimeShutdown : <color:#8D8D8D>start clears a pending request
SigRuntimeLifecycle .[#8D8D8D,thickness=2].> SigRuntimeModules : <color:#8D8D8D>create all, start all, then stop and destroy in reverse
SigRuntimeLifecycle .[#8D8D8D,thickness=2].> SigRuntimeTap : <color:#8D8D8D>stop clears the tap on every service before modules go
SigRuntimeShutdown .[#8D8D8D,thickness=2].> SigRuntimeLoop : <color:#8D8D8D>a request wakes the loop when one is set
SigRuntimeStepping .[#8D8D8D,thickness=2].> SigRuntimeLoop : <color:#8D8D8D>service wake callback calls sig_loop_wake
SigRuntimeLifecycle .[#8D8D8D,thickness=2].> SigFoundation : <color:#8D8D8D>[...]
SigRuntimeLifecycle .[#8D8D8D,thickness=2].> SigPlatform : <color:#8D8D8D>[...]
SigRuntimeLifecycle .[#8D8D8D,thickness=2].> SigProject : <color:#8D8D8D>[...]
SigRuntimeLifecycle .[#8D8D8D,thickness=2].> SigService : <color:#8D8D8D>in driven mode only: sets driven and the wake callback on each service
SigRuntimeControl .[#8D8D8D,thickness=2].> SigProject : <color:#8D8D8D>[...]
SigRuntimeControl .[#8D8D8D,thickness=2].> SigService : <color:#8D8D8D>start and stop under the control mutex; blocks until hooks have run
SigRuntimeTap .[#8D8D8D,thickness=2].> SigProject : <color:#8D8D8D>walks the services
SigRuntimeTap .[#8D8D8D,thickness=2].> SigService : <color:#8D8D8D>installs the tap on each service
SigRuntimeLoop .[#8D8D8D,thickness=2].> SigFoundation : <color:#8D8D8D>[...]
SigRuntimeLoop .[#8D8D8D,thickness=2].> SigPlatform : <color:#8D8D8D>[...]
SigRuntimeStepping .[#8D8D8D,thickness=2].> SigProject : <color:#8D8D8D>walks the services
SigRuntimeStepping .[#8D8D8D,thickness=2].> SigService : <color:#8D8D8D>steps each running driven service
@enduml
`;case`boot_and_shutdown`:return`@startuml
title "Boot and shutdown (sig_host_run)"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SigHostRunner>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPersistenceStore>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntimeLifecycle>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntimeLoop>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntimeStepping>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntimeModules>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigHostShutdown>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigProjectLoader>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigProjectParser>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigProjectOwnership>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigServiceLifecycle>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntimeShutdown>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntimeTap>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "==Boot runner\\n<size:10>[sig_host_run, host_step; host/sig_host.c]</size>\\n\\nsig_host_run opens the persistence store (any backend), creates the\\nruntime with the store and the capsule registry, and, if\\nsingle_threaded is set, creates a sig_loop, installs the host step\\nhook and gives the loop to the runtime. It then registers every\\nmodule of the configuration in order, arms the platform shutdown\\ntrigger, starts the runtime, and waits: sig_runtime_wait, or\\nsig_loop_run in single-threaded mode. Then it stops the runtime,\\ndisarms the trigger and destroys the runtime, the loop and the store,\\nthe store last because the runtime borrows it. Everything runs on\\nthe calling thread. The step hook runs sig_runtime_step and stops\\nthe loop once a shutdown has been requested. A failure before the\\nstart jumps to the destroy sequence (nothing is armed yet, or arming\\nitself failed); a failed start is still followed by the disarm. The\\nstatus of the first failure is returned, and a clean shutdown\\nreturns SIG_OK. A NULL store module, capsule registry or module is\\nSIG_ERR_INVALID_ARG. The host does not check that a file store\\ndirectory exists." <<SigHostRunner>> as SigHostRunner
rectangle "==Store interface\\n<size:10>[sig_persistence_module, sig_persistence_create/load/save/remove/list]</size>\\n\\nA backend is a sig_persistence_module: a name, create and destroy, and\\nthe data hooks load, save, remove and list. sig_persistence_create\\nbinds a backend to a config string and keeps the state it returns; the\\ndata calls check their arguments and forward to the hook. A NULL\\nargument, or a backend with no such hook, is SIG_ERR_INVALID_ARG.\\nload returns a sig_alloc buffer that the caller frees and reports a\\nmissing key as SIG_ERR_NOT_FOUND; save creates or replaces the key and\\nonly borrows the data; remove reports a missing key as\\nSIG_ERR_NOT_FOUND; list calls back once per key and stops at the first\\nstatus other than SIG_OK. The callback must not save or remove keys in\\nthe namespace being listed." <<SigPersistenceStore>> as SigPersistenceStore
rectangle "==Lifecycle state machine\\n<size:10>[sig_runtime_create/start/stop; sig_runtime.c]</size>\\n\\nStates are CREATED, STARTING, RUNNING, STOPPING, back to CREATED, and a\\nstopped runtime may be started again. sig_runtime_start loads the\\nproject from the store, creates every module, starts every module,\\nputs each service in the execution mode of the runtime, then starts the\\nservices flagged auto_start; a failure of an auto-start service is\\nlogged but does not fail the call. If loading or any module step fails,\\nthe modules are torn down in reverse, the project is destroyed and the\\nstate returns to CREATED. sig_runtime_stop is a no-op in CREATED,\\nSIG_ERR_STATE while STARTING or STOPPING, and otherwise stops all\\nservices, clears the tap, stops then destroys every module in reverse,\\nand destroys the project." <<SigRuntimeLifecycle>> as SigRuntimeLifecycle
rectangle "==Event loop\\n<size:10>[sig_loop.h; over sig_poller]</size>\\n\\nSingle-threaded dispatch: fd watches, one-shot timers and a step hook,\\nover a sig_poller so the same code runs on poll, kqueue or epoll. Each\\niteration runs the step hook, fires due timers, then sleeps until the\\nearlier of the step deadline and the next timer or fd event (capped at\\none hour). Everything except sig_loop_wake and sig_loop_stop must be\\ncalled on the thread that runs sig_loop_run, or before it starts.\\nCallbacks may add, change and remove watches and timers, including\\ntheir own; a watch must be removed before its fd is closed." <<SigRuntimeLoop>> as SigRuntimeLoop
rectangle "==Driven mode and stepping\\n<size:10>[sig_runtime_set_loop, sig_runtime_step]</size>\\n\\nsig_runtime_set_loop gives the runtime a loop (CREATED only, else\\nSIG_ERR_STATE). From then on every service is driven: it gets no worker\\nthread and a wake callback that wakes the loop. The host loop calls\\nsig_runtime_step, which steps every running driven service once while\\nholding the control mutex and reports the earliest next deadline.\\nHandlers, jobs and management requests then all run on the loop thread,\\nso the rule that an instance belongs to one thread still holds. Runtime\\nmodules find the loop with sig_runtime_loop and must remove their own\\nfds and timers in stop." <<SigRuntimeStepping>> as SigRuntimeStepping
rectangle "==Runtime module registry\\n<size:10>[sig_runtime_module; sig_runtime.c]</size>\\n\\nA runtime module is a name plus optional create, start, stop and destroy\\nhooks, run on the thread that calls sig_runtime_start or sig_runtime_stop.\\nRegistration is valid only in CREATED, a duplicate name is SIG_ERR_EXISTS,\\nand the config string is copied. Startup is two-phase: create runs for\\nevery module in registration order before any start runs, so a create\\nmay use the state of modules registered before it\\n(sig_runtime_module_state). Shutdown stops every module and then\\ndestroys every module, each in reverse registration order." <<SigRuntimeModules>> as SigRuntimeModules
rectangle "==POSIX shutdown trigger\\n<size:10>[sig_host_posix_platform, posix_arm_shutdown; host/posix/sig_host_posix.c]</size>\\n\\nThe POSIX implementation of the sig_host_platform seam (an\\narm_shutdown and a disarm_shutdown hook). In threaded mode it blocks\\nSIGINT and SIGTERM, and SIGINFO where it exists, in the arming\\nthread and starts a thread that waits for them with sigwait(); a\\nsignal calls sig_runtime_request_shutdown, which is not\\nasync-signal-safe and so cannot run in a handler. In single-threaded\\nmode there is no thread: handlers whose only action is an\\nasync-signal-safe write() to a self-pipe, which the loop watches and\\nwhich makes the same call on the loop thread. SIGINFO writes a\\nruntime snapshot to stderr and does not stop anything. Disarm joins\\nthe thread and restores the signal mask, or restores the handlers\\nand closes the pipe." <<SigHostShutdown>> as SigHostShutdown
rectangle "==Project load\\n<size:10>[sig_project_load]</size>\\n\\nReads every key of the "configurations" namespace and then every key of\\nthe "services" namespace of the store, so services can resolve their\\nconfigurations. A namespace the store does not have is empty, not an\\nerror; a key that vanishes between listing and loading is skipped; any\\nother failure to list or load is SIG_ERR_PLATFORM, and a document that\\ndoes not validate is SIG_ERR_PARSE or SIG_ERR_NOT_FOUND. On any failure\\neverything built so far is torn down and no partial project is returned.\\nNothing is started by this call." <<SigProjectLoader>> as SigProjectLoader
rectangle "==Config parser\\n<size:10>[sig_config.h; sig_value JSON; private functions]</size>\\n\\nTurns one .cfg JSON document into live objects. A capsule configuration\\ndocument names its capsule in "type" (looked up in the registry) and may\\ncarry an "attr_value" object whose values must be int, bool, double or\\nstring. A service document has an optional boolean "auto_start" and an\\n"execution" array whose entries each name a capsule configuration; the\\ninstance takes that name. It works in two passes, so a receiver may name\\nan entry listed later: first every entry is instantiated and added to the\\nservice, then every "receivers" object (output terminal to a list of\\nname and input) is wired with sig_capsule_instance_connect. On failure\\nnothing is left allocated. The functions in sig_config.h are SIG_PRIVATE,\\nso this component has no public functions." <<SigProjectParser>> as SigProjectParser
rectangle "==Ownership and auto-start\\n<size:10>[sig_project_destroy/start_auto/stop_all]</size>\\n\\nThe project owns its capsule configurations, its services, and the\\ncapsule instances (kept in an owned list per service; services do not\\nown their instances). sig_project_destroy stops each service, destroys\\nits instances, destroys the service, and finally destroys the\\nconfigurations (replaced or deleted ones are kept on a retired list until\\nthen, because a running service may still borrow them). start_auto starts\\nevery service flagged auto_start, and stop_all stops every service;\\nboth are best-effort across services: one failure does not stop the\\nothers, and the last failure is returned." <<SigProjectOwnership>> as SigProjectOwnership
rectangle "==Start and stop\\n<size:10>[sig_service_create/start/stop/destroy]</size>\\n\\nsig_service_start runs every instance start hook SYNCHRONOUSLY on the\\ncalling thread, before the worker thread is spawned, so the hooks have\\nrun when start returns. Before each start hook the instance properties\\nare resolved. If resolving or a hook fails, the instances already\\nstarted get their stop hook, scheduled jobs are canceled, no thread is\\nspawned, and the service stays stopped and can be started again.\\nsig_service_stop stops accepting signals, then joins the worker thread\\nFIRST (a driven service has no worker: the calling thread drains the\\nqueued signals itself, sig_service.c:731-743), cancels jobs, then runs\\nthe stop hooks on the calling thread.\\nStarting a started service is SIG_ERR_EXISTS; stopping or destroying a\\nnever-started or stopped service is a safe no-op; destroy stops a\\nrunning service first." <<SigServiceLifecycle>> as SigServiceLifecycle
rectangle "==Shutdown request\\n<size:10>[sig_runtime_request_shutdown/wait; sig_runtime.c]</size>\\n\\nsig_runtime_request_shutdown records the request under a mutex and\\nsignals a condition variable, from any thread; it only records, and it\\nis NOT async-signal-safe, so a host blocks the signals and calls it\\nfrom a dedicated sigwait() thread. sig_runtime_wait blocks until the\\nrequest has been made since the last start; sig_runtime_shutdown_requested\\nis the non-blocking form. sig_runtime_start clears an earlier request.\\nWith a loop set, a request also wakes the loop." <<SigRuntimeShutdown>> as SigRuntimeShutdown
rectangle "==Signal tap installation\\n<size:10>[sig_runtime_set_tap; sig_tap.h]</size>\\n\\nsig_runtime_set_tap installs one observer on every service of the\\nrunning project, and on services configured later (a rebuild after an\\nedit keeps it); a NULL function clears it. A tap sees each signal at\\nthe terminal boundary: SIG_TAP_OUTPUT when a capsule notifies an output\\nterminal, routed or not, and SIG_TAP_INPUT just before an input handler\\nruns. The callback runs on the emitting thread, a service worker or the\\nloop thread, and must not block. With no tap the signal path pays one\\natomic pointer load. The runtime forgets the tap when it stops. The\\nsignal feed is the only user, and it installs the tap only while a\\nsubscription exists. The terminal lookup a subscriber uses to validate\\nnames, sig_runtime_find_terminal, belongs to the control component above\\n(it takes the control mutex)." <<SigRuntimeTap>> as SigRuntimeTap

SigHostRunner .[#8D8D8D,thickness=2].> SigPersistenceStore : <color:#8D8D8D>sig_persistence_create opens the store (the file backend, from the project directory)
SigHostRunner .[#8D8D8D,thickness=2].> SigRuntimeLifecycle : <color:#8D8D8D>sig_runtime_create takes the store and the capsule registry (both borrowed)
SigHostRunner .[#8D8D8D,thickness=2].> SigRuntimeLoop : <color:#8D8D8D>Single-threaded mode only: sig_loop_create and sig_loop_set_step(host_step)
SigHostRunner .[#8D8D8D,thickness=2].> SigRuntimeStepping : <color:#8D8D8D>Single-threaded mode only: sig_runtime_set_loop (CREATED only)
SigHostRunner .[#8D8D8D,thickness=2].> SigRuntimeModules : <color:#8D8D8D>sig_runtime_register_module for each configured module, in order (CREATED only)
SigHostRunner .[#8D8D8D,thickness=2].> SigHostShutdown : <color:#8D8D8D>arm_shutdown, before the start: a sigwait thread, or in single-threaded mode handlers and a self-pipe on the loop
SigHostRunner .[#8D8D8D,thickness=2].> SigRuntimeLifecycle : <color:#8D8D8D>sig_runtime_start
SigRuntimeLifecycle .[#8D8D8D,thickness=2].> SigProjectLoader : <color:#8D8D8D>state STARTING, clears any shutdown request, then sig_project_load reads the store
SigProjectLoader .[#8D8D8D,thickness=2].> SigProjectParser : <color:#8D8D8D>configurations are parsed first, then services, whose instances are wired in two passes
SigRuntimeLifecycle .[#8D8D8D,thickness=2].> SigRuntimeModules : <color:#8D8D8D>create hook of every module in registration order, then start hook of every module
SigRuntimeLifecycle .[#8D8D8D,thickness=2].> SigProjectOwnership : <color:#8D8D8D>each service is put in driven or threaded mode, then sig_project_start_auto
SigProjectOwnership .[#8D8D8D,thickness=2].> SigServiceLifecycle : <color:#8D8D8D>every auto_start service: start hooks run on the calling thread, then the worker thread is spawned (none if driven); state becomes RUNNING
SigHostRunner .[#8D8D8D,thickness=2].> SigRuntimeShutdown : <color:#8D8D8D>Threaded mode: sig_runtime_wait blocks until a shutdown is requested
SigHostRunner .[#8D8D8D,thickness=2].> SigRuntimeLoop : <color:#8D8D8D>Single-threaded mode instead: sig_loop_run until the step hook sees a shutdown request and calls sig_loop_stop
SigHostShutdown .[#8D8D8D,thickness=2].> SigRuntimeShutdown : <color:#8D8D8D>On SIGINT or SIGTERM: sig_runtime_request_shutdown sets the flag, notifies the condition, wakes the loop if set
SigHostRunner .[#8D8D8D,thickness=2].> SigRuntimeLifecycle : <color:#8D8D8D>sig_runtime_stop
SigRuntimeLifecycle .[#8D8D8D,thickness=2].> SigProjectOwnership : <color:#8D8D8D>state STOPPING, then sig_project_stop_all
SigProjectOwnership .[#8D8D8D,thickness=2].> SigServiceLifecycle : <color:#8D8D8D>sig_service_stop: worker joined first, then stop hooks run on the calling thread
SigRuntimeLifecycle .[#8D8D8D,thickness=2].> SigRuntimeTap : <color:#8D8D8D>the tap is cleared on every service; the control mutex is released
SigRuntimeLifecycle .[#8D8D8D,thickness=2].> SigRuntimeModules : <color:#8D8D8D>stop hook of every module in reverse order, then destroy hook of every module in reverse order
SigRuntimeLifecycle .[#8D8D8D,thickness=2].> SigProjectOwnership : <color:#8D8D8D>sig_project_destroy: each service stopped, its instances destroyed, the service destroyed; then configurations; state CREATED
SigHostRunner .[#8D8D8D,thickness=2].> SigHostShutdown : <color:#8D8D8D>disarm_shutdown: the thread is joined and the signal mask restored, or the handlers restored and the pipe closed
SigHostRunner .[#8D8D8D,thickness=2].> SigRuntimeLifecycle : <color:#8D8D8D>sig_runtime_destroy
SigHostRunner .[#8D8D8D,thickness=2].> SigRuntimeLoop : <color:#8D8D8D>Single-threaded mode only: sig_loop_destroy
SigHostRunner .[#8D8D8D,thickness=2].> SigPersistenceStore : <color:#8D8D8D>sig_persistence_destroy, last because the runtime borrows the store
@enduml
`;case`service`:return`@startuml
title "Service"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SigServiceLifecycle>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigServiceInstances>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigServiceQueue>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigServiceDriven>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigServiceScheduler>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigServiceWorker>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigServiceTap>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "Service" <<SigService>> as SigService {
  skinparam RectangleBorderColor<<SigService>> #3b82f6
  skinparam RectangleFontColor<<SigService>> #3b82f6
  skinparam RectangleBorderStyle<<SigService>> dashed

  rectangle "==Start and stop\\n<size:10>[sig_service_create/start/stop/destroy]</size>\\n\\nsig_service_start runs every instance start hook SYNCHRONOUSLY on the\\ncalling thread, before the worker thread is spawned, so the hooks have\\nrun when start returns. Before each start hook the instance properties\\nare resolved. If resolving or a hook fails, the instances already\\nstarted get their stop hook, scheduled jobs are canceled, no thread is\\nspawned, and the service stays stopped and can be started again.\\nsig_service_stop stops accepting signals, then joins the worker thread\\nFIRST (a driven service has no worker: the calling thread drains the\\nqueued signals itself, sig_service.c:731-743), cancels jobs, then runs\\nthe stop hooks on the calling thread.\\nStarting a started service is SIG_ERR_EXISTS; stopping or destroying a\\nnever-started or stopped service is a safe no-op; destroy stops a\\nrunning service first." <<SigServiceLifecycle>> as SigServiceLifecycle
  rectangle "==Owned instance set\\n<size:10>[sig_service_add_instance and walks; sig_ht]</size>\\n\\nInstances are added by name; the service borrows them and sets\\ninstance->service. The name, running flag, instance count and instance\\nwalk are introspection that is safe from any thread once the set is\\nfinal: instances are only added while a service is being built (project\\nload, or a rebuild of a stopped service after an edit), never while it\\nis started. sig_service_is_running is an atomic read." <<SigServiceInstances>> as SigServiceInstances
  rectangle "==Signal queue\\n<size:10>[sig_service_enqueue; sig_ll under a mutex]</size>\\n\\nsig_service_enqueue copies the signal (sig_value_dup) into a heap-owned\\nentry, pushes it under the queue lock and signals the queue condition\\nvariable. Safe from any thread, including the thread of the service\\nitself; the sender keeps ownership of what it passed. Delivery is\\nasynchronous and FIFO per destination service. A service accepts\\nsignals from creation until stop begins; from then until the next start\\nit returns SIG_ERR_STATE and drops the signal. A handler that emits\\nduring the final drain at stop gets SIG_ERR_STATE, so a chain of\\ncapsules inside the service is cut at the first hop." <<SigServiceQueue>> as SigServiceQueue
  rectangle "==Driven mode\\n<size:10>[sig_service_set_driven/step/set_wake]</size>\\n\\nWith driven set (not allowed on a started service, SIG_ERR_STATE),\\nstart spawns no thread and the owner calls sig_service_step, which\\ndelivers the queued signals, runs due jobs and reports the next deadline\\n(a deadline of now means more is queued). The wake callback is called\\nwith no lock held whenever a signal is enqueued or a job is scheduled or\\ncanceled, so the loop can recompute its sleep; set it before starting.\\nStop on a driven service delivers the signals still queued before it\\nreturns." <<SigServiceDriven>> as SigServiceDriven
  rectangle "==Job scheduler\\n<size:10>[sig_service_schedule_job/cancel_job]</size>\\n\\nRuns a callback on the thread of the service after an interval, once or\\nrepeating. The interval must be at least 1 ms (SIG_ERR_INVALID_ARG\\notherwise). A repeating job that overruns its interval skips the missed\\nfires instead of bursting to catch up. Safe to schedule before the\\nthread exists (from a start hook), from the worker itself, or from any\\nother thread. A job node whose handle was requested is kept until the\\nservice is destroyed, so a handle can always be canceled safely; pass\\nno handle for jobs that never need canceling. Cancel is a no-op if the\\njob already fired or was canceled." <<SigServiceScheduler>> as SigServiceScheduler
  rectangle "==Worker thread\\n<size:10>[service_thread_main; sig_thread]</size>\\n\\nOne thread per started, non-driven service. It waits on the queue\\ncondition variable, with a timed wait to the next job deadline, so an\\nidle service uses no CPU. Each pass delivers the batch of queued signals\\nand then runs the jobs that are due, both outside the queue lock. The\\nthread exits once the service is not running and the queue is empty.\\nTerminal handlers and jobs run here, which is why an instance belongs to\\nthis thread." <<SigServiceWorker>> as SigServiceWorker
  rectangle "==Tap slot\\n<size:10>[sig_service_set_tap, sig_service_tap_emit]</size>\\n\\nHolds the optional observer for the signal tap. sig_service_set_tap is\\nsafe from any thread at any time; the function and its context change\\ntogether atomically, and a replaced tap may still be running on the\\nservice thread when the call returns. With no tap the cost on the signal\\npath is one atomic pointer load. sig_service_tap_emit is called by the\\ncapsule on output and by the delivery loop before an input handler; it\\nis not for capsule code." <<SigServiceTap>> as SigServiceTap
}

SigServiceLifecycle .[#8D8D8D,thickness=2].> SigServiceQueue : <color:#8D8D8D>opens the queue before start hooks; closes it at stop and on a failed start
SigServiceLifecycle .[#8D8D8D,thickness=2].> SigServiceScheduler : <color:#8D8D8D>cancels all jobs at stop and on a failed start
SigServiceLifecycle .[#8D8D8D,thickness=2].> SigServiceWorker : <color:#8D8D8D>spawns it unless the service is driven; joins it first on stop
SigServiceQueue .[#8D8D8D,thickness=2].> SigServiceWorker : <color:#8D8D8D>notifies the queue condition variable
SigServiceQueue .[#8D8D8D,thickness=2].> SigServiceDriven : <color:#8D8D8D>calls the wake callback of the owner, with no lock held
SigServiceDriven .[#8D8D8D,thickness=2].> SigServiceQueue : <color:#8D8D8D>a step delivers the queued batch
SigServiceScheduler .[#8D8D8D,thickness=2].> SigServiceWorker : <color:#8D8D8D>notifies the condition so the wait deadline is recomputed
SigServiceWorker .[#8D8D8D,thickness=2].> SigServiceScheduler : <color:#8D8D8D>runs the jobs that are due
SigServiceDriven .[#8D8D8D,thickness=2].> SigServiceScheduler : <color:#8D8D8D>a step runs the jobs that are due
SigServiceWorker .[#8D8D8D,thickness=2].> SigServiceTap : <color:#8D8D8D>input tap just before the handler
SigServiceDriven .[#8D8D8D,thickness=2].> SigServiceTap : <color:#8D8D8D>input tap before each handler
@enduml
`;case`service_components`:return`@startuml
title "Service components"
top to bottom direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SigCapsules>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigMgmt>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigProject>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigRuntime>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigServiceInstances>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigServiceLifecycle>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigServiceQueue>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigServiceDriven>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFoundation>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigServiceScheduler>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigServiceWorker>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigServiceTap>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFeed>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigPlatform>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "==Capsules\\n<size:10>[sig_capsule.h; part of sig::sig, with the shim in capsules/ (target sig_builtin_capsules, SIG_HOST)]</size>\\n\\nThree layers in a 1 : n : n relationship. A capsule is compiled-in static\\ncode; a capsule configuration is a named configuration of one capsule\\n(a capsule plus properties), available to any service in the project;\\na capsule instance is one configuration used by one service, with its\\nown storage, state and routes. This is what runs. An instance takes the\\nname of its configuration, so a configuration appears at most once per\\nservice." <<SigCapsules>> as SigCapsules
rectangle "==Management\\n<size:10>[sig_mgmt.h, sig_mgmt_http.h; sig::mgmt (SIG_MGMT) and sig::mgmt_http (built when SIG_MGMT and SIG_HTTP_SERVER are both on)]</size>\\n\\nReads and controls a running runtime. The operations in sig::mgmt take and\\nreturn plain value trees and status codes and know nothing of any\\ntransport. The REST layer and the glue module in sig::mgmt_http map HTTP\\nonto them, on the shared HTTP server. Built when SIG_MGMT is ON; the HTTP\\npart is built when SIG_MGMT and SIG_HTTP_SERVER are both ON. There is no\\nauthentication anywhere in the area." <<SigMgmt>> as SigMgmt
rectangle "==Project\\n<size:10>[sig_project.h, sig_config.h; part of sig::sig]</size>\\n\\nA project is the capsule configurations and services loaded from a\\npersistence store and wired together. It owns the configurations,\\nservices and capsule instances it builds, keeps the JSON definition of\\neach, and writes every edit back to the store. Nothing is started by\\nloading. The store and the capsule registry are borrowed and must outlive\\nthe project." <<SigProject>> as SigProject
rectangle "==Runtime\\n<size:10>[sig_runtime.h, sig_loop.h, sig_tap.h; part of sig::sig]</size>\\n\\nOwns one running system: the project loaded from the store, the runtime\\nmodules registered with it, and the lifecycle that starts and stops them.\\nThe runtime borrows the persistence store and the capsule registry it was\\ncreated with; both must outlive it. It can also be given an event loop,\\nwhich makes every service driven and the whole system single-threaded." <<SigRuntime>> as SigRuntime
rectangle "Service" <<SigService>> as SigService {
  skinparam RectangleBorderColor<<SigService>> #3b82f6
  skinparam RectangleFontColor<<SigService>> #3b82f6
  skinparam RectangleBorderStyle<<SigService>> dashed

  rectangle "==Owned instance set\\n<size:10>[sig_service_add_instance and walks; sig_ht]</size>\\n\\nInstances are added by name; the service borrows them and sets\\ninstance->service. The name, running flag, instance count and instance\\nwalk are introspection that is safe from any thread once the set is\\nfinal: instances are only added while a service is being built (project\\nload, or a rebuild of a stopped service after an edit), never while it\\nis started. sig_service_is_running is an atomic read." <<SigServiceInstances>> as SigServiceInstances
  rectangle "==Start and stop\\n<size:10>[sig_service_create/start/stop/destroy]</size>\\n\\nsig_service_start runs every instance start hook SYNCHRONOUSLY on the\\ncalling thread, before the worker thread is spawned, so the hooks have\\nrun when start returns. Before each start hook the instance properties\\nare resolved. If resolving or a hook fails, the instances already\\nstarted get their stop hook, scheduled jobs are canceled, no thread is\\nspawned, and the service stays stopped and can be started again.\\nsig_service_stop stops accepting signals, then joins the worker thread\\nFIRST (a driven service has no worker: the calling thread drains the\\nqueued signals itself, sig_service.c:731-743), cancels jobs, then runs\\nthe stop hooks on the calling thread.\\nStarting a started service is SIG_ERR_EXISTS; stopping or destroying a\\nnever-started or stopped service is a safe no-op; destroy stops a\\nrunning service first." <<SigServiceLifecycle>> as SigServiceLifecycle
  rectangle "==Signal queue\\n<size:10>[sig_service_enqueue; sig_ll under a mutex]</size>\\n\\nsig_service_enqueue copies the signal (sig_value_dup) into a heap-owned\\nentry, pushes it under the queue lock and signals the queue condition\\nvariable. Safe from any thread, including the thread of the service\\nitself; the sender keeps ownership of what it passed. Delivery is\\nasynchronous and FIFO per destination service. A service accepts\\nsignals from creation until stop begins; from then until the next start\\nit returns SIG_ERR_STATE and drops the signal. A handler that emits\\nduring the final drain at stop gets SIG_ERR_STATE, so a chain of\\ncapsules inside the service is cut at the first hop." <<SigServiceQueue>> as SigServiceQueue
  rectangle "==Driven mode\\n<size:10>[sig_service_set_driven/step/set_wake]</size>\\n\\nWith driven set (not allowed on a started service, SIG_ERR_STATE),\\nstart spawns no thread and the owner calls sig_service_step, which\\ndelivers the queued signals, runs due jobs and reports the next deadline\\n(a deadline of now means more is queued). The wake callback is called\\nwith no lock held whenever a signal is enqueued or a job is scheduled or\\ncanceled, so the loop can recompute its sleep; set it before starting.\\nStop on a driven service delivers the signals still queued before it\\nreturns." <<SigServiceDriven>> as SigServiceDriven
  rectangle "==Job scheduler\\n<size:10>[sig_service_schedule_job/cancel_job]</size>\\n\\nRuns a callback on the thread of the service after an interval, once or\\nrepeating. The interval must be at least 1 ms (SIG_ERR_INVALID_ARG\\notherwise). A repeating job that overruns its interval skips the missed\\nfires instead of bursting to catch up. Safe to schedule before the\\nthread exists (from a start hook), from the worker itself, or from any\\nother thread. A job node whose handle was requested is kept until the\\nservice is destroyed, so a handle can always be canceled safely; pass\\nno handle for jobs that never need canceling. Cancel is a no-op if the\\njob already fired or was canceled." <<SigServiceScheduler>> as SigServiceScheduler
  rectangle "==Worker thread\\n<size:10>[service_thread_main; sig_thread]</size>\\n\\nOne thread per started, non-driven service. It waits on the queue\\ncondition variable, with a timed wait to the next job deadline, so an\\nidle service uses no CPU. Each pass delivers the batch of queued signals\\nand then runs the jobs that are due, both outside the queue lock. The\\nthread exits once the service is not running and the queue is empty.\\nTerminal handlers and jobs run here, which is why an instance belongs to\\nthis thread." <<SigServiceWorker>> as SigServiceWorker
  rectangle "==Tap slot\\n<size:10>[sig_service_set_tap, sig_service_tap_emit]</size>\\n\\nHolds the optional observer for the signal tap. sig_service_set_tap is\\nsafe from any thread at any time; the function and its context change\\ntogether atomically, and a replaced tap may still be running on the\\nservice thread when the call returns. With no tap the cost on the signal\\npath is one atomic pointer load. sig_service_tap_emit is called by the\\ncapsule on output and by the delivery loop before an input handler; it\\nis not for capsule code." <<SigServiceTap>> as SigServiceTap
}
rectangle "==Foundation\\n<size:10>[CMake target sig::sig (always built)]</size>\\n\\nAllocation, status codes, reference counting, hash table and list,\\nlogging, the sig_value data model, JSON, and the expression language.\\nPart of the sig::sig target and always built; it has no dependency on\\nthe optional modules. Its one dependency outside the module is\\nlogging, which takes a platform mutex (sig_thread.h)." <<SigFoundation>> as SigFoundation
rectangle "==Signal feed\\n<size:10>[sig_signal_feed.h; sig::signal_feed, SIG_SIGNAL_FEED]</size>\\n\\nStreams the signals crossing chosen capsule terminals to WebSocket\\nclients as JSON text frames, on the path "/feed" of the shared HTTP server.\\nA client names a service, instance and terminal and sees the signals from\\nthen on, with no history. The feed is unauthenticated: the only check is\\nthe Origin test the HTTP server makes. The runtime tap is the source of\\nthe data, and it is installed only while at least one subscription exists." <<SigFeed>> as SigFeed
rectangle "==Platform\\n<size:10>[CMake targets sig::sig (threads, time, poller) and sig::net (TCP, SIG_NET)]</size>\\n\\nEverything OS-specific, behind headers. Threads, time and the poller are\\npart of sig::sig and always built; the TCP layer is the optional sig::net\\ntarget, built with -DSIG_NET=ON. Only POSIX implementations exist today\\n(src/platform/posix and src/net/sig_net_posix.c); the rest of libsig\\ndoes not include OS headers. A port to another system replaces these\\nfiles and nothing above them." <<SigPlatform>> as SigPlatform

SigCapsules .[#8D8D8D,thickness=2].> SigServiceQueue : <color:#8D8D8D>sig_service_enqueue on the service of the destination
SigCapsules .[#8D8D8D,thickness=2].> SigServiceScheduler : <color:#8D8D8D>schedule and cancel jobs on instance->service
SigCapsules .[#8D8D8D,thickness=2].> SigServiceTap : <color:#8D8D8D>output tap before the route lookup
SigMgmt .[#8D8D8D,thickness=2].> SigServiceInstances : <color:#8D8D8D>walks the instances of a service, its name, its running flag
SigProject .[#8D8D8D,thickness=2].> SigServiceLifecycle : <color:#8D8D8D>[...]
SigProject .[#8D8D8D,thickness=2].> SigServiceInstances : <color:#8D8D8D>adds each instance to the service
SigRuntime .[#8D8D8D,thickness=2].> SigServiceLifecycle : <color:#8D8D8D>start and stop under the control mutex; blocks until hooks have run
SigRuntime .[#8D8D8D,thickness=2].> SigServiceDriven : <color:#8D8D8D>[...]
SigRuntime .[#8D8D8D,thickness=2].> SigServiceTap : <color:#8D8D8D>installs the tap on each service
SigServiceLifecycle .[#8D8D8D,thickness=2].> SigServiceQueue : <color:#8D8D8D>opens the queue before start hooks; closes it at stop and on a failed start
SigServiceLifecycle .[#8D8D8D,thickness=2].> SigServiceScheduler : <color:#8D8D8D>cancels all jobs at stop and on a failed start
SigServiceLifecycle .[#8D8D8D,thickness=2].> SigServiceWorker : <color:#8D8D8D>spawns it unless the service is driven; joins it first on stop
SigServiceQueue .[#8D8D8D,thickness=2].> SigServiceWorker : <color:#8D8D8D>notifies the queue condition variable
SigServiceQueue .[#8D8D8D,thickness=2].> SigServiceDriven : <color:#8D8D8D>calls the wake callback of the owner, with no lock held
SigServiceDriven .[#8D8D8D,thickness=2].> SigServiceQueue : <color:#8D8D8D>a step delivers the queued batch
SigServiceScheduler .[#8D8D8D,thickness=2].> SigServiceWorker : <color:#8D8D8D>notifies the condition so the wait deadline is recomputed
SigServiceWorker .[#8D8D8D,thickness=2].> SigServiceScheduler : <color:#8D8D8D>runs the jobs that are due
SigServiceDriven .[#8D8D8D,thickness=2].> SigServiceScheduler : <color:#8D8D8D>a step runs the jobs that are due
SigServiceWorker .[#8D8D8D,thickness=2].> SigServiceTap : <color:#8D8D8D>input tap just before the handler
SigServiceDriven .[#8D8D8D,thickness=2].> SigServiceTap : <color:#8D8D8D>input tap before each handler
SigServiceLifecycle .[#8D8D8D,thickness=2].> SigCapsules : <color:#8D8D8D>resolves properties, then runs start hooks on the calling thread; stop hooks after the join
SigServiceLifecycle .[#8D8D8D,thickness=2].> SigFoundation : <color:#8D8D8D>[...]
SigServiceLifecycle .[#8D8D8D,thickness=2].> SigPlatform : <color:#8D8D8D>sig_thread_create, sig_thread_join
SigServiceInstances .[#8D8D8D,thickness=2].> SigFoundation : <color:#8D8D8D>instances kept in a sig_ht
SigServiceQueue .[#8D8D8D,thickness=2].> SigFoundation : <color:#8D8D8D>[...]
SigServiceScheduler .[#8D8D8D,thickness=2].> SigPlatform : <color:#8D8D8D>sig_time_now for the next fire time
SigServiceWorker .[#8D8D8D,thickness=2].> SigCapsules : <color:#8D8D8D>terminal->handler(instance, signal, name) on the thread of the service
SigServiceWorker .[#8D8D8D,thickness=2].> SigPlatform : <color:#8D8D8D>sig_condition_wait and timedwait on the queue lock
SigServiceDriven .[#8D8D8D,thickness=2].> SigCapsules : <color:#8D8D8D>handlers run on the thread that steps
SigServiceTap .[#8D8D8D,thickness=2].> SigFeed : <color:#8D8D8D>calls the installed function on the emitting thread (the feed is the only user of sig_runtime_set_tap in this repository)
SigServiceTap .[#8D8D8D,thickness=2].> SigPlatform : <color:#8D8D8D>set_tap takes the queue lock to swap the slot
@enduml
`;case`signal_delivery`:return`@startuml
title "Signal delivery"
left to right direction

hide stereotype
skinparam ranksep 60
skinparam nodesep 30
skinparam {
  arrowFontSize 10
  defaultTextAlignment center
  wrapWidth 200
  maxMessageSize 100
  shadowing false
}

skinparam rectangle<<SigCapsulesCapsule>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigCapsulesRoutes>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigServiceTap>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigServiceQueue>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigFoundationValues>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigServiceWorker>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
skinparam rectangle<<SigCapsulesTerminals>>{
  BackgroundColor #3b82f6
  FontColor #eff6ff
  BorderColor #2563eb
}
rectangle "==Capsule\\n<size:10>[struct sig_capsule; static const data]</size>\\n\\nCompiled-in code and its description: a name, a table of input\\nterminals (each with a handler) and of output terminals, a table of\\nproperties (sig_property), optional start and stop hooks and an\\noptional category (source, sink, flow or state). It is data, not\\nbehaviour: the other components call into the functions it points at.\\nA capsule with no property table accepts any configuration properties." <<SigCapsulesCapsule>> as SigCapsulesCapsule
rectangle "==Routes and notify\\n<size:10>[sig_capsule_instance_connect/notify/walk_routes]</size>\\n\\nconnect records that an output terminal of one instance delivers to an\\ninput terminal of another; several connects on one output fan out.\\nRoutes are set at load time, before the instance is in a started\\nservice. notify tells the tap about the output (before the route\\nlookup), then for every route enqueues a copy on the service of the\\ndestination. An output with no routes silently drops the signal.\\nDelivery is best-effort across routes: one failing destination does\\nnot stop the rest, and the status of the last failure is returned.\\nReading the routes (notify, walk_routes) is safe once the project is\\nloaded; connecting concurrently with notify on a running instance is\\nnot." <<SigCapsulesRoutes>> as SigCapsulesRoutes
rectangle "==Tap slot\\n<size:10>[sig_service_set_tap, sig_service_tap_emit]</size>\\n\\nHolds the optional observer for the signal tap. sig_service_set_tap is\\nsafe from any thread at any time; the function and its context change\\ntogether atomically, and a replaced tap may still be running on the\\nservice thread when the call returns. With no tap the cost on the signal\\npath is one atomic pointer load. sig_service_tap_emit is called by the\\ncapsule on output and by the delivery loop before an input handler; it\\nis not for capsule code." <<SigServiceTap>> as SigServiceTap
rectangle "==Signal queue\\n<size:10>[sig_service_enqueue; sig_ll under a mutex]</size>\\n\\nsig_service_enqueue copies the signal (sig_value_dup) into a heap-owned\\nentry, pushes it under the queue lock and signals the queue condition\\nvariable. Safe from any thread, including the thread of the service\\nitself; the sender keeps ownership of what it passed. Delivery is\\nasynchronous and FIFO per destination service. A service accepts\\nsignals from creation until stop begins; from then until the next start\\nit returns SIG_ERR_STATE and drops the signal. A handler that emits\\nduring the final drain at stop gets SIG_ERR_STATE, so a chain of\\ncapsules inside the service is cut at the first hop." <<SigServiceQueue>> as SigServiceQueue
rectangle "==Values\\n<size:10>[sig_value.h]</size>\\n\\nsig_value: int, bool, double, string, bytes, and map and list containers\\n(backed by sig_ht and sig_ll). Strings, bytes and containers are\\nreference counted; sig_value_copy shares them and sig_value_dup deep\\ncopies. A shared container is frozen: mutators return SIG_ERR_STATE\\nuntil the other handles are released or the value is duplicated. A\\ncontainer must be mutated by one thread at a time; no locking is\\nadded. Nesting is limited to SIG_VALUE_MAX_DEPTH (32) for dup and\\nJSON." <<SigFoundationValues>> as SigFoundationValues
rectangle "==Worker thread\\n<size:10>[service_thread_main; sig_thread]</size>\\n\\nOne thread per started, non-driven service. It waits on the queue\\ncondition variable, with a timed wait to the next job deadline, so an\\nidle service uses no CPU. Each pass delivers the batch of queued signals\\nand then runs the jobs that are due, both outside the queue lock. The\\nthread exits once the service is not running and the queue is empty.\\nTerminal handlers and jobs run here, which is why an instance belongs to\\nthis thread." <<SigServiceWorker>> as SigServiceWorker
rectangle "==Terminal handlers\\n<size:10>[sig_terminal, sig_terminal_fn]</size>\\n\\nA terminal is a name plus, for inputs, a handler\\n(instance, signal, terminal name) that returns a status. Handlers run\\non the thread of the destination service (the loop thread when\\nservices are driven), not on the emitter.\\nThe signal is borrowed for the call; the queue owns the copy." <<SigCapsulesTerminals>> as SigCapsulesTerminals

SigCapsulesCapsule .[#8D8D8D,thickness=2].> SigCapsulesRoutes : <color:#8D8D8D>Capsule code calls sig_capsule_instance_notify(src, 'out', &value): from a handler or job on the worker of the source service, or from a start/stop hook on the thread that called start/stop
SigCapsulesRoutes .[#8D8D8D,thickness=2].> SigServiceTap : <color:#8D8D8D>Output tap point: sig_service_tap_emit(SIG_TAP_OUTPUT) before the route lookup, so unrouted outputs are seen too; one atomic load if no tap is set
SigCapsulesRoutes .[#8D8D8D,thickness=2].> SigServiceQueue : <color:#8D8D8D>For each route: the input terminal is found by name on the destination capsule, then sig_service_enqueue on the service of the destination (no route: the signal is dropped; one failure does not stop the others)
SigServiceQueue .[#8D8D8D,thickness=2].> SigFoundationValues : <color:#8D8D8D>sig_value_dup deep-copies the signal into a queue entry, so the sender keeps ownership and does not wait for the receiver to run
SigServiceQueue .[#8D8D8D,thickness=2].> SigServiceWorker : <color:#8D8D8D>Pushed under the queue lock, queue condition variable notified (a driven service calls its wake callback instead)
SigServiceWorker .[#8D8D8D,thickness=2].> SigServiceTap : <color:#8D8D8D>Input tap point: sig_service_tap_emit(SIG_TAP_INPUT) just before the handler, on this worker thread
SigServiceWorker .[#8D8D8D,thickness=2].> SigCapsulesTerminals : <color:#8D8D8D>terminal->handler(instance, &copy, terminal_name) runs on the thread of the destination service; the copy is destroyed afterwards
@enduml
`;default:throw Error(`Unknown viewId: `+e)}};export{e as pumlSource};