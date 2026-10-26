#ifndef SIG_TAP_H
#define SIG_TAP_H

#ifdef __cplusplus
extern "C" {
#endif

/* A tap observes every signal. */
typedef enum { SIG_TAP_INPUT, SIG_TAP_OUTPUT } sig_tap_direction;

typedef void (*sig_tap_fn)(void *ctx, const sig_service *service, const sig_capsule_instance *instance,
                           sig_tap_direction dir, const char *terminal, const sig_value *signal);

#ifdef __cplusplus
}
#endif

#endif /* SIG_TAP_H */
