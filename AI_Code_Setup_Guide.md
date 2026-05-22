# 🛠️ Master Architecture Guide: Fully Local & Open-Source AI Setup

This guide provides an explicit, step-by-step blueprint for building a private, offline AI development environment. Follow each phase sequentially to configure your local backends and integrate them into VS Code or Visual Studio.

---

## 📋 Table of Contents
*   [Phase 1: Determine Your Hardware Capability](#phase-1-determine-your-hardware-capability)
*   [Phase 2: Install and Run Your Backend Inference Engine](#phase-2-install-and-run-your-backend-inference-engine)
    *   [Option A: Ollama Setup (Recommended / Easiest)](#option-a-ollama-setup-recommended--easiest)
    *   [Option B: llama.cpp Setup (Bare-Metal Efficiency)](#option-b-llamacpp-setup-bare-metal-efficiency)
    *   [Option C: vLLM Setup (High-Throughput Enterprise)](#option-c-vllm-setup-high-throughput-enterprise)
*   [Phase 3: Integrate with Your IDE / Code Editor](#phase-3-integrate-with-your-ide--code-editor)
    *   [Editor 1: VS Code Integration (Continue, Cline, or twinny)](#editor-1-vs-code-integration)
    *   [Editor 2: Visual Studio Integration (Copilot Override or twinny)](#editor-2-visual-studio-integration)
*   [Phase 4: Optimization & Troubleshooting](#phase-4-optimization--troubleshooting)
*   [Appendices: Reference Directories (Engines, Models, Agents)](#appendices-reference-directories)

---

## Phase 1: Determine Your Hardware Capability

To ensure usable generation speeds, check your computer's **System RAM** or **Graphics Memory (VRAM)** and stick to the corresponding model sizes.

*   **🥉 Low-Spec Laptops (8GB–16GB RAM / 4GB VRAM):** Use `1.3B` to `1.5B` parameter models. 
*   **🥈 Standard Dev Machines (16GB–32GB RAM / 6GB–12GB VRAM):** Use `6.7B` to `9B` parameter models. *(The absolute sweet-spot for local dev).*
*   **🥇 Power Workstations (32GB–64GB+ RAM / 16GB–24GB+ VRAM):** Use `14B`, `22B`, or `32B` parameter models.

---

## Phase 2: Install and Run Your Backend Inference Engine

Choose **ONE** backend inference engine below based on your preference and execute its steps.

### Option A: Ollama Setup (Recommended / Easiest)
Ollama runs as a background system service and automatically manages hardware offloading, context layers, and model quantization.

#### Step 2A.1: Install the Software
*   **Windows:** Download and run `OllamaSetup.exe` from [ollama.com](https://ollama.com).
*   **macOS:** Download the `.zip` file from the website, extract it, and drag the **Ollama** application icon into your `/Applications` directory.
*   **Linux:** Open a terminal window and run:
    ```bash
    curl -fsSL https://ollama.com | sh
    ```

#### Step 2A.2: Verify the Background Service
Look for the **Ollama icon** (a stylized llama) in your Windows system tray or Mac menu bar. Alternatively, open a web browser and visit:
*   **URL:** `http://localhost:11434`
*   **Expected Response:** A page reading `"Ollama is running"`.

#### Step 2A.3: Download Your AI Models
Open your system terminal (Command Prompt, PowerShell, or Bash) and execute the following commands one by one to download the weights:
```bash
# Pull the standard code assistant model
ollama pull deepseek-coder:6.7b

# Pull the agent-optimized model (Highly recommended for autonomous tasks)
ollama pull qwen2.5-coder:7b

# Pull the deep logical reasoning model for debugging complex bugs
ollama pull deepseek-r1:7b

# Pull the local embedding model used for repository codebase indexing
ollama pull nomic-embed-text
```

---

### Option B: llama.cpp Setup (Bare-Metal Efficiency)
Built in pure C/C++, `llama.cpp` executes standalone quantized `.gguf` files directly on your hardware without heavy wrapper engines.

#### Step 2B.1: Install the Core Binaries
Open your system terminal and use your native package manager to install the runtime tools:
*   **Windows (PowerShell):** `winget install llama.cpp`
*   **macOS / Linux:** `brew install llama.cpp`

#### Step 2B.2: Create a Dedicated Model Storage Folder
Run these commands to establish a predictable file directory for your models:
```bash
mkdir -p ~/local-ai-models/gguf-vault
cd ~/local-ai-models/gguf-vault
```

#### Step 2B.3: Download Quantized Weights Manually
1. Open your web browser and navigate to Hugging Face.
2. Search for a GGUF code model repository (e.g., `Qwen/Qwen2.5-Coder-7B-Instruct-GGUF`).
3. Click on the **Files and versions** tab.
4. Locate and download a medium-quantized file (look for files ending in `q4_k_m.gguf` or `q8_0.gguf`).
5. Move the downloaded `.gguf` file entirely into your newly created folder: `~/local-ai-models/gguf-vault/`

#### Step 2B.4: Launch the Local HTTP Server
Run the following command to spin up an OpenAI-compatible server. Adjust the `--threads` value to match your CPU cores, and name your file correctly:
```bash
llama-server --model ~/local-ai-models/gguf-vault/qwen2.5-coder-7b-instruct-q4_k_m.gguf --port 8080 --ctx-size 16384 --threads 8
```
*   **Active Server Target URL:** `http://localhost:8080`

---

### Option C: vLLM Setup (High-Throughput Enterprise)
vLLM uses PagedAttention memory management algorithms to maximize parallel requests and VRAM extraction. *(Requires a Linux environment or Windows Subsystem for Linux WSL2 with NVIDIA CUDA configured).*

#### Step 2C.1: Set Up an Isolated Python Environment
Open your terminal and create a clean environment space to prevent version conflicts:
```bash
python3 -m venv vllm-env
source vllm-env/bin/activate
```

#### Step 2C.2: Install vLLM
Upgrade pip and install the core framework dependencies:
```bash
pip install --upgrade pip
pip install vllm
```

#### Step 2C.3: Start the Production API Instance
Execute this command to launch the server. vLLM will automatically reach out, download the unquantized or AWQ tensor files, and pool them inside your GPU VRAM:
```bash
vllm serve Qwen/Qwen2.5-Coder-7B-Instruct --port 8000 --max-model-len 16384 --trust-remote-code
```
*   **Active Server Target URL:** `http://localhost:8000`

---

## Phase 3: Integrate with Your IDE / Code Editor

Now that your local backend server is running from Phase 2, follow the steps for your preferred code editor.

### Editor 1: VS Code Integration

Open **VS Code**, press `Ctrl + Shift + X` (`Cmd + Shift + X` on Mac) to open the Marketplace, and choose **ONE** extension below to configure.

#### 🧭 Extension choice 1: Continue (Balanced Assistant)
1. Search for **Continue** in the marketplace and click **Install**.
2. Click the **Continue spiral icon** in your left-hand activity sidebar.
3. Click the small **gear icon (Settings)** at the bottom-right corner of the Continue panel.
4. Select **YAML (`config.yaml`)** if prompted. Clear the file entirely, and paste the schema that matches your Phase 2 backend:

```yaml
name: Local Config
version: 1.0.0
schema: v1
models:
  - name: DeepSeek Coder
    provider: ollama
    model: deepseek-coder:6.7b
    roles: [chat, edit]
    capabilities: [tools]
  - name: Qwen Code Agent
    provider: ollama
    model: qwen2.5-coder:7b
    roles: [chat, edit]
    capabilities: [tools]
tabAutocompleteModel:
  title: DeepSeek Autocomplete
  provider: ollama
  model: deepseek-coder:6.7b
embeddingsProvider:
  provider: ollama
  model: nomic-embed-text
```
*(Note: If you ran Option B llama.cpp or Option C vLLM, change provider to `openai` and change the `apiBase` parameter to `http://localhost:8080/v1` or `http://localhost:8000/v1` respectively).*

5. Save the file (`Ctrl + S`), press `Ctrl + Shift + P`, type **Reload Window**, and hit Enter.

#### 🤖 Extension choice 2: Cline (Heavy Autonomous Agent Workflows)
1. Search for **Cline** in the marketplace and click **Install**.
2. Click the **Cline robot icon** in your left sidebar.
3. Click the **Gear Icon** at the top of the open Cline panel.
4. Fill in the settings form based on your Phase 2 choice:
   * **If using Ollama (Option A):** Provider: `Ollama` | Base URL: `http://localhost:11434` | Model ID: `qwen2.5-coder:7b` | Context: `16384`
   * **If using llama.cpp (Option B):** Provider: `OpenAI Compatible` | Base URL: `http://localhost:8080/v1` | Model ID: *Your model filename* | Context: `16384`
   * **If using vLLM (Option C):** Provider: `OpenAI Compatible` | Base URL: `http://localhost:8000/v1` | Model ID: `Qwen/Qwen2.5-Coder-7B-Instruct` | Context: `16384`
5. Scroll down to the bottom of the pane and click **Save**.

#### 🔌 Extension choice 3: twinny (Ultra-Fast Autocomplete)
1. Search for **twinny** in the marketplace and click **Install**.
2. Click the **twinny plug icon** in your sidebar.
3. Click the **Manage Providers (Plug/Gear icon)** inside the interface panel.
4. Set the parameters:
   * **For Ollama (Option A):** Type: `ollama` | Path: `/api/chat` | Host: `localhost:11434` | Model: `deepseek-coder:6.7b`
   * **For llama.cpp (Option B):** Type: `openai` | Path: `/v1/chat/completions` | Host: `localhost:8080`
   * **For vLLM (Option C):** Type: `openai` | Path: `/v1/chat/completions` | Host: `localhost:8000`

---

### Editor 2: Visual Studio Integration

Open **Visual Studio** (Community, Professional, or Enterprise) and choose **ONE** integration method below.

#### Method A: Hack Built-in GitHub Copilot (No Third-Party Extensions Needed)
You can trick the native Copilot UI into routing traffic through your local offline server engine instead of the cloud.

1. Close Visual Studio completely.
2. Open your Windows Search menu, type **Environment Variables**, and open the system dashboard.
3. Under the **User variables** section, click **New...** and enter:
   * **Variable Name:** `GITHUB_COPILOT_OVERRIDE_URL`
