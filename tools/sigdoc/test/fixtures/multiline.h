#include "x.h"

SIG_PUBLIC sig_status_t sig_poller_wait(sig_poller *p, int timeout_ms, sig_poller_event *out, size_t max,
                                        size_t *out_n);

/* Walks every item; fn is called for each. */
SIG_PUBLIC sig_status_t sig_walk(const sig_thing *t, void (*cb)(void *ctx, const char *name),
                                 void *ctx,
                                 sig_visit_fn visit);

SIG_PUBLIC sig_status_t sig_mgmt_put_configuration(sig_mgmt *m, const char *name, const char *doc,
                                                   size_t doc_len, bool *created, sig_value *out,
                                                   char *errmsg, size_t errmsg_len);
