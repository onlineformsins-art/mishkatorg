# ⚖️ Mishkath Fara'id Streamlit App Setup & Integration Guide

Welcome to the deployment and configuration suite for the **Mishkath Fara'id Inheritance AI**! 

This repository contains the standalone, premium Python Streamlit application (`app.py`), which operates as a unified, state-of-the-art conversational engine to calculate inheritance portions and answer handbook-isolated questions natively.

---

## 📂 File Structure Overview

1. **`app.py`**: The core Streamlit application written in Python. It includes:
   - Gold & Charcoal brand styling synchronization.
   - Comprehensive Sunni Fara'id mathematical engine (Zawil Furud, Asabah, Hajib, Umariyyat, Aul, Radd).
   - Unified single-line natural language search router & statement parser (English & Tamil).
   - Dynamic `.docx` document reader and indexer.
2. **`requirements.txt`**: Declares necessary dependencies (`streamlit` and `python-docx`).
3. **`faqs.json`**: An externalized database containing the 19 core Islamic inheritance topics in both English and Tamil. This serves as the static search fallback.
4. **`Islamic Law of Inheritance.docx`**: The strict authority document (107KB) containing the handbook's text.
5. **`inheritance-ai.html`**: A static webpage template that embeds the Streamlit app into your main website in a full-height glassmorphic panel.
6. **`mishkath-theme/page-inheritance-ai.php`**: A custom WordPress page template to easily deploy the calculator in your WordPress theme.

---

## 💻 Part 1: Local Setup & Running

To run the Streamlit application on your local machine:

### 1. Prerequisites
Ensure you have Python 3.8+ installed on your computer.

### 2. Install Dependencies
Open your command terminal (PowerShell, Command Prompt, or terminal) in this folder and run:
```bash
pip install -r requirements.txt
```

### 3. Run the App
Launch the local development server:
```bash
streamlit run app.py
```
This will automatically compile the script and open the app in a new tab in your default web browser (usually at `http://localhost:8501`).

---

## ⚡ Part 2: How the Dynamic Knowledge Index Works

This app features a **zero-maintenance dynamic document indexer**:

1. **Docx Indexer**: At startup, `app.py` uses `python-docx` to read `Islamic Law of Inheritance.docx` paragraph-by-paragraph and dynamically indexes headings, definitions, and rulings.
2. **Updating Content**: If the Mishkath Research Institute publishes a new edition of the handbook, simply **overwrite the `Islamic Law of Inheritance.docx` file** in this directory. The Streamlit app will automatically re-index and serve answers based on the new text immediately upon reload!
3. **Modifying FAQs**: The 19 predefined topic-based answers (like EPF/ETF rules, Nominations, Wasiyya Wajiba) are fetched from `faqs.json`. You can open `faqs.json` in any text editor and easily edit the text or add new keyword strings without touching a single line of Python code.

---

## 🌐 Part 3: Deploying to Streamlit Community Cloud (Free Hosting)

To make the app live at your public URL (`https://inherit-vquqjrxrjzpxga9gsmswjn.streamlit.app/` or a custom sub-domain):

### 1. Upload to GitHub
1. Create a public or private repository on your GitHub account (e.g. `mishkath-faraid`).
2. Commit and push the following files to the main branch of your repo:
   - `app.py`
   - `requirements.txt`
   - `faqs.json`
   - `Islamic Law of Inheritance.docx`

### 2. Deploy on Streamlit Community Cloud
1. Visit [Streamlit Share](https://share.streamlit.io/) and log in with your GitHub account.
2. Click the **"New App"** button in the top-right corner.
3. Select your repository (`mishkath-faraid`), branch (`main`), and set the Main file path to **`app.py`**.
4. (Optional) Customise the app's URL slug to `inherit-vquqjrxrjzpxga9gsmswjn` or your preferred subdomain.
5. Click **"Deploy!"**. Your app will build and be live in less than 2 minutes.

---

## 🔌 Part 4: Integrating the App into Your Website (The Embeds)

We have built premium, gold-accented iframe layouts to display the Streamlit app seamlessly on your website.

### Integration Option A: Static HTML Website (`index.html`)
We have already added the links to your home navbar! To set up the calculator page:
1. Make sure `inheritance-ai.html` is in your website's public root folder.
2. In `inheritance-ai.html`, we embedded the iframe using `?embed=true`:
   ```html
   <iframe src="https://inherit-vquqjrxrjzpxga9gsmswjn.streamlit.app/?embed=true" title="Fara'id Inheritance AI App"></iframe>
   ```
   *Note: Adding `?embed=true` is a built-in Streamlit feature that automatically strips out the default Streamlit header, footer, and sidebar, making it appear natively integrated!*

### Integration Option B: Custom WordPress Theme (`mishkath-theme`)
We created a custom page template `page-inheritance-ai.php` inside the theme folder. To deploy it:
1. Upload the updated `mishkath-theme` folder to your WordPress `/wp-content/themes/` directory.
2. Go to your **WordPress Admin Panel** -> **Pages** -> **Add New**.
3. Set the Page Title to `Inheritance AI`.
4. In the right-hand **Page Attributes** sidebar panel, under **Template**, select **"Inheritance AI Template"**.
5. Set the page URL/slug to `inheritance-ai` so the navbar button links perfectly.
6. Click **Publish**. 
WordPress will automatically load the custom layout, drift the visual atmosphere orbs, and embed the Streamlit iframe seamlessly inside your site structure!
