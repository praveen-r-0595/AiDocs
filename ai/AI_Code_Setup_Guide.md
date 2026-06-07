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

#### Method A: Override GitHub Copilot with Local Backend
Route the native Copilot UI through your local offline server instead of the cloud.

1. Close Visual Studio completely.
2. Open your Windows Search menu, type **Environment Variables**, and open the system dashboard.
3. Under the **User variables** section, click **New...** and enter:
   * **Variable Name:** `GITHUB_COPILOT_OVERRIDE_URL`
   * **Variable Value:** `http://localhost:11434` (if using Ollama) OR `http://localhost:8080` (if using llama.cpp) OR `http://localhost:8000` (if using vLLM)
4. Click **OK**, then **OK** again to close the environment variables dialog.
5. Restart Visual Studio. The built-in Copilot should now route requests to your local server.
6. Test: Open a code file and press `Ctrl + Alt + \` to trigger inline completions. Check the output panel for connection logs.

#### Method B: Install Third-Party Local Extensions
If Method A doesn't work or you prefer explicit configuration:

1. Open Visual Studio and go to **Extensions → Manage Extensions**.
2. Search for **twinny** and click **Download**.
3. Follow the installation wizard, then restart Visual Studio.
4. Once twinny loads, click the twinny icon in your left sidebar.
5. Configure the provider:
   * **For Ollama:** Type: `ollama` | Port: `11434` | Model: `qwen2.5-coder:7b`
   * **For llama.cpp:** Type: `openai` | Port: `8080` | Path: `/v1/chat/completions`
   * **For vLLM:** Type: `openai` | Port: `8000` | Path: `/v1/chat/completions`
6. Test the connection by typing a code comment and observing auto-suggestions.

---

---

## Phase 4: Optimization & Troubleshooting

### ⚡ Performance Optimization Tips

#### 1. **Reduce Model Context Windows**
Larger context sizes consume more VRAM and slow inference. Adjust based on your hardware:
```bash
# llama.cpp: Reduce context from 16384 to 4096
llama-server --model your-model.gguf --port 8080 --ctx-size 4096 --threads 8

# vLLM: Similar adjustment
vllm serve Qwen/Qwen2.5-Coder-7B-Instruct --port 8000 --max-model-len 4096
```

#### 2. **Offload Layers to GPU (Improve Speed)**
If you have a compatible GPU, enable offloading:
```bash
# llama.cpp with GPU support
llama-server --model your-model.gguf --port 8080 --gpu-layers 32

# vLLM (automatically uses CUDA if available)
vllm serve Qwen/Qwen2.5-Coder-7B-Instruct --port 8000 --gpu-memory-utilization 0.9
```

#### 3. **Use Quantized Models for Speed**
Always prefer quantized models (`.gguf` files) over full-precision versions:
- `q4_k_m.gguf` — Excellent quality-to-speed ratio (recommended)
- `q8_0.gguf` — Higher quality, slower
- `q3_k_m.gguf` — Faster, lower quality

#### 4. **Cache Embeddings for RAG Systems**
When using embeddings (e.g., `nomic-embed-text`), pre-compute and cache embeddings to avoid recomputation:
```bash
# Ollama embeddings are cached automatically
ollama pull nomic-embed-text
```

#### 5. **Monitor System Resources**
Watch for memory thrashing or excessive CPU load:
- **Windows:** Open Task Manager (`Ctrl + Shift + Esc`) → Performance tab
- **macOS:** Open Activity Monitor (`Cmd + Space`, search "Activity Monitor")
- **Linux:** Run `top` or `nvidia-smi` (for GPU stats)

### 🐛 Common Troubleshooting

#### Issue: "Connection Refused" on `localhost:11434` or `localhost:8080`
**Solution:** Ensure your backend service is running:
```bash
# For Ollama, check the system tray or verify in browser:
# Visit http://localhost:11434 directly

