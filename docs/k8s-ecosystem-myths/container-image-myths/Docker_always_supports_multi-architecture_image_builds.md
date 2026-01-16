---
sidebar_position: 4
---
# Myth: Docker always supports multi-architecture image builds

I hit this issue while working on a Linux machine running Docker 28.x. The Docker version was recent, the `--platform` flag was supported, and multi-arch images were already running fine in Kubernetes.

So I tried to build a multi-architecture image locally:

```bash
docker build --platform linux/amd64,linux/arm64 -t myapp:multi .
```

Instead of success, Docker failed immediately:

```bash
Multi-platform build is not supported for the docker driver
```

This was confusing. The Docker version was modern. The command was valid. And yet, multi-arch builds clearly were not working.

This exact confusion shows up frequently in interviews and production CI failures, where engineers assume Docker itself is broken or outdated.

### Why This Myth Exists?

This myth exists because Docker has supported running multi-architecture images for a long time.

Commands like:

```bash
docker run nginx
```

work seamlessly on different architectures.

Behind the scenes, Docker pulls an OCI manifest list from the registry and automatically selects the correct architecture-specific image.

This makes it feel like Docker universally supports multi-architecture workflows.

The critical detail most people miss is the difference between **running images** and **building images**.


### The Reality

Docker supports multi-architecture image builds **only when the builder and image store support it**.

On Linux, Docker uses by default:

    - The legacy docker builder
    - The classic Docker image store

This combination:

    - Cannot create OCI manifest lists
    - Cannot store multi-architecture images locally

Multi-architecture images are not single images. They are manifest lists that reference multiple architecture-specific images.

Only BuildKit-based builders can generate these artifacts correctly.


### Experiment & Validate

**Step 1: Create a Minimal Dockerfile**

```dockerfile
FROM busybox
CMD ["echo", "Hello from multi-arch image"]
```

This image is intentionally simple. No QEMU tricks. No language runtimes. Only architecture resolution.

**Step 2: Attempt Multi-Arch Build with docker build (Expected Failure)**

```bash
docker build \
  --platform linux/amd64,linux/arm64 \
  -t demo:multi .
```

Observed Result:

```bash
ERROR: Multi-platform build is not supported for the docker driver
```

Why it fails:

    - `docker build` uses the legacy docker builder
    - The legacy builder cannot create OCI manifest lists
    - Multi-architecture output requires a manifest list
    - The failure occurs before any build step is executed.

**Step 3: Build the Same Image Using docker buildx (Expected Success)**

Create and activate a BuildKit-based builder:

```bash
docker buildx create --name multiarch --use
docker buildx inspect --bootstrap
```

**Now build the image:**

```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t demo:multi \
  --push .
```

Observed Result:

    - One image built for linux/amd64
    - One image built for linux/arm64
    - A single OCI manifest list created and pushed to the registry

**Step 4: Validate the Manifest List**

```bash
docker buildx imagetools inspect demo:multi
```

Expected output (simplified):

```yaml
Name: demo:multi
MediaType: application/vnd.oci.image.index.v1+json


Manifests:
  - linux/amd64
  - linux/arm64
```

This confirms that the image is not a single image, but a manifest list referencing multiple architectures.


### Key Takeaways
- Docker does not always support multi-architecture builds by default

- Multi-architecture images are OCI manifest lists, not single images

- Docker version alone does not enable multi-arch builds

- The builder and image store decide what is possible

- `docker buildx` is the production-grade solution