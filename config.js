/* Public in the browser after deploy (e.g. GitHub Pages) — no server-side secrets */
window.WEDDING_CONFIG = {
  /** Full share link to the Google Drive folder */
  PHOTOS_DRIVE_URL:
    "https://drive.google.com/drive/folders/10D6sMjoK3-ROsRqb3uOvfs9YzaEDn_nE?usp=sharing",
  /**
   * Folder ID for the `id` query parameter (segment after /folders/ in the share URL).
   * Optional if the ID can be inferred from PHOTOS_DRIVE_URL.
   */
  PHOTOS_DRIVE_FOLDER_ID: "",
};