# For llama.cpp, restart the server:
llama-server --model your-model.gguf --port 8080 --ctx-size 16384 --threads 8

# For vLLM, restart the service:
vllm serve Qwen/Qwen2.5-Coder-7B-Instruct --port 8000
```

#### Issue: Generation is Extremely Slow
**Solution:** 
1. Check if your model is running on CPU instead of GPU. Enable GPU acceleration.
2. Reduce context window size (see Tip #1 above).
3. Use a smaller model (e.g., 7B instead of 70B).
4. Check system resources—close memory-heavy applications.

#### Issue: Out of Memory (OOM) Errors
**Solution:**
1. Reduce context window (`--ctx-size 4096` or lower).
2. Reduce batch size or offload layers.
3. Use a smaller model that fits your VRAM.
4. Enable CPU offloading (slower but uses system RAM instead of VRAM).

#### Issue: Extension Can't Connect to Local Backend
**Solution:**
1. Verify the backend is running and listening on the correct port.
2. Check firewall settings—allow local loopback connections.
3. Ensure the correct URL is configured in your extension settings.
4. Restart the IDE and backend service.
5. Check backend logs for detailed error messages.

#### Issue: Model Downloads Fail (Network Error)
**Solution:**
1. Check internet connection.
2. Use a VPN or proxy if behind a firewall.
3. For Ollama, manually download from Hugging Face and place in `~/.ollama/models/`.
4. For llama.cpp, download `.gguf` files manually from Hugging Face and place in your model directory.

#### Issue: IDE Autocomplete is Too Slow or Laggy
**Solution:**
1. Disable aggressive autocomplete settings in your extension.
2. Increase generation timeout in extension settings.
3. Use a faster, smaller model (e.g., Phi-3-mini).
4. Ensure sufficient RAM is available on your system.

#### Issue: Generated Code Quality is Poor
**Solution:**
1. Use a larger or more specialized model (e.g., Qwen2.5-Coder-32B or DeepSeek-Coder).
2. Provide better context (longer code snippets before the insertion point).
3. Use a model designed for your specific task (e.g., DeepSeek-R1 for reasoning).
4. Adjust temperature and top-p settings in extension config (lower = more deterministic).

### 🔐 Security Considerations

1. **Local-Only Binding:** Ensure your backend only listens on `127.0.0.1`:
   ```bash
   # llama.cpp (default is local-only)
   llama-server --model your-model.gguf --port 8080
   ```

2. **No Data Leaves Your Machine:** Verify that your IDE extensions are not sending requests to cloud endpoints.

3. **Firewall Rules:** Configure your firewall to block external access to your inference ports.

4. **Secure Model Storage:** Keep your `~/.ollama/models/` directory secure and ensure proper file permissions.

### 📊 Resource Monitoring Commands

**Linux/macOS:**
```bash
# Monitor CPU and GPU usage
watch -n 1 nvidia-smi  # GPU stats (NVIDIA)
top -p $(pgrep -f ollama)  # CPU stats for Ollama process

# Monitor memory usage
free -h
```

**Windows (PowerShell):**
```powershell
# Check GPU usage (NVIDIA)
nvidia-smi

