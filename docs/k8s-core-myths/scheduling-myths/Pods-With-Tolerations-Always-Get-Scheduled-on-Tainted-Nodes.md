---
sidebar_position: 6
---
# Myth: Pods With Tolerations Always Get Scheduled on Tainted Nodes

In many Kubernetes community discussions and Q&A forums, engineers often ask a similar question:

*“If I taint two nodes and add a toleration to my Pod, will the Pod run on those nodes?”* 

The common response from many beginners is yes. The reasoning usually sounds logical: if a Pod tolerates a taint, the scheduler should place it on the tainted node.

This assumption is so widespread that it frequently appears in community discussions, certification preparation groups, and Kubernetes learning channels

### Why This Myth Exists?

The misunderstanding comes from assuming that **tolerations influence where the scheduler prefers to place Pods**.

Many engineers interpret the mechanism like this:

1. A node has a taint.

2. A Pod has a matching toleration.

3. Therefore the scheduler should place the Pod on that node.

This interpretation treats tolerations as **a scheduling preference or targeting mechanism**, which is not their actual purpose.

### The Reality

A toleration does not attract a Pod to a tainted node.

It simply allows the Pod to be scheduled on that node.

The Kubernetes scheduler works in two major stages:

1. **Filtering** – Remove nodes that are not eligible.

2. **Scoring** – Rank the remaining nodes and choose the best one.

Taints participate only in the filtering stage.

If a Pod does not tolerate a taint, the node is removed from consideration.

If a Pod does tolerate the taint, the node becomes eligible, but it is not preferred.

As a result, the scheduler can still choose any other suitable node in the cluster, including nodes without taints.

In simple terms:

- **Taint = Restriction**

- **Toleration = Permission**

It does not create preference.

### Experiment & Validate

Assume a cluster with:

- 10 nodes total

- 2 nodes tainted as:

```yaml
dedicated=gpu:NoSchedule
```

Apply the taint:

```sh
kubectl taint nodes node1 dedicated=gpu:NoSchedule
kubectl taint nodes node2 dedicated=gpu:NoSchedule
```

Create a Pod with a toleration:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: toleration-demo
spec:
  containers:
  - name: nginx
    image: nginx
  tolerations:
  - key: "dedicated"
    operator: "Equal"
    value: "gpu"
    effect: "NoSchedule"
```

Apply:

```sh
kubectl apply -f toleration.yaml
```

Now check where the Pod runs:

```sh
kubectl get pod toleration-demo -o wide
```

Possible results:

- Pod scheduled on one of the 8 normal nodes

- Pod scheduled on one of the 2 tainted nodes

Both outcomes are correct because the toleration simply removes the restriction.

### Key Takeaways

- Tolerations do not direct Pods to tainted nodes.

- They only allow Pods to bypass taint restrictions.

- Pods with tolerations can still run on non-tainted nodes.

- To force Pods onto specific nodes, combine tolerations with nodeSelector or nodeAffinity.

- Taints and tolerations are designed for node isolation, not workload placement.