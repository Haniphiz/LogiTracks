# Deploy & CI/CD — Setup

Dokumentasi singkat untuk CI/CD yang baru di `.github/workflows/ci-cd.yml`.

## Secrets yang harus ditambahkan di GitHub (Settings → Secrets)

- `VPS_HOST` — IP atau hostname VPS (contoh: `1.2.3.4`)
- `VPS_USER` — user SSH untuk deploy (contoh: `deploy`)
- `VPS_PORT` — (opsional) port SSH, default 22
- `SSH_PRIVATE_KEY` — private key yang cocok dengan public key di `/home/<user>/.ssh/authorized_keys` pada VPS
- `CONTAINER_NAME` — (opsional) nama container yang akan dijalankan pada server (default: `app`)
- `GHCR_USERNAME` — (opsional) username untuk GHCR (biasanya GitHub username) — diperlukan jika image private
- `GHCR_TOKEN` — (opsional) personal access token with `read:packages` to pull private GHCR images

> Jangan pernah menyimpan private key atau token di repo; gunakan GitHub Secrets.

## Persiapan server (Ubuntu/Debian)

1. Buat user deploy: `sudo adduser deploy` dan tambahkan ke grup jika perlu
2. Pasang Docker (server harus bisa menjalankan container):

```bash
# install docker
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "\nhttps://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# allow deploy user to run docker without sudo
sudo usermod -aG docker deploy
```

3. (Optional) Jika Anda menggunakan GHCR private images: buat GitHub PAT (`read:packages`) dan tambahkan sebagai secret `GHCR_TOKEN` dan set `GHCR_USERNAME`.

4. (Opsional) Jika perlu, konfigurasi firewall untuk mengizinkan port 9876:

```bash
sudo ufw allow 9876/tcp
```

## Bagaimana workflow sekarang bekerja

- `build` → menjalankan `npm run build` (Tailwind) untuk menghasilkan `dist/` dari `src/index.html` + `output.css`, kemudian membuat artifact `site-<sha>.tar.gz` dan upload sebagai artifact `site` (opsional), **atau** membangun image produksi dari `dist` dengan `Dockerfile.prod`.
- `deploy` → jika menggunakan Docker: CI menyimpan `logitrack.tar.gz` (image) dan `docker-compose.yml` akan di-`scp` ke server, ssh: `docker load < logitrack.tar.gz`, lalu `docker-compose up -d` (container memetakan `9876:80`).

Catatan: workflow sekarang **secara eksplisit menjalankan `npm run build`** sebelum membangun image produksi, sehingga Tailwind dijalankan di CI dan `dist/` yang dihasilkan disertakan dalam image (via `Dockerfile.prod`).

## Secrets yang harus ditambahkan di GitHub (Settings → Secrets)

- `VPS_HOST` — IP atau hostname VPS (contoh: `1.2.3.4`)
- `VPS_USER` — user SSH untuk deploy (contoh: `deploy`)
- `VPS_PORT` — (opsional) port SSH, default 22
- `SSH_PRIVATE_KEY` — private key yang cocok dengan public key di `/home/<user>/.ssh/authorized_keys` pada VPS
- `CONTAINER_NAME` — (opsional) nama container yang akan dijalankan pada server (default: `logitrack-app`)

> Jangan pernah menyimpan private key atau token di repo; gunakan GitHub Secrets.

## Persiapan server tambahan (Docker + Compose)

1. Install Docker & Docker Compose (if needed):

```bash
# install docker
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "\nhttps://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# allow deploy user to run docker without sudo
sudo usermod -aG docker deploy
```

2. Pastikan port `9876` dibuka di firewall:

```bash
sudo ufw allow 9876/tcp
```

## Cara mengetes

- Push ke branch `main` atau `master` (workflow akan dijalankan dan, jika berhasil, akan mendeploy ke server)
- Atau jalankan `Run workflow` secara manual dari tab Actions

---

## Rollback singkat (manual)

Jika deployment baru gagal, Anda dapat melakukan rollback cepat dengan salah satu cara berikut:

- Lihat backup image yang tersedia di server:

```bash
docker images logitrack --format "{{.Repository}}:{{.Tag}}" | grep backup || true
```

- Jalankan container dari backup terbaru (contoh: `logitrack:backup-20250101-120000`):

```bash
docker rm -f logitrack-app || true
docker run -d --name logitrack-app -p 9876:9876 logitrack:backup-<tag>
```

- Atau gunakan `docker-compose` dengan tag backup (edit `docker-compose.yml` untuk gunakan `image: logitrack:backup-<tag>` lalu jalankan):

```bash
docker-compose down || true
docker-compose up -d
```

> Catatan: Anda dapat membersihkan backup lama dengan `docker rmi` jika perlu.

---

Jika mau, saya bisa menambahkan proteksi environment `production` di GitHub (reviewer required) dan langkah otomatisasi rollback. Beri tahu opsi yang Anda inginkan.
