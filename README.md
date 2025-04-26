# 🎮 HOF Manager Bot

**HOF Manager** is a private Discord bot designed to manage weekly donations, daily activity reminders, clan member tracking, and character roles for MIR4 communities. 
Built for serious clan logistics, it ensures transparency, structure, and leadership control. 🚀

---

## ✨ Key Features

- 📅 **Weekly Donations Tracking**: Monitor all main character donations per week.
- ⏰ **Daily Reminder**: Automatic DM reminders at 00:00 GMT-2 for those who haven't donated.
- 👑 **Leader Manual Reminder**: Leaders can manually send daily donation nudges.
- 🛡️ **Character Registration**: Members can self-register their Main and Alt characters.
- 📊 **Weekly Reports**: Generate detailed reports, list donations and missing players, export CSV.
- 🌎 **Multilingual Support**: All reminders sent in English, Spanish Latino, and Simplified Chinese.

---

## 🛠 Commands Overview

| Command            | Description |
|:-------------------|:------------|
| `/donation`         | Submit a gold donation record. |
| `/history-user`     | View your donation history across characters. |
| `/daily`            | (Leader only) Send a manual daily donation reminder. |
| `/report-week`      | Generate and export the current week's donation report. |
| `/register-char`    | Register your main or alt character and its associated clan. |

👉 Full command guide with examples in **English**, **Spanish**, and **Chinese**: [📄 Commands Guide](./COMMANDS_GUIDE.md)

---

## 📅 Weekly Period Definition

- Weeks are counted from **Sunday 00:00 AM** to **Saturday 11:59 PM** (server time GMT-2).
- Weekly labels follow:

```
Week ending DD - Month
```

✅ Example:

```
Week ending 26 - April
```

---

## 🔔 Daily Reminders

- 📬 Automatically sent at 00:00 GMT-2 if a main character hasn't donated.
- 📬 Leaders can send manual reminders via `/daily` command.
- 🌎 All messages are bilingual (EN, ES-LATAM, 中文简体).

---

## 🚀 Deployment Notes

**Environment Variables (.env):**
```
BOT_TOKEN=your_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here
```

**Required Node Modules:**
- `discord.js`
- `node-cron`
- `luxon`
- `@replit/database`
- `csv-writer`

---

# 🏁 Project Status

✅ Active development finished for MVP (Minimum Viable Product).
✅ Bot fully operational.
✅ Ready for internal clan deployment and scaling.

---

## 📄 Additional Documentation

For detailed command usage and examples, visit: [📚 Commands Guide](./COMMANDS_GUIDE.md)

---

_"Built for warriors. Managed by champions."_
