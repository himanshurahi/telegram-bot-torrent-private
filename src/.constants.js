module.exports = Object.freeze({
  TOKEN: '1036199133:AAFFzcQGcnCqDiYFz8YYz6UcXBitjY2a4nw', //required
  ARIA_SECRET: 'bhadoo', //change as per needs.
  ARIA_DOWNLOAD_LOCATION: '/app/downloads/', //-leave as it is
  INDEX_DOMAIN: 'https://drive.himanshurahi.workers.dev/0:/uploadbot/', // replace with your index domain. use https://github.com/ParveenBhadooOfficial/go-drive
  ARIA_DOWNLOAD_LOCATION_ROOT: '/', //The mountpoint that contains ARIA_DOWNLOAD_LOCATION -leave as it is
  ARIA_FILTERED_DOMAINS: [], // Prevent downloading from URLs containing these substrings -leave as it is
  ARIA_FILTERED_FILENAMES: [], // Files/top level directories with these substrings in the filename won't be downloaded -leave as it is
  ARIA_PORT: 8210, // Port for aria2c RPC server, if you change this here, make sure to update aria.sh as well -leave as it is
  GDRIVE_PARENT_DIR_ID:  '1Y4ht074Qy7-UKNEZrizhp4C4fSReEBjD', // for directorty eg. https://drive.google.com/drive/folders/1p7pHhSh2yboWePmo53DnVr3xkAYiojP9 use 1p7pHhSh2yboWePmo53DnVr3xkAYiojP9
  SUDO_USERS: [711100725],	// Telegram user IDs. These users can use the bot in any chat. required, get it using https://t.me/YourTGid_Bot
  AUTHORIZED_CHATS: [-1001396180922],	// Telegram chat IDs. Anyone in these chats can use the bot. Add https://t.me/YourTGid_Bot to Group and click /id
  STATUS_UPDATE_INTERVAL_MS: 12000, // A smaller number will update faster, but might cause rate limiting -leave as it is
  API_LINK : "https://torrent-drive-api.herokuapp.com", //added By Himanshu Rahi
  DRIVE_FILE_PRIVATE: {
    ENABLED: false,
    EMAILS: ['1@gmail.com', '2@gmail.com']
  }, // not required
  DOWNLOAD_NOTIFY_TARGET: {  // Information about the web service to notify on download completion. not required
    enabled: false,   // Set this to true to use the notify functionality
    host: 'domain here',
    port: 80,
    path: '/botNotify'
  },
    COMMANDS_USE_BOT_NAME: {
      ENABLED: true,  // If true, all commands except '/list' has to have the bot username after the command.
      NAME: "@TorrentDriveHRBot" //Enter your Bot Username here if above is set to true.
    }
});

// Modified By Himanshu Rahi
