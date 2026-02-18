---
sidebar_position: 2
---
# Myth: Kubernetes Guarantees Application Self-Healing

During an on-call incident, alerts showed pods continuously restarting, nodes were healthy, and Kubernetes reported everything as “Running.”

Yet users were still seeing errors and timeouts.

The common conclusion during the incident review was:

*“Kubernetes should have self-healed this.”*

It hadn’t.

It simply kept restarting the same broken application.

### Why This Myth Exists?

This myth is reinforced by Kubernetes features that appear intelligent:

- Controllers continuously reconcile desired state

Pods are automatically restarted on crashes

Failed nodes trigger pod rescheduling

Marketing and conference talks overuse the term self-healing

Over time, this creates the belief that Kubernetes understands and heals application failures.

It does not.

### The Reality

Kubernetes does not heal applications, It just restart it.

It enforces desired state.

Kubernetes has no concept of:

-   Correct business behavior

Dependency health

Partial failures

Performance degradation

Data corruption

Logical deadlocks

From Kubernetes’ perspective, an application is healthy as long as:

The container process is running

Probes (if configured) return success

If a pod is alive but wrong, Kubernetes considers the job done.

### Experiment & Validate

**Step 1: Deploy an Application**

Create a Deployment with a simple container image.

```shell
kubectl create deployment upgrade-demo --image=nginx:1.25
```

Wait for the Pod to be ready:

```shell
kubectl get pods -l app=upgrade-demo
```

Note the Pod name and UID.

**Step 2: Trigger an “Upgrade”**

Update the container image version:

```shell
kubectl set image deployment/upgrade-demo nginx=nginx:1.26
```

**Step 3: Observe the Rollout**

Watch Pods during the update:

```shell
kubectl get pods -l app=upgrade-demo -w
```


You will see:

- Old Pod terminating
- New Pod being created
- New Pod has a different name and UID

**Step 4: Verify Pod Replacement**

Check the Deployment history:

```shell
kubectl rollout history deployment/upgrade-demo
```

Kubernetes created a new ReplicaSet, not an upgraded Pod.

### Key Takeaways

- Kubernetes never upgrades a running application instance

- Pods and containers are immutable

- Rolling updates are controlled replacements

- Application continuity is achieved through redundancy, not mutation

- Applications must be designed to tolerate replacement at any time