# Monitor process memory
Get-Process | Where-Object {$_.Name -like "*ollama*"} | Format-Table Name, WorkingSet
```

---

## Appendix A: Recommended Open Source Models Repository

If the models mentioned in Phase 2 are unavailable or you wish to explore alternative open-source models, this appendix provides a curated list of high-quality, fully open-weight models suitable for local development.

### 📦 Code-Specific Models (Recommended for Development)

These models are optimized specifically for code generation, completion, and debugging tasks.

| Model Name | Size | Best For | Download Source |
|-----------|------|----------|-----------------|
| **Qwen2.5-Coder** | 7B, 32B | Code generation, chat, reasoning | [Hugging Face](https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct) |
| **DeepSeek-Coder** | 1.3B–33B | Fast autocomplete to deep reasoning | [Hugging Face](https://huggingface.co/deepseek-ai/deepseek-coder-6.7b-instruct) |
| **Codestral** | 22B | Enterprise-grade code tasks | [Hugging Face](https://huggingface.co/mistralai/Codestral-22B-v0.1) |
| **Mistral Nemo** | 12B | Balanced speed and capability | [Hugging Face](https://huggingface.co/mistralai/Mistral-Nemo-Instruct-2407) |
| **Phi-3.5-mini** | 3.8B | Ultra-lightweight for weak hardware | [Hugging Face](https://huggingface.co/microsoft/Phi-3.5-mini-instruct) |
| **StarCoder2** | 3B–15B | GitHub-trained code model | [Hugging Face](https://huggingface.co/bigcode/starcoder2-15b) |

### 🧠 General-Purpose Models (Multi-Task)

These models handle both code and general conversation with excellent quality.

| Model Name | Size | Best For | Download Source |
|-----------|------|----------|-----------------|
| **Llama 3.2** | 1B–90B | Balanced quality across domains | [Meta](https://www.meta.com/llama/llama-downloads/) |
| **Llama 3.1** | 8B, 70B | High-quality reasoning and coding | [Meta](https://www.meta.com/llama/llama-downloads/) |
| **Mistral 7B** | 7B | Fast, capable general-purpose model | [Hugging Face](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2) |
| **Gemma 2** | 9B–27B | Google's lightweight powerhouse | [Hugging Face](https://huggingface.co/google/gemma-2-9b-it) |
| **Qwen 2.5** | 0.5B–72B | Chinese-optimized, excellent reasoning | [Hugging Face](https://huggingface.co/Qwen/Qwen2.5-7B-Instruct) |

### 🏃 Lightweight Models (For Resource-Constrained Hardware)

Use these for machines with <8GB RAM or older GPUs with <4GB VRAM.

| Model Name | Parameters | Ram Requirement | Source |
|-----------|-----------|-----------------|--------|
| **Phi-3-mini** | 3.8B | 4GB | [Microsoft](https://huggingface.co/microsoft/Phi-3-mini-4k-instruct) |
| **TinyLlama** | 1.1B | 2GB | [Hugging Face](https://huggingface.co/TinyLlama/TinyLlama-1.1B-Chat-v1.0) |
| **Qwen2.5 0.5B** | 500M | 1GB | [Hugging Face](https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct) |
| **Stablelm-2-Zephyr** | 1.6B | 2GB | [Hugging Face](https://huggingface.co/stabilityai/stablelm-2-zephyr-1_6b) |

### 🚀 High-Performance Models (For Power Workstations)

Use these on machines with 32GB+ RAM or 16GB+ VRAM for superior quality and reasoning.

| Model Name | Size | Advantages | Download Source |
|-----------|------|-----------|-----------------|
| **Qwen2.5-72B** | 72B | State-of-the-art reasoning | [Hugging Face](https://huggingface.co/Qwen/Qwen2.5-72B-Instruct) |
| **Llama 3.1–70B** | 70B | Excellent code + general tasks | [Meta](https://www.meta.com/llama/llama-downloads/) |
| **Mistral Large** | 123B | Enterprise-grade reasoning | [Hugging Face](https://huggingface.co/mistralai/Mistral-Large) |
| **DeepSeek-V3** | 671B | Cutting-edge multi-modal reasoning *(Requires 80GB+ VRAM)* | [Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-V3) |

### 🧬 Specialized Models (Domain-Specific Tasks)

| Model Name | Specialization | Source |
|-----------|-----------------|--------|
| **DeepSeek-R1** | Deep Reasoning & Complex Problem-Solving | [Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-R1) |
| **Neural-Chat** | Conversational Intelligence | [Hugging Face](https://huggingface.co/Intel/neural-chat-7b-v3-3) |
| **OpenHermes** | Multi-task instruction following | [Hugging Face](https://huggingface.co/teknium/OpenHermes-2.5-Mistral-7B) |
| **Nomic-Embed-Text** | Vector embeddings (RAG systems) | [Hugging Face](https://huggingface.co/nomic-ai/nomic-embed-text-v1-5) |

### ⚙️ How to Download and Use These Models

#### Via Ollama:
```bash
ollama pull qwen2.5-coder:7b
ollama pull llama2:7b
ollama pull mistral:7b
```
Find all available models at [ollama.com/library](https://ollama.com/library).

#### Via Hugging Face (for llama.cpp):
1. Visit [huggingface.co](https://huggingface.co) and search for your chosen model.
2. Look for **GGUF** quantized versions (files ending in `.gguf`).
3. Download a medium quantization (e.g., `q4_k_m.gguf` for balance) or high quantization (e.g., `q8_0.gguf` for quality).
4. Place the file in your `~/local-ai-models/gguf-vault/` directory.
5. Reference the model in your llama-server command (see Phase 2B.4).

#### Via Hugging Face (for vLLM):
```bash
vllm serve Qwen/Qwen2.5-Coder-7B-Instruct --port 8000 --max-model-len 16384 --trust-remote-code
```
Replace the model name with any hugging face repo ID.

### 📊 Quick Selection Guide

- **🥉 8–16GB RAM/VRAM:** Phi-3.5-mini, TinyLlama, Qwen2.5-Coder-7B
- **🥈 16–32GB RAM/VRAM:** Qwen2.5-Coder-32B, Mistral 7B, Llama 3.2–8B
- **🥇 32GB+ RAM/VRAM:** Qwen2.5-72B, Llama 3.1–70B, Mistral Large

### 🎯 When to Use Which Model

Choose your model based on your specific use case:

#### **For Pure Code Generation & Completion**
Use these if you primarily write code and want specialized capabilities:
- **Best:** Qwen2.5-Coder (7B/32B) — Excellent code reasoning and generation
- **Alternative:** DeepSeek-Coder (6.7B–33B) — Fast, code-focused, very reliable
- **Ultra-lightweight:** Phi-3.5-mini (3.8B) — Good for weak hardware, still decent code quality
- **When:** You spend 80%+ of your time writing/debugging code

#### **For General Conversation + Coding**
Use these for mixed workloads (chat, writing, coding equally):
- **Best:** Llama 3.2–8B or Mistral 7B — Excellent all-rounder
- **High-end:** Llama 3.1–70B — Near-expert level across all domains
- **Lightweight:** Gemma 2–9B — Google's efficient powerhouse
- **When:** You need flexibility across different task types

#### **For Complex Reasoning & Debugging**
Use these for problem-solving, system design, and debugging:
- **Best:** DeepSeek-R1 (7B–671B) — Specialized for deep reasoning
- **Alternative:** Qwen2.5-72B — Strong reasoning with code capability
- **When:** You're debugging complex bugs or designing systems

#### **For Embedding & RAG (Retrieval-Augmented Generation)**
Use for semantic search and context retrieval:
- **Only option:** Nomic-Embed-Text — Lightweight, efficient embeddings
- **When:** Building RAG systems or semantic search features

#### **For Ultra-Low Resource Hardware (<4GB RAM)**
Use on old laptops or weak devices:
- **Best:** TinyLlama (1.1B) — Minimal but functional
- **Alternative:** Qwen2.5–0.5B — Smallest usable model
- **When:** On a decade-old laptop or Raspberry Pi

#### **For Enterprise/Production (Power Workstations)**
Use if you have 32GB+ RAM or 16GB+ VRAM:
- **Best Quality:** Qwen2.5–72B or Llama 3.1–70B
- **Specialized:** DeepSeek-R1–671B (if you have 80GB+ VRAM)
- **High Throughput:** Use vLLM backend with any large model
- **When:** Running production services or demanding tasks

#### **Quick Decision Tree**

```
Do I have <4GB RAM?
├─ YES → Use TinyLlama or Qwen2.5-0.5B
└─ NO → Continue

