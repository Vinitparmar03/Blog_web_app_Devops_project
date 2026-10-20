# 📝 Blog Web App – Next.js DevOps Project

## 📌 About the Project

**Blog Web App** is a full-stack blog application built with **Next.js** and used as the foundation for my **DevOps and Cloud learning project**.

The original application was created by **Patel MernStack**, and this repository is based on that project. I have used the application as a foundation to learn and implement various DevOps and Cloud technologies, including **Docker, Kubernetes, Prometheus, and Grafana**.

## 🙏 Appreciation & Credits

I would like to sincerely thank **Patel MernStack** for creating and sharing the original Blog Web App project.

**Original GitHub Repository:**  
https://github.com/devxpatel12/blogapp

**YouTube Channel:**  
https://www.youtube.com/@patelmernstack

> **Credits:** The original application and its source code belong to the original creator, **Patel MernStack**. This repository uses the project as a foundation for educational and DevOps learning purposes. The DevOps configurations, monitoring, and related implementations in this repository were added for learning and practice.

## 🐳 Running the Project with Docker Compose

You can run the complete application locally using **Docker Compose**.

### 1. Create Environment Files

First, create a `.env` file in both the **frontend** and **backend** directories.

The required environment variables are already listed in the respective `env.example` files.

Use these files as a reference to know which values you need to provide.

**Frontend:**

```bash
cp .env.example .env
cp .env.local.example .env
```

Then update the `.env` files with your required configuration values.

### 2. Start the Application

After configuring the environment variables, navigate to the Docker Compose directory:

```bash
cd docker-compose
```

Run the following command:

```bash
docker compose --env-file ../.env.local -f docker-compose.yml up --build
```

The `--build` option ensures that Docker rebuilds the frontend and backend images before starting the services.

### 3. Access the Application

Once all services are successfully started, open your browser and visit:

```text
http://localhost:3000
```

The application should now be available locally.

### 4. Stop the Services

To stop the running containers, press:

```text
Ctrl + C
```

Or, if the containers are running in detached mode:

```bash
docker compose -f docker-compose.yml down
```

---

# 🐳 Build and Push Docker Images to Docker Hub

Before deploying the application on Kubernetes, build the Docker images using the Kubernetes-specific Docker Compose file and push them to your Docker Hub repository.

The Docker Compose file used for Kubernetes images is:

```text
docker-compose/docker-compose-k8s.yml
```

### 1. Login to Docker Hub

First, login to Docker Hub:

```bash
docker login
```

Enter your Docker Hub username and password/access token.

### 2. Build the Docker Images

From the project root, navigate to the Docker Compose directory:

```bash
cd docker-compose
```

Build the images using:

```bash
docker compose --env-file ../.env.local -f docker-compose-k8s.yml build
```

### 3. Push the Images to Docker Hub

Push the tagged image to your Docker Hub repository:

```bash
docker compose -f docker-compose-k8s.yml push
```

After successfully pushing the images, make sure the Kubernetes Deployment YAML files use the same Docker Hub image name.

---

## ☸️ Running the Project on Kubernetes with Minikube

Blog app can also be deployed locally using **Kubernetes and Minikube**.

The Kubernetes setup includes:

- Blog web app Deployment & Service
- Kubernetes Ingress
- Kubernetes Secrets
- Horizontal Pod Autoscaler (HPA)
- NGINX Ingress Controller
- Prometheus
- Grafana
- ServiceMonitor

---

## 1. Start Minikube

First, make sure Minikube is installed and start the cluster:

```bash
minikube start
```

Check the Minikube cluster:

```bash
minikube status
```

---

## 2. Configure Local Hostnames

After starting Minikube, find its IP address:

```bash
minikube ip
```

For example, if Minikube returns:

```text
192.168.49.2
```

you need to map this IP address to the Blogwebapp, Prometheus, and Grafana hostnames in your `/etc/hosts` file.

Open the file:

```bash
sudo nano /etc/hosts
```

Add:

```text
192.168.49.2    blogwebapp.com
192.168.49.2    prometheus.blogwebapp.com
192.168.49.2    grafana.blogwebapp.com
```

Save the file.

> **Note:** The Minikube IP can be different on your machine. Always use the IP returned by `minikube ip`.

---

## 3. Configure Kubernetes Secrets

The repository contains a `k8s/secret/` directory containing the required Kubernetes Secret and configuration files.

These include:

- Authentication (Clerk) Secret
- Cloudinary Secret
- Database Secret

Before applying the Kubernetes manifests, update the values in these files with your own credentials and configuration.

For example:

```yaml
stringData:
  DATABASE_URL: NEON_POSTGRES_URL
```

Replace the placeholder values with your actual values.

---

## 5. Install NGINX Ingress Controller

Enable the NGINX Ingress Controller in Minikube:

```bash
minikube addons enable ingress
```

Check that the controller is running:

```bash
kubectl get pods -n ingress-nginx
```

---

## 6. Install Prometheus and Grafana Using Helm

Add the Prometheus Community Helm repository:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
```

Update the Helm repositories:

```bash
helm repo update
```

Create the monitoring namespace:

```bash
kubectl create namespace monitoring
```

Install the `kube-prometheus-stack`:

```bash
helm install monitoring \
  prometheus-community/kube-prometheus-stack \
  -n monitoring \
  -f ./k8s/monitoring/values.yml
```

This installs the monitoring stack, including **Prometheus and Grafana**, into the `monitoring` namespace.

Check the monitoring pods:

```bash
kubectl get pods -n monitoring
```

---

## 7. Deploy the Application

Once the required configuration has been updated, apply the Kubernetes manifests.

From the project root, run:

```bash
kubectl apply -f ./k8s/blog_webapp
kubectl apply -f ./k8s/ingress/ingress.yml
kubectl apply -f ./k8s/monitoring/service_monitor.yml
```

Apply your Secrets/ConfigMaps as well if they are stored separately:

```bash
kubectl apply -f ./k8s/secrets
```

---

## 8. Verify the Deployment

Check all pods:

```bash
kubectl get pods
```

Check services:

```bash
kubectl get services
```

Check the Ingress:

```bash
kubectl get ingress
```

Check HPA:

```bash
kubectl get hpa
```

Check Prometheus and Grafana:

```bash
kubectl get pods -n monitoring
```

---

## 9. Access the Applications

Once everything is running, you can access the applications using the hostnames configured in `/etc/hosts`.

### 📝 Blogwebapp

```text
http://blogwebapp.com
```

### 📊 Prometheus

```text
http://prometheus.blogwebapp.com
```

### 📈 Grafana

```text
http://grafana.blogwebapp.com
```

For the local Grafana configuration above:

```text
Username: admin
Password: admin
```

> ⚠️ Change the default Grafana password when using this setup beyond local development.

---

## 🔍 Useful Kubernetes Commands

View all resources:

```bash
kubectl get all
```

View resources in the monitoring namespace:

```bash
kubectl get all -n monitoring
```

View pod logs:

```bash
kubectl logs <pod-name>
```

Describe a pod:

```bash
kubectl describe pod <pod-name>
```

Check HPA:

```bash
kubectl get hpa
```

Check Ingress:

```bash
kubectl describe ingress
```

---

## 🧹 Remove the Kubernetes Deployment

To remove the application resources:

```bash
kubectl delete -f ./k8s/blog_webapp
kubectl delete -f ./k8s/ingress/ingress.yml
kubectl delete -f ./k8s/monitoring/service_monitor.yml
kubectl delete -f ./k8s/secrets
```

To remove the monitoring stack:

```bash
helm uninstall monitoring -n monitoring
```

To stop Minikube:

```bash
minikube stop
```