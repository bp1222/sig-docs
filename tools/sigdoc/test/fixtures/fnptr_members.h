typedef struct { void (*cb)(int); } vt;

typedef struct sig_ops {
    int (*open)(const char *path);
    void (*close)(int fd);
} sig_ops;

typedef enum { A, B } sig_kind;

struct sig_tagged {
    void (*cb)(void);
};

typedef void (*sig_tap_fn)(void *ctx, int x);