Do I have 4–8GB RAM?
├─ YES → Use Phi-3.5-mini or Qwen2.5-Coder-7B
└─ NO → Continue

Do I have 16–32GB RAM?
├─ YES → Use Qwen2.5-Coder-32B, Llama 3.2-8B, or Mistral 7B
└─ NO → Continue

Do I have 32GB+ RAM?
├─ YES → Use Qwen2.5-72B, Llama 3.1-70B, or Mistral Large
└─ NO → Upgrade hardware!

Next: What do you primarily do?
├─ Code only → Use Qwen2.5-Coder or DeepSeek-Coder (same size tier)
├─ Mixed (code + chat) → Use Llama 3.2, Mistral, or Gemma 2
├─ Deep reasoning/debugging → Use DeepSeek-R1 or Qwen2.5 (high-end)
└─ Embeddings/search → Use Nomic-Embed-Text
```

#### **Model Comparison Matrix**

| Use Case | Best | Why | Size | Speed |
|----------|------|-----|------|-------|
| **Lightweight coding** | Phi-3.5-mini | Tiny but smart | 3.8B | ⚡⚡⚡⚡⚡ |
| **General coding** | Qwen2.5-Coder-7B | Balanced power | 7B | ⚡⚡⚡⚡ |
| **Expert coding** | Qwen2.5-Coder-32B | Deep understanding | 32B | ⚡⚡⚡ |
| **Code + Chat** | Llama 3.2–8B | Most versatile | 8B | ⚡⚡⚡⚡ |
| **All-rounder** | Mistral 7B | Fastest 7B model | 7B | ⚡⚡⚡⚡⚡ |
| **High-end all-purpose** | Llama 3.1–70B | Expert quality | 70B | ⚡⚡ |
| **Complex reasoning** | DeepSeek-R1-7B | Thinks deeply | 7B–671B | ⚡⚡ |
| **Embeddings** | Nomic-Embed-Text | Semantic search | Small | ⚡⚡⚡⚡⚡ |
| **Minimum viable** | TinyLlama | Can't go smaller | 1.1B | ⚡⚡⚡⚡⚡ |

---

## Appendix B: Reference Directories

### 🎯 Inference Engines Reference

| Engine | Type | Best For | Setup Complexity | GPU Support | Memory Efficiency |
|--------|------|----------|-----------------|-------------|-------------------|
| **Ollama** | System Service | Beginners, all hardware | ⭐ (Easiest) | ✅ Automatic | ⭐⭐⭐ High |
| **llama.cpp** | Standalone Binary | Bare-metal efficiency | ⭐⭐ (Moderate) | ✅ Manual | ⭐⭐⭐⭐ Very High |
| **vLLM** | Python Framework | High throughput, batching | ⭐⭐⭐ (Hard) | ✅ NVIDIA CUDA | ⭐⭐ Moderate |
| **LM Studio** | GUI Application | Desktop users, simplicity | ⭐ (Easiest) | ✅ Automatic | ⭐⭐ Low |
| **GPT4All** | Desktop App | Entry-level, zero config | ⭐ (Easiest) | ⚠️ Limited | ⭐ Low |
| **Hugging Face Transformers** | Python Library | Research, custom pipelines | ⭐⭐⭐ (Hard) | ✅ Manual | ⭐⭐ Moderate |

### 🧠 AI Agent Frameworks & Tools

For autonomous task execution and advanced reasoning workflows:

| Framework | Purpose | Language | Integrations | Complexity |
|-----------|---------|----------|--------------|-----------|
| **CrewAI** | Multi-agent orchestration | Python | Ollama, OpenAI, Anthropic | ⭐⭐⭐ |
| **LangChain** | LLM chaining & RAG | Python/JS | All major providers | ⭐⭐⭐ |
| **AutoGen (Microsoft)** | Collaborative agents | Python | OpenAI, local LLMs | ⭐⭐⭐ |
| **Ollama API** | Direct model access | REST API | Language-agnostic | ⭐ |
| **Continue.dev** | IDE-integrated agent | TypeScript/Python | Ollama, OpenAI, local | ⭐⭐ |
| **Cline** | Autonomous code agent | TypeScript | Ollama, OpenAI, Anthropic | ⭐⭐ |

### 📂 Recommended Directory Structure

```
~/local-ai-setup/
├── models/
│   ├── ollama/
│   │   └── (Ollama manages this automatically)
│   └── gguf-vault/
│       ├── qwen2.5-coder-7b-q4_k_m.gguf
│       ├── deepseek-coder-6.7b-q4_k_m.gguf
│       └── nomic-embed-text-v1.5.gguf
├── venv-llama/
│   └── (llama.cpp environment, if using Python wrapper)
├── venv-vllm/
│   └── (vLLM Python environment)
├── configs/
│   ├── continue-config.yaml
│   ├── cline-settings.json
│   └── twinny-config.json
└── logs/
    ├── ollama.log
    ├── llama-server.log
    └── vllm.log
```

### 🔗 Quick Links & Resources

**Official Websites:**
- **Ollama:** https://ollama.com
- **llama.cpp:** https://github.com/ggerganov/llama.cpp
- **vLLM:** https://docs.vllm.ai/en/latest/
- **LM Studio:** https://lmstudio.ai
- **GPT4All:** https://gpt4all.io

**Model Repositories:**
- **Hugging Face:** https://huggingface.co
- **Ollama Library:** https://ollama.com/library
- **GGUF Models:** https://huggingface.co/models?search=gguf

**IDE Extensions:**
- **Continue:** https://continue.dev
- **Cline:** https://github.com/cline/cline
- **twinny:** https://github.com/rjmacarthy/twinny

**Community & Support:**
- **Ollama GitHub:** https://github.com/ollama/ollama
- **llama.cpp Discussions:** https://github.com/ggerganov/llama.cpp/discussions
- **Hugging Face Community:** https://huggingface.co/docs/hub/discussions

### 🎓 Learning Resources

- **Local LLM Setup:** https://huggingface.co/docs/transformers/installation
- **Ollama Documentation:** https://github.com/ollama/ollama/blob/main/README.md
- **LangChain with Local LLMs:** https://python.langchain.com/docs/guides/local_llms/
- **RAG with Open Source:** https://huggingface.co/blog/retrieval-augmented-generation

---

## Final Checklist

Before you start using your local AI setup, verify all components are properly configured:

- [ ] **Phase 1:** Hardware assessed and model size chosen
- [ ] **Phase 2:** Backend service (Ollama/llama.cpp/vLLM) installed and running
- [ ] **Phase 2:** Models downloaded and verified working
- [ ] **Phase 3:** IDE extension installed and configured
- [ ] **Phase 3:** Backend connection tested (generation working in IDE)
- [ ] **Phase 4:** Performance optimized (context size, GPU layers adjusted)
- [ ] **Appendix A:** Explored alternative models if needed
- [ ] **Appendix B:** Bookmarked useful links and reference materials

---

## Support & Feedback

If you encounter issues not covered in Phase 4 troubleshooting:

1. **Check Logs:** Review backend service logs for detailed error messages.
2. **Consult GitHub Issues:** Search existing issues on Ollama, llama.cpp, or vLLM repos.
3. **Community Forums:** Ask in Hugging Face community discussions or Discord servers.
4. **Test Directly:** Use `curl` to test your backend directly:
   ```bash
   curl -X POST http://localhost:11434/api/chat -d '{
     "model": "qwen2.5-coder:7b",
     "messages": [{"role": "user", "content": "Hello"}],
     "stream": false
   }'
   ```

---

**Happy coding with your private, offline AI assistant! 🚀**
