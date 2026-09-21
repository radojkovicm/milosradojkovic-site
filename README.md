# milosradojkovic.dev

Source for [milosradojkovic.dev](https://milosradojkovic.dev) — personal portfolio and blog of Miloš Radojković, Business Central developer and systems administrator.

The site runs on a self-hosted [Ghost](https://ghost.org) 6 instance. This repository contains the custom theme and routing configuration only. Content (posts, pages, settings, images) lives in Ghost's database and content volume, not here.

## Repository structure
└── build-theme.ps1 # Builds the upload zip into dist/
└── scripts/
├── routes.yaml # Ghost dynamic routing (posts at /{slug}/)
│ └── js/main.js
│ ├── css/style.css
│ └── assets/
│ ├── package.json # Theme metadata and version
│ ├── tag.hbs # Tag archive
│ ├── page-contact.hbs # /contact/
│ ├── page-experience.hbs # /experience/ — work history (content is in the template)
│ ├── page-blog.hbs # /blog/ — post listing
│ ├── page.hbs # Generic page (any page without its own template)
│ ├── post.hbs # Single blog post
│ ├── index.hbs # Homepage: hero, timeline, tech stack, latest posts
│ ├── default.hbs # Base layout: head, navigation, footer
├── theme/ # Ghost theme "milos-portfolio-theme"
milosradojkovic-site/

Experience and Contact content is hardcoded in their templates, so editing those pages means editing the theme, not the Ghost editor.

## Stack

| Layer | Technology |
|---|---|
| CMS | Ghost 6 (Docker image `ghost`) |
| Database | MySQL 8 (Docker) |
| Hosting | VPS, Docker, host-level nginx reverse proxy |
| DNS / CDN | Cloudflare |
| Theme | Handlebars, vanilla CSS and JavaScript, no build step |

## Deploying a theme change

1. Edit files in `theme/`.
2. Bump `version` in `theme/package.json`.
3. Build the zip:

```powershell
   powershell -ExecutionPolicy Bypass -File .\scripts\build-theme.ps1
```

   Output: `dist\milos-portfolio-theme.zip`.
4. Ghost Admin → **Settings → Design & branding → Change theme → Upload theme**, select the zip, confirm overwrite.
5. Commit and tag the release (see [Versioning](#versioning)).

**Keep the zip name exactly `milos-portfolio-theme.zip`.** Ghost uses the file name as the theme name. A different name (for example `milos-portfolio-theme-v1.2.0.zip`) installs a second, separate theme instead of updating the active one.

**Do not build the zip with `Compress-Archive` on Windows PowerShell 5.1.** It writes backslashes into entry paths, which Ghost does not unpack as folders. `build-theme.ps1` writes forward slashes.

## Updating routes

`routes.yaml` is uploaded separately from the theme: Ghost Admin → **Settings → Labs → Routes → Upload routes file**.

## Versioning

Theme versions follow `theme/package.json` and are tagged in git. To browse an older version on GitHub, open the branch dropdown (`main`) above the file list and switch to the **Tags** tab. Locally, `git tag` lists all versions and `git checkout v1.0.0` shows the theme exactly as it was in that version.

| Tag | Changes |
|---|---|
| `v1.0.0` | Initial theme as deployed in March 2026 |
| `v1.1.0` | Fixed blank blog posts (`post.hbs` missing `{{#post}}` context), rewrote `page.hbs` as a real generic template, replaced skill bars with grouped tags, updated Microsoft product names, removed contact form and QR code, removed dead code |

## Backups (not in this repository)

The database dump and Ghost content export are **never committed**. They contain password hashes, API keys, session secrets and member data. `.gitignore` blocks them.

They are stored outside git. To create a database dump on the server:

```bash
docker exec ghost-db sh -c 'exec mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" --all-databases' > ~/ghost-db-backup-$(date +%F).sql
```

The content export (JSON) is created in Ghost Admin → **Settings → Advanced → Import/Export → Export**.

## License

MIT
