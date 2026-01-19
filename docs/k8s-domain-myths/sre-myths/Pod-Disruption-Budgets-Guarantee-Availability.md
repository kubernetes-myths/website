---
sidebar_position: 3
---
# Myth: Pod Disruption Budgets(PDB) Guarantee Availability

A production API was running with three replicas and a PodDisruptionBudget configured with `minAvailable: 2`.

When a worker node crashed unexpectedly, two pods disappeared instantly. Kubernetes created replacement pods, but they took time to start and pass readiness checks. During this window, the single remaining pod handled all traffic, leading to increased latency and intermittent errors.

The service recovered once the new pods became ready, but the SLO was already breached.

In the postmortem, the key realization was simple:

```shell
“The PDB worked exactly as designed — it just wasn’t involved.”
```

The outage happened during recovery, not after it.

### Why This Myth Exists?

This myth persists because Kubernetes behavior appears reassuring:

    - Deployments eventually reconcile to the desired replica count
    - PDB terminology (minAvailable) suggests uptime guarantees
    - Managed Kubernetes upgrades respect PDBs, reinforcing trust
    - Many post-incident dashboards look healthy after recovery

However, Kubernetes focuses on state convergence, not time-bound availability guarantees.

Availability loss occurs during convergence, not after it.

### The Reality

A `PodDisruptionBudget` only limits voluntary disruptions.

PDBs are enforced only when Kubernetes processes eviction requests through the Eviction API.

PDBs apply to:

    - `kubectl drain`
    - Cluster autoscaler scale-down
    - Managed node upgrades
    - Administrative pod evictions

PDBs do NOT apply to:

    - Node crashes or kernel panics
    - Spot or preemptible node termination
    - OOM kills
    - Application crashes
    - Readiness probe failures
    - Network partitions
    - Zone or region outages
    - Manual pod deletions

In these scenarios, pods disappear without eviction.

The PDB is never consulted.

The Deployment controller will attempt to restore replicas, but restoration is not instantaneous and does not prevent transient unavailability.

### Experiment & Validate

Example Configuration

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: api:1.0

apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: api-pdb
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: api
```

**Scenario 1: Voluntary Disruption**

    - Run `kubectl drain node-1`

    - Kubernetes issues eviction requests

    - PDB blocks evictions that violate minAvailable

Result: PDB functions correctly.

**Scenario 2: Node Failure**

    - Node crashes unexpectedly

    - Two pods disappear immediately

    - No eviction requests are made

    - Replacement pods are scheduled later

Result:

    - Availability drops during rescheduling and startup
    - PDB has no effect
    - Replica recovery occurs after impact

**Scenario 3: OOM Kill**

    - Pod exceeds memory limit

    - Kubelet terminates the container

    - Pod restarts repeatedly

Result:

    - Service experiences partial unavailability
    - PDB is not involved

### Key Takeaways

    - PodDisruptionBudgets do not guarantee availability
    - They only limit voluntary evictions
    - Deployments restore replicas eventually, not instantly
    - Availability can be lost during:
        - Rescheduling
        - Cold starts
        - Load redistribution
    - Most production outages are involuntary
    - Misconfigured PDBs can delay maintenance and increase risk