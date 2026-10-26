#ifndef D_H
#define D_H

/* Threading contract:
 *
 * - start() runs hooks on the calling thread.
 * - stop() joins first. */

typedef struct sig_service sig_service;

SIG_PUBLIC void sig_service_destroy(sig_service *svc);
#endif
