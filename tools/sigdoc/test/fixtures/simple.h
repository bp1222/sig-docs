#ifndef SIMPLE_H
#define SIMPLE_H

#ifdef __cplusplus
extern "C" {
#endif

/* Read-only view of the service name. The pointer is owned by the
 * service and stays valid until sig_service_destroy(). */
SIG_PUBLIC const char *sig_service_name(const sig_service *svc);

SIG_PUBLIC void sig_service_destroy(void);

#ifdef __cplusplus
}
#endif

#endif /* SIMPLE_H */
