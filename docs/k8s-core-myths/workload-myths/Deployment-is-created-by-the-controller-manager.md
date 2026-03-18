---
sidebar_position: 8
---
# Myth: Deployment is created by the controller-manager

To understand how Kubernetes actually works internally, I performed a simple experiment.

I intentionally observed the cluster behavior when kube-controller-manager was not running.

Then I applied a Deployment manifest:

```bash
kubectl apply -f deployment.yaml
```

Surprisingly:

- The Deployment was successfully created

- It was visible via `kubectl get deploy`

But:

- No ReplicaSet was created

- No Pods were created

This experiment clearly separated object creation from state reconciliation, leading to a deeper understanding of how Kubernetes components interact.

### Why This Myth Exists?

This misconception arises due to Kubernetes’ declarative nature and automation:

- Users apply a Deployment

- ReplicaSets and Pods appear automatically

This creates the illusion that a single component is responsible for everything.

Additionally:

- The term “Deployment controller” is misleading

- It suggests that the controller creates Deployments

**In reality, controllers do not create user-submitted resources—they only act on them.**

### The Reality: 

A Deployment is created entirely by the API server, not by the controller-manager.

When a Deployment manifest is submitted:

- The API server receives the request

- It validates the object (schema and admission controllers)

- It persists the Deployment in etcd

At this point, the Deployment exists in the cluster

The kube-controller-manager runs the Deployment controller, which:

- Watches Deployment objects

- Compares desired vs actual state

- Creates or updates ReplicaSets

So the responsibilities are clearly defined:

- API server --> creates and stores the Deployment

- Deployment controller --> reconciles the Deployment by managing ReplicaSets

### Experiment & Validate



**Step 1: Ensure controller-manager is not running**

Simulate or observe a cluster state where the controller-manager is unavailable.

**Step 2: Apply a Deployment**

```sh
kubectl apply -f deployment.yaml
```

**Step 3: Verify resources**

```bash
kubectl get deploy
kubectl get rs
kubectl get pods
```

**Expected Outcome**

- Deployment → Present

- ReplicaSet → Not present

- Pods → Not present

This validates that:

- Deployment creation is handled by the API server

- Controllers are required only for reconciliation

### Key Takeaways

- A Deployment is created when the API server stores it in etcd

- Controllers do not create primary resources submitted by users

- The Deployment controller only manages ReplicaSets

- Kubernetes separates responsibilities:

  - State storage (API server)

  - State reconciliation (controllers)

- Without controller-manager, the cluster accepts desired state but does not act on it