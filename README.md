# GreenPath SME Copilot 🌿

![GreenPath Banner](./public/banner.png)
> *Note: Replace with your actual banner or dashboard screenshot*

**AI-Powered ESG Reporting & Sustainability Assistant for SMEs.**

[![Built with Gemini](https://img.shields.io/badge/Built%20with-Gemini-blueviolet)](https://deepmind.google/technologies/gemini/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📖 Overview

**GreenPath SME Copilot** bridges the "Sustainability Gap" for Small and Medium Enterprises. While regulations like CSRD and Scope 3 reporting are tightening, SMEs often lack the budget for expensive consultants.

GreenPath is an intelligent SaaS assistant that guides businesses from **zero to a full ESG report**. It automates data collection, extracts evidence from raw documents using AI, and generates compliant sustainability reports with actionable reduction strategies.

## 🤖 How We Built It with Gemini

This project is powered entirely by the **Google Gemini API**. We leverage its multimodal and reasoning capabilities to solve the hardest parts of ESG reporting:

1.  **Multimodal Evidence Extraction**
    * Users upload raw utility bills, fuel invoices, or policy documents (PDF/Images).
    * Gemini Vision analyzes the files, identifies the document type, and extracts key data points (e.g., "1,500 kWh electricity") with >95% accuracy, populating the assessment automatically.

2.  **Context-Aware Copilot**
    * Our "Ask Copilot" chat isn't just a generic bot. It knows exactly which assessment field the user is working on (e.g., "Scope 1 Emissions").
    * It helps non-experts understand complex regulations, converts units (e.g., "gallons to liters"), and validates data anomalies in real-time.

3.  **Generative Reporting & Strategy**
    * Gemini synthesizes the collected quantitative data to write the qualitative sections of the final Sustainability Report.
    * It generates a tailored **Action Plan**, prioritizing reduction strategies based on the user's specific emission hotspots (e.g., "Switch to LED lighting" if electricity usage is high).

## ✨ Key Features

* **📊 Executive Dashboard:** Real-time visualization of ESG Scores and GHG Emission trends.
* **📝 Interactive Assessment:** Step-by-step questionnaires for Environment, Social, and Governance metrics.
* **📂 Evidence Library:** Drag-and-drop document upload with AI-powered OCR and data extraction.
* **💬 Intelligent Copilot:** An always-on assistant that answers regulatory questions and guides data entry.
* **📉 Automated Reporting:** One-click generation of professional sustainability reports with visualizations.

## 🛠️ Tech Stack

* **Frontend:** React (TypeScript), Vite
* **Styling:** Tailwind CSS, Lucide React (Icons)
* **AI Integration:** Google Gemini API (via Google AI Studio)
* **Visualization:** Recharts
* **State Management:** React Context API

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
* Node.js (v16 or higher)
* npm or yarn
* A [Google AI Studio](https://aistudio.google.com/) API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/greenpath-sme-copilot.git](https://github.com/yourusername/greenpath-sme-copilot.git)
    cd greenpath-sme-copilot
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add your Gemini API Key:
    ```env
    VITE_GEMINI_API_KEY=your_actual_api_key_here
    ```

4.  **Run the application**
    ```bash
    npm run dev
    ```

5.  Open your browser to `http://localhost:5173` (or the port shown in your terminal).

## 📸 Screen Showcase

| Dashboard | Copilot Chat |
|:---:|:---:|
| ![Dashboard](./screenshots/dashboard.png) | ![Copilot](./screenshots/copilot.png) |

| Evidence Extraction | Final Report |
|:---:|:---:|
| ![Evidence](./screenshots/evidence.png) | ![Report](./screenshots/report.png) |

## 👥 The Team

* **Nguyen Viet Dat** - Lead Developer & AI Integration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Built for the Google Gemini API Developer Competition.*
