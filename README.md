# HOF Manager

**HOF Manager** is a private Discord bot built to manage weekly donations, clan member tracking, and character roles for MIR4 communities. Designed with internal clan logistics in mind, this bot ensures donation transparency, member self-service, and leadership oversight — all while keeping the main character as the point of control.

![Banner](./assets/banner.png)

---

## 🔧 Features

- Track **weekly donations** per character (Main + Alts).
- **User-specific queries** to review donation history.
- **Main character enforcement**: only one main per user, alts are optional.
- **Main-switching support** with auto-promotion of an alt (if exists).
- Supports Discord **slash commands** for intuitive access.
- Weekly tagging format includes **WXX + month** (e.g., `W14 April`).
- Donation logs separated by tag and stored with full context.

---

## ⚙️ Slash Commands

| Command | Description |
|--------|-------------|
| `/donar` | Register a new donation for any character (main or alt). |
| `/historial` | View your own donation history for all linked characters. |
| `/cambiar-main` | Switch your main character (previous main is demoted). |
| `/verificar-parche` | Check latest patch note posted. *(Customizable)* |
| `/verificar-evento` | Check current events live. |
| `/verificar-noticia` | View latest news posted by the bot. |

> ⚠️ Only **main characters** are considered for weekly compliance tracking. Alts are optional and excluded from enforcement.

---

## 🧠 Logic Summary

- A Discord user may have:
  - **One main** character (tracked and enforced).
  - **Multiple alt** characters (optional).
- Users can register donations **even for characters not linked to them**, but they can **only query the history** of their own characters.
- **Switching main** updates internal references and disables the previous one.
- Donations are grouped by `WXX` week tag and optionally labeled with the **month name** for clarity.

---

## 🔐 Terms & Privacy

This bot is intended for **internal use** within closed MIR4 clan servers.  
No external data is collected or shared.

📄 [View Terms of Service and Privacy Policy](./HOF_Manager_Terms_and_Privacy.pdf)

---

## 🧱 Tech Stack

- Node.js / Python (depending on bot base)
- Discord.js or Pycord (slash command interface)
- Google Sheets / MongoDB / JSON (pluggable storage)
- Hosted via [Render](https://render.com) or similar free tier

---

## 🚀 Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/your-org/hof-manager.git
   cd hof-manager
