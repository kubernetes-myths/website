---
sidebar_position: 4
---
# Myth: Configuration Can Be Injected at Any Time Into a Running Pod

During a production rollout, a team updated a `ConfigMap` to change a feature flag from `false` to `true`. The expectation was simple: flip the config, and the feature becomes active instantly.

The `ConfigMap` showed the updated value.
The Pod was healthy.
No errors in logs.

But the feature never activated.

After hours of debugging networking, caching, and even container image versions, the real issue surfaced: the application was reading the configuration only at startup. The Pod was never restarted.

The assumption that Kubernetes dynamically injects configuration into a running process caused unnecessary downtime and confusion.

### Why This Myth Exists?

This myth exists because:

  - `ConfigMap` and `Secret` objects can be updated at runtime.

  - Kubernetes automatically updates mounted `ConfigMap` volumes.

  - `Helm` upgrades and `GitOps` workflows make configuration changes feel dynamic.

  - The Kubernetes API reflects the updated configuration immediately.

These behaviors create the illusion that configuration changes propagate automatically into the application runtime.

However, Kubernetes updates the resource, not the application process.

### The Reality: 

Kubernetes does not reconfigure your running application. It only manages declarative state.

How configuration behaves depends on how it is injected.

**Case 1: Configuration via Environment Variables**

Example:

```yaml
env:
  - name: DB_HOST
    valueFrom:
      configMapKeyRef:
        name: app-config
        key: db_host
```

Environment variables are resolved when the container starts.

If the ConfigMap is updated:

- The Pod continues running.

- The environment variable does not change.

- The application does not see the new value.

A Pod restart is required.

**Case 2: Configuration via Volume Mount**

Example:

```yaml
volumeMounts:
  - name: config
    mountPath: /etc/config
volumes:
  - name: config
    configMap:
      name: app-config
```

In this case:

- Kubernetes updates the mounted file when the ConfigMap changes (eventually consistent).

- The file inside /etc/config is refreshed.

- However, the application must explicitly re-read the file.

If the application:

- Reads the file only once at startup --> No change observed.

- Watches the file for changes --> Update detected.

- Reloads on SIGHUP --> Update applied.

- Periodically polls the file --> Update eventually used.

Kubernetes does not force the process to reload configuration.

### Experiment & Validate

**Step 1: Create a ConfigMap**
```bash
kubectl create configmap demo-config --from-literal=mode=INFO
```

**Step 2: Deploy a Pod that prints the value**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: config-test
spec:
  containers:
    - name: test
      image: busybox
      command: ["/bin/sh", "-c", "echo $MODE && sleep 3600"]
      env:
        - name: MODE
          valueFrom:
            configMapKeyRef:
              name: demo-config
              key: mode
```

Check logs:

```bash
kubectl logs config-test
```

Output:

```bash
INFO
```

**Step 3: Update the ConfigMap**

```bash
kubectl create configmap demo-config --from-literal=mode=DEBUG -o yaml --dry-run=client | kubectl apply -f -
```

Now check:

```bash
kubectl logs config-test
```

Output remains:

```bash
INFO
```

Even though:

```bash
kubectl get configmap demo-config -o yaml
```

Shows:

```bash
mode: DEBUG
```

The running container still uses the old value.

Only after:

```bash
kubectl delete pod config-test
```

The new Pod prints:

```bash
DEBUG
```

This validates that environment variable-based config requires a restart.

### Key Takeaways

- Kubernetes updates ConfigMap and Secret resources, not running processes.

- Environment variables are immutable for a running container.

- Volume-mounted ConfigMaps update files, but applications must reload them.

- Config changes should be treated like versioned deployments.

- Production systems must explicitly design for configuration reload behavior.

- Rolling restarts are often the safest and most predictable pattern.

Kubernetes guarantees declarative infrastructure state.
It does not guarantee dynamic runtime reconfiguration of application