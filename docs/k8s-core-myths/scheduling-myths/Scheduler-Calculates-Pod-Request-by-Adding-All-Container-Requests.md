---
sidebar_position: 7
---
# Myth: Scheduler Calculates Pod Request by Adding All Container Requests

This question often comes up in interviews and Kubernetes discussion

```yaml
“If a Pod has an init container requesting 2 CPU and application containers requesting 500m CPU and 1 CPU, how much CPU does the scheduler consider?”
```
Most people quickly calculate:

**2 (init) + 0.5 + 1 = 3.5 CPU**

and answer **3.5 CPU.**

It feels correct because Kubernetes is known for summing container resource requests.
However, when tested in a cluster, the Pod gets scheduled on a node with just 2 CPU available.

This creates confusion and challenges the assumption about how scheduling actually works.


### Why This Myth Exists?

This misconception comes from overgeneralizing a rule that is only partially true.

For application containers:

- Kubernetes calculates Pod resource requests as the sum of all application container requests

In this case:

- 0.5 + 1 = 1.5 CPU

People then assume:

- Init containers are simply added to this total

The key detail that gets missed is that Kubernetes treats init containers differently due to their execution model.

### The Reality

The Kubernetes scheduler evaluates the maximum resource requirement at any point in the Pod lifecycle, not the cumulative total.

The effective Pod request is:

- Maximum of:
  - Sum of all application container requests
  - Maximum request among init containers

This is because:

- Init containers run sequentially
- Application containers run concurrently

So Kubernetes reserves resources for the highest demand at any moment, not across all phases combined.

**Example**

Init Container: 2 CPU

Application Container One: 0.5 CPU

Application Container Two: 1 CPU

Sum of application containers = 1.5 CPU

Maximum init container request = 2 CPU

Final scheduling requirement:
- Pod request = max(1.5, 2) = 2 CPU

Not 3.5 CPU.

### Experiment & Validate

This experiment demonstrates that the scheduler uses max(init, sum(app)), not the total sum.

**Step 1: Create a Pod**

Apply the following Pod:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: scheduling-myth-demo
spec:
  restartPolicy: Never

  initContainers:
  - name: init-heavy
    image: busybox
    command: ["sh", "-c", "sleep 30"]
    resources:
      requests:
        cpu: "2"

  containers:
  - name: app-1
    image: busybox
    command: ["sh", "-c", "sleep 300"]
    resources:
      requests:
        cpu: "500m"

  - name: app-2
    image: busybox
    command: ["sh", "-c", "sleep 300"]
    resources:
      requests:
        cpu: "1"
```

```bash
kubectl apply -f pod.yaml
```

**Step 2: Check Scheduling Decision**

```bash
kubectl describe pod scheduling-myth-demo
```

Look for:

```bash
Requests:
  cpu: 2
```

This confirms:

- Scheduler used 2 CPU, not 3.5 CPU

### Key Takeaways
- Kubernetes scheduler does not sum all container requests together

- Application containers are summed, but init containers are evaluated separately

- Scheduling is based on peak resource requirement during lifecycle

- This often leads to over-reservation after init containers complete

- Misunderstanding this can impact cluster efficiency and capacity planning