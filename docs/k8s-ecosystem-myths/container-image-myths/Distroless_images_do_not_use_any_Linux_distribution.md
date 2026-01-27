---
sidebar_position: 6
---
# Myth: Distroless images do not use any Linux distribution

I have personally asked candidates what runs inside a distroless image. A common answer is:

*“There is no OS at all — just the application binary.”*

In production incidents, I’ve also seen teams panic when they `kubectl exec` into a distroless container and find nothing — no shell, no tools, no package manager. The conclusion is often:

*“This image doesn’t even have Linux inside.”*

That assumption is understandable — but incorrect.

### Why This Myth Exists?

Several factors contribute to this misunderstanding:

    - The term “distroless” sounds like “distribution-less”.
    - There is no shell (`/bin/sh`, `bash`) available.
    - No package managers (`apt`, `yum`, `apk`) exist.
    - Standard debugging tools (`ps`, `ls`, `curl`) are missing.

From a developer’s perspective, it feels like there is no operating system at all. But absence of tooling does not mean absence of a Linux distribution.


### The Reality

Distroless images **do use a Linux distribution**.

Most distroless images are built from Debian and include only the minimum runtime components required by the application, such as:

    - glibc
    - CA certificates
    - Runtime libraries (language-specific)
    - Minimal filesystem layout

What is intentionally removed:

    - Shells (bash, sh)
    - Package managers
    - Debugging and admin tools
    - Build-time dependencies

In other words:

**Distroless images are not OS-free — they are OS-minimized.**

They rely on the Linux kernel provided by the container runtime (via the host) and still use Linux user-space libraries to function correctly.

### Experiment & Validate

**Step 1: Pull a Distroless Image**

Pull an official distroless base image:

```bash
docker pull gcr.io/distroless/base-debian12
```

This image is advertised as distroless, meaning no shell or package manager.

**Step 2: Try to Run a Shell (Expected Failure)**

Attempt to start a shell inside the container:

```bash
docker run --rm -it gcr.io/distroless/base-debian12 /bin/sh
```

You will see an error similar to:

```bash
exec: "/bin/sh": stat /bin/sh: no such file or directory
```

This confirms absence of userland tools, not absence of Linux.

**Step 3: Inspect Image Layers**

Inspect the image layers to see what is actually present:

```bash
docker image inspect gcr.io/distroless/base-debian12
```

You will observe multiple filesystem layers originating from Debian base images.

This already disproves the idea that the image is OS-free.


### Key Takeaways

- Distroless images do include a Linux distribution, commonly Debian.

- “Distroless” means no userland tools, not “no OS”.

- Smaller images reduce attack surface and CVEs.

- Debugging must be planned using logs, metrics, and sidecars.

- Understanding this prevents incorrect security and compliance assumptions.

Knowing what actually exists inside your container images helps you design better, safer, and more debuggable Kubernetes platforms